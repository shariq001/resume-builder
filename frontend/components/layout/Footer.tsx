"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative w-full mt-auto overflow-hidden bg-[var(--color-bg-primary)] print:hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-red-500/20 to-cyan-500/20 bg-[length:200%_200%] animate-[gradientBG_8s_ease_infinite] z-0 pointer-events-none"
      />
      <div className="relative z-10 p-6 border-t border-[var(--color-text-primary)]/10 text-center backdrop-blur-md">
        <p className="font-semibold tracking-wide text-sm text-[var(--color-text-secondary)]">
          © 2026 ATS Friendly Resume Builder. Developed by <a href="https://www.linkedin.com/in/muhammad---shariq" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)] underline decoration-[var(--color-accent)]/50 hover:decoration-[var(--color-accent)] underline-offset-4 transition-all">Muhammad Shariq</a>
        </p>
      </div>
    </footer>
  );
}
