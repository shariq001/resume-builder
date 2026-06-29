"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const options = ["light", "system", "dark"] as const;

export function ThemeToggle({ initialTheme = "system", onThemeChange }: { initialTheme?: string, onThemeChange: (t: string) => void }) {
  const [theme, setTheme] = useState(initialTheme);

  const handleSelect = (t: string) => {
    setTheme(t);
    onThemeChange(t);
    if (t === 'dark') document.documentElement.classList.add('dark');
    else if (t === 'light') document.documentElement.classList.remove('dark');
    else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <div className="flex bg-background border border-border rounded-full p-1 relative w-64 items-center justify-between">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleSelect(option)}
          className={`relative z-10 w-full py-1 text-sm font-medium capitalize transition-colors ${
            theme === option ? "text-white" : "text-foreground opacity-70"
          }`}
        >
          {option}
          {theme === option && (
            <motion.div
              layoutId="theme-bubble"
              className="absolute inset-0 bg-primary rounded-full -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
