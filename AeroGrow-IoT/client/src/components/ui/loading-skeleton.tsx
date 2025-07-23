import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  variant?: 'default' | 'card' | 'text' | 'avatar';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  lines = 1,
  variant = 'default'
}) => {
  const skeletonVariants = {
    default: "h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded",
    card: "h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg",
    text: "h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded",
    avatar: "h-12 w-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full"
  };

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(skeletonVariants[variant], "bg-size-200")}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            backgroundSize: '200% 100%'
          }}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;