import React from 'react';

export function ScoreRing({ score, grade }: { score: number, grade: string }) {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  let color = "#EF4444";
  if (grade === 'A') color = "#14B8A6";
  else if (grade === 'B') color = "#22C55E";
  else if (grade === 'C') color = "#EAB308";

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        role="img"
        aria-label={`ATS score: ${score} out of 100`}
      >
        <circle
          stroke="var(--color-bg-surface)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>
      <div className="absolute text-4xl font-display font-bold" style={{ color }}>
        {score}
      </div>
    </div>
  );
}
