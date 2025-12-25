import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ALL_SECTIONS,
  CORE_SECTIONS,
  STANDARD_SECTIONS,
  ADVANCED_SECTIONS,
  PERSONAL_SECTIONS,
  getSectionStatus,
  SectionDefinition,
  SectionStatus,
  RoleType,
} from "@/data/sectionSystem";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (sectionType: string) => void;
  existingSections: string[];
  userRole?: RoleType;
}

interface SectionCardProps {
  section: SectionDefinition;
  status: SectionStatus;
  onAdd: () => void;
}

const SectionCard = ({ section, status, onAdd }: SectionCardProps) => {
  const Icon = section.icon;
  
  const isClickable = status === "available";
  const isDisabled = status === "added" || status === "required";
  const isLocked = status === "locked";

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={isClickable ? onAdd : undefined}
            disabled={!isClickable}
            className={`
              relative p-4 rounded-lg border text-left transition-all w-full
              ${isClickable 
                ? "border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer" 
                : isLocked
                  ? "border-border/50 bg-muted/30 cursor-not-allowed opacity-60"
                  : "border-primary/30 bg-primary/5 cursor-default"
              }
            `}
            whileHover={isClickable ? { scale: 1.01 } : undefined}
            whileTap={isClickable ? { scale: 0.99 } : undefined}
          >
            {/* Status Badge */}
            <div className="absolute top-2 right-2">
              {status === "required" && (
                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                  Required
                </span>
              )}
              {status === "added" && (
                <span className="flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded bg-green-500/10 text-green-600">
                  <Check className="w-3 h-3" />
                  Added
                </span>
              )}
              {status === "locked" && (
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </div>

            {/* Content */}
            <div className="flex items-start gap-3 pr-12">
              <div className={`
                p-2 rounded-lg shrink-0
                ${isDisabled ? "bg-muted" : isLocked ? "bg-muted/50" : "bg-primary/10"}
              `}>
                <Icon className={`w-4 h-4 ${isDisabled ? "text-muted-foreground" : isLocked ? "text-muted-foreground/50" : "text-primary"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-sm truncate ${isLocked ? "text-muted-foreground" : ""}`}>
                  {section.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {section.description}
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className={`
              mt-3 p-2 rounded text-[10px] truncate
              ${isDisabled 
                ? "bg-primary/5 text-primary/70" 
                : isLocked 
                  ? "bg-muted/30 text-muted-foreground/50"
                  : "bg-muted/50 text-muted-foreground"
              }
            `}>
              {section.preview}
            </div>
          </motion.button>
        </TooltipTrigger>
        {isLocked && section.lockedTooltip && (
          <TooltipContent side="top" className="max-w-[200px]">
            <p className="text-xs">{section.lockedTooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

const AddSectionModal = ({ 
  isOpen, 
  onClose, 
  onAddSection, 
  existingSections,
  userRole = "software_engineer"
}: AddSectionModalProps) => {
  
  const getStatus = (sectionId: string) => getSectionStatus(sectionId, existingSections, userRole);
  
  const availableCount = ALL_SECTIONS.filter(s => getStatus(s.id) === "available").length;

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
          
          {/* Modal */}
          <motion.div 
            className="relative w-full max-w-[800px] max-h-[85vh] bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold">Add Section</h2>
                <p className="text-sm text-muted-foreground">
                  {availableCount > 0 
                    ? `${availableCount} sections available to add` 
                    : "All available sections have been added"}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Core Sections */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Core Sections</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                    Required
                  </span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {CORE_SECTIONS.map((section) => (
                    <SectionCard
                      key={section.id}
                      section={section}
                      status={getStatus(section.id)}
                      onAdd={() => onAddSection(section.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Standard Sections */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Standard Sections</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                    Optional
                  </span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {STANDARD_SECTIONS.map((section) => (
                    <SectionCard
                      key={section.id}
                      section={section}
                      status={getStatus(section.id)}
                      onAdd={() => onAddSection(section.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Advanced Sections */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Advanced Sections</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-medium">
                    Role-Based
                  </span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {ADVANCED_SECTIONS.map((section) => (
                    <SectionCard
                      key={section.id}
                      section={section}
                      status={getStatus(section.id)}
                      onAdd={() => onAddSection(section.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Personal Sections */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-foreground">Personal Sections</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3.5 h-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-[200px]">
                          Use sparingly. Overusing personal sections may reduce ATS score.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {PERSONAL_SECTIONS.map((section) => (
                    <SectionCard
                      key={section.id}
                      section={section}
                      status={getStatus(section.id)}
                      onAdd={() => onAddSection(section.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                Locked sections unlock based on your career stage
              </p>
              <p className="text-xs text-muted-foreground">
                All sections are ATS-safe
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddSectionModal;
