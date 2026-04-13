import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ImageTransition } from './ImageTransition';

// Helper component handling basic loading fallback scenario 
const Loader = () => {
    return (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', fontFamily: 'sans-serif' }}>
            Loading High-Res Images...
        </div>
    );
};

export const App = () => {
    // A demonstration array involving 3 high-quality cinematic placeholder URLs
    const DEMO_IMAGES = [
        'https://images.unsplash.com/photo-1534214526114-0ea4d47b04f2?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1542314831-c5a4d4071f40?auto=format&fit=crop&w=1920&q=80',
    ];

    return (
        <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000', margin: 0, padding: 0, overflow: 'hidden' }}>

            {/* Main UI overlay text for user guidance */}
            <div style={{
                position: 'absolute', top: '20px', left: '20px',
                color: 'white', zIndex: 10, fontFamily: 'system-ui, sans-serif',
                background: 'rgba(0,0,0,0.5)', padding: '16px', borderRadius: '8px',
                backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <h1 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 600 }}>WebGL Cinematic Burn</h1>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Click anywhere on the screen to transition</p>
            </div>

            <Suspense fallback={<Loader />}>
                {/* Full-screen Canvas to bootstrap Three.js React tree */}
                <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 75 }}>
                    {/* Main effect wrapper */}
                    <ImageTransition images={DEMO_IMAGES} duration={1.2} />
                </Canvas>
            </Suspense>

        </div>
    );
};

export default App;
