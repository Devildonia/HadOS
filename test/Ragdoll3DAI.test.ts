import { describe, it, expect, vi } from 'vitest';
import { Ragdoll3DAI, Ragdoll3DAIState } from '../js/core/Ragdoll3DAI';
import type { IRagdoll3DController } from '../js/core/Ragdoll3DAI';

class MockController implements IRagdoll3DController {
    public playedAnim: string = '';
    public moved: number = 0;
    public spokedMessage: string = '';
    public playedSound: string = '';
    public physicsSettled: boolean = false;
    public facingDir: number = 0;
    public hitWall: boolean = false;

    playAnimation(name: string): void { this.playedAnim = name; }
    moveHorizontal(deltaX: number): boolean { 
        this.moved += deltaX; 
        return this.hitWall; 
    }
    setFacingDirection(dir: number): void { this.facingDir = dir; }
    speak(message: string, durationMs: number): void { this.spokedMessage = message; }
    playSound(soundName: string): void { this.playedSound = soundName; }
    isPhysicsSettled(): boolean { return this.physicsSettled; }
}

describe('Ragdoll3DAI', () => {
    it('initializes in IDLE state', () => {
        const controller = new MockController();
        const ai = new Ragdoll3DAI(controller);
        expect(ai.state).toBe(Ragdoll3DAIState.IDLE);
    });

    it('transitions from IDLE after timeout', () => {
        const controller = new MockController();
        const ai = new Ragdoll3DAI(controller);
        
        // Force IDLE state logic
        ai.forceState(Ragdoll3DAIState.IDLE);
        expect(controller.playedAnim).toBe('Fall_Dead_from_Abdominal_Injury');
        
        // Tick past the random timer (max 5000ms)
        ai.tick(6000); 
        
        // Should have transitioned to either WANDER or ACTION
        expect(ai.state === Ragdoll3DAIState.WANDER || ai.state === Ragdoll3DAIState.ACTION).toBe(true);
    });

    it('moves during WANDER state', () => {
        const controller = new MockController();
        const ai = new Ragdoll3DAI(controller);
        
        ai.forceState(Ragdoll3DAIState.WANDER);
        expect(controller.playedAnim).toBe('Stand_Up1');
        
        const initialMoved = controller.moved;
        ai.tick(16); // 60fps tick
        expect(Math.abs(controller.moved - initialMoved)).toBeGreaterThan(0);
    });

    it('waits for physics to settle when in PHYSICS_MODE', () => {
        const controller = new MockController();
        const ai = new Ragdoll3DAI(controller);
        
        ai.forceState(Ragdoll3DAIState.PHYSICS_MODE);
        
        controller.physicsSettled = false;
        ai.tick(16);
        expect(ai.state).toBe(Ragdoll3DAIState.PHYSICS_MODE); // Still in physics mode
        
        controller.physicsSettled = true;
        ai.tick(16);
        expect(ai.state).toBe(Ragdoll3DAIState.RECOVERING); // Transitioned to recovering
    });

    it('transitions from RECOVERING to IDLE', () => {
        const controller = new MockController();
        const ai = new Ragdoll3DAI(controller);
        
        ai.forceState(Ragdoll3DAIState.RECOVERING);
        expect(controller.playedAnim).toBe('sleep');
        
        ai.tick(2500); // Exceed recovering timer
        expect(ai.state).toBe(Ragdoll3DAIState.IDLE);
    });
});
