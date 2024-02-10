#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
varying vec2 vUv;

// Perlin noise functions
float hash(float n) {
    return fract(sin(n) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(hash(i.x + i.y * 57.0), hash(i.x + 1.0 + i.y * 57.0), u.x), mix(hash(i.x + (i.y + 1.0) * 57.0), hash(i.x + 1.0 + (i.y + 1.0) * 57.0), u.x), u.y);
}

vec3 hueShift(vec3 color, float hue) {
    const vec3 k = vec3(0.57735, 0.57735, 0.57735);
    float cosAngle = cos(hue);
    return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}

vec3 rainbow(float distance, float u_time) {
    float t = distance * 0.2 * 3.14;
    float timeFactor = 0.1;
    t += u_time * timeFactor;
    vec3 color = 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.4, 0.57)));
    color = hueShift(color, distance);
    return color;
}

float chebDistance(float n, vec2 p0, vec2 p1) {
    float distance = pow(pow(p0.x - p1.x, n) + pow(p0.y - p1.y, n), 1.0 / n);
    return distance;
}

void main() {
    float distance = chebDistance(6.0, vec2(0.5), vec2(vUv));
    gl_FragColor = vec4(rainbow(distance, -u_time), 1.0);
}
