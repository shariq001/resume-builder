import React from 'react';

type Dimension = {
  score: number;
  max_score: number;
  label: string;
};

export function DimensionChart({ dimensions }: { dimensions: Record<string, Dimension> }) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm mt-6">
      {Object.values(dimensions).map((dim, i) => {
        const percent = (dim.score / dim.max_score) * 100;
        return (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex justify-between text-sm font-medium">
              <span>{dim.label}</span>
              <span className="text-[var(--color-text-muted)]">{dim.score}/{dim.max_score}</span>
            </div>
            <div className="w-full bg-[var(--color-bg-surface)] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[var(--color-accent)] h-full transition-all duration-500" 
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
