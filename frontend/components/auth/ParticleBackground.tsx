import React from 'react';

export function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-background">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="particles" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.5" className="fill-primary opacity-20" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#particles)" />
      </svg>
    </div>
  );
}
