import { useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, Sparkles } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SectionWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onAiImprove?: () => void;
  accentColor?: string;
  isDraggable?: boolean;
}

export const SectionWrapper = ({
  id,
  title,
  children,
  onAiImprove,
  accentColor = "hsl(221, 83%, 53%)",
  isDraggable = true,
}: SectionWrapperProps) => {
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
    disabled: !isDraggable,
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
        className="flex items-center gap-2 mb-2 pb-1 border-b"
        style={{ borderColor: accentColor }}
      >
        {/* Drag Handle - visible on hover */}
        {isDraggable && (
          <button
            {...attributes}
            {...listeners}
            className={`
              p-1 rounded cursor-grab active:cursor-grabbing
              hover:bg-gray-100 transition-all duration-200
              ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
            `}
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </button>
        )}

        {/* Section Title */}
        <h2 
          className="text-[10pt] font-bold uppercase tracking-widest flex-1"
          style={{ color: accentColor }}
        >
          {title}
        </h2>

        {/* AI Improve Button - visible on hover */}
        {onAiImprove && (
          <button
            onClick={onAiImprove}
            className={`
              p-1.5 rounded hover:bg-blue-50 transition-all duration-200
              ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}
            `}
            title="AI improve this section"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          </button>
        )}
      </div>

      {/* Section Content */}
      <div>{children}</div>
    </motion.div>
  );
};

export default SectionWrapper;
