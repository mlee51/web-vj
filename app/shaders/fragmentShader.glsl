#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 u_colorA;
uniform vec3 u_colorB;
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

float sphere(vec3 p, float radius) {
    return length(p) - radius - noise(vec2(mix(p.y, p.x, sin(u_time)), 3.0 * p.z - u_time));
}

float scene(vec3 p) {
    // Define the sphere center and radius
    vec3 sphereCenter = vec3(0.0, 0.0, 0.0);
    float sphereRadius = 0.5;

    // Return the distance to the sphere
    return sphere(p - sphereCenter, sphereRadius);
}

vec3 getNormal(vec3 p) {
    const float eps = 0.001;
    vec3 normal = vec3(scene(p + vec3(eps, 0.0, 0.0)) - scene(p - vec3(eps, 0.0, 0.0)), scene(p + vec3(0.0, eps, 0.0)) - scene(p - vec3(0.0, eps, 0.0)), scene(p + vec3(0.0, 0.0, eps)) - scene(p - vec3(0.0, 0.0, eps)));
    return normalize(normal);
}

vec3 lighting(vec3 normal, vec3 rayDirection) {
    vec3 lightDirection = normalize(vec3(-1.0, 1.0, -1.0)); // Directional light
    float intensity = max(0.0, dot(normal, lightDirection));
    return vec3(intensity);
}

vec3 rayMarch(vec3 rayOrigin, vec3 rayDirection) {
    float maxDist = 100.0;
    float epsilon = 0.001;
    float totalDist = 0.0;
    for(int i = 0; i < 100; i++) {
        vec3 p = rayOrigin + totalDist * rayDirection;
        // Apply noise to the ray marching point
        //p += noise(2.0 * p.xz - u_time);
        float dist = scene(p);
        totalDist += dist;
        if(dist < epsilon || totalDist >= maxDist)
            break;
    }
    if(totalDist >= maxDist)
        return vec3(0.0); // return background color
    vec3 intersectionPoint = rayOrigin + totalDist * rayDirection;
    vec3 normal = getNormal(intersectionPoint);
    vec3 color = lighting(normal, rayDirection);
    return color;
}

vec3 hsv2rgb(vec3 c, float u_time) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * mix(4.0, 6.0, sin(u_time)) - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 rgb2hsv(vec3 c, float u_time) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), sin(u_time) - step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hueShift(vec3 color, float hue) {
    const vec3 k = vec3(0.57735, 0.57735, 0.57735);
    float cosAngle = cos(hue);
    return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}

vec3 rainbow(float distance, float u_time) {
    // Map the distance to the range [0, 1]
    float t = distance * 0.2 * 3.14;

    // Adjust the time factor to control animation speed
    float timeFactor = 0.1;

    // Add time to create animation
    t += u_time * timeFactor;
    // Create rainbow colors using sine function
    vec3 color = 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.4, 0.57)));
    color = hueShift(color, distance);
    return color;
}

float chebDistance(float n, vec2 p0, vec2 p1) {
    float distance = pow(pow(p0.x - p1.x, n) + pow(p0.y - p1.y, n), 1.0 / n);
    return distance;
}

void main() {
    vec2 uv = vUv;

    // Offset UV coordinates to center the gradient
    uv -= 0.5;

    // Calculate ray direction
    vec3 rayDirection = normalize(vec3(uv, 1.0));

    // Raymarch from camera position
    vec3 cameraPos = vec3(0.0, 0.0, -4.0);
    vec3 color = rayMarch(cameraPos, rayDirection);
    float distance = chebDistance(6.0, vec2(0.5), vec2(vUv));
    gl_FragColor = vec4(rainbow(distance, -u_time), 1.0);
}
