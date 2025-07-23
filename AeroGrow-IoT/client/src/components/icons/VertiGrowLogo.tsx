import React from 'react';

interface VertiGrowLogoProps {
  className?: string;
  size?: number;
}

const VertiGrowLogo: React.FC<VertiGrowLogoProps> = ({ className = '', size = 32 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Modern hexagonal background */}
      <path 
        d="M100 10L177.942 55V145L100 190L22.0577 145V55L100 10Z" 
        fill="url(#modern-gradient)" 
      />
      
      {/* Light inner hex for glass effect */}
      <path 
        d="M100 30L159.808 65V135L100 170L40.1924 135V65L100 30Z" 
        fillOpacity="0.15" 
        fill="white" 
        className="dark:fill-opacity-5"
      />
      
      {/* Circuit pattern overlay */}
      <g opacity="0.6" strokeLinecap="round">
        <path d="M100 45V155" stroke="url(#line-gradient)" strokeWidth="1.5" />
        <path d="M60 70H140" stroke="url(#line-gradient)" strokeWidth="1.5" />
        <path d="M60 130H140" stroke="url(#line-gradient)" strokeWidth="1.5" />
        <path d="M70 60L130 140" stroke="url(#line-gradient)" strokeWidth="1.5" />
        <path d="M130 60L70 140" stroke="url(#line-gradient)" strokeWidth="1.5" />
        
        {/* Data points */}
        <circle cx="100" cy="70" r="4" fill="#3DFFA2" className="animate-pulse" />
        <circle cx="100" cy="130" r="4" fill="#5DDBFF" className="animate-pulse animation-delay-1000" />
        <circle cx="60" cy="100" r="4" fill="#FF7D5A" className="animate-pulse animation-delay-2000" />
        <circle cx="140" cy="100" r="4" fill="#FFD166" className="animate-pulse" />
      </g>
      
      {/* Modern plant symbol */}
      <g>
        {/* Central stem */}
        <path 
          d="M100 80V150" 
          stroke="#2EE59D" 
          strokeWidth="5" 
          strokeLinecap="round" 
        />
        
        {/* Leaves */}
        <path 
          d="M100 80C100 80, 70 90, 85 115C85 115, 65 125, 100 135" 
          stroke="#2EE59D" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none" 
        />
        
        <path 
          d="M100 80C100 80, 130 90, 115 115C115 115, 135 125, 100 135" 
          stroke="#2EE59D" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none" 
        />
        
        {/* Growth indicator */}
        <path 
          d="M90 60C95 45, 105 45, 110 60" 
          stroke="#2EE59D" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeDasharray="4 2"
        />
      </g>
      
      {/* Outer ring with IoT elements */}
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M45 100 A55 55 0 0 1 155 100" stroke="#00A3FF" strokeWidth="1.5" strokeDasharray="6 4" />
        <path d="M155 100 A55 55 0 0 1 45 100" stroke="#00A3FF" strokeWidth="1.5" strokeDasharray="6 4" />
        
        {/* IoT connection points */}
        <circle cx="45" cy="100" r="5" fill="#00A3FF" />
        <circle cx="155" cy="100" r="5" fill="#00A3FF" />
        <circle cx="100" cy="45" r="5" fill="#00A3FF" />
        <circle cx="100" cy="155" r="5" fill="#00A3FF" />
      </g>
      
      <defs>
        <linearGradient id="modern-gradient" x1="22.0577" y1="55" x2="167.5" y2="177.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="25%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="75%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
          <animateTransform
            attributeName="gradientTransform"
            type="rotate"
            values="0 100 100;120 100 100;240 100 100;360 100 100"
            dur="12s"
            repeatCount="indefinite"
          />
        </linearGradient>
        
        <linearGradient id="line-gradient" x1="60" y1="60" x2="140" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60EFFF" />
          <stop offset="100%" stopColor="#00FF87" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default VertiGrowLogo;
