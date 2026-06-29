"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { useReducedMotion } from "framer-motion";

export function KeywordPanel() {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const { formData, updateFormData } = useResumeStore();
  const shouldReduceMotion = useReducedMotion();

  const handleAnalyse = async () => {
    if (jd.length < 50 || jd.length > 5000) return;
    setLoading(true);
    
    try {
      if (!formData.id) return;
      const res = await fetch(`/api/v1/resumes/${formData.id}/keyword-match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ job_description: jd })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        console.error("Failed to match keywords");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = (skill: string) => {
    const currentSkills = formData.skills || [];
    if (!currentSkills.includes(skill)) {
      updateFormData("skills", [...currentSkills, skill]);
      setResult({
        ...result,
        matched_keywords: [...result.matched_keywords, skill].sort(),
        missing_keywords: result.missing_keywords.filter((k: string) => k !== skill),
        match_percentage: ((result.total_matched + 1) / result.total_jd_keywords) * 100,
        total_matched: result.total_matched + 1
      });
    }
  };

  return (
    <div className="w-full bg-[var(--color-bg-primary)] p-6 rounded-lg border border-[var(--color-border)] shadow-sm">
      <h2 className="text-xl font-bold mb-4 font-display">Match Job Description</h2>
      
      {!result && !loading && (
        <div className="flex flex-col gap-3">
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            className="w-full h-32 p-3 rounded border border-[var(--color-border)] bg-transparent resize-none text-sm"
            placeholder="Paste Job Description here..."
          />
          <div className="flex justify-between items-center text-xs text-[var(--color-text-muted)]">
            <span>{jd.length} / 5000</span>
            <button 
              onClick={handleAnalyse}
              disabled={jd.length < 50 || jd.length > 5000}
              className="bg-[var(--color-accent)] text-white px-4 py-2 rounded font-semibold disabled:opacity-50"
            >
              Analyse
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="h-48 flex items-center justify-center">
          {shouldReduceMotion ? (
            <div className="animate-pulse flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-[var(--color-bg-surface)] rounded-full"></div>
              <span className="text-sm font-medium">Scanning...</span>
            </div>
          ) : (
             <div className="flex flex-col items-center gap-2">
               <div className="w-10 h-10 border-4 border-[var(--color-bg-surface)] border-t-[var(--color-accent)] rounded-full animate-spin"></div>
               <span className="text-sm font-medium text-[var(--color-text-secondary)]">Analyzing keywords...</span>
             </div>
          )}
        </div>
      )}

      {result && !loading && (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-4">
             <span className="font-medium">Match Percentage</span>
             <span className="text-3xl font-display font-bold text-[var(--color-accent)]">
               {Math.round(result.match_percentage)}%
             </span>
          </div>
          
          <div>
            <h3 className="text-sm font-bold mb-2">Matched Keywords</h3>
            <ul role="list" className="flex flex-wrap gap-2">
              {result.matched_keywords.map((k: string) => (
                <li key={k} role="listitem" className="px-3 py-1 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-full text-sm font-medium">
                  {k}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold mb-2">Missing Keywords</h3>
            <ul role="list" className="flex flex-wrap gap-2">
              {result.missing_keywords.map((k: string) => (
                <li key={k} role="listitem" className="px-3 py-1 bg-[var(--color-error)]/10 text-[var(--color-error)] rounded-full text-sm font-medium flex items-center gap-1">
                  {k}
                  <button 
                    onClick={() => handleAddSkill(k)}
                    aria-label={`Add ${k} to skills`}
                    className="ml-1 hover:bg-[var(--color-error)]/20 rounded-full w-4 h-4 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <button 
             onClick={() => setResult(null)} 
             className="text-sm text-[var(--color-text-secondary)] hover:underline self-center mt-2"
          >
            Reset Analysis
          </button>
        </div>
      )}
    </div>
  );
}
