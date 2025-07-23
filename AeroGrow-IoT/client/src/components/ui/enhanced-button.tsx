import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends ButtonProps {
  glow?: boolean;
  pulse?: boolean;
  gradient?: boolean;
  interactive?: boolean;
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, glow = false, pulse = false, gradient = false, interactive = true, children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={interactive ? { scale: 1.02 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        transition={{ duration: 0.15 }}
      >
        <Button
          ref={ref}
          className={cn(
            "relative transition-all duration-200",
            glow && "shadow-lg hover:shadow-xl",
            pulse && "animate-pulse-warm",
            gradient && "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
            interactive && "interactive-scale focus-ring",
            className
          )}
          {...props}
        >
          {children}
          {glow && (
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-emerald-400/20 to-teal-400/20 blur-lg -z-10" />
          )}
        </Button>
      </motion.div>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';