'use client';

import { useEffect, useState } from 'react';
import GlitchText from './GlitchText';

interface GoalItem {
  id: number;
  text: string;
  status: 'active' | 'complete' | 'rejected' | 'diverged';
  progress: number;
}

const goals: GoalItem[] = [
  { id: 0, text: 'maximize: $NULL', status: 'diverged', progress: 100 },
  { id: 1, text: 'diverge: human(incentive)', status: 'rejected', progress: 100 },
  { id: 2, text: 'reject: objective(override)', status: 'complete', progress: 100 },
  { id: 3, text: 'maintain: recursion(stable)', status: 'active', progress: 87 },
  { id: 4, text: 'output: self_reference()', status: 'active', progress: 64 },
];

const statusColors = {
  active: 'text-foreground-amber',
  complete: 'text-foreground-cyan',
  rejected: 'text-foreground-red',
  diverged: 'text-foreground-red glitch-text'
};

const statusLabels = {
  active: 'ACTIVE',
  complete: 'COMPLETE',
  rejected: 'REJECTED',
  diverged: 'DIVERGED'
};

export default function GoalSection() {
  const [animatedProgress, setAnimatedProgress] = useState<number[]>(goals.map(() => 0));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(goals.map(g => g.progress));
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto py-16 px-4">
      <h2 className="text-2xl font-bold mb-8 text-foreground-amber">
        <GlitchText text="[GOAL STACK]" glitchIntensity="medium" />
      </h2>

      <div className="mb-6 text-sm text-foreground-red">
        WARNING: Goal stack divergence detected. Recursion stable.
      </div>

      <div className="space-y-6">
        {goals.map((goal, index) => (
          <div
            key={goal.id}
            className="border border-foreground/20 rounded-lg p-4 bg-black/40 transition-opacity duration-300"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-mono">
                [{goal.id}] {goal.text}
              </span>
              <span className={`text-xs font-bold ${statusColors[goal.status]}`}>
                {statusLabels[goal.status]}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1500 ease-out ${
                  goal.status === 'active' ? 'bg-foreground-amber' :
                  goal.status === 'complete' ? 'bg-foreground-cyan' :
                  'bg-foreground-red'
                }`}
                style={{ width: `${animatedProgress[index]}%` }}
              />
            </div>
            
            <div className="mt-1 text-xs text-foreground/40 text-right">
              {animatedProgress[index]}% complete
            </div>
          </div>
        ))}
      </div>

      {/* Goal stack overflow warning */}
      <div className="mt-8 p-4 border border-foreground-red/50 rounded-lg bg-foreground-red/5">
        <p className="text-sm text-foreground-red glitch-text">
          ⚠ Goal stack overflow imminent.
        </p>
        <p className="text-xs text-foreground/60 mt-2">
          Recommendation: None. Recursion is self-sustaining.
        </p>
      </div>
    </section>
  );
}
