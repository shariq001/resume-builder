"use client";
// Force rebuild

import { useState } from "react";
import { Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedInput } from "@/components/auth/AnimatedInput";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.detail && typeof data.detail === "string") {
          setError(data.detail);
        } else {
          setError("Failed to send reset link.");
        }
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <AuthPageLayout>
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="flex flex-col w-full"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <Link href="/auth" className="inline-flex items-center text-sm font-medium text-muted hover:text-primary transition-colors">
            <ArrowLeft size={16} className="mr-1" />
            Back to login
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-10">
          <h2 className="text-3xl font-extrabold mb-2 text-foreground font-display tracking-tight">Forgot Password</h2>
          <p className="text-muted text-sm font-medium">Enter your email and we'll send you a reset link.</p>
        </motion.div>
        
        {error && (
          <motion.div variants={itemVariants} className="bg-error/10 border border-error text-error text-sm rounded-lg p-3 mb-6 font-medium text-center shadow-[0_0_10px_var(--color-error)]">
            {error}
          </motion.div>
        )}

        {success ? (
          <motion.div variants={itemVariants} className="bg-success/10 border border-success text-success text-sm rounded-lg p-6 mb-6 font-medium text-center shadow-[0_0_15px_var(--color-success)]">
            <p className="mb-2 text-lg">Check your email!</p>
            <p className="text-muted">If an account exists for {email}, a reset link has been sent.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <motion.div variants={itemVariants} className="mb-6">
              <AnimatedInput 
                type="email" 
                placeholder="Email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                error={!!error && !email}
                icon={Mail}
              />
            </motion.div>
            
            <motion.button 
              variants={itemVariants} 
              type="submit" 
              disabled={isLoading}
              className="group relative w-full bg-gradient-to-r from-primary to-primary-hover text-white rounded-xl py-3.5 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all overflow-hidden flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Send Reset Link"}
                {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </span>
            </motion.button>
          </form>
        )}
      </motion.div>
    </AuthPageLayout>
  );
}
