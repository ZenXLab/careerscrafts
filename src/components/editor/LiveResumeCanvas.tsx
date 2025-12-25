import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeData, TemplateConfig } from "@/types/resume";
import { DesignSettings } from "./DesignPanel";
import { 
  DndContext, 
  closestCenter, 
  DragEndEvent, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { 
  SortableContext, 
  verticalListSortingStrategy, 
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SectionWrapper from "./SectionWrapper";
import SlateInlineField from "./slate/SlateInlineField";
import SkillTokenEditor from "./SkillTokenEditor";

// A4 dimensions at 96 DPI (LOCKED)
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

interface LiveResumeCanvasProps {
  template: TemplateConfig;
  data: ResumeData;
  designSettings?: DesignSettings;
  onDataChange?: (data: ResumeData) => void;
  sectionOrder?: string[];
  onSectionOrderChange?: (order: string[]) => void;
}

// Sortable bullet component for drag-and-drop within experience
interface SortableBulletProps {
  id: string;
  bullet: string;
  expIdx: number;
  bulletIdx: number;
  accentColor: string;
  role: string;
  onFieldChange: (field: string, value: string) => void;
}

const SortableBullet = ({ id, bullet, expIdx, bulletIdx, accentColor, role, onFieldChange }: SortableBulletProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex text-gray-700 text-[10pt] group"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="mr-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 -ml-4"
        title="Drag to reorder"
      >
        <GripVertical className="w-3 h-3" />
      </button>
      <span className="mr-2 shrink-0" style={{ color: accentColor }}>▸</span>
      <SlateInlineField
        value={bullet}
        onChange={(value) => onFieldChange(`experience.${expIdx}.bullets.${bulletIdx}`, value)}
        placeholder="Enter bullet point..."
        role={role}
        accentColor={accentColor}
        className="flex-1"
      />
    </li>
  );
};

const LiveResumeCanvas = ({ 
  template, 
  data, 
  designSettings,
  onDataChange,
  sectionOrder: externalSectionOrder,
  onSectionOrderChange,
}: LiveResumeCanvasProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(0.8);
  const [activeBulletId, setActiveBulletId] = useState<UniqueIdentifier | null>(null);
  const totalPages = template.pages;
  const containerRef = useRef<HTMLDivElement>(null);

  // Section order for drag & drop
  const [sectionOrder, setSectionOrder] = useState<string[]>(
    externalSectionOrder || ["summary", "skills", "experience", "education"]
  );

  // DnD sensors - separate for sections and bullets
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Sync external section order
  useEffect(() => {
    if (externalSectionOrder) {
      setSectionOrder(externalSectionOrder);
    }
  }, [externalSectionOrder]);

  // Calculate optimal zoom based on container
  useEffect(() => {
    const calculateZoom = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.clientWidth - 80;
        const containerHeight = container.clientHeight - 80;
        const fitWidth = containerWidth / A4_WIDTH;
        const fitHeight = containerHeight / A4_HEIGHT;
        const optimalZoom = Math.min(fitWidth, fitHeight, 1);
        setZoom(Math.max(0.5, Math.min(optimalZoom, 0.95)));
      }
    };
    
    calculateZoom();
    window.addEventListener('resize', calculateZoom);
    return () => window.removeEventListener('resize', calculateZoom);
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const handleFitToPage = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 80;
      const containerHeight = container.clientHeight - 80;
      const fitWidth = containerWidth / A4_WIDTH;
      const fitHeight = containerHeight / A4_HEIGHT;
      setZoom(Math.min(fitWidth, fitHeight, 1));
    }
  };

  // Handle section drag end with ATS guardrails
  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Check if this is a section drag (not a bullet drag)
      const activeIdStr = String(active.id);
      if (activeIdStr.startsWith("bullet-")) return;

      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over.id as string);
      
      if (oldIndex === -1 || newIndex === -1) return;
      
      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      
      // ATS guardrail: Experience must be before Education
      const expIdx = newOrder.indexOf("experience");
      const eduIdx = newOrder.indexOf("education");
      if (expIdx > eduIdx && newOrder.includes("experience") && newOrder.includes("education")) {
        return; // Prevent invalid order
      }
      
      setSectionOrder(newOrder);
      onSectionOrderChange?.(newOrder);
    }
  };

  // Handle inline field edits
  const handleFieldChange = useCallback((field: string, value: string) => {
    if (!onDataChange) return;
    
    const fields = field.split(".");
    const newData = { ...data };
    
    if (fields[0] === "personalInfo") {
      newData.personalInfo = { ...newData.personalInfo, [fields[1]]: value };
    } else if (fields[0] === "summary") {
      newData.summary = value;
    } else if (fields[0] === "experience") {
      const expIdx = parseInt(fields[1]);
      const expField = fields[2];
      newData.experience = [...newData.experience];
      if (expField === "bullets") {
        const bulletIdx = parseInt(fields[3]);
        newData.experience[expIdx] = { 
          ...newData.experience[expIdx],
          bullets: newData.experience[expIdx].bullets.map((b, i) => i === bulletIdx ? value : b)
        };
      } else {
        newData.experience[expIdx] = { ...newData.experience[expIdx], [expField]: value };
      }
    } else if (fields[0] === "education") {
      const eduIdx = parseInt(fields[1]);
      const eduField = fields[2];
      newData.education = [...newData.education];
      newData.education[eduIdx] = { ...newData.education[eduIdx], [eduField]: value };
    }
    
    onDataChange(newData);
  }, [data, onDataChange]);

  // Handle skill category name change
  const handleSkillCategoryChange = useCallback((categoryIndex: number, newCategory: string) => {
    if (!onDataChange || !data.skills) return;
    
    const newData = { ...data };
    newData.skills = [...newData.skills];
    newData.skills[categoryIndex] = { ...newData.skills[categoryIndex], category: newCategory };
    onDataChange(newData);
  }, [data, onDataChange]);

  // Handle skill items change (add/remove skills)
  const handleSkillItemsChange = useCallback((categoryIndex: number, newItems: string[]) => {
    if (!onDataChange || !data.skills) return;
    
    const newData = { ...data };
    newData.skills = [...newData.skills];
    newData.skills[categoryIndex] = { ...newData.skills[categoryIndex], items: newItems };
    onDataChange(newData);
  }, [data, onDataChange]);

  // Handle bullet reordering within an experience entry
  const handleBulletReorder = useCallback((expIdx: number, oldBulletIdx: number, newBulletIdx: number) => {
    if (!onDataChange) return;
    
    const newData = { ...data };
    newData.experience = [...newData.experience];
    const exp = { ...newData.experience[expIdx] };
    exp.bullets = arrayMove(exp.bullets, oldBulletIdx, newBulletIdx);
    newData.experience[expIdx] = exp;
    
    onDataChange(newData);
  }, [data, onDataChange]);

  // Get background style based on selected background
  const getBackgroundStyle = (backgroundType?: string): React.CSSProperties => {
    const bgType = backgroundType || "none";
    
    const patterns: Record<string, React.CSSProperties> = {
      "none": { background: "white" },
      "solid-green": { background: "#10b981" },
      "hexagons": { 
        background: "white",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='28' height='49' viewBox='0 0 28 49' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Cpolygon fill-rule='evenodd' points='13.99 9.25 13.99 1 16.99 0 18.99 0 18.99 9.25 13.99 9.25'/%3E%3Cpolygon fill-rule='evenodd' points='13.99 41.25 13.99 49 16.99 49 18.99 49 18.99 41.25 13.99 41.25'/%3E%3C/g%3E%3C/svg%3E")` 
      },
      "waves": { 
        background: "white",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23e5e7eb' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` 
      },
      "triangles": { 
        background: "white",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='36' height='72' viewBox='0 0 36 72' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Cpath d='M2 6h12L8 18 2 6zm18 36h12l-6 12-6-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      },
      "diagonal": { 
        background: "white",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` 
      },
      "grid": { 
        background: "white",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
      },
      "dots": { 
        background: "white",
        backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
        backgroundSize: "20px 20px"
      },
      "curves-light": { background: "#f9fafb" },
      "curves-dark": { background: "#f3f4f6" },
      "dashed": { 
        background: "white",
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, #e5e7eb 10px, #e5e7eb 20px)` 
      },
      "zigzag": { 
        background: "white",
        backgroundImage: `linear-gradient(135deg, #e5e7eb 25%, transparent 25%), linear-gradient(225deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(315deg, #e5e7eb 25%, white 25%)`,
        backgroundPosition: "10px 0, 10px 0, 0 0, 0 0",
        backgroundSize: "20px 20px",
        backgroundRepeat: "repeat"
      },
      "circles": { 
        background: "white",
        backgroundImage: `radial-gradient(circle at 25px 25px, #e5e7eb 2%, transparent 0%), radial-gradient(circle at 75px 75px, #e5e7eb 2%, transparent 0%)`,
        backgroundSize: "100px 100px"
      },
      "gradient-blue": { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
      "gradient-tech": { background: "linear-gradient(135deg, #667eea 0%, #64b3f4 100%)" },
      "gradient-minimal": { background: "#fafafa" },
      "solid-mint": { background: "#f0fdfa" },
      "solid-beige": { background: "#fffbeb" },
      "gradient-rainbow": { background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)" },
    };
    
    return patterns[bgType] || patterns["none"];
  };

  // Default design settings with background support
  const settings: DesignSettings = designSettings || {
    fontFamily: "'Inter', sans-serif",
    fontSize: 100,
    lineSpacing: 1.4,
    sectionSpacing: 20,
    accentColor: template.accentColor,
    layout: template.layout as DesignSettings["layout"],
    background: "none",
  };

  return (
    <div className="flex-1 flex flex-col bg-muted/20 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center font-mono">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <div className="w-px h-5 bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleFitToPage} title="Fit to Page">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" size="icon" className="h-8 w-8"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="ghost" size="icon" className="h-8 w-8"
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
        className="flex-1 overflow-auto flex justify-center items-start p-4 sm:p-6 lg:p-8"
        style={{
          background: `
            radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.03) 0%, transparent 50%),
            linear-gradient(180deg, hsl(var(--muted) / 0.3) 0%, hsl(var(--background)) 100%)
          `
        }}
      >
        <div 
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out'
          }}
        >
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Paper with proper A4 aspect ratio and background */}
            <div 
              className="relative rounded-sm overflow-hidden"
              style={{
                width: `${A4_WIDTH}px`,
                height: `${A4_HEIGHT}px`,
                aspectRatio: `${A4_WIDTH} / ${A4_HEIGHT}`,
                boxShadow: `
                  0 25px 50px -12px rgba(0, 0, 0, 0.25),
                  0 12px 25px -8px rgba(0, 0, 0, 0.15),
                  0 0 0 1px rgba(0, 0, 0, 0.05)
                `,
                ...getBackgroundStyle(settings.background),
              }}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleSectionDragEnd}
              >
                <InlineResumeDocument 
                  template={template}
                  data={data}
                  settings={settings}
                  sectionOrder={sectionOrder}
                  onFieldChange={handleFieldChange}
                  onBulletReorder={handleBulletReorder}
                  onSkillCategoryChange={handleSkillCategoryChange}
                  onSkillItemsChange={handleSkillItemsChange}
                />
              </DndContext>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="hidden sm:flex items-center justify-between px-4 py-2 border-t border-border/50 bg-card/50 backdrop-blur-sm flex-shrink-0">
        <span className="text-xs text-muted-foreground">
          {template.name} • A4 • Slate.js Editor • Drag sections & bullets to reorder
        </span>
        <span className="text-xs text-muted-foreground">
          Auto-saved
        </span>
      </div>
    </div>
  );
};

// Inline Editable Resume Document with Slate
interface InlineResumeDocumentProps {
  template: TemplateConfig;
  data: ResumeData;
  settings: DesignSettings;
  sectionOrder: string[];
  onFieldChange: (field: string, value: string) => void;
  onBulletReorder: (expIdx: number, oldIdx: number, newIdx: number) => void;
  onSkillCategoryChange: (categoryIndex: number, newCategory: string) => void;
  onSkillItemsChange: (categoryIndex: number, newItems: string[]) => void;
}

// Experience entry with sortable bullets
interface ExperienceEntryProps {
  exp: ResumeData["experience"][0];
  expIdx: number;
  accentColor: string;
  onFieldChange: (field: string, value: string) => void;
  onBulletReorder: (expIdx: number, oldIdx: number, newIdx: number) => void;
}

const ExperienceEntry = ({ exp, expIdx, accentColor, onFieldChange, onBulletReorder }: ExperienceEntryProps) => {
  const bulletIds = exp.bullets.map((_, idx) => `bullet-${exp.id}-${idx}`);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleBulletDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIdx = bulletIds.indexOf(String(active.id));
    const newIdx = bulletIds.indexOf(String(over.id));
    
    if (oldIdx !== -1 && newIdx !== -1) {
      onBulletReorder(expIdx, oldIdx, newIdx);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-baseline">
        <SlateInlineField
          value={exp.position}
          onChange={(value) => onFieldChange(`experience.${expIdx}.position`, value)}
          placeholder="Job Title"
          accentColor={accentColor}
          className="font-bold text-gray-900 text-[12pt]"
        />
        <span className="text-[9pt] text-gray-500 font-medium shrink-0 ml-2">
          {exp.startDate} — {exp.current ? "Present" : exp.endDate}
        </span>
      </div>
      <div className="flex justify-between items-baseline mb-1">
        <SlateInlineField
          value={exp.company}
          onChange={(value) => onFieldChange(`experience.${expIdx}.company`, value)}
          placeholder="Company Name"
          accentColor={accentColor}
          className="font-semibold text-[10pt]"
          style={{ color: accentColor }}
        />
        <span className="text-[9pt] text-gray-500 shrink-0 ml-2">{exp.location}</span>
      </div>
      
      {/* Sortable Bullets */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleBulletDragEnd}
      >
        <SortableContext items={bulletIds} strategy={verticalListSortingStrategy}>
          <ul className="space-y-1 mt-2 pl-4">
            {exp.bullets.map((bullet, bulletIdx) => (
              <SortableBullet
                key={`bullet-${exp.id}-${bulletIdx}`}
                id={`bullet-${exp.id}-${bulletIdx}`}
                bullet={bullet}
                expIdx={expIdx}
                bulletIdx={bulletIdx}
                accentColor={accentColor}
                role={exp.position}
                onFieldChange={onFieldChange}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

const InlineResumeDocument = ({ 
  template, 
  data, 
  settings, 
  sectionOrder,
  onFieldChange,
  onBulletReorder,
  onSkillCategoryChange,
  onSkillItemsChange,
}: InlineResumeDocumentProps) => {
  const accentColor = settings.accentColor || template.accentColor;
  const sectionGap = settings.sectionSpacing;

  // Render sections in order
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "summary":
        return (
          <SectionWrapper
            key="summary"
            id="summary"
            title="Professional Summary"
            accentColor={accentColor}
          >
            <SlateInlineField
              value={data.summary}
              onChange={(value) => onFieldChange("summary", value)}
              role={data.personalInfo.title}
              multiline
              accentColor={accentColor}
              className="text-gray-700 leading-relaxed text-[10pt]"
              placeholder="Write a compelling professional summary..."
            />
          </SectionWrapper>
        );

      case "skills":
        if (!data.skills?.length) return null;
        return (
          <SectionWrapper
            key="skills"
            id="skills"
            title="Core Skills"
            accentColor={accentColor}
          >
            <div className="space-y-2">
              {data.skills.map((cat, i) => (
                <SkillTokenEditor
                  key={i}
                  category={cat.category}
                  items={cat.items}
                  categoryIndex={i}
                  accentColor={accentColor}
                  onCategoryChange={onSkillCategoryChange}
                  onItemsChange={onSkillItemsChange}
                />
              ))}
            </div>
          </SectionWrapper>
        );

      case "experience":
        return (
          <SectionWrapper
            key="experience"
            id="experience"
            title="Professional Experience"
            accentColor={accentColor}
          >
            <div className="space-y-4">
              {data.experience.map((exp, expIdx) => (
                <ExperienceEntry
                  key={exp.id}
                  exp={exp}
                  expIdx={expIdx}
                  accentColor={accentColor}
                  onFieldChange={onFieldChange}
                  onBulletReorder={onBulletReorder}
                />
              ))}
            </div>
          </SectionWrapper>
        );

      case "education":
        return (
          <SectionWrapper
            key="education"
            id="education"
            title="Education"
            accentColor={accentColor}
          >
            <div className="space-y-3">
              {data.education.map((edu, eduIdx) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <SlateInlineField
                      value={edu.degree}
                      onChange={(value) => onFieldChange(`education.${eduIdx}.degree`, value)}
                      placeholder="Degree"
                      accentColor={accentColor}
                      className="font-bold text-gray-900 text-[11pt]"
                    />
                    <span className="text-[9pt] text-gray-500 shrink-0 ml-2">
                      {edu.startDate} — {edu.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <SlateInlineField
                      value={edu.school}
                      onChange={(value) => onFieldChange(`education.${eduIdx}.school`, value)}
                      placeholder="School Name"
                      accentColor={accentColor}
                      className="text-[10pt]"
                      style={{ color: accentColor }}
                    />
                    <span className="text-[9pt] text-gray-500 shrink-0 ml-2">{edu.location}</span>
                  </div>
                  {edu.gpa && (
                    <p className="text-[9pt] text-gray-600 mt-0.5">GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </div>
          </SectionWrapper>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="h-full overflow-hidden p-8"
      style={{ 
        fontFamily: settings.fontFamily,
        lineHeight: settings.lineSpacing,
      }}
    >
      {/* Header - Always at top, not draggable */}
      <header className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: accentColor }}>
        <SlateInlineField
          value={data.personalInfo.name}
          onChange={(value) => onFieldChange("personalInfo.name", value)}
          placeholder="Your Name"
          accentColor={accentColor}
          className="text-2xl font-bold text-gray-900 block"
        />
        <SlateInlineField
          value={data.personalInfo.title}
          onChange={(value) => onFieldChange("personalInfo.title", value)}
          placeholder="Your Title"
          accentColor={accentColor}
          className="text-sm font-medium mt-1 block"
          style={{ color: accentColor }}
        />
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-[9pt] text-gray-600">
          <span>{data.personalInfo.email}</span>
          <span>•</span>
          <span>{data.personalInfo.phone}</span>
          <span>•</span>
          <span>{data.personalInfo.location}</span>
          {data.personalInfo.linkedin && (
            <>
              <span>•</span>
              <span>{data.personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </header>

      {/* Draggable Sections */}
      <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: `${sectionGap}px` }}>
          {sectionOrder.map(renderSection)}
        </div>
      </SortableContext>
    </div>
  );
};

export default LiveResumeCanvas;
