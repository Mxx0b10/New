'use client'

import { forwardRef, type ReactNode } from 'react'

/**
 * Off-screen resume HTML — 800 × 1250 px.
 * Layout mirrors the actual PDF resume exactly.
 */
const ResumeContent = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position       : 'absolute',
        left           : '-9999px',
        top            : '0px',
        width          : '800px',
        height         : '1250px',
        backgroundColor: '#FFFFFF',
        fontFamily     : 'system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
        overflow       : 'hidden',
        color          : '#000000',
        fontSize       : '13px',
        lineHeight     : 1.5,
      }}
    >
      <div style={{ padding: '48px 52px 40px' }}>

        {/* ── Name ─────────────────────────────────── */}
        <div style={{
          fontSize    : '36px',
          fontWeight  : 700,
          color       : '#000000',
          lineHeight  : 1.1,
          marginBottom: '12px',
        }}>
          Manish Patel
        </div>

        {/* ── Summary ──────────────────────────────── */}
        <div style={{
          fontSize    : '12px',
          color       : '#111111',
          lineHeight  : 1.65,
          marginBottom: '16px',
          maxWidth    : '680px',
        }}>
          UX/UI Designer with 1.6+ years of agency experience designing edtech platforms, SaaS
          products. At ROSS, led end-to-end design of Koncept Global Books (multi-role edtech
          platform) and RossINDX (AI-powered market entry product) — owning everything from UX
          flows and brand identity to frontend development. Comfortable with the full
          design-to-launch pipeline: Figma → Framer / HTML/CSS.
        </div>

        {/* ── Contact row ──────────────────────────── */}
        <div style={{
          display      : 'flex',
          alignItems   : 'center',
          gap          : '0',
          fontSize     : '11.5px',
          color        : '#222222',
          marginBottom : '22px',
          flexWrap     : 'wrap',
        }}>
          {['+ 91 (880) 081-6674', 'manish10thfeh@gmail.com', 'New Delhi, India', 'LinkedIn', 'Portfolio']
            .map((item, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  color: item === 'LinkedIn' || item === 'Portfolio' ? '#1144aa' : '#000000',
                }}>
                  {item}
                </span>
                {i < arr.length - 1 && (
                  <span style={{ margin: '0 10px', color: '#999999' }}>|</span>
                )}
              </span>
            ))}
        </div>

        {/* ── Divider ──────────────────────────────── */}
        <div style={{ borderTop: '1.5px solid #CCCCCC', marginBottom: '20px' }} />

        {/* ── EXPERIENCE ───────────────────────────── */}
        <SectionHeading>Experience</SectionHeading>

        <JobEntry
          title="UX/UI Designer"
          rightTop="New Delhi, India"
          company="Retail One Solutions & Services (ROSS)"
          rightBottom="Sep 2024 - Present"
          bullets={[
            'Designing and developing RossINDX — an AI-powered India market entry diagnostic platform; owning full product design including UX flows, edge case mapping, state design, and complete brand identity. (Ongoing, Dec 2025)',
            'Designed, developed, and launched Albatross (ROSS in-house brand) — end-to-end brand identity, website design and frontend development, shipped in 1 week.',
            'Spearheaded end-to-end UX/UI design for Koncept Global Books EdTech platform, delivering role-based dashboards for teachers, students, and parents that accelerated test creation by 50% through digital automation.',
            'Transformed Farmers App into B2B marketplace modeled after Country Delight, enabling stakeholders to secure 2 new partnerships in Q1 2024-2025.',
            'Designed and launched 4 responsive websites for ROSS and clients, increasing time-on-page 429% (7s to 37s), boosting conversion 25%, and generating 200+ leads in 2025-2026.',
            'Elevated company visibility through LinkedIn strategy with 20+ design posts that positioned ROSS as thought leader.',
          ]}
        />

        <JobEntry
          title="Freelance UX Designer"
          rightTop=""
          company="Self Employed"
          rightBottom="Nov 2025 - Present"
          bullets={[
            'Delivered 2 conversion-optimised websites for hospitality and services clients — 45% uplift in lead generation.',
            'Secured 3rd place in New Forms Design Challenge among 200+ international designers.',
          ]}
        />

        {/* ── SKILLS ───────────────────────────────── */}
        <SectionHeading>Skills</SectionHeading>
        <div style={{
          fontSize    : '12px',
          color       : '#000000',
          lineHeight  : 1.7,
          marginBottom: '20px',
        }}>
          UX Design, Web Design, Product Design, Figma, Paper, Framer, Adobe Illustrator,
          Wireframing, Lottielabs, Jitter, HTML, CSS, JS.
        </div>

        {/* ── EDUCATION & CERTIFICATIONS ───────────── */}
        <SectionHeading>Education & Certifications</SectionHeading>

        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#000000' }}>
              Bachelor&apos;s in English (Honors)
            </span>
            <span style={{ fontSize: '11.5px', color: '#333333' }}>Aug 2021 - Aug 2024</span>
          </div>
          <div style={{ fontSize: '12px', color: '#222222' }}>Delhi University</div>
        </div>

        {/* ── Footer ───────────────────────────────── */}
        <div style={{
          position    : 'absolute',
          bottom      : '24px',
          left        : '52px',
          right       : '52px',
          fontSize    : '9px',
          color       : '#888888',
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          borderTop   : '1px solid #CCCCCC',
          paddingTop  : '10px',
        }}>
          Manish Patel · UX/UI Designer · manish10thfeh@gmail.com
        </div>

      </div>
    </div>
  )
})

ResumeContent.displayName = 'ResumeContent'
export default ResumeContent

// ── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontSize    : '20px',
      fontWeight  : 700,
      color       : '#000000',
      marginBottom: '10px',
      marginTop   : '4px',
      lineHeight  : 1.2,
    }}>
      {children}
    </div>
  )
}

function JobEntry({
  title, rightTop, company, rightBottom, bullets,
}: {
  title: string
  rightTop: string
  company: string
  rightBottom: string
  bullets: string[]
}) {
  return (
    <div style={{ marginBottom: '18px' }}>
      {/* Title row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#000000' }}>{title}</span>
        {rightTop && (
          <span style={{ fontSize: '12px', color: '#333333' }}>{rightTop}</span>
        )}
      </div>
      {/* Company row */}
      <div style={{
        display       : 'flex',
        justifyContent: 'space-between',
        alignItems    : 'baseline',
        marginBottom  : '7px',
      }}>
        <span style={{ fontSize: '12px', color: '#333333' }}>{company}</span>
        <span style={{ fontSize: '12px', color: '#333333' }}>{rightBottom}</span>
      </div>
      {/* Bullets */}
      {bullets.map((b, i) => (
        <div key={i} style={{
          display     : 'flex',
          gap         : '8px',
          fontSize    : '11.5px',
          color       : '#000000',
          lineHeight  : 1.6,
          marginBottom: '4px',
          paddingLeft : '4px',
        }}>
          <span style={{ color: '#555555', flexShrink: 0, marginTop: '2px' }}>•</span>
          <span>{b}</span>
        </div>
      ))}
    </div>
  )
}
