'use client'

import { forwardRef, type ReactNode, type CSSProperties } from 'react'

/**
 * Off-screen resume HTML — 800 × 1250 px (matches PH=5.0 / PW=3.2 = 1.5625 ratio).
 * Clean white background — no paper texture here; the PBR maps on the Three.js mesh
 * already provide all the surface texture. Keeping the capture pristine ensures
 * maximum text contrast on the 3D face.
 */
const ResumeContent = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position        : 'absolute',
        left            : '-9999px',
        top             : '0px',
        width           : '800px',
        height          : '1250px',
        backgroundColor : '#FFFFFF',
        fontFamily      : 'system-ui, -apple-system, "Segoe UI", Helvetica, sans-serif',
        overflow        : 'hidden',
        color           : '#000000',
      }}
    >

      <div style={{ padding: '52px 56px 48px', position: 'relative' }}>

        {/* ── Header ──────────────────────────────────── */}
        <div style={{ marginBottom: '32px' }}>

          {/* Small label above name */}
          <div style={{
            fontSize     : '10px',
            letterSpacing: '0.28em',
            fontWeight   : 500,
            color        : '#333333',
            textTransform: 'uppercase',
            marginBottom : '8px',
          }}>
            UX/UI Designer · New Delhi
          </div>

          {/* Large bold name */}
          <div style={{
            fontFamily  : '"Inter", system-ui, -apple-system, sans-serif',
            fontSize    : '52px',
            fontWeight  : 800,
            color       : '#000000',
            lineHeight  : 1.02,
            letterSpacing: '-1.5px',
            marginBottom: '14px',
          }}>
            Manish<br />Patel
          </div>

          {/* Contact line */}
          <div style={{
            fontSize     : '11px',
            color        : '#000000',
            letterSpacing: '0.04em',
            marginBottom : '5px',
          }}>
            +91 880 081 6674 · manish10thfeh@gmail.com
          </div>
          <div style={{ fontSize: '11px', color: '#000000', letterSpacing: '0.04em' }}>
            <span style={{ color: '#1144aa' }}>linkedin.com/in/manishpatel</span>
            {'  ·  '}
            <span style={{ color: '#1144aa' }}>manishpatel.design</span>
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────── */}
        <div style={{ borderTop: '2px solid #999999', marginBottom: '24px' }} />

        {/* ── Summary ─────────────────────────────────── */}
        <div style={{
          fontSize  : '12.5px',
          lineHeight: 1.7,
          color     : '#000000',
          marginBottom: '28px',
          maxWidth  : '580px',
        }}>
          UX designer with 1.5 years of experience crafting enterprise web applications
          and data-driven dashboards — translating complex requirements into clear,
          usable, and visually refined interfaces.
        </div>

        {/* ── EXPERIENCE ──────────────────────────────── */}
        <SectionLabel>Experience</SectionLabel>

        <Job
          title="UX/UI Designer"
          company="Retail One Solutions & Services (ROSS)"
          meta="New Delhi, India · Sep 2024 – Present"
          bullets={[
            'Led end-to-end design for Koncept Global Books EdTech platform — role-based dashboards for teachers, students, and parents, cutting test-creation time by 50%',
            'Transformed Farmers App into a B2B marketplace (Country Delight model) — 2 new partnerships secured in Q1 2024–2025',
            'Designed 3 responsive websites: time-on-page 7s → 37s, conversion +25%, 200+ leads in 2025–2026',
            'Built full brand identity for ROSS: logo, guidelines, design manual, and LinkedIn thought-leadership strategy',
          ]}
        />

        <Job
          title="Freelance UX Designer"
          company="Self Employed"
          meta="Nov 2025 – Present"
          bullets={[
            'Delivered 2 conversion-optimised websites for hotel & banquet sectors — 45% lift in lead generation',
            '3rd place, New Forms Design Challenge (200+ international participants)',
          ]}
        />

        {/* ── SKILLS ──────────────────────────────────── */}
        <SectionLabel>Skills</SectionLabel>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 16px', marginBottom: '24px' }}>
          <SkillCol
            label="Design & Prototyping"
            items={['Figma', 'Framer', 'Paper', 'Adobe Illustrator', 'Lottielab', 'Jitter', 'HTML/CSS/JS']}
          />
          <SkillCol
            label="Research & Strategy"
            items={['User Research', 'Usability Testing', 'Information Architecture', 'Market Research', 'Google Analytics']}
          />
          <SkillCol
            label="Systems & Visual"
            items={['Design Systems', 'Design Libraries', 'Typography', 'Visual Design', 'Motion & Animation']}
          />
        </div>

        {/* ── EDUCATION ───────────────────────────────── */}
        <SectionLabel>Education</SectionLabel>

        <EduRow
          degree="Advanced UI/UX Design Program"
          school="Arean Animation"
          dates="Jun 2023 – Sep 2024"
        />
        <EduRow
          degree="Bachelor's in English (Hons)"
          school="Delhi University"
          dates="Aug 2021 – Aug 2024"
        />

        {/* ── Footer ──────────────────────────────────── */}
        <div style={{
          position  : 'absolute',
          bottom    : '28px',
          left      : '56px',
          right     : '56px',
          fontSize  : '9px',
          color     : '#666666',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          borderTop : '1px solid #999999',
          paddingTop: '10px',
        }}>
          Manish Patel · UX/UI Designer · manish10thfeh@gmail.com
        </div>
      </div>
    </div>
  )
})

ResumeContent.displayName = 'ResumeContent'
export default ResumeContent

// ── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontSize     : '9px',
      fontWeight   : 600,
      letterSpacing: '0.28em',
      color        : '#333333',
      textTransform: 'uppercase',
      borderBottom : '1px solid #999999',
      paddingBottom: '5px',
      marginBottom : '12px',
      marginTop    : '4px',
    }}>
      {children}
    </div>
  )
}

const bulletStyle: CSSProperties = {
  display      : 'flex',
  gap          : '7px',
  fontSize     : '11px',
  color        : '#000000',
  lineHeight   : 1.65,
  marginBottom : '3px',
}

function Job({
  title, company, meta, bullets,
}: {
  title: string; company: string; meta: string; bullets: string[]
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#000000' }}>{title}</span>
        <span style={{ fontSize: '11px', color: '#333333' }}>{company}</span>
      </div>
      <div style={{ fontSize: '10.5px', color: '#222222', marginBottom: '6px', letterSpacing: '0.02em' }}>
        {meta}
      </div>
      {bullets.map((b, i) => (
        <div key={i} style={bulletStyle}>
          <span style={{ color: '#888888', flexShrink: 0, marginTop: '1px' }}>·</span>
          <span>{b}</span>
        </div>
      ))}
    </div>
  )
}

function SkillCol({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div style={{ fontSize: '10px', fontWeight: 600, color: '#000000', marginBottom: '5px' }}>
        {label}
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ fontSize: '11px', color: '#000000', lineHeight: 1.75 }}>
          {item}
        </div>
      ))}
    </div>
  )
}

function EduRow({ degree, school, dates }: { degree: string; school: string; dates: string }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#000000' }}>{degree}</span>
        <span style={{ fontSize: '10.5px', color: '#333333' }}>{dates}</span>
      </div>
      <div style={{ fontSize: '11px', color: '#000000' }}>{school}</div>
    </div>
  )
}
