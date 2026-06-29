import { create } from "zustand";

export interface ResumeState {
    resumeId: string | null;
    formData: any;
    saveStatus: "saved" | "saving" | "error" | "idle";
    lastSaved: Date | null;
    
    setResumeId: (id: string) => void;
    updateFormData: (section: string, data: any) => void;
    saveResumeToServer: () => Promise<void>;
}

let timeoutId: NodeJS.Timeout | null = null;

export const useResumeStore = create<ResumeState>((set, get) => ({
    resumeId: null,
    formData: {
        contact: {},
        summary: "",
        experience: [],
        education: [],
        certifications: [],
        projects: [],
        skills: []
    },
    saveStatus: "idle",
    lastSaved: null,
    
    setResumeId: (id) => set({ resumeId: id }),
    
    updateFormData: (section, data) => {
        set((state) => ({
            formData: { ...state.formData, [section]: data },
            saveStatus: "saving"
        }));
        
        const { resumeId, formData } = get();
        
        if (timeoutId) clearTimeout(timeoutId);
        
        timeoutId = setTimeout(async () => {
            if (resumeId) {
                try {
                    const token = sessionStorage.getItem("access_token");
                    if (!token) return;
                    
                    const templateMap: Record<string, number> = { "modern": 1, "classic": 2, "minimal": 3 };
                    const template_id = templateMap[formData.template] || 1;

                    await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}`}/api/v1/resumes/" + resumeId, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ form_data: formData, template_id, save_version: true })
                    });
                    set({ saveStatus: "saved", lastSaved: new Date() });
                } catch (error) {
                    set({ saveStatus: "error" });
                }
            } else {
                set({ saveStatus: "idle" });
            }
        }, 3000);
    },

    saveResumeToServer: async () => {
        const { formData, resumeId } = get();
        const token = sessionStorage.getItem("access_token");
        if (!token) return;

        const templateMap: Record<string, number> = { "modern": 1, "classic": 2, "minimal": 3 };
        const template_id = templateMap[formData.template] || 1;

        set({ saveStatus: "saving" });
        try {
            if (resumeId) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}`}/api/v1/resumes/" + resumeId, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ form_data: formData, template_id, save_version: true })
                });
            } else {
                const prefixes = ["Creative", "Professional", "Dynamic", "Stellar", "Modern", "Classic", "Premium"];
                const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
                const newTitle = `${randomPrefix} Resume`;

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}`}/api/v1/resumes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title: newTitle,
                        template_id: template_id
                    })
                });
                if (res.ok) {
                    const newResume = await res.json();
                    set({ resumeId: newResume.id });
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}`}/api/v1/resumes/" + newResume.id, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ form_data: formData, template_id, save_version: true })
                    });
                }
            }
            set({ saveStatus: "saved", lastSaved: new Date() });
        } catch (e) {
            set({ saveStatus: "error" });
        }
    }
}));
