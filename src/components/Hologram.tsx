import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface HologramProps {
  onDissolveComplete: () => void;
  isDissolving: boolean;
}

export function Hologram({ onDissolveComplete, isDissolving }: HologramProps) {
  const meshRef = useRef<THREE.Points>(null);
  const { size } = useThree();
  
  // We'll use a placeholder if input_file_0.png isn't available, but try to use it first.
  // In a real environment, this might be a local path or a URL.
  const texture = useTexture('https://picsum.photos/seed/cyberhead123/800/800'); 
  
  const particlesCount = 15000;
  
  const [positions, colors, velocities] = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const cols = new Float32Array(particlesCount * 3);
    const vels = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        // Spiral / Swirl formation for a more "holographic" feel
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 2;
        const spiral = i * 0.003;
        
        const x = Math.cos(angle + spiral) * radius;
        const z = Math.sin(angle + spiral) * radius;
        
        // Use a profile of a face (simplified ellipsoid)
        const y = (Math.random() - 0.5) * 4;
        
        // Shape into a head-like ellipsoid
        const scaleX = Math.sqrt(Math.max(0, 1 - (y * y) / 10)) * 2;
        const scaleZ = Math.sqrt(Math.max(0, 1 - (y * y) / 10)) * 1.8;
        
        pos[i3] = x * scaleX;
        pos[i3 + 1] = y;
        pos[i3 + 2] = z * scaleZ;
        
        // Random velocities for explosion
        vels[i3] = (Math.random() - 0.5) * 2;
        vels[i3 + 1] = (Math.random() - 0.5) * 2;
        vels[i3 + 2] = (Math.random() - 0.5) * 2;

        // Colors from image palette: Cyan and Purple
        if (Math.random() > 0.4) {
          cols[i3] = 0.13; // 34/255
          cols[i3 + 1] = 0.82; // 211/255
          cols[i3 + 2] = 0.93; // 238/255
        } else {
          cols[i3] = 0.66; // 168/255 
          cols[i3 + 1] = 0.33; // 85/255
          cols[i3 + 2] = 0.97; // 247/255
        }
    }
    return [pos, cols, vels];
  }, []);

  const initialPositions = useMemo(() => new Float32Array(positions), [positions]);
  
  const [dissolveFactor, setDissolveFactor] = useState(0);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const posArray = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    if (isDissolving) {
      setDissolveFactor(prev => Math.min(prev + 0.015, 1));
    }

    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        
        if (isDissolving) {
          // Explode particles with their own velocities
          posArray[i3] += velocities[i3] * dissolveFactor * 0.5;
          posArray[i3 + 1] += velocities[i3 + 1] * dissolveFactor * 0.5;
          posArray[i3 + 2] += velocities[i3 + 2] * dissolveFactor * 0.5;
        } else {
          // Pulse the face
          const wave = Math.sin(time * 2 + initialPositions[i3 + 1] * 0.5) * 0.05;
          posArray[i3] = initialPositions[i3] + wave;
          posArray[i3 + 1] = initialPositions[i3 + 1] + wave;
          posArray[i3 + 2] = initialPositions[i3 + 2] + wave;
        }
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y += 0.005;

    if (dissolveFactor >= 1) {
        onDissolveComplete();
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particlesCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={1 - dissolveFactor * 0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
}
