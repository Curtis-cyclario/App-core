import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CRTHeader = () => {
  const [dots, setDots] = useState<{ id: number; active: boolean }[]>([]);

  useEffect(() => {
    // Initialize pixel matrix
    const initialDots = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      active: Math.random() > 0.7
    }));
    setDots(initialDots);

    // Animate pixel matrix
    const interval = setInterval(() => {
      setDots(prevDots => 
        prevDots.map(dot => ({
          ...dot,
          active: Math.random() > 0.85
        }))
      );
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-20 bg-black overflow-hidden border-b border-emerald-500/30">
      {/* Pixel Matrix Background */}
      <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] gap-px p-2">
        {dots.map(dot => (
          <motion.div
            key={dot.id}
            className={`w-1 h-1 rounded-full transition-all duration-150 ${
              dot.active 
                ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' 
                : 'bg-emerald-900/20'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: dot.active ? 1 : 0.1 }}
          />
        ))}
      </div>

      {/* CRT Scanlines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent animate-pulse" />
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-emerald-400/10"
            style={{ top: `${i * 10}%` }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          {/* The HQ Title */}
          <h1 className="text-4xl font-bold text-emerald-400 font-serif tracking-wider mb-1">
            <span className="inline-block animate-pulse">T</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.1s' }}>h</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.2s' }}>e</span>
            <span className="mx-2"></span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.3s' }}>H</span>
            <span className="inline-block animate-pulse" style={{ animationDelay: '0.4s' }}>Q</span>
          </h1>
          
          {/* Subtitle */}
          <motion.p 
            className="text-sm text-emerald-300/80 font-mono tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            AGRICULTURAL INTELLIGENCE PLATFORM
          </motion.p>
        </motion.div>
      </div>

      {/* CRT Screen Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 via-emerald-400/20 to-emerald-500/10 blur-sm -z-10" />
    </div>
  );
};

export default CRTHeader;