"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Code2 } from "lucide-react";

export function SkillsSection({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { formData, updateFormData } = useResumeStore();
  const skills = formData.skills || [];
  const [currentSkill, setCurrentSkill] = useState("");

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = currentSkill.trim();
    if (!val || skills.includes(val)) return;
    updateFormData("skills", [...skills, val]);
    setCurrentSkill("");
  };

  const handleRemove = (skillToRemove: string) => {
    updateFormData("skills", skills.filter((s: string) => s !== skillToRemove));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Code2 className="text-primary" /> Skills</h2>
      </div>

      <div className="bg-secondary/20 p-5 rounded-xl border border-border">
        <p className="text-sm text-muted mb-4">Add the technologies, tools, and languages you excel at.</p>
        
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input 
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            className="flex-1 p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors"
            placeholder="e.g. React.js, Python, Project Management"
          />
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors flex items-center gap-1">
            <Plus size={18} /> Add
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {skills.map((skill: string) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2"
              >
                {skill}
                <button onClick={() => handleRemove(skill)} className="hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-between mt-8 border-t border-border pt-4">
        <button onClick={onPrev} className="px-6 py-2 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors">Back</button>
        <button onClick={onNext} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-[0_0_10px_var(--color-primary)]">Finish</button>
      </div>
    </div>
  );
}
