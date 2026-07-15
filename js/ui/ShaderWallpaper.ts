/**
 * WINDOWS 95 APP CENTER - SHADER WALLPAPER (MULTIPASS)
 * Renders GLSL shaders as desktop background with FBO support
 * Version: 2.0 (Multipass Shadertoy compatibility)
 */

import { Utils } from '../utils';
import { Services } from '../core/ServiceContainer';
import {
    SHADER_WIN95,
    SHADER_MODERN
} from './ThemeShaders';

export interface IShaderWallpaper {
    init(canvasId: string): void;
    start(): void;
    stop(): void;
    destroy(): void;
    setVisibility(visible: boolean): void;
    setFragmentShader(themeName: string): void;
    isVisible(): boolean;
    isRunning(): boolean;
}

const ShaderWallpaper: IShaderWallpaper = (() => {
    'use strict';

    let canvas: HTMLCanvasElement | null = null;
    let gl: WebGLRenderingContext | null = null;
    let positionBuffer: WebGLBuffer | null = null;
    let startTime: number = 0;
    let animationFrameId: number | null = null;
    let isRunning = false;
    let isVisible = true;
    let frameCount = 0;
    let resizeListenerAttached = false;

    const vsSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    // Represents a single Shadertoy pass (Buffer or Image)
    class RenderPass {
        gl: WebGLRenderingContext;
        isBuffer: boolean;
        program: WebGLProgram | null;
        positionLocation: number = -1;
        resolutionLoc: WebGLUniformLocation | null = null;
        timeLoc: WebGLUniformLocation | null = null;
        frameLoc: WebGLUniformLocation | null = null;
        channelLocs: (WebGLUniformLocation | null)[] = [];
        fbos: { fbo: WebGLFramebuffer | null, tex: WebGLTexture | null, width: number, height: number }[] = [];
        pingPong: number = 0;

        constructor(glContext: WebGLRenderingContext, fsSource: string, isBuffer: boolean) {
            this.gl = glContext;
            this.isBuffer = isBuffer;
            this.program = this.createProgram(this.gl, vsSource, fsSource);
            if (!this.program) return;

            this.positionLocation = this.gl.getAttribLocation(this.program, "a_position");
            this.resolutionLoc = this.gl.getUniformLocation(this.program, "iResolution");
            this.timeLoc = this.gl.getUniformLocation(this.program, "iTime");
            this.frameLoc = this.gl.getUniformLocation(this.program, "iFrame");

            this.channelLocs = [
                this.gl.getUniformLocation(this.program, "iChannel0"),
                this.gl.getUniformLocation(this.program, "iChannel1"),
                this.gl.getUniformLocation(this.program, "iChannel2"),
                this.gl.getUniformLocation(this.program, "iChannel3")
            ];

            if (isBuffer) {
                this.fbos = [this.createFBO(), this.createFBO()];
                this.pingPong = 0;
            }
        }

        createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("[ShaderWallpaper] Shader compile error:", gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        createProgram(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram | null {
            const vShader = this.createShader(gl, gl.VERTEX_SHADER, vs);
            const fShader = this.createShader(gl, gl.FRAGMENT_SHADER, fs);
            if (!vShader || !fShader) return null;

            const program = gl.createProgram();
            if (!program) return null;
            gl.attachShader(program, vShader);
            gl.attachShader(program, fShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error("[ShaderWallpaper] Link error:", gl.getProgramInfoLog(program));
                return null;
            }
            return program;
        }

        createFBO(): { fbo: WebGLFramebuffer | null, tex: WebGLTexture | null, width: number, height: number } {
            const gl = this.gl;
            const tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            // Default size, will be resized on render
            const w = Math.max(1, gl.canvas.width);
            const h = Math.max(1, gl.canvas.height);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            const fbo = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

            return { fbo, tex, width: w, height: h };
        }

        resizeFBOs(): void {
            if (!this.isBuffer) return;
            const gl = this.gl;
            const w = Math.max(1, gl.canvas.width);
            const h = Math.max(1, gl.canvas.height);
            for (let i = 0; i < 2; i++) {
                const fbo = this.fbos[i];
                if (fbo && (fbo.width !== w || fbo.height !== h)) {
                    gl.bindTexture(gl.TEXTURE_2D, fbo.tex);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                    fbo.width = w;
                    fbo.height = h;
                }
            }
        }

        render(time: number, frameCount: number, inputs: ({ tex: WebGLTexture | null, type: number } | null)[]): void {
            if (!this.program) return;
            const gl = this.gl;

            this.resizeFBOs();

            // Bind FBO or Screen
            if (this.isBuffer) {
                const fboIndex = 1 - this.pingPong;
                const fbo = this.fbos[fboIndex];
                if (fbo) {
                    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
                }
            } else {
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            }

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.useProgram(this.program);

            gl.enableVertexAttribArray(this.positionLocation);
            if (positionBuffer) {
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
            }

            // Uniforms
            gl.uniform2f(this.resolutionLoc, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(this.timeLoc, time);
            gl.uniform1f(this.frameLoc, frameCount);

            // Bind Inputs (Textures from other buffers)
            // Inputs array: [A_tex, B_tex, C_tex, D_tex]
            for (let i = 0; i < 4; i++) {
                const input = inputs[i];
                const channelLoc = this.channelLocs[i];
                if (input && input.tex && channelLoc !== undefined) {
                    gl.activeTexture(gl.TEXTURE0 + i);
                    gl.bindTexture(input.type, input.tex);
                    gl.uniform1i(channelLoc, i);
                }
            }

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            if (this.isBuffer) {
                this.pingPong = 1 - this.pingPong;
            }
        }

        getOutputTexture(): { tex: WebGLTexture | null, type: number } | null {
            if (!this.isBuffer) return null;
            const fbo = this.fbos[this.pingPong];
            return fbo ? { tex: fbo.tex, type: this.gl.TEXTURE_2D } : null;
        }

        destroy(): void {
            if (this.program) this.gl.deleteProgram(this.program);
            if (this.isBuffer && this.fbos) {
                for (let i = 0; i < 2; i++) {
                    const fbo = this.fbos[i];
                    if (fbo) {
                        if (fbo.tex) this.gl.deleteTexture(fbo.tex);
                        if (fbo.fbo) this.gl.deleteFramebuffer(fbo.fbo);
                    }
                }
            }
        }
    }


    let passes: RenderPass[] = [];

    function init(canvasId: string): void {
        destroy();

        canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            console.error("[ShaderWallpaper] Canvas not found:", canvasId);
            return;
        }

        gl = canvas.getContext("webgl", { alpha: false, preserveDrawingBuffer: false });
        if (!gl) {
            console.error("[ShaderWallpaper] WebGL not supported");
            return;
        }

        // Full screen quad
        positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        window.addEventListener('resize', resizeCanvas);
        resizeListenerAttached = true;
        resizeCanvas();

        loadThemeShaders();

        startTime = performance.now();
        frameCount = 0;
        start();

        Utils.Logger.log("[ShaderWallpaper] Initialized Multipass Engine");
    }

    function loadThemeShaders(forceTheme?: string): void {
        if (!gl) return; // Wait until init is called properly

        // Destroy old passes
        try {
            passes.forEach(p => p.destroy());
        } catch (e) {
            console.error("[ShaderWallpaper] Failed destroying old passes:", e);
        }
        passes = [];
        frameCount = 0; // Reset frame count on shader swap

        const tm: any = Services.get('ThemeManager');
        const currentTheme = forceTheme || (tm ? tm.currentTheme : 'win95');

        if (currentTheme === 'modern') {
            passes.push(new RenderPass(gl, SHADER_MODERN, false));
        } else {
            passes.push(new RenderPass(gl, SHADER_WIN95, false));
        }
    }

    function resizeCanvas(): void {
        if (!canvas) return;
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }
    }

    function render(time: number): void {
        if (!gl || passes.length === 0) return;
        if (!canvas) return;

        if (canvas.width === 0 || canvas.height === 0) {
            resizeCanvas();
        }

        // If still 0 after resize attempt, wait until it's visible to render
        if (canvas.width === 0 || canvas.height === 0) {
            if (isRunning) animationFrameId = requestAnimationFrame(render);
            return;
        }

        const t = (time - startTime) * 0.001;
        const firstPass = passes[0];
        if (firstPass) {
            firstPass.render(t, frameCount, []);
        }

        frameCount++;

        if (isRunning) {
            animationFrameId = requestAnimationFrame(render);
        }
    }

    function start(): void {
        if (!isRunning) {
            isRunning = true;
            animationFrameId = requestAnimationFrame(render);
        }
    }

    function stop(): void {
        isRunning = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    function destroy(): void {
        stop();

        if (resizeListenerAttached) {
            window.removeEventListener('resize', resizeCanvas);
            resizeListenerAttached = false;
        }

        try {
            passes.forEach((pass) => pass.destroy());
        } finally {
            passes = [];
        }

        if (gl && positionBuffer && typeof gl.deleteBuffer === 'function') {
            gl.deleteBuffer(positionBuffer);
        }

        canvas = null;
        gl = null;
        positionBuffer = null;
        startTime = 0;
        frameCount = 0;
        isVisible = true;
    }

    function setVisibility(visible: boolean): void {
        isVisible = visible;
        if (canvas) {
            canvas.style.display = visible ? 'block' : 'none';
            if (visible && !document.hidden) {
                start();
            } else {
                stop();
            }
        }
    }

    // Called by ThemeManager
    function setFragmentShader(themeName: string): void {
        loadThemeShaders(themeName);
    }

    return {
        init,
        start,
        stop,
        destroy,
        setVisibility,
        setFragmentShader, // Now expects theme name instead of source
        isVisible: () => isVisible,
        isRunning: () => isRunning
    };

})();

export { ShaderWallpaper };

if (typeof window !== 'undefined') {
    Services.register('ShaderWallpaper', ShaderWallpaper);
}
