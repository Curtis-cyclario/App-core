import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  targetX: number;
  targetY: number;
}

interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
  mouseInfluence?: number;
  colors?: string[];
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  className = '',
  particleCount = 15,
  mouseInfluence = 100,
  colors = ['emerald', 'blue', 'purple']
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const lastUpdate = useRef<number>(0);

  // Initialize particles
  const initParticles = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    if (rect.width === 0 || rect.height === 0) return; // Prevent init with 0 dimensions
    
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle: Particle = {
        id: i,
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        targetX: 0,
        targetY: 0
      };
      
      particle.targetX = particle.x;
      particle.targetY = particle.y;
      
      newParticles.push(particle);
    }
    
    setParticles(newParticles);
  }, [particleCount]);

  // Handle mouse movement
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  }, []);

  // Animation loop
  const animate = useCallback((timestamp: number) => {
    if (!containerRef.current) return;
    
    // Throttle to ~60fps
    if (timestamp - lastUpdate.current < 16) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    lastUpdate.current = timestamp;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    setParticles(prevParticles => 
      prevParticles.map(particle => {
        let newX = particle.x + particle.speedX;
        let newY = particle.y + particle.speedY;
        
        // Mouse influence
        const distanceToMouse = Math.sqrt(
          Math.pow(mousePosition.x - particle.x, 2) + 
          Math.pow(mousePosition.y - particle.y, 2)
        );
        
        if (distanceToMouse < mouseInfluence) {
          const force = (mouseInfluence - distanceToMouse) / mouseInfluence;
          const angle = Math.atan2(particle.y - mousePosition.y, particle.x - mousePosition.x);
          
          newX += Math.cos(angle) * force * 2;
          newY += Math.sin(angle) * force * 2;
        }
        
        // Boundary wrapping
        if (newX < -particle.size) newX = rect.width + particle.size;
        if (newX > rect.width + particle.size) newX = -particle.size;
        if (newY < -particle.size) newY = rect.height + particle.size;
        if (newY > rect.height + particle.size) newY = -particle.size;
        
        // Gentle drift back to original area
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const driftForce = 0.001;
        
        newX += (centerX - newX) * driftForce;
        newY += (centerY - newY) * driftForce;
        
        return {
          ...particle,
          x: newX,
          y: newY,
          targetX: newX,
          targetY: newY
        };
      })
    );
    
    animationRef.current = requestAnimationFrame(animate);
  }, [mousePosition, mouseInfluence]);

  // Setup and cleanup
  useEffect(() => {
    initParticles();
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      
      // Start animation
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount]); // Only depend on particleCount to prevent infinite loop

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        initParticles();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [particleCount]); // Only depend on particleCount

  return (
    <div 
      ref={containerRef}
      className={`particle-container ${className}`}
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`particle particle-${particle.color}`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            transform: `translate(-50%, -50%)`,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;