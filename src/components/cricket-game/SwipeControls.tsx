'use client';

import { useRef, useEffect } from 'react';

interface SwipeControlsProps {
  onSwipe: (direction: { x: number; y: number }, power: number) => void;
  className?: string;
}

export default function SwipeControls({ onSwipe, className = '' }: SwipeControlsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startPoint = useRef<{ x: number; y: number; time: number } | null>(null);
  const isTracking = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      startPoint.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      isTracking.current = true;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      if (!startPoint.current || !isTracking.current) return;

      const touch = e.changedTouches[0];
      const endPoint = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      processSwipe(startPoint.current, endPoint);
      
      startPoint.current = null;
      isTracking.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    // Mouse events for desktop
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      startPoint.current = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
      };
      isTracking.current = true;
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      if (!startPoint.current || !isTracking.current) return;

      const endPoint = {
        x: e.clientX,
        y: e.clientY,
        time: Date.now(),
      };

      processSwipe(startPoint.current, endPoint);
      
      startPoint.current = null;
      isTracking.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
    };

    const processSwipe = (
      start: { x: number; y: number; time: number },
      end: { x: number; y: number; time: number }
    ) => {
      const deltaX = end.x - start.x;
      const deltaY = end.y - start.y;
      const deltaTime = end.time - start.time;

      // Calculate distance and speed
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const speed = distance / Math.max(deltaTime, 1); // pixels per millisecond

      // Minimum swipe distance to register
      if (distance < 20) return;

      // Normalize direction
      const direction = {
        x: deltaX / distance,
        y: deltaY / distance,
      };

      // Calculate power based on speed and distance
      const power = Math.min(Math.max(speed * 0.5 + distance * 0.01, 0.1), 1);

      onSwipe(direction, power);
    };

    // Add event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);

    // Prevent context menu on long press
    container.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchmove', handleTouchMove);
      
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
      
      container.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, [onSwipe]);

  return (
    <div
      ref={containerRef}
      className={`touch-none select-none cursor-none ${className}`}
      style={{
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Visual feedback for swipe area */}
      <div className="absolute inset-0 bg-transparent" />
      
      {/* Swipe instruction overlay */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 text-center pointer-events-none">
        <div className="bg-black/30 rounded-lg px-4 py-2 backdrop-blur-sm">
          <p className="text-sm font-medium">Swipe anywhere to bat!</p>
          <div className="flex justify-center gap-4 mt-1 text-xs">
            <span>← → Direction</span>
            <span>⚡ Speed = Power</span>
          </div>
        </div>
      </div>
    </div>
  );
}