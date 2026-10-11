"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // --- SETUP DASAR ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true, // Supaya background HTML tetap terlihat jika ada
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- TEXTURE ---
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const context = canvas.getContext('2d');
      if (context) {
        context.beginPath();
        context.arc(16, 16, 15, 0, Math.PI * 2);
        context.fillStyle = '#ffffff';
        context.fill();
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      return tex;
    };
    const circleTexture = createCircleTexture();

    // --- PARTICLES ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 20000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const parameters = {
      radius: 20,
      branches: 3,
      spin: 1,
      randomness: 0.5,
      randomnessPower: 3,
      insideColor: '#ff6030',
      outsideColor: '#1b3984'
    };

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * parameters.radius;
      const spinAngle = radius * parameters.spin;
      const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
      
      const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / parameters.radius);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      map: circleTexture,
      size: 0.15,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

// --- INTERAKSI POINTER (Mobile & Desktop) ---
let pointerX = 0;
let pointerY = 0;
let isPointerDown = false;
let lastX = 0;
let lastY = 0;
const handlePointerDown = (e: PointerEvent) => {
  isPointerDown = true;
  lastX = e.clientX;
  lastY = e.clientY;
};
const handlePointerMove = (e: PointerEvent) => {
  if (!isPointerDown) return;
  const deltaX = e.clientX - lastX;
  const deltaY = e.clientY - lastY;
  pointerX += deltaX;
  pointerY += deltaY;
  lastX = e.clientX;
  lastY = e.clientY;
};
const handlePointerUp = () => {
  isPointerDown = false;
};
    
    // Animasi rotasi berdasarkan mouse (sederhana)
    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.0005;
      
      // Efek parallax sederhana
      particles.rotation.x += (pointerY * 0.00001);
      particles.rotation.y += (pointerX * 0.00001);

      renderer.render(scene, camera);
    };
    animate();

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    // Desktop mousemove for continuous rotation
    const handleMouseMove = (e: MouseEvent) => {
      pointerX += e.movementX;
      pointerY += e.movementY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup saat pindah halaman
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="hero-canvas" className="absolute top-0 left-0 w-full h-full z-0" />;
}