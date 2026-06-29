"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, LayoutTemplate } from "lucide-react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { ClassicTemplate } from "../templates/ClassicTemplate";
import { ModernTemplate } from "../templates/ModernTemplate";
import { MinimalTemplate } from "../templates/MinimalTemplate";

const DUMMY_DATA = {
  contact: { fullName: "Jane Doe", jobTitle: "Senior Software Engineer", email: "jane.doe@example.com", phone: "(555) 123-4567", location: "San Francisco, CA" },
  summary: "Innovative Software Engineer with 5+ years of experience in building scalable web applications. Passionate about clean UI/UX and high-performance backend systems. Proven track record of leading cross-functional teams to deliver exceptional digital products.",
  experience: [
    { title: "Senior Frontend Developer", company: "Tech Innovators Inc.", startDate: "2021-03-01", endDate: "", isCurrentJob: true, description: "• Spearheaded the migration to React 18, improving render times by 40%.\n• Managed a team of 5 engineers to deliver the new flagship enterprise dashboard." },
    { title: "Web Developer", company: "Creative Solutions LLC", startDate: "2018-06-01", endDate: "2021-02-01", isCurrentJob: false, description: "• Built responsive landing pages with Next.js and Tailwind.\n• Integrated third-party payment gateways handling $1M+ in transactions." }
  ],
  education: [
    { degree: "B.S. in Computer Science", school: "University of Technology", startDate: "2014-09-01", endDate: "2018-05-01", isCurrentStudy: false, gpa: "3.8" }
  ],
  certifications: [
    { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2022-10-15", link: "https://aws.amazon.com" }
  ],
  projects: [
    { name: "High-Traffic E-Commerce Platform", tools: "Next.js, Node, PostgreSQL", description: "Built a robust e-commerce architecture supporting 10k+ concurrent active users." }
  ],
  skills: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Tailwind CSS", "PostgreSQL", "AWS"]
};

const TEMPLATES = [
  { id: "modern", name: "Modern Neon", description: "Sleek, vibrant, and perfectly balanced. Ideal for tech and creative roles.", component: ModernTemplate },
  { id: "classic", name: "Classic Professional", description: "A clean, traditional layout that appeals to corporate and formal industries.", component: ClassicTemplate },
  { id: "minimal", name: "Minimalist Focus", description: "Zero distractions. Focus completely on your content with this elegant two-column design.", component: MinimalTemplate }
];

export function TemplateSelector({ onStartBuilding }: { onStartBuilding: () => void }) {
  const { updateFormData } = useResumeStore();
  const [previewId, setPreviewId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    updateFormData("template", id);
    onStartBuilding();
  };

  if (previewId) {
    const activeTemplate = TEMPLATES.find(t => t.id === previewId);
    const TemplateComponent = activeTemplate?.component || ModernTemplate;

    return (
      <div className="w-full min-h-screen bg-[#08040d] flex flex-col items-center py-10 relative">
        {/* Neon glowing bg effects */}
        <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary blur-[150px] rounded-full pointer-events-none mix-blend-screen opacity-20" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-primary-alt blur-[150px] rounded-full pointer-events-none mix-blend-screen opacity-10" />

        <div className="w-full max-w-[800px] flex justify-between items-center mb-8 px-4 relative z-10">
          <button 
            onClick={() => setPreviewId(null)}
            className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-md transition-colors"
          >
            <ArrowLeft size={18} /> Back to Templates
          </button>
          
          <button 
            onClick={() => handleSelect(previewId)}
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary-hover px-6 py-2 rounded-lg font-bold shadow-[0_0_15px_var(--color-primary)] transition-all"
          >
            Start Building <ArrowRight size={18} />
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-[800px] min-h-[1131px] shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded bg-white overflow-hidden relative z-10"
        >
          <TemplateComponent data={DUMMY_DATA} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#08040d] relative overflow-hidden flex flex-col items-center justify-center p-8">
      {/* Cyberpunk Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f163d_1px,transparent_1px),linear-gradient(to_bottom,#1f163d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>
      
      {/* Orbs */}
      <div className="absolute top-[-20%] left-[20%] w-[40vw] h-[40vw] bg-primary blur-[150px] rounded-full pointer-events-none mix-blend-screen opacity-10" />
      <div className="absolute bottom-[-20%] right-[10%] w-[40vw] h-[40vw] bg-primary-alt blur-[150px] rounded-full pointer-events-none mix-blend-screen opacity-10" />

      <div className="relative z-10 w-full max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Choose Your Blueprint
          </h1>
          <p className="text-xl text-gray-400">Select a beautifully crafted template to begin your journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEMPLATES.map((tpl, index) => (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15, type: "spring" }}
              className="group relative"
            >
              {/* Glowing animated border wrapper */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-primary-alt/50 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative bg-[#0A0514]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 h-full flex flex-col transition-all duration-300 group-hover:-translate-y-2">
                
                {/* Visual Mockup inside card */}
                <div className="w-full aspect-[1/1.2] bg-white rounded-xl mb-6 shadow-inner relative overflow-hidden group-hover:shadow-[0_0_20px_var(--color-primary)] transition-all duration-300 flex items-center justify-center p-2">
                  <div className="w-full h-full border border-gray-200 rounded-lg bg-gray-50 p-4 opacity-70 group-hover:opacity-100 transition-opacity">
                     <div className="h-4 w-1/2 bg-gray-300 rounded mb-4"></div>
                     <div className="h-2 w-full bg-gray-200 rounded mb-2"></div>
                     <div className="h-2 w-full bg-gray-200 rounded mb-2"></div>
                     <div className="h-2 w-3/4 bg-gray-200 rounded mb-6"></div>
                     <div className="h-3 w-1/3 bg-gray-300 rounded mb-3"></div>
                     <div className="h-2 w-full bg-gray-200 rounded mb-2"></div>
                     <div className="h-2 w-5/6 bg-gray-200 rounded mb-2"></div>
                  </div>
                  
                  {/* Hover Overlay for Buttons */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-6">
                    <button 
                      onClick={() => setPreviewId(tpl.id)}
                      className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105"
                    >
                      <Eye size={18} /> Preview Layout
                    </button>
                    <button 
                      onClick={() => handleSelect(tpl.id)}
                      className="w-full bg-primary text-white hover:bg-primary-hover py-3 rounded-xl font-bold shadow-[0_0_15px_var(--color-primary)] flex items-center justify-center gap-2 transition-transform hover:scale-105"
                    >
                      <LayoutTemplate size={18} /> Start Building
                    </button>
                  </div>
                </div>

                <div className="mt-auto">
                  <h2 className="text-2xl font-bold text-white mb-2">{tpl.name}</h2>
                  <p className="text-sm text-gray-400 leading-relaxed">{tpl.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
