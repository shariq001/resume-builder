"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, User as UserIcon, Moon, Sun } from "lucide-react";
import { getImageUrl } from "@/lib/utils/getImageUrl";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { ProfileModal } from "@/components/ProfileModal";

export function Header() {
  const { user, isAuthenticated, fetchUser, isLoading } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    fetchUser();
    setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <>
      <header className="px-4 md:px-8 py-3 md:py-4 flex justify-between items-center relative z-20 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-[var(--color-text-primary)]/10 print:hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-primary)] via-blue-900/20 to-[var(--color-bg-primary)] bg-[length:200%_200%] backdrop-blur-3xl"
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
        
        <Link href="/" className="relative flex items-center justify-center">

          <motion.nav 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10 font-display font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight text-white drop-shadow-[0_0_8px_rgba(0,0,0,1)] hover:scale-105 transition-transform"
          >
            Resume Builder
          </motion.nav>
        </Link>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 flex items-center gap-4"
        >
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-[var(--color-text-primary)]/5 border border-[var(--color-text-primary)]/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)]/10 transition-colors shadow-sm"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-[70px] h-[36px] bg-[var(--color-text-primary)]/10 animate-pulse rounded-md" />
              <div className="w-[120px] h-[36px] bg-[var(--color-accent)]/20 animate-pulse rounded-full" />
            </div>
          ) : isAuthenticated ? (
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 p-2 rounded-full border border-[var(--color-text-primary)]/10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)]/10 transition-colors shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.3)]"
            >
              {user?.profile_picture_url ? (
                <img src={getImageUrl(user.profile_picture_url)} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-[var(--color-accent)]" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center font-bold text-white">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || <UserIcon size={16} />}
                </div>
              )}
            </button>
          ) : (
            <>
              <Link href="/auth" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-semibold transition-colors px-2 text-sm sm:text-base">
                Login
              </Link>
              <Link href="/auth" className="group relative bg-gradient-to-r from-[var(--color-accent)] to-blue-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.4)] hover:shadow-[0_0_25px_rgba(var(--color-accent-rgb),0.6)] hover:-translate-y-0.5 overflow-hidden text-sm sm:text-base">
                <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                  Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </>
          )}
        </motion.div>
      </header>
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}
