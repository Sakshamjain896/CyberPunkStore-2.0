import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useStore } from '../context/StoreContext';

const ThreeScene = ({ activeView }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const starsRef = useRef(null);
  const gridRef = useRef(null);
  const gridMatRef = useRef(null);
  const globeRef = useRef(null);
  const dataCoreRef = useRef(null);
  const waveRef = useRef(null);
  const animationIdRef = useRef(null);
  const coreSpeedRef = useRef(0.002);
  const { lowPowerMode, primaryColor } = useStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020205, 0.002);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 60;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Starfield
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000 * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 2000;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0x00f2ff, size: 1, transparent: true, opacity: 0.8 })
    );
    scene.add(stars);
    starsRef.current = stars;

    // Grid with shader
    const gridMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x00f2ff) }
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z += sin(p.x * 0.15 + uTime) * 2.5;
          p.z += cos(p.y * 0.2 + uTime) * 1.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColor;
        void main() {
          float grid = step(0.97, fract(vUv.x * 40.0)) + step(0.97, fract(vUv.y * 40.0));
          float pulse = 0.2 + 0.3 * sin(uTime * 0.7);
          gl_FragColor = vec4(uColor * grid * pulse, grid * (0.1 + pulse));
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
    gridMatRef.current = gridMat;

    const grid = new THREE.Mesh(new THREE.PlaneGeometry(400, 400, 100, 100), gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -30;
    scene.add(grid);
    gridRef.current = grid;

    // Globe for About page
    const globeGeo = new THREE.IcosahedronGeometry(15, 2);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x00f2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globe.position.set(20, 0, 0);
    globe.visible = false;
    scene.add(globe);
    globeRef.current = globe;

    // Data Core for Contact page
    const coreGeo = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const dataCore = new THREE.Mesh(coreGeo, coreMat);
    dataCore.position.set(0, 0, 0);
    dataCore.visible = false;
    scene.add(dataCore);
    dataCoreRef.current = dataCore;

    // Wave for About page
    const waveGeo = new THREE.PlaneGeometry(300, 100, 50, 20);
    const waveMat = new THREE.PointsMaterial({
      color: 0x00f2ff,
      size: 0.5,
      transparent: true,
      opacity: 0.6
    });
    const wave = new THREE.Points(waveGeo, waveMat);
    wave.rotation.x = -Math.PI / 2.5;
    wave.position.y = -30;
    wave.visible = false;
    scene.add(wave);
    waveRef.current = wave;

    // Animation loop
    const animate = (time) => {
      if (!lowPowerMode && sceneRef.current && cameraRef.current && rendererRef.current) {
        if (gridMatRef.current) {
          gridMatRef.current.uniforms.uTime.value = time * 0.001;
        }

        if (starsRef.current) {
          starsRef.current.rotation.y = time * 0.00005;
        }

        if (globeRef.current && globeRef.current.visible) {
          globeRef.current.rotation.y = time * 0.0005;
          globeRef.current.rotation.z = time * 0.0002;
        }

        if (waveRef.current && waveRef.current.visible) {
          const positions = waveRef.current.geometry.attributes.position.array;
          const animTime = time * 0.001;
          for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            positions[i + 2] =
              Math.sin((x + animTime) * 0.1) * 3 + Math.sin((positions[i + 1] + animTime) * 0.1) * 3;
          }
          waveRef.current.geometry.attributes.position.needsUpdate = true;
        }

        if (dataCoreRef.current && dataCoreRef.current.visible) {
          dataCoreRef.current.rotation.x = time * coreSpeedRef.current;
          dataCoreRef.current.rotation.y = time * (coreSpeedRef.current * 1.5);
        }

        // Camera positioning based on view
        if (activeView === 'main-view') {
          cameraRef.current.position.y = Math.cos(time * 0.0001) * 3;
          cameraRef.current.position.x = Math.sin(time * 0.0001) * 5;
        } else if (activeView === 'products-view') {
          cameraRef.current.position.y = 10;
          if (starsRef.current) starsRef.current.rotation.y = time * 0.0002;
        } else if (activeView === 'about-view') {
          cameraRef.current.position.set(0, 0, 50);
        } else if (activeView === 'contact-view') {
          cameraRef.current.position.set(0, 0, 60);
        }

        if (activeView !== 'about-view' && activeView !== 'contact-view') {
          cameraRef.current.lookAt(0, 0, 0);
        }

        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
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
      if (rendererRef.current && canvasRef.current) {
        canvasRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [lowPowerMode]);

  // Update visibility based on active view
  useEffect(() => {
    if (globeRef.current) globeRef.current.visible = false;
    if (dataCoreRef.current) dataCoreRef.current.visible = false;
    if (waveRef.current) waveRef.current.visible = false;
    if (starsRef.current) starsRef.current.visible = true;
    if (gridRef.current) gridRef.current.visible = true;

    if (activeView === 'about-view') {
      if (globeRef.current) globeRef.current.visible = true;
      if (waveRef.current) waveRef.current.visible = true;
      if (gridRef.current) gridRef.current.visible = false;
    } else if (activeView === 'contact-view') {
      if (dataCoreRef.current) dataCoreRef.current.visible = true;
      if (gridRef.current) gridRef.current.visible = false;
    }
  }, [activeView]);

  // Update theme color
  useEffect(() => {
    const color = new THREE.Color(primaryColor);
    if (gridMatRef.current) {
      gridMatRef.current.uniforms.uColor.value = color;
    }
    if (starsRef.current) {
      starsRef.current.material.color = color;
    }
    if (globeRef.current) {
      globeRef.current.material.color.set(primaryColor);
    }
    if (dataCoreRef.current) {
      dataCoreRef.current.material.color.set(primaryColor);
    }
    if (waveRef.current) {
      waveRef.current.material.color.set(primaryColor);
    }
  }, [primaryColor]);

  return <div ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 1 }} />;
};

export default ThreeScene;
