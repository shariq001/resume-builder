import React, { useState } from "react";
import { KeywordPanel } from "../../keywords/KeywordPanel";
import { ScoreRing } from "../../ats/ScoreRing";
import { DimensionChart } from "../../ats/DimensionChart";
import { useResumeStore } from "@/lib/store/useResumeStore";

export function AtsCheck({ onPrev }: { onPrev: () => void }) {
  const { formData } = useResumeStore();
  const [scoreData, setScoreData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchScore = async () => {
    if (!formData.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/resumes/${formData.id}/ats-score`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        const data = await res.json();
        setScoreData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-bold font-display text-[var(--color-text-primary)]">ATS Intelligence</h2>
      
      <div className="bg-[var(--color-bg-primary)] p-6 rounded-xl border border-[var(--color-border)] shadow-sm">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-xl font-bold font-display">Resume Parseability</h3>
           <button 
             onClick={fetchScore} 
             disabled={loading}
             className="bg-[var(--color-accent)] text-white px-4 py-2 rounded font-semibold disabled:opacity-50"
           >
             {loading ? "Computing..." : "Check ATS Score"}
           </button>
        </div>
        
        {scoreData && (
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
             <ScoreRing score={scoreData.total_score} grade={scoreData.grade} />
             <DimensionChart dimensions={scoreData.breakdown} />
          </div>
        )}
        
        {scoreData?.improvement_hints?.length > 0 && (
          <div className="mt-6 p-4 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-lg">
             <h4 className="font-bold text-[var(--color-warning)] mb-2">Improvement Hints</h4>
             <ul className="list-disc pl-5 text-sm">
               {scoreData.improvement_hints.map((hint: string, i: number) => (
                 <li key={i}>{hint}</li>
               ))}
             </ul>
          </div>
        )}
      </div>

      <KeywordPanel />

      <div className="flex justify-between mt-4">
        <button onClick={onPrev} className="px-6 py-2 border border-[var(--color-border)] rounded-md font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)]">Back</button>
        <button className="px-6 py-2 bg-[var(--color-accent)] text-white rounded-md font-medium hover:bg-[var(--color-accent-hover)]">Finish</button>
      </div>
    </div>
  );
}
