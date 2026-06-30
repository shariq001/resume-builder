"use client";

import { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";

export function ContactInfo({ onNext }: { onNext: () => void }) {
  const { formData, updateFormData } = useResumeStore();
  const contact = formData.contact || {};
  
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData("contact", { ...contact, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleNext = () => {
    const newErrors: any = {};
    if (!contact.fullName || contact.fullName.length < 2) newErrors.fullName = "Required";
    if (!contact.jobTitle || contact.jobTitle.length < 2) newErrors.jobTitle = "Required";
    if (!contact.email || !/^\S+@\S+\.\S+$/.test(contact.email)) newErrors.email = "Invalid email format";
    if (!contact.phone) newErrors.phone = "Required";
    if (!contact.location) newErrors.location = "Required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold opacity-80 block mb-1">Full Name *</label>
          <input name="fullName" value={contact.fullName || ""} onChange={handleChange} className={`w-full p-2 border rounded bg-transparent ${errors.fullName ? 'border-red-500' : 'border-border'}`} />
          {errors.fullName && <span className="text-red-500 text-xs">{errors.fullName}</span>}
        </div>
        <div>
          <label className="text-sm font-semibold opacity-80 block mb-1">Job Title *</label>
          <input name="jobTitle" value={contact.jobTitle || ""} onChange={handleChange} className={`w-full p-2 border rounded bg-transparent ${errors.jobTitle ? 'border-red-500' : 'border-border'}`} />
          {errors.jobTitle && <span className="text-red-500 text-xs">{errors.jobTitle}</span>}
        </div>
        <div>
          <label className="text-sm font-semibold opacity-80 block mb-1">Email *</label>
          <input name="email" value={contact.email || ""} onChange={handleChange} className={`w-full p-2 border rounded bg-transparent ${errors.email ? 'border-red-500' : 'border-border'}`} />
          {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
        </div>
        <div>
          <label className="text-sm font-semibold opacity-80 block mb-1">Phone *</label>
          <input name="phone" value={contact.phone || ""} onChange={handleChange} className={`w-full p-2 border rounded bg-transparent ${errors.phone ? 'border-red-500' : 'border-border'}`} />
          {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}
        </div>
        <div className="col-span-2">
          <label className="text-sm font-semibold opacity-80 block mb-1">Location *</label>
          <input name="location" value={contact.location || ""} onChange={handleChange} className={`w-full p-2 border rounded bg-transparent ${errors.location ? 'border-red-500' : 'border-border'}`} />
          {errors.location && <span className="text-red-500 text-xs">{errors.location}</span>}
        </div>
        <div>
          <label className="text-sm font-semibold opacity-80 block mb-1">LinkedIn URL <span className="text-xs font-normal opacity-70">(Optional)</span></label>
          <input name="linkedin" value={contact.linkedin || ""} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="w-full p-2 border rounded bg-transparent border-border" />
        </div>
        <div>
          <label className="text-sm font-semibold opacity-80 block mb-1">GitHub URL <span className="text-xs font-normal opacity-70">(Optional)</span></label>
          <input name="github" value={contact.github || ""} onChange={handleChange} placeholder="https://github.com/..." className="w-full p-2 border rounded bg-transparent border-border" />
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button onClick={handleNext} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-hover transition-colors">Next</button>
      </div>
    </div>
  );
}
