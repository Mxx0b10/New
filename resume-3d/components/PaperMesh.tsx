'use client'

import { useRef, useMemo, useEffect, useCallback, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import type { MouseCoords } from '@/hooks/useMouseParallax'

// ── Scene constants ──────────────────────────────────────────────────────────
const PW = 3.2
const PH = 5.0          // taller paper
const FLIP_Y  = 2.6     // lift high enough so bottom edge clears the desk (2.6 - 2.5 = 0.1)
const READ_Z  = 3.2     // closer reading distance
// FOV=45 → half-angle=22.5° → vis_half = READ_Z * tan(22.5°)
const VIS      = READ_Z * Math.tan(22.5 * Math.PI / 180)  // ~1.325
const READ_TOP = (FLIP_Y + PH / 2) - VIS   // ~3.775
const READ_BOT = (FLIP_Y - PH / 2) + VIS   // ~1.425

const I_RX = -Math.PI / 2   // flat on desk
const I_RZ =  0.08          // cinematic tilt

interface PaperMeshProps {
  resumeTexture : THREE.CanvasTexture | null
  mouseRef      : MutableRefObject<MouseCoords>
  isMobile      : boolean
  onModeChange  : (mode: 'idle' | 'reading') => void
}

export default function PaperMesh({
  resumeTexture,
  mouseRef,
  isMobile,
  onModeChange,
}: PaperMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera, scene } = useThree()

  // ── Animation state (all in one ref — no re-renders in the loop) ──────────
  const st = useRef({
    isFlipped   : false,
    isAnimating : false,
    inReading   : false,
    scrollVel   : 0,
    scrollTarget: READ_TOP,
    scrollNow   : READ_TOP,
    savedCam    : new THREE.Vector3(2.5, 4, 5.5),
    savedBg     : { r: 0.788, g: 0.729, b: 0.651 },
  })

  // ── Real PBR texture maps (useTexture suspends until all are ready) ───────
  const [colorMap, roughnessMap, normalMap, displacementMap] = useTexture([
    '/textures/paper-color.jpg',
    '/textures/paper-roughness.jpg',
    '/textures/paper-normal.jpg',
    '/textures/paper-displacement.jpg',
  ])

  // ── Configure textures once loaded ───────────────────────────────────────
  // Runs synchronously inside useMemo after useTexture resolves the Suspense,
  // so textures are guaranteed to exist here.
  useMemo(() => {
    // All maps tile — 1 repeat per PW width, 1.4 per PH height (A4 proportions)
    const allMaps = [colorMap, roughnessMap, normalMap, displacementMap]
    allMaps.forEach(tex => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(1, 1.4)
      tex.needsUpdate = true
    })

    // Non-color data maps must NOT be gamma-corrected — set to linear
    roughnessMap.colorSpace   = THREE.NoColorSpace
    normalMap.colorSpace      = THREE.NoColorSpace
    displacementMap.colorSpace = THREE.NoColorSpace
    roughnessMap.needsUpdate   = true
    normalMap.needsUpdate      = true
    displacementMap.needsUpdate = true
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMap, roughnessMap, normalMap, displacementMap])

  // ── 6-material array ──────────────────────────────────────────────────────
  // BoxGeometry face order: 0 right, 1 left, 2 top, 3 bottom, 4 front, 5 back
  const materials = useMemo(() => {
    // Factory for the shared PBR paper material (sides + back)
    const paperMat = (overrides: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
      new THREE.MeshStandardMaterial({
        map              : colorMap,
        roughnessMap,
        normalMap,
        normalScale      : new THREE.Vector2(0.3, 0.3),
        displacementMap,
        displacementScale: 0.002,   // 2 mm — very subtle, paper is thin
        roughness        : 0.85,
        metalness        : 0.0,
        ...overrides,
      })

    return [
      paperMat(),                      // 0 right  (+x edge)
      paperMat(),                      // 1 left   (-x edge)
      paperMat(),                      // 2 top    (+y edge)
      paperMat(),                      // 3 bottom (-y edge)
      new THREE.MeshStandardMaterial({ // 4 FRONT (+z) — clean resume surface
        map      : resumeTexture ?? colorMap,
        roughness: 0.55,               // moderate roughness — avoids specular wash-out
        metalness: 0.0,
        // no roughnessMap / normalMap / displacementMap — keeps the print sharp
      }),
      paperMat({ roughness: 0.90 }),  // 5 back   (-z)
    ] as THREE.MeshStandardMaterial[]
  }, [colorMap, roughnessMap, normalMap, displacementMap, resumeTexture])

  useEffect(() => () => materials.forEach(m => m.dispose()), [materials])

  // ── Flip up ───────────────────────────────────────────────────────────────
  const flipUp = useCallback(() => {
    const s    = st.current
    const mesh = meshRef.current
    if (s.isFlipped || s.isAnimating || !mesh) return

    s.isAnimating  = true
    s.savedCam.copy(camera.position)
    s.scrollTarget = READ_TOP
    s.scrollNow    = READ_TOP
    s.scrollVel    = 0

    if (scene.background instanceof THREE.Color)
      s.savedBg = { r: scene.background.r, g: scene.background.g, b: scene.background.b }

    // Background → cool reading blue-gray
    gsap.to(scene.background as THREE.Color, {
      r: 0.72, g: 0.77, b: 0.80,
      duration: 0.9, ease: 'power2.inOut',
    })

    gsap.timeline({
      onComplete() {
        s.isFlipped   = true
        s.isAnimating = false
        s.inReading   = true
        onModeChange('reading')
      },
    })
    .to(mesh.position, { y: FLIP_Y, duration: 0.55, ease: 'power2.out' })
    .to(mesh.rotation, { x: 0, y: 0, z: 0, duration: 0.85, ease: 'back.out(1.04)' }, '-=0.12')
    .to(camera.position, {
      x: 0, y: FLIP_Y, z: READ_Z,
      duration: 0.9, ease: 'power3.inOut',
      onUpdate() { camera.lookAt(0, camera.position.y, 0) },
    }, '-=0.60')
    .to(mesh.scale, { x: 1.04, y: 1.04, z: 1.04, duration: 0.16 }, '-=0.52')
    .to(mesh.scale, { x: 1,    y: 1,    z: 1,    duration: 0.34, ease: 'power1.inOut' })
  }, [camera, scene, onModeChange])

  // ── Put down ──────────────────────────────────────────────────────────────
  const putDown = useCallback(() => {
    const s    = st.current
    const mesh = meshRef.current
    if (!s.isFlipped || s.isAnimating || !mesh) return

    s.isAnimating = true
    s.inReading   = false

    // Background → restore warm beige
    gsap.to(scene.background as THREE.Color, {
      ...s.savedBg,
      duration: 0.8, ease: 'power2.inOut',
    })

    gsap.timeline({
      onComplete() {
        s.isFlipped   = false
        s.isAnimating = false
        onModeChange('idle')
      },
    })
    .to(mesh.scale,    { x: 1,    y: 1,    z: 1,    duration: 0.10 })
    .to(mesh.rotation, { x: I_RX, y: 0,   z: I_RZ, duration: 0.60, ease: 'power2.inOut' })
    .to(mesh.position, { y: 0,                       duration: 0.50, ease: 'power2.in' }, '-=0.30')
    .to(camera.position, {
      x: s.savedCam.x, y: s.savedCam.y, z: s.savedCam.z,
      duration: 0.82, ease: 'power2.inOut',
      onUpdate() { camera.lookAt(0, 0, 0) },
    }, '-=0.45')
  }, [camera, scene, onModeChange])

  // Expose putDown for UI button + ESC
  useEffect(() => {
    ;(window as Window & { __resumePutDown?: () => void }).__resumePutDown = putDown
    return () => {
      delete (window as Window & { __resumePutDown?: () => void }).__resumePutDown
    }
  }, [putDown])

  // ── Scroll (reading mode) ─────────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!st.current.inReading) return
      e.preventDefault()
      st.current.scrollVel -= e.deltaY * 0.0022
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    let lastY = 0
    const onTS = (e: TouchEvent) => { lastY = e.touches[0].clientY }
    const onTM = (e: TouchEvent) => {
      if (!st.current.inReading) return
      e.preventDefault()
      st.current.scrollVel -= (lastY - e.touches[0].clientY) * 0.003
      lastY = e.touches[0].clientY
    }
    window.addEventListener('touchstart', onTS, { passive: true })
    window.addEventListener('touchmove',  onTM, { passive: false })
    return () => {
      window.removeEventListener('touchstart', onTS)
      window.removeEventListener('touchmove',  onTM)
    }
  }, [])

  // ── Render loop ───────────────────────────────────────────────────────────
  useFrame(() => {
    const mesh = meshRef.current
    const s    = st.current
    if (!mesh) return

    if (s.inReading) {
      s.scrollTarget = Math.max(READ_BOT, Math.min(READ_TOP, s.scrollTarget + s.scrollVel))
      s.scrollVel   *= 0.80
      if (Math.abs(s.scrollVel) < 0.0001) s.scrollVel = 0
      s.scrollNow   += (s.scrollTarget - s.scrollNow) * 0.10
      camera.position.y = s.scrollNow
      camera.lookAt(0, s.scrollNow, 0)
      return
    }

    // Idle float
    if (!s.isFlipped && !s.isAnimating)
      mesh.position.y = Math.sin(Date.now() * 0.0013) * 0.013

    // Mouse parallax — subtle z-rotation while flat on desk
    if (!s.isAnimating && !s.isFlipped) {
      const { x } = mouseRef.current
      mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, I_RZ + x * 0.016, 0.04)
    }
  })

  const scale = isMobile ? 0.75 : 1

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      rotation={[I_RX, 0, I_RZ]}
      scale={[scale, scale, scale]}
      material={materials}
      castShadow
      receiveShadow
      onClick={(e) => {
        e.stopPropagation()
        if (!st.current.isFlipped && !st.current.isAnimating) flipUp()
      }}
    >
      {/*
        Segments: 40 wide × 56 tall gives ~2240 quads on the main face —
        enough resolution for displacementMap at 0.002 scale to produce
        a visible (but subtle) surface relief.
      */}
      <boxGeometry args={[PW, PH, 0.012, 40, 70, 1]} />
    </mesh>
  )
}
