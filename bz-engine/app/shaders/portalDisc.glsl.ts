export const portalDiscVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const portalDiscFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uActive;

  varying vec2 vUv;

  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.0, 1.0, 2.0, 3.0);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(permute(
              i.y + vec4(0.0, i1.y, 1.0, 2.0))
            + i.x + vec4(0.0, i1.x, 1.0, 2.0))
            + x12.xy + vec4(0.0, 0.0, 1.0, 2.0));
    vec3 g = fract(p * (1.0 / 41.0)) * 2.0 - 1.0;
    vec3 ox = floor(g * 8.0 + 0.5) / 8.0;
    vec3 gr = g - ox;
    vec2 dd = fract((x12.xy + 0.5 * gr.xy) * 0.024286);
    vec2 t = 1.0 - 2.0 * dd;
    t = clamp(t, 0.0, 1.0);
    vec3 m = t * t * t * t * (gr * 2.0 + 0.5);
    m.x = max(m.x, m.z);
    m.yz = gr.wz * dd.yx;
    return 130.0 * dot(m.yz, vec2(dd.x * m.x, dd.y * m.x));
  }

  void main() {
    vec2 centered = vUv - 0.5;
    float r = length(centered);

    // swirl — slow, hypnotic, inward spiral
    float angle = atan(centered.y, centered.x);
    float swirl = snoise(vec2(angle * 1.6 + uTime * 0.05, r * 3.5 - uTime * 0.08));
    float energy = smoothstep(0.5, 0.06, r + swirl * 0.05);

    // core glow center
    float core = smoothstep(0.24, 0.0, r) * 0.9;

    vec3 col = uColor * (energy * 0.35 + core * 0.85);
    col += vec3(1.0) * core * 0.2 * uActive;

    // alpha: soft luminous disc
    float alpha = energy * (0.3 + 0.5 * uActive) + core * 0.45;

    gl_FragColor = vec4(col, alpha);
  }
`
