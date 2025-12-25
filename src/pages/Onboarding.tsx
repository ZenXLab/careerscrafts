import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateId = searchParams.get("template") || "modern-minimal";

  const [formData, setFormData] = useState({
    careerStage: "",
    targetRole: "",
    urgency: "",
    experience: "",
    industry: "",
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleComplete = () => {
    navigate(`/editor?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl sm:text-3xl font-light mb-2">
                Let's take your career <span className="font-serif italic">seriously</span>.
              </h1>
              <p className="text-muted-foreground mb-8">This won't take long. And it might change how recruiters see you.</p>
              <p className="text-xs text-muted-foreground/70 mb-8">No spam. No nonsense. No "download in 2 minutes" promises.</p>
              <Button variant="hero" size="lg" onClick={nextStep} className="w-full">Continue</Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl sm:text-2xl font-light mb-6">Where are you in your career right now?</h2>
              <div className="space-y-3 mb-8">
                {["Student / Fresh Graduate", "Early Career (1-3 years)", "Professional (4-8 years)", "Senior (8-15 years)", "Executive (15+ years)"].map(opt => (
                  <button key={opt} onClick={() => { setFormData({...formData, careerStage: opt}); nextStep(); }}
                    className="w-full p-4 rounded-lg border border-border bg-card text-left hover:border-primary/50 hover:bg-secondary/50 transition-all text-sm sm:text-base">
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl sm:text-2xl font-light mb-6">How urgent is this for you?</h2>
              <p className="text-xs text-muted-foreground mb-6">Being honest helps us help you better.</p>
              <div className="space-y-3 mb-8">
                {["Just exploring", "Actively applying", "Interview coming up", "Emergency mode"].map(opt => (
                  <button key={opt} onClick={() => { setFormData({...formData, urgency: opt}); nextStep(); }}
                    className="w-full p-4 rounded-lg border border-border bg-card text-left hover:border-primary/50 hover:bg-secondary/50 transition-all text-sm sm:text-base">
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl sm:text-2xl font-light mb-2">Got a resume already? <span className="font-serif italic">Good.</span></h2>
              <p className="text-muted-foreground mb-2">We'll rebuild it professionally. Not "edit" it.</p>
              <p className="text-xs text-muted-foreground/70 mb-8">Don't worry. We've seen worse. (And we never judge. We just fix.)</p>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center mb-6 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">Drop PDF, DOC, or DOCX here</p>
              </div>
              <div className="flex gap-3">
                <Button variant="hero-secondary" size="lg" onClick={nextStep} className="flex-1">Skip for now</Button>
                <Button variant="hero" size="lg" onClick={nextStep} className="flex-1">Continue</Button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-emerald/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-light mb-2">You're all set.</h2>
                <p className="text-muted-foreground text-sm">Your resume is ready to be crafted — seen through a recruiter's eyes.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-muted-foreground">Initial ATS Score</span>
                  <span className="text-lg font-semibold text-emerald">Ready to improve</span>
                </div>
                <p className="text-xs text-muted-foreground">Most resumes fail silently. Yours doesn't have to.</p>
              </div>
              <Button variant="hero" size="lg" onClick={handleComplete} className="w-full">Start Crafting</Button>
            </motion.div>
          )}
        </AnimatePresence>

        {step > 1 && step < 5 && (
          <button onClick={prevStep} className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Go back
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default Onboarding;
