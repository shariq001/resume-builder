"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";

export function Skills({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { formData, updateFormData } = useResumeStore();
  const [skills, setSkills] = useState<string[]>(formData.skills || []);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim() && !skills.includes(input.trim())) {
        setSkills([...skills, input.trim()]);
        setInput("");
        setError("");
      }
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleNext = () => {
    if (skills.length < 3) {
      setError("Please add at least 3 skills.");
      return;
    }
    updateFormData("skills", skills);
    onNext();
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">Skills</h2>
      <p className="text-sm opacity-70 mb-4">Add at least 3 skills relevant to the role.</p>
      
      <div className="border border-border rounded-lg p-3 bg-background flex flex-wrap gap-2 items-center">
        {skills.map(skill => (
          <span key={skill} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            {skill}
            <button onClick={() => removeSkill(skill)} className="hover:bg-primary/20 rounded-full w-4 h-4 flex items-center justify-center text-xs">✕</button>
          </span>
        ))}
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
          className="flex-1 min-w-[150px] bg-transparent outline-none text-sm p-1"
        />
      </div>
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}

      <div className="flex justify-between mt-6">
        <button onClick={() => { updateFormData("skills", skills); onPrev(); }} className="border border-border text-foreground px-6 py-2 rounded-lg font-semibold hover:bg-border/50 transition-colors">Back</button>
        <button onClick={handleNext} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors">Next</button>
      </div>
    </div>
  );
}
