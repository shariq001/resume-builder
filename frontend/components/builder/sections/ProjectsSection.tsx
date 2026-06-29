"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, FolderGit2, Pencil, Check } from "lucide-react";

export function ProjectsSection({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { formData, updateFormData } = useResumeStore();
  const projects = formData.projects || [];

  const [hasProjects, setHasProjects] = useState<boolean | null>(projects.length > 0 ? true : null);
  const [isAdding, setIsAdding] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [current, setCurrent] = useState({ name: "", description: "", link: "", tools: "" });
  const [error, setError] = useState("");

  const handleStartAdding = () => {
    setCurrent({ name: "", description: "", link: "", tools: "" });
    setEditIndex(null);
    setIsAdding(true);
    setError("");
  };

  const handleStartEdit = (index: number) => {
    setCurrent(projects[index]);
    setEditIndex(index);
    setIsAdding(true);
    setError("");
  };

  const handleSave = () => {
    if (!current.name || !current.description) {
      setError("Please fill all mandatory fields (Project Name, Description).");
      return;
    }
    const updated = [...projects];
    if (editIndex !== null) {
      updated[editIndex] = current;
    } else {
      updated.push(current);
    }
    updateFormData("projects", updated);
    setIsAdding(false);
    setEditIndex(null);
  };

  const handleRemove = (index: number) => {
    const updated = [...projects];
    updated.splice(index, 1);
    updateFormData("projects", updated);
    if (updated.length === 0) setHasProjects(null);
  };

  const handleNext = () => {
    if (hasProjects && projects.length === 0) {
      setError("Please add at least one project or select 'No projects'.");
      return;
    }
    onNext();
  };

  if (hasProjects === null) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><FolderGit2 className="text-primary" /> Projects</h2>
        <div className="bg-secondary/20 p-8 rounded-xl border border-border text-center flex flex-col items-center gap-6">
          <p className="text-lg">Do you have any projects to add?</p>
          <div className="flex gap-4">
            <button onClick={() => { setHasProjects(true); setIsAdding(true); }} className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-hover transition-colors">Yes, I have projects</button>
            <button onClick={() => { setHasProjects(false); updateFormData("projects", []); }} className="px-6 py-3 border-2 border-border hover:border-primary/50 rounded-lg font-bold transition-colors">No projects</button>
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
        <h2 className="text-2xl font-bold flex items-center gap-2"><FolderGit2 className="text-primary" /> Projects</h2>
        {!isAdding && hasProjects && (
          <button onClick={handleStartAdding} className="text-primary font-bold hover:underline flex items-center gap-1">
            <Plus size={16} /> Add Project
          </button>
        )}
      </div>

      {!isAdding && projects.length === 0 && hasProjects === false && (
        <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 text-center">
          <p className="text-muted">You selected no projects. You can continue to the next step.</p>
          <button onClick={() => setHasProjects(null)} className="mt-4 text-sm text-primary hover:underline">Change my answer</button>
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {!isAdding && projects.map((proj: any, i: number) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 border border-border bg-secondary/30 rounded-xl relative group"
            >
              <h3 className="font-bold text-lg">{proj.name}</h3>
              {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-primary text-sm hover:underline">{proj.link}</a>}
              {proj.tools && <p className="text-muted text-xs mt-1 font-mono">{proj.tools}</p>}
              <p className="mt-2 text-sm whitespace-pre-wrap">{proj.description}</p>
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
              <label className="text-xs font-bold opacity-80 mb-1 block">Project Name *</label>
              <input 
                value={current.name} 
                onChange={e => setCurrent({...current, name: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors" 
              />
            </div>
            <div>
              <label className="text-xs font-bold opacity-80 mb-1 block">Project Link (Optional)</label>
              <input 
                value={current.link} 
                onChange={e => setCurrent({...current, link: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors" 
                placeholder="e.g. https://github.com/..."
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold opacity-80 mb-1 block">Tools/Technologies Used</label>
              <input 
                value={current.tools} 
                onChange={e => setCurrent({...current, tools: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors font-mono text-sm" 
                placeholder="e.g. React, Node.js, PostgreSQL"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold opacity-80 mb-1 block">Description *</label>
              <textarea 
                value={current.description} 
                onChange={e => setCurrent({...current, description: e.target.value})} 
                className="w-full p-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary transition-colors min-h-[100px]" 
                placeholder="Describe what you built and the impact..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            {projects.length > 0 && (
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">Cancel</button>
            )}
            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-hover transition-colors flex items-center gap-2">
              <Check size={16} /> Save Project
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
