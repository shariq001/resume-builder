"use client";

import { useState } from "react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedInput } from "./AnimatedInput";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function LoginPanel({ onToggle }: { onToggle: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, fetchUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.detail && typeof data.detail === "string") {
          setError(data.detail);
        } else if (data.detail && Array.isArray(data.detail)) {
          setError(data.detail[0].msg || "Validation error");
        } else {
          setError("Invalid credentials.");
        }
        return;
      }

      // Success! Token received. Save to localStorage/cookie and redirect.
      login(data.access_token, data.refresh_token);
      await fetchUser();
      router.push("/");
      
    } catch (err) {
      console.error(err);
      setError("Network error. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.form 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      onSubmit={handleSubmit} 
      className="flex flex-col w-full"
    >
      <motion.div variants={itemVariants} className="text-center mb-10">
        <h2 className="text-3xl font-extrabold mb-2 text-foreground font-display tracking-tight">Welcome Back</h2>
        <p className="text-muted text-sm font-medium">Enter your details to access your dashboard.</p>
      </motion.div>
      
      {error && (
        <motion.div variants={itemVariants} className="bg-error/10 border border-error text-error text-sm rounded-lg p-3 mb-6 font-medium text-center shadow-[0_0_10px_var(--color-error)]">
          {error}
        </motion.div>
      )}
      
      <motion.div variants={itemVariants}>
        <AnimatedInput 
          type="email" 
          placeholder="Email address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          error={!!error && !email}
          icon={Mail}
        />
      </motion.div>
      
      <motion.div variants={itemVariants} className="relative">
        <AnimatedInput 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          error={!!error && !password}
          icon={Lock}
          className="mb-2"
        />
        <div className="text-right mb-6">
          <Link href="/auth/forgot-password" className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">Forgot password?</Link>
        </div>
      </motion.div>
      
      <motion.button 
        variants={itemVariants} 
        type="submit" 
        disabled={isLoading}
        className="group relative w-full bg-gradient-to-r from-primary to-primary-hover text-white rounded-xl py-3.5 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all overflow-hidden flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
      >
        <span className="relative z-10 flex items-center gap-2">
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Log In"}
          {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </span>
      </motion.button>
      
      <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-muted">
        Don't have an account? <button type="button" onClick={onToggle} className="text-primary font-bold hover:text-primary-hover hover:underline transition-colors ml-1">Sign up</button>
      </motion.p>
    </motion.form>
  );
}
