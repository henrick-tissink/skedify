import React from 'react';

interface SkedifyLogoProps {
  size?: number;
  className?: string;
}

const SkedifyLogo: React.FC<SkedifyLogoProps> = ({ size = 120, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="25%" stopColor="#4ECDC4" />
          <stop offset="50%" stopColor="#45B7D1" />
          <stop offset="75%" stopColor="#96CEB4" />
          <stop offset="100%" stopColor="#FECA57" />
        </linearGradient>
        <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9FF3" />
          <stop offset="50%" stopColor="#F368E0" />
          <stop offset="100%" stopColor="#BF5AF2" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Outer circle with gradient */}
      <circle
        cx="60"
        cy="60"
        r="55"
        fill="url(#mainGradient)"
        filter="url(#glow)"
      />

      {/* Calendar grid pattern */}
      <rect x="25" y="25" width="70" height="70" rx="8" fill="white" opacity="0.95" />

      {/* Calendar header */}
      <rect x="25" y="25" width="70" height="18" rx="8" fill="url(#innerGradient)" />

      {/* Calendar holes */}
      <circle cx="35" cy="34" r="2" fill="white" />
      <circle cx="60" cy="34" r="2" fill="white" />
      <circle cx="85" cy="34" r="2" fill="white" />

      {/* Calendar grid */}
      <g fill="url(#mainGradient)" opacity="0.8">
        {/* Row 1 */}
        <rect x="30" y="50" width="8" height="6" rx="1" />
        <rect x="42" y="50" width="8" height="6" rx="1" />
        <rect x="54" y="50" width="8" height="6" rx="1" />
        <rect x="66" y="50" width="8" height="6" rx="1" />
        <rect x="78" y="50" width="8" height="6" rx="1" />

        {/* Row 2 */}
        <rect x="30" y="60" width="8" height="6" rx="1" />
        <rect x="42" y="60" width="8" height="6" rx="1" />
        <rect x="54" y="60" width="8" height="6" rx="1" fill="url(#innerGradient)" />
        <rect x="66" y="60" width="8" height="6" rx="1" />
        <rect x="78" y="60" width="8" height="6" rx="1" />

        {/* Row 3 */}
        <rect x="30" y="70" width="8" height="6" rx="1" />
        <rect x="42" y="70" width="8" height="6" rx="1" />
        <rect x="54" y="70" width="8" height="6" rx="1" />
        <rect x="66" y="70" width="8" height="6" rx="1" />
        <rect x="78" y="70" width="8" height="6" rx="1" />

        {/* Row 4 */}
        <rect x="30" y="80" width="8" height="6" rx="1" />
        <rect x="42" y="80" width="8" height="6" rx="1" />
        <rect x="54" y="80" width="8" height="6" rx="1" />
        <rect x="66" y="80" width="8" height="6" rx="1" />
        <rect x="78" y="80" width="8" height="6" rx="1" />
      </g>

      {/* Clock hands overlay */}
      <g transform="translate(60, 60)">
        <circle r="3" fill="url(#innerGradient)" />
        <line x1="0" y1="0" x2="0" y2="-12" stroke="url(#innerGradient)" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="0" x2="8" y2="-8" stroke="url(#innerGradient)" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export default SkedifyLogo;