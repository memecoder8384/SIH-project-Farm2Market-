import React from 'react';

interface StorybookHorizonProps {
  className?: string;
}

export const StorybookHorizon: React.FC<StorybookHorizonProps> = ({ className = '' }) => {
  return (
    <div className={`w-full relative pointer-events-none transition-colors duration-500 ${className}`} data-purpose="storybook-horizon">
      <svg className="w-full h-auto min-h-[140px]" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 220">
        {/* Far Distance Blue Hills */}
        <path d="M0 160 Q 380 90 740 140 T 1440 120 L 1440 220 L 0 220 Z" fill="#6baecb" opacity="0.6" />
        
        {/* Mid-ground Rolling Green Pastures */}
        <path d="M0 170 Q 280 120 620 160 T 1440 140 L 1440 220 L 0 220 Z" fill="#58a351" />
        
        {/* Golden Mustard Crop Rows */}
        <path d="M420 160 Q 820 110 1440 150 L 1440 220 L 420 220 Z" fill="#f5c842" />
        
        {/* Red Storybook Barn on left hill */}
        <g transform="translate(180, 110)">
          <polygon fill="#cc3d2b" points="40,25 80,0 120,25 120,60 40,60" />
          <polygon fill="#f5f5f5" points="75,5 80,0 85,5 85,15 75,15" />
          <rect fill="#ffffff" height="28" width="20" x="70" y="32" />
          <rect fill="#4a1810" height="25" width="14" x="73" y="35" />
          <line stroke="#ffffff" strokeWidth="1.5" x1="73" x2="87" y1="35" y2="60" />
          <line stroke="#ffffff" strokeWidth="1.5" x1="87" x2="73" y1="35" y2="60" />
          {/* Small Silo */}
          <path d="M22 25 Q30 18 38 25 L38 60 L22 60 Z" fill="#9ca3af" />
        </g>

        {/* Storybook Windmill on Golden Ridge */}
        <g transform="translate(860, 100)">
          <polygon fill="#ffffff" points="20,50 25,18 35,18 40,50" stroke="#c49b1a" strokeWidth="1" />
          <circle cx="30" cy="18" fill="#cc3d2b" r="3.5" />
          {/* Animated Rotating Windmill Blades */}
          <g className="animate-windmill" style={{ transformOrigin: '30px 18px' }}>
            <line stroke="#3c2415" strokeWidth="2.2" x1="30" x2="10" y1="18" y2="10" />
            <line stroke="#3c2415" strokeWidth="2.2" x1="30" x2="50" y1="18" y2="26" />
            <line stroke="#3c2415" strokeWidth="2.2" x1="30" x2="22" y1="18" y2="38" />
            <line stroke="#3c2415" strokeWidth="2.2" x1="30" x2="38" y1="18" y2="-2" />
            {/* Blade canvas vanes */}
            <rect x="10" y="7" width="8" height="5" fill="#fef3c7" opacity="0.9" />
            <rect x="42" y="22" width="8" height="5" fill="#fef3c7" opacity="0.9" />
            <rect x="20" y="30" width="5" height="8" fill="#fef3c7" opacity="0.9" />
            <rect x="34" y="2" width="5" height="8" fill="#fef3c7" opacity="0.9" />
          </g>
        </g>

        {/* Green Agro Tractor on Field */}
        <g transform="translate(340, 142)">
          {/* Animated exhaust smoke puffs */}
          <circle cx="10" cy="1" r="2.5" fill="#ffffff" opacity="0.75" className="animate-ping [animation-duration:2.2s]" />
          <circle cx="7" cy="-4" r="3.5" fill="#ffffff" opacity="0.5" className="animate-ping [animation-duration:3s]" />
          <rect fill="#31732a" height="15" rx="2" width="24" x="15" y="10" />
          <circle cx="15" cy="26" fill="#222" r="8" stroke="#f5c842" strokeWidth="2" />
          <circle cx="36" cy="28" fill="#222" r="5" stroke="#f5c842" strokeWidth="1.5" />
          <rect fill="#9ed5ef" height="9" width="12" x="10" y="4" />
          <line stroke="#111" strokeWidth="1.5" x1="12" y1="4" x2="10" y2="0" />
        </g>

        {/* Round Lollipop Storybook Trees */}
        <circle cx="140" cy="165" fill="#31732a" r="16" />
        <circle cx="160" cy="160" fill="#4f9b46" r="20" />
        <circle cx="780" cy="155" fill="#3e8e41" r="15" />
        <circle cx="1260" cy="148" fill="#31732a" r="22" />
        <circle cx="1290" cy="155" fill="#4f9b46" r="17" />

        {/* Foreground Dark Pasture Rim */}
        <path d="M0 195 Q 460 170 1440 190 L 1440 220 L 0 220 Z" fill="#2d5e23" />
      </svg>
    </div>
  );
};
