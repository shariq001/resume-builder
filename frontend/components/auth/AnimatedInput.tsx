"use client";

import { motion, useReducedMotion } from "framer-motion";
import { InputHTMLAttributes, forwardRef, useState } from "react";
import { LucideIcon } from "lucide-react";

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: LucideIcon;
  label?: string;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ error, icon: Icon, label, className = "", placeholder, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    const shakeAnimation = {
      x: shouldReduceMotion ? 0 : [0, -4, 4, -4, 4, 0],
      transition: { duration: 0.2 }
    };

    return (
      <motion.div 
        animate={error ? shakeAnimation : {}} 
        className={`relative mb-6 w-full group ${className}`}
      >
        {Icon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 z-10 
            ${isFocused ? 'text-primary drop-shadow-[0_0_8px_var(--color-accent)]' : (error ? 'text-error' : 'text-muted')}`}>
            <Icon size={20} />
          </div>
        )}
        
        <input
          ref={ref}
          placeholder=" "
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
          className={`peer w-full bg-black/40 backdrop-blur-md border-2 rounded-xl pt-5 pb-2 outline-none text-foreground transition-all duration-300
            ${Icon ? 'pl-12 pr-4' : 'px-4'}
            ${error ? 'border-error bg-error/10 shadow-[0_0_15px_var(--color-error)]' 
                    : 'border-border focus:border-primary focus:bg-background focus:shadow-[0_0_20px_var(--color-accent)]'}
          `}
          {...props}
        />
        
        <label 
          className={`absolute text-sm transition-all duration-300 pointer-events-none
            ${Icon ? 'left-12' : 'left-4'}
            ${isFocused || props.value 
              ? 'top-1.5 text-xs text-primary font-bold' 
              : 'top-1/2 -translate-y-1/2 text-muted'}
          `}
        >
          {placeholder || label}
        </label>
      </motion.div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

AnimatedInput.displayName = "AnimatedInput";
