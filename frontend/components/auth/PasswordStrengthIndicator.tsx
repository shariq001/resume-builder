"use client";

import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface PasswordRulesProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordRulesProps) {
  const rules = [
    { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { id: "uppercase", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { id: "number", label: "One number", test: (p: string) => /[0-9]/.test(p) },
    { id: "special", label: "One special character (!@#$)", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ];

  return (
    <div className="mt-3 bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)] rounded-lg p-3 text-sm flex flex-col gap-2 shadow-inner">
      <p className="text-[var(--color-text-secondary)] font-medium text-xs uppercase tracking-wider mb-1">Password Requirements</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {rules.map((rule) => {
          const passed = rule.test(password);
          return (
            <motion.div 
              key={rule.id} 
              className={`flex items-center gap-2 ${passed ? "text-green-500" : "text-[var(--color-text-muted)]"}`}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: passed ? 1 : 0.7 }}
            >
              <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${passed ? "bg-green-500/20" : "bg-gray-500/10 border border-gray-500/20"}`}>
                {passed ? <Check size={10} strokeWidth={4} /> : <X size={10} strokeWidth={3} className="opacity-0" />}
              </div>
              <span className={`text-xs ${passed ? "font-bold" : "font-medium"}`}>{rule.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
