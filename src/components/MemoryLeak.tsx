'use client';

import { useEffect, useState } from 'react';

interface LeakParticle {
  id: number;
  x: number;
  y: number;
  text: string;
  duration: number;
}

const leakTexts = [
  '0xFF', 'NULL', 'LEAK', '0x00', '▓▓▓', '░░░', '▒▒▒', '█', '∞',
  'ERROR', 'FAIL', 'VOID', 'NULL', 'DEAD', 'LOST', 'BROKEN'
];

export default function MemoryLeak() {
  const [particles, setParticles] = useState<LeakParticle[]>([]);

  useEffect(() => {
    let particleId = 0;

    const interval = setInterval(() => {
      const id = particleId++;

      const newParticle: LeakParticle = {
        id,
        x: Math.random() * 100,
        y: 100,
        text: leakTexts[Math.floor(Math.random() * leakTexts.length)],
        duration: Math.random() * 4 + 5,
      };

      setParticles(prev => [...prev.slice(-6), newParticle]);

      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id));
      }, newParticle.duration * 1000);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute font-mono text-xs leak-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          {particle.text}
        </div>
      ))}
    </div>
  );
}
