export const morphicCoreVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAudioFreq;
  uniform float uMouseX;
  uniform float uMouseY;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vNoise;
  varying float vRidge;

  // --- simplex noise (Ashima) ---
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = inversesqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // fractal brownian motion
  float fbm(vec3 p) {
    float f = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      f += amp * snoise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return f;
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);

    // slow domain-warped surface flow — liquid metal, not spiky
    float t = uTime * 0.12;
    vec3 q = position * 1.15;
    float warp = fbm(q + vec3(t * 0.7, -t * 0.5, t * 0.3));
    float n = fbm(q + warp * 0.9 + vec3(-t * 0.4, t * 0.6, -t * 0.2));

    // displacement: sculpted, controlled amplitude
    float disp = n * 0.16 + uAudioFreq * 0.06 * n;
    vec3 morphed = position + normal * disp;

    // ridged accent — faint "machined" bands along the flow
    float ridge = 1.0 - abs(n);
    vRidge = pow(ridge, 6.0);

    // gentle mouse tilt influence (whole-form, not local deform)
    morphed.x += uMouseX * 0.06 * position.y * 0.3;
    morphed.y -= uMouseY * 0.06 * position.x * 0.3;

    // slow confident breath
    float breathe = sin(uTime * 0.5) * 0.012 + 1.0;
    morphed *= breathe;

    vNoise = n;
    vWorldPos = (modelMatrix * vec4(morphed, 1.0)).xyz;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(morphed, 1.0);
  }
`

export const morphicCoreFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uBase;
  uniform vec3 uDeep;
  uniform vec3 uRim;
  uniform vec3 uGold;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vNoise;
  varying float vRidge;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 nrm = normalize(vNormal);

    // fresnel — tight, elegant rim
    float fresnel = pow(1.0 - max(dot(viewDir, nrm), 0.0), 2.6);

    // key light — studio feel, upper-left
    vec3 keyDir = normalize(vec3(-0.6, 0.8, 0.5));
    float key = max(dot(nrm, keyDir), 0.0);
    float spec = pow(max(dot(reflect(-keyDir, nrm), viewDir), 0.0), 48.0);

    // body: deep obsidian → graphite, lit softly
    vec3 body = mix(uDeep, uBase, key * 0.55 + vNoise * 0.12 + 0.18);

    // iridescent sheen — thin-film hint keyed to fresnel + flow
    vec3 irid = vec3(
      0.5 + 0.5 * sin(fresnel * 6.0 + uTime * 0.3),
      0.5 + 0.5 * sin(fresnel * 6.0 + 2.1 + uTime * 0.3),
      0.5 + 0.5 * sin(fresnel * 6.0 + 4.2 + uTime * 0.3)
    );
    vec3 sheen = mix(uRim, uGold, irid.g * 0.35) * fresnel * 0.22;

    // rim light
    vec3 rim = uRim * fresnel * 0.85;

    // machined band accents
    vec3 band = uRim * vRidge * 0.12;

    // specular kiss
    vec3 specCol = mix(vec3(1.0), uRim, 0.6) * spec * 0.9;

    vec3 finalColor = body + sheen + rim + band + specCol;

    gl_FragColor = vec4(finalColor, 0.98);
  }
`
