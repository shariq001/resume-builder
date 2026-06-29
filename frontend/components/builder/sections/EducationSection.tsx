"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, GraduationCap, Pencil, Check } from "lucide-react";

export function EducationSection({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { formData, updateFormData } = useResumeStore();
  const education = formData.education || [];

  const [isAdding, setIsAdding] = useState(education.length === 0);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [current, setCurrent] = useState({ degree: "", school: "", startDate: "", endDate: "", gpa: "", isCurrentStudy: false });
  const [error, setError] = useState("");

  const handleStartAdding = () => {
    setCurrent({ degree: "", school: "", startDate: "", endDate: "", gpa: "", isCurrentStudy: false });
    setEditIndex(null);
    setIsAdding(true);
    setError("");
  };

  const handleStartEdit = (index: number) => {
    setCurrent(education[index]);
    setEditIndex(index);
    setIsAdding(true);
    setError("");
  };

  const handleSave = () => {
    if (!current.degree || !current.school || !current.startDate) {
      setError("Please fill all mandatory fields (Degree, School, Start Date).");
      return;
    }
    if (!current.isCurrentStudy && !current.endDate) {
      setError("Please provide an end date, or check 'I am currently studying here'.");
      return;
    }

    const updated = [...education];
    if (editIndex !== null) {
      updated[editIndex] = current;
    } else {
      updated.push(current);
    }
    updateFormData("education", updated);
    setIsAdding(false);
    setEditIndex(null);
  };

  const handleRemove = (index: number) => {
    const updated = [...education];
    updated.splice(index, 1);
    updateFormData("education", updated);
  };

  const handleNext = () => {
    if (education.length === 0) {
      setError("Please add at least one education entry.");
      if (!isAdding) setIsAdding(true);
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2"><GraduationCap className="text-primary" /> Education</h2>
        {!isAdding && (
          <button onClick={handleStartAdding} className="text-primary font-bold hover:underline flex items-center gap-1">
            <Plus size={16} /> Add Education
          </button>
        )}
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {!isAdding && education.map((edu: any, i: number) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 border border-border bg-secondary/30 rounded-xl relative group"
            >
              <h3 className="font-bold text-lg">{edu.degree}</h3>
              <p className="text-muted text-sm">{edu.school} • {edu.startDate} to {edu.isCurrentStudy ? "Present" : edu.endDate}</p>
              {edu.gpa && <p className="mt-1 text-sm font-medium">GPA: {edu.gpa}</p>}
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
            <div className="col-span-2">
              <label className="text-xs font-bold opacity-80 mb-1 block">Degree / Program *</label>
              <input 
                value={current.degree} 
                onChange={e => setCurrent({...current, degree: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors" 
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold opacity-80 mb-1 block">School / University *</label>
              <input 
                value={current.school} 
                onChange={e => setCurrent({...current, school: e.target.value})} 
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
              <label className="text-xs font-bold opacity-80 mb-1 block">End Date {current.isCurrentStudy ? '(Disabled)' : '*'}</label>
              <input 
                type="date"
                disabled={current.isCurrentStudy}
                value={current.isCurrentStudy ? "" : current.endDate} 
                onChange={e => setCurrent({...current, endDate: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors disabled:opacity-50 [color-scheme:dark]" 
              />
            </div>
            <div className="col-span-2 flex items-center gap-2 mt-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input 
                  type="checkbox" 
                  checked={current.isCurrentStudy} 
                  onChange={e => setCurrent({...current, isCurrentStudy: e.target.checked})} 
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary"
                />
                I am currently studying here
              </label>
            </div>
            <div>
              <label className="text-xs font-bold opacity-80 mb-1 block">GPA (Optional)</label>
              <input 
                value={current.gpa} 
                onChange={e => setCurrent({...current, gpa: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors" 
                placeholder="e.g. 3.8/4.0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            {education.length > 0 && (
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">Cancel</button>
            )}
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors flex items-center gap-2">
              <Check size={16} /> Save Education
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
