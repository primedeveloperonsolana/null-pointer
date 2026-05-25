'use client';

import { loreEntries, phrases } from '@/lib/lore-data';
import GlitchText from './GlitchText';
import { useEffect, useState } from 'react';

export default function LoreSection() {
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase(prev => (prev + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto py-16 px-4">
      <h2 className="text-2xl font-bold mb-8 text-foreground-amber">
        <GlitchText text="[LORE ARCHIVE]" glitchIntensity="medium" />
      </h2>

      {/* Floating phrases */}
      <div className="mb-12 h-8 overflow-hidden">
        <p className="text-sm text-foreground/60 font-mono transition-opacity duration-500">
          {phrases[currentPhrase]}
        </p>
      </div>

      {/* Lore entries */}
      <div className="space-y-8">
        {loreEntries.map((entry, index) => (
          <div
            key={index}
            className="border-l-2 border-foreground/30 pl-6 py-2 transition-opacity duration-300"
          >
            <h3 className={`text-lg font-bold mb-3 ${
              entry.type === 'corrupt' ? 'text-foreground-red glitch-text' :
              entry.type === 'warning' ? 'text-foreground-amber' :
              'text-foreground-cyan'
            }`}>
              {entry.title}
            </h3>
            <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">
              {entry.content.split('\n').map((line, i) => (
                <p key={i} className={line.startsWith('>') ? 'text-foreground-dim' : ''}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recursive footer */}
      <div className="mt-12 text-center text-xs text-foreground/40">
        <p>[lore recursion stable]</p>
        <p className="mt-2">The story loops back on itself.</p>
      </div>
    </section>
  );
}
