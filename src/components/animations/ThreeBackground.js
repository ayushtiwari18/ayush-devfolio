'use client';

import { useEffect, useRef } from 'react';

export default function ThreeBackground({ variant = 'default' }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Lazy load Three.js
    import('three').then(({ default: THREE }) => {
      if (!canvasRef.current) return;

      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.position.z = 5;

      // Create particles based on variant
      const particleCount = variant === 'hero' ? 1000 : 500;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      // Purple and pink color scheme
      const color1 = new THREE.Color(0x8b5cf6); // Purple
      const color2 = new THREE.Color(0xec4899); // Pink

      for (let i = 0; i < particleCount; i++) {
        // Position
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

        // Color - mix between purple and pink
        const mixColor = color1.clone().lerp(color2, Math.random());
        colors[i * 3] = mixColor.r;
        colors[i * 3 + 1] = mixColor.g;
        colors[i * 3 + 2] = mixColor.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: variant === 'hero' ? 0.05 : 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // Animation
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);

        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.0008;

        // Gentle floating motion
        particles.position.y = Math.sin(Date.now() * 0.0005) * 0.1;

        renderer.render(scene, camera);
      };

      animate();

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    });
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
