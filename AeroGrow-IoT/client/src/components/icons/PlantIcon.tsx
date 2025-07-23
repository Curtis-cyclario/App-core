import React from 'react';

interface PlantIconProps {
  className?: string;
  size?: number;
}

const PlantIcon: React.FC<PlantIconProps> = ({ className = '', size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Stem */}
      <path
        d="M12 2v20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Leaves */}
      <path
        d="M12 8c0 0, -4 -3, -8 0s0 8 0 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      <path
        d="M12 8c0 0, 4 -3, 8 0s0 8 0 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Soil */}
      <path
        d="M2 22h20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default PlantIcon;
