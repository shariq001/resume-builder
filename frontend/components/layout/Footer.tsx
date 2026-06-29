"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative w-full mt-auto overflow-hidden bg-[var(--color-bg-primary)] print:hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-primary)] via-blue-900/10 to-[var(--color-bg-primary)] bg-[length:200%_200%]"
      />

      {/* Central Wavy Neon Line Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden opacity-70">
        <svg className="w-[300%] sm:w-[200%] h-[150px] min-w-[1800px]" preserveAspectRatio="none" viewBox="0 0 1800 100">
          <g>
            <animateTransform attributeName="transform" type="translate" from="0 0" to="-600 0" dur="8s" repeatCount="indefinite" />
            <path d="M 0 50 C 150 10, 150 90, 300 50 C 450 10, 450 90, 600 50 C 750 10, 750 90, 900 50 C 1050 10, 1050 90, 1200 50 C 1350 10, 1350 90, 1500 50 C 1650 10, 1650 90, 1800 50 C 1950 10, 1950 90, 2100 50 C 2250 10, 2250 90, 2400 50" fill="none" stroke="cyan" strokeWidth="2" />
            <path d="M 0 50 C 150 10, 150 90, 300 50 C 450 10, 450 90, 600 50 C 750 10, 750 90, 900 50 C 1050 10, 1050 90, 1200 50 C 1350 10, 1350 90, 1500 50 C 1650 10, 1650 90, 1800 50 C 1950 10, 1950 90, 2100 50 C 2250 10, 2250 90, 2400 50" fill="none" stroke="#06b6d4" strokeWidth="6" filter="blur(4px)" opacity="0.8" />
            <path d="M 0 50 C 150 10, 150 90, 300 50 C 450 10, 450 90, 600 50 C 750 10, 750 90, 900 50 C 1050 10, 1050 90, 1200 50 C 1350 10, 1350 90, 1500 50 C 1650 10, 1650 90, 1800 50 C 1950 10, 1950 90, 2100 50 C 2250 10, 2250 90, 2400 50" fill="none" stroke="#2563eb" strokeWidth="16" filter="blur(12px)" opacity="0.5" />
          </g>
        </svg>
      </div>
      <div className="relative z-10 p-6 border-t border-[var(--color-text-primary)]/10 text-center backdrop-blur-md">
        <p className="font-semibold tracking-wide text-sm text-[var(--color-text-secondary)]">
          © 2026 ATS Friendly Resume Builder. Developed by <a href="https://www.linkedin.com/in/muhammad---shariq" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] underline decoration-[var(--color-accent)]/50 hover:decoration-[var(--color-accent)] underline-offset-4 transition-all">Muhammad Shariq</a>
        </p>
      </div>
    </footer>
  );
}
