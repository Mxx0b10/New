'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── Butterfly wing shape (Bézier curve) ──────────────────────────────────────
function makeWingShape(mirror: boolean) {
  const s = new THREE.Shape()
  const m = mirror ? -1 : 1
  s.moveTo(0, 0)
  s.bezierCurveTo(m * 0.14, 0.18,  m * 0.28, 0.14, m * 0.26, 0)
  s.bezierCurveTo(m * 0.24, -0.10, m * 0.10, -0.07, 0, 0)
  return s
}

// ── Per-butterfly config ──────────────────────────────────────────────────────
const CONFIGS = [
  { cx: -3.5, cz: -12, r: 1.4, vy: 1.4, speed: 0.28, phase: 0.0, color: '#FF8C00', flap: 9 },
  { cx: -1.0, cz: -14, r: 1.0, vy: 1.6, speed: 0.22, phase: 1.7, color: '#FFD700', flap: 11 },
  { cx:  1.5, cz: -11, r: 1.2, vy: 1.8, speed: 0.32, phase: 3.2, color: '#FF6B9D', flap: 8  },
  { cx: -4.5, cz: -16, r: 0.9, vy: 2.0, speed: 0.18, phase: 0.9, color: '#7EC8E3', flap: 10 },
  { cx:  2.5, cz: -15, r: 1.1, vy: 1.5, speed: 0.25, phase: 2.4, color: '#FF8C00', flap: 12 },
  { cx: -2.0, cz: -10, r: 0.8, vy: 2.2, speed: 0.35, phase: 4.1, color: '#A8E6CF', flap: 7  },
]

// ── Single butterfly ──────────────────────────────────────────────────────────
function Butterfly({ cfg }: { cfg: typeof CONFIGS[0] }) {
  const groupRef   = useRef<THREE.Group>(null)
  const leftRef    = useRef<THREE.Mesh>(null)
  const rightRef   = useRef<THREE.Mesh>(null)

  const [leftGeo, rightGeo] = useMemo(() => [
    new THREE.ShapeGeometry(makeWingShape(false)),
    new THREE.ShapeGeometry(makeWingShape(true)),
  ], [])

  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color      : new THREE.Color(cfg.color),
    transparent: true,
    opacity    : 0.88,
    side       : THREE.DoubleSide,
    depthWrite : false,
  }), [cfg.color])

  useFrame(({ clock }) => {
    const t   = clock.getElapsedTime() * cfg.speed + cfg.phase
    const grp = groupRef.current
    if (!grp) return

    // Elliptical flight path
    grp.position.set(
      cfg.cx + Math.cos(t) * cfg.r,
      cfg.vy  + Math.sin(t * 2.1 + cfg.phase) * 0.18,
      cfg.cz  + Math.sin(t) * cfg.r * 0.55,
    )
    // Face direction of travel
    grp.rotation.y = -t - Math.PI / 2

    // Wing flap
    const flap = Math.sin(clock.getElapsedTime() * cfg.flap) * 0.85
    if (leftRef.current)  leftRef.current.rotation.y  =  flap
    if (rightRef.current) rightRef.current.rotation.y = -flap
  })

  return (
    <group ref={groupRef}>
      <mesh ref={leftRef}  geometry={leftGeo}  material={mat} />
      <mesh ref={rightRef} geometry={rightGeo} material={mat} />
    </group>
  )
}

// ── Scene component ───────────────────────────────────────────────────────────
export default function Butterflies() {
  return (
    <>
      {CONFIGS.map((cfg, i) => (
        <Butterfly key={i} cfg={cfg} />
      ))}
    </>
  )
}
