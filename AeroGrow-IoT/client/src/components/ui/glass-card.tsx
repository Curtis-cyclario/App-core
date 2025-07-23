import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePageTransition } from '@/lib/usePageTransition';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // 0-1 controls glass effect intensity
  interactive?: boolean; // Enable hover/click effects
  bordered?: boolean; // Add subtle border
  hoverScale?: number; // Amount to scale on hover
  animated?: boolean; // Enable entrance animation
  delay?: number; // Delay for entrance animation
}

/**
 * GlassCard Component
 * 
 * A modern UI component with a glass-morphism aesthetic for premium visual appeal.
 * 
 * Features:
 * - Dynamic glass effect with adjustable intensity
 * - Interactive hover and click animations
 * - Subtle light reflections that respond to mouse movement
 * - Smooth entrance animations with delay options
 * - Configurable border and rounded corners
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  intensity = 0.7,
  interactive = true,
  bordered = true,
  hoverScale = 1.01,
  animated = true,
  delay = 0,
  ...props
}) => {
  const { getGlassEffect, mousePosition } = usePageTransition();
  
  // Calculate reflection angle based on mouse position
  const getReflectionStyle = () => {
    if (!interactive) return {};
    
    const x = (mousePosition.x - 0.5) * 2; // -1 to 1
    const y = (mousePosition.y - 0.5) * 2; // -1 to 1
    
    return {
      background: `
        linear-gradient(
          ${105 + x * 10}deg,
          rgba(255, 255, 255, ${0.03 + Math.abs(x) * 0.05}) 0%,
          rgba(255, 255, 255, 0) 80%
        )
      `,
    };
  };
  
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden",
        bordered && "border border-white/10",
        "rounded-xl shadow-lg backdrop-blur-md",
        "transition-all duration-300 ease-out",
        interactive && "cursor-pointer",
        className
      )}
      style={getGlassEffect(intensity)}
      whileHover={interactive ? { scale: hoverScale, boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)" } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      initial={animated ? { opacity: 0, y: 10 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: delay
      }}
      {...props}
    >
      {/* Interactive light reflection effect */}
      {interactive && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={getReflectionStyle()}
        />
      )}
      
      {children}
    </motion.div>
  );
};

/**
 * GlassCardHeader Component
 */
interface GlassCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCardHeader: React.FC<GlassCardHeaderProps> = ({
  children,
  className,
}) => (
  <div className={cn("px-6 pt-6 pb-4", className)}>
    {children}
  </div>
);

/**
 * GlassCardTitle Component
 */
interface GlassCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCardTitle: React.FC<GlassCardTitleProps> = ({
  children,
  className,
}) => (
  <h3 className={cn(
    "text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300",
    className
  )}>
    {children}
  </h3>
);

/**
 * GlassCardDescription Component
 */
interface GlassCardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCardDescription: React.FC<GlassCardDescriptionProps> = ({
  children,
  className,
}) => (
  <p className={cn(
    "text-sm text-gray-500 dark:text-gray-400 mt-1",
    className
  )}>
    {children}
  </p>
);

/**
 * GlassCardContent Component
 */
interface GlassCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCardContent: React.FC<GlassCardContentProps> = ({
  children,
  className,
}) => (
  <div className={cn("px-6 py-4", className)}>
    {children}
  </div>
);

/**
 * GlassCardFooter Component
 */
interface GlassCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCardFooter: React.FC<GlassCardFooterProps> = ({
  children,
  className,
}) => (
  <div className={cn(
    "px-6 py-4 bg-gray-50/50 dark:bg-gray-900/20 border-t border-gray-100 dark:border-gray-800/20",
    className
  )}>
    {children}
  </div>
);

export default GlassCard;