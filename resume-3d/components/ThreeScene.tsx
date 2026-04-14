'use client'

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

import SceneLights    from './SceneLights'
import PaperMesh      from './PaperMesh'
import GlassMesh      from './GlassMesh'
import MouseTrail     from './MouseTrail'
import ResumeContent  from './ResumeContent'
import { useResumeTexture  } from '@/hooks/useResumeTexture'
import { useMouseParallax  } from '@/hooks/useMouseParallax'

// ── Warm desk surface ──────────────────────────────────────────────────────
function Desk() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[24, 18]} />
      <meshStandardMaterial color="#C8B9A5" roughness={0.82} metalness={0.01} />
    </mesh>
  )
}

// ── Main scene export ─────────────────────────────────────────────────────
export default function ThreeScene() {
  const resumeRef   = useRef<HTMLDivElement>(null)
  const texture     = useResumeTexture(resumeRef)
  const mouseRef    = useMouseParallax()

  const [mode,         setMode        ] = useState<'idle' | 'reading'>('idle')
  const [canvasVisible,setCanvasVisible] = useState(false)

  // Fade in after texture is ready
  useEffect(() => {
    if (!texture) return
    const id = requestAnimationFrame(() => setCanvasVisible(true))
    return () => cancelAnimationFrame(id)
  }, [texture])

  // ESC → put down paper
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')
        (window as Window & { __resumePutDown?: () => void }).__resumePutDown?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh' }}>

      {/* Off-screen HTML for html2canvas */}
      <ResumeContent ref={resumeRef} />

      {/* WebGL canvas — fades in after texture is ready */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity   : canvasVisible ? 1 : 0,
        transition: 'opacity 1.2s ease',
      }}>
        <Canvas
          shadows={{ type: THREE.PCFSoftShadowMap }}
          camera={{
            fov     : 45,
            // Angled view from upper-right — matches reference photo aesthetic
            position: [2.5, 4, 5.5],
            near    : 0.1,
            far     : 100,
          }}
          gl={{
            antialias        : true,
            alpha            : false,
            toneMapping      : THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
            outputColorSpace : THREE.SRGBColorSpace,
          }}
          style={{ width: '100vw', height: '100vh', display: 'block' }}
          onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
          // Click outside paper in reading mode → put it back down
          onPointerMissed={() => {
            if (mode === 'reading')
              (window as Window & { __resumePutDown?: () => void }).__resumePutDown?.()
          }}
        >
          {/* Warm beige — GSAP will animate this to blue-gray in reading mode */}
          <color attach="background" args={['#C8B9A5']} />

          <Suspense fallback={null}>
            {/* Provides reflections for glass transmission */}
            <Environment preset="apartment" background={false} />

            <SceneLights />
            <PaperMesh
              resumeTexture={texture}
              mouseRef={mouseRef}
              isMobile={isMobile}
              onModeChange={setMode}
            />
            <GlassMesh />
            <MouseTrail />
            <Desk />
          </Suspense>
        </Canvas>
      </div>

      {/* Cinematic vignette — always on top */}
      <div style={{
        position     : 'fixed',
        inset        : 0,
        background   : 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,0,0.14) 100%)',
        pointerEvents: 'none',
        zIndex       : 10,
      }} />

      {/* ── Idle hint ── */}
      {canvasVisible && mode === 'idle' && (
        <div style={{
          position       : 'fixed',
          bottom         : '28px',
          left           : '50%',
          transform      : 'translateX(-50%)',
          color          : 'rgba(255,255,255,0.72)',
          fontFamily     : 'system-ui, -apple-system, sans-serif',
          fontSize       : '10px',
          letterSpacing  : '0.22em',
          textTransform  : 'uppercase',
          background     : 'rgba(0,0,0,0.22)',
          backdropFilter : 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          padding        : '10px 26px',
          borderRadius   : '24px',
          pointerEvents  : 'none',
          zIndex         : 20,
          animation      : 'hintFadeIn 1s ease 1.8s both',
        }}>
          Click to read resume
        </div>
      )}

      {/* ── Reading mode UI ── */}
      {mode === 'reading' && (
        <>
          <button
            onClick={() =>
              (window as Window & { __resumePutDown?: () => void }).__resumePutDown?.()
            }
            style={{
              position       : 'fixed',
              top            : '20px',
              left           : '20px',
              background     : 'rgba(255,255,255,0.13)',
              backdropFilter : 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border         : '1px solid rgba(255,255,255,0.22)',
              color          : 'rgba(255,255,255,0.85)',
              fontFamily     : 'system-ui, -apple-system, sans-serif',
              fontSize       : '10px',
              letterSpacing  : '0.14em',
              textTransform  : 'uppercase',
              padding        : '10px 20px',
              borderRadius   : '10px',
              cursor         : 'pointer',
              zIndex         : 20,
              transition     : 'background 0.2s',
            }}
          >
            ← Put Down
          </button>

          <div style={{
            position     : 'fixed',
            bottom       : '24px',
            left         : '50%',
            transform    : 'translateX(-50%)',
            color        : 'rgba(255,255,255,0.42)',
            fontFamily   : 'system-ui, -apple-system, sans-serif',
            fontSize     : '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            pointerEvents: 'none',
            zIndex       : 20,
          }}>
            Scroll to read · ESC to close
          </div>
        </>
      )}

      {/* ── Loading indicator ── */}
      <div style={{
        position       : 'fixed',
        inset          : 0,
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'center',
        color          : 'rgba(255,255,255,0.35)',
        fontFamily     : 'system-ui, -apple-system, sans-serif',
        fontSize       : '10px',
        letterSpacing  : '0.22em',
        textTransform  : 'uppercase',
        pointerEvents  : 'none',
        zIndex         : 5,
        opacity        : canvasVisible ? 0 : 1,
        transition     : 'opacity 0.8s ease',
      }}>
        Loading…
      </div>

      <style>{`
        @keyframes hintFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
