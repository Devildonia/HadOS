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
