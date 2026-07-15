import * as THREE from 'three';

// ============================================
// RAGDOLL SPEECH
// Gestiona el bocadillo de diálogo del ragdoll (texto + posicionamiento en
// pantalla proyectando la cabeza). Extraído de Ragdoll3DCore. El Core sigue
// exponiendo `say()` (usado por las subclases) como delegador hacia aquí.
// ============================================

export interface IRagdollSpeechDeps {
    getBubbleAnimator: () => any;
    getBubbleId: () => string;
    getCamera: () => THREE.PerspectiveCamera | undefined;
    getContainer: () => HTMLElement | null;
    getBoneRigidBodyMap: () => Map<string, THREE.Bone>;
    getShowBubble: () => boolean;
    setShowBubble: (value: boolean) => void;
    getBubbleTimeout: () => any;
    setBubbleTimeout: (value: any) => void;
}

export class RagdollSpeech {
    private static readonly _scratchVector = new THREE.Vector3();

    constructor(private readonly deps: IRagdollSpeechDeps) {}

    public say(text: string, duration: number = 2000): void {
        const calcDuration = duration || Math.min(8000, Math.max(2000, text.length * 80));

        const bubbleAnimator = this.deps.getBubbleAnimator();
        if (!bubbleAnimator) {
            return;
        }

        this.deps.setShowBubble(true);
        const prevTimeout = this.deps.getBubbleTimeout();
        if (prevTimeout) clearTimeout(prevTimeout);

        bubbleAnimator.fullBubble('b_' + Date.now(), calcDuration, { wobble: true },
            (_an: any) => { },
            () => { this.deps.setShowBubble(false); }
        );

        const bubbleEl = document.getElementById(this.deps.getBubbleId());
        if (bubbleEl) {
            bubbleEl.textContent = text;
            bubbleEl.style.display = 'block';
        }

        this.deps.setBubbleTimeout(setTimeout(() => {
            this.deps.setShowBubble(false);
            if (bubbleEl) bubbleEl.style.display = 'none';
        }, calcDuration));
    }

    public updateSpeechBubble(): void {
        const camera = this.deps.getCamera();
        const container = this.deps.getContainer();
        if (!this.deps.getShowBubble() || !camera || !container) return;

        const bubbleEl = document.getElementById(this.deps.getBubbleId());
        if (!bubbleEl) return;

        const headNode = this.deps.getBoneRigidBodyMap().get('Head');
        if (headNode) {
            const tempPos = RagdollSpeech._scratchVector;
            headNode.getWorldPosition(tempPos);
            tempPos.y += 0.3;
            tempPos.project(camera);

            const rect = container.getBoundingClientRect();
            const x = (tempPos.x * .5 + .5) * rect.width + rect.left;
            const y = (tempPos.y * -.5 + .5) * rect.height + rect.top;

            bubbleEl.style.left = `${x}px`;
            bubbleEl.style.top = `${y}px`;
            bubbleEl.style.transform = 'translate(-50%, -100%)';
        }
    }
}
