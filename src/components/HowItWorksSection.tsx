import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { X, Check, AlertTriangle, Sparkles, FileText, Bot, Download, ChevronRight } from "lucide-react";

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="how-it-works" className="py-20 md:py-32 relative overflow-hidden bg-card/30">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-4">
            From <span className="font-serif italic text-red-400">rejected</span> to{" "}
            <span className="font-serif italic text-emerald-400">interview-ready</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            See how CareersCraft transforms your resume in real-time
          </p>
        </motion.div>

        {/* Animated Flow */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Animated Resume Preview */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <AnimatedResumeScreening activeStep={activeStep} />
            </motion.div>

            {/* Right: Steps */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              {steps.map((step, index) => (
                <StepCard 
                  key={index} 
                  step={step} 
                  index={index} 
                  isActive={activeStep === index}
                  onClick={() => setActiveStep(index)}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Animated Resume Screening Component
const AnimatedResumeScreening = ({ activeStep }: { activeStep: number }) => {
  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl blur-3xl" />
      
      <div className="relative bg-card border border-border rounded-2xl p-6 md:p-8 overflow-hidden">
        {/* Step 0: Upload */}
        {activeStep === 0 && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">Uploading Resume...</span>
            </div>
            <MiniResume status="uploading" />
            <motion.div 
              className="h-1 bg-primary/20 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div 
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Step 1: ATS Scan - Failing */}
        {activeStep === 1 && (
          <motion.div
            key="scan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <span className="font-medium text-red-400">ATS Scan: Issues Found</span>
            </div>
            <MiniResume status="failing" />
            <div className="space-y-2">
              <IssueItem icon={<X className="w-3 h-3" />} text="Missing keywords for role" type="error" />
              <IssueItem icon={<X className="w-3 h-3" />} text="Weak action verbs" type="error" />
              <IssueItem icon={<X className="w-3 h-3" />} text="No quantified achievements" type="error" />
              <IssueItem icon={<AlertTriangle className="w-3 h-3" />} text="Formatting may break ATS" type="warning" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-muted-foreground">ATS Score</span>
              <span className="text-2xl font-bold text-red-400">34%</span>
            </div>
          </motion.div>
        )}

        {/* Step 2: AI Fixing */}
        {activeStep === 2 && (
          <motion.div
            key="fixing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Bot className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="font-medium text-primary">AI Enhancing...</span>
            </div>
            <MiniResume status="fixing" />
            <div className="space-y-2">
              <FixingItem text="Adding industry keywords..." delay={0} />
              <FixingItem text="Strengthening bullet points..." delay={0.5} />
              <FixingItem text="Quantifying achievements..." delay={1} />
              <FixingItem text="Optimizing format..." delay={1.5} />
            </div>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {activeStep === 3 && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div 
                className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Check className="w-5 h-5 text-emerald-400" />
              </motion.div>
              <span className="font-medium text-emerald-400">Interview Ready!</span>
            </div>
            <MiniResume status="success" />
            <div className="space-y-2">
              <SuccessItem icon={<Check className="w-3 h-3" />} text="Keywords optimized for role" />
              <SuccessItem icon={<Check className="w-3 h-3" />} text="Impact-driven bullet points" />
              <SuccessItem icon={<Check className="w-3 h-3" />} text="Quantified achievements" />
              <SuccessItem icon={<Check className="w-3 h-3" />} text="ATS-safe formatting" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-muted-foreground">ATS Score</span>
              <motion.span 
                className="text-2xl font-bold text-emerald-400"
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                94%
              </motion.span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Mini Resume Preview
const MiniResume = ({ status }: { status: "uploading" | "failing" | "fixing" | "success" }) => {
  const getBorderColor = () => {
    switch (status) {
      case "failing": return "border-red-400/50";
      case "fixing": return "border-primary/50";
      case "success": return "border-emerald-400/50";
      default: return "border-border";
    }
  };

  return (
    <div className={`bg-white rounded-lg p-4 border-2 ${getBorderColor()} transition-colors duration-500`}>
      {/* Header */}
      <div className="text-center mb-3 pb-2 border-b border-gray-200">
        <div className="h-4 w-32 bg-gray-800 rounded mx-auto mb-1" />
        <div className="h-2 w-24 bg-blue-500 rounded mx-auto" />
      </div>

      {/* Content lines */}
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="h-2 w-20 bg-blue-500/50 rounded" />
          <div className="flex gap-1">
            <motion.div 
              className={`h-1.5 rounded flex-1 ${status === "failing" ? "bg-red-300" : status === "success" ? "bg-emerald-300" : "bg-gray-200"}`}
              animate={status === "fixing" ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <div className="h-1.5 w-8 bg-gray-200 rounded" />
          </div>
          <motion.div 
            className={`h-1.5 rounded w-3/4 ${status === "failing" ? "bg-red-200" : status === "success" ? "bg-emerald-200" : "bg-gray-100"}`}
            animate={status === "fixing" ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
        </div>
        <div className="space-y-1">
          <div className="h-2 w-16 bg-blue-500/50 rounded" />
          <motion.div 
            className={`h-1.5 rounded ${status === "failing" ? "bg-red-300" : status === "success" ? "bg-emerald-300" : "bg-gray-200"}`}
            animate={status === "fixing" ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
          <div className="h-1.5 w-5/6 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
};

// Issue Item
const IssueItem = ({ icon, text, type }: { icon: React.ReactNode; text: string; type: "error" | "warning" }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className={`flex items-center gap-2 text-xs ${type === "error" ? "text-red-400" : "text-amber-400"}`}
  >
    <span className={`p-0.5 rounded-full ${type === "error" ? "bg-red-500/20" : "bg-amber-500/20"}`}>{icon}</span>
    {text}
  </motion.div>
);

// Fixing Item with animation
const FixingItem = ({ text, delay }: { text: string; delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex items-center gap-2 text-xs text-primary"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Sparkles className="w-3 h-3" />
    </motion.div>
    {text}
  </motion.div>
);

// Success Item
const SuccessItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center gap-2 text-xs text-emerald-400"
  >
    <span className="p-0.5 rounded-full bg-emerald-500/20">{icon}</span>
    {text}
  </motion.div>
);

// Step data
const steps = [
  {
    number: "01",
    title: "Upload Your Resume",
    description: "Import your existing resume (PDF, DOCX) or start fresh with our AI-powered templates.",
    icon: FileText,
  },
  {
    number: "02", 
    title: "Instant ATS Analysis",
    description: "Our AI scans for ATS compatibility issues, missing keywords, and weak points that get resumes rejected.",
    icon: AlertTriangle,
  },
  {
    number: "03",
    title: "AI Enhancement",
    description: "CareersCraft rewrites bullet points, adds quantified achievements, and optimizes for your target role.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Export & Apply",
    description: "Download your ATS-optimized resume and start landing interviews.",
    icon: Download,
  },
];

// Step Card
const StepCard = ({ 
  step, 
  index, 
  isActive,
  onClick 
}: { 
  step: typeof steps[0]; 
  index: number;
  isActive: boolean;
  onClick: () => void;
}) => {
  const Icon = step.icon;

  return (
    <motion.button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
        isActive 
          ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/10" 
          : "bg-card/50 border-border/50 hover:border-border"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
          isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-mono ${isActive ? "text-primary" : "text-muted-foreground"}`}>
              {step.number}
            </span>
            <h3 className="font-medium">{step.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>
        <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isActive ? "rotate-90 text-primary" : "text-muted-foreground"}`} />
      </div>
    </motion.button>
  );
};

export default HowItWorksSection;
