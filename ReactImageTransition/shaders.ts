import * as THREE from 'three';

// Exported standard WebGL Vertex Shader
// Simply passes UV coordinates onto the fragment shader. 
export const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Exported Fragment Shader
// Implements Perlin/Simplex noise-based dissolve and burn transition
export const fragmentShader = `
// Uniforms
uniform float uProgress;
uniform float uTime;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform vec2 uResolution;

varying vec2 vUv;

// 2D Simplex Noise Function
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ; m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * vec2(x12.xz) + h.yz * vec2(x12.yw);
  return 130.0 * dot(m, g);
}


void main() {
  vec2 uv = vUv;
  
  // We expand the local progress range slightly (-0.25 to 1.25) so that the transition
  // has completely started/finished at values 0.0 and 1.0. 
  float p = uProgress * 1.5 - 0.25;

  // Diagonal gradient (bottom-left to top-right burn direction)
  float grad = (uv.x + uv.y) * 0.5;

  // Evaluate simplex noise at current UV and Time
  float n = snoise(uv * 3.0 + uTime * 0.2);
  n = (n + 1.0) * 0.5; // Map from [-1.0, 1.0] to [0.0, 1.0]
  
  // Create a combined field mapping our directional gradient alongside pure noise
  float field = n * 0.6 + grad * 0.4;
  
  // The 'mask' controls which texture we show. Smoothstep makes a sharp but anti-aliased transition.
  float mask = smoothstep(p - 0.1, p + 0.1, field);

  // Determine the area precisely on the "burning edge"
  float burnEdge = smoothstep(p - 0.15, p, field) - smoothstep(p, p + 0.15, field);

  // Local distortion across UV space depending on burn Edge intensity (Organic distortion)
  vec2 distortedUv1 = uv + vec2(1.0) * burnEdge * 0.02 * snoise(uv * 10.0 + uTime);
  vec2 distortedUv2 = uv + vec2(1.0) * burnEdge * 0.02 * snoise(uv * 10.0 - uTime);

  // Sample actual images based on their respective UV distortion matrices
  vec4 t1 = texture2D(uTexture1, distortedUv1);
  vec4 t2 = texture2D(uTexture2, distortedUv2);

  // Cinematic burn visual colors - glowing hot orange / red
  vec4 burnColor = vec4(1.0, 0.4, 0.1, 1.0) * burnEdge * 1.5;

  // Mix between image one and image two using the mask parameter
  vec4 color = mix(t2, t1, mask);
  
  // Output and clamp (color + burn bloom overlay)
  color.rgb = clamp(color.rgb + burnColor.rgb, 0.0, 1.0);

  // Add a very subtle grain effect for a cinematic visual
  float grain = snoise(uv * 100.0 + uTime * 10.0) * 0.03;
  color.rgb += grain;

  gl_FragColor = color;
}
`;
