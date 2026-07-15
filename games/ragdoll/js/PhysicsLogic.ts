/**
 * RAGDOLL SYSTEM - PHYSICS LOGIC
 * Extracted from ragdoll.js
 */

// Matter.js is loaded globally (window.Matter) and has no bundled types here.
type MatterBody = any;
type MatterConstraint = any;

interface PhysicsProportions {
    armLength: number;
    legLength: number;
    torsoScale: number;
    headScale: number;
}

/** Minimal surface of the Stickman instance used by the physics builders. */
interface PhysicsContext {
    ragdollPet: { Bodies: any; Constraint: any };
    parts: Record<string, MatterBody>;
    skinManager?: { proportions: PhysicsProportions } | null;
}

export class PhysicsLogic {
    /**
     * Create the skeletal body parts using Matter.js
     */
    static createSkeletalParts(context: PhysicsContext, x: number, y: number, scale: number): Record<string, MatterBody> {
        const { Bodies } = context.ragdollPet;
        const parts: Record<string, MatterBody> = {};
        const res = window.CONFIG?.RAGDOLL?.RESTITUTION || 0.4;

        // Head
        parts.head = Bodies.circle(x, y - 60 * scale, 12 * scale, {
            density: 0.001, friction: 0.8, frictionAir: 0.05, restitution: res, render: { visible: false }
        });

        // Torso
        parts.neck = Bodies.circle(x, y - 44 * scale, 2.5 * scale, {
            density: 0.0005, frictionAir: 0.05, restitution: res, render: { visible: false }
        });
        parts.chest = Bodies.circle(x, y - 30 * scale, 2.5 * scale, {
            density: 0.0005, frictionAir: 0.05, restitution: res, render: { visible: false }
        });
        parts.waist = Bodies.circle(x, y - 16 * scale, 2.5 * scale, {
            density: 0.0005, frictionAir: 0.05, restitution: res, render: { visible: false }
        });

        // Arms
        parts.leftShoulder = Bodies.circle(x - 7 * scale, y - 42 * scale, 2.5 * scale, {
            density: 0.0005, frictionAir: 0.05, restitution: res, render: { visible: false }
        });
        parts.leftElbow = Bodies.circle(x - 15 * scale, y - 30 * scale, 2.5 * scale, {
            density: 0.0005, frictionAir: 0.05, restitution: res, render: { visible: false }
        });
        parts.leftHand = Bodies.circle(x - 18 * scale, y - 20 * scale, 4 * scale, {
            density: 0.0008, friction: 0.9, frictionAir: 0.08, restitution: res, render: { visible: false }
        });

        parts.rightShoulder = Bodies.circle(x + 7 * scale, y - 42 * scale, 2.5 * scale, {
            density: 0.0005, frictionAir: 0.05, restitution: res, render: { visible: false }
        });
        parts.rightElbow = Bodies.circle(x + 15 * scale, y - 30 * scale, 2.5 * scale, {
            density: 0.0005, frictionAir: 0.05, restitution: res, render: { visible: false }
        });
        parts.rightHand = Bodies.circle(x + 18 * scale, y - 20 * scale, 4 * scale, {
            density: 0.0008, friction: 0.9, frictionAir: 0.08, restitution: res, render: { visible: false }
        });

        // Legs
        parts.leftHip = Bodies.circle(x - 4 * scale, y - 14 * scale, 2.5 * scale, {
            density: 0.0005, frictionAir: 0.05, restitution: res, render: { visible: false }
        });
        parts.leftKnee = Bodies.circle(x - 7 * scale, y - 2 * scale, 2.5 * scale, {
            density: 0.0005, frictionAir: 0.05, restitution: res, render: { visible: false }
        });
        parts.leftFoot = Bodies.circle(x - 8 * scale, y + 12 * scale, 4 * scale, {
            density: 0.001, friction: 1.0, frictionAir: 0.1, restitution: res, render: { visible: false }
        });

        parts.rightHip = Bodies.circle(x + 4 * scale, y - 14 * scale, 2.5 * scale, {
            density: 0.0005, frictionAir: 0.05, restitution: res, render: { visible: false }
        });
        parts.rightKnee = Bodies.circle(x + 7 * scale, y - 2 * scale, 2.5 * scale, {
            density: 0.0005, frictionAir: 0.05, restitution: res, render: { visible: false }
        });
        parts.rightFoot = Bodies.circle(x + 8 * scale, y + 12 * scale, 4 * scale, {
            density: 0.001, friction: 1.0, frictionAir: 0.1, restitution: res, render: { visible: false }
        });

        // Feet (Toes)
        parts.leftToes = Bodies.circle(x - 16 * scale, y + 12 * scale, 3 * scale, {
            density: 0.001, friction: 1.0, frictionAir: 0.1, restitution: res, render: { visible: false }
        });
        parts.rightToes = Bodies.circle(x + 16 * scale, y + 12 * scale, 3 * scale, {
            density: 0.001, friction: 1.0, frictionAir: 0.1, restitution: res, render: { visible: false }
        });

        return parts;
    }

    /**
     * Create constraints between parts
     */
    static createSkeletalConstraints(context: PhysicsContext, scale: number): MatterConstraint[] {
        const stiffness = 0.9;
        const damping = 0.1;
        const constraints: MatterConstraint[] = [];

        const add = (pA: string, pB: string, len: number, stiff: number, damp: number): void => {
            constraints.push(context.ragdollPet.Constraint.create({
                bodyA: context.parts[pA],
                bodyB: context.parts[pB],
                length: len,
                stiffness: stiff,
                damping: damp,
                render: {
                    visible: false,
                    strokeStyle: '#000000',
                    lineWidth: 2.5,
                    type: 'line'
                }
            }));
        };

        // Get dynamic proportions from SkinManager
        const props: PhysicsProportions = context.skinManager?.proportions || {
            armLength: 1.0,
            legLength: 1.0,
            torsoScale: 1.0,
            headScale: 1.0
        };

        // Spine
        add('head', 'neck', 16 * scale * props.headScale, stiffness, damping);
        add('neck', 'chest', 14 * scale * props.torsoScale, stiffness, damping);
        add('chest', 'waist', 14 * scale * props.torsoScale, stiffness, damping);

        // Left arm
        add('neck', 'leftShoulder', 7 * scale, stiffness * 0.8, damping);
        add('leftShoulder', 'leftElbow', 12 * scale * props.armLength, stiffness * 0.7, damping);
        add('leftElbow', 'leftHand', 10 * scale * props.armLength, stiffness * 0.7, damping);

        // Right arm
        add('neck', 'rightShoulder', 7 * scale, stiffness * 0.8, damping);
        add('rightShoulder', 'rightElbow', 12 * scale * props.armLength, stiffness * 0.7, damping);
        add('rightElbow', 'rightHand', 10 * scale * props.armLength, stiffness * 0.7, damping);

        // Left leg
        add('waist', 'leftHip', 4 * scale, stiffness, damping);
        add('leftHip', 'leftKnee', 13 * scale * props.legLength, stiffness * 0.8, damping);
        add('leftKnee', 'leftFoot', 14 * scale * props.legLength, stiffness * 0.8, damping);

        // Right leg
        add('waist', 'rightHip', 4 * scale, stiffness, damping);
        add('rightHip', 'rightKnee', 13 * scale * props.legLength, stiffness * 0.8, damping);
        add('rightKnee', 'rightFoot', 14 * scale * props.legLength, stiffness * 0.8, damping);

        // Feet segments (Foot to Toes)
        add('leftFoot', 'leftToes', 8 * scale, 0.95, 0.05);
        add('rightFoot', 'rightToes', 8 * scale, 0.95, 0.05);

        return constraints;
    }
}
