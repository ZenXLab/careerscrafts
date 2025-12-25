import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Sparkles, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  FileText,
  Upload,
  Clipboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type PanelMode = "ai-suggestions" | "jd-mapping" | "ats-warnings" | null;

interface ContextualPanelProps {
  mode: PanelMode;
  onClose: () => void;
  onApplySuggestion?: (suggestion: string, original: string) => void;
  currentContent?: string;
}

const aiSuggestions = [
  {
    original: "Worked on backend systems",
    improved: "Architected scalable backend systems processing 2M+ daily requests",
    reason: "Added quantifiable impact and action verb"
  },
  {
    original: "Good at teamwork",
    improved: "Led cross-functional teams of 8+ engineers across 3 time zones",
    reason: "Made specific with numbers and context"
  },
  {
    original: "Responsible for API development",
    improved: "Designed and deployed RESTful APIs reducing latency by 40%",
    reason: "Added measurable outcome"
  }
];

const atsWarnings = [
  { type: "warning", message: "Consider adding more keywords from job description" },
  { type: "success", message: "Contact information is complete" },
  { type: "success", message: "Professional summary is well-structured" },
  { type: "warning", message: "Skills section could include more technical keywords" },
  { type: "success", message: "Experience bullets use action verbs" },
];

const ContextualPanel = ({ mode, onClose, onApplySuggestion, currentContent }: ContextualPanelProps) => {
  const [jdInput, setJdInput] = useState("");
  const [jdMode, setJdMode] = useState<"paste" | "upload" | "saved">("paste");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleJdAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  if (!mode) return null;

  return (
    <AnimatePresence>
      <motion.aside 
        className="w-80 border-l border-border/50 bg-card/50 backdrop-blur-sm flex flex-col h-full"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            {mode === "ai-suggestions" && <Sparkles className="w-4 h-4 text-primary" />}
            {mode === "jd-mapping" && <Target className="w-4 h-4 text-primary" />}
            {mode === "ats-warnings" && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
            <span className="font-medium text-sm">
              {mode === "ai-suggestions" && "AI Suggestions"}
              {mode === "jd-mapping" && "JD Mapping"}
              {mode === "ats-warnings" && "ATS Analysis"}
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {mode === "ai-suggestions" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                AI improvements for your resume content. Click to apply.
              </p>
              {aiSuggestions.map((suggestion, idx) => (
                <motion.div
                  key={idx}
                  className="p-3 rounded-lg border border-border bg-background/50 hover:border-primary/30 cursor-pointer transition-all"
                  whileHover={{ scale: 1.01 }}
                  onClick={() => onApplySuggestion?.(suggestion.improved, suggestion.original)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="line-through">{suggestion.original}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-3 h-3 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{suggestion.improved}</span>
                    </div>
                    <p className="text-[10px] text-primary/70 italic">{suggestion.reason}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {mode === "jd-mapping" && (
            <div className="space-y-4">
              {/* Input Mode Tabs */}
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                {[
                  { id: "paste", label: "Paste JD", icon: Clipboard },
                  { id: "upload", label: "Upload", icon: Upload },
                  { id: "saved", label: "Saved", icon: FileText },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setJdMode(tab.id as typeof jdMode)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs transition-all ${
                      jdMode === tab.id 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-3 h-3" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {jdMode === "paste" && (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Paste the job description here..."
                    value={jdInput}
                    onChange={(e) => setJdInput(e.target.value)}
                    rows={8}
                    className="text-xs resize-none"
                  />
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={handleJdAnalyze}
                    disabled={!jdInput.trim() || isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <motion.div
                          className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Target className="w-3 h-3 mr-2" />
                        Analyze & Map
                      </>
                    )}
                  </Button>
                </div>
              )}

              {jdMode === "upload" && (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Upload JD PDF</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">PDF, DOC, DOCX</p>
                </div>
              )}

              {jdMode === "saved" && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">No saved job descriptions yet.</p>
                </div>
              )}

              {/* Help Text */}
              <div className="p-3 bg-primary/5 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary font-medium">How it works:</span> We analyze the job description to identify key skills, responsibilities, and keywords, then map them to your resume sections.
                </p>
              </div>
            </div>
          )}

          {mode === "ats-warnings" && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground mb-4">
                Real-time ATS compatibility analysis
              </p>
              {atsWarnings.map((warning, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 p-3 rounded-lg border ${
                    warning.type === "success" 
                      ? "border-emerald-500/20 bg-emerald-500/5" 
                      : "border-yellow-500/20 bg-yellow-500/5"
                  }`}
                >
                  {warning.type === "success" ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-xs">{warning.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 bg-muted/30">
          <p className="text-[10px] text-muted-foreground text-center">
            {mode === "ai-suggestions" && "You stay in control of every change."}
            {mode === "jd-mapping" && "We aligned your resume with this role."}
            {mode === "ats-warnings" && "ATS checks run automatically."}
          </p>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default ContextualPanel;
