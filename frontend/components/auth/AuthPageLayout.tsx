"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ParticleBackground } from "./ParticleBackground";
import { LoginPanel } from "./LoginPanel";
import { SignupPanel } from "./SignupPanel";

export default function AuthPageLayout() {
  const [isLogin, setIsLogin] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const toggleView = () => setIsLogin(!isLogin);

  const variants = {
    enter: (isLogin: boolean) => ({
      x: shouldReduceMotion ? 0 : (isLogin ? -100 : 100),
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (isLogin: boolean) => ({
      x: shouldReduceMotion ? 0 : (isLogin ? 100 : -100),
      opacity: 0,
    })
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-background transition-colors duration-500 overflow-hidden">
      
      {/* Cyberpunk Neon Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f163d_1px,transparent_1px),linear-gradient(to_bottom,#1f163d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

      {/* Animated Neon Laser Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <motion.path
          d="M -100 200 Q 400 100 900 600 T 2000 300"
          stroke="var(--color-accent)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 2000 800 Q 1200 900 600 400 T -100 500"
          stroke="var(--color-accent-alt)"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 2 }}
        />
      </svg>

      {/* Ambient glowing orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary blur-[150px] rounded-full pointer-events-none mix-blend-screen opacity-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary-alt blur-[150px] rounded-full pointer-events-none mix-blend-screen opacity-10" />

      <div className="relative w-full max-w-lg z-10">
        {/* Animated glowing border wrapper */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-alt to-primary bg-[length:200%_200%] animate-gradient-bg rounded-[2rem] blur-xl opacity-20"></div>
        
        <div className="relative bg-[#0A0514]/80 backdrop-blur-3xl border border-primary/20 shadow-2xl shadow-primary/20 rounded-[2rem] p-6 sm:p-10 overflow-hidden">
          <AnimatePresence mode="wait" custom={isLogin}>
            <motion.div
              key={isLogin ? "login" : "signup"}
              custom={isLogin}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            >
              {isLogin ? (
                <LoginPanel onToggle={toggleView} />
              ) : (
                <SignupPanel onToggle={toggleView} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
