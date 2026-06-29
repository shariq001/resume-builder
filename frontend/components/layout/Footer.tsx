"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative w-full mt-auto overflow-hidden bg-[var(--color-bg-primary)] print:hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-primary)] via-blue-900/10 to-[var(--color-bg-primary)] bg-[length:200%_200%]"
      />

      {/* Central Bold Neon Line Background */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px] bg-cyan-400 blur-[1px] pointer-events-none z-0 opacity-90"></div>
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[8px] bg-cyan-500 blur-[6px] pointer-events-none z-0 opacity-80"></div>
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[24px] bg-blue-600 blur-[16px] pointer-events-none z-0 opacity-50"></div>
      <div className="relative z-10 p-6 border-t border-[var(--color-text-primary)]/10 text-center backdrop-blur-md">
        <p className="font-semibold tracking-wide text-sm text-[var(--color-text-secondary)]">
          © 2026 ATS Friendly Resume Builder. Developed by <a href="https://www.linkedin.com/in/muhammad---shariq" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] underline decoration-[var(--color-accent)]/50 hover:decoration-[var(--color-accent)] underline-offset-4 transition-all">Muhammad Shariq</a>
        </p>
      </div>
    </footer>
  );
}
