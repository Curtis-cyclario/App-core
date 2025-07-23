import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from '@/components/ui/ParticleBackground';

interface ScrollResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  enableDrag?: boolean;
}

const ScrollResponsiveContainer: React.FC<ScrollResponsiveContainerProps> = ({
  children,
  className = '',
  enableDrag = false
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const lastScrollY = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let frameId: number;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        frameId = requestAnimationFrame(() => {
          const currentTime = performance.now();
          const currentScrollY = window.scrollY;
          
          if (lastTime.current > 0) {
            const deltaTime = currentTime - lastTime.current;
            const deltaScroll = Math.abs(currentScrollY - lastScrollY.current);
            
            // Only calculate if time delta is significant (throttling)
            if (deltaTime > 16) { // ~60fps
              const velocity = Math.min(deltaScroll / deltaTime, 1.5); // Cap velocity
              setScrollVelocity(velocity);
            }
          }
          
          lastScrollY.current = currentScrollY;
          lastTime.current = currentTime;
          
          // Optimized decay
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            setScrollVelocity(0);
          }, 80);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const getParticleCount = () => {
    if (scrollVelocity > 1.2) return 20;
    if (scrollVelocity > 0.4) return 15;
    if (scrollVelocity > 0.1) return 10;
    return 8;
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enableDrag) return;
    
    setIsDragging(true);
    const startX = e.clientX - dragOffset.x;
    const startY = e.clientY - dragOffset.y;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      setDragOffset({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [enableDrag, dragOffset]);

  return (
    <motion.div
      ref={elementRef}
      className={`performance-optimized particle-interactive ${enableDrag ? 'draggable' : ''} ${className}`}
      onMouseDown={handleMouseDown}
      style={{
        transform: enableDrag ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)` : undefined,
        cursor: enableDrag ? (isDragging ? 'grabbing' : 'grab') : undefined,
        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
      }}
      whileHover={{ scale: enableDrag ? 1.02 : 1 }}
      whileTap={{ scale: enableDrag ? 0.98 : 1 }}
    >
      <ParticleBackground 
        particleCount={getParticleCount()}
        mouseInfluence={120}
        colors={['emerald', 'blue', 'purple']}
      />
      {children}
    </motion.div>
  );
};

export default ScrollResponsiveContainer;