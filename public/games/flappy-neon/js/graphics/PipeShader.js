export class PipeShader {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 256;
        this.canvas.height = 256;
        this.gl = null;
        this.program = null;
        this._init();
    }

    _init() {
        const gl = this.canvas.getContext('webgl', { antialias: false, alpha: false });
        if (!gl) { console.warn('PipeShader: WebGL not available'); return; }
        this.gl = gl;

        const vs = `
            attribute vec2 a_pos;
            void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
        `;

        const fs = `
            precision mediump float;
            uniform float u_time;
            uniform vec3  u_col1;
            uniform vec3  u_col2;

            #define BUBBLE_SIZE 12.0
            #define MOD3 vec3(.1031,.11369,.13787)

            float hash12(vec2 p) {
                vec3 p3 = fract(vec3(p.xyx) * .1031);
                p3 += dot(p3, p3.yzx + 33.33);
                return fract((p3.x + p3.y) * p3.z);
            }

            vec3 hash33(vec3 p3) {
                p3 = fract(p3 * MOD3);
                p3 += dot(p3, p3.yxz + 19.19);
                return -1.0 + 2.0 * fract(vec3(
                    (p3.x + p3.y) * p3.z,
                    (p3.x + p3.z) * p3.y,
                    (p3.y + p3.z) * p3.x));
            }

            float simplex_noise(vec3 p) {
                const float K1 = 0.333333333;
                const float K2 = 0.166666667;
                vec3 i  = floor(p + (p.x + p.y + p.z) * K1);
                vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
                vec3 e  = step(vec3(0.0), d0 - d0.yzx);
                vec3 i1 = e * (1.0 - e.zxy);
                vec3 i2 = 1.0 - e.zxy * (1.0 - e);
                vec3 d1 = d0 - (i1 - K2);
                vec3 d2 = d0 - (i2 - 2.0 * K2);
                vec3 d3 = d0 - (1.0 - 3.0 * K2);
                vec4 h  = max(0.6 - vec4(dot(d0,d0), dot(d1,d1), dot(d2,d2), dot(d3,d3)), 0.0);
                vec4 n  = h*h*h*h * vec4(
                    dot(d0, hash33(i)),
                    dot(d1, hash33(i + i1)),
                    dot(d2, hash33(i + i2)),
                    dot(d3, hash33(i + 1.0)));
                return dot(vec4(31.316), n);
            }

            void main() {
                vec2 iResolution = vec2(256.0, 256.0);
                vec2 uv = (gl_FragCoord.xy - iResolution * 0.5) / iResolution.x;

                float SIZE = iResolution.x / BUBBLE_SIZE;
                float SF = 1.0 / min(iResolution.x, iResolution.y) * SIZE * 0.5;

                uv *= SIZE;
                vec2 id = floor(uv);
                uv = fract(uv) - 0.5;

                float mask = 0.0;
                for (float y = -2.0; y <= 2.0; y++) {
                    for (float x = -2.0; x <= 2.0; x++) {
                        vec2 rid = id - vec2(x, y);
                        vec2 ruv = uv + vec2(x, y)
                            + vec2(0.0, mod(rid, 2.0) * 0.5)
                            + vec2(0.0, sin(simplex_noise(vec3(rid * 0.075, u_time * 0.2)) * 10.0) * 2.0);
                        float l = length(ruv * 0.5);
                        float d = smoothstep(SF, -SF, l - 0.65) * (ruv.y);
                        mask = max(mask, d);
                    }
                }

                vec3 col = mix(u_col1, u_col2, abs(mask));
                gl_FragColor = vec4(col, 1.0);
            }
        `;

        const compile = (type, src) => {
            const s = gl.createShader(type);
            gl.shaderSource(s, src); gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s));
            return s;
        };
        const prog = gl.createProgram();
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
        gl.linkProgram(prog);
        this.program = prog;
        gl.useProgram(prog);

        // Full-quad geometry
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'a_pos');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        this.uTime = gl.getUniformLocation(prog, 'u_time');
        this.uCol1 = gl.getUniformLocation(prog, 'u_col1');
        this.uCol2 = gl.getUniformLocation(prog, 'u_col2');
    }

    /** Render the shader with specific colors. Call before drawing each pipe. */
    render(time, col1, col2) {
        const gl = this.gl;
        if (!gl) return;
        gl.uniform1f(this.uTime, time);
        gl.uniform3fv(this.uCol1, col1);
        gl.uniform3fv(this.uCol2, col2);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    /** Convert HSL hue to col1 (dark) and col2 (bright) [r,g,b] 0-1 arrays. */
    static hueToColors(hue) {
        const toRgb = (h, s, l) => {
            h /= 360; s /= 100; l /= 100;
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            const hue2rgb = (t) => {
                if (t < 0) t += 1; if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            return [hue2rgb(h + 1 / 3), hue2rgb(h), hue2rgb(h - 1 / 3)];
        };
        return {
            col1: toRgb(hue, 70, 12),   // dark base
            col2: toRgb(hue, 100, 72)   // bright highlight
        };
    }
}
