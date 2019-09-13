precision mediump float;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform float u_time;
uniform vec2 u_resolution;

#define PI				3.141592653589793
#define TWO_PI			6.283185307179586

vec2 coord(in vec2 p) {
  p = p / u_resolution.xy;
  // correct aspect ratio
  if (u_resolution.x > u_resolution.y) {
    p.x *= u_resolution.x / u_resolution.y;
    p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
  } else {
    p.y *= u_resolution.y / u_resolution.x;
    p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
  }
  // centering
  p -= 0.5;
  p *= vec2(-1.0, 1.0);
  return p;
}

float polygon(vec2 st, int n, float size) {
    vec2 uv = st * 2. - 1.;
    float a = atan(uv.x, uv.y) + PI;
    float r = TWO_PI / float(n);
    float d = cos(floor(.5 + a / r) * r - a) * length(uv);
    return 1.0 - smoothstep(size,size + .01, d);
}

mat2 rotation2d(float angle) {
    return mat2(
        cos(angle), -sin(angle),
        sin(angle), cos(angle)
    );
}

vec2 rotate2d(vec2 st, float angle) {
    return (
        (st - vec2(.5)) *
        rotation2d(angle) +
        vec2(.5)
    );
}

vec2 scale(vec2 st, vec2 s) {
    return st * s;
}

vec2 translate(vec2 st, vec2 t) {
    return st + t;
}

vec2 skewY(vec2 st, float angle) {
    return (
        (st - vec2(.5)) *
        mat2(
            1., 0.,
            tan(angle), 1.
        ) +
        vec2(.5)
    );
}

float random (in vec2 st) {
    return fract(
        sin(
            dot(st.xy, vec2(12.9898,78.233))
        ) * 43758.5453123
    );
}

void apply(vec4 newColor, out vec4 color) {
    color = mix(color, newColor, newColor.w);
}

float normalize(float minV, float maxV, float v) {
    return minV + v * (maxV - minV);
}

float tiles = 3.;
const vec2 vel = vec2(1., 0.);
const vec4 skfbBlue = vec4(20, 170, 217, 255);
const vec4 orange = vec4(200, 54, 96, 255);
const vec4 purple = vec4(58, 31, 93, 255);

void main() {
    // vec4 color1 = orange / vec4(255);
    // vec4 color2 = purple / vec4(255);
    vec4 color1 = u_color1  / vec4(255);
    vec4 color2 = u_color2  / vec4(255);
  
    vec2 uv = coord(gl_FragCoord.xy);
    float time = fract(u_time);

    //   vec2 wave = uv;
    //   wave.x += sin(uv.y * 5. + u_time) * 0.1;
    //   wave.y += cos(uv.x * 5. + u_time) * 0.1;
    //   uv += wave;

    //   uv += vel * u_time;

    // rotation
    uv *= rotation2d(PI / 3.2 * u_time);

    // scale
    uv *= vec2(normalize(1., 2., (1. + sin(u_time)) / 2.));

    // translate
    uv += vec2(normalize(2., 3., u_time));

    vec2 index = floor(tiles * uv) / tiles;
    float t = floor(random(index) * 4.) / 4.;

    uv = 2.0 * fract(tiles * uv) - 1.0;
    uv *= rotation2d(t * PI * 2.);

    float c = step(uv.x, uv.y) * 0.9;
    c = abs(sin(5. + fract((random(index + c) + 0.1))));

    //   c = smoothstep(.0, 1., c);

    vec4 color = random(vec2(c)) > 0.5 ? color1 : color2;

    gl_FragColor = vec4((c * .5 + 0.5) * color.xyz, 1.0);
}