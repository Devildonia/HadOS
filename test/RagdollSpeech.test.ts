import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as THREE from 'three';
import { RagdollSpeech, type IRagdollSpeechDeps } from '../js/core/RagdollSpeech';

describe('RagdollSpeech', () => {
    let deps: IRagdollSpeechDeps;
    let camera: THREE.PerspectiveCamera;
    let container: HTMLDivElement;
    let boneRigidBodyMap: Map<string, THREE.Bone>;

    let bubbleAnimator: any = null;
    let bubbleId = 'test-bubble';
    let showBubble = false;
    let bubbleTimeout: any = null;
    let showBubbleSetterCalledVal = false;

    beforeEach(() => {
        vi.useFakeTimers();
        vi.restoreAllMocks();

        camera = new THREE.PerspectiveCamera();
        container = document.createElement('div');
        vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
            left: 10, top: 10, width: 100, height: 100
        } as DOMRect);

        boneRigidBodyMap = new Map();

        document.body.innerHTML = `<div id="${bubbleId}" style="display:none;"></div>`;

        bubbleAnimator = {
            fullBubble: vi.fn((id, dur, opts, onAn, onComplete) => {
                // Mock immediate callback trigger for completion
                setTimeout(() => onComplete(), dur);
            })
        };

        deps = {
            getBubbleAnimator: () => bubbleAnimator,
            getBubbleId: () => bubbleId,
            getCamera: () => camera,
            getContainer: () => container,
            getBoneRigidBodyMap: () => boneRigidBodyMap,
            getShowBubble: () => showBubble,
            setShowBubble: (val) => { showBubble = val; showBubbleSetterCalledVal = val; },
            getBubbleTimeout: () => bubbleTimeout,
            setBubbleTimeout: (val) => { bubbleTimeout = val; }
        };
    });

    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    describe('say', () => {
        it('should exit early if bubbleAnimator is null', () => {
            bubbleAnimator = null;
            const speech = new RagdollSpeech(deps);
            speech.say('hello');
            expect(showBubble).toBe(false);
        });

        it('should trigger bubble animation, update DOM text, and hide after duration', () => {
            const speech = new RagdollSpeech(deps);
            const bubbleEl = document.getElementById(bubbleId)!;

            speech.say('Hola Mundo!', 1000);

            expect(showBubble).toBe(true);
            expect(bubbleEl.textContent).toBe('Hola Mundo!');
            expect(bubbleEl.style.display).toBe('block');
            expect(bubbleAnimator.fullBubble).toHaveBeenCalled();

            // Advance time to 1000ms
            vi.advanceTimersByTime(1000);

            expect(showBubble).toBe(false);
            expect(bubbleEl.style.display).toBe('none');
        });

        it('should clear existing timeout if called repeatedly', () => {
            const speech = new RagdollSpeech(deps);
            const spyClear = vi.spyOn(global, 'clearTimeout');

            speech.say('First message', 2000);
            expect(bubbleTimeout).toBeDefined();

            speech.say('Second message', 2000);
            expect(spyClear).toHaveBeenCalled();
        });
    });

    describe('updateSpeechBubble', () => {
        it('should do nothing if showBubble is false', () => {
            const speech = new RagdollSpeech(deps);
            showBubble = false;

            const headBone = new THREE.Bone();
            headBone.name = 'Head';
            boneRigidBodyMap.set('Head', headBone);

            speech.updateSpeechBubble();

            const bubbleEl = document.getElementById(bubbleId)!;
            expect(bubbleEl.style.left).toBe('');
        });

        it('should calculate projected coordinates and update element styles', () => {
            const speech = new RagdollSpeech(deps);
            showBubble = true;

            const headBone = new THREE.Bone();
            headBone.name = 'Head';
            
            // Mock getWorldPosition and project
            vi.spyOn(headBone, 'getWorldPosition').mockImplementation((v) => {
                v.set(0, 1, 0);
                return v;
            });

            vi.spyOn(THREE.Vector3.prototype, 'project').mockImplementation(function(this: THREE.Vector3) {
                // Mock projection mapping to middle of clip space (0, 0)
                this.set(0, 0, 0);
                return this;
            });

            boneRigidBodyMap.set('Head', headBone);

            speech.updateSpeechBubble();

            const bubbleEl = document.getElementById(bubbleId)!;
            // X = (0 * .5 + .5) * 100 + 10 = 60px
            // Y = (0 * -.5 + .5) * 100 + 10 = 60px
            expect(bubbleEl.style.left).toBe('60px');
            expect(bubbleEl.style.top).toBe('60px');
        });
    });
});
