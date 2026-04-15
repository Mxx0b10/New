'use client'

import { useEffect } from 'react'

interface Props {
  visible : boolean
  onClose : () => void
}

export default function MobileResumeOverlay({ visible, onClose }: Props) {
  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [visible])

  if (!visible) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column' }}>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position      : 'absolute',
          inset         : 0,
          background    : 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)',
          animation     : 'mobBgIn 0.3s ease both',
        }}
      />

      {/* Bottom sheet */}
      <div style={{
        position      : 'absolute',
        bottom        : 0, left: 0, right: 0,
        height        : '92dvh',
        background    : '#FAFAF8',
        borderRadius  : '20px 20px 0 0',
        overflowY     : 'auto',
        overscrollBehavior: 'contain',
        animation     : 'mobSheetIn 0.38s cubic-bezier(0.32,0.72,0,1) both',
        WebkitOverflowScrolling: 'touch',
      }}>

        {/* Sticky top bar */}
        <div style={{
          position  : 'sticky', top: 0,
          background: '#FAFAF8',
          zIndex    : 2,
          display   : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '12px',
          paddingBottom: '8px',
        }}>
          <div style={{ width: '36px', height: '4px', background: '#C4B5A0', borderRadius: '2px' }} />
          <button
            onClick={onClose}
            style={{
              position    : 'absolute', right: '16px',
              background  : 'rgba(0,0,0,0.06)',
              border      : 'none', borderRadius: '50%',
              width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '14px', color: '#555',
            }}
          >✕</button>
        </div>

        {/* ── Resume Content ─────────────────────────────────────── */}
        <div style={{
          padding   : '4px 22px 52px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color     : '#1a1a1a',
          maxWidth  : '600px',
          margin    : '0 auto',
        }}>

          {/* Name */}
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 2px', letterSpacing: '-0.02em' }}>
            Manish Patel
          </h1>

          {/* Summary */}
          <p style={{ fontSize: '12.5px', lineHeight: 1.65, color: '#444', margin: '0 0 14px' }}>
            UX/UI Designer with 1.6+ years of agency experience designing edtech platforms and SaaS
            products. At ROSS, led end-to-end design of Koncept Global Books and RossINDX — owning
            everything from UX flows and brand identity to frontend development. Comfortable with the
            full design-to-launch pipeline: Figma → Framer / HTML/CSS.
          </p>

          {/* Contact row */}
          <div style={{
            display      : 'flex',
            flexWrap     : 'wrap',
            gap          : '6px 14px',
            fontSize     : '12px',
            color        : '#555',
            borderBottom : '1.5px solid #E0D9D0',
            paddingBottom: '14px',
            marginBottom : '18px',
          }}>
            <a href="tel:+918800816674" style={linkStyle}>
              📞 +91 (880) 081-6674
            </a>
            <a href="mailto:manish10thfeh@gmail.com" style={linkStyle}>
              ✉️ manish10thfeh@gmail.com
            </a>
            <span>📍 New Delhi, India</span>
            <a href="https://www.linkedin.com/in/manish-patel-8905b7311/" target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, color: '#0A66C2' }}>
              LinkedIn ↗
            </a>
            <a href="https://manishpatel.framer.website/" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              Portfolio ↗
            </a>
          </div>

          {/* ── Experience ── */}
          <SectionHeading title="Experience" />

          <Job
            title="UX/UI Designer"
            company="Retail One Solutions & Services (ROSS)"
            location="New Delhi, India"
            dates="Sep 2024 – Present"
            bullets={[
              'Designing and developing RossINDX — an AI-powered India market entry diagnostic platform; owning full product design including UX flows, edge case mapping, state design, and complete brand identity. (Ongoing, Dec 2025)',
              'Designed, developed, and launched Albatross (ROSS in-house brand) — end-to-end brand identity, website design and frontend development, shipped in 1 week.',
              'Spearheaded end-to-end UX/UI design for Koncept Global Books EdTech platform, delivering role-based dashboards for teachers, students, and parents that accelerated test creation by 50% through digital automation.',
              'Transformed Farmers App into B2B marketplace modeled after Country Delight, enabling stakeholders to secure 2 new partnerships in Q1 2024–2025.',
              'Designed and launched 4 responsive websites for ROSS and clients, increasing time-on-page 429% (7s to 37s), boosting conversion 25%, and generating 200+ leads in 2025–2026.',
              'Elevated company visibility through LinkedIn strategy with 20+ design posts that positioned ROSS as thought leader.',
            ]}
          />

          <Job
            title="Freelance UX Designer"
            company="Self Employed"
            location=""
            dates="Nov 2025 – Present"
            bullets={[
              'Delivered 2 conversion-optimised websites for hospitality and services clients — 45% uplift in lead generation.',
              'Secured 3rd place in New Forms Design Challenge among 200+ international designers.',
            ]}
          />

          {/* ── Skills ── */}
          <SectionHeading title="Skills" />
          <p style={{ fontSize: '13px', lineHeight: 1.8, color: '#333', margin: '0 0 22px' }}>
            UX Design · Web Design · Product Design · Figma · Paper · Framer · Adobe Illustrator ·
            Wireframing · Lottielabs · Jitter · HTML · CSS · JS
          </p>

          {/* ── Education ── */}
          <SectionHeading title="Education & Certifications" />
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Bachelor&apos;s in English (Honors)</span>
              <span style={{ fontSize: '12px', color: '#888' }}>Aug 2021 – Aug 2024</span>
            </div>
            <div style={{ fontSize: '13px', color: '#555' }}>Delhi University</div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes mobBgIn   { from { opacity:0 } to { opacity:1 } }
        @keyframes mobSheetIn { from { transform:translateY(100%) } to { transform:translateY(0) } }
      `}</style>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const linkStyle: React.CSSProperties = { color: '#444', textDecoration: 'none' }

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 style={{
      fontSize     : '11px',
      fontWeight   : 700,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color        : '#999',
      margin       : '0 0 10px',
      borderBottom : '1px solid #E0D9D0',
      paddingBottom: '6px',
    }}>
      {title}
    </h2>
  )
}

function Job({
  title, company, location, dates, bullets,
}: {
  title   : string
  company : string
  location: string
  dates   : string
  bullets : string[]
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2px', marginBottom: '1px' }}>
        <span style={{ fontWeight: 700, fontSize: '14px' }}>{title}</span>
        <span style={{ fontSize: '11px', color: '#888' }}>{location}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2px', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', color: '#666' }}>{company}</span>
        <span style={{ fontSize: '11px', color: '#888' }}>{dates}</span>
      </div>
      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12.5px', lineHeight: 1.7, color: '#333' }}>
        {bullets.map((b, i) => <li key={i} style={{ marginBottom: '5px' }}>{b}</li>)}
      </ul>
    </div>
  )
}
