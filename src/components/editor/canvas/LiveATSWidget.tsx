import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ATSBreakdown {
  structure: number;
  keywords: number;
  content: number;
  readability: number;
  completeness: number;
}

interface ATSFeedback {
  message: string;
  delta: number;
  timestamp: number;
}

interface SectionSignal {
  sectionId: string;
  status: "strong" | "needs-improvement" | "risk";
  message: string;
}

interface LiveATSWidgetProps {
  score: number;
  animatedScore: number;
  breakdown: ATSBreakdown;
  feedback: ATSFeedback | null;
  sectionSignals: SectionSignal[];
  isHighScore: boolean;
  className?: string;
  expanded?: boolean;
}

const getScoreColor = (score: number): string => {
  if (score >= 90) return "hsl(142, 76%, 36%)"; // Green
  if (score >= 75) return "hsl(48, 96%, 53%)"; // Yellow
  if (score >= 60) return "hsl(38, 92%, 50%)"; // Orange
  return "hsl(0, 72%, 51%)"; // Red
};

const getScoreLabel = (score: number): string => {
  if (score >= 90) return "ATS A+";
  if (score >= 80) return "ATS A";
  if (score >= 70) return "ATS B+";
  if (score >= 60) return "ATS B";
  return "ATS C";
};

const getSignalIcon = (status: SectionSignal["status"]) => {
  switch (status) {
    case "strong":
      return <CheckCircle className="w-3 h-3 text-green-500" />;
    case "needs-improvement":
      return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
    case "risk":
      return <AlertTriangle className="w-3 h-3 text-red-500" />;
  }
};

const LiveATSWidget = ({
  score,
  animatedScore,
  breakdown,
  feedback,
  sectionSignals,
  isHighScore,
  className = "",
  expanded: initialExpanded = false,
}: LiveATSWidgetProps) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  const breakdownItems = [
    { label: "Structure", value: breakdown.structure, weight: "25%" },
    { label: "Keywords", value: breakdown.keywords, weight: "30%" },
    { label: "Content Quality", value: breakdown.content, weight: "20%" },
    { label: "Readability", value: breakdown.readability, weight: "15%" },
    { label: "Completeness", value: breakdown.completeness, weight: "10%" },
  ];

  return (
    <div className={`bg-card border border-border rounded-lg shadow-sm ${className}`}>
      {/* Compact Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          {/* Score Circle */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
              {/* Background circle */}
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-muted"
              />
              {/* Progress circle */}
              <motion.circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke={scoreColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(animatedScore / 100) * 125.6} 125.6`}
                initial={{ strokeDasharray: "0 125.6" }}
                animate={{ strokeDasharray: `${(animatedScore / 100) * 125.6} 125.6` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </svg>
            {/* Score number */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold" style={{ color: scoreColor }}>
                {animatedScore}
              </span>
            </div>
          </div>

          {/* Label */}
          <div className="text-left">
            <div className="text-sm font-semibold" style={{ color: scoreColor }}>
              {scoreLabel}
            </div>
            <div className="text-xs text-muted-foreground">ATS Score</div>
          </div>
        </div>

        {/* Feedback Badge */}
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                  feedback.delta > 0
                    ? "bg-green-500/10 text-green-600"
                    : "bg-red-500/10 text-red-600"
                }`}
              >
                {feedback.delta > 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {feedback.delta > 0 ? "+" : ""}{feedback.delta}
              </motion.div>
            )}
          </AnimatePresence>
          
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 space-y-4">
              {/* Breakdown Bars */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">Score Breakdown</div>
                {breakdownItems.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.value}/100</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: getScoreColor(item.value) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Section Signals */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">Section Analysis</div>
                {sectionSignals.map((signal) => (
                  <div
                    key={signal.sectionId}
                    className="flex items-center gap-2 text-xs"
                  >
                    {getSignalIcon(signal.status)}
                    <span className="capitalize font-medium">{signal.sectionId}</span>
                    <span className="text-muted-foreground">—</span>
                    <span className="text-muted-foreground truncate">{signal.message}</span>
                  </div>
                ))}
              </div>

              {/* Tips */}
              {!isHighScore && (
                <div className="p-2 bg-primary/5 rounded border border-primary/10">
                  <div className="flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Tip: </span>
                      Add quantified achievements (numbers, percentages, metrics) to boost your content score.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveATSWidget;
