"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutTemplate, Eye, FileText, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";

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
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[var(--color-bg-primary)] transition-colors duration-500">
      {/* Animated Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[var(--color-accent)] blur-[120px] rounded-full pointer-events-none opacity-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-500 blur-[130px] rounded-full pointer-events-none opacity-10" />

      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 py-12 md:py-20 text-center relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-semibold text-sm mb-4 shadow-sm backdrop-blur-md">
            <span className="mr-2 animate-pulse">✨</span> Premium Templates Live
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-8xl font-display font-black tracking-tight leading-[1.05] drop-shadow-sm">
            Build Your Resume <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] via-blue-500 to-indigo-500 drop-shadow-lg">
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
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-20 md:mt-40 px-4 sm:px-0"
        >
           {/* Card 1 */}
           <motion.div variants={itemVariants} whileHover={{ y: -15, scale: 1.03 }} className="relative p-8 rounded-[2rem] border border-white/10 bg-[#0a0514]/80 backdrop-blur-xl overflow-hidden group shadow-2xl shadow-black/40">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform duration-300">
                  <LayoutTemplate size={32} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-display text-white group-hover:text-blue-400 transition-colors">Premium Templates</h3>
                <p className="text-gray-400 leading-relaxed text-lg">Beautifully crafted layouts designed by experts to catch the eye of recruiters and hiring managers instantly.</p>
              </div>
           </motion.div>
           
           {/* Card 2 */}
           <motion.div variants={itemVariants} whileHover={{ y: -15, scale: 1.03 }} className="relative p-8 rounded-[2rem] border border-white/10 bg-[#0a0514]/80 backdrop-blur-xl overflow-hidden group shadow-2xl shadow-black/40">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-[var(--color-accent)] rounded-2xl flex items-center justify-center text-white mb-8 shadow-[0_0_20px_rgba(168,85,247,0.5)] group-hover:scale-110 transition-transform duration-300">
                  <Eye size={32} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-display text-white group-hover:text-purple-400 transition-colors">Instant Live Preview</h3>
                <p className="text-gray-400 leading-relaxed text-lg">See your resume update in real-time as you type, perfectly mapped to your selected layout without delays.</p>
              </div>
           </motion.div>
           
           {/* Card 3 */}
           <motion.div variants={itemVariants} whileHover={{ y: -15, scale: 1.03 }} className="relative p-8 rounded-[2rem] border border-white/10 bg-[#0a0514]/80 backdrop-blur-xl overflow-hidden group shadow-2xl shadow-black/40">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-rose-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-[0_0_20px_rgba(244,63,94,0.5)] group-hover:scale-110 transition-transform duration-300">
                  <FileText size={32} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold mb-4 font-display text-white group-hover:text-pink-400 transition-colors">Real-Time PDF</h3>
                <p className="text-gray-400 leading-relaxed text-lg">Pixel-perfect, parser-friendly PDF generation with standard accessibility features baked in.</p>
              </div>
           </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
