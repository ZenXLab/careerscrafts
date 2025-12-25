import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLayout: "single-column" | "two-column" | "sidebar";
  onSelectLayout: (layout: "single-column" | "two-column" | "sidebar") => void;
}

const LAYOUT_STRUCTURES = [
  { 
    id: "single-column" as const, 
    name: "Single Column", 
    description: "Traditional top-down layout. Best for ATS compatibility.", 
    icon: "║",
    atsScore: "Excellent",
    visual: (
      <div className="w-full h-full bg-white rounded border border-gray-200 p-2 space-y-1">
        <div className="h-2 bg-primary/20 rounded" />
        <div className="h-1 bg-gray-200 rounded w-3/4" />
        <div className="h-1 bg-gray-200 rounded" />
        <div className="h-1 bg-gray-200 rounded w-2/3" />
      </div>
    )
  },
  { 
    id: "two-column" as const, 
    name: "Two Column", 
    description: "Modern split layout. May have reduced ATS compatibility.", 
    icon: "║║",
    atsScore: "Good",
    visual: (
      <div className="w-full h-full bg-white rounded border border-gray-200 p-2 flex gap-1">
        <div className="flex-1 space-y-1">
          <div className="h-2 bg-primary/20 rounded" />
          <div className="h-1 bg-gray-200 rounded" />
          <div className="h-1 bg-gray-200 rounded w-3/4" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-2 bg-primary/20 rounded" />
          <div className="h-1 bg-gray-200 rounded" />
          <div className="h-1 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    )
  },
  { 
    id: "sidebar" as const, 
    name: "Sidebar Layout", 
    description: "Skills and contact in sidebar. Creative but lower ATS score.", 
    icon: "▌║",
    atsScore: "Fair",
    visual: (
      <div className="w-full h-full bg-white rounded border border-gray-200 p-2 flex gap-1">
        <div className="w-1/3 space-y-1 bg-primary/5 rounded p-1">
          <div className="h-1 bg-primary/30 rounded" />
          <div className="h-1 bg-primary/20 rounded" />
          <div className="h-1 bg-primary/20 rounded w-2/3" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="h-2 bg-primary/20 rounded" />
          <div className="h-1 bg-gray-200 rounded" />
          <div className="h-1 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    )
  },
];

const LayoutStructureModal = ({ isOpen, onClose, currentLayout, onSelectLayout }: LayoutStructureModalProps) => {
  const [selectedLayout, setSelectedLayout] = useState(currentLayout);

  const handleApply = () => {
    onSelectLayout(selectedLayout);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal - Centered */}
          <motion.div 
            className="relative w-full max-w-[650px] max-h-[80vh] bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold">Choose Layout Structure</h2>
                <p className="text-sm text-muted-foreground">Select the overall structure for your resume</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Layout Options */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid gap-4">
                {LAYOUT_STRUCTURES.map((layout) => (
                  <motion.button
                    key={layout.id}
                    onClick={() => setSelectedLayout(layout.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedLayout === layout.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50"
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex gap-4">
                      {/* Visual Preview */}
                      <div className="w-24 h-32 shrink-0">
                        {layout.visual}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{layout.name}</h3>
                          {selectedLayout === layout.id && (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{layout.description}</p>
                        
                        {/* ATS Score Badge */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">ATS Score:</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            layout.atsScore === "Excellent" ? "bg-emerald-500/10 text-emerald-600" :
                            layout.atsScore === "Good" ? "bg-yellow-500/10 text-yellow-600" :
                            "bg-orange-500/10 text-orange-600"
                          }`}>
                            {layout.atsScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* ATS Warning */}
            <div className="px-6 py-3 bg-amber-500/5 border-t border-amber-500/20">
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  <strong>ATS Tip:</strong> Single column layouts parse most reliably across all ATS systems. Complex layouts may cause parsing errors.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={handleApply}>Apply Layout</Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LayoutStructureModal;
