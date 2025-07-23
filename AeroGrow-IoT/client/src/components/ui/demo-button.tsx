import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface DemoButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  demoText?: string;
  className?: string;
}

export const DemoButton: React.FC<DemoButtonProps> = ({ 
  children, 
  demoText = "I'm just the demo!", 
  className,
  onClick,
  ...props 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip}>
        <TooltipTrigger asChild>
          <Button 
            {...props}
            className={cn(className)}
            onClick={handleClick}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          className="bg-emerald-500 text-white border-emerald-600 font-medium"
          sideOffset={5}
        >
          {demoText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};