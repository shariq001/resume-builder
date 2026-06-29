"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Award, Pencil, Check } from "lucide-react";

export function CertificationsSection({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { formData, updateFormData } = useResumeStore();
  const certifications = formData.certifications || [];

  const [hasCerts, setHasCerts] = useState<boolean | null>(certifications.length > 0 ? true : null);
  const [isAdding, setIsAdding] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [current, setCurrent] = useState({ name: "", issuer: "", date: "", link: "", description: "" });
  const [error, setError] = useState("");

  const handleStartAdding = () => {
    setCurrent({ name: "", issuer: "", date: "", link: "", description: "" });
    setEditIndex(null);
    setIsAdding(true);
    setError("");
  };

  const handleStartEdit = (index: number) => {
    setCurrent(certifications[index]);
    setEditIndex(index);
    setIsAdding(true);
    setError("");
  };

  const handleSave = () => {
    if (!current.name || !current.issuer || !current.date) {
      setError("Please fill all fields (Name, Issuer, Date).");
      return;
    }
    const updated = [...certifications];
    if (editIndex !== null) {
      updated[editIndex] = current;
    } else {
      updated.push(current);
    }
    updateFormData("certifications", updated);
    setIsAdding(false);
    setEditIndex(null);
  };

  const handleRemove = (index: number) => {
    const updated = [...certifications];
    updated.splice(index, 1);
    updateFormData("certifications", updated);
    if (updated.length === 0) setHasCerts(null);
  };

  const handleNext = () => {
    if (hasCerts && certifications.length === 0) {
      setError("Please add at least one certification or select 'No certifications'.");
      return;
    }
    onNext();
  };

  if (hasCerts === null) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Award className="text-primary" /> Certifications</h2>
        <div className="bg-secondary/20 p-8 rounded-xl border border-border text-center flex flex-col items-center gap-6">
          <p className="text-lg">Do you have any certifications?</p>
          <div className="flex gap-4">
            <button onClick={() => { setHasCerts(true); setIsAdding(true); }} className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors">Yes, I have certifications</button>
            <button onClick={() => { setHasCerts(false); updateFormData("certifications", []); }} className="px-6 py-3 border-2 border-border hover:border-primary/50 rounded-lg font-bold transition-colors">No certifications</button>
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
        <h2 className="text-2xl font-bold flex items-center gap-2"><Award className="text-primary" /> Certifications</h2>
        {!isAdding && hasCerts && (
          <button onClick={handleStartAdding} className="text-primary font-bold hover:underline flex items-center gap-1">
            <Plus size={16} /> Add Certification
          </button>
        )}
      </div>

      {!isAdding && certifications.length === 0 && hasCerts === false && (
        <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 text-center">
          <p className="text-muted">You selected no certifications. You can continue to the next step.</p>
          <button onClick={() => setHasCerts(null)} className="mt-4 text-sm text-primary hover:underline">Change my answer</button>
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {!isAdding && certifications.map((cert: any, i: number) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 border border-border bg-secondary/30 rounded-xl relative group"
            >
              <h3 className="font-bold text-lg">{cert.name}</h3>
              {cert.link && <a href={cert.link} target="_blank" rel="noreferrer" className="text-primary text-xs hover:underline">{cert.link}</a>}
              <p className="text-muted text-sm">{cert.issuer} {cert.date ? `• ${cert.date}` : ""}</p>
              {cert.description && <p className="mt-2 text-sm whitespace-pre-wrap">{cert.description}</p>}
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
              <label className="text-xs font-bold opacity-80 mb-1 block">Certification Name *</label>
              <input 
                value={current.name} 
                onChange={e => setCurrent({...current, name: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors" 
              />
            </div>
            <div>
              <label className="text-xs font-bold opacity-80 mb-1 block">Issuing Organization *</label>
              <input 
                value={current.issuer} 
                onChange={e => setCurrent({...current, issuer: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors" 
              />
            </div>
            <div>
              <label className="text-xs font-bold opacity-80 mb-1 block">Date Earned *</label>
              <input 
                type="date"
                value={current.date} 
                onChange={e => setCurrent({...current, date: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors [color-scheme:dark]" 
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold opacity-80 mb-1 block">Certification Link (Optional)</label>
              <input 
                value={current.link || ""} 
                onChange={e => setCurrent({...current, link: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors"
                placeholder="e.g. https://credly.com/..."
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold opacity-80 mb-1 block">Short Description (Optional)</label>
              <textarea 
                value={current.description || ""} 
                onChange={e => setCurrent({...current, description: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors min-h-[80px]"
                placeholder="Briefly describe what this certification covers..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            {certifications.length > 0 && (
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">Cancel</button>
            )}
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors flex items-center gap-2">
              <Check size={16} /> Save Certification
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
