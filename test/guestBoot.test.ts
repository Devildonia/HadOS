import { describe, it, expect, vi } from 'vitest';
import { IFRAME_CONNECT_TYPE } from '../js/core/ipc/protocol';

const mockRuntime = {
    on: vi.fn().mockImplementation(function(this: any) { return this; }),
    syscall: vi.fn(),
    start: vi.fn()
};
const mockCreatePortRuntime = vi.fn().mockReturnValue(mockRuntime);

vi.mock('../js/sdk/appRuntime', () => {
    return {
        createPortRuntime: mockCreatePortRuntime
    };
});

describe('guestBoot', () => {
    it('should initialize and process parent handshakes correctly', async () => {
        let capturedHandler: any;
        const addSpy = vi.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
            if (event === 'message') {
                capturedHandler = handler;
            }
        });

        // First and only import of guestBoot to execute top-level listener registration and capture the handler
        await import('../js/sdk/guestBoot');

        expect(addSpy).toHaveBeenCalledWith('message', expect.any(Function));
        expect(capturedHandler).toBeDefined();

        // Define a stable parent reference to bypass JSDOM proxy wrapping issues
        const dummyParent = { postMessage: vi.fn() };
        Object.defineProperty(window, 'parent', {
            value: dummyParent,
            writable: true,
            configurable: true
        });

        // Test 1: should ignore message events from non-parent source
        const event1 = {
            source: {},
            data: { type: IFRAME_CONNECT_TYPE },
            ports: []
        } as any;
        capturedHandler(event1);
        expect(mockCreatePortRuntime).not.toHaveBeenCalled();

        // Test 2: should ignore message events with wrong data type
        const event2 = {
            source: dummyParent,
            data: { type: 'wrong-type' },
            ports: []
        } as any;
        capturedHandler(event2);
        expect(mockCreatePortRuntime).not.toHaveBeenCalled();

        // Test 3: should initialize PortRuntime and wire handlers on correct parent handshake
        const mockPort = {} as any;
        const event3 = {
            source: dummyParent,
            data: { type: IFRAME_CONNECT_TYPE },
            ports: [mockPort]
        } as any;
        capturedHandler(event3);

        expect(mockCreatePortRuntime).toHaveBeenCalledWith(mockPort);
        expect(mockRuntime.on).toHaveBeenCalledWith('echo', expect.any(Function));
        expect(mockRuntime.on).toHaveBeenCalledWith('reverse', expect.any(Function));
        expect(mockRuntime.on).toHaveBeenCalledWith('save', expect.any(Function));
        expect(mockRuntime.start).toHaveBeenCalled();

        // Check reverse callback logic
        const reverseCallback = mockRuntime.on.mock.calls.find((call: any) => call[0] === 'reverse')![1];
        expect(reverseCallback('hello')).toBe('olleh');
    });
});
