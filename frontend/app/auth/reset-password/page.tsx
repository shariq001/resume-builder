"use client";

import { useState, useEffect } from "react";
import { Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedInput } from "@/components/auth/AnimatedInput";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No reset token found in URL. Please click the link in your email again.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!token) {
      setError("No reset token found.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.detail && typeof data.detail === "string") {
          setError(data.detail);
        } else if (data.detail && Array.isArray(data.detail)) {
          setError(data.detail[0].msg || "Validation error");
        } else {
          setError("Failed to reset password.");
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

  if (success) {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col w-full text-center">
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center text-success">
            <CheckCircle2 size={32} />
          </div>
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-3xl font-extrabold mb-4 text-foreground font-display tracking-tight">
          Password Reset!
        </motion.h2>
        <motion.p variants={itemVariants} className="text-muted font-medium mb-8">
          Your password has been successfully reset.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link 
            href="/auth" 
            className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white rounded-xl py-3.5 px-8 font-bold transition-colors w-full"
          >
            Go to Login
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.form 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      onSubmit={handleSubmit} 
      className="flex flex-col w-full"
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="text-3xl font-extrabold mb-2 text-foreground font-display tracking-tight">Set New Password</h2>
        <p className="text-muted text-sm font-medium">Please enter your new password below.</p>
      </motion.div>
      
      {error && (
        <motion.div variants={itemVariants} className="bg-error/10 border border-error text-error text-sm rounded-lg p-3 mb-6 font-medium text-center shadow-[0_0_10px_var(--color-error)]">
          {error}
        </motion.div>
      )}
      
      <motion.div variants={itemVariants} className="mb-4 relative">
        <AnimatedInput 
          type="password" 
          placeholder="New Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          error={!!error && !password}
          icon={Lock}
        />
        {password && <PasswordStrengthIndicator password={password} />}
      </motion.div>
      
      <motion.div variants={itemVariants} className="mb-8">
        <AnimatedInput 
          type="password" 
          placeholder="Confirm New Password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          error={!!error && (!confirmPassword || password !== confirmPassword)}
          icon={Lock}
        />
      </motion.div>
      
      <motion.button 
        variants={itemVariants} 
        type="submit" 
        disabled={isLoading || !token}
        className="group relative w-full bg-gradient-to-r from-primary to-primary-hover text-white rounded-xl py-3.5 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all overflow-hidden flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
      >
        <span className="relative z-10 flex items-center gap-2">
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Reset Password"}
          {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </span>
      </motion.button>
    </motion.form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthPageLayout>
      <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthPageLayout>
  );
}
