import { useCallback, useMemo, useRef, useEffect } from 'react';

// Performance optimization hook for heavy computations
export const usePerformanceOptimization = () => {
  const rafId = useRef<number>();
  const throttleCache = useRef<Map<string, { lastCall: number; timeout?: NodeJS.Timeout }>>(new Map());

  // Throttled function executor with cache
  const throttledExecution = useCallback((key: string, fn: () => void, delay: number = 16) => {
    const now = Date.now();
    const cached = throttleCache.current.get(key);
    
    if (!cached || now - cached.lastCall >= delay) {
      if (cached?.timeout) clearTimeout(cached.timeout);
      
      throttleCache.current.set(key, { lastCall: now });
      fn();
    } else {
      if (cached.timeout) clearTimeout(cached.timeout);
      
      const timeout = setTimeout(() => {
        throttleCache.current.set(key, { lastCall: Date.now() });
        fn();
      }, delay - (now - cached.lastCall));
      
      throttleCache.current.set(key, { ...cached, timeout });
    }
  }, []);

  // Optimized requestAnimationFrame wrapper
  const scheduleRaf = useCallback((callback: () => void) => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(callback);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      throttleCache.current.forEach(({ timeout }) => {
        if (timeout) clearTimeout(timeout);
      });
      throttleCache.current.clear();
    };
  }, []);

  return { throttledExecution, scheduleRaf };
};

// Memoized shimmer effect calculations
export const useShimmerOptimization = (scrollVelocity: number) => {
  return useMemo(() => {
    const intensity = Math.min(Math.abs(scrollVelocity) / 10, 3);
    const speed = intensity > 2 ? 'fast' : intensity > 1 ? 'normal' : 'slow';
    
    return {
      intensity,
      speed,
      shimmerClass: `scroll-shimmer-${speed}`,
      shouldAnimate: intensity > 0.1
    };
  }, [scrollVelocity]);
};

// Debounced scroll handler
export const useDebouncedScroll = (callback: (velocity: number) => void, delay: number = 16) => {
  const lastScrollY = useRef(0);
  const lastTimestamp = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((currentScrollY: number) => {
    const now = Date.now();
    const deltaY = currentScrollY - lastScrollY.current;
    const deltaTime = now - lastTimestamp.current;
    const velocity = deltaTime > 0 ? Math.abs(deltaY / deltaTime) : 0;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      callback(velocity);
      lastScrollY.current = currentScrollY;
      lastTimestamp.current = now;
    }, delay);
  }, [callback, delay]);
};