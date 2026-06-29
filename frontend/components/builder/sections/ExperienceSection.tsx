"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Briefcase, Pencil, Check } from "lucide-react";

export function ExperienceSection({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { formData, updateFormData } = useResumeStore();
  const experience = formData.experience || [];

  const [hasExperience, setHasExperience] = useState<boolean | null>(experience.length > 0 ? true : null);
  const [isAdding, setIsAdding] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [current, setCurrent] = useState({ title: "", company: "", startDate: "", endDate: "", description: "", isCurrentJob: false });
  const [error, setError] = useState("");

  const handleStartAdding = () => {
    setCurrent({ title: "", company: "", startDate: "", endDate: "", description: "", isCurrentJob: false });
    setEditIndex(null);
    setIsAdding(true);
    setError("");
  };

  const handleStartEdit = (index: number) => {
    setCurrent(experience[index]);
    setEditIndex(index);
    setIsAdding(true);
    setError("");
  };

  const handleSave = () => {
    if (!current.title || !current.company || !current.startDate) {
      setError("Please fill all mandatory fields (Title, Company, Start Date).");
      return;
    }
    if (!current.isCurrentJob && !current.endDate) {
      setError("Please provide an end date, or check 'I am currently working here'.");
      return;
    }

    const updated = [...experience];
    if (editIndex !== null) {
      updated[editIndex] = current;
    } else {
      updated.push(current);
    }
    updateFormData("experience", updated);
    setIsAdding(false);
    setEditIndex(null);
  };

  const handleRemove = (index: number) => {
    const updated = [...experience];
    updated.splice(index, 1);
    updateFormData("experience", updated);
    if (updated.length === 0) setHasExperience(null);
  };

  const handleNext = () => {
    if (hasExperience && experience.length === 0) {
      setError("Please add at least one experience or select 'No experience'.");
      return;
    }
    onNext();
  };

  if (hasExperience === null) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Briefcase className="text-primary" /> Work Experience</h2>
        <div className="bg-secondary/20 p-8 rounded-xl border border-border text-center flex flex-col items-center gap-6">
          <p className="text-lg">Do you have any work experience?</p>
          <div className="flex gap-4">
            <button onClick={() => { setHasExperience(true); setIsAdding(true); }} className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors">Yes, I have experience</button>
            <button onClick={() => { setHasExperience(false); updateFormData("experience", []); }} className="px-6 py-3 border-2 border-border hover:border-primary/50 rounded-lg font-bold transition-colors">No, I am a fresher</button>
          </div>
        </div>
        <div className="flex justify-between mt-8 border-t border-border pt-4">
          <button onClick={onPrev} className="px-6 py-2 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors">Back</button>
          <button onClick={handleNext} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors">Next</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Briefcase className="text-primary" /> Work Experience</h2>
        {!isAdding && hasExperience && (
          <button onClick={handleStartAdding} className="text-primary font-bold hover:underline flex items-center gap-1">
            <Plus size={16} /> Add Experience
          </button>
        )}
      </div>

      {!isAdding && experience.length === 0 && hasExperience === false && (
        <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 text-center">
          <p className="text-muted">You selected no experience. You can continue to the next step.</p>
          <button onClick={() => setHasExperience(null)} className="mt-4 text-sm text-primary hover:underline">Change my answer</button>
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {!isAdding && experience.map((exp: any, i: number) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 border border-border bg-secondary/30 rounded-xl relative group"
            >
              <h3 className="font-bold text-lg">{exp.title}</h3>
              <p className="text-muted text-sm">{exp.company} • {exp.startDate} to {exp.isCurrentJob ? "Present" : exp.endDate}</p>
              <p className="mt-2 text-sm whitespace-pre-wrap">{exp.description}</p>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => handleStartEdit(i)} className="text-primary hover:text-primary-hover bg-background p-1.5 rounded-md border border-border shadow-sm"><Pencil size={16} /></button>
                <button onClick={() => handleRemove(i)} className="text-red-500 hover:text-red-600 bg-background p-1.5 rounded-md border border-border shadow-sm"><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isAdding && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border border-primary/30 p-5 rounded-xl bg-primary/5 space-y-4">
          {error && <div className="text-error text-sm font-semibold mb-2 bg-error/10 p-3 rounded-md border border-error/30">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold opacity-80 mb-1 block">Job Title *</label>
              <input 
                value={current.title} 
                onChange={e => setCurrent({...current, title: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors" 
              />
            </div>
            <div>
              <label className="text-xs font-bold opacity-80 mb-1 block">Company *</label>
              <input 
                value={current.company} 
                onChange={e => setCurrent({...current, company: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors" 
              />
            </div>
            <div>
              <label className="text-xs font-bold opacity-80 mb-1 block">Start Date *</label>
              <input 
                type="date"
                value={current.startDate} 
                onChange={e => setCurrent({...current, startDate: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors [color-scheme:dark]" 
              />
            </div>
            <div>
              <label className="text-xs font-bold opacity-80 mb-1 block">End Date {current.isCurrentJob ? '(Disabled)' : '*'}</label>
              <input 
                type="date"
                disabled={current.isCurrentJob}
                value={current.isCurrentJob ? "" : current.endDate} 
                onChange={e => setCurrent({...current, endDate: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors disabled:opacity-50 [color-scheme:dark]" 
              />
            </div>
            <div className="col-span-2 flex items-center gap-2 mt-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input 
                  type="checkbox" 
                  checked={current.isCurrentJob} 
                  onChange={e => setCurrent({...current, isCurrentJob: e.target.checked})} 
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary"
                />
                I am currently working here
              </label>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold opacity-80 mb-1 block">Description</label>
              <textarea 
                value={current.description} 
                onChange={e => setCurrent({...current, description: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors min-h-[100px]" 
                placeholder="Describe your achievements..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            {experience.length > 0 && (
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">Cancel</button>
            )}
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors flex items-center gap-2">
              <Check size={16} /> Save Experience
            </button>
          </div>
        </motion.div>
      )}

      <div className="flex justify-between mt-8 border-t border-border pt-4">
        <button onClick={onPrev} className="px-6 py-2 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors">Back</button>
        <button onClick={handleNext} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors">Next</button>
      </div>
    </div>
  );
}
