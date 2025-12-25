import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeData, TemplateConfig } from "@/types/resume";
import TemplatePreview from "@/components/TemplatePreview";

interface LiveResumeCanvasProps {
  template: TemplateConfig;
  data: ResumeData;
  onFieldEdit?: (field: string, value: string) => void;
  scale?: number;
}

const LiveResumeCanvas = ({ template, data, onFieldEdit, scale: initialScale = 0.7 }: LiveResumeCanvasProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(initialScale);
  const totalPages = template.pages;
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.4));

  return (
    <div className="flex-1 flex flex-col bg-muted/20 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleZoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleZoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-24" /> {/* Spacer for balance */}
      </div>

      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-8 flex justify-center"
        style={{
          background: `
            radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.03) 0%, transparent 50%),
            linear-gradient(180deg, hsl(var(--muted) / 0.3) 0%, hsl(var(--background)) 100%)
          `
        }}
      >
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Paper Shadow */}
          <div 
            className="absolute inset-0 rounded-sm"
            style={{
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.4),
                0 12px 25px -8px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(0, 0, 0, 0.05)
              `,
              transform: `scale(${scale})`,
              transformOrigin: 'top center'
            }}
          />
          
          {/* Resume Preview */}
          <div 
            className="relative"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center'
            }}
          >
            <TemplatePreview 
              template={template} 
              data={data} 
              scale={1}
            />
          </div>

          {/* Page Turn Effect (for multi-page) */}
          {totalPages > 1 && (
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-2 h-8 rounded-full transition-all ${
                    currentPage === idx + 1 
                      ? "bg-primary" 
                      : "bg-border hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <span className="text-xs text-muted-foreground">
          {template.name} • {template.layout === 'single-column' ? 'Single Column' : template.layout === 'sidebar' ? 'Two Column' : 'Modern'}
        </span>
        <span className="text-xs text-muted-foreground">
          Last saved: Just now
        </span>
      </div>
    </div>
  );
};

export default LiveResumeCanvas;
