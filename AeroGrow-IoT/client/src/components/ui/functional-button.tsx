import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

interface FunctionalButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  href?: string;
  action?: () => void;
  className?: string;
}

export const FunctionalButton: React.FC<FunctionalButtonProps> = ({ 
  children, 
  href,
  action,
  className,
  onClick,
  ...props 
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (action) {
      action();
    }
    if (onClick) {
      onClick(e);
    }
  };

  const buttonElement = (
    <Button 
      {...props}
      className={cn("border-[10px] border-transparent", className)}
      onClick={handleClick}
    >
      {children}
    </Button>
  );

  if (href) {
    return <Link href={href}>{buttonElement}</Link>;
  }

  return buttonElement;
};