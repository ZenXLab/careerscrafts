import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Info, ChevronDown } from "lucide-react";

interface ATSFeedback {
  message: string;
  delta: number;
  timestamp: number;
}

interface ATSScoreWidgetProps {
  score: number;
  animatedScore: number;
  feedback: ATSFeedback | null;
  isHighScore: boolean;
  compact?: boolean;
}

const getScoreGrade = (score: number): { grade: string; color: string; bgColor: string } => {
  if (score >= 90) return { grade: "A+", color: "text-emerald-500", bgColor: "bg-emerald-500" };
  if (score >= 85) return { grade: "A", color: "text-emerald-500", bgColor: "bg-emerald-500" };
  if (score >= 80) return { grade: "B+", color: "text-blue-500", bgColor: "bg-blue-500" };
  if (score >= 70) return { grade: "B", color: "text-blue-500", bgColor: "bg-blue-500" };
  if (score >= 60) return { grade: "C", color: "text-yellow-500", bgColor: "bg-yellow-500" };
  return { grade: "D", color: "text-red-500", bgColor: "bg-red-500" };
};

export const ATSScoreWidget = ({
  score,
  animatedScore,
  feedback,
  isHighScore,
  compact = false,
}: ATSScoreWidgetProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { grade, color, bgColor } = getScoreGrade(score);
  
  // Calculate ring progress
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative w-10 h-10">
          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/20"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className={color}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-bold ${color}`}>{animatedScore}</span>
          </div>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground">ATS</span>
          <span className={`ml-1 font-semibold ${color}`}>{grade}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        className="p-4 rounded-xl bg-card border border-border/50 relative overflow-hidden"
        layout
      >
        {/* Score Circle */}
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-muted/20"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                className={color}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                className={`text-2xl font-bold ${color}`}
                key={animatedScore}
              >
                {animatedScore}
              </motion.span>
              <span className="text-[10px] text-muted-foreground">/ 100</span>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">ATS Score</span>
              <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${color} bg-current/10`}>
                {grade}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {isHighScore 
                ? "Resume is ATS-optimized. Minor refinements only."
                : "Improve content to boost your score."}
            </p>
          </div>
        </div>

        {/* Feedback Toast */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 flex items-center gap-2 text-xs"
            >
              {feedback.delta > 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              ) : feedback.delta < 0 ? (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              ) : (
                <Minus className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              <span className={feedback.delta > 0 ? "text-emerald-600" : feedback.delta < 0 ? "text-red-600" : "text-muted-foreground"}>
                {feedback.delta > 0 ? `+${feedback.delta}` : feedback.delta} — {feedback.message}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Expand Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>{showDetails ? "Hide" : "Show"} details</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${showDetails ? "rotate-180" : ""}`} />
        </button>
        
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Structure & Format</span>
                  <span className="font-medium">—</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Keyword Match</span>
                  <span className="font-medium">—</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Content Quality</span>
                  <span className="font-medium">—</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Readability</span>
                  <span className="font-medium">—</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ATSScoreWidget;
