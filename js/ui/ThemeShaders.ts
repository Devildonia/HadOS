/**
 * Theme Shaders
 * Holds fragment shader GLSL code for different OS themes.
 */

// Classic Win95 Shader (Seaverse default logo/trail)
export const SHADER_WIN95 = `
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932384626433832795

uniform vec2 iResolution;
uniform float iTime;

const float wave_amplitude = 0.076;
const float period = 2.*PI;

float wave_phase() {
    return iTime;
}

float square(vec2 st) {
    vec2 bl = step(vec2(0.), st);       // bottom-left
    vec2 tr = step(vec2(0.),1.0-st);   // top-right
    return bl.x * bl.y * tr.x * tr.y;
}

vec4 frame(vec2 st) {
    float tushka = square(st*mat2((1./.48), 0., 0., (1./.69)));
    
    mat2 sector_mat = mat2(1./.16, 0., 0., 1./.22);
    float sectors[4];
    sectors[0] = square(st * sector_mat + (1./.16)*vec2(0.000,-0.280));
    sectors[1] = square(st * sector_mat + (1./.16)*vec2(0.000,-0.060));
    sectors[2] = square(st * sector_mat + (1./.16)*vec2(-0.240,-0.280));
    sectors[3] = square(st * sector_mat + (1./.16)*vec2(-0.240,-0.060));
    vec3 sector_colors[4];
    sector_colors[0] = vec3(0.941, 0.439, 0.404) * sectors[0];
    sector_colors[1] = vec3(0.435, 0.682, 0.843) * sectors[1];
    sector_colors[2] = vec3(0.659, 0.808, 0.506) * sectors[2];
    sector_colors[3] = vec3(0.996, 0.859, 0.114) * sectors[3];
    
    return vec4(vec3(sector_colors[0] + sector_colors[1] +
                     sector_colors[2] + sector_colors[3]), tushka);
}

vec4 trail_piece(vec2 st, vec2 index, float scale) {
    scale = index.x * 0.082 + 0.452;
    
    vec3 color;
    if (index.y > 0.9 && index.y < 2.1 ) {
        color = vec3(0.435, 0.682, 0.843);
        scale *= .8;
    } else if (index.y > 3.9 && index.y < 5.1) {
        color = vec3(0.941, 0.439, 0.404);
        scale *= .8;
    } else {
        color = vec3(0., 0., 0.);
    }
    
    float scale1 = 1./scale;
    float shift = - (1.-scale) / (2. * scale);
    vec2 st2 = vec2(vec3(st, 1.) * mat3(scale1, 0., shift, 0., scale1, shift, 0., 0., 1.));
    float mask = square(st2);

    return vec4( color, mask );
}

vec4 trail(vec2 st) {
    const float piece_height = 7. / .69;
    const float piece_width = 6. / .54;
  
    st.x = 1.2760 * pow(st.x, 3.0) - 1.4624 * st.x*st.x + 1.4154 * st.x;
    
    float x_at_cell = floor(st.x*piece_width)/piece_width;
    float x_at_cell_center = x_at_cell + 0.016;
    float incline = cos(0.5*period + wave_phase()) * wave_amplitude;
    
    float offset = sin(x_at_cell_center*period + wave_phase())* wave_amplitude + 
        incline*(st.x-x_at_cell)*5.452;
    
    float mask = step(offset, st.y) * (1.-step(.69+offset, st.y)) * step(0., st.x);
    
    vec2 cell_coord = vec2((st.x - x_at_cell) * piece_width,
                           fract((st.y-offset) * piece_height));
    vec2 cell_index = vec2(x_at_cell * piece_width, 
                           floor((st.y-offset) * piece_height));
    
    vec4 pieces = trail_piece(cell_coord, cell_index, 0.752);
    
    return vec4(vec3(pieces), pieces.a * mask);
}

vec4 logo(vec2 st) {
    if (st.x <= .54) {
        return trail(st);
    } else {
        vec2 st2 = st + vec2(0., -sin(st.x*period + wave_phase())*wave_amplitude);
        return frame(st2 + vec2(-.54, 0));
    }
}

void main() {
    vec4 fragColor;
    vec2 fragCoord = gl_FragCoord.xy;
    
    vec2 st = fragCoord.xy/iResolution.xy;
    st.x *= iResolution.x/iResolution.y;

    st += vec2(.0);
    st *= 1.472;
    st += vec2(-0.7,-0.68);
    float rot = PI*-0.124;
    st *= mat2(cos(rot), sin(rot), -sin(rot), cos(rot));
    vec3 color = vec3(1.);
    
    vec4 logo_ = logo(st);    
    fragColor = mix(vec4(0.,.5,.5,1.000), logo_, logo_.a);
    
    gl_FragColor = fragColor;
}
`;

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
 */
export const SHADER_HADOS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;

#define PI 3.1415926535897932384626433832795

// Brand palette, matching the CSS tokens in theme-hados.css.
#define BLUE_DEEP  vec3(0.043, 0.369, 0.843)
#define BLUE_MID   vec3(0.231, 0.608, 0.941)
#define BLUE_LIGHT vec3(0.498, 0.824, 1.000)
#define BG_TOP     vec3(0.043, 0.055, 0.075)
#define BG_BOTTOM  vec3(0.020, 0.027, 0.039)

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

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    // Backdrop: a vertical fade with a soft blue pool behind the mark, so the
    // desktop has depth without competing with the icons on top of it.
    float grad = gl_FragCoord.y / iResolution.y;
    vec3 col = mix(BG_BOTTOM, BG_TOP, grad);
    col += BLUE_DEEP * 0.14 * exp(-2.6 * dot(uv, uv));

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

// Modern UI Shader (Provided cool geometric raymarching effect)
export const SHADER_MODERN = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;

#define PI     3.1415926535897921284
#define REP    40
#define d2r(x) (x * PI / 180.0)
#define WBCOL  (vec3(0.5, 0.7,  1.7))
#define WBCOL2 (vec3(0.15, 0.8, 1.7))
// We don't have iFrame passed as uniform currently, simulating it as 0
#define ZERO   0

float hash( vec2 p ) {
	float h = dot( p, vec2( 127.1, 311.7 ) );
	return fract( sin( h ) * 458.325421) * 2.0 - 1.0;
}

float noise( vec2 p ) {
	vec2 i = floor( p );
	vec2 f = fract( p );
	
	f = f * f * ( 3.0 - 2.0 * f );
	
	return mix(
		mix( hash( i + vec2( 0.0, 0.0 ) ), hash( i + vec2( 1.0, 0.0 ) ), f.x ),
		mix( hash( i + vec2( 0.0, 1.0 ) ), hash( i + vec2( 1.0, 1.0 ) ), f.x ),
		f.y
	);
}

vec2 rot(vec2 p, float a) {
	return vec2(
		p.x * cos(a) - p.y * sin(a),
		p.x * sin(a) + p.y * cos(a));
}

float nac(vec3 p, vec2 F, vec3 o) {
	const float R = 0.0001;
	p += o;
	return length(max(abs(p.xy)-vec2(F),0.0)) - R;	
}

float by(vec3 p, float F, vec3 o) {
	const float R = 0.0001;
	p += o;
	return length(max(abs(mod(p.xy, 3.0))-F,0.0)) - R;	
}

float recta(vec3 p, vec3 F, vec3 o) {
	const float R = 0.0001;
	p += o;
	return length(max(abs(p)-F,0.0)) - R;	
}

float map1(vec3 p, float scale) {
	float G = 0.50;
	float F = 0.50 * scale;
	float t =  nac(p, vec2(F,F), vec3( G,  G, 0.0));
	t = min(t, nac(p, vec2(F,F), vec3( G, -G, 0.0)));
	t = min(t, nac(p, vec2(F,F), vec3(-G,  G, 0.0)));
	t = min(t, nac(p, vec2(F,F), vec3(-G, -G, 0.0)));
	return t;
}

float map2(vec3 p) {
	float t = map1(p, 0.9);
    t = max(t, recta(p, vec3(1.0, 1.0, 0.02), vec3(0.0, 0.0, 0.0)));
	return t;
}

float gennoise(vec2 p) {
	float d = 0.5;
	mat2 h = mat2( 1.6, 1.2, -1.2, 1.6 );
	
	float color = 0.0;
	for( int i = 0; i < 2; i++ ) {
		color += d * noise( p * 5.0 + iTime);
		p *= h;
		d /= 2.0;
	}
	return color;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    fragColor = vec4(0.0);
    for(int count = 0 ; count < 2; count++) {
        vec2 uv = -1.0 + 2.0 * ( fragCoord.xy / iResolution.xy );
        uv *= 1.4;
        uv.x += hash(uv.xy + iTime + float(count)) / 512.0;
        uv.y += hash(uv.yx + iTime + float(count)) / 512.0;
        vec3 dir = normalize(vec3(uv * vec2(iResolution.x / iResolution.y, 1.0), 1.0 + sin(iTime) * 0.01));
        dir.xz = rot(dir.xz, d2r(70.0));
        dir.xy = rot(dir.xy, d2r(90.0));
        vec3 pos    = vec3(-0.1 + sin(iTime * 0.3) * 0.1, 2.0 + cos(iTime * 0.4) * 0.1, -3.5);
        vec3  col   = vec3(0.0);
        float t     = 0.0;
        float M     = 1.002;
        float bsh   = 0.01;
        float dens  = 0.0;

        for(int i = ZERO ; i < REP * 24; i++) {
            float temp = map1(pos + dir * t, 0.6);
            if(temp < 0.2) {
                col += WBCOL * 0.005 * dens;
            }
            t += bsh * M;
            bsh *= M;
            dens += 0.025;
        }

        //windows
        t = 0.0;
        float y = 0.0;
        for(int i = ZERO ; i < REP; i++) {
            float temp = map2(pos + dir * t);
            if(temp < 0.025) {
                col += WBCOL2 * 0.5;
            }
            t += temp;
            y++;
        }
        col += ((2.0 + uv.x) * WBCOL2) + (y / (25.0 * 50.0));
        col += gennoise(dir.xz) * 0.5;
        col *= 1.0 - uv.y * 0.5;
        col *= vec3(0.03);
        col  = pow(col, vec3(0.717));
        
        fragColor += vec4(col, 1.0 / (t));
    }
    fragColor /= vec4(2.5);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;
