import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ResumeData, TemplateConfig } from "@/types/resume";
import TemplatePreview from "./TemplatePreview";

interface TemplateGalleryCardProps {
  template: TemplateConfig;
  data: ResumeData;
  index: number;
  onClick: () => void;
}

const industryBadges: Record<string, { label: string; color: string }> = {
  technical: { label: "Technology", color: "hsl(200, 70%, 50%)" },
  professional: { label: "Business", color: "hsl(220, 60%, 50%)" },
  creative: { label: "Design", color: "hsl(330, 65%, 55%)" },
  executive: { label: "Executive", color: "hsl(45, 80%, 50%)" },
  modern: { label: "Startup", color: "hsl(160, 65%, 45%)" },
};

const formatBadges: Record<string, string> = {
  "single-column": "Single Column",
  "sidebar": "Two Column",
  "two-column": "Modern Layout"
};

const TemplateGalleryCard = ({ template, data, index, onClick }: TemplateGalleryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [atsScore, setAtsScore] = useState(82);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  
  const badge = industryBadges[template.category] || { label: "Professional", color: "hsl(220, 60%, 50%)" };
  
  // ATS score animation on first hover
  useEffect(() => {
    if (isHovered && !showScoreAnimation) {
      setShowScoreAnimation(true);
      const interval = setInterval(() => {
        setAtsScore(prev => {
          if (prev >= 94) {
            clearInterval(interval);
            return 94;
          }
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isHovered, showScoreAnimation]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div 
        className="relative rounded-xl overflow-hidden border border-border/30 hover:border-primary/50 transition-all duration-[180ms] ease-out bg-gradient-to-b from-muted/30 to-card"
        style={{
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: isHovered 
            ? '0 20px 40px -15px hsl(var(--primary) / 0.2), 0 8px 20px -8px hsl(0 0% 0% / 0.4)' 
            : '0 4px 12px -4px hsl(0 0% 0% / 0.3)'
        }}
      >
        {/* Industry Badge + ATS Badge */}
        <div className="absolute top-3 left-3 z-10 flex gap-1.5">
          <span 
            className="px-2.5 py-1 text-[10px] font-medium rounded-full backdrop-blur-md"
            style={{ 
              backgroundColor: `${badge.color}20`, 
              color: badge.color,
              border: `1px solid ${badge.color}40`
            }}
          >
            {badge.label}
          </span>
          <span className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 backdrop-blur-md">
            ATS-Safe
          </span>
        </div>

        {/* Live ATS Score - Animates on hover */}
        <motion.div 
          className="absolute top-3 right-3 z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.9 }}
          transition={{ duration: 0.15 }}
        >
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/95 backdrop-blur-md border border-border/50 shadow-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-emerald-400">
              {atsScore}%
            </span>
          </div>
        </motion.div>

        {/* LARGE Resume Preview Container - This is the main change */}
        <div className="relative p-4 pt-14 pb-0 overflow-hidden">
          <div 
            className="relative mx-auto transition-transform duration-[180ms] ease-out"
            style={{
              transform: isHovered ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            {/* Paper shadow effect */}
            <div 
              className="absolute inset-0 bg-white rounded transition-shadow duration-[180ms]"
              style={{
                boxShadow: isHovered 
                  ? '0 25px 50px -12px rgba(0,0,0,0.5)' 
                  : '0 15px 35px -10px rgba(0,0,0,0.4)'
              }}
            />
            
            {/* FULL Resume content - Large, readable preview */}
            <div 
              className="relative overflow-hidden rounded"
              style={{ 
                height: '340px',  // Increased height for full visibility
              }}
            >
              <div 
                className="transition-transform duration-500 ease-out"
                style={{
                  transform: isHovered ? 'translateY(-14px)' : 'translateY(0)'
                }}
              >
                {/* Larger scale for better readability */}
                <TemplatePreview 
                  template={{ ...template, pages: 1 }}
                  data={data} 
                  scale={0.38}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hover Actions Overlay - More subtle */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col gap-2 pointer-events-auto">
            <motion.span 
              className="px-5 py-2.5 bg-card/95 backdrop-blur-md text-foreground text-xs font-medium rounded-full border border-border/50 shadow-xl text-center cursor-pointer hover:bg-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Preview Template
            </motion.span>
            <motion.span 
              className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-medium rounded-full shadow-xl text-center cursor-pointer hover:bg-primary/90"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Use This Template
            </motion.span>
          </div>
        </motion.div>

        {/* Template Info - Clean footer */}
        <div className="p-4 bg-card border-t border-border/30">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm text-foreground">{template.name}</h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                1 page • {formatBadges[template.layout] || template.layout} • ATS-safe
              </p>
            </div>
            <div 
              className="w-5 h-5 rounded-full flex-shrink-0 border-2 border-white/10 shadow-sm" 
              style={{ backgroundColor: template.accentColor }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TemplateGalleryCard;
