import { motion } from "framer-motion";
import { CheckCircle, Download, Save, Loader2 } from "lucide-react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useState } from "react";

export function CompletionScreen({ onPrev }: { onPrev: () => void }) {
  const { saveResumeToServer, saveStatus } = useResumeStore();
  const { isAuthenticated } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await saveResumeToServer();
    setIsSaving(false);
    alert("Resume saved to your profile!");
  };
  return (
    <div className="flex flex-col items-center justify-center text-center h-full min-h-[400px] gap-6">
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_var(--color-primary)]">
          <CheckCircle size={50} className="text-primary" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-extrabold mb-3">You're All Set!</h2>
        <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
          Your resume is now fully completed with all your details. We've instantly mapped everything into your selected template. 
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-6 border border-primary/30 bg-primary/5 rounded-2xl max-w-sm w-full"
      >
        <p className="text-sm font-semibold mb-4">What's next?</p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm text-left">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">1</div>
            <p>Review the <span className="font-bold text-primary">Live Preview</span> on the right.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-left">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">2</div>
            <p>Make any final adjustments by jumping back to previous steps.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-left">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">3</div>
            <p>Click <span className="font-bold text-primary inline-flex items-center gap-1"><Download size={14}/> Download</span> at the top right when you're ready!</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full flex justify-between mt-4 border-t border-border pt-4 px-2"
      >
        <button onClick={onPrev} className="px-6 py-2 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors">Go Back</button>
        {isAuthenticated && (
          <button 
            onClick={handleSave} 
            disabled={isSaving || saveStatus === "saving"}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-[var(--color-accent)] text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {isSaving || saveStatus === "saving" ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save to Profile
          </button>
        )}
      </motion.div>
    </div>
  );
}
