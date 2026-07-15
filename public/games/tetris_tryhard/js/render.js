import { BLOCK_SIZE, COLORS, VAULT_COLORS, SPRITES, SPRITE_COLORS, CHEER_WORDS, CHEER_MESSAGES } from './constants.js';

export class TetrisRender {
    constructor(bgCanvas, gameCanvas, nextCanvas, holdCanvas, celebrationCanvas, tetrisCanvas, bgBufferCanvas) {
        this.bgCanvas = bgCanvas;
        this.bgBufferCanvas = bgBufferCanvas;
        this.gameCanvas = gameCanvas;
        this.nextCanvas = nextCanvas;
        this.holdCanvas = holdCanvas;
        this.celebrationCanvas = celebrationCanvas;
        this.tetrisCanvas = tetrisCanvas;

        this.gl = this.bgCanvas.getContext('webgl', { antialias: false, depth: false });
        this.bgBufferGl = bgBufferCanvas?.getContext('webgl', { antialias: false, depth: false }) || null;
        this.ctx = this.gameCanvas.getContext('2d');
        this.nextCtx = this.nextCanvas.getContext('2d');
        this.holdCtx = this.holdCanvas.getContext('2d');
        this.celebrationCtx = this.celebrationCanvas.getContext('2d');

        this.tetrisGl = this.tetrisCanvas.getContext('webgl', {
            antialias: true,
            depth: false,
            alpha: true,
            premultipliedAlpha: false
        });

        this.particles = [];
        this.shakeIntensity = 0;

        this.activeCelebration = null;
        this.activeTetrisEffect = null;

        this.initBgBuffer();
        this.initWebGL();
        this.initTetrisShader();
        this.initResize();
    }

    initBgBuffer() {
        const gl = this.bgBufferGl;
        if (!gl) return;
        const vs = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
        const fs = `
            precision mediump float;
            uniform float iTime;
            uniform vec2 iResolution;

            vec2 hash2(vec2 p) {
                p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
                return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / iResolution.xy;
                uv.x *= iResolution.x / iResolution.y;
                vec2 p = uv * 5.0 + vec2(iTime * 0.12, iTime * 0.07);
                vec2 i = floor(p), f = fract(p);
                float minDist = 8.0;
                for (int y = -1; y <= 1; y++) {
                    for (int x = -1; x <= 1; x++) {
                        vec2 neighbor = vec2(x, y);
                        vec2 point = hash2(i + neighbor);
                        point = 0.5 + 0.5 * sin(iTime * 0.5 + 6.2831853 * point);
                        vec2 diff = neighbor + point - f;
                        minDist = min(minDist, length(diff));
                    }
                }
                float v = 1.0 - smoothstep(0.0, 0.65, minDist);
                float pulse = 0.5 + 0.5 * sin(iTime * 0.8 + minDist * 3.0);
                vec3 col = vec3(
                    v * 0.04 + pulse * 0.015,
                    v * 0.06 + pulse * 0.02,
                    v * 0.20 + pulse * 0.06
                );
                gl_FragColor = vec4(col, 1.0);
            }
        `;
        const prog = this._buildProgram(gl, vs, fs);
        gl.useProgram(prog);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
        const posLoc = gl.getAttribLocation(prog, 'position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        this.bgBufTimeLoc = gl.getUniformLocation(prog, 'iTime');
        this.bgBufResLoc = gl.getUniformLocation(prog, 'iResolution');
    }

    initWebGL() {
        if (!this.gl) return;
        const vsSource = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
        const fsSource = `
            precision highp float;
            uniform float iTime;
            uniform vec2 iResolution;
            mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c,s,-s,c); }
            const float pi = acos(-1.0);
            const float pi2 = pi*2.0;
            vec2 pmod(vec2 p, float r) { float a = atan(p.x, p.y) + pi/r; float n = pi2 / r; a = floor(a/n)*n; return p*rot(-a); }
            float box( vec3 p, vec3 b ) { vec3 d = abs(p) - b; return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0)); }
            float ifsBox(vec3 p) {
                for (int i=0; i<5; i++) { p = abs(p) - 1.0; p.xy *= rot(iTime*0.3); p.xz *= rot(iTime*0.1); }
                p.xz *= rot(iTime); return box(p, vec3(0.4,0.8,0.3));
            }
            float map(vec3 p) {
                vec3 p1 = p; p1.x = mod(p1.x-5., 10.) - 5.; p1.y = mod(p1.y-5., 10.) - 5.; p1.z = mod(p1.z, 16.)-8.; p1.xy = pmod(p1.xy, 5.0);
                return ifsBox(p1);
            }
            void main() {
                vec2 p = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
                vec3 cPos = vec3(0.0,0.0, -3.0 * iTime);
                vec3 cDir = normalize(vec3(0.0, 0.0, -1.0));
                vec3 cUp  = vec3(sin(iTime), 1.0, 0.0);
                vec3 cSide = cross(cDir, cUp);
                vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir);
                float acc = 0.0; float acc2 = 0.0; float t = 0.0;
                for (int i = 0; i < 60; i++) {
                    vec3 pos = cPos + ray * t; float dist = map(pos); dist = max(abs(dist), 0.02);
                    float a = exp(-dist*3.0);
                    if (mod(length(pos)+24.0*iTime, 30.0) < 3.0) { a *= 2.0; acc2 += a; }
                    acc += a; t += dist * 0.5;
                }
                // Cyan/Magenta tinted IFS
                vec3 col = vec3(
                    acc * 0.008 + acc2 * 0.001,
                    acc * 0.014 + acc2 * 0.004,
                    acc * 0.018 + acc2 * 0.008
                );
                col += vec3(acc2 * 0.006, acc2 * 0.001, acc2 * 0.003);
                gl_FragColor = vec4(col, 1.0 - t * 0.025);
            }
        `;

        const program = this._buildProgram(this.gl, vsSource, fsSource);
        this.gl.useProgram(program);

        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), this.gl.STATIC_DRAW);

        const posLoc = this.gl.getAttribLocation(program, 'position');
        this.gl.enableVertexAttribArray(posLoc);
        this.gl.vertexAttribPointer(posLoc, 2, this.gl.FLOAT, false, 0, 0);

        this.timeLoc = this.gl.getUniformLocation(program, 'iTime');
        this.resLoc = this.gl.getUniformLocation(program, 'iResolution');
    }

    initTetrisShader() {
        if (!this.tetrisGl) return;
        const vs = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
        const fs = `
            precision highp float;
            uniform float iTime;
            uniform vec2 iResolution;
            uniform float alpha;

            #define FAR 30.
            #define INFINITY 1e32
            #define t iTime
            #define FOV 60.0
            #define FOG .4
            #define PI 3.14159265
            
            float glow = 0.;
            void pR(inout vec2 p, float a) { p = cos(a)*p + sin(a)*vec2(p.y, -p.x); }
            vec3 opU2( vec3 d1, vec3 d2 ) { return (d1.x < d2.x) ? d1 : d2; }
            float vmax(vec3 v) { return max(max(v.x, v.y), v.z); }
            float pModPolar(inout vec2 p, float repetitions) {
                float angle = 2.*PI/repetitions;
                float a = atan(p.y, p.x) + angle/2.;
                float r = length(p);
                float c = floor(a/angle);
                a = mod(a,angle) - angle/2.;
                p = vec2(cos(a), sin(a))*r;
                if (abs(c) >= (repetitions/2.)) c = abs(c);
                return c;
            }
            float fBox(vec3 p, vec3 b) {
                vec3 d = abs(p) - b;
                return length(max(d, vec3(0))) + vmax(min(d, vec3(0)));
            }
            vec3 dF(vec3 p) {
                p = p.yzx;
                vec3 obj = vec3(FAR, -1.0, 0.0), obj2 = obj;
                p.z += sin(t / 2.) * 3.;
                p.z *= sin(t) * 1.;
                pR(p.xy, -t * 2. + p.z);
                p.x += sin(p.z) / 2.;
                vec3 orgP = p;
                pModPolar(p.xy, 4.);
                p.x -= .9;
                obj = vec3(fBox(p, vec3(0.4, 0.7, 13.4)), 2.0, 0.0);
                p = orgP;
                obj2 = vec3(fBox(p, vec3(1.1, 1.1, 20.)), 1.0, 0.0);
                return opU2(obj, obj2);
            }
            vec3 trace(vec3 ro, vec3 rd) {
                vec3 mp = dF(ro); glow = 0.; float minDist = INFINITY;
                float function_sign = (mp.x < 0.) ? -1. : 1.;
                float h = .001; float t_dist = 0.;
                for(int i = 0; i < 60; i++) {
                    if (abs(h) < .001 || t_dist > FAR) break;
                    mp = dF(ro + rd * t_dist);
                    minDist = min(minDist, mp.x * 9.);
                    glow = pow(1. / minDist, 1.) / 4.;
                    h = function_sign * mp.x;
                    t_dist += h;
                }
                mp.x = t_dist; return mp;
            }
            vec3 doColor(in vec3 sn, in vec2 mat) {
                vec3 objCol = vec3(1);
                if (mat.x == 2.0) {
                    objCol = vec3(8., 3., 0.);
                    objCol.r *= sin(t); objCol.g *= cos(t * .2);
                }
                return objCol;
            }
            void main() {
                vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
                vec3 ro = vec3(0., 0. , 8.2);
                vec3 rd = normalize(vec3(uv, -1.5)); // Simple camera
                vec3 tr = trace(ro, rd);
                vec3 col = vec3(0);
                if (tr.x < FAR) {
                    col = doColor(normalize(ro + rd * tr.x), tr.yz);
                    float fog = smoothstep(FAR * FOG, 0., tr.x);
                    col *= fog;
                } else {
                    col = vec3(pow(glow, 1.4) * .8);
                }
                gl_FragColor = vec4(col, alpha * (tr.x < FAR ? 0.8 : 0.4));
            }
        `;

        const program = this._buildProgram(this.tetrisGl, vs, fs);
        this.tetrisGl.useProgram(program);

        const positionBuffer = this.tetrisGl.createBuffer();
        this.tetrisGl.bindBuffer(this.tetrisGl.ARRAY_BUFFER, positionBuffer);
        this.tetrisGl.bufferData(this.tetrisGl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), this.tetrisGl.STATIC_DRAW);

        const posLoc = this.tetrisGl.getAttribLocation(program, 'position');
        this.tetrisGl.enableVertexAttribArray(posLoc);
        this.tetrisGl.vertexAttribPointer(posLoc, 2, this.tetrisGl.FLOAT, false, 0, 0);

        this.tetrisTimeLoc = this.tetrisGl.getUniformLocation(program, 'iTime');
        this.tetrisResLoc = this.tetrisGl.getUniformLocation(program, 'iResolution');
        this.tetrisAlphaLoc = this.tetrisGl.getUniformLocation(program, 'alpha');
    }

    /** Shared WebGL shader compiler — works with any gl context. */
    _buildProgram(gl, vs, fs) {
        const vS = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vS, vs); gl.compileShader(vS);
        const fS = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fS, fs); gl.compileShader(fS);
        const prog = gl.createProgram();
        gl.attachShader(prog, vS); gl.attachShader(prog, fS);
        gl.linkProgram(prog);
        return prog;
    }

    initResize() {
        const resize = () => {
            const w = document.documentElement.clientWidth || window.innerWidth;
            const h = document.documentElement.clientHeight || window.innerHeight;
            this.bgCanvas.width = w;
            this.bgCanvas.height = h;
            if (this.bgBufferCanvas) {
                this.bgBufferCanvas.width = w;
                this.bgBufferCanvas.height = h;
            }
            this.celebrationCanvas.width = w;
            this.celebrationCanvas.height = h;
            this.tetrisCanvas.width = w;
            this.tetrisCanvas.height = h;
            if (this.gl) this.gl.viewport(0, 0, w, h);
            if (this.bgBufferGl) this.bgBufferGl.viewport(0, 0, w, h);
            if (this.tetrisGl) this.tetrisGl.viewport(0, 0, w, h);
        };

        window.addEventListener('resize', resize);
        if (typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(resize).observe(document.body);
        }
        requestAnimationFrame(() => requestAnimationFrame(resize));
    }

    renderBackground(time) {
        const t = time * 0.001;
        // Pass 1: Voronoi buffer
        if (this.bgBufferGl) {
            this.bgBufferGl.uniform1f(this.bgBufTimeLoc, t);
            this.bgBufferGl.uniform2f(this.bgBufResLoc, this.bgBufferCanvas.width, this.bgBufferCanvas.height);
            this.bgBufferGl.drawArrays(this.bgBufferGl.TRIANGLES, 0, 6);
        }
        // Pass 2: IFS tunnel on top
        if (!this.gl) return;
        this.gl.uniform1f(this.timeLoc, t);
        this.gl.uniform2f(this.resLoc, this.bgCanvas.width, this.bgCanvas.height);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    drawBoard(board, currentPiece, ghostPiece, pieceImages, pieceConfig) {
        this.ctx.fillStyle = '#0a0e27';
        this.ctx.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

        this.ctx.save();
        if (this.shakeIntensity > 0) {
            this.ctx.translate((Math.random() - 0.5) * this.shakeIntensity, (Math.random() - 0.5) * this.shakeIntensity);
        }

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                const cell = board[row][col];
                if (cell) this.drawBlock(this.ctx, col, row, cell.type, BLOCK_SIZE, cell.r, cell.sliceX, cell.sliceY, pieceImages, pieceConfig);
            }
        }

        if (currentPiece) {
            if (ghostPiece) {
                this.ctx.save();
                this.ctx.globalAlpha = 0.3;
                this.drawPiece(this.ctx, ghostPiece, BLOCK_SIZE, 0, 0, pieceImages, pieceConfig);
                this.ctx.restore();
            }
            this.drawPiece(this.ctx, currentPiece, BLOCK_SIZE, 0, 0, pieceImages, pieceConfig);
        }

        this.ctx.restore();
        this.drawVFX();
    }

    drawBlock(ctx, x, y, type, size, r, sx, sy, pieceImages, pieceConfig) {
        const color = COLORS[type];
        // Neon glow shadow
        ctx.save();
        ctx.shadowBlur = 18;
        ctx.shadowColor = color;
        if (pieceImages[type] && sx !== null) {
            const img = pieceImages[type];
            const config = pieceConfig[type];
            const sw = img.width / config.gridW;
            const sh = img.height / config.gridH;
            ctx.translate(Math.round((x + 0.5) * size), Math.round((y + 0.5) * size));
            ctx.rotate((r - config.assetRot) * Math.PI / 2);
            ctx.fillStyle = color;
            ctx.fillRect(-size / 2, -size / 2, size, size);
            ctx.shadowBlur = 0;
            ctx.drawImage(img, sx * sw, sy * sh, sw, sh, -size / 2, -size / 2, size + 1.2, size + 1.2);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(x * size, y * size, size, size);
            ctx.shadowBlur = 0;
        }
        ctx.restore();
        // 3D edge highlight
        ctx.save();
        const px = (pieceImages[type] && sx !== null) ? (x - 0.5) * size : x * size;
        const py = (pieceImages[type] && sx !== null) ? (y - 0.5) * size : y * size;
        const bx = x * size, by = y * size;
        ctx.fillStyle = 'rgba(255,255,255,0.22)';
        ctx.fillRect(bx, by, size, 3);
        ctx.fillRect(bx, by, 3, size);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(bx, by + size - 3, size, 3);
        ctx.fillRect(bx + size - 3, by, 3, size);
        ctx.restore();
    }

    drawPiece(ctx, piece, size, panelOffsetX, panelOffsetY, pieceImages, pieceConfig) {
        if (!piece || !pieceImages[piece.type]) return;
        const type = piece.type;
        const config = pieceConfig[type];
        const pivot = (type === 'I') ? 2.0 : (type === 'O') ? 1.0 : 1.5;

        ctx.save();
        ctx.translate(Math.round((piece.x + pivot) * size + panelOffsetX), Math.round((piece.y + pivot) * size + panelOffsetY));
        ctx.rotate((piece.rotation - config.assetRot) * Math.PI / 2);
        ctx.drawImage(pieceImages[type], (config.minX - pivot) * size, (config.minY - pivot) * size, config.gridW * size, config.gridH * size);
        ctx.restore();
    }

    triggerShake(intensity = 8) { this.shakeIntensity = intensity; }

    createParticles(x, y, color) {
        for (let i = 0; i < 6; i++) {
            this.particles.push({
                x: x * BLOCK_SIZE + Math.random() * BLOCK_SIZE,
                y: y * BLOCK_SIZE + Math.random() * BLOCK_SIZE,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 2,
                radius: Math.random() * 3 + 1,
                color: color,
                life: 1.0
            });
        }
    }

    updateVFX() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.life -= 0.03;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
        if (this.shakeIntensity > 0) this.shakeIntensity *= 0.85;
        if (this.shakeIntensity < 0.1) this.shakeIntensity = 0;
    }

    drawVFX() {
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    animateCelebration() {
        this.celebrationCtx.clearRect(0, 0, this.celebrationCanvas.width, this.celebrationCanvas.height);

        // Handle Tetris Shader Effect separately
        if (this.activeTetrisEffect) {
            const now = Date.now();
            const elapsed = now - this.activeTetrisEffect.startTime;
            const duration = 3000;
            const progress = elapsed / duration;

            if (progress >= 1) {
                this.activeTetrisEffect = null;
                this.tetrisCanvas.style.opacity = 0;
            } else {
                this.tetrisCanvas.style.opacity = progress < 0.1 ? progress / 0.1 : (progress > 0.8 ? 1 - (progress - 0.8) / 0.2 : 1);
                this.renderTetrisShader(now, progress);
                this.drawTetrisText(progress);
            }
            return; // Skip normal celebration if Tetris shader is active
        }

        if (!this.activeCelebration) return;

        const progress = (Date.now() - this.activeCelebration.startTime) / 1500;
        if (progress >= 1) { this.activeCelebration = null; return; }

        const centerX = this.celebrationCanvas.width / 2;
        const centerY = this.celebrationCanvas.height / 2;
        let scale = progress < 0.3 ? 0.5 + (progress / 0.3) * 1.5 : (progress < 0.6 ? 2 - ((progress - 0.3) / 0.3) * 0.5 : 1.5);
        this.celebrationCtx.globalAlpha = progress > 0.7 ? 1 - ((progress - 0.7) / 0.3) : 1;

        const fontSize = Math.floor(60 * scale);
        this.draw8BitText(this.activeCelebration.text, centerX + 4, centerY + 4, fontSize, '#000000');
        this.draw8BitText(this.activeCelebration.text, centerX, centerY, fontSize, this.activeCelebration.color);

        for (let i = 0; i < 5; i++) {
            const sprite = Math.floor(progress * 10) % 2 === 0 ? 'vaultBoy1' : 'vaultBoy2';
            const personY = centerY + 100 - Math.abs(Math.sin(progress * Math.PI * 4 + i)) * 60;
            this.drawSprite(sprite, centerX + (i - 2) * 140, personY, 5, SPRITE_COLORS, this.celebrationCtx);
        }
        this.celebrationCtx.globalAlpha = 1;
    }

    renderTetrisShader(now, progress) {
        if (!this.tetrisGl) return;
        const gl = this.tetrisGl;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(this.tetrisTimeLoc, (now % 1000000) / 1000);
        gl.uniform2f(this.tetrisResLoc, this.tetrisCanvas.width, this.tetrisCanvas.height);
        gl.uniform1f(this.tetrisAlphaLoc, progress < 0.2 ? progress / 0.2 : (progress > 0.8 ? (1 - progress) / 0.2 : 1.0));
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    drawTetrisText(progress) {
        const ctx = this.celebrationCtx;
        const centerX = this.celebrationCanvas.width / 2;
        const centerY = this.celebrationCanvas.height / 2;

        ctx.save();
        ctx.globalAlpha = progress < 0.2 ? progress / 0.2 : (progress > 0.8 ? (1 - progress) / 0.2 : 1.0);

        const scale = 1.0 + Math.sin(progress * Math.PI * 2) * 0.05;
        const width = 800 * scale;
        const height = 240 * scale;

        // 1. Glass Panel (Frosted background)
        ctx.save();
        ctx.shadowBlur = 40;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.2)';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        this.fillRoundedRect(ctx, centerX - width / 2, centerY - height / 2, width, height, 30);
        ctx.restore();

        // 2. Glass Edge (Border with slight highlight)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        this.strokeRoundedRect(ctx, centerX - width / 2, centerY - height / 2, width, height, 30);

        // 3. Inner Shine/Highlight
        const gradient = ctx.createLinearGradient(centerX - width / 2, centerY - height / 2, centerX + width / 2, centerY + height / 2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
        ctx.fillStyle = gradient;
        this.fillRoundedRect(ctx, centerX - width / 2, centerY - height / 2, width, height, 30);

        // 4. Elegant Text
        ctx.font = `900 ${Math.floor(130 * scale)}px Orbitron`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.letterSpacing = "20px";

        // Text Shadow for depth
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';

        // Main Text Color (Bright Cyan w/ transparency)
        ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
        ctx.fillText('TETRIS', centerX + 10, centerY);

        // Metallic Text Highlight
        const textGrad = ctx.createLinearGradient(centerX, centerY - 50, centerX, centerY + 50);
        textGrad.addColorStop(0, '#ffffff');
        textGrad.addColorStop(0.5, '#00f0ff');
        textGrad.addColorStop(1, '#0090ff');
        ctx.fillStyle = textGrad;
        ctx.fillText('TETRIS', centerX, centerY);

        ctx.restore();
    }

    fillRoundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();
    }

    strokeRoundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.stroke();
    }

    draw8BitText(text, x, y, size, color) {
        this.celebrationCtx.fillStyle = color;
        this.celebrationCtx.font = `${size}px monospace`;
        this.celebrationCtx.textAlign = 'center';
        this.celebrationCtx.textBaseline = 'middle';
        this.celebrationCtx.fillText(text, x, y);
    }

    drawSprite(sprite, x, y, scale, colors, ctx) {
        const data = SPRITES[sprite];
        if (!data) return;
        for (let r = 0; r < data.length; r++) {
            for (let c = 0; c < data[r].length; c++) {
                if (data[r][c] > 0) {
                    ctx.fillStyle = colors[data[r][c]] || '#fff';
                    ctx.fillRect(x + c * scale, y + r * scale, scale, scale);
                }
            }
        }
    }

    startCelebration(lines) {
        if (lines === 4) {
            this.activeTetrisEffect = {
                startTime: Date.now()
            };
            this.tetrisCanvas.style.opacity = 1;
            return;
        }

        const msg = CHEER_MESSAGES[Math.floor(Math.random() * CHEER_MESSAGES.length)];
        this.activeCelebration = {
            text: lines > 1 ? `${msg} x${lines}!` : msg,
            color: Object.values(VAULT_COLORS)[Math.floor(Math.random() * 6)],
            startTime: Date.now()
        };
    }
}
