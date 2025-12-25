import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Sparkles, 
  Wand2, 
  Loader2,
  ChevronDown,
  Briefcase,
  MapPin,
  Clock,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResumeData } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: ResumeData) => void;
}

type AIProvider = "lovable" | "openai" | "anthropic" | "deepseek";

const providers: { id: AIProvider; name: string; description: string }[] = [
  { id: "lovable", name: "Lovable AI", description: "Fast & reliable (Default)" },
  { id: "openai", name: "OpenAI GPT-4", description: "Requires API key" },
  { id: "anthropic", name: "Claude", description: "Requires API key" },
  { id: "deepseek", name: "DeepSeek", description: "Requires API key" },
];

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Marketing",
  "Design",
  "Education",
  "Consulting",
  "Manufacturing",
  "Retail",
  "Other"
];

const experienceLevels = [
  { value: "0-2", label: "Entry Level (0-2 years)" },
  { value: "3-5", label: "Mid Level (3-5 years)" },
  { value: "6-10", label: "Senior (6-10 years)" },
  { value: "10+", label: "Executive (10+ years)" },
];

const AIGenerationModal = ({ isOpen, onClose, onGenerate }: AIGenerationModalProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<"prompt" | "form">("prompt");
  const [provider, setProvider] = useState<AIProvider>("lovable");
  
  // Prompt mode
  const [promptText, setPromptText] = useState("");
  
  // Form mode
  const [formData, setFormData] = useState({
    role: "",
    industry: "Technology",
    yearsExperience: "3-5",
    region: "Global",
    context: ""
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      let requestData;
      
      if (mode === "prompt") {
        // Parse the prompt to extract details
        requestData = {
          role: promptText.split(" ").slice(0, 5).join(" "),
          industry: "Technology",
          yearsExperience: "5",
          region: "Global",
          context: promptText
        };
      } else {
        requestData = formData;
      }
      
      console.log("Generating resume with:", { provider, ...requestData });
      
      const { data, error } = await supabase.functions.invoke("resume-ai", {
        body: {
          action: "generate",
          data: requestData,
          provider
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const resumeData = data.result as ResumeData;
      
      // Validate the response has required fields
      if (!resumeData.personalInfo || !resumeData.experience) {
        throw new Error("Invalid resume data received");
      }
      
      // Add IDs if missing
      resumeData.experience = resumeData.experience.map((exp, idx) => ({
        ...exp,
        id: exp.id || `exp-${idx}`
      }));
      resumeData.education = (resumeData.education || []).map((edu, idx) => ({
        ...edu,
        id: edu.id || `edu-${idx}`
      }));
      
      toast({
        title: "Resume generated!",
        description: `Created using ${providers.find(p => p.id === provider)?.name}`
      });
      
      onGenerate(resumeData);
      onClose();
      
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[85vh] bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">AI Resume Generator</h2>
                  <p className="text-xs text-muted-foreground">Create a professional resume in seconds</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-1 p-1 mx-4 mt-4 bg-muted rounded-lg">
              <button
                onClick={() => setMode("prompt")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === "prompt" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Wand2 className="w-4 h-4" />
                Quick Prompt
              </button>
              <button
                onClick={() => setMode("form")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === "form" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Detailed Form
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* AI Provider Selection */}
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">AI Provider</label>
                <Select value={provider} onValueChange={(v) => setProvider(v as AIProvider)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        <div className="flex items-center gap-2">
                          <Zap className="w-3 h-3" />
                          <span>{p.name}</span>
                          <span className="text-xs text-muted-foreground">— {p.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {mode === "prompt" ? (
                /* Prompt Mode */
                <div className="space-y-3">
                  <label className="text-xs text-muted-foreground block">
                    Describe the resume you want to create
                  </label>
                  <Textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Example: Create a resume for a Backend Engineer with 5 years of experience in FinTech, applying for senior roles in India. Strong in Node.js, AWS, and microservices."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: Include your target role, years of experience, industry, and key skills for best results.
                  </p>
                </div>
              ) : (
                /* Form Mode */
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3" />
                      Target Role
                    </label>
                    <Input
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Senior Software Engineer, Product Manager"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Industry</label>
                      <Select 
                        value={formData.industry} 
                        onValueChange={(v) => setFormData({ ...formData, industry: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((ind) => (
                            <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        Experience
                      </label>
                      <Select 
                        value={formData.yearsExperience} 
                        onValueChange={(v) => setFormData({ ...formData, yearsExperience: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      Target Region
                    </label>
                    <Select 
                      value={formData.region} 
                      onValueChange={(v) => setFormData({ ...formData, region: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Global">Global</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Europe">Europe</SelectItem>
                        <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Additional Context (Optional)
                    </label>
                    <Textarea
                      value={formData.context}
                      onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                      placeholder="Add any specific skills, achievements, or preferences..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 p-4 border-t border-border bg-muted/30">
              <p className="text-xs text-muted-foreground">
                AI generates realistic professional data. Review before using.
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || (mode === "prompt" && !promptText.trim()) || (mode === "form" && !formData.role.trim())}
                  className="min-w-[140px]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIGenerationModal;
