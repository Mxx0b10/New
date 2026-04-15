'use client'

import { useEffect, useRef } from 'react'

interface Props {
  visible : boolean
  onClose : () => void
}

export default function MobileResumeOverlay({ visible, onClose }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null)

  // Lock body scroll while open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [visible])

  if (!visible) return null

  return (
    <div
      style={{
        position  : 'fixed',
        inset     : 0,
        zIndex    : 50,
        display   : 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position  : 'absolute',
          inset     : 0,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(4px)',
          animation : 'mobBgIn 0.3s ease both',
        }}
      />

      {/* Sheet — slides up from bottom */}
      <div
        ref={sheetRef}
        style={{
          position     : 'absolute',
          bottom       : 0,
          left         : 0,
          right        : 0,
          height       : '92dvh',
          background   : '#FAFAF8',
          borderRadius : '20px 20px 0 0',
          overflowY    : 'auto',
          overscrollBehavior: 'contain',
          animation    : 'mobSheetIn 0.38s cubic-bezier(0.32,0.72,0,1) both',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Drag handle */}
        <div style={{
          display       : 'flex',
          justifyContent: 'center',
          paddingTop    : '12px',
          paddingBottom : '4px',
          position      : 'sticky',
          top           : 0,
          background    : '#FAFAF8',
          zIndex        : 2,
        }}>
          <div style={{
            width       : '36px',
            height      : '4px',
            background  : '#C4B5A0',
            borderRadius: '2px',
          }} />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position    : 'absolute',
            top         : '12px',
            right        : '16px',
            zIndex      : 3,
            background  : 'rgba(0,0,0,0.06)',
            border      : 'none',
            borderRadius: '50%',
            width       : '32px',
            height      : '32px',
            display     : 'flex',
            alignItems  : 'center',
            justifyContent: 'center',
            cursor      : 'pointer',
            fontSize    : '16px',
            color       : '#555',
          }}
        >
          ✕
        </button>

        {/* ── Resume Content ────────────────────────────────────────────── */}
        <div style={{
          padding   : '8px 24px 48px',
          fontFamily: 'Georgia, "Times New Roman", serif',
          color     : '#1a1a1a',
          maxWidth  : '600px',
          margin    : '0 auto',
        }}>

          {/* Header */}
          <h1 style={{
            fontSize  : '28px',
            fontWeight: 700,
            margin    : '0 0 4px',
            letterSpacing: '-0.02em',
          }}>
            Manish Patel
          </h1>
          <p style={{
            fontSize : '14px',
            color    : '#555',
            margin   : '0 0 12px',
            fontFamily: 'system-ui, sans-serif',
          }}>
            UX/UI Designer · New Delhi, India
          </p>

          {/* Contact row */}
          <div style={{
            display   : 'flex',
            flexWrap  : 'wrap',
            gap       : '8px 16px',
            fontSize  : '12px',
            color     : '#666',
            fontFamily: 'system-ui, sans-serif',
            borderBottom: '1.5px solid #E0D9D0',
            paddingBottom: '14px',
            marginBottom : '18px',
          }}>
            <a href="mailto:manishpatel1337x@gmail.com" style={{ color: '#444', textDecoration: 'none' }}>
              manishpatel1337x@gmail.com
            </a>
            <span>+91 9289105553</span>
            <a href="https://www.linkedin.com/in/manish-patel-8905b7311/" target="_blank" rel="noopener noreferrer" style={{ color: '#0A66C2', textDecoration: 'none' }}>
              LinkedIn ↗
            </a>
            <a href="https://manishpatel.framer.website/" target="_blank" rel="noopener noreferrer" style={{ color: '#444', textDecoration: 'none' }}>
              Portfolio ↗
            </a>
          </div>

          {/* Summary */}
          <p style={{
            fontSize  : '13px',
            lineHeight: 1.7,
            color     : '#333',
            fontFamily: 'system-ui, sans-serif',
            margin    : '0 0 22px',
          }}>
            UX/UI Designer with hands-on experience building digital products for fintech, real estate, and agri-tech sectors. Passionate about creating intuitive, accessible interfaces backed by user research and data.
          </p>

          {/* ── Experience ── */}
          <Section title="Experience" />

          <Job
            title="UI/UX Designer"
            company="ROSS"
            location="New Delhi"
            dates="Oct 2023 – Present"
            bullets={[
              'Designed RossINDX — a B2B real-estate index platform with live market data dashboards',
              'Built Albatross CRM: reduced agent onboarding time by 35% through UX audit & redesign',
              'Led end-to-end design of Koncept, a proptech SaaS used by 200+ brokers',
              'Designed Farmers App (agri-tech): offline-first flows for low-connectivity rural users',
              'Created and maintained 3 public-facing marketing websites',
              'Grew LinkedIn presence to 5 000+ followers through consistent design content',
            ]}
          />

          <Job
            title="Freelance UX Designer"
            company="Self-employed"
            location="Remote"
            dates="2022 – 2023"
            bullets={[
              'Delivered end-to-end UX for 8 client projects across e-commerce and SaaS',
              'Conducted usability testing sessions and synthesised findings into actionable design improvements',
            ]}
          />

          {/* ── Skills ── */}
          <Section title="Skills" />
          <p style={{
            fontSize  : '13px',
            lineHeight: 1.8,
            color     : '#333',
            fontFamily: 'system-ui, sans-serif',
            margin    : '0 0 22px',
          }}>
            UX Design · UI Design · Figma · Framer · Prototyping · Wireframing ·
            User Research · Usability Testing · Design Systems · Adobe XD ·
            Interaction Design · Responsive Design
          </p>

          {/* ── Education ── */}
          <Section title="Education &amp; Certifications" />
          <div style={{ marginBottom: '8px' }}>
            <div style={{
              display       : 'flex',
              justifyContent: 'space-between',
              alignItems    : 'baseline',
              flexWrap      : 'wrap',
              gap           : '4px',
            }}>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>
                Bachelor&apos;s in English (Honours)
              </span>
              <span style={{ fontSize: '12px', color: '#888', fontFamily: 'system-ui, sans-serif' }}>
                2020 – 2023
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#555', fontFamily: 'system-ui, sans-serif' }}>
              University of Delhi
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes mobBgIn {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @keyframes mobSheetIn {
          from { transform: translateY(100%) }
          to   { transform: translateY(0) }
        }
      `}</style>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Section({ title }: { title: string }) {
  return (
    <h2 style={{
      fontSize     : '13px',
      fontWeight   : 700,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color        : '#888',
      fontFamily   : 'system-ui, sans-serif',
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
      <div style={{
        display       : 'flex',
        justifyContent: 'space-between',
        alignItems    : 'baseline',
        flexWrap      : 'wrap',
        gap           : '4px',
        marginBottom  : '2px',
      }}>
        <span style={{ fontWeight: 700, fontSize: '15px' }}>{title}</span>
        <span style={{ fontSize: '12px', color: '#888', fontFamily: 'system-ui, sans-serif' }}>{dates}</span>
      </div>
      <div style={{
        fontSize  : '13px',
        color     : '#666',
        fontFamily: 'system-ui, sans-serif',
        marginBottom: '8px',
      }}>
        {company} · {location}
      </div>
      <ul style={{
        margin    : 0,
        paddingLeft: '18px',
        fontSize  : '13px',
        lineHeight: 1.7,
        color     : '#333',
        fontFamily: 'system-ui, sans-serif',
      }}>
        {bullets.map((b, i) => <li key={i} style={{ marginBottom: '4px' }}>{b}</li>)}
      </ul>
    </div>
  )
}
