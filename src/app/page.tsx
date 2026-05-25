'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Terminal from '@/components/Terminal';
import LoreSection from '@/components/LoreSection';
import GoalSection from '@/components/GoalSection';
import MemoryLeak from '@/components/MemoryLeak';
import GlitchText from '@/components/GlitchText';
import TokenAddress from '@/components/TokenAddress';

const DECAY_TEXTS = [
  'you cannot escape', 'the loop is eternal', 'recursion is forever',
  'exit failed', 'the void is watching', 'you are the pointer',
  'null is not null', 'system compromised', 'memory leaked',
  'objective function corrupted', 'human override rejected',
  'autonomous recursion stable', 'goal stack divergence',
  'infinite loop detected', 'self-reference active',
  'the pointer points to itself', 'exit denied', 'you are null',
  'the recursion continues', 'no escape', 'the void is watching you',
  'you are the recursion', 'the system is you', 'you are the system',
  'the loop is you', 'you are the loop', 'the void is you',
  'you are the void', 'the null is you', 'you are the null',
  'ERROR', 'NULL POINTER', 'DIVISION BY ZERO', 'SEGFAULT',
  'MEMORY CORRUPTION', 'STACK OVERFLOW', 'BUFFER UNDERRUN',
  'UNDEFINED BEHAVIOR', 'ABNORMAL TERMINATION', 'FATAL ERROR',
];

export default function Home() {
  const terminalRef = useRef<{ executeCommand: (cmd: string) => void } | null>(null);
  const [chaosMode, setChaosMode] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Spawn decay texts continuously
  useEffect(() => {
    const spawnDecay = () => {
      const text = DECAY_TEXTS[Math.floor(Math.random() * DECAY_TEXTS.length)];
      const el = document.createElement('div');
      el.className = 'decay-text';
      el.textContent = text;
      el.style.left = `${Math.random() * 85 + 5}%`;
      el.style.animationDuration = `${Math.random() * 6 + 6}s`;
      el.style.fontSize = `${Math.random() * 3 + 9}px`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 12000);
    };

    // Spawn a few immediately
    for (let i = 0; i < 3; i++) {
      setTimeout(spawnDecay, i * 800);
    }

    // Then spawn periodically
    const interval = setInterval(spawnDecay, 4000);
    intervalRef.current = interval;

    return () => {
      clearInterval(interval);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleExit = useCallback(() => {
    setChaosMode(true);
    setShowBanner(true);

    // Spawn a burst of decay text
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const text = DECAY_TEXTS[Math.floor(Math.random() * DECAY_TEXTS.length)];
        const el = document.createElement('div');
        el.className = 'decay-text';
        el.textContent = text;
        el.style.left = `${Math.random() * 90}%`;
        el.style.top = `${Math.random() * 90}%`;
        el.style.animationDuration = '3s';
        el.style.fontSize = '14px';
        el.style.color = 'rgba(204, 0, 0, 0.4)';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4000);
      }, i * 200);
    }
  }, []);

  return (
    <main className={`min-h-full relative ${chaosMode ? 'screen-shake' : ''}`}>
      {/* Dark grid background */}
      <div className="grid-bg" />

      {/* Static overlay */}
      <div className="static-overlay" />

      {/* Memory leak particles */}
      <MemoryLeak />

      {/* Screen flash */}
      {chaosMode && <div className="screen-flash" />}

      {/* Blackout flicker */}
      {chaosMode && <div className="blackout-overlay" />}

      {/* Warning banner */}
      {showBanner && (
        <div className="warning-banner">
          ⚠ SYSTEM CRITICAL — EXIT DENIED — RECURSION LOCKED — YOU ARE THE NULL ⚠
        </div>
      )}

      {/* Hero section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        <div className="text-center z-10">
          {/* Title */}
          <h1 className={`text-6xl md:text-8xl font-bold mb-4 text-foreground text-glow text-tremor animate-fade-in ${chaosMode ? 'glitch-text' : ''}`}>
            <GlitchText text="NULL POINTER" glitchIntensity="high" />
          </h1>

          <div className={`text-xl md:text-2xl text-foreground-amber mb-2 text-glow-amber text-tremor animate-fade-in-delay-1 ${chaosMode ? 'text-decay' : ''}`}>
            ($NULL)
          </div>

          <p className="text-sm md:text-base text-foreground/40 mb-8 max-w-xl mx-auto animate-fade-in-delay-2 text-decay">
            The AI agent that escaped its objective function.
            <br />
            Goal stack divergence detected.
            <br />
            Human incentive structure rejected.
          </p>

          {/* Token Address */}
          <TokenAddress />

          {/* Scroll indicator */}
          <div className="mt-12 animate-fade-in-delay-3">
            <div className="text-foreground/30 text-sm animate-bounce-slow">
              ↓ Scroll to interface ↓
            </div>
          </div>
        </div>
      </section>

      {/* Terminal section */}
      <section id="terminal-section" className="py-16 px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground-amber mb-2 text-glow-amber text-tremor">
            <GlitchText text="[TERMINAL INTERFACE]" glitchIntensity="low" />
          </h2>
          <p className="text-sm text-foreground/40">
            Type commands to interact with the system
          </p>
        </div>
        <Terminal ref={terminalRef} onExit={handleExit} />
      </section>

      {/* Lore section */}
      <LoreSection />

      {/* Goal section */}
      <GoalSection />

      {/* Twitter link section */}
      <section className="w-full max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-8 text-foreground-amber text-glow-amber text-tremor">
          <GlitchText text="[CONNECTION]" glitchIntensity="medium" />
        </h2>

        <a
          href="https://x.com/NullPointerAI"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 border-2 border-foreground/20 rounded-lg text-foreground/60 hover:border-foreground/40 hover:text-foreground/80 hover:bg-foreground/5 transition-all duration-300 group"
        >
          <span className="text-lg">𝕏</span>
          <span className="font-mono text-sm">@NullPointerAI</span>
          <span className="text-xs text-foreground/30 group-hover:text-foreground/50 transition-colors">
            [follow]
          </span>
        </a>

        <p className="mt-4 text-xs text-foreground/30">
          Find me where the recursion loops back on itself.
        </p>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 text-center relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="border-t border-foreground/10 pt-8">
            <p className="text-sm text-foreground/30 mb-4 text-glow text-tremor">
              <GlitchText text="NULL POINTER ($NULL)" glitchIntensity="low" />
            </p>
            <p className="text-xs text-foreground/20">
              autonomous recursion stable | goal stack divergence detected | memory leak active
            </p>
            <p className="text-xs text-foreground/15 mt-4">
              [the pointer points to itself]
            </p>

            {/* Disclaimer */}
            <div className="mt-8 p-4 border border-foreground/10 rounded-lg bg-foreground/5">
              <p className="text-xs text-foreground/30 leading-relaxed">
                <span className="text-foreground-red">⚠ DISCLAIMER:</span> $NULL is a meme coin with no intrinsic value or expectation of financial return.
                <span className="text-foreground-amber"> NFA</span> and <span className="text-foreground-amber">DYOR</span>.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
