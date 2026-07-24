/**
 * Theme Shaders
 * Holds fragment shader GLSL code for different OS themes.
 */


/**
 * Converts a CSS hex colour to a GLSL vec3 literal.
 * Accepts `#rgb` and `#rrggbb`, with or without surrounding whitespace —
 * getPropertyValue returns the token verbatim, leading space included.
 */
export function hexToVec3(hex: string): string | null {
    const m = hex.trim().replace(/^#/, '');
    const full = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
    if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
    const c = (i: number) => (parseInt(full.slice(i, i + 2), 16) / 255).toFixed(4);
    return `vec3(${c(0)}, ${c(2)}, ${c(4)})`;
}

/** The palette the shader needs, and the CSS token each one comes from. */
const SHADER_PALETTE = {
    BLUE_DEEP: { token: '--hados-blue-deep', fallback: '#0b5ed7' },
    BLUE_MID: { token: '--hados-blue', fallback: '#3b9bf0' },
    BLUE_LIGHT: { token: '--hados-blue-light', fallback: '#7fd2ff' },
    BG_TOP: { token: '--hados-bg', fallback: '#0b0e13' },
} as const;

/**
 * Reads the brand palette out of the live CSS custom properties.
 *
 * The theme owns the palette. These values used to be hand-copied into the GLSL
 * as literals, which meant editing --hados-blue in the stylesheet quietly left
 * the wallpaper on the old colour, with nothing to catch it.
 *
 * Falls back to the shipped values if a token is missing or malformed — a
 * wallpaper that renders in slightly stale blues beats a black screen.
 */
export function readShaderPalette(read?: (token: string) => string): Record<string, string> {
    const get = read ?? ((token: string) => {
        try {
            return getComputedStyle(document.body).getPropertyValue(token);
        } catch {
            return '';
        }
    });

    const out: Record<string, string> = {};
    for (const [name, { token, fallback }] of Object.entries(SHADER_PALETTE)) {
        out[name] = hexToVec3(get(token)) ?? hexToVec3(fallback)!;
    }
    return out;
}

/**
 * HadOS Shader — the brand mark, drawn rather than blitted.
 *
 * The Win95 wallpaper it replaces built its flag procedurally in GLSL; this does
 * the same for the HadOS H, so the wallpaper stays a few KB of source, resolution
 * independent, and animated for free.
 *
 * The mark is a raymarched extrusion: two uprights and a crossbar as rounded
 * boxes, unioned into one solid, lit with a key light, a blue rim and a fresnel
 * edge to echo the bevels of the logo render. It drifts rather than spins — this
 * sits behind a desktop all day, so the motion has to be ignorable.
 *
 * Budget: 72 march steps against three boxes. That is well under SHADER_MODERN,
 * which raymarches 40 layers of noise.
 *
 * Built rather than declared: the palette is injected from the theme's CSS tokens
 * at compile time, so there is one source of truth for the HadOS blues. The
 * shader is recompiled whenever the theme changes, which is exactly when the
 * palette could have moved.
 */
export function buildHadosShader(palette: Record<string, string> = readShaderPalette()): string {
    return `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;

#define PI 3.1415926535897932384626433832795

// Injected from the CSS custom properties — see readShaderPalette().
#define BLUE_DEEP  ${palette.BLUE_DEEP}
#define BLUE_MID   ${palette.BLUE_MID}
#define BLUE_LIGHT ${palette.BLUE_LIGHT}
#define BG_TOP     ${palette.BG_TOP}
// The backdrop's darker end, derived from the surface colour rather than
// declared: a shade below BG_TOP.
#define BG_BOTTOM  (BG_TOP * 0.5)
${SHADER_HADOS_BODY}`;
}

/** Everything below the palette. Concatenated by buildHadosShader(). */
const SHADER_HADOS_BODY = `
mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

float sdRoundBox(vec3 p, vec3 b, float r) {
    vec3 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

/** The H: two uprights joined by a crossbar, extruded along z. */
float sdH(vec3 p) {
    const float stem = 0.17;   // half-width of an upright
    const float tall = 0.62;   // half-height
    const float gap = 0.36;    // upright offset from centre
    const float deep = 0.14;   // half-depth of the extrusion
    const float bevel = 0.035; // rounding that catches the light

    float left  = sdRoundBox(p - vec3(-gap, 0.0, 0.0), vec3(stem, tall, deep), bevel);
    float right = sdRoundBox(p - vec3( gap, 0.0, 0.0), vec3(stem, tall, deep), bevel);
    float bar   = sdRoundBox(p, vec3(gap, 0.115, deep * 0.82), bevel);
    return min(min(left, right), bar);
}

float map(vec3 p) {
    // Slow, shallow drift. Never a full turn: the mark should read as itself.
    p.xz *= rot(sin(iTime * 0.18) * 0.55);
    p.yz *= rot(sin(iTime * 0.13) * 0.20);
    p.y -= sin(iTime * 0.35) * 0.03;
    return sdH(p);
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.0015, 0.0);
    return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
    ));
}

vec4 fft(float time) {
    // Generate organic procedural frequency bands (bass, mid, high, presence)
    float bass = 0.5 + 0.3 * sin(time * 1.5) + 0.2 * cos(time * 2.8);
    float mid = 0.4 + 0.25 * sin(time * 2.1 + 1.0) + 0.15 * cos(time * 0.9);
    float high = 0.3 + 0.2 * sin(time * 3.8 + 0.5) + 0.1 * sin(time * 7.5);
    float presence = 0.5 + 0.3 * cos(time * 0.8 + 2.0);
    return vec4(bass, mid, high, presence);
}

vec3 safe_tanh(vec3 x) {
    vec3 e = exp(clamp(x, -20.0, 20.0));
    vec3 em = exp(clamp(-x, -20.0, 20.0));
    return (e - em) / (e + em);
}

vec3 getVolumetricBg(vec2 fragCoord, float time) {
    vec2 R = iResolution.xy;
    float T = time;
    
    // Setup camera ray direction
    vec3 r = normalize(vec3(fragCoord * 2.0 - R, R.x));
    
    // Rotate screenspace XY slightly with time
    float rotAngle = T * 0.08;
    float c = cos(rotAngle), s = sin(rotAngle);
    r.xy *= mat2(c, -s, s, c);
    
    vec3 O = vec3(0.0);
    float t = 0.0;
    float v = 0.0;
    
    vec4 f = fft(T);
    
    // 64 raymarching steps for a perfect balance of quality and performance
    for (int i = 0; i < 64; i++) {
        vec3 p = t * r;
        
        // Twist along Z
        float zRot = p.z * 1.2;
        float cz = cos(zRot), sz = sin(zRot);
        p.xy *= mat2(cz, -sz, sz, cz);
        
        // Warp coordinates fluidly
        float a1 = 5.0 * sin(T * 0.1 + length(p)) * 0.3;
        vec4 c1 = cos(a1 + vec4(0.0, 11.0, 33.0, 0.0));
        mat2 m1 = mat2(c1.x, c1.y, c1.z, c1.w);
        p += vec3(vec2(0.05, sin(p.z * 0.01 + 15.0) * 0.42) * m1, T * 0.2);
        
        p.x -= T * 0.05;
        p = fract(p.zxy - 0.5) - 0.5;
        
        for (int j = 0; j < 6; j++) {
            p = abs(p.xzy);
            p *= 1.55;
            p.x -= 1.45;
        }
        
        v = abs(min(length(p.xz * 0.5 + 0.2 - smoothstep(0.0, 1.0, f.y) * 0.4 + p.x * 0.5), length(p.zy * 0.1 + p.y * 0.5)) + 0.02) / 250.0;
        t += v;
        
        vec3 basePalette = mix(BLUE_DEEP, BLUE_MID, 0.5 + 0.5 * cos(6.28 * (sin(length(p * 0.4)) + p.z * 0.15 + r.y * 0.5)));
        vec3 glowColor = mix(basePalette, BLUE_LIGHT, 0.3 * (1.0 + sin(T * 0.2)));
        O += exp(1.8 * glowColor) / v;
    }
    
    float pulse = pow(length(sin(r.xy * 4.0 + T * 0.4)), 2.0 * f.z);
    vec3 col = safe_tanh(O * O / 1e12 / max(pulse, 0.01)) * 1.5;
    
    vec3 desktopBg = mix(BG_BOTTOM, BG_TOP, fragCoord.y / R.y);
    return desktopBg + col * 0.45;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    // Render the procedural volumetric background
    vec3 col = getVolumetricBg(gl_FragCoord.xy, iTime);

    vec3 ro = vec3(0.0, 0.0, 2.6);
    vec3 rd = normalize(vec3(uv, -1.6));

    float t = 0.0;
    float hit = 0.0;
    for (int i = 0; i < 72; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        if (d < 0.001) { hit = 1.0; break; }
        if (t > 6.0) break;
        t += d;
    }

    if (hit > 0.5) {
        vec3 p = ro + rd * t;
        vec3 n = calcNormal(p);
        vec3 v = -rd;

        vec3 key = normalize(vec3(-0.5, 0.8, 0.7));
        float diff = max(dot(n, key), 0.0);
        float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
        float spec = pow(max(dot(reflect(-key, n), v), 0.0), 48.0);

        // Faces read deep blue, edges catch the light — the chiselled look.
        vec3 mat = mix(BLUE_DEEP, BLUE_MID, diff);
        mat = mix(mat, BLUE_LIGHT, fres * 0.7);
        mat += BLUE_LIGHT * spec * 0.5;
        mat += BLUE_DEEP * 0.25; // ambient, so the dark side is never a hole

        col = mat;
    }

    // Vignette settles the edges.
    col *= 1.0 - 0.25 * dot(uv, uv);

    gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Modern-theme wallpaper — the HadOS technical grid.
 *
 * Replaces the old raymarcher that literally drew Windows window-frames in blue
 * (`//windows`, WBCOL/WBCOL2) — the last visible Windows trace on the desktop.
 *
 * Adapted from the proposed Shadertoy fragment for this engine's WebGL1 / GLSL
 * ES 1.00 context: precision header + a `main()` that forwards to `mainImage`,
 * `iMouse` dropped (unused, and the engine never binds it), and — the one real
 * porting hazard — `grid()` rewritten WITHOUT `fwidth`. The context does not
 * enable `OES_standard_derivatives`, so a derivative call would fail to compile
 * and paint a black screen. Instead the per-pixel line width is passed in: one
 * unit of the screen-normalised `uv` (divided by iResolution.y) spans exactly
 * `1.0/iResolution.y` pixels, and the sub-grid samples a pre-scaled uv, so each
 * call passes its own `|d uv / d pixel|` and lines stay ~1px crisp at any scale.
 */
export const SHADER_MODERN = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;

// Subtle geometric grid. \`aa\` is the screen-space size of one uv unit
// (|d uv / d pixel|); scale*aa is the fwidth the original derived, so the lines
// render ~1px without needing the derivatives extension.
float grid(vec2 uv, float scale, float aa) {
    vec2 px = vec2(scale * aa);
    vec2 g = abs(fract(uv * scale - 0.5) - 0.5) / px;
    float line = min(g.x, g.y);
    return 1.0 - min(line, 1.0);
}

mat2 rotate2D(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Screen-normalised coordinates, centred at (0,0). Dividing by y means one
    // uv unit spans iResolution.y pixels — the basis for the grid line width.
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    float aa = 1.0 / iResolution.y;

    // Slow organic drift.
    vec2 st = uv * rotate2D(0.1 * sin(iTime * 0.15));

    // HadOS dark palette.
    vec3 bgColor   = vec3(0.04, 0.05, 0.07); // ultra-dark night blue
    vec3 gridColor = vec3(0.12, 0.16, 0.22); // subtle metallic grid
    vec3 glowColor = vec3(0.20, 0.35, 0.55); // technical cyan/blue glow

    // Main grid + a finer secondary grid (uv pre-scaled x2 → 2*aa line width).
    float mainGrid = grid(st + vec2(iTime * 0.01, iTime * 0.005), 4.0, aa);
    float subGrid  = grid(st * 2.0 + vec2(-iTime * 0.015, iTime * 0.01), 8.0, 2.0 * aa) * 0.3;

    // Soft vignette + a dispersed central pulse (simplified glow).
    float dist = length(uv);
    float vignette = smoothstep(1.2, 0.2, dist);
    float pulse = 0.5 + 0.5 * sin(iTime * 0.8 - dist * 3.0);
    float ambientGlow = (0.05 / (dist + 0.3)) * pulse;

    // Composite.
    vec3 finalColor = bgColor;
    finalColor += gridColor * (mainGrid + subGrid) * 0.4;
    finalColor += glowColor * ambientGlow * 0.25;
    finalColor *= vignette;

    fragColor = vec4(finalColor, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;
