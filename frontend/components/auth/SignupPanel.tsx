"use client";

import { useState } from "react";
import { User, AtSign, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedInput } from "./AnimatedInput";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

export function SignupPanel({ onToggle }: { onToggle: () => void }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, fetchUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!name || !username || !email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}`}/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          username: username,
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
          setError("Failed to create account.");
        }
        return;
      }

      // For signup, if the backend returns tokens immediately:
      if (data.access_token) {
        login(data.access_token, data.refresh_token);
        await fetchUser();
        router.push("/");
      } else {
        // Fallback if signup doesn't auto-login
        onToggle();
      }
      
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
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="text-3xl font-extrabold mb-2 text-foreground font-display tracking-tight">Create Account</h2>
        <p className="text-muted text-sm font-medium">Join us to build your perfect ATS resume.</p>
      </motion.div>

      {error && (
        <motion.div variants={itemVariants} className="bg-error/10 border border-error text-error text-sm rounded-lg p-3 mb-6 font-medium text-center shadow-[0_0_10px_var(--color-error)]">
          {error}
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <AnimatedInput 
          type="text" 
          placeholder="Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          error={!!error && !name}
          icon={User}
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <AnimatedInput 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          error={!!error && !username}
          icon={AtSign}
        />
      </motion.div>
      
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
      
      <motion.div variants={itemVariants} className="mb-6">
        <AnimatedInput 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          error={!!error && !password}
          icon={Lock}
        />
        {password && <PasswordStrengthIndicator password={password} />}
      </motion.div>
      
      <motion.button 
        variants={itemVariants} 
        type="submit" 
        disabled={isLoading}
        className="group relative w-full bg-gradient-to-r from-primary to-primary-hover text-white rounded-xl py-3.5 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all overflow-hidden flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
      >
        <span className="relative z-10 flex items-center gap-2">
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Create Account"}
          {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </span>
      </motion.button>
      
      <motion.p variants={itemVariants} className="mt-8 text-center text-sm text-muted">
        Already have an account? <button type="button" onClick={onToggle} className="text-primary font-bold hover:text-primary-hover hover:underline transition-colors ml-1">Log in</button>
      </motion.p>
    </motion.form>
  );
}
