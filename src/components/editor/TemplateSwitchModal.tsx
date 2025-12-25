import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Layout, AlertTriangle, Check, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { templates } from "@/data/templates";
import { TemplateConfig } from "@/types/resume";

interface TemplateSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: TemplateConfig;
  onSelectTemplate: (template: TemplateConfig) => void;
  currentATSScore: number;
}

type LayoutCategory = "single-column" | "two-column" | "sidebar";

const getLayoutCategory = (layout: LayoutCategory): string => {
  switch (layout) {
    case "single-column": return "Single Column";
    case "two-column": return "Two Column";
    case "sidebar": return "Sidebar";
    default: return layout;
  }
};

const isSafeSwitch = (from: LayoutCategory, to: LayoutCategory): boolean => {
  // Safe switches
  if (from === to) return true;
  if (from === "single-column" && to === "single-column") return true;
  // Conditionally safe
  if (from === "single-column" && (to === "two-column" || to === "sidebar")) return true;
  // Never auto-allowed (require confirmation)
  return false;
};

const getTemplateATSSafety = (template: TemplateConfig): "safe" | "caution" | "risk" => {
  // Single column layouts are always ATS-safe
  if (template.layout === "single-column") return "safe";
  // Two-column and sidebar need caution
  if (template.layout === "sidebar" || template.layout === "two-column") return "caution";
  return "risk";
};

export const TemplateSwitchModal = ({
  isOpen,
  onClose,
  currentTemplate,
  onSelectTemplate,
  currentATSScore,
}: TemplateSwitchModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeCategory, setActiveCategory] = useState<TemplateConfig["category"] | "all">("all");

  const filteredTemplates = useMemo(() => {
    if (activeCategory === "all") return templates;
    return templates.filter(t => t.category === activeCategory);
  }, [activeCategory]);

  const handleTemplateClick = (template: TemplateConfig) => {
    setSelectedTemplate(template);
    
    const fromLayout = currentTemplate.layout as LayoutCategory;
    const toLayout = template.layout as LayoutCategory;
    
    // Check if this needs confirmation
    if (!isSafeSwitch(fromLayout, toLayout)) {
      setShowConfirmation(true);
    } else {
      // Safe switch - proceed directly
      onSelectTemplate(template);
      onClose();
    }
  };

  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      setShowConfirmation(false);
      onClose();
    }
  };

  const categories: { id: TemplateConfig["category"] | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "modern", label: "Modern" },
    { id: "professional", label: "Professional" },
    { id: "technical", label: "Technical" },
    { id: "creative", label: "Creative" },
    { id: "executive", label: "Executive" },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card border border-border rounded-xl w-full max-w-4xl max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Layout className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Switch Template</h2>
                <p className="text-xs text-muted-foreground">
                  Current: {currentTemplate.name} ({getLayoutCategory(currentTemplate.layout as LayoutCategory)})
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* ATS Protection Notice */}
          <div className="p-3 bg-emerald-500/5 border-b border-emerald-500/20 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-xs text-emerald-700">
              ATS Score Protection: Templates that may reduce your score are marked
            </span>
          </div>

          {/* Category Tabs */}
          <div className="p-4 border-b border-border overflow-x-auto">
            <div className="flex gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Template Grid */}
          <div className="p-4 overflow-y-auto max-h-[50vh]">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const atsSafety = getTemplateATSSafety(template);
                const isCurrentTemplate = template.id === currentTemplate.id;
                
                return (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${isCurrentTemplate 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50 bg-background/50"
                      }
                    `}
                    onClick={() => !isCurrentTemplate && handleTemplateClick(template)}
                  >
                    {/* Current Badge */}
                    {isCurrentTemplate && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-medium rounded">
                        Current
                      </div>
                    )}
                    
                    {/* ATS Safety Badge */}
                    {atsSafety !== "safe" && !isCurrentTemplate && (
                      <div className={`absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium
                        ${atsSafety === "caution" ? "bg-yellow-500/10 text-yellow-600" : "bg-red-500/10 text-red-600"}
                      `}>
                        <AlertTriangle className="w-3 h-3" />
                        {atsSafety === "caution" ? "Caution" : "Risk"}
                      </div>
                    )}

                    {/* Template Preview */}
                    <div 
                      className="w-full aspect-[3/4] rounded border border-border/50 mb-3 overflow-hidden"
                      style={{ backgroundColor: template.accentColor + "10" }}
                    >
                      <div className="w-full h-full flex flex-col p-2">
                        <div 
                          className="w-full h-3 rounded mb-2"
                          style={{ backgroundColor: template.accentColor }}
                        />
                        <div className="flex-1 space-y-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div 
                              key={i} 
                              className="h-1.5 rounded bg-muted/50"
                              style={{ width: `${60 + Math.random() * 40}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <h3 className="font-medium text-sm">{template.name}</h3>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded">
                        {getLayoutCategory(template.layout as LayoutCategory)}
                      </span>
                      {template.hasPhoto && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded">
                          Photo
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Confirmation Dialog */}
          <AnimatePresence>
            {showConfirmation && selectedTemplate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center p-4"
                onClick={() => setShowConfirmation(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-card border border-border rounded-xl p-6 max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Layout Change</h3>
                      <p className="text-xs text-muted-foreground">
                        This template uses a different layout
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    This template reorganizes layout, not content. Your information will remain intact.
                  </p>
                  
                  <div className="p-3 bg-muted/50 rounded-lg mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Check className="w-3 h-3 text-emerald-500" />
                      All content preserved
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Check className="w-3 h-3 text-emerald-500" />
                      Section order maintained
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles className="w-3 h-3 text-primary" />
                      Easy to switch back anytime
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowConfirmation(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleConfirm}
                    >
                      Proceed
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TemplateSwitchModal;
