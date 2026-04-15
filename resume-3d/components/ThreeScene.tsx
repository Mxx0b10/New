'use client'

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

import WebGLErrorBoundary from './WebGLErrorBoundary'
import SceneLights   from './SceneLights'
import PaperMesh     from './PaperMesh'
import GlassMesh     from './GlassMesh'
import TreeScene     from './TreeScene'
import Butterflies   from './Butterflies'
import SunRays       from './SunRays'
import ResumeContent from './ResumeContent'
import { useResumeTexture  } from '@/hooks/useResumeTexture'
import { useMouseParallax  } from '@/hooks/useMouseParallax'
import { useAmbientSound   } from '@/hooks/useAmbientSound'

// ── Warm desk surface ──────────────────────────────────────────────────────
function Desk() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[24, 18]} />
      <meshStandardMaterial color="#C8B9A5" roughness={0.82} metalness={0.01} />
    </mesh>
  )
}

// ── Shared link button style ───────────────────────────────────────────────
const linkStyle: React.CSSProperties = {
  display        : 'inline-flex',
  alignItems     : 'center',
  gap            : '6px',
  background     : 'rgba(255,255,255,0.13)',
  backdropFilter : 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border         : '1px solid rgba(255,255,255,0.22)',
  color          : 'rgba(255,255,255,0.90)',
  fontFamily     : 'system-ui, -apple-system, sans-serif',
  fontSize       : '11px',
  letterSpacing  : '0.08em',
  padding        : '8px 16px',
  borderRadius   : '8px',
  cursor         : 'pointer',
  textDecoration : 'none',
  transition     : 'background 0.2s',
  whiteSpace     : 'nowrap',
}

// ── Main scene export ─────────────────────────────────────────────────────
export default function ThreeScene() {
  const resumeRef = useRef<HTMLDivElement>(null)
  const texture   = useResumeTexture(resumeRef)
  const mouseRef  = useMouseParallax()

  const [mode,          setMode         ] = useState<'idle' | 'reading'>('idle')
  const [canvasVisible, setCanvasVisible ] = useState(false)
  const [isMobile,      setIsMobile     ] = useState(false)
  const { muted, toggleMute, volume, setVolume, playPaperRustle } = useAmbientSound()

  // Reactive mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Fade in once texture is ready
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
        <WebGLErrorBoundary>
        <Canvas
          shadows={{ type: THREE.PCFSoftShadowMap }}
          // Cap pixel ratio at 1.5 — major perf win on high-DPR screens
          dpr={[1, 1.5]}
          camera={{
            fov     : 45,
            position: [2.5, 4, 5.5],
            near    : 0.1,
            far     : 300,
          }}
          gl={{
            antialias           : true,
            alpha               : false,
            toneMapping         : THREE.ACESFilmicToneMapping,
            toneMappingExposure : 1.05,
            outputColorSpace    : THREE.SRGBColorSpace,
            powerPreference     : 'high-performance',
            failIfMajorPerformanceCaveat: false,  // allow software fallback
          }}
          style={{ width: '100vw', height: '100vh', display: 'block' }}
          onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
          onPointerMissed={() => {
            if (mode === 'reading')
              (window as Window & { __resumePutDown?: () => void }).__resumePutDown?.()
          }}
        >
          <color attach="background" args={['#C8B9A5']} />

          <Suspense fallback={null}>
            <Environment preset="apartment" background={false} />
            {/* Low-poly tree backdrop — rendered first, no shadows */}
            <TreeScene />

            <SceneLights />
            <SunRays />
            <Butterflies />

            {/* Orbit controls — only active in idle mode so reading scroll still works */}
            <OrbitControls
              enabled={mode === 'idle'}
              enablePan={false}
              enableDamping
              dampingFactor={0.06}
              minPolarAngle={Math.PI / 8}
              maxPolarAngle={Math.PI / 2.4}
              minDistance={4}
              maxDistance={12}
              makeDefault
            />

            <PaperMesh
              resumeTexture={texture}
              mouseRef={mouseRef}
              isMobile={isMobile}
              onModeChange={setMode}
              onPaperSound={playPaperRustle}
            />
            <GlassMesh />
            <Desk />
          </Suspense>
        </Canvas>
        </WebGLErrorBoundary>
      </div>

      {/* Cinematic vignette */}
      <div style={{
        position     : 'fixed',
        inset        : 0,
        background   : 'radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,0,0.14) 100%)',
        pointerEvents: 'none',
        zIndex       : 10,
      }} />

      {/* ── Sound widget (mute + volume slider) — always visible ── */}
      {canvasVisible && (
        <div
          style={{
            position        : 'fixed',
            bottom          : '28px',
            right           : '20px',
            zIndex          : 25,
            display         : 'flex',
            alignItems      : 'center',
            gap             : '8px',
            background      : 'rgba(255,255,255,0.13)',
            backdropFilter  : 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border          : '1px solid rgba(255,255,255,0.22)',
            borderRadius    : '24px',
            padding         : '7px 14px 7px 10px',
            transition      : 'background 0.2s',
          }}
        >
          {/* Mute toggle icon */}
          <button
            onClick={toggleMute}
            title={muted ? 'Unmute' : 'Mute'}
            style={{
              background : 'none',
              border     : 'none',
              cursor     : 'pointer',
              padding    : '0',
              display    : 'flex',
              alignItems : 'center',
              color      : 'rgba(255,255,255,0.85)',
              fontSize   : '15px',
              lineHeight : 1,
            }}
          >
            {muted || volume === 0 ? '🔇' : volume < 0.4 ? '🔉' : '🔊'}
          </button>

          {/* Volume slider */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={e => {
              const v = parseFloat(e.target.value)
              if (muted && v > 0) toggleMute()   // auto-unmute on drag
              setVolume(v)
            }}
            style={{
              width          : '72px',
              height         : '3px',
              accentColor    : 'rgba(255,255,255,0.80)',
              cursor         : 'pointer',
              outline        : 'none',
              verticalAlign  : 'middle',
            }}
          />
        </div>
      )}

      {/* ── Idle hint ── */}
      {canvasVisible && mode === 'idle' && (
        <div style={{
          position     : 'fixed',
          bottom       : '28px',
          left         : '50%',
          transform    : 'translateX(-50%)',
          color        : 'rgba(255,255,255,0.72)',
          fontFamily   : 'system-ui, -apple-system, sans-serif',
          fontSize     : '10px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          background   : 'rgba(0,0,0,0.22)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          padding      : '10px 26px',
          borderRadius : '24px',
          pointerEvents: 'none',
          zIndex       : 20,
          animation    : 'hintFadeIn 1s ease 1.8s both',
        }}>
          Click paper · Drag to orbit
        </div>
      )}

      {/* ── Reading mode UI ── */}
      {mode === 'reading' && (
        <>
          {/* Put down button */}
          <button
            onClick={() =>
              (window as Window & { __resumePutDown?: () => void }).__resumePutDown?.()
            }
            style={{
              position : 'fixed',
              top      : '20px',
              left     : '20px',
              zIndex   : 20,
              cursor   : 'pointer',
              ...linkStyle,
            }}
          >
            ← Put Down
          </button>

          {/* Live profile links — top right */}
          <div style={{
            position : 'fixed',
            top      : '20px',
            right    : '20px',
            display  : 'flex',
            gap      : '10px',
            zIndex   : 20,
          }}>
            <a
              href="https://www.linkedin.com/in/manish-patel-8905b7311/"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              {/* LinkedIn icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <a
              href="https://manishpatel.framer.website/"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              {/* Globe icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              Portfolio
            </a>
          </div>

          {/* Scroll hint */}
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
            {isMobile ? 'Tap outside to close' : 'Scroll to read · ESC to close'}
          </div>
        </>
      )}

      {/* ── Loading indicator ── */}
      <div style={{
        position      : 'fixed',
        inset         : 0,
        display       : 'flex',
        alignItems    : 'center',
        justifyContent: 'center',
        color         : 'rgba(255,255,255,0.35)',
        fontFamily    : 'system-ui, -apple-system, sans-serif',
        fontSize      : '10px',
        letterSpacing : '0.22em',
        textTransform : 'uppercase',
        pointerEvents : 'none',
        zIndex        : 5,
        opacity       : canvasVisible ? 0 : 1,
        transition    : 'opacity 0.8s ease',
      }}>
        Loading…
      </div>

      <style>{`
        @keyframes hintFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        a:hover { background: rgba(255,255,255,0.24) !important; }
      `}</style>
    </div>
  )
}
