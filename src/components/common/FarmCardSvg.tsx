import React from 'react';

interface FarmCardSvgProps {
  type: 'orchard' | 'grain' | 'pasture' | 'roots' | 'hydro' | 'apiary';
}

export const FarmCardSvg: React.FC<FarmCardSvgProps> = ({ type }) => {
  switch (type) {
    case 'orchard':
      return (
        <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 320 180">
          <path d="M0 120 Q 80 80 180 110 T 320 100 L 320 180 L 0 180 Z" fill="#6ba7bc" />
          <path d="M0 135 Q 120 105 240 135 T 320 125 L 320 180 L 0 180 Z" fill="#58a351" />
          <polygon fill="#c73c2a" points="45,130 65,115 85,130 85,155 45,155" />
          <polygon fill="#ffffff" points="60,119 65,115 70,119 70,128 60,128" />
          <rect fill="#ffffff" height="18" width="14" x="58" y="137" />
          <rect fill="#3c2415" height="16" width="10" x="60" y="139" />
          <circle cx="110" cy="132" fill="#31732a" r="16" />
          <circle cx="110" cy="130" fill="#e65c38" r="3" />
          <circle cx="116" cy="134" fill="#e65c38" r="2.5" />
          <circle cx="128" cy="138" fill="#3e8e41" r="14" />
          <circle cx="127" cy="137" fill="#e65c38" r="2.5" />
          <rect fill="#4a2e1b" height="12" width="4" x="108" y="145" />
          <rect fill="#4a2e1b" height="10" width="4" x="126" y="148" />
          <path d="M-20 155 Q 160 140 340 160 L 340 180 L -20 180 Z" fill="#3e8e41" />
        </svg>
      );
    case 'grain':
      return (
        <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 320 180">
          <path d="M0 115 Q 160 80 320 110 L 320 180 L 0 180 Z" fill="#6ea6ba" />
          <path d="M0 130 Q 140 100 320 130 L 320 180 L 0 180 Z" fill="#eab325" />
          <path d="M-10 150 Q 140 130 330 155 L 330 180 L -10 180 Z" fill="#f5c842" />
          <g transform="translate(150, 85)">
            <polygon fill="#ffffff" points="12,55 16,18 26,18 30,55" stroke="#c49b1a" strokeWidth="1" />
            <circle cx="21" cy="18" fill="#c73c2a" r="3" />
            <line stroke="#3c2415" strokeWidth="2" x1="21" x2="3" y1="18" y2="10" />
            <line stroke="#3c2415" strokeWidth="2" x1="21" x2="39" y1="18" y2="26" />
            <line stroke="#3c2415" strokeWidth="2" x1="21" x2="13" y1="18" y2="36" />
            <line stroke="#3c2415" strokeWidth="2" x1="21" x2="29" y1="18" y2="0" />
          </g>
          <line stroke="#b88612" strokeWidth="1.5" x1="40" x2="40" y1="150" y2="140" />
          <line stroke="#b88612" strokeWidth="1.5" x1="44" x2="44" y1="152" y2="138" />
          <line stroke="#b88612" strokeWidth="1.5" x1="260" x2="260" y1="158" y2="145" />
        </svg>
      );
    case 'pasture':
      return (
        <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 320 180">
          <path d="M0 110 Q 130 90 320 120 L 320 180 L 0 180 Z" fill="#679fab" />
          <path d="M0 130 Q 180 110 320 135 L 320 180 L 0 180 Z" fill="#4fa542" />
          <circle cx="210" cy="130" fill="#387a32" r="18" />
          <polygon fill="#bb3522" points="250,135 270,122 290,135 290,158 250,158" />
          <rect fill="#ffffff" height="16" width="12" x="264" y="142" />
          <g transform="translate(60, 140)">
            <rect fill="#ffffff" height="14" rx="3" width="22" x="10" y="8" />
            <circle cx="9" cy="11" fill="#ffffff" r="5" />
            <rect fill="#222" height="7" width="6" x="14" y="11" />
            <line stroke="#ffffff" strokeWidth="2.5" x1="13" x2="13" y1="22" y2="28" />
            <line stroke="#ffffff" strokeWidth="2.5" x1="26" x2="26" y1="22" y2="28" />
          </g>
          <path d="M0 162 Q 140 148 320 160 L 320 180 L 0 180 Z" fill="#2a5c24" />
        </svg>
      );
    case 'roots':
      return (
        <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 320 180">
          <path d="M0 120 Q 150 95 320 115 L 320 180 L 0 180 Z" fill="#699eaf" />
          <path d="M0 135 Q 160 115 320 140 L 320 180 L 0 180 Z" fill="#3c2415" />
          <g transform="translate(40, 125)">
            <path d="M8 12 Q4 2 0 6 Q6 0 10 10 Q14 0 20 6 Q16 2 12 12" fill="#58a351" />
            <path d="M38 12 Q34 2 30 6 Q36 0 40 10 Q44 0 50 6 Q46 2 42 12" fill="#58a351" />
            <path d="M68 12 Q64 2 60 6 Q66 0 70 10 Q74 0 80 6 Q76 2 72 12" fill="#58a351" />
          </g>
          <path d="M-10 152 Q 130 140 330 150 L 330 180 L -10 180 Z" fill="#2a180d" />
        </svg>
      );
    case 'hydro':
      return (
        <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 320 180">
          <path d="M0 120 Q 140 85 320 115 L 320 180 L 0 180 Z" fill="#6ba0b3" />
          <path d="M0 145 Q 160 125 320 145 L 320 180 L 0 180 Z" fill="#529b46" />
          <g transform="translate(110, 105)">
            <polygon fill="#ffffff" opacity="0.85" points="10,45 25,20 75,20 90,45" stroke="#31732a" strokeWidth="1.5" />
            <line stroke="#31732a" strokeWidth="1" x1="25" x2="25" y1="20" y2="45" />
            <line stroke="#31732a" strokeWidth="1" x1="50" x2="50" y1="20" y2="45" />
            <circle cx="37" cy="40" fill="#84cc16" r="3" />
            <circle cx="62" cy="40" fill="#84cc16" r="3" />
          </g>
          <path d="M-10 162 Q 130 152 330 160 L 330 180 L -10 180 Z" fill="#2d6023" />
        </svg>
      );
    case 'apiary':
    default:
      return (
        <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 320 180">
          <path d="M0 110 Q 150 80 320 110 L 320 180 L 0 180 Z" fill="#5f98ab" />
          <path d="M0 135 Q 160 115 320 135 L 320 180 L 0 180 Z" fill="#377330" />
          <polygon fill="#1b4515" points="40,140 48,115 56,140" />
          <polygon fill="#25551f" points="52,142 60,118 68,142" />
          <g transform="translate(110, 126)">
            <rect fill="#f5c842" height="14" rx="2" stroke="#d49a18" strokeWidth="1" width="18" x="0" y="0" />
            <line stroke="#a36e0a" strokeWidth="1" x1="2" x2="16" y1="5" y2="5" />
            <circle cx="26" cy="-4" fill="#3c2415" r="2" />
          </g>
          <path d="M-10 156 Q 140 145 330 155 L 330 180 L -10 180 Z" fill="#204d1b" />
        </svg>
      );
  }
};
