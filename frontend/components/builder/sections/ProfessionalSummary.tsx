"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";

export function ProfessionalSummary({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { formData, updateFormData } = useResumeStore();
  const summary = formData.summary || "";
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData("summary", e.target.value);
    if (error) setError("");
  };

  const handleNext = () => {
    if (summary.length < 50 || summary.length > 600) {
      setError("Summary must be between 50 and 600 characters");
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">Professional Summary</h2>
      
      <div>
        <label className="text-sm font-semibold opacity-80 block mb-1">Summary *</label>
        <textarea 
          value={summary} 
          onChange={handleChange} 
          rows={6}
          className={`w-full p-3 border rounded bg-transparent resize-none ${error ? 'border-red-500' : 'border-border'}`} 
        />
        <div className="flex justify-between mt-1">
          <span className="text-red-500 text-xs">{error}</span>
          <span className={`text-xs ${summary.length < 50 || summary.length > 600 ? 'text-red-500' : 'opacity-50'}`}>
            {summary.length} / 600
          </span>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button onClick={onPrev} className="border border-border text-foreground px-6 py-2 rounded-lg font-semibold hover:bg-border/50 transition-colors">Back</button>
        <button onClick={handleNext} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors">Next</button>
      </div>
    </div>
  );
}
