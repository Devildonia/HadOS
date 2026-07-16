import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Services } from '../js/core/ServiceContainer';
import { ShaderWallpaper } from '../js/ui/ShaderWallpaper';

describe('ShaderWallpaper', () => {
    let mockGL: any;
    let canvas: HTMLCanvasElement;

    beforeEach(() => {
        (Services as any).__reset();

        // Mock DOM
        document.body.innerHTML = '<canvas id="shader-bg"></canvas>';
        canvas = document.getElementById('shader-bg') as HTMLCanvasElement;

        // Mock WebGL Context
        mockGL = {
            createShader: vi.fn(() => ({})),
            shaderSource: vi.fn(),
            compileShader: vi.fn(),
            getShaderParameter: vi.fn(() => true), // default to compile success
            getShaderInfoLog: vi.fn(() => ''),
            deleteShader: vi.fn(),
            deleteProgram: vi.fn(),
            deleteTexture: vi.fn(),
            deleteFramebuffer: vi.fn(),
            createProgram: vi.fn(() => ({})),
            attachShader: vi.fn(),
            linkProgram: vi.fn(),
            getProgramParameter: vi.fn(() => true), // default to link success
            getProgramInfoLog: vi.fn(() => ''),
            getAttribLocation: vi.fn(() => 1),
            getUniformLocation: vi.fn(() => ({})),
            createTexture: vi.fn(),
            bindTexture: vi.fn(),
            texImage2D: vi.fn(),
            texParameteri: vi.fn(),
            createFramebuffer: vi.fn(),
            bindFramebuffer: vi.fn(),
            framebufferTexture2D: vi.fn(),
            enableVertexAttribArray: vi.fn(),
            bindBuffer: vi.fn(),
            vertexAttribPointer: vi.fn(),
            useProgram: vi.fn(),
            uniform2f: vi.fn(),
            uniform1f: vi.fn(),
            uniform1i: vi.fn(),
            activeTexture: vi.fn(),
            drawArrays: vi.fn(),
            viewport: vi.fn(),
            createBuffer: vi.fn(() => ({})),
            bufferData: vi.fn(),
            getExtension: vi.fn(),
            canvas: canvas,
            VERTEX_SHADER: 35633,
            FRAGMENT_SHADER: 35632,
            COMPILE_STATUS: 35713,
            LINK_STATUS: 35714,
            TEXTURE_2D: 3553,
            RGBA: 6408,
            UNSIGNED_BYTE: 5121,
            TEXTURE_MIN_FILTER: 10241,
            TEXTURE_MAG_FILTER: 10240,
            LINEAR: 9729,
            TEXTURE_WRAP_S: 10242,
            TEXTURE_WRAP_T: 10243,
            CLAMP_TO_EDGE: 33071,
            FRAMEBUFFER: 36160,
            COLOR_ATTACHMENT0: 36064,
            ARRAY_BUFFER: 34962,
            STATIC_DRAW: 35044,
            FLOAT: 5126,
            TRIANGLES: 4,
            TEXTURE0: 33984
        };

        // Stub getContext to return our mock
        canvas.getContext = vi.fn((type: string) => {
            if (type === 'webgl' || type === 'experimental-webgl') {
                return mockGL;
            }
            return null;
        }) as any;

        // Mock requestAnimationFrame and cancelAnimationFrame
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => setTimeout(cb, 16) as any);
        vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(clearTimeout as any);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        document.body.innerHTML = '';
    });

    it('should register itself with the ServiceContainer', () => {
        // Re-simulate bootloader registration since we reset services
        Services.register('ShaderWallpaper', ShaderWallpaper as any);
        const sw = Services.get('ShaderWallpaper') as any;
        expect(sw).toBeDefined();
        expect(typeof sw.init).toBe('function');
    });

    it('should initialize and request WebGL context', () => {
        ShaderWallpaper.init('shader-bg');

        expect(canvas.getContext).toHaveBeenCalledWith('webgl', expect.any(Object));
        expect(mockGL.createBuffer).toHaveBeenCalled(); // position buffer setup
    });

    it('should fail gracefully if canvas is missing', () => {
        document.body.innerHTML = ''; // removed canvas
        const loggerSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        ShaderWallpaper.init('shader-bg');
        expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('not found'), 'shader-bg');
        loggerSpy.mockRestore();
    });

    it('should fail gracefully if WebGL is unsupported', () => {
        canvas.getContext = vi.fn(() => null) as any;
        const loggerSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        ShaderWallpaper.init('shader-bg');
        expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('WebGL not supported'));
        loggerSpy.mockRestore();
    });

    it('should load shaders and compile them (win95)', () => {
        // Re-inject mock canvas since prior tests might have cleared it
        document.body.innerHTML = '<canvas id="shader-bg"></canvas>';
        canvas = document.getElementById('shader-bg') as HTMLCanvasElement;
        canvas.getContext = vi.fn(() => mockGL) as any;

        ShaderWallpaper.init('shader-bg');

        // setFragmentShader orchestrates loadThemeShaders internally
        ShaderWallpaper.setFragmentShader('win95');

        // Should compile VS and FS
        // 2 calls from init, 2 calls from loading win95 = 4 calls total
        expect(mockGL.createShader).toHaveBeenCalledTimes(4);
        expect(mockGL.compileShader).toHaveBeenCalledTimes(4);
        expect(mockGL.linkProgram).toHaveBeenCalledTimes(2);
    });

    it('should handle shader compilation errors gracefully', () => {
        document.body.innerHTML = '<canvas id="shader-bg"></canvas>';
        canvas = document.getElementById('shader-bg') as HTMLCanvasElement;
        canvas.getContext = vi.fn(() => mockGL) as any;

        // Simulate compilation failure
        mockGL.getShaderParameter = vi.fn(() => false);
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        ShaderWallpaper.init('shader-bg');

        ShaderWallpaper.setFragmentShader('win95');
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('compile error'), expect.any(String));

        consoleSpy.mockRestore();
        mockGL.getShaderParameter = vi.fn(() => true); // Restore mock
    });

    it('should load modern shaders', () => {
        document.body.innerHTML = '<canvas id="shader-bg"></canvas>';
        canvas = document.getElementById('shader-bg') as HTMLCanvasElement;
        canvas.getContext = vi.fn(() => mockGL) as any;

        ShaderWallpaper.init('shader-bg');

        ShaderWallpaper.setFragmentShader('modern');

        // Both themes now use a single pass
        // 1 pass * 2 shaders = 2 compiles. Plus 2 from init = 4 total creates
        expect(mockGL.createShader).toHaveBeenCalledTimes(4);
        expect(mockGL.linkProgram).toHaveBeenCalledTimes(2);
    });

    it('should start and stop rendering loop', () => {
        document.body.innerHTML = '<canvas id="shader-bg"></canvas>';
        canvas = document.getElementById('shader-bg') as HTMLCanvasElement;
        canvas.getContext = vi.fn(() => mockGL) as any;

        ShaderWallpaper.init('shader-bg');
        ShaderWallpaper.setFragmentShader('win95');

        ShaderWallpaper.stop();
        expect(window.cancelAnimationFrame).toHaveBeenCalled();
        expect(ShaderWallpaper.isRunning()).toBe(false);

        // Clear mock history from init
        (window.requestAnimationFrame as any).mockClear();

        ShaderWallpaper.start();
        expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
});
