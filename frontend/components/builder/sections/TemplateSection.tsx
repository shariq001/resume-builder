"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";
import { LayoutTemplate } from "lucide-react";

export function TemplateSection({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { formData, updateFormData } = useResumeStore();
  const currentTemplate = formData.template || "modern";

  const templates = [
    { id: "modern", name: "Modern Neon", description: "Sleek and vibrant, perfect for tech roles." },
    { id: "classic", name: "Classic Professional", description: "Clean, traditional layout for formal industries." },
    { id: "minimal", name: "Minimalist", description: "Focus completely on content with zero distractions." }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2"><LayoutTemplate className="text-primary" /> Select Template</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <div 
            key={tpl.id}
            onClick={() => updateFormData("template", tpl.id)}
            className={`cursor-pointer rounded-xl border-2 p-5 transition-all ${currentTemplate === tpl.id ? 'border-primary bg-primary/10 shadow-[0_0_15px_var(--color-accent)]' : 'border-border bg-background hover:border-primary/50'}`}
          >
            <div className="h-32 bg-secondary/50 rounded-lg mb-4 flex items-center justify-center border border-border overflow-hidden relative">
                {/* Mockup preview of template */}
                <div className={`w-3/4 h-3/4 bg-background shadow-sm rounded p-2 ${tpl.id === 'modern' ? 'border border-primary' : 'border border-muted'}`}>
                    <div className="h-2 w-1/3 bg-foreground/80 mb-2 rounded"></div>
                    <div className="h-1 w-full bg-muted/40 mb-1 rounded"></div>
                    <div className="h-1 w-2/3 bg-muted/40 mb-1 rounded"></div>
                    <div className="h-1 w-3/4 bg-muted/40 mb-1 rounded"></div>
                </div>
            </div>
            <h3 className="font-bold text-lg">{tpl.name}</h3>
            <p className="text-xs text-muted mt-1">{tpl.description}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8 border-t border-border pt-4">
        <button onClick={onPrev} className="px-6 py-2 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors">Back</button>
        <button onClick={onNext} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-[0_0_10px_var(--color-primary)]">Finish</button>
      </div>
    </div>
  );
}
