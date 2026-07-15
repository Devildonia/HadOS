export enum Ragdoll3DAIState {
    IDLE = 'IDLE',
    WANDER = 'WANDER',
    ACTION = 'ACTION',
    PHYSICS_MODE = 'PHYSICS_MODE',
    RECOVERING = 'RECOVERING'
}

export interface IRagdoll3DController {
    playAnimation(name: string): void;
    moveHorizontal(deltaX: number): boolean; // returns true if hit wall
    setFacingDirection(dir: number): void; // 1 = right, -1 = left, 0 = front
    speak(message: string, durationMs: number): void;
    playSound(soundName: string): void;
    isPhysicsSettled(): boolean;
}

export class Ragdoll3DAI {
    public state: Ragdoll3DAIState = Ragdoll3DAIState.IDLE;
    private timer: number = 0;
    private controller: IRagdoll3DController;
    private wanderDirection: number = 1; // 1 for right, -1 for left

    constructor(controller: IRagdoll3DController) {
        this.controller = controller;
        this.resetTimer();
    }

    public tick(deltaTimeMs: number): void {
        if (this.state === Ragdoll3DAIState.PHYSICS_MODE) {
            // Wait for physics to settle before recovering
            if (this.controller.isPhysicsSettled()) {
                this.setState(Ragdoll3DAIState.RECOVERING);
            }
            return;
        }

        this.timer -= deltaTimeMs;

        switch (this.state) {
            case Ragdoll3DAIState.IDLE:
                if (this.timer <= 0) {
                    this.decideNextState();
                }
                break;
            case Ragdoll3DAIState.WANDER:
                const hitWall = this.controller.moveHorizontal(0.005 * this.wanderDirection); // Move slowly
                if (hitWall) {
                    this.wanderDirection *= -1;
                    this.controller.setFacingDirection(this.wanderDirection);
                }
                if (this.timer <= 0) {
                    this.setState(Ragdoll3DAIState.IDLE);
                }
                break;
            case Ragdoll3DAIState.ACTION:
                if (this.timer <= 0) {
                    this.setState(Ragdoll3DAIState.IDLE);
                }
                break;
            case Ragdoll3DAIState.RECOVERING:
                if (this.timer <= 0) {
                    this.setState(Ragdoll3DAIState.IDLE);
                }
                break;
        }
    }

    public forceState(newState: Ragdoll3DAIState): void {
        this.setState(newState);
    }

    private setState(newState: Ragdoll3DAIState): void {
        this.state = newState;
        
        switch (newState) {
            case Ragdoll3DAIState.IDLE:
                this.controller.setFacingDirection(0);
                this.controller.playAnimation('Fall_Dead_from_Abdominal_Injury');
                this.timer = Math.random() * 3000 + 2000; // 2 to 5 seconds
                break;
            case Ragdoll3DAIState.WANDER:
                this.wanderDirection = Math.random() > 0.5 ? 1 : -1;
                this.controller.setFacingDirection(this.wanderDirection);
                // "Stand_Up1" is the actual walking animation in the GLB
                this.controller.playAnimation('Stand_Up1');
                this.timer = Math.random() * 4000 + 3000; // 3 to 7 seconds
                break;
            case Ragdoll3DAIState.ACTION:
                this.controller.setFacingDirection(0);
                this.executeRandomAction();
                break;
            case Ragdoll3DAIState.RECOVERING:
                // "sleep" is the actual stand up animation in the GLB
                this.controller.playAnimation('sleep');
                this.timer = 2000; // Wait 2s for stand up animation to complete
                break;
            case Ragdoll3DAIState.PHYSICS_MODE:
                // Animation handled by physics engine or T-pose
                this.timer = Infinity; 
                break;
        }
    }

    private decideNextState(): void {
        const rand = Math.random();
        if (rand < 0.6) {
            this.setState(Ragdoll3DAIState.WANDER);
        } else {
            this.setState(Ragdoll3DAIState.ACTION);
        }
    }

    private executeRandomAction(): void {
        const actions = [
            { anim: 'Hip_Hop_Dance_3', time: 5000, msg: '*Bailando*', sound: 'wii' },
            { anim: 'Talk_with_Hands_Open', time: 4000, msg: '¿Qué tal?', sound: 'boing' },
            { anim: 'Wave_for_Help_1', time: 3000, msg: '*Saltando*', sound: 'spawn' }
        ];
        
        const act = actions[Math.floor(Math.random() * actions.length)];
        if (act) {
            this.controller.playAnimation(act.anim);
            if (act.msg) this.controller.speak(act.msg, act.time);
            if (act.sound) this.controller.playSound(act.sound);
            
            this.timer = act.time;
        }
    }

    private resetTimer(): void {
        this.timer = 1000;
    }
}
