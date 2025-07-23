import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { Card, CardProps } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EnhancedCardProps extends CardProps {
  hover?: boolean;
  glow?: boolean;
  pulse?: boolean;
  interactive?: boolean;
  motionProps?: MotionProps;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, hover = false, glow = false, pulse = false, interactive = false, motionProps, children, ...props }, ref) => {
    const cardClasses = cn(
      "relative overflow-hidden transition-all duration-300",
      hover && "hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/10",
      glow && "ring-1 ring-emerald-500/20 shadow-emerald-500/10",
      pulse && "animate-pulse",
      interactive && "cursor-pointer",
      className
    );

    const MotionCard = motion(Card);

    const defaultMotionProps: MotionProps = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      whileHover: interactive ? { scale: 1.02 } : undefined,
      ...motionProps
    };

    return (
      <MotionCard
        ref={ref}
        className={cardClasses}
        {...defaultMotionProps}
        {...props}
      >
        {glow && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        )}
        {children}
      </MotionCard>
    );
  }
);

EnhancedCard.displayName = "EnhancedCard";

export { EnhancedCard };