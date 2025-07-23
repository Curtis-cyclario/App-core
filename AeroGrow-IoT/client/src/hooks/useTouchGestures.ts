import { useEffect, useRef } from 'react';

interface TouchGestureOptions {
  onPinchZoom?: (scale: number, centerX: number, centerY: number) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  onDoubleTap?: (x: number, y: number) => void;
  onTap?: (x: number, y: number) => void;
  minZoom?: number;
  maxZoom?: number;
}

export const useTouchGestures = (
  containerRef: React.RefObject<HTMLElement>,
  options: TouchGestureOptions = {}
) => {
  const touchesRef = useRef<Touch[]>([]);
  const lastDistanceRef = useRef<number | null>(null);
  const lastCenterRef = useRef<{ x: number, y: number } | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const lastPanPositionRef = useRef<{ x: number, y: number } | null>(null);
  
  // Set default options
  const {
    onPinchZoom = () => {},
    onPan = () => {},
    onDoubleTap = () => {},
    onTap = () => {},
    minZoom = 0.5,
    maxZoom = 3
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Get the distance between two touch points
    const getDistance = (touch1: Touch, touch2: Touch): number => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Get the center point between two touches
    const getMidpoint = (touch1: Touch, touch2: Touch): { x: number, y: number } => {
      return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      };
    };

    // Handle touch start
    const handleTouchStart = (e: TouchEvent) => {
      // Store the current touches
      touchesRef.current = Array.from(e.touches);
      
      // If there are two touches, store the initial distance for pinch-zoom
      if (e.touches.length === 2) {
        lastDistanceRef.current = getDistance(e.touches[0], e.touches[1]);
        lastCenterRef.current = getMidpoint(e.touches[0], e.touches[1]);
      }
      
      // If there is one touch, store the position for pan
      if (e.touches.length === 1) {
        lastPanPositionRef.current = { 
          x: e.touches[0].clientX, 
          y: e.touches[0].clientY 
        };
        
        // Check for double tap
        const now = Date.now();
        const timeSinceLastTap = now - lastTapTimeRef.current;
        
        if (timeSinceLastTap < 300) { // 300ms threshold for double tap
          onDoubleTap(e.touches[0].clientX, e.touches[0].clientY);
          lastTapTimeRef.current = 0; // Reset to prevent triple-tap detection
        } else {
          lastTapTimeRef.current = now;
        }
      }
    };

    // Handle touch move
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling
      
      // Handle pinch-zoom with two touches
      if (e.touches.length === 2 && lastDistanceRef.current !== null) {
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const currentCenter = getMidpoint(e.touches[0], e.touches[1]);
        
        // Calculate scale change
        let scale = currentDistance / lastDistanceRef.current;
        
        // Constrain zoom level
        scale = Math.max(minZoom, Math.min(maxZoom, scale));
        
        // Call the pinch-zoom callback
        onPinchZoom(scale, currentCenter.x, currentCenter.y);
        
        // Update last distance
        lastDistanceRef.current = currentDistance;
        lastCenterRef.current = currentCenter;
      }
      
      // Handle pan with one touch
      if (e.touches.length === 1 && lastPanPositionRef.current) {
        const deltaX = e.touches[0].clientX - lastPanPositionRef.current.x;
        const deltaY = e.touches[0].clientY - lastPanPositionRef.current.y;
        
        // Call the pan callback
        onPan(deltaX, deltaY);
        
        // Update last position
        lastPanPositionRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      }
    };

    // Handle touch end
    const handleTouchEnd = (e: TouchEvent) => {
      // If no touches left and we had only one touch before, it might be a tap
      if (e.touches.length === 0 && touchesRef.current.length === 1) {
        // If not a double-tap (which is handled in touchstart)
        if (Date.now() - lastTapTimeRef.current > 300) {
          const lastTouch = touchesRef.current[0];
          onTap(lastTouch.clientX, lastTouch.clientY);
        }
      }
      
      // Reset references when touch ends
      if (e.touches.length === 0) {
        lastDistanceRef.current = null;
        lastCenterRef.current = null;
        lastPanPositionRef.current = null;
      } else {
        // Update current touches
        touchesRef.current = Array.from(e.touches);
        
        // If we now have one touch but had two before, reset last pan position
        if (e.touches.length === 1) {
          lastPanPositionRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          };
        }
      }
    };

    // Add event listeners
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    // Clean up
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onPinchZoom, onPan, onDoubleTap, onTap, minZoom, maxZoom]);
};