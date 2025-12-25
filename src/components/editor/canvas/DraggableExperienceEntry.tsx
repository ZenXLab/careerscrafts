import { useState, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { GripVertical, Plus, Trash2, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InlineEditableField from "./InlineEditableField";
import DraggableBullet from "./DraggableBullet";

interface ExperienceData {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

interface DraggableExperienceEntryProps {
  entry: ExperienceData;
  onChange: (entry: ExperienceData) => void;
  onDelete: () => void;
  accentColor: string;
  readOnly?: boolean;
}

const DraggableExperienceEntry = ({
  entry,
  onChange,
  onDelete,
  accentColor,
  readOnly = false,
}: DraggableExperienceEntryProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id, disabled: readOnly });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  // Handle field changes
  const handleFieldChange = useCallback(
    (field: keyof ExperienceData, value: any) => {
      onChange({ ...entry, [field]: value });
    },
    [entry, onChange]
  );

  // Handle bullet changes
  const handleBulletChange = useCallback(
    (index: number, content: string) => {
      const newBullets = [...entry.bullets];
      newBullets[index] = content;
      onChange({ ...entry, bullets: newBullets });
    },
    [entry, onChange]
  );

  const handleBulletDelete = useCallback(
    (index: number) => {
      const newBullets = entry.bullets.filter((_, i) => i !== index);
      onChange({ ...entry, bullets: newBullets.length > 0 ? newBullets : [""] });
    },
    [entry, onChange]
  );

  const handleBulletAdd = useCallback(
    (afterIndex: number) => {
      const newBullets = [...entry.bullets];
      newBullets.splice(afterIndex + 1, 0, "");
      onChange({ ...entry, bullets: newBullets });
    },
    [entry, onChange]
  );

  // Handle bullet drag-and-drop
  const handleBulletDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = entry.bullets.findIndex((_, i) => `bullet-${entry.id}-${i}` === active.id);
      const newIndex = entry.bullets.findIndex((_, i) => `bullet-${entry.id}-${i}` === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newBullets = arrayMove(entry.bullets, oldIndex, newIndex);
        onChange({ ...entry, bullets: newBullets });
      }
    },
    [entry, onChange]
  );

  const bulletIds = entry.bullets.map((_, i) => `bullet-${entry.id}-${i}`);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="group relative mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {/* Entry Drag Handle */}
      {!readOnly && (
        <button
          {...attributes}
          {...listeners}
          className="absolute -left-7 top-1 h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary rounded hover:bg-primary/10"
          title="Drag to reorder experience"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Delete Entry Button */}
      {!readOnly && isHovered && (
        <button
          onClick={onDelete}
          className="absolute -right-6 top-1 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          title="Delete experience"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Position/Role */}
      <InlineEditableField
        value={entry.position}
        onChange={(v) => handleFieldChange("position", v)}
        placeholder="Job Title"
        disabled={readOnly}
        style={{
          fontWeight: 700,
          fontSize: "11px",
          color: "#111827",
        }}
      />

      {/* Company */}
      <InlineEditableField
        value={entry.company}
        onChange={(v) => handleFieldChange("company", v)}
        placeholder="Company Name"
        disabled={readOnly}
        style={{
          fontWeight: 600,
          fontSize: "10px",
          color: accentColor,
        }}
      />

      {/* Date & Location */}
      <div className="flex items-center gap-2 text-[9px] text-gray-500 mt-0.5 mb-2">
        <InlineEditableField
          value={entry.startDate}
          onChange={(v) => handleFieldChange("startDate", v)}
          placeholder="Start Date"
          disabled={readOnly}
          style={{ fontSize: "9px", color: "#6B7280" }}
        />
        <span>—</span>
        <InlineEditableField
          value={entry.current ? "Present" : entry.endDate}
          onChange={(v) => handleFieldChange("endDate", v)}
          placeholder="End Date"
          disabled={readOnly}
          style={{ fontSize: "9px", color: "#6B7280" }}
        />
        <span>•</span>
        <InlineEditableField
          value={entry.location}
          onChange={(v) => handleFieldChange("location", v)}
          placeholder="Location"
          disabled={readOnly}
          style={{ fontSize: "9px", color: "#6B7280" }}
        />
      </div>

      {/* Bullets - Nested DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleBulletDragEnd}
      >
        <SortableContext items={bulletIds} strategy={verticalListSortingStrategy}>
          <ul className="list-none p-0 m-0 pl-1">
            <AnimatePresence>
              {entry.bullets.map((bullet, index) => (
                <DraggableBullet
                  key={`bullet-${entry.id}-${index}`}
                  id={`bullet-${entry.id}-${index}`}
                  content={bullet}
                  onChange={(content) => handleBulletChange(index, content)}
                  onDelete={() => handleBulletDelete(index)}
                  onAddAfter={() => handleBulletAdd(index)}
                  accentColor={accentColor}
                  readOnly={readOnly}
                  isLast={index === entry.bullets.length - 1}
                />
              ))}
            </AnimatePresence>
          </ul>
        </SortableContext>
      </DndContext>

      {/* Add Bullet Button */}
      {!readOnly && isHovered && (
        <button
          onClick={() => handleBulletAdd(entry.bullets.length - 1)}
          className="ml-4 mt-1 flex items-center gap-1 text-[9px] text-muted-foreground hover:text-primary transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add bullet point
        </button>
      )}
    </motion.div>
  );
};

export default DraggableExperienceEntry;
