'use client';

import { useEffect, useRef, useCallback } from 'react';

export default function ScrollBlobs() {
  const blobsRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const handleScroll = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollProgress = scrollY / (documentHeight - windowHeight);
      
      if (blobsRef.current) {
        const blobs = blobsRef.current.children;
        
        Array.from(blobs).forEach((blob, index) => {
          const element = blob as HTMLElement;
          const speed = 0.3 + (index * 0.15);
          const offset = index * 0.3;
          
          // Calculate scroll-based transformations
          const scrollPhase = scrollProgress * Math.PI * 2 + offset;
          const morphPhase = (scrollProgress + offset) % 1;
          
          // Position transformations
          const translateX = Math.sin(scrollPhase) * 120 * speed;
          const translateY = Math.cos(scrollPhase * 0.7) * 80 * speed;
          
          // Scale and rotation
          const scale = 0.8 + Math.sin(scrollPhase * 2) * 0.3;
          const rotate = scrollProgress * 720 * speed;
          
          // Apply transforms
          element.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`;
          
          // Dynamic border radius morphing
          const radius1 = 25 + Math.sin(morphPhase * Math.PI * 2) * 35;
          const radius2 = 75 + Math.cos(morphPhase * Math.PI * 2) * 25;
          const radius3 = 35 + Math.sin(morphPhase * Math.PI * 4) * 40;
          const radius4 = 65 + Math.cos(morphPhase * Math.PI * 4) * 30;
          
          element.style.borderRadius = `${radius1}% ${radius2}% ${radius3}% ${radius4}% / ${radius4}% ${radius1}% ${radius2}% ${radius3}%`;
          
          // Dynamic opacity and blur
          const opacity = 0.08 + Math.sin(scrollPhase * 1.5) * 0.12;
          const blur = 30 + Math.sin(scrollPhase * 3) * 20;
          
          element.style.opacity = opacity.toString();
          element.style.filter = `blur(${blur}px)`;
          
          // Color shifts based on scroll
          const hueShift = scrollProgress * 360 + (index * 60);
          element.style.filter += ` hue-rotate(${hueShift}deg)`;
        });
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleScroll]);

  return (
    <div ref={blobsRef} className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      <div className="blob blob-4"></div>
      <div className="blob blob-5"></div>
    </div>
  );
}
