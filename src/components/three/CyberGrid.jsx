import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CyberGrid = () => {
  const gridRef = useRef();
  const gridSize = 50;
  const divisions = 50;

  // Animate grid (pulsing effect)
  useFrame((state) => {
    if (gridRef.current) {
      const time = state.clock.getElapsedTime();
      gridRef.current.material.opacity = 0.3 + Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <group position={[0, -2, 0]}>
      {/* Main Grid */}
      <gridHelper
        ref={gridRef}
        args={[gridSize, divisions, '#00ffff', '#ff00ff']}
        rotation={[0, 0, 0]}
      />
      
      {/* Glowing plane underneath */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[gridSize, gridSize]} />
        <meshBasicMaterial
          color="#0a0a1f"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Corner markers */}
      {[
        [gridSize / 2, 0, gridSize / 2],
        [-gridSize / 2, 0, gridSize / 2],
        [gridSize / 2, 0, -gridSize / 2],
        [-gridSize / 2, 0, -gridSize / 2],
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.5, 2, 0.5]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  );
};

export default CyberGrid;
