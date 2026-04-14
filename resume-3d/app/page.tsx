import dynamic from 'next/dynamic'

// SSR must be off — Three.js + html2canvas need the browser
const ThreeScene = dynamic(() => import('@/components/ThreeScene'), {
  ssr: false,
  loading: () => (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#C4B5A0',
      color: 'rgba(255,255,255,0.4)',
      fontFamily: 'system-ui',
      fontSize: '12px',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
    }}>
      Loading…
    </div>
  ),
})

export default function Home() {
  return <ThreeScene />
}
