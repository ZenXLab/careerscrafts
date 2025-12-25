import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, GripVertical, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SectionWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  locked: boolean;
  onToggleLock: () => void;
  onAiImprove?: () => void;
  accentColor?: string;
  isDraggable?: boolean;
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
}

export const SectionWrapper = ({
  id,
  title,
  children,
  locked,
  onToggleLock,
  onAiImprove,
  accentColor = "hsl(221, 83%, 53%)",
  isDraggable = true,
  isCollapsible = false,
  defaultCollapsed = false,
}: SectionWrapperProps) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled: locked || !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? "z-50 opacity-80" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Section Header with Controls */}
      <div 
        className={`
          flex items-center gap-2 mb-2 pb-1 border-b
          ${locked ? "opacity-70" : ""}
        `}
        style={{ borderColor: accentColor }}
      >
        {/* Drag Handle */}
        {isDraggable && !locked && (
          <button
            {...attributes}
            {...listeners}
            className={`
              p-1 rounded cursor-grab active:cursor-grabbing
              hover:bg-primary/10 transition-colors
              ${isHovered ? "opacity-100" : "opacity-0"}
            `}
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        )}

        {/* Section Title */}
        <h2 
          className="text-[10pt] font-bold uppercase tracking-widest flex-1"
          style={{ color: accentColor }}
        >
          {title}
        </h2>

        {/* Controls */}
        <div className={`flex items-center gap-1 ${isHovered ? "opacity-100" : "opacity-0"} transition-opacity`}>
          {/* AI Improve Button */}
          {onAiImprove && !locked && (
            <button
              onClick={onAiImprove}
              className="p-1 rounded hover:bg-primary/10 transition-colors"
              title="AI improve this section"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </button>
          )}

          {/* Collapse Toggle */}
          {isCollapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-muted transition-colors"
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
          )}

          {/* Lock Toggle */}
          <button
            onClick={onToggleLock}
            className={`p-1 rounded transition-colors ${
              locked 
                ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" 
                : "hover:bg-muted text-muted-foreground"
            }`}
            title={locked ? "Unlock section" : "Lock section"}
          >
            {locked ? (
              <Lock className="w-3.5 h-3.5" />
            ) : (
              <Unlock className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Section Content */}
      <motion.div
        initial={false}
        animate={{ 
          height: isCollapsed ? 0 : "auto",
          opacity: isCollapsed ? 0 : 1
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className={locked ? "pointer-events-none select-none" : ""}>
          {children}
        </div>
      </motion.div>

      {/* Locked Overlay */}
      {locked && (
        <div className="absolute inset-0 bg-muted/5 pointer-events-none" />
      )}
    </motion.div>
  );
};

export default SectionWrapper;
