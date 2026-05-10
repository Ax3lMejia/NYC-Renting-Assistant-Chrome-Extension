import React, { useState, useEffect } from 'react';

type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

interface MascotProps {
  grade: Grade;
  loaded?: boolean;
  size?: number;
}

const GRADE_COLOR: Record<Grade, string> = {
  A: '#4D6B47',
  B: '#4D6B47',
  C: '#F5C747',
  D: '#E84A1F',
  F: '#E84A1F',
};

export const Mascot: React.FC<MascotProps> = ({ grade, loaded = true, size = 64 }) => {
  const [blink, setBlink] = useState(false);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const i = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3200);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => setBounce(true), 200);
    return () => clearTimeout(t);
  }, [loaded]);

  const h = Math.round(size * 1.1875); // 76/64 ratio
  const isGood = grade === 'A' || grade === 'B';
  const isMid = grade === 'C';
  const bodyColor = GRADE_COLOR[grade];

  return (
    <div
      style={{
        width: size,
        height: h,
        position: 'relative',
        flexShrink: 0,
        transform: bounce ? 'translateY(0)' : 'translateY(20px)',
        opacity: loaded ? 1 : 0,
        transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <svg viewBox="0 0 64 76" width={size} height={h}>
        {/* Body */}
        <rect x="10" y="14" width="44" height="58" rx="6" fill={bodyColor} />
        {/* Roof */}
        <rect x="6" y="10" width="52" height="8" rx="2" fill="#14110D" />
        <rect x="28" y="2" width="6" height="10" rx="1" fill="#14110D" />
        {/* Windows (eyes) — blink via scaleY */}
        <g
          style={{
            transform: blink ? 'scaleY(0.1)' : 'scaleY(1)',
            transformOrigin: 'center 32px',
            transition: 'transform 0.1s',
          }}
        >
          <rect x="18" y="26" width="10" height="10" rx="2" fill="#fff" />
          <rect x="36" y="26" width="10" height="10" rx="2" fill="#fff" />
          <circle cx="23" cy="31" r="2" fill="#14110D" />
          <circle cx="41" cy="31" r="2" fill="#14110D" />
        </g>
        {/* Mouth — smile / neutral / frown */}
        {isGood && (
          <path d="M24 50 Q32 58 40 50" stroke="#14110D" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
        {isMid && (
          <line x1="24" y1="54" x2="40" y2="54" stroke="#14110D" strokeWidth="2" strokeLinecap="round" />
        )}
        {!isGood && !isMid && (
          <path d="M24 56 Q32 48 40 56" stroke="#14110D" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
};
