"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutTemplate, Eye, FileText, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";

import Typewriter from 'typewriter-effect';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-gradient-to-br from-[var(--hero-from)] via-[var(--hero-via)] to-[var(--hero-to)] bg-[length:200%_200%] animate-gradient-bg">
      {/* Animated Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[var(--color-accent)] blur-[120px] rounded-full pointer-events-none opacity-20 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600 blur-[130px] rounded-full pointer-events-none opacity-20" style={{ animation: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />

      {/* Cyberpunk Neon Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f163d_1px,transparent_1px),linear-gradient(to_bottom,#1f163d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      {/* Animated Neon Laser Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <motion.path
          d="M -100 200 Q 400 100 900 600 T 2000 300"
          stroke="var(--color-accent)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 2000 800 Q 1200 900 600 400 T -100 500"
          stroke="var(--color-accent-alt)"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 2 }}
        />
        <motion.path
          d="M 100 -200 Q 500 500 1200 200 T 2500 800"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 4 }}
        />
      </svg>



      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 py-12 md:py-20 text-center relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-gradient-to-r from-[#00f2fe] via-[#0a0514] to-[#00f2fe] bg-[length:200%_auto] animate-gradient-slide text-white font-semibold text-sm mb-4 shadow-[0_0_20px_rgba(0,242,254,0.3)] tracking-wide">
            Premium Templates Live
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-8xl font-display font-black tracking-tight leading-[1.05] drop-shadow-sm">
            <span className="inline-block min-w-[280px] sm:min-w-[450px] md:min-w-[600px] text-center w-full">
              <Typewriter
                options={{
                  strings: [
                    'Build Your Resume', 
                    'Elevate Your Career', 
                    'Boost Your Online Presence', 
                    'Stand Out to Recruiters'
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  deleteSpeed: 30,
                  cursor: '|',
                }}
              />
            </span>
            <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] via-blue-500 to-indigo-500 drop-shadow-lg inline-block">
              in Minutes
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg sm:text-xl md:text-2xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed px-2">
            Create stunning, professional resumes with our elegant builder. Choose from premium templates, preview in real-time, and download your pixel-perfect PDF to start applying with confidence.
          </motion.p>
          
          <motion.div variants={itemVariants} className="pt-8 sm:pt-10 flex flex-col items-center justify-center px-4 w-full sm:w-auto">
            <Link href={isAuthenticated ? "/builder/new" : "/auth"} className="w-full sm:w-auto bg-gradient-to-r from-[var(--color-accent)] to-blue-500 text-white px-6 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.4)] flex items-center justify-center gap-3 group overflow-hidden relative">
              <span className="relative z-10 flex items-center gap-3">
                Create Your Resume Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards Showcase */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mt-20 md:mt-40 px-4 sm:px-0"
        >
          {/* Animated Connecting Lines (Desktop only) */}
          <div className="absolute top-1/2 left-[16.66%] right-[16.66%] h-0.5 -translate-y-1/2 hidden md:block z-0 pointer-events-none">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
              {/* Base line */}
              <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="2" />
              {/* Animated data flow dots */}
              <line 
                x1="0" y1="0" x2="100%" y2="0" 
                stroke="rgba(0, 242, 254, 0.8)" 
                strokeWidth="3" 
                strokeDasharray="6 30" 
                strokeLinecap="round"
              >
                <animate attributeName="stroke-dashoffset" values="36;0" dur="1.5s" repeatCount="indefinite" />
              </line>
              {/* Glow effect on the moving dots */}
              <line 
                x1="0" y1="0" x2="100%" y2="0" 
                stroke="rgba(0, 242, 254, 0.3)" 
                strokeWidth="8" 
                strokeDasharray="6 30" 
                strokeLinecap="round"
                filter="blur(4px)"
              >
                <animate attributeName="stroke-dashoffset" values="36;0" dur="1.5s" repeatCount="indefinite" />
              </line>
            </svg>
          </div>

           {/* Card 1 */}
           <motion.div variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }} className="relative z-10 p-8 rounded-[2rem] border border-blue-500/30 bg-gradient-to-br from-blue-900/40 via-[#0a0514]/90 to-indigo-900/40 bg-[length:200%_200%] animate-gradient-bg backdrop-blur-xl overflow-hidden group shadow-[0_0_40px_rgba(59,130,246,0.15)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none"></div>
              
              <div className="relative z-10 pt-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  <LayoutTemplate size={24} />
                </div>
                <h3 className="text-3xl font-bold mb-4 font-display text-white">Premium Templates</h3>
                <p className="text-gray-300 leading-relaxed text-lg">Beautifully crafted layouts designed by experts to catch the eye of recruiters and hiring managers instantly.</p>
              </div>
           </motion.div>
           
           {/* Card 2 */}
           <motion.div variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }} className="relative z-10 p-8 rounded-[2rem] border border-purple-500/30 bg-gradient-to-br from-purple-900/40 via-[#0a0514]/90 to-fuchsia-900/40 bg-[length:200%_200%] animate-gradient-bg backdrop-blur-xl overflow-hidden group shadow-[0_0_40px_rgba(168,85,247,0.15)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none"></div>
              
              <div className="relative z-10 pt-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                  <Eye size={24} />
                </div>
                <h3 className="text-3xl font-bold mb-4 font-display text-white">Instant Live Preview</h3>
                <p className="text-gray-300 leading-relaxed text-lg">See your resume update in real-time as you type, perfectly mapped to your selected layout without delays.</p>
              </div>
           </motion.div>
           
           {/* Card 3 */}
           <motion.div variants={itemVariants} whileHover={{ y: -10, scale: 1.02 }} className="relative z-10 p-8 rounded-[2rem] border border-pink-500/30 bg-gradient-to-br from-pink-900/40 via-[#0a0514]/90 to-rose-900/40 bg-[length:200%_200%] animate-gradient-bg backdrop-blur-xl overflow-hidden group shadow-[0_0_40px_rgba(244,63,94,0.15)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-[50px] rounded-full pointer-events-none"></div>
              
              <div className="relative z-10 pt-4">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-6 border border-pink-500/50 text-pink-400 shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                  <FileText size={24} />
                </div>
                <h3 className="text-3xl font-bold mb-4 font-display text-white">Real-Time PDF</h3>
                <p className="text-gray-300 leading-relaxed text-lg">Pixel-perfect, parser-friendly PDF generation with standard accessibility features baked in.</p>
              </div>
           </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
