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
          <linearGradient id="forestGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#228B22" />
            <stop offset="50%" stopColor="#32CD32" />
            <stop offset="100%" stopColor="#90EE90" />
          </linearGradient>
          <linearGradient id="treeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#654321" />
            <stop offset="50%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#A0522D" />
          </linearGradient>
          <linearGradient id="leavesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#006400" />
            <stop offset="50%" stopColor="#228B22" />
            <stop offset="100%" stopColor="#32CD32" />
          </linearGradient>
          <linearGradient id="honeyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF8C00" />
          </linearGradient>
          <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF8C00" />
          </radialGradient>
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

        {/* Forest Background Scene */}
        <motion.circle
          cx="60"
          cy="65"
          r="58"
          fill="url(#forestGradient)"
          opacity="0.3"
          filter="url(#glow)"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Sun in background */}
        <motion.circle
          cx="85"
          cy="25"
          r="8"
          fill="url(#sunGradient)"
          opacity="0.8"
          filter="url(#softGlow)"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Sun rays */}
        <g stroke="url(#sunGradient)" strokeWidth="2" opacity="0.6">
          <motion.path
            d="M 85 15 L 85 10"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '85px 25px' }}
          />
          <motion.path
            d="M 92 18 L 95 15"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '85px 25px' }}
          />
          <motion.path
            d="M 95 25 L 100 25"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '85px 25px' }}
          />
          <motion.path
            d="M 92 32 L 95 35"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: '85px 25px' }}
          />
        </g>

        {/* Background Trees */}
        <g opacity="0.6">
          {/* Tree 1 */}
          <rect x="15" y="85" width="4" height="15" fill="url(#treeGradient)" />
          <ellipse cx="17" cy="82" rx="8" ry="12" fill="url(#leavesGradient)" />

          {/* Tree 2 */}
          <rect x="100" y="80" width="3" height="18" fill="url(#treeGradient)" />
          <ellipse cx="101.5" cy="77" rx="6" ry="10" fill="url(#leavesGradient)" />

          {/* Tree 3 */}
          <rect x="8" y="75" width="3" height="12" fill="url(#treeGradient)" />
          <ellipse cx="9.5" cy="72" rx="5" ry="8" fill="url(#leavesGradient)" />
        </g>

        {/* Honey pot */}
        <motion.g
          animate={{
            y: [0, -1, 0, -0.5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ellipse cx="25" cy="85" rx="6" ry="8" fill="url(#honeyGradient)" filter="url(#softGlow)" />
          <ellipse cx="25" cy="80" rx="5" ry="2" fill="#8B4513" />
          <rect x="22" y="77" width="6" height="3" rx="1" fill="#8B4513" />
          <text x="25" y="87" textAnchor="middle" fontSize="6" fill="#8B4513" fontWeight="bold">🍯</text>
        </motion.g>

        {/* Flowers */}
        <g opacity="0.8">
          <motion.g
            animate={{
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: '95px 95px' }}
          >
            <circle cx="95" cy="95" r="3" fill="#FF69B4" />
            <circle cx="93" cy="93" r="2" fill="#FFB6C1" />
            <circle cx="97" cy="93" r="2" fill="#FFB6C1" />
            <circle cx="93" cy="97" r="2" fill="#FFB6C1" />
            <circle cx="97" cy="97" r="2" fill="#FFB6C1" />
            <circle cx="95" cy="95" r="1" fill="#FFD700" />
            <rect x="94.5" y="98" width="1" height="5" fill="#228B22" />
          </motion.g>

          <motion.g
            animate={{
              rotate: [0, -3, 0, 3, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            style={{ transformOrigin: '110px 90px' }}
          >
            <circle cx="110" cy="90" r="2.5" fill="#9370DB" />
            <circle cx="108" cy="88" r="1.5" fill="#DDA0DD" />
            <circle cx="112" cy="88" r="1.5" fill="#DDA0DD" />
            <circle cx="108" cy="92" r="1.5" fill="#DDA0DD" />
            <circle cx="112" cy="92" r="1.5" fill="#DDA0DD" />
            <circle cx="110" cy="90" r="0.8" fill="#FFD700" />
            <rect x="109.5" y="92.5" width="1" height="4" fill="#228B22" />
          </motion.g>
        </g>

        <motion.g animate={floatingAnimation}>
          {/* Bear Head with shadow */}
          <ellipse
            cx="62"
            cy="67"
            rx="22"
            ry="25"
            fill="rgba(139, 69, 19, 0.3)"
            opacity="0.5"
          />
          <ellipse
            cx="60"
            cy="65"
            rx="22"
            ry="25"
            fill="url(#bearFurGradient)"
            filter="url(#softGlow)"
          />

          {/* Bear Face (lighter area) with more layers */}
          <ellipse
            cx="60"
            cy="68"
            rx="16"
            ry="18"
            fill="url(#bearFaceGradient)"
            filter="url(#softGlow)"
          />
          <ellipse
            cx="60"
            cy="70"
            rx="12"
            ry="14"
            fill="#FFEBCD"
            opacity="0.8"
          />

          {/* Left Ear with more detail */}
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
          <ellipse
            cx="48"
            cy="47"
            rx="4"
            ry="6"
            fill="url(#bearFaceGradient)"
          />
          <ellipse
            cx="48"
            cy="48"
            rx="2"
            ry="3"
            fill="#FFB6C1"
          />

          {/* Right Ear with more detail */}
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
          <ellipse
            cx="72"
            cy="47"
            rx="4"
            ry="6"
            fill="url(#bearFaceGradient)"
          />
          <ellipse
            cx="72"
            cy="48"
            rx="2"
            ry="3"
            fill="#FFB6C1"
          />

          {/* Eye sockets/shadows */}
          <ellipse cx="54" cy="62" rx="5" ry="6" fill="rgba(139, 69, 19, 0.2)" />
          <ellipse cx="66" cy="62" rx="5" ry="6" fill="rgba(139, 69, 19, 0.2)" />

          {/* Eyes with more detail */}
          <motion.ellipse
            cx="54"
            cy="62"
            rx="4"
            ry="5"
            fill="#8B4513"
            animate={eyeBlinkAnimation}
          />
          <motion.ellipse
            cx="66"
            cy="62"
            rx="4"
            ry="5"
            fill="#8B4513"
            animate={eyeBlinkAnimation}
          />
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

          {/* Multiple eye shines for depth */}
          <circle cx="55" cy="60.5" r="1.2" fill="#FFF" opacity="0.9" />
          <circle cx="67" cy="60.5" r="1.2" fill="#FFF" opacity="0.9" />
          <circle cx="55.5" cy="61.5" r="0.6" fill="#FFF" opacity="0.7" />
          <circle cx="67.5" cy="61.5" r="0.6" fill="#FFF" opacity="0.7" />

          {/* Eyebrows */}
          <g stroke="url(#bearFurGradient)" strokeWidth="2" fill="none" opacity="0.8">
            <path d="M 49 58 Q 52 55 57 57" strokeLinecap="round" />
            <path d="M 63 57 Q 68 55 71 58" strokeLinecap="round" />
          </g>

          {/* Snout with more layers */}
          <ellipse
            cx="60"
            cy="76"
            rx="9"
            ry="7"
            fill="rgba(139, 69, 19, 0.2)"
          />
          <ellipse
            cx="60"
            cy="75"
            rx="8"
            ry="6"
            fill="url(#bearFaceGradient)"
            filter="url(#softGlow)"
          />
          <ellipse
            cx="60"
            cy="74"
            rx="6"
            ry="4"
            fill="#FFEBCD"
            opacity="0.9"
          />

          {/* Nose with highlight */}
          <motion.ellipse
            cx="60"
            cy="72"
            rx="3.5"
            ry="2.5"
            fill="url(#bearNoseGradient)"
            animate={noseWiggleAnimation}
          />
          <ellipse
            cx="59"
            cy="71"
            rx="1"
            ry="0.8"
            fill="#CD853F"
            opacity="0.8"
          />

          {/* Detailed nostrils */}
          <ellipse cx="58.5" cy="72" rx="0.6" ry="1" fill="#000" />
          <ellipse cx="61.5" cy="72" rx="0.6" ry="1" fill="#000" />
          <ellipse cx="58.3" cy="71.5" rx="0.3" ry="0.5" fill="#444" />
          <ellipse cx="61.7" cy="71.5" rx="0.3" ry="0.5" fill="#444" />

          {/* Enhanced mouth */}
          <path
            d="M 60 75 Q 55 78 50 76 M 60 75 Q 65 78 70 76"
            stroke="#654321"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 60 75 Q 58 76 56 75.5 M 60 75 Q 62 76 64 75.5"
            stroke="#8B4513"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Enhanced cheeks with blush */}
          <ellipse
            cx="46"
            cy="70"
            rx="4"
            ry="3"
            fill="#F4A460"
            opacity="0.6"
          />
          <ellipse
            cx="74"
            cy="70"
            rx="4"
            ry="3"
            fill="#F4A460"
            opacity="0.6"
          />
          <ellipse
            cx="46"
            cy="69"
            rx="2"
            ry="1.5"
            fill="#FFB6C1"
            opacity="0.8"
          />
          <ellipse
            cx="74"
            cy="69"
            rx="2"
            ry="1.5"
            fill="#FFB6C1"
            opacity="0.8"
          />

          {/* Much more detailed fur texture */}
          <g stroke="rgba(139, 69, 19, 0.4)" strokeWidth="1.2" fill="none">
            <path d="M 45 55 Q 48 58 44 62" />
            <path d="M 42 58 Q 45 61 41 65" />
            <path d="M 47 52 Q 50 55 46 59" />
            <path d="M 75 55 Q 78 58 74 62" />
            <path d="M 78 58 Q 81 61 77 65" />
            <path d="M 73 52 Q 76 55 72 59" />
            <path d="M 50 85 Q 54 88 48 92" />
            <path d="M 70 85 Q 74 88 68 92" />
            <path d="M 42 65 Q 45 68 40 72" />
            <path d="M 78 65 Q 82 68 76 72" />
            <path d="M 52 88 Q 56 91 50 95" />
            <path d="M 68 88 Q 72 91 66 95" />
          </g>

          {/* Additional fur detail layers */}
          <g stroke="rgba(160, 82, 45, 0.3)" strokeWidth="0.8" fill="none">
            <path d="M 46 50 Q 49 53 45 57" />
            <path d="M 74 50 Q 77 53 73 57" />
            <path d="M 40 70 Q 43 73 39 77" />
            <path d="M 80 70 Q 83 73 79 77" />
            <path d="M 48 90 Q 52 93 46 97" />
            <path d="M 72 90 Q 76 93 70 97" />
          </g>

        </motion.g>

        {/* Golden Glowing Halo Around Entire Animation */}
        <motion.circle
          cx="60"
          cy="65"
          r="65"
          fill="none"
          stroke="url(#sunGradient)"
          strokeWidth="4"
          opacity="0.5"
          filter="url(#glow)"
          animate={{
            scale: [1, 1.03, 1],
            opacity: [0.5, 0.8, 0.5],
            rotate: [0, 360],
          }}
          transition={{
            scale: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            },
            opacity: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }
          }}
          strokeDasharray="12,6"
        />

        {/* Secondary outer halo ring */}
        <motion.circle
          cx="60"
          cy="65"
          r="60"
          fill="none"
          stroke="#FFD700"
          strokeWidth="2"
          opacity="0.3"
          filter="url(#softGlow)"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [360, 0],
          }}
          transition={{
            scale: {
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut"
            },
            opacity: {
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }
          }}
          strokeDasharray="8,4"
        />

        {/* Sparkling particles around the entire logo */}
        <motion.circle
          cx="125"
          cy="65"
          r="2"
          fill="#FFD700"
          animate={{
            scale: [0.3, 1.8, 0.3],
            opacity: [0.2, 1, 0.2],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transformOrigin: '60px 65px' }}
        />

        <motion.circle
          cx="-5"
          cy="65"
          r="1.5"
          fill="#FFA500"
          animate={{
            scale: [0.2, 1.5, 0.2],
            opacity: [0.3, 1, 0.3],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.7
          }}
          style={{ transformOrigin: '60px 65px' }}
        />

        <motion.circle
          cx="60"
          cy="0"
          r="1.8"
          fill="#FFFF00"
          animate={{
            scale: [0.1, 1.2, 0.1],
            opacity: [0.1, 0.9, 0.1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2
          }}
          style={{ transformOrigin: '60px 65px' }}
        />

        <motion.circle
          cx="60"
          cy="130"
          r="1.6"
          fill="#FF8C00"
          animate={{
            scale: [0.2, 1.4, 0.2],
            opacity: [0.2, 0.8, 0.2],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2.1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.8
          }}
          style={{ transformOrigin: '60px 65px' }}
        />

        <motion.circle
          cx="105"
          cy="25"
          r="1.3"
          fill="#FECA57"
          animate={{
            scale: [0.3, 1.1, 0.3],
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, 360],
          }}
          transition={{
            duration: 1.9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
          style={{ transformOrigin: '60px 65px' }}
        />

        <motion.circle
          cx="15"
          cy="105"
          r="1.1"
          fill="#4ECDC4"
          animate={{
            scale: [0.4, 1.3, 0.4],
            opacity: [0.4, 0.9, 0.4],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.1
          }}
          style={{ transformOrigin: '60px 65px' }}
        />

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