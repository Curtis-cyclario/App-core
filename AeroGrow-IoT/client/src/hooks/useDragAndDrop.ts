import { useState, useEffect, useRef } from 'react';

interface DragState {
  isDragging: boolean;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
  offset: { x: number; y: number };
}

export const useDragAndDrop = (enabled: boolean = true) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    offset: { x: 0, y: 0 }
  });

  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;
    let animationFrame: number;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // Only left click

      const rect = element.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;

      setDragState(prev => ({
        ...prev,
        isDragging: true,
        startPosition: { x: startX, y: startY },
        currentPosition: { x: e.clientX, y: e.clientY }
      }));

      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging) return;

      animationFrame = requestAnimationFrame(() => {
        const deltaX = e.clientX - dragState.currentPosition.x;
        const deltaY = e.clientY - dragState.currentPosition.y;

        setDragState(prev => ({
          ...prev,
          currentPosition: { x: e.clientX, y: e.clientY },
          offset: {
            x: prev.offset.x + deltaX,
            y: prev.offset.y + deltaY
          }
        }));
      });
    };

    const handleMouseUp = () => {
      setDragState(prev => ({
        ...prev,
        isDragging: false
      }));
    };

    const handleMouseLeave = () => {
      setDragState(prev => ({
        ...prev,
        isDragging: false
      }));
    };

    element.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [enabled, dragState.isDragging, dragState.currentPosition]);

  const resetPosition = () => {
    setDragState(prev => ({
      ...prev,
      offset: { x: 0, y: 0 }
    }));
  };

  return {
    elementRef,
    dragState,
    resetPosition,
    dragStyle: {
      transform: `translate(${dragState.offset.x}px, ${dragState.offset.y}px)`,
      transition: dragState.isDragging ? 'none' : 'transform 0.3s ease-out'
    }
  };
};