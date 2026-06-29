"use client";

import { useState } from "react";
import { MultiStepForm } from "@/components/builder/MultiStepForm";
import { LivePreviewPanel } from "@/components/builder/LivePreviewPanel";
import { TemplateSelector } from "@/components/builder/TemplateSelector";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { ArrowLeft, Eye, PenLine } from "lucide-react";

export default function NewResumePage() {
  // If the user already has a template in the store, we can bypass the selector
  // but for the sake of the user's request, let's track session state explicitly.
  const [hasStarted, setHasStarted] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  if (!hasStarted) {
    return <TemplateSelector onStartBuilding={() => setHasStarted(true)} />;
  }

  return (
    <div className="flex w-full flex-1 h-[calc(100vh-80px)] lg:h-full overflow-hidden bg-background text-foreground print:h-auto print:overflow-visible print:block relative">
      <div className={`flex-1 overflow-y-auto border-r border-border print:hidden relative flex-col pt-6 ${showMobilePreview ? 'hidden lg:flex' : 'flex'}`}>
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 mb-2 flex justify-between items-center z-50">
          <button 
            onClick={() => setHasStarted(false)}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[var(--color-bg-secondary)]/80 hover:bg-[var(--color-bg-secondary)] backdrop-blur-md rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-xs sm:text-sm font-semibold transition-all hover:-translate-x-1 shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.1)] print:hidden"
          >
            <ArrowLeft size={16} /> <span className="hidden sm:inline">Change Template</span>
          </button>
          
          <button 
            onClick={() => setShowMobilePreview(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/20 text-xs font-semibold"
          >
            <Eye size={16} /> Preview
          </button>
        </div>
        <MultiStepForm />
      </div>
      
      <div className={`${showMobilePreview ? 'block w-full fixed inset-0 z-[100] h-screen overflow-y-auto' : 'hidden lg:block w-[800px] border-l'} border-border bg-gray-50 dark:bg-[#08040d] print:block print:w-full print:absolute print:left-0 print:top-0 print:border-none print:bg-white print:dark:bg-white`}>
        {showMobilePreview && (
          <div className="lg:hidden sticky top-0 left-0 right-0 z-50 p-4 bg-[var(--color-bg-primary)] border-b border-white/10 flex justify-end shadow-md">
            <button 
              onClick={() => setShowMobilePreview(false)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 rounded-lg text-sm font-bold"
            >
              <PenLine size={16} /> Back to Edit
            </button>
          </div>
        )}
        <LivePreviewPanel />
      </div>
    </div>
  );
}
