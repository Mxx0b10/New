import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { vertexShader, fragmentShader } from './shaders';

interface ImageTransitionProps {
    images: string[];
    duration?: number;
}

export const ImageTransition: React.FC<ImageTransitionProps> = ({ images, duration = 1.0 }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { viewport } = useThree(); // Obtain WebGL scene viewport sizes

    // Local state to keep track of textures
    const [index, setIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState((1) % images.length);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Preload textures via R3F's drei hook. Blocks rendering until resolved. 
    // Make sure you handle suspense gracefully up the tree!
    const textures = useTexture(images);

    // Ensure that texture encoding behaves properly (sRGB) 
    useEffect(() => {
        textures.forEach((texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipMapLinearFilter;
        });
    }, [textures]);

    // Construct uniforms map
    const uniforms = useMemo(
        () => ({
            uProgress: { value: 0 },
            uTime: { value: 0 },
            uTexture1: { value: textures[0] },
            uTexture2: { value: textures[1 % textures.length] },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        }),
        [textures]
    );

    // Tie uniform time mapping and manual frame animations
    useFrame((state, delta) => {
        if (!materialRef.current) return;

        // Update local shader time uniform
        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

        // Progress animation loop calculation
        if (isTransitioning) {
            materialRef.current.uniforms.uProgress.value += delta / duration;

            // When transition ends => lock limits and swap textures inside uniforms mapping
            if (materialRef.current.uniforms.uProgress.value >= 1.0) {
                materialRef.current.uniforms.uProgress.value = 0.0;

                setIsTransitioning(false);

                const newCurrentIndex = nextIndex;
                const newNextIndex = (nextIndex + 1) % images.length;

                setIndex(newCurrentIndex);
                setNextIndex(newNextIndex);

                materialRef.current.uniforms.uTexture1.value = textures[newCurrentIndex];
                materialRef.current.uniforms.uTexture2.value = textures[newNextIndex];
            }
        }
    });

    // Initiate burn behavior
    const handleClick = () => {
        if (!isTransitioning) {
            setIsTransitioning(true);
        }
    };

    return (
        <mesh onClick={handleClick}>
            {/* Geometry scaled absolutely across browser window bounds */}
            <planeGeometry args={[viewport.width, viewport.height]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

export default ImageTransition;
