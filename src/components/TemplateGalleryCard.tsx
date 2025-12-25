import { useState } from "react";
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
  technical: { label: "Technology", color: "hsl(200, 70%, 45%)" },
  professional: { label: "Business", color: "hsl(220, 60%, 45%)" },
  creative: { label: "Design", color: "hsl(330, 65%, 50%)" },
  executive: { label: "Executive", color: "hsl(45, 80%, 45%)" },
  modern: { label: "Startup", color: "hsl(160, 65%, 40%)" },
};

const formatBadges = {
  "single-column": "Single Column",
  "sidebar": "Two Column",
  "two-column": "Modern Layout"
};

const TemplateGalleryCard = ({ template, data, index, onClick }: TemplateGalleryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const badge = industryBadges[template.category] || { label: "Professional", color: "hsl(220, 60%, 45%)" };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div 
        className="relative rounded-lg overflow-hidden border border-border/30 hover:border-primary/50 transition-all duration-200"
        style={{
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: isHovered 
            ? '0 20px 40px -15px hsl(var(--primary) / 0.15), 0 8px 20px -8px hsl(0 0% 0% / 0.3)' 
            : '0 4px 12px -4px hsl(0 0% 0% / 0.2)'
        }}
      >
        {/* Industry Badge */}
        <div className="absolute top-2 left-2 z-10 flex gap-1.5">
          <span 
            className="px-2 py-0.5 text-[10px] font-medium rounded-full backdrop-blur-sm"
            style={{ 
              backgroundColor: `${badge.color}20`, 
              color: badge.color,
              border: `1px solid ${badge.color}40`
            }}
          >
            {badge.label}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-sm">
            ATS-Safe
          </span>
        </div>

        {/* Resume Preview Container - Larger and more prominent */}
        <div className="relative bg-gradient-to-b from-muted/40 to-muted/20 p-3 pt-10">
          <div 
            className="relative overflow-hidden rounded-sm mx-auto transition-transform duration-200"
            style={{
              maxWidth: '180px',
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            }}
          >
            {/* Paper shadow effect */}
            <div className="absolute inset-0 bg-white rounded-sm shadow-[0_15px_35px_-10px_rgba(0,0,0,0.4)]" />
            
            {/* Resume content with scroll effect on hover */}
            <div 
              className="relative transition-transform duration-500"
              style={{
                transform: isHovered ? 'translateY(-12px)' : 'translateY(0)'
              }}
            >
              <TemplatePreview 
                template={template} 
                data={data} 
                scale={0.28}
              />
            </div>
          </div>

          {/* Hover Actions Overlay */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex flex-col gap-2">
              <span className="px-4 py-2 bg-card/95 backdrop-blur-md text-foreground text-xs font-medium rounded-full border border-border/50 shadow-lg">
                Preview Template
              </span>
              <span className="px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-full shadow-lg text-center">
                Use This Template
              </span>
            </div>
          </motion.div>
        </div>

        {/* Template Info - Compact */}
        <div className="p-3 bg-card border-t border-border/30">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm text-foreground truncate">{template.name}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {template.pages} page{template.pages > 1 ? "s" : ""} • {formatBadges[template.layout] || template.layout}
              </p>
            </div>
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0 border border-white/10" 
              style={{ backgroundColor: template.accentColor }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TemplateGalleryCard;
