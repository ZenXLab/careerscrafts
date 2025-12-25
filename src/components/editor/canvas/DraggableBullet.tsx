import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import InlineEditableField from "./InlineEditableField";

interface DraggableBulletProps {
  id: string;
  content: string;
  onChange: (content: string) => void;
  onDelete: () => void;
  onAddAfter: () => void;
  accentColor: string;
  bulletStyle?: "dot" | "arrow" | "check";
  readOnly?: boolean;
  isLast?: boolean;
}

const BULLET_CHARS = {
  dot: "•",
  arrow: "▸",
  check: "✓",
};

const DraggableBullet = ({
  id,
  content,
  onChange,
  onDelete,
  onAddAfter,
  accentColor,
  bulletStyle = "arrow",
  readOnly = false,
  isLast = false,
}: DraggableBulletProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: readOnly });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const bulletChar = BULLET_CHARS[bulletStyle] || BULLET_CHARS.arrow;

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      className="group relative flex items-start gap-2 mb-1"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
    >
      {/* Drag Handle */}
      {!readOnly && (
        <button
          {...attributes}
          {...listeners}
          className="absolute -left-5 top-0.5 h-4 w-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary"
          title="Drag to reorder"
        >
          <GripVertical className="w-3 h-3" />
        </button>
      )}

      {/* Bullet Character */}
      <span
        style={{ color: accentColor }}
        className="flex-shrink-0 text-[9px] mt-0.5 select-none"
      >
        {bulletChar}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <InlineEditableField
          value={content}
          onChange={onChange}
          placeholder="Add achievement or responsibility..."
          disabled={readOnly}
          style={{
            fontSize: "9px",
            lineHeight: 1.4,
            color: "#374151",
          }}
        />
      </div>

      {/* Action Buttons */}
      {!readOnly && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onAddAfter}
            className="p-0.5 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
            title="Add bullet after"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title="Delete bullet"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </motion.li>
  );
};

export default DraggableBullet;
