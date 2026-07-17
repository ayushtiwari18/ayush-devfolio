'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ZoomParallax({ images = [] }) {
  const containerRef = useRef(null);
  const zoomChamberRef = useRef(null);
  const centralImageRef = useRef(null);
  const carouselRef = useRef(null);
  const scatteredRef = useRef([]);

  // The central image is the cover/first image.
  const centralImg = images[0] || '/placeholder.svg';
  
  // The scattered images for the initial zoom parallax
  const scatteredImages = [];
  if (images.length > 0) {
      for (let i = 1; i <= 6; i++) {
          scatteredImages.push(images[i % images.length]);
      }
  }

  // Create a clean carousel array. We slice the first image (since it's the central zoom image)
  // and concatenate the array once to make it long enough to feel immersive, but without
  // multiplying the DOM by 80 nodes.
  const carouselImages = images.length > 0 ? [...images.slice(1), ...images] : [];

  // Calculate a perfect physical scroll height in pixels for GSAP pinning
  const scrollAmount = 1500 + (carouselImages.length * 1000); // 1500px for zoom, 1000px per slide

  useGSAP(() => {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${scrollAmount}`, // Explicit scroll distance in pixels
        scrub: true, // Switched to true (zero delay) to instantly respond to scroll direction changes
        pin: true, // Let GSAP handle the sticky behavior and scroll spacing flawlessly
        anticipatePin: 1,
      }
    });

    // --- PHASE 1: GPU-Accelerated Zoom ---
    // We scale the central image 5x (25vw * 5 = 125vw). 
    // This pushes the rounded corners completely off-screen without needing CPU-heavy border-radius animations.
    tl.to(centralImageRef.current, {
      scale: 5,
      ease: 'power2.inOut',
      duration: 1, // Relative timeline duration
    }, 0);

    // Scattered images scale massively and fade out (flying past the camera)
    scatteredRef.current.forEach((el) => {
      if (!el) return;
      tl.to(el, {
        scale: 8,
        opacity: 0.01, // 0.01 keeps the layer in GPU memory! 0 causes Chrome to garbage collect it, causing massive lag on reverse scroll.
        ease: 'power2.in',
        duration: 1,
      }, 0);
    });

    // --- PHASE 2: Seamless GPU Horizontal Swipe ---
    const trackDistance = -(window.innerWidth * carouselImages.length);
    
    tl.to(carouselRef.current, {
      x: trackDistance,
      ease: 'none',
      duration: carouselImages.length * 0.5, 
    }, ">");

  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-screen bg-zinc-950 overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full">
        
        {/* LAYER 1: The Parallax Zoom Chamber */}
        <div ref={zoomChamberRef} className="absolute inset-0 w-full h-full flex items-center justify-center">
          
          {/* Central Image (Starts small, scales to screen size via GPU) */}
          <div 
            ref={centralImageRef} 
            className="relative z-20 w-[30vw] h-[35vh] md:w-[25vw] md:h-[35vh] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 will-change-transform origin-center"
          >
            <img src={centralImg} className="w-full h-full object-cover" alt="Central Event" />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Scattered Images */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {scatteredImages.map((src, index) => {
              const positions = [
                'top-[5vh] left-[5vw] w-[35vw] h-[30vh]',
                'bottom-[10vh] left-[5vw] w-[20vw] h-[45vh]',
                'top-[20vh] right-[10vw] w-[25vw] h-[25vh]',
                'bottom-[20vh] right-[5vw] w-[20vw] h-[25vh]',
                'top-[10vh] left-[35vw] w-[30vw] h-[25vh]',
                'bottom-[5vh] right-[35vw] w-[15vw] h-[15vh]',
              ];
              return (
                <div 
                  key={index} 
                  ref={el => scatteredRef.current[index] = el}
                  className={`absolute ${positions[index]} overflow-hidden rounded-2xl shadow-xl border border-white/10 will-change-transform origin-center`}
                >
                  <img src={src} className="w-full h-full object-cover opacity-80" alt={`Scattered ${index}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* LAYER 2: The Horizontal Carousel (Starts off-screen to the right) */}
        {carouselImages.length > 0 && (
          <div 
            ref={carouselRef} 
            className="absolute top-0 left-full h-screen flex z-30"
            style={{ width: `${carouselImages.length * 100}vw` }}
          >
            {carouselImages.map((src, index) => (
              <div key={`carousel-${index}`} className="w-screen h-screen flex-shrink-0 relative p-6 md:p-12 lg:p-20 flex items-center justify-center">
                <div className="w-full h-full max-w-7xl mx-auto overflow-hidden rounded-3xl shadow-2xl border border-white/10 bg-zinc-900/50">
                  <img src={src} className="w-full h-full object-contain drop-shadow-2xl" alt={`Gallery ${index}`} />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
