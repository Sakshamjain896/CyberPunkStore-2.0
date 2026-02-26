import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function LandingPage({ onEnter }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup with fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020205, 0.002);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 60;
    camera.position.y = 20;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x020205, 1);
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Particles (Stars) - matching homepage
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000 * 3; i++) {
      particlePos[i] = (Math.random() - 0.5) * 2000;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ color: 0x00f2ff, size: 1, transparent: true, opacity: 0.8 })
    );
    scene.add(particles);
    particlesRef.current = particles;

    // Animation loop
    const animate = (time) => {
      // Rotate particles slowly - matching homepage
      if (particlesRef.current) {
        particlesRef.current.rotation.y = time * 0.0002;
      }

      // Gentle camera movement - matching homepage
      cameraRef.current.position.y = Math.cos(time * 0.0001) * 3;
      cameraRef.current.position.x = Math.sin(time * 0.0001) * 5;
      cameraRef.current.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    // Resize handler
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && canvasRef.current && rendererRef.current.domElement) {
        canvasRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#020205',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Three.js Canvas */}
      <div
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          zIndex: 1,
          textAlign: 'center',
          padding: '40px',
          maxWidth: '900px'
        }}
      >
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            fontSize: 'clamp(3rem, 9vw, 8rem)',
            fontWeight: 900,
            lineHeight: 0.9,
            marginBottom: '30px',
            color: '#ffffff',
            letterSpacing: '-0.05em',
            fontFamily: 'Space Grotesk, sans-serif'
          }}
        >
          NEON<br />
          <span style={{
            color: '#00f2ff',
            textShadow: '0 0 40px rgba(0, 242, 255, 0.6), 0 0 80px rgba(0, 242, 255, 0.3)'
          }}>
            DREAMS
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{
            fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
            color: '#7a7a9a',
            marginBottom: '80px',
            textTransform: 'uppercase',
            letterSpacing: '0.5em',
            fontFamily: 'Space Mono, monospace'
          }}
        >
          Cyberpunk Marketplace v2.0
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#b4b4d4',
            maxWidth: '600px',
            margin: '0 auto 60px',
            lineHeight: 1.6,
            fontWeight: 300
          }}
        >
          Enter the future of digital commerce.<br />
          Premium tech. Advanced hardware. Your new reality starts here.
        </motion.p>

        {/* Enter Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          whileHover={{
            background: 'white',
            color: 'black',
            boxShadow: '0 0 40px #00f2ff'
          }}
          whileTap={{ scale: 0.98 }}
          onClick={onEnter}
          className="epic-btn"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '12px 24px',
            cursor: 'pointer',
            letterSpacing: '3px',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            backdropFilter: 'blur(5px)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            zIndex: 10
          }}
        >
          ENTER SYSTEM
        </motion.button>

        {/* Bottom Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ delay: 2, duration: 3, repeat: Infinity, repeatDelay: 1 }}
          style={{
            marginTop: '80px',
            fontSize: '0.7rem',
            color: 'rgba(122, 122, 154, 0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            fontFamily: 'Space Mono, monospace'
          }}
        >
          ▼ Click to Continue ▼
        </motion.div>
      </motion.div>

      {/* Corner Brackets - Minimal Style */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => {
        const positions = {
          'top-left': { top: '30px', left: '30px', rotate: '0deg' },
          'top-right': { top: '30px', right: '30px', rotate: '90deg' },
          'bottom-left': { bottom: '30px', left: '30px', rotate: '270deg' },
          'bottom-right': { bottom: '30px', right: '30px', rotate: '180deg' }
        };

        return (
          <motion.div
            key={corner}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1, delay: 1.5 }}
            style={{
              position: 'absolute',
              ...positions[corner],
              width: '40px',
              height: '40px',
              borderTop: '1px solid #00f2ff',
              borderRight: '1px solid #00f2ff',
              transform: `rotate(${positions[corner].rotate})`
            }}
          />
        );
      })}

      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
}

export default LandingPage;
