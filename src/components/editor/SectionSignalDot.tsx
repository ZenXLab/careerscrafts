import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SectionSignalDotProps {
  status: "strong" | "needs-improvement" | "risk";
  message: string;
}

export const SectionSignalDot = ({ status, message }: SectionSignalDotProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const colors = {
    strong: "bg-emerald-500",
    "needs-improvement": "bg-yellow-500",
    risk: "bg-red-500",
  };
  
  const pulseColors = {
    strong: "bg-emerald-400",
    "needs-improvement": "bg-yellow-400",
    risk: "bg-red-400",
  };

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="relative flex h-2.5 w-2.5">
        {status !== "strong" && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pulseColors[status]} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors[status]}`} />
      </span>
      
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute left-full ml-2 z-50 whitespace-nowrap"
          >
            <div className="bg-popover text-popover-foreground border border-border rounded-md shadow-md px-2 py-1 text-[10px]">
              {message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SectionSignalDot;
