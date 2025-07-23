import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

/**
 * Enhanced custom hook for handling page transitions and scroll effects
 * 
 * Features:
 * - Advanced glass-like page transitions with dynamic gradient effects
 * - Multi-layer parallax scrolling for a 3D depth effect
 * - Animated content reveals as user scrolls down the page
 * - Interactive background elements that respond to mouse movement
 * - Support for route-specific transition styles
 */
export function usePageTransition() {
  const [location] = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousLocation, setPreviousLocation] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');
  
  // Define route hierarchy for determining direction
  const routeOrder = ['/', '/dashboard', '/network', '/plants', '/resources', '/blockchain', '/analytics', '/settings'];
  
  // Track location changes to trigger transitions with direction
  useEffect(() => {
    if (previousLocation && previousLocation !== location) {
      // Start transition
      setIsTransitioning(true);
      
      // Determine transition direction based on route hierarchy
      const prevIndex = routeOrder.indexOf(previousLocation);
      const currIndex = routeOrder.indexOf(location);
      
      if (prevIndex !== -1 && currIndex !== -1) {
        setTransitionDirection(currIndex > prevIndex ? 'forward' : 'backward');
      } else {
        // Default direction logic if routes aren't in the predefined order
        setTransitionDirection(location > previousLocation ? 'forward' : 'backward');
      }
      
      // End transition after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 650); // Slightly longer for more elaborate transitions
      
      return () => clearTimeout(timer);
    }
    
    setPreviousLocation(location);
  }, [location, previousLocation]);
  
  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Track mouse position for interactive backgrounds
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Enhanced parallax style generator with depth effect
  const getParallaxStyle = (speed = 0.5, mouseInfluence = 0) => {
    return {
      transform: `
        translate3d(
          ${mouseInfluence * (mousePosition.x - 0.5) * 50}px, 
          ${scrollY * speed + mouseInfluence * (mousePosition.y - 0.5) * 50}px, 
          0
        )
      `,
      transition: 'transform 0.1s ease-out',
    };
  };
  
  // Glass card effect for components
  const getGlassEffect = (intensity = 1) => {
    return {
      backgroundColor: `rgba(255, 255, 255, ${0.7 * intensity})`,
      backdropFilter: `blur(${10 * intensity}px)`,
      boxShadow: `
        0 4px 6px rgba(0, 0, 0, 0.05),
        0 10px 15px rgba(0, 0, 0, 0.025),
        inset 0 1px 1px rgba(255, 255, 255, 0.5)
      `,
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.18)',
    };
  };
  
  return {
    isTransitioning,
    scrollY,
    transitionDirection,
    mousePosition,
    getParallaxStyle,
    getGlassEffect,
    // Enhanced transition classes with direction
    transitionClasses: isTransitioning 
      ? `opacity-0 ${transitionDirection === 'forward' ? 'translate-y-8' : 'translate-y-[-8px]'}` 
      : 'opacity-100 translate-y-0',
    // Dynamic gradient overlay that reacts to scroll position
    gradientOverlay: {
      backgroundImage: `
        linear-gradient(to bottom, 
          rgba(255,255,255,0) 0%, 
          rgba(255,255,255,0.6) ${Math.min(20 + scrollY * 0.05, 80)}%, 
          rgba(255,255,255,0.95) 100%)
      `,
      transition: 'background-image 0.3s ease-out'
    }
  };
}

/**
 * Create staggered fade-in animation for list items
 * @param index The index of the item in the list
 * @returns CSS style object with delayed animation
 */
export function useStaggeredAnimation(index: number) {
  return {
    animationDelay: `${index * 0.1}s`,
  };
}

/**
 * Generate a sophisticated background gradient based on the current route
 * 
 * Features:
 * - Multi-directional gradients with multiple color stops
 * - Dark mode optimized with appropriate opacity
 * - Subtle patterns integration for depth
 * - Special theme-specific gradient variations
 * 
 * @param location Current route path
 * @returns CSS background gradient and pattern styles
 */
export function getRouteGradient(location: string) {
  // Enhanced map of routes to advanced gradients
  const gradientMap: Record<string, string> = {
    '/': 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 dark:from-emerald-900/30 dark:via-teal-900/20 dark:to-cyan-900/40',
    
    '/dashboard': 'bg-gradient-to-tr from-blue-50 via-indigo-50 to-violet-100 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-violet-900/40',
    
    '/network': 'bg-gradient-to-r from-purple-50 via-fuchsia-50 to-violet-100 dark:from-purple-900/30 dark:via-fuchsia-900/20 dark:to-violet-900/40',
    
    '/plants': 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-teal-900/40',
    
    '/resources': 'bg-gradient-to-tr from-amber-50 via-yellow-50 to-orange-100 dark:from-amber-900/30 dark:via-yellow-900/20 dark:to-orange-900/40',
    
    '/blockchain': 'bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-100 dark:from-indigo-900/30 dark:via-blue-900/20 dark:to-cyan-900/40',
    
    '/facilities': 'bg-gradient-to-tr from-sky-50 via-blue-50 to-cyan-100 dark:from-sky-900/30 dark:via-blue-900/20 dark:to-cyan-900/40',
    
    '/analytics': 'bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-100 dark:from-violet-900/30 dark:via-purple-900/20 dark:to-fuchsia-900/40',
    
    '/settings': 'bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-100 dark:from-gray-900/30 dark:via-slate-900/20 dark:to-zinc-900/40',
  };
  
  // Return the gradient for the current route, or a default gradient
  return gradientMap[location] || 'bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-100 dark:from-gray-900/30 dark:via-slate-900/20 dark:to-zinc-900/40';
}

export default usePageTransition;