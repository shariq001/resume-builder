"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";

export function WorkExperience({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { formData, updateFormData } = useResumeStore();
  const [experiences, setExperiences] = useState<any[]>(formData.experience || []);
  const [errors, setErrors] = useState<any[]>([]);

  const handleAdd = () => {
    if (experiences.length >= 10) return;
    setExperiences([...experiences, { currentlyWorking: false }]);
    setErrors([...errors, {}]);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const newExp = [...experiences];
    newExp[index][field] = value;

    if (field === "currentlyWorking" && value === true) {
      delete newExp[index].endDate;
    }
    
    setExperiences(newExp);
  };

  const handleNext = () => {
    const newErrors = experiences.map(exp => {
      const err: any = {};
      if (!exp.jobTitle) err.jobTitle = "Required";
      if (!exp.organization) err.organization = "Required";
      if (!exp.startDate) err.startDate = "Required";
      if (!exp.currentlyWorking && !exp.endDate) err.endDate = "Required";
      return err;
    });

    if (newErrors.some(err => Object.keys(err).length > 0)) {
      setErrors(newErrors);
      return;
    }

    updateFormData("experience", experiences);
    onNext();
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
      
      {experiences.map((exp, index) => (
        <div key={index} className="p-4 border border-border rounded-lg flex flex-col gap-3 relative">
           <button 
             onClick={() => setExperiences(experiences.filter((_, i) => i !== index))}
             className="absolute top-2 right-2 text-red-500 hover:bg-red-500/10 p-1 rounded"
           >
             ✕
           </button>
           <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-sm font-semibold opacity-80 block mb-1">Job Title *</label>
                <input value={exp.jobTitle || ""} onChange={(e) => handleChange(index, "jobTitle", e.target.value)} className="w-full p-2 border rounded border-border bg-transparent" />
                {errors[index]?.jobTitle && <span className="text-red-500 text-xs">Required</span>}
             </div>
             <div>
                <label className="text-sm font-semibold opacity-80 block mb-1">Organization *</label>
                <input value={exp.organization || ""} onChange={(e) => handleChange(index, "organization", e.target.value)} className="w-full p-2 border rounded border-border bg-transparent" />
                {errors[index]?.organization && <span className="text-red-500 text-xs">Required</span>}
             </div>
             <div>
                <label className="text-sm font-semibold opacity-80 block mb-1">Start Date *</label>
                <input type="month" value={exp.startDate || ""} onChange={(e) => handleChange(index, "startDate", e.target.value)} className="w-full p-2 border rounded border-border bg-transparent" />
                {errors[index]?.startDate && <span className="text-red-500 text-xs">Required</span>}
             </div>
             <div>
                <label className="text-sm font-semibold opacity-80 block mb-1">End Date {exp.currentlyWorking ? "" : "*"}</label>
                <input type="month" value={exp.endDate || ""} disabled={exp.currentlyWorking} onChange={(e) => handleChange(index, "endDate", e.target.value)} className="w-full p-2 border rounded border-border bg-transparent disabled:opacity-30" />
                {errors[index]?.endDate && <span className="text-red-500 text-xs">Required</span>}
             </div>
             <div className="col-span-2 flex items-center gap-2 mt-2">
                <input type="checkbox" checked={exp.currentlyWorking || false} onChange={(e) => handleChange(index, "currentlyWorking", e.target.checked)} className="w-4 h-4 accent-primary" />
                <label className="text-sm">I currently work here</label>
             </div>
           </div>
        </div>
      ))}

      {experiences.length < 10 && (
        <button onClick={handleAdd} className="border border-dashed border-primary text-primary py-3 rounded-lg hover:bg-primary/5 font-medium transition-colors">
          + Add Experience
        </button>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={() => { updateFormData("experience", experiences); onPrev(); }} className="border border-border text-foreground px-6 py-2 rounded-lg font-semibold hover:bg-border/50 transition-colors">Back</button>
        <button onClick={handleNext} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors">Next</button>
      </div>
    </div>
  );
}
