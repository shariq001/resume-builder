"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ContactInfo } from "./sections/ContactInfo";
import { ProfessionalSummary } from "./sections/ProfessionalSummary";
import { FormStepper } from "./FormStepper";

import { ExperienceSection } from "./sections/ExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { CertificationsSection } from "./sections/CertificationsSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { SkillsSection } from "./sections/SkillsSection";
import { TemplateSection } from "./sections/TemplateSection";
import { CompletionScreen } from "./sections/CompletionScreen";

const steps = [
  "Contact Info", "Summary", "Experience", "Education", "Certifications", "Projects", "Skills", "Finish"
];

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Required for modern browsers to show the default warning
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index === currentStep) return;
    setDirection(index > currentStep ? 1 : -1);
    setCurrentStep(index);
  };

  const variants = {
    enter: (direction: number) => ({
      x: shouldReduceMotion ? 0 : (direction > 0 ? 50 : -50),
      opacity: 0
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: shouldReduceMotion ? 0 : (direction > 0 ? -50 : 50),
      opacity: 0
    })
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <ContactInfo onNext={nextStep} />;
      case 1: return <ProfessionalSummary onNext={nextStep} onPrev={prevStep} />;
      case 2: return <ExperienceSection onNext={nextStep} onPrev={prevStep} />;
      case 3: return <EducationSection onNext={nextStep} onPrev={prevStep} />;
      case 4: return <CertificationsSection onNext={nextStep} onPrev={prevStep} />;
      case 5: return <ProjectsSection onNext={nextStep} onPrev={prevStep} />;
      case 6: return <SkillsSection onNext={nextStep} onPrev={prevStep} />;
      case 7: return <CompletionScreen onPrev={prevStep} />;
      default: return (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl">
          <p className="opacity-50">Placeholder for {steps[currentStep]}</p>
          <div className="flex gap-4 mt-4">
             <button onClick={prevStep} className="border border-border px-4 py-2 rounded">Back</button>
             <button onClick={nextStep} className="bg-primary text-white px-4 py-2 rounded">Next</button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="relative min-h-full w-full overflow-hidden p-6 bg-background transition-colors duration-500">
      {/* Cyberpunk Neon Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f163d_1px,transparent_1px),linear-gradient(to_bottom,#1f163d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      {/* Animated Neon Laser Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <motion.path
          d="M -100 100 Q 300 50 800 400 T 1500 200"
          stroke="var(--color-accent)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 1500 600 Q 1000 700 500 300 T -100 400"
          stroke="var(--color-accent-alt)"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 1 }}
        />
      </svg>

      {/* Ambient glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary blur-[150px] rounded-full pointer-events-none mix-blend-screen opacity-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary-alt blur-[150px] rounded-full pointer-events-none mix-blend-screen opacity-10" />

      <div className="w-full max-w-2xl mx-auto relative z-10">
        <FormStepper currentStep={currentStep} steps={steps} onStepClick={goToStep} />
        
        <div className="mt-8 relative min-h-[500px]">
          {/* Animated glowing border wrapper */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary-alt/30 to-primary/30 rounded-[2rem] blur-xl opacity-20 pointer-events-none"></div>
          
          <div className="relative bg-[#0A0514]/70 backdrop-blur-2xl border border-primary/20 shadow-2xl shadow-primary/10 rounded-[2rem] p-5 sm:p-8 overflow-hidden min-h-[500px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
