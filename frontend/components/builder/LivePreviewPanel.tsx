"use client";

import { useResumeStore } from "@/lib/store/useResumeStore";
import { ClassicTemplate } from "../templates/ClassicTemplate";
import { ModernTemplate } from "../templates/ModernTemplate";
import { MinimalTemplate } from "../templates/MinimalTemplate";
import { useEffect, useState, useRef } from "react";
import { Download, FileText, FileDown, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LivePreviewPanel() {
  const { formData, saveStatus } = useResumeStore();
  const [debouncedData, setDebouncedData] = useState(formData);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedData(formData);
    }, 300);
    return () => clearTimeout(handler);
  }, [formData]);

  const templateId = debouncedData.template || "modern";

  const renderTemplate = () => {
    switch(templateId) {
      case "classic": return <ClassicTemplate data={debouncedData} />;
      case "modern": return <ModernTemplate data={debouncedData} />;
      case "minimal": return <MinimalTemplate data={debouncedData} />;
      default: return <ModernTemplate data={debouncedData} />;
    }
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-[#08040d] p-8 overflow-y-auto flex flex-col items-center relative print:p-0 print:bg-white print:dark:bg-white">
      <div className="w-full max-w-[800px] flex justify-between items-center mb-6 relative z-50 print:hidden">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold uppercase tracking-wider opacity-50 text-gray-500">Live Preview</span>
          <div className="flex items-center gap-2 text-sm font-medium">
            {saveStatus === 'saving' && <span className="text-primary animate-pulse">Syncing...</span>}
            {saveStatus === 'saved' && <span className="text-green-500">Saved</span>}
          </div>
        </div>

        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/30 hover:bg-primary-hover hover:-translate-y-0.5 transition-all"
        >
          <FileText size={18} />
          Download PDF
        </button>
      </div>
      
      <div id="resume-preview-content" className="w-full max-w-[800px] min-h-[1131px] shadow-2xl shadow-black/20 rounded-md bg-white overflow-hidden transform origin-top transition-all hover:shadow-3xl print:shadow-none print:m-0 print:p-0 print:max-w-none print:w-full print:min-h-0 relative z-10">
        {renderTemplate()}
      </div>
    </div>
  );
}
