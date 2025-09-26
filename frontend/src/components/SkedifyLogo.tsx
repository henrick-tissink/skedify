import React from 'react';
import { motion } from 'framer-motion';

interface SkedifyLogoProps {
  size?: number;
  className?: string;
}

const SkedifyLogo: React.FC<SkedifyLogoProps> = ({ size = 120, className = '' }) => {
  const floatingAnimation = {
    y: [0, -4, 0, -2, 0],
    x: [0, 1, 0, -1, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  const earAnimation = {
    rotate: [0, 5, 0, -3, 0],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  const eyeBlinkAnimation = {
    scaleY: [1, 1, 0.2, 1, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const,
      times: [0, 0.3, 0.4, 0.5, 1]
    }
  };

  const noseWiggleAnimation = {
    scale: [1, 1.1, 1, 1.05, 1],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="bearFurGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="30%" stopColor="#A0522D" />
            <stop offset="70%" stopColor="#CD853F" />
            <stop offset="100%" stopColor="#DEB887" />
          </linearGradient>
          <linearGradient id="bearFaceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DEB887" />
            <stop offset="50%" stopColor="#F5DEB3" />
            <stop offset="100%" stopColor="#FFEBCD" />
          </linearGradient>
          <linearGradient id="bearNoseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B0000" />
            <stop offset="50%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#654321" />
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="25%" stopColor="#4ECDC4" />
            <stop offset="50%" stopColor="#45B7D1" />
            <stop offset="75%" stopColor="#96CEB4" />
            <stop offset="100%" stopColor="#FECA57" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="1.5" result="softBlur"/>
            <feMerge>
              <feMergeNode in="softBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="smokeBlur">
            <feGaussianBlur stdDeviation="2" result="blurred"/>
            <feMerge>
              <feMergeNode in="blurred"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background magical aura */}
        <motion.circle
          cx="60"
          cy="65"
          r="55"
          fill="url(#accentGradient)"
          opacity="0.15"
          filter="url(#glow)"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.g animate={floatingAnimation}>
          {/* Bear Head */}
          <ellipse
            cx="60"
            cy="65"
            rx="22"
            ry="25"
            fill="url(#bearFurGradient)"
            filter="url(#softGlow)"
          />

          {/* Bear Face (lighter area) */}
          <ellipse
            cx="60"
            cy="68"
            rx="16"
            ry="18"
            fill="url(#bearFaceGradient)"
            filter="url(#softGlow)"
          />

          {/* Left Ear */}
          <motion.ellipse
            cx="48"
            cy="45"
            rx="8"
            ry="10"
            fill="url(#bearFurGradient)"
            filter="url(#softGlow)"
            animate={earAnimation}
            style={{ transformOrigin: '48px 55px' }}
          />

          {/* Right Ear */}
          <motion.ellipse
            cx="72"
            cy="45"
            rx="8"
            ry="10"
            fill="url(#bearFurGradient)"
            filter="url(#softGlow)"
            animate={{
              ...earAnimation,
              transition: {
                ...earAnimation.transition,
                delay: 0.5
              }
            }}
            style={{ transformOrigin: '72px 55px' }}
          />

          {/* Inner Ears */}
          <ellipse
            cx="48"
            cy="47"
            rx="4"
            ry="6"
            fill="url(#bearFaceGradient)"
          />
          <ellipse
            cx="72"
            cy="47"
            rx="4"
            ry="6"
            fill="url(#bearFaceGradient)"
          />

          {/* Eyes */}
          <motion.ellipse
            cx="54"
            cy="62"
            rx="3"
            ry="4"
            fill="#000"
            animate={eyeBlinkAnimation}
          />
          <motion.ellipse
            cx="66"
            cy="62"
            rx="3"
            ry="4"
            fill="#000"
            animate={eyeBlinkAnimation}
          />

          {/* Eye shine */}
          <circle cx="55" cy="61" r="1" fill="#FFF" opacity="0.9" />
          <circle cx="67" cy="61" r="1" fill="#FFF" opacity="0.9" />

          {/* Snout */}
          <ellipse
            cx="60"
            cy="75"
            rx="8"
            ry="6"
            fill="url(#bearFaceGradient)"
            filter="url(#softGlow)"
          />

          {/* Nose */}
          <motion.ellipse
            cx="60"
            cy="72"
            rx="3"
            ry="2"
            fill="url(#bearNoseGradient)"
            animate={noseWiggleAnimation}
          />

          {/* Nostrils */}
          <ellipse cx="58.5" cy="72" rx="0.5" ry="0.8" fill="#000" />
          <ellipse cx="61.5" cy="72" rx="0.5" ry="0.8" fill="#000" />

          {/* Mouth */}
          <path
            d="M 60 75 Q 55 78 52 76 M 60 75 Q 65 78 68 76"
            stroke="#654321"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cheeks */}
          <ellipse
            cx="48"
            cy="70"
            rx="3"
            ry="2"
            fill="#F4A460"
            opacity="0.6"
          />
          <ellipse
            cx="72"
            cy="70"
            rx="3"
            ry="2"
            fill="#F4A460"
            opacity="0.6"
          />

          {/* Fur texture lines */}
          <g stroke="rgba(139, 69, 19, 0.3)" strokeWidth="1" fill="none">
            <path d="M 45 55 Q 48 58 44 62" />
            <path d="M 75 55 Q 78 58 74 62" />
            <path d="M 50 85 Q 54 88 48 92" />
            <path d="M 70 85 Q 74 88 68 92" />
            <path d="M 42 65 Q 45 68 40 72" />
            <path d="M 78 65 Q 82 68 76 72" />
          </g>
        </motion.g>

        {/* Buzzing Bees around the bear */}
        <motion.g>
          <ellipse
            cx="25"
            cy="45"
            rx="2"
            ry="1"
            fill="#FFD700"
          />
          <ellipse
            cx="25"
            cy="45"
            rx="1.5"
            ry="0.8"
            fill="#000"
            opacity="0.3"
          />
          <motion.path
            d="M 23 44 L 21 43 M 23 46 L 21 47"
            stroke="#FFF"
            strokeWidth="0.5"
            strokeLinecap="round"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.g>

        <motion.g
          animate={{
            x: [0, 15, 5, 20, 0],
            y: [0, -10, 5, -15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ellipse
            cx="95"
            cy="35"
            rx="2"
            ry="1"
            fill="#FFD700"
          />
          <ellipse
            cx="95"
            cy="35"
            rx="1.5"
            ry="0.8"
            fill="#000"
            opacity="0.3"
          />
          <motion.path
            d="M 93 34 L 91 33 M 93 36 L 91 37"
            stroke="#FFF"
            strokeWidth="0.5"
            strokeLinecap="round"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.g>

        {/* Floating magical particles */}
        <motion.circle
          cx="25"
          cy="35"
          r="1.5"
          fill="#FECA57"
          opacity="0.5"
          animate={{
            y: [-2, 2, -2],
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.circle
          cx="95"
          cy="30"
          r="1.2"
          fill="#4ECDC4"
          opacity="0.6"
          animate={{
            y: [2, -2, 2],
            opacity: [0.6, 0.9, 0.6],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />

        <motion.circle
          cx="20"
          cy="95"
          r="1.3"
          fill="#FF6B6B"
          opacity="0.4"
          animate={{
            y: [-1, 3, -1],
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        <motion.circle
          cx="100"
          cy="90"
          r="1"
          fill="#96CEB4"
          opacity="0.5"
          animate={{
            y: [1, -3, 1],
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
      </svg>
    </div>
  );
};

export default SkedifyLogo;