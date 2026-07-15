/**
 * RAGDOLL SYSTEM - RENDERER
 * Extracted from ragdoll.js
 */

export class Renderer {
    /**
     * Main draw call for the stickman
     * @param {Object} stickman - The Stickman instance
     */
    static draw(stickman: any): void {
        const ctx = stickman.ragdollPet.render.context;
        const manager = stickman.skinManager;

        ctx.save();

        // 1. Shadow (Dynamic silhouette)
        if (manager.config.showShadow) {
            this.drawShadow(ctx, stickman);
        }

        // 2. Skeleton (Optional base layer)
        this.drawSkeleton(ctx, stickman);

        if (stickman.skinEnabled) {
            // 3. Soft Joints (Procedural "flesh")
            if (manager.config.softJoints) {
                this.drawSoftJoints(ctx, stickman);
            }

            // 4. Layers: Base -> Clothing -> Accessories
            this.drawBodyLayers(ctx, stickman);
        }

        // 5. Head & Face
        this.drawHeadAndFace(ctx, stickman);

        // 6. Hands (Top layer)
        this.drawHands(ctx, stickman);

        ctx.restore();

        if (stickman.showBubble) this.drawSpeechBubble(ctx, stickman);
        this.renderEmanators(ctx, stickman);
        stickman.drawSpecialParticles(ctx);
        stickman.drawBloodParticles(ctx);
    }

    static renderEmanators(ctx: CanvasRenderingContext2D, stickman: any) {
        const manager = stickman.skinManager;
        if (!manager || !manager.config.emanators) return;

        const intensity = manager.config.vfxIntensity || 1.0;
        const vfxScale = (manager.config.vfxSize || 1.0) * (stickman.globalScale || 1.0);

        manager.config.emanators.forEach((eman: any) => {
            // Pick a random part if it's an "aura" type, otherwise use the specified part
            const isAura = eman.type === 'stars' || eman.type === 'fire';
            const bodyParts = ['head', 'chest', 'waist', 'leftHand', 'rightHand', 'leftFoot', 'rightFoot'];
            const partName = isAura ? bodyParts[Math.floor(Math.random() * bodyParts.length)] : (eman.part || 'waist');
            const part = stickman.parts[partName];
            if (!part) return;

            // Frequency scale based on intensity
            const chance = 0.4 * intensity;
            if (Math.random() > (1 - chance)) {
                const p = {
                    x: part.position.x + (Math.random() - 0.5) * (isAura ? 30 : 10) * vfxScale,
                    y: part.position.y + (Math.random() - 0.5) * (isAura ? 30 : 10) * vfxScale,
                    vx: (Math.random() - 0.5) * 2,
                    vy: isAura ? (Math.random() - 0.5) * 2 : -Math.random() * 3, // Auras float in all directions
                    life: 1.0,
                    color: eman.type === 'fire' ? '#ff4400' : (eman.type === 'stars' ? '#ffff00' : '#8888ff')
                };

                stickman.bloodParticles.push({
                    x: p.x, y: p.y, vx: p.vx, vy: p.vy,
                    life: 1.0,
                    update: function () { this.x += this.vx; this.y += this.vy; this.life -= 0.03; return this.life > 0; },
                    draw: function (ctx: CanvasRenderingContext2D) {
                        ctx.save();
                        ctx.globalAlpha = this.life;
                        ctx.fillStyle = p.color;
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, (isAura ? 4 : 3) * vfxScale, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                    }
                });
            }
        });
    }

    static drawShadow(ctx: CanvasRenderingContext2D, stickman: any) {
        const waist = stickman.parts.waist;
        if (!waist) return;

        const scale = stickman.globalScale;
        const taskbarTop = window.innerHeight - (window.CONFIG?.TASKBAR?.HEIGHT || 40);

        // Project shadow to ground relative to waist position
        const groundY = taskbarTop - 5 * scale;
        const distToGround = Math.max(0, groundY - waist.position.y);
        const shadowScale = Math.max(0.2, 1 - (distToGround / 300));

        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(waist.position.x, groundY, 40 * scale * shadowScale, 12 * scale * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    static drawSoftJoints(ctx: CanvasRenderingContext2D, stickman: any) {
        const parts = stickman.parts;
        const scale = stickman.globalScale;
        // Use the base tint from the skin manager layers
        const tint = stickman.skinManager?.layers?.base?.tint;
        ctx.fillStyle = tint || '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1 * scale;

        // ... bridge logic if needed, but we currently use joint circles

        // Connect joints with smooth circles instead of crude triangles
        const drawJoint = (p: any, partName: string) => {
            if (!p) return;
            // Use widthScale AND part-specific scaling for joint volume
            const widthScale = stickman.globalWidthScale || 1.0;
            const partScale = stickman.skinConfig[partName]?.scale || 1.0;

            ctx.beginPath();
            ctx.arc(p.position.x, p.position.y, 6 * scale * widthScale * partScale, 0, Math.PI * 2);
            ctx.fill();
        };

        drawJoint(parts.leftShoulder, 'leftArm');
        drawJoint(parts.rightShoulder, 'rightArm');
        drawJoint(parts.leftElbow, 'leftArm');
        drawJoint(parts.rightElbow, 'rightArm');
        drawJoint(parts.leftKnee, 'leftLeg');
        drawJoint(parts.rightKnee, 'rightLeg');
        drawJoint(parts.neck, 'head');
        drawJoint(parts.chest, 'shirt');
        drawJoint(parts.waist, 'shirt');
    }

    static drawBodyLayers(ctx: CanvasRenderingContext2D, stickman: any) {
        const manager = stickman.skinManager;
        const parts = stickman.parts;
        const scale = stickman.globalScale;

        // Base Limb Rendering
        const topImg = stickman.shirtImage;
        const bottomImg = stickman.pantsImage;

        // Arms
        if (parts.leftShoulder && parts.leftElbow) {
            const s = stickman.skinConfig.leftArm?.scale || 1.0;
            this.drawLegSegment(stickman, ctx, parts.leftShoulder, parts.leftElbow, stickman.leftArmImage, s, 0, scale);
        }
        if (parts.rightShoulder && parts.rightElbow) {
            const s = stickman.skinConfig.rightArm?.scale || 1.0;
            this.drawLegSegment(stickman, ctx, parts.rightShoulder, parts.rightElbow, stickman.rightArmImage, s, 0, scale);
        }

        // Legs (Raised by -2 units)
        if (parts.leftKnee && parts.leftFoot) {
            const s = stickman.skinConfig.leftLeg?.scale || 1.0;
            this.drawLegSegment(stickman, ctx, parts.leftKnee, parts.leftFoot, stickman.leftLegImage, s, -2, scale);
        }
        if (parts.rightKnee && parts.rightFoot) {
            const s = stickman.skinConfig.rightLeg?.scale || 1.0;
            this.drawLegSegment(stickman, ctx, parts.rightKnee, parts.rightFoot, stickman.rightLegImage, s, -2, scale);
        }

        // Clothing: Pants (Drawn first to be under shirt)
        if (parts.waist && bottomImg) {
            const waist = parts.waist;
            const widthScale = stickman.globalWidthScale || 1.0;
            const pw = 25 * scale * widthScale;
            const ph = 15 * scale;
            ctx.save();
            ctx.translate(waist.position.x, waist.position.y);
            ctx.rotate(waist.angle);
            if (bottomImg.complete && bottomImg.naturalWidth !== 0) {
                ctx.drawImage(bottomImg, -pw / 2, -ph / 2 - 2 * scale, pw, ph);
            }
            ctx.restore();
        }

        // Clothing: Shirt (Drawn after pants to be on top)
        if (parts.chest && topImg) {
            const chest = parts.chest;
            const widthScale = stickman.globalWidthScale || 1.0;
            const size = 35 * scale;
            ctx.save();
            ctx.translate(chest.position.x, chest.position.y);
            ctx.rotate(chest.angle);
            // Raised from +3*scale to +1*scale
            if (topImg.complete && topImg.naturalWidth !== 0) {
                ctx.drawImage(topImg, (-size * widthScale) / 2, -size / 2 + 1 * scale, size * widthScale, size);
            }
            ctx.restore();
        }
    }

    static drawHeadAndFace(ctx: CanvasRenderingContext2D, stickman: any) {
        const head = stickman.parts.head;
        if (!head) return;
        const scale = stickman.globalScale;
        ctx.save();
        ctx.translate(head.position.x, head.position.y);
        ctx.rotate(head.angle);

        if (stickman.skinEnabled && stickman.headImage?.complete && stickman.headImage?.naturalWidth !== 0) {
            const size = 40 * scale;
            ctx.drawImage(stickman.headImage, -size / 2, -size / 2, size, size);
        } else {
            this.drawDefaultHead(ctx, stickman);
        }

        this.drawFace(ctx, stickman);
        ctx.restore();
    }
    static drawHands(ctx: CanvasRenderingContext2D, stickman: any) {
        const globalScale = stickman.globalScale;
        const widthScale = stickman.globalWidthScale || 1.0;

        // Base segment angles
        const getBaseAngle = (e: any, h: any) => !e || !h ? 0 : Math.atan2(h.position.y - e.position.y, h.position.x - e.position.x);
        const lBase = getBaseAngle(stickman.parts.leftElbow, stickman.parts.leftHand);
        const rBase = getBaseAngle(stickman.parts.rightElbow, stickman.parts.rightHand);

        const lc = stickman.skinConfig.leftHand || { scale: 1.0, y: 0 };
        const rc = stickman.skinConfig.rightHand || { scale: 1.0, y: 0 };

        // Overlays for custom model
        const lOverlay = stickman.skinEnabled ? stickman.lHandOverlay : null;
        const rOverlay = stickman.skinEnabled ? stickman.rHandOverlay : null;

        // Procedural hands always follow the forearm direction
        const la = lBase + Math.PI / 2;
        const ra = rBase + Math.PI / 2;

        // We use procedural hands as base and add .webp overlays for custom models
        this.drawHand(ctx, stickman.parts.leftHand, lOverlay, 18 * globalScale * widthScale * lc.scale, true, la, lc.y * globalScale);
        this.drawHand(ctx, stickman.parts.rightHand, rOverlay, 18 * globalScale * widthScale * rc.scale, false, ra, rc.y * globalScale);
    }

    static drawSkeleton(ctx: CanvasRenderingContext2D, stickman: any) {
        const scale = stickman.globalScale || 1.0;
        const tint = stickman.skinManager?.layers?.base?.tint;
        ctx.strokeStyle = tint || '#000000';
        ctx.lineWidth = 2.2 * scale;
        ctx.lineCap = 'round';

        const drawLine = (p1: any, p2: any) => {
            if (!p1 || !p2) return;
            ctx.beginPath();
            ctx.moveTo(p1.position.x, p1.position.y);
            ctx.lineTo(p2.position.x, p2.position.y);
            ctx.stroke();
        };

        const { head, neck, chest, waist, leftShoulder, leftElbow, leftHand, rightShoulder, rightElbow, rightHand, leftHip, leftKnee, leftFoot, rightHip, rightKnee, rightFoot } = stickman.parts;

        // Spine
        drawLine(head, neck);
        drawLine(neck, chest);
        drawLine(chest, waist);

        // Arms - CONNECT TO NECK, NOT CHEST
        drawLine(neck, leftShoulder);
        drawLine(leftShoulder, leftElbow);
        drawLine(leftElbow, leftHand);

        drawLine(neck, rightShoulder);
        drawLine(rightShoulder, rightElbow);
        drawLine(rightElbow, rightHand);

        // Legs
        drawLine(waist, leftHip);
        drawLine(leftHip, leftKnee);
        drawLine(leftKnee, leftFoot);

        drawLine(waist, rightHip);
        drawLine(rightHip, rightKnee);
        drawLine(rightKnee, rightFoot);

        // Feet segments
        drawLine(leftFoot, stickman.parts.leftToes);
        drawLine(rightFoot, stickman.parts.rightToes);

        // Joints (Dots)
        this.drawJoint(ctx, neck, scale);
        this.drawJoint(ctx, leftShoulder, scale);
        this.drawJoint(ctx, leftElbow, scale);
        this.drawJoint(ctx, rightShoulder, scale);
        this.drawJoint(ctx, rightElbow, scale);
        this.drawJoint(ctx, leftHip, scale);
        this.drawJoint(ctx, leftKnee, scale);
        this.drawJoint(ctx, rightHip, scale);
        this.drawJoint(ctx, rightKnee, scale);
    }

    static drawJoint(ctx: CanvasRenderingContext2D, part: any, scale: number) {
        if (!part) return;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(part.position.x, part.position.y, 1.5 * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    static drawDefaultHead(ctx: CanvasRenderingContext2D, stickman: any) {
        const scale = stickman?.globalScale || 1.0;
        ctx.beginPath();
        ctx.arc(0, 0, 12 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF'; // White head
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.6 * scale;
        ctx.stroke();
    }

    static drawFace(ctx: CanvasRenderingContext2D, stickman: any) {
        const emotion = stickman.emotion;
        const scale = stickman.globalScale || 1.0;

        // Eyes
        ctx.fillStyle = '#000';
        if (emotion === 'panic') {
            ctx.beginPath();
            ctx.arc(-4 * scale, -2 * scale, 3.5 * scale, 0, Math.PI * 2);
            ctx.arc(4 * scale, -2 * scale, 3.5 * scale, 0, Math.PI * 2);
            ctx.fill();
        } else if (emotion === 'surprised') {
            ctx.beginPath();
            ctx.arc(-4 * scale, -2 * scale, 2.5 * scale, 0, Math.PI * 2);
            ctx.arc(4 * scale, -2 * scale, 2.5 * scale, 0, Math.PI * 2);
            ctx.fill();
        } else if (emotion === 'angry') {
            ctx.beginPath();
            ctx.arc(-4 * scale, -1 * scale, 1.5 * scale, 0, Math.PI * 2);
            ctx.arc(4 * scale, -1 * scale, 1.5 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5 * scale; ctx.beginPath();
            ctx.moveTo(-7 * scale, -4 * scale); ctx.lineTo(-2 * scale, -2.5 * scale);
            ctx.moveTo(2 * scale, -2.5 * scale); ctx.lineTo(7 * scale, -4 * scale);
            ctx.stroke();
        } else if (emotion === 'hurt') {
            ctx.strokeStyle = '#000'; ctx.lineWidth = 2 * scale; ctx.beginPath();
            ctx.moveTo(-6 * scale, -3 * scale); ctx.lineTo(-2 * scale, 1 * scale);
            ctx.moveTo(-2 * scale, -3 * scale); ctx.lineTo(-6 * scale, 1 * scale);
            ctx.moveTo(2 * scale, -3 * scale); ctx.lineTo(6 * scale, 1 * scale);
            ctx.moveTo(6 * scale, -3 * scale); ctx.lineTo(2 * scale, 1 * scale);
            ctx.stroke();
        } else if (emotion === 'tired' || emotion === 'sad') {
            ctx.strokeStyle = '#000'; ctx.lineWidth = 2 * scale; ctx.beginPath();
            ctx.moveTo(-6 * scale, -2 * scale); ctx.lineTo(-2 * scale, -2 * scale);
            ctx.moveTo(2 * scale, -2 * scale); ctx.lineTo(6 * scale, -2 * scale);
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(-4 * scale, -2 * scale, 2 * scale, 0, Math.PI * 2);
            ctx.arc(4 * scale, -2 * scale, 2 * scale, 0, Math.PI * 2);
            ctx.fill();
        }

        // Mouth
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1.5 * scale;
        if (emotion === 'happy') {
            ctx.beginPath(); ctx.arc(0, 2 * scale, 6 * scale, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
        } else if (emotion === 'surprised' || emotion === 'panic') {
            ctx.beginPath(); ctx.arc(0, 4 * scale, 3 * scale, 0, Math.PI * 2); ctx.fill();
        } else if (emotion === 'angry') {
            ctx.beginPath(); ctx.arc(0, 6 * scale, 5 * scale, 1.1 * Math.PI, 1.9 * Math.PI); ctx.stroke();
        } else if (emotion === 'hurt' || emotion === 'sad') {
            ctx.beginPath(); ctx.moveTo(-4 * scale, 4 * scale); ctx.lineTo(4 * scale, 4 * scale); ctx.stroke();
        } else {
            ctx.beginPath(); ctx.moveTo(-3 * scale, 4 * scale); ctx.lineTo(3 * scale, 4 * scale); ctx.stroke();
        }
    }

    static drawHand(ctx: CanvasRenderingContext2D, handPart: any, image: any, size: number, isLeft = false, overrideAngle: number | null = null, yOffset = 0) {
        if (!handPart) return;
        ctx.save();
        ctx.translate(handPart.position.x, handPart.position.y);
        ctx.rotate(overrideAngle !== null ? overrideAngle : handPart.angle);

        // ALWAYS draw the procedural base first to ensure consistency and proper physics alignment
        this.drawProceduralHand(ctx, size, isLeft);

        // Overlay the .webp image if available (primarily for custom models)
        if (image && image.complete && image.naturalWidth !== 0) {
            try {
                const isOverlayAsset = image.src && (image.src.includes('l_hand.webp') || image.src.includes('r_hand.webp'));

                // If they are separate L/R assets, we usually don't flip them.
                // We previously flipped custom skins that were just one image.
                const isCustomOneImage = image.isCustomSkin || (image.src && !image.src.toLowerCase().includes('/assets/'));
                if (isLeft && isCustomOneImage && !isOverlayAsset) {
                    ctx.scale(-1, 1);
                }

                // Add the 180-degree rotation requested for the overlay assets
                if (isOverlayAsset) {
                    ctx.rotate(Math.PI);
                }

                // Increase size slightly for overlays to cover the procedural base
                const drawSize = isOverlayAsset ? size * 1.25 : size;
                ctx.drawImage(image, -drawSize / 2, -drawSize / 2 + yOffset, drawSize, drawSize);
            } catch (e) {
                // Image failed to load or draw, we already have the procedural base
            }
        }
        ctx.restore();
    }

    static drawProceduralHand(ctx: CanvasRenderingContext2D, size: number, isLeft: boolean) {
        const fingerLen = size * 0.5;
        const thumbLen = size * 0.35;
        const fingerWidth = size * 0.2;

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = fingerWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Palm base
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Fingers (3)
        const angles = [-0.4, 0, 0.4];
        angles.forEach(angle => {
            ctx.save();
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -fingerLen);
            ctx.stroke();
            // Round tip
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(0, -fingerLen, fingerWidth / 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Thumb
        const thumbAngle = isLeft ? -1.1 : 1.1;
        ctx.save();
        ctx.rotate(thumbAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -thumbLen);
        ctx.stroke();
        ctx.restore();
    }

    static drawLegSegment(stickman: any, ctx: CanvasRenderingContext2D, knee: any, foot: any, image: any, scale = 1, yOffset = 0, globalScale = 1.0) {
        const dx = foot.position.x - knee.position.x;
        const dy = foot.position.y - knee.position.y;
        const angle = Math.atan2(dy, dx);
        const length = Math.sqrt(dx * dx + dy * dy);
        const centerX = (knee.position.x + foot.position.x) / 2;
        const centerY = (knee.position.y + foot.position.y) / 2;
        const width = 14 * scale * globalScale * (stickman.globalWidthScale || 1.0);
        const height = (length + 8) * scale * globalScale;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle - Math.PI / 2);

        const tint = stickman.skinManager.layers.base.tint;

        if (image && image.complete && image.naturalWidth !== 0) {
            try {
                // Draw the image
                ctx.drawImage(image, -width / 2, -height / 2 + (yOffset * globalScale), width, height);

                // Optional: Apply tint as a 'multiply' layer on top of the image
                // Skip if tint is standard black or white
                if (tint && tint !== '#FFFFFF' && tint !== '#ffffff' && tint !== '#000000') {
                    ctx.globalCompositeOperation = 'multiply';
                    ctx.fillStyle = tint;
                    ctx.fillRect(-width / 2, -height / 2 + (yOffset * globalScale), width, height);
                    ctx.globalCompositeOperation = 'source-over'; // Reset
                }
            } catch (e) { }
        } else {
            // Fallback for procedural limbs if no image - Use tint from manager
            ctx.strokeStyle = tint || '#000000';
            ctx.lineWidth = width * 0.35; // Thinner, closer to skeleton
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(0, -height / 2);
            ctx.lineTo(0, height / 2);
            ctx.stroke();
        }
        ctx.restore();
    }

    static drawSpeechBubble(ctx: CanvasRenderingContext2D, stickman: any) {
        const head = stickman.parts.head;
        let text: string = stickman.bubbleText;
        const legacyMap: Record<string, string> = { 'angry': '😠', 'broken-heart': '💔', 'question': '?', 'tired': 'Zzz...', 'jump': '!', 'watch': '👀' };
        const mapped = legacyMap[text];
        if (mapped) text = mapped;

        const fontSize = stickman.messageLibrary ? stickman.messageLibrary.getRecommendedFontSize(text) : 12;

        ctx.save();
        ctx.font = `bold ${fontSize}px Arial`;
        const metrics = ctx.measureText(text);
        const bubbleWidth = Math.max(30, metrics.width + 16);
        const bubbleHeight = fontSize + 16;
        const bubbleX = head.position.x + 30;
        const bubbleY = head.position.y - 40;

        ctx.globalAlpha = stickman.bubbleAlpha || 1;
        const scale = stickman.bubbleScale || 1;
        if (scale !== 1) {
            ctx.translate(bubbleX + stickman.bubbleOffsetX, bubbleY + stickman.bubbleOffsetY);
            ctx.scale(scale, scale);
            ctx.translate(-(bubbleX + stickman.bubbleOffsetX), -(bubbleY + stickman.bubbleOffsetY));
        }

        this.drawRoundedRect(ctx, bubbleX + stickman.bubbleOffsetX, bubbleY + stickman.bubbleOffsetY, bubbleWidth, bubbleHeight, 10);
        this.drawBubbleTail(ctx, bubbleX + stickman.bubbleOffsetX, bubbleY + stickman.bubbleOffsetY, bubbleHeight, head);

        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, bubbleX + stickman.bubbleOffsetX, bubbleY + stickman.bubbleOffsetY);
        ctx.restore();
    }

    static drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x - width / 2, y - height / 2, width, height, radius);
        ctx.fill();
        ctx.stroke();
    }

    static drawBubbleTail(ctx: CanvasRenderingContext2D, bx: number, by: number, bh: number, head: any) {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx - 10, by + bh / 2 - 3);
        ctx.lineTo(head.position.x + 8, head.position.y - 8);
        ctx.lineTo(bx - 6, by + bh / 2 + 3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}
