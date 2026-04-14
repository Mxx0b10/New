'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ── Trail config ─────────────────────────────────────────────────────────────
const N = 52   // number of particles in the trail

// ── Shaders ──────────────────────────────────────────────────────────────────
const vert = /* glsl */`
  attribute float aAlpha;
  attribute float aSize;
  varying float vAlpha;

  void main() {
    vAlpha = aAlpha;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPos.z);
    gl_Position  = projectionMatrix * mvPos;
  }
`

const frag = /* glsl */`
  varying float vAlpha;

  void main() {
    // Soft circular particle with warm-white glow
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = (1.0 - smoothstep(0.3, 1.0, d)) * vAlpha;
    gl_FragColor = vec4(1.0, 0.95, 0.82, a);
  }
`

// ── Component ─────────────────────────────────────────────────────────────────
export default function MouseTrail() {
  const { camera } = useThree()

  const mouseNDC  = useRef(new THREE.Vector2(0, 0))
  const trail     = useRef<THREE.Vector3[]>(
    Array.from({ length: N }, () => new THREE.Vector3(0, -100, 0))
  )
  const geoRef    = useRef<THREE.BufferGeometry>(null!)
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const deskPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.01), [])
  const _hit      = useMemo(() => new THREE.Vector3(), [])

  // ── Track mouse in normalised device coords ──────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseNDC.current.set(
        (e.clientX / window.innerWidth)  *  2 - 1,
        (e.clientY / window.innerHeight) * -2 + 1,
      )
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ── Update trail every frame ──────────────────────────────────────────────
  useFrame(() => {
    raycaster.setFromCamera(mouseNDC.current, camera)
    if (raycaster.ray.intersectPlane(deskPlane, _hit)) {
      trail.current.unshift(_hit.clone())
      if (trail.current.length > N) trail.current.length = N
    }

    const geo = geoRef.current
    if (!geo) return

    const pos   = new Float32Array(N * 3)
    const alpha = new Float32Array(N)
    const size  = new Float32Array(N)

    for (let i = 0; i < N; i++) {
      const p = trail.current[i]
      pos[i * 3]     = p.x
      pos[i * 3 + 1] = p.y
      pos[i * 3 + 2] = p.z
      const t      = 1 - i / N          // 1 at head → 0 at tail
      alpha[i]     = t * t * 0.75       // quadratic fade
      size[i]      = t * 0.8 + 0.05     // large at head, tiny at tail
    }

    if (!geo.getAttribute('position')) {
      geo.setAttribute('position', new THREE.BufferAttribute(pos,   3))
      geo.setAttribute('aAlpha',   new THREE.BufferAttribute(alpha, 1))
      geo.setAttribute('aSize',    new THREE.BufferAttribute(size,  1))
    } else {
      const pa = geo.getAttribute('position') as THREE.BufferAttribute
      const aa = geo.getAttribute('aAlpha')   as THREE.BufferAttribute
      const sa = geo.getAttribute('aSize')    as THREE.BufferAttribute
      pa.array.set(pos);   pa.needsUpdate = true
      aa.array.set(alpha); aa.needsUpdate = true
      sa.array.set(size);  sa.needsUpdate = true
    }
  })

  // ── Shader material (additive blending for glow) ─────────────────────────
  const mat = useMemo(
    () => new THREE.ShaderMaterial({
      vertexShader  : vert,
      fragmentShader: frag,
      transparent   : true,
      depthWrite    : false,
      blending      : THREE.AdditiveBlending,
    }),
    []
  )

  return (
    <points material={mat}>
      <bufferGeometry ref={geoRef} />
    </points>
  )
}
