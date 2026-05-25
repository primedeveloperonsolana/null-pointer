'use client';

import { useEffect, useState } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchIntensity?: 'low' | 'medium' | 'high';
}

const glitchChars = '▓▒░█';

export default function GlitchText({ text, className = '', glitchIntensity = 'medium' }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const intervalMap = { low: 5000, medium: 3500, high: 2000 };
    const probMap = { low: 0.15, medium: 0.3, high: 0.5 };

    const interval = setInterval(() => {
      if (Math.random() < probMap[glitchIntensity]) {
        setIsGlitching(true);
        const glitched = text
          .split('')
          .map(char => {
            if (Math.random() < 0.2) {
              return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
            return char;
          })
          .join('');
        setDisplayText(glitched);

        setTimeout(() => {
          setDisplayText(text);
          setIsGlitching(false);
        }, 100);
      }
    }, intervalMap[glitchIntensity]);

    return () => clearInterval(interval);
  }, [text, glitchIntensity]);

  return (
    <span className={`${className} ${isGlitching ? 'glitch-text' : ''}`}>
      {displayText}
    </span>
  );
}
