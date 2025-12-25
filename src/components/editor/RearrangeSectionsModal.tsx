import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { X, GripVertical, Lock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Section {
  id: string;
  name: string;
  locked?: boolean;
  removable?: boolean;
}

interface RearrangeSectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  onReorder: (sections: Section[]) => void;
  onRemove: (sectionId: string) => void;
}

const RearrangeSectionsModal = ({ 
  isOpen, 
  onClose, 
  sections, 
  onReorder, 
  onRemove 
}: RearrangeSectionsModalProps) => {
  const [localSections, setLocalSections] = useState(sections);

  const handleReorder = (newOrder: Section[]) => {
    // Keep locked sections in their original positions
    const lockedSections = sections.filter(s => s.locked);
    const unlockedNewOrder = newOrder.filter(s => !s.locked);
    
    // Reconstruct with locked sections in place
    const finalOrder: Section[] = [];
    let unlockedIndex = 0;
    
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].locked) {
        finalOrder.push(sections[i]);
      } else if (unlockedIndex < unlockedNewOrder.length) {
        finalOrder.push(unlockedNewOrder[unlockedIndex]);
        unlockedIndex++;
      }
    }
    
    setLocalSections(finalOrder);
  };

  const handleSave = () => {
    onReorder(localSections);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] md:max-h-[80vh] bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold">Rearrange Sections</h2>
                <p className="text-sm text-muted-foreground">Drag to reorder your resume sections</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Page Indicator */}
            <div className="px-4 py-2 bg-muted/30 border-b border-border">
              <span className="text-xs text-muted-foreground">Page 1 of 1</span>
            </div>

            {/* Sections List */}
            <div className="p-4 overflow-y-auto flex-1">
              <Reorder.Group 
                axis="y" 
                values={localSections} 
                onReorder={handleReorder}
                className="space-y-2"
              >
                {localSections.map((section) => (
                  <Reorder.Item
                    key={section.id}
                    value={section}
                    dragListener={!section.locked}
                    className={`${section.locked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
                  >
                    <motion.div
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        section.locked 
                          ? "border-border/50 bg-muted/30" 
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                      whileHover={!section.locked ? { scale: 1.01 } : {}}
                    >
                      <div className={`p-1 rounded ${section.locked ? "text-muted-foreground/50" : "text-muted-foreground"}`}>
                        {section.locked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <GripVertical className="w-4 h-4" />
                        )}
                      </div>
                      <span className={`flex-1 text-sm font-medium ${section.locked ? "text-muted-foreground" : ""}`}>
                        {section.name}
                      </span>
                      {section.locked && (
                        <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                          Locked
                        </span>
                      )}
                      {section.removable && !section.locked && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => onRemove(section.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </motion.div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>

            {/* ATS Tip */}
            <div className="px-4 py-3 bg-primary/5 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-medium">ATS Tip:</span> Keep Experience and Education near the top for better parsing.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave}>Save Order</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RearrangeSectionsModal;
