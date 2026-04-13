import React, { useState } from 'react';
import blueBg from '../assets/blue-bg.png';
import greenBg from '../assets/green-bg.png';
import noReportImg from '../assets/no-report.png';
import fullDashboardImg from '../assets/dashboard-full.jpg';

export function RossLogo() {
  return (
    <svg width="133" height="25" viewBox="0 0 133 25" fill="none"
      xmlns="http://www.w3.org/2000/svg" style={{ width: 109, height: 20, flexShrink: 0 }}>
      <rect width="24.508" height="24.508" rx="2" fill="#FF6900" />
      <path d="M14.465 12.242C12.896 13.77 11.394 15.37 9.823 16.895C9.679 17.036 9.571 17.151 9.431 17.287C9.213 17.499 8.962 17.679 8.783 17.927H4.599L10.251 12.243L4.528 6.558L8.782 6.559V6.558L14.465 12.242ZM20.469 12.244C18.901 13.772 17.397 15.372 15.826 16.897C15.682 17.038 15.574 17.152 15.435 17.288C15.216 17.501 14.966 17.68 14.786 17.929H10.603L16.255 12.245L10.532 6.56L14.786 6.561V6.56L20.469 12.244Z" fill="#FFFFFF" />
      <path d="M35.002 5.186H37.264V8.272H37.32C38.479 5.894 40.092 4.761 42.696 4.846V7.394C38.821 7.394 37.405 9.574 37.405 13.31V19.82H35V5.186H35.002Z" fill="#1A1A1A" />
      <path d="M50.109 4.846C54.748 4.846 57.211 8.216 57.211 12.517C57.211 16.818 54.75 20.159 50.109 20.159C45.469 20.159 43.008 16.791 43.008 12.517C43.008 8.242 45.469 4.846 50.109 4.846ZM50.109 18.038C52.626 18.038 54.665 16.057 54.665 12.517C54.665 8.977 52.629 6.97 50.109 6.97C47.59 6.97 45.554 8.979 45.554 12.517C45.554 16.054 47.59 18.038 50.109 18.038Z" fill="#1A1A1A" />
      <path d="M60.805 15.206C60.89 17.356 62.786 18.038 64.738 18.038C66.237 18.038 68.275 17.698 68.275 15.858C68.275 12.093 58.713 14.641 58.713 9.006C58.713 6.063 61.598 4.846 64.173 4.846C67.456 4.846 69.944 5.864 70.172 9.431H67.766C67.626 7.561 65.928 6.967 64.372 6.967C62.929 6.967 61.259 7.363 61.259 8.837C61.259 10.536 63.805 10.876 66.04 11.385C68.445 11.923 70.821 12.742 70.821 15.545C70.821 19.056 67.568 20.159 64.597 20.159C61.317 20.159 58.543 18.828 58.402 15.206H60.808H60.805Z" fill="#1A1A1A" />
      <path d="M74.247 15.206C74.332 17.356 76.228 18.038 78.18 18.038C79.678 18.038 81.717 17.698 81.717 15.858C81.717 12.093 72.154 14.641 72.154 9.006C72.154 6.063 75.04 4.846 77.615 4.846C80.897 4.846 83.385 5.864 83.613 9.431H81.208C81.067 7.561 79.37 6.967 77.813 6.967C76.371 6.967 74.7 7.363 74.7 8.837C74.7 10.536 77.246 10.876 79.481 11.385C81.887 11.923 84.263 12.742 84.263 15.545C84.263 19.056 81.009 20.159 78.039 20.159C74.758 20.159 71.984 18.828 71.844 15.206H74.249H74.247Z" fill="#1A1A1A" />
      <path d="M86.315 4.497H88.368V19.5H86.315V4.497ZM90.631 4.497H93.031L100.609 16.651V4.497H102.54V19.5H100.262L92.571 7.356V19.5H90.631V4.497ZM110.461 17.764C111.149 17.764 111.714 17.692 112.156 17.549C112.946 17.284 113.593 16.773 114.097 16.017C114.499 15.411 114.788 14.635 114.965 13.689C115.067 13.123 115.118 12.599 115.118 12.116C115.118 10.257 114.747 8.813 114.005 7.785C113.27 6.757 112.082 6.243 110.441 6.243H106.835V17.764H110.461ZM104.793 4.497H110.87C112.933 4.497 114.533 5.229 115.67 6.692C116.684 8.013 117.192 9.705 117.192 11.768C117.192 13.362 116.892 14.802 116.293 16.089C115.238 18.363 113.423 19.5 110.849 19.5H104.793V4.497ZM120.058 19.5H117.606L122.979 11.809L117.943 4.497H120.487L124.317 10.236L128.116 4.497H130.536L125.501 11.809L130.782 19.5H128.259L124.214 13.331L120.058 19.5Z" fill="#1A1A1A" />
    </svg>
  );
}

export default function Dashboard({ onStartDiagnostic }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      backgroundColor: '#F3F4F6', // Off-white/grey background
      minHeight: '100vh', width: '100%',
      fontFamily: '"Helvetica Neue", Helvetica, system-ui, sans-serif',
      boxSizing: 'border-box'
    }}>
      {/* TOPBAR */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: '12px 48px',
        borderBottom: '1px solid #EAEAEA',
        width: '100%', flexShrink: 0,
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Logo element from image */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24.508" height="24.508" rx="2" fill="#0A3055" />
              <path d="M14.465 12.242C12.896 13.77 11.394 15.37 9.823 16.895C9.679 17.036 9.571 17.151 9.431 17.287C9.213 17.499 8.962 17.679 8.783 17.927H4.599L10.251 12.243L4.528 6.558L8.782 6.559V6.558L14.465 12.242ZM20.469 12.244C18.901 13.772 17.397 15.372 15.826 16.897C15.682 17.038 15.574 17.152 15.435 17.288C15.216 17.501 14.966 17.68 14.786 17.929H10.603L16.255 12.245L10.532 6.56L14.786 6.561V6.56L20.469 12.244Z" fill="#3AB5FF" />
            </svg>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#0A3055' }}>INDX</span>
          </div>

          <div style={{ width: 1, height: 16, backgroundColor: '#E0E0E0' }} />

          {/* Nav Tabs */}
          <div style={{ display: 'flex', border: '1px solid #EAEAEA', borderRadius: 4, overflow: 'hidden' }}>
            {['Dashboard', 'Reports', 'Account'].map((tab) => (
              <button
                key={tab}
                style={{
                  padding: '6px 16px',
                  backgroundColor: activeTab === tab ? '#1A1A1A' : '#FFFFFF',
                  color: activeTab === tab ? '#FFFFFF' : '#5F5F5F',
                  border: 'none',
                  fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
                  cursor: 'pointer', outline: 'none', transition: 'all 0.2s',
                  borderRight: tab !== 'Account' ? '1px solid #EAEAEA' : 'none'
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* User Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="user-pill" style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px 4px 4px', border: '1px solid #EAEAEA', borderRadius: 6 }} onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 26, height: 26, borderRadius: '50%',
              backgroundColor: '#DDEFFF', flexShrink: 0,
            }}>
              <span style={{
                color: '#079CEE', fontSize: 11, fontWeight: 700, lineHeight: '14px',
              }}>AB</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#1A1A1A', fontSize: 13, fontWeight: 700, lineHeight: '16px' }}>Alex Baker</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="#3C3C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            
            {isProfileOpen && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: 8,
                backgroundColor: '#FFFFFF', borderRadius: 8,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #EAEAEA',
                width: 180, zIndex: 10, overflow: 'hidden',
                display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ padding: '10px 16px', color: '#1A1A1A', fontSize: 13, transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.backgroundColor = '#F5F5F5'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>Profile</div>
                <div style={{ padding: '10px 16px', color: '#1A1A1A', fontSize: 13, transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.backgroundColor = '#F5F5F5'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>Account</div>
                <div style={{ padding: '10px 16px', color: '#1A1A1A', fontSize: 13, transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.backgroundColor = '#F5F5F5'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>Subscription</div>
                <div style={{ borderTop: '1px solid #EAEAEA', padding: '10px 16px', color: '#E43D3D', fontSize: 13, transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.backgroundColor = '#FFF0F0'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>Log Out</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DASHBOARD BODY */}
      <div style={{ width: '100%', maxWidth: 1120, margin: '0 auto', padding: '48px 24px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        
        {/* Welcome Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          <h1 style={{ color: '#33B1FF', fontSize: 32, fontWeight: 400, margin: 0, fontFamily: '"Georgia", serif' }}>Good morning, Alex</h1>
          <p style={{ color: '#5F5F5F', fontSize: 15, margin: 0 }}>Continue your diagnostics or review your generated reports.</p>
        </div>

        {/* Status Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 56 }}>
          {/* Card 1 */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAEAEA', borderRadius: 12, padding: '24px', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <span style={{ color: '#888888', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>REPORTS USED</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ color: '#1A1A1A', fontSize: 32, fontWeight: 700 }}>0</span>
              <span style={{ color: '#888888', fontSize: 16 }}>/ 20</span>
            </div>
            <span style={{ color: '#A0A0A0', fontSize: 12 }}>20 remaining</span>
          </div>
          {/* Card 2 */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAEAEA', borderRadius: 12, padding: '24px', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <span style={{ color: '#888888', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>REPORTS REMAINING</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ color: '#1A1A1A', fontSize: 32, fontWeight: 700 }}>20</span>
            </div>
            <span style={{ color: '#A0A0A0', fontSize: 12 }}>of 20 included</span>
          </div>
          {/* Card 3 */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAEAEA', borderRadius: 12, padding: '24px', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
             <span style={{ color: '#888888', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>ACCESS REMAINING</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ color: '#1A1A1A', fontSize: 32, fontWeight: 700 }}>90</span>
              <span style={{ color: '#888888', fontSize: 16 }}>days</span>
            </div>
            <span style={{ color: '#A0A0A0', fontSize: 12 }}>Expires Jun 15, 2026</span>
          </div>
        </div>

        {/* Your Diagnostics Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 56 }}>
          <h2 style={{ color: '#1A1A1A', fontSize: 18, fontWeight: 700, margin: 0 }}>Your diagnostics</h2>

          {/* Diagnostic Action Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          
          {/* Diagnostic Card 1 - Blue */}
          <div 
            onClick={() => onStartDiagnostic('india')}
            style={{ 
              backgroundImage: `url(${blueBg})`, backgroundSize: 'cover', backgroundPosition: 'center',
              borderRadius: 16, border: '1px solid #EAEAEA', padding: '32px 24px',
              display: 'flex', flexDirection: 'column', gap: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: '#D42D2D', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>INDIA DIAGNOSTIC</span>
              <span style={{ backgroundColor: '#FFFFFF', color: '#00A82D', border: '1px solid #EAEAEA', borderRadius: 12, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>Ready to start</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={{ margin: 0, color: '#1A1A1A', fontSize: 24, fontWeight: 700 }}>India Entry Diagnostic (INDX)</h3>
              <p style={{ margin: 0, color: '#5F5F5F', fontSize: 14, lineHeight: '20px', minHeight: 40 }}>6-stage board-level evaluation for India market entry viability, regulation, and partner risk.</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', backgroundColor: '#FFFFFF', borderRadius: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ color: '#888888', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>STAGES</span>
                <span style={{ color: '#1A1A1A', fontSize: 16, fontWeight: 700 }}>6-stage</span>
              </div>
              <div style={{ width: 1, height: 32, backgroundColor: '#EAEAEA' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ color: '#888888', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>TIME</span>
                <span style={{ color: '#1A1A1A', fontSize: 16, fontWeight: 700 }}>~45 mins</span>
              </div>
               <div style={{ width: 1, height: 32, backgroundColor: '#EAEAEA' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ color: '#888888', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>EXPORT</span>
                <span style={{ color: '#1A1A1A', fontSize: 16, fontWeight: 700 }}>PDF</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 'auto', paddingTop: 8 }}>
              <button 
                onClick={(e) => { e.stopPropagation(); onStartDiagnostic('india'); }} 
                style={{ 
                  cursor: 'pointer', alignItems: 'center', backgroundImage: 'linear-gradient(in oklab 180deg, oklab(26.8% 0.001 .0006) 50%, oklab(18.2% .0001 0) 100%)', backgroundOrigin: 'border-box', borderColor: '#444444', borderRadius: '6px', borderStyle: 'solid', borderWidth: '1px', boxShadow: '#171616 0px 0px 0px 0.5px inset, #0000001F 0px 2px 3px, #000000 0px 0px 0px 1px', boxSizing: 'border-box', display: 'flex', flexBasis: '0%', flexDirection: 'column', flexGrow: 1, flexShrink: 1, fontSize: '12px', fontSynthesis: 'none', gap: 0, justifyContent: 'center', lineHeight: '16px', MozOsxFontSmoothing: 'grayscale', paddingBlock: '12px', paddingInline: '12px', WebkitFontSmoothing: 'antialiased'
                }}
              >
                <span style={{ boxSizing: 'border-box', color: '#FFFFFF', display: 'inline-block', fontFamily: '"Helvetica-Bold", "Helvetica", system-ui, sans-serif', fontSize: '14px', fontWeight: 700, lineHeight: '18px' }}>Start diagnostic</span>
              </button>
              <button style={{ flex: 1, backgroundColor: '#FFFFFF', color: '#1A1A1A', border: '1px solid #EAEAEA', borderRadius: 8, padding: '16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }} onClick={(e) => e.stopPropagation()}>How it works</button>
            </div>
          </div>

           <div 
            onClick={() => onStartDiagnostic('gulf')}
            style={{ 
              backgroundImage: `url(${fullDashboardImg})`, backgroundSize: 'cover', backgroundPosition: 'center',
              borderRadius: 16, border: '1px solid #EAEAEA', padding: '32px 24px',
              display: 'flex', flexDirection: 'column', gap: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: '#D47E2D', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>GULF DIAGNOSTIC</span>
              <span style={{ backgroundColor: '#FFFFFF', color: '#00A82D', border: '1px solid #EAEAEA', borderRadius: 12, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>Report ready</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 style={{ margin: 0, color: '#1A1A1A', fontSize: 24, fontWeight: 700 }}>Gulf Disruption Rebalancing</h3>
              <p style={{ margin: 0, color: '#5F5F5F', fontSize: 14, lineHeight: '20px', minHeight: 40 }}>Assess whether Gulf volatility should trigger India market entry rebalancing.</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', backgroundColor: '#FFFFFF', border: '1px solid #EAEAEA', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.04)', cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ color: '#888888', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>LENSES</span>
                <span style={{ color: '#1A1A1A', fontSize: 16, fontWeight: 700 }}>4-lens</span>
              </div>
              <div style={{ width: 1, height: 32, backgroundColor: '#EAEAEA' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ color: '#888888', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>TIME</span>
                <span style={{ color: '#1A1A1A', fontSize: 16, fontWeight: 700 }}>~10 mins</span>
              </div>
               <div style={{ width: 1, height: 32, backgroundColor: '#EAEAEA' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ color: '#888888', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>EXPORT</span>
                <span style={{ color: '#1A1A1A', fontSize: 16, fontWeight: 700 }}>PDF</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 'auto', paddingTop: 8 }}>
              <button 
                onClick={(e) => { e.stopPropagation(); onStartDiagnostic('gulf'); }} 
                style={{ 
                  cursor: 'pointer', alignItems: 'center', backgroundImage: 'linear-gradient(in oklab 180deg, oklab(26.8% 0.001 .0006) 50%, oklab(18.2% .0001 0) 100%)', backgroundOrigin: 'border-box', borderColor: '#444444', borderRadius: '6px', borderStyle: 'solid', borderWidth: '1px', boxShadow: '#171616 0px 0px 0px 0.5px inset, #0000001F 0px 2px 3px, #000000 0px 0px 0px 1px', boxSizing: 'border-box', display: 'flex', flexBasis: '0%', flexDirection: 'column', flexGrow: 1, flexShrink: 1, fontSize: '12px', fontSynthesis: 'none', gap: 0, justifyContent: 'center', lineHeight: '16px', MozOsxFontSmoothing: 'grayscale', paddingBlock: '12px', paddingInline: '12px', WebkitFontSmoothing: 'antialiased'
                }} 
              >
                <span style={{ boxSizing: 'border-box', color: '#FFFFFF', display: 'inline-block', fontFamily: '"Helvetica-Bold", "Helvetica", system-ui, sans-serif', fontSize: '14px', fontWeight: 700, lineHeight: '18px' }}>Start diagnostic</span>
              </button>
              <button style={{ flex: 1, backgroundColor: '#FFFFFF', color: '#1A1A1A', border: '1px solid #EAEAEA', borderRadius: 8, padding: '16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }} onClick={(e) => e.stopPropagation()}>How it works</button>
            </div>
          </div>

        </div>
        </div>

        {/* Recent Reports Table */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAEAEA', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}>
            <h2 style={{ color: '#1A1A1A', fontSize: 16, fontWeight: 700, margin: 0 }}>Recent reports</h2>
            <span style={{ color: '#33B1FF', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>View all reports →</span>
          </div>

          {/* Table Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', backgroundColor: '#F9F9F9', borderTop: '1px solid #EAEAEA', borderBottom: '1px solid #EAEAEA', padding: '12px 24px' }}>
            <span style={{ color: '#888888', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>REPORT NAME</span>
            <span style={{ color: '#888888', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>TYPE</span>
            <span style={{ color: '#888888', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>DATE</span>
            <span style={{ color: '#888888', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>VERDICT</span>
            <span style={{ color: '#888888', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em' }}>ACTIONS</span>
          </div>

          {/* Empty State */}
          <div style={{ backgroundColor: '#EFEFEF', minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, border: '1px solid #EAEAEA' }}>
                <img src={noReportImg} alt="No reports" style={{ width: 100, opacity: 0.8 }} />
                <span style={{ color: '#5F5F5F', fontSize: 13, fontWeight: 500 }}>No Report is created yet</span>
                <button style={{ backgroundColor: '#FFFFFF', color: '#1A1A1A', border: '1px solid #DCDCDC', borderRadius: 8, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>Create first report</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
