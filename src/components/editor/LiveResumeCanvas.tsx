import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Eye, Edit3, 
  Lock, Unlock, GripVertical, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeData, TemplateConfig } from "@/types/resume";
import { DesignSettings } from "./DesignPanel";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SectionWrapper from "./SectionWrapper";
import InlineEditableField from "./InlineEditableField";

// A4 dimensions at 96 DPI (LOCKED - DO NOT CHANGE)
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

// Section order (ATS guardrails)
const SECTION_ORDER = ["header", "summary", "skills", "experience", "education", "certifications", "projects"];

interface SectionLockState {
  header: boolean;
  summary: boolean;
  skills: boolean;
  experience: boolean;
  education: boolean;
  certifications: boolean;
  projects: boolean;
}

interface LiveResumeCanvasProps {
  template: TemplateConfig;
  data: ResumeData;
  designSettings?: DesignSettings;
  onDataChange?: (data: ResumeData) => void;
  onAiImprove?: (field: string, content: string) => void;
  mode?: "edit" | "preview" | "recruiter";
  sectionOrder?: string[];
  onSectionOrderChange?: (order: string[]) => void;
}

const LiveResumeCanvas = ({ 
  template, 
  data, 
  designSettings,
  onDataChange,
  onAiImprove,
  mode = "edit",
  sectionOrder: externalSectionOrder,
  onSectionOrderChange,
}: LiveResumeCanvasProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(0.75);
  const totalPages = template.pages;
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"edit" | "preview">(mode === "recruiter" ? "preview" : "edit");
  
  // Section locks - Header locked by default
  const [sectionLocks, setSectionLocks] = useState<SectionLockState>({
    header: true,
    summary: false,
    skills: false,
    experience: false,
    education: false,
    certifications: false,
    projects: false,
  });

  // Section order for drag & drop
  const [sectionOrder, setSectionOrder] = useState<string[]>(
    externalSectionOrder || ["summary", "skills", "experience", "education"]
  );

  // DnD sensors
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

  // Calculate optimal zoom
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 64;
      const containerHeight = container.clientHeight - 64;
      const fitWidth = containerWidth / A4_WIDTH;
      const fitHeight = containerHeight / A4_HEIGHT;
      const optimalZoom = Math.min(fitWidth, fitHeight, 1);
      setZoom(Math.max(0.5, Math.min(optimalZoom, 0.95)));
    }
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const handleFitToPage = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 64;
      const containerHeight = container.clientHeight - 64;
      const fitWidth = containerWidth / A4_WIDTH;
      const fitHeight = containerHeight / A4_HEIGHT;
      setZoom(Math.min(fitWidth, fitHeight, 1));
    }
  };

  // Toggle section lock
  const toggleSectionLock = (section: keyof SectionLockState) => {
    setSectionLocks(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle section drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over.id as string);
      
      // ATS guardrail: Experience cannot go below Education
      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      const expIdx = newOrder.indexOf("experience");
      const eduIdx = newOrder.indexOf("education");
      if (expIdx > eduIdx && newOrder.includes("experience") && newOrder.includes("education")) {
        // Revert - experience must be before education
        return;
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
    }
    
    onDataChange(newData);
  }, [data, onDataChange]);

  // Handle AI improvement request
  const handleAiImprove = useCallback((field: string, content: string) => {
    onAiImprove?.(field, content);
  }, [onAiImprove]);

  // Default design settings
  const settings: DesignSettings = designSettings || {
    fontFamily: "'Inter', sans-serif",
    fontSize: 100,
    lineSpacing: 1.4,
    sectionSpacing: 20,
    accentColor: template.accentColor,
    layout: template.layout as DesignSettings["layout"],
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

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "edit" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("edit")}
            className="h-8 text-xs"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>
          <Button
            variant={viewMode === "preview" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("preview")}
            className="h-8 text-xs"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Preview
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto flex justify-center items-start p-8"
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
            {/* Paper with Shadow */}
            <div 
              className="relative bg-white rounded-sm"
              style={{
                width: `${A4_WIDTH}px`,
                height: `${A4_HEIGHT}px`,
                boxShadow: `
                  0 25px 50px -12px rgba(0, 0, 0, 0.25),
                  0 12px 25px -8px rgba(0, 0, 0, 0.15),
                  0 0 0 1px rgba(0, 0, 0, 0.05)
                `,
              }}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <InlineResumeDocument 
                  template={template}
                  data={data}
                  settings={settings}
                  viewMode={viewMode}
                  sectionLocks={sectionLocks}
                  sectionOrder={sectionOrder}
                  onToggleLock={toggleSectionLock}
                  onFieldChange={handleFieldChange}
                  onAiImprove={handleAiImprove}
                />
              </DndContext>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border/50 bg-card/50 backdrop-blur-sm flex-shrink-0">
        <span className="text-xs text-muted-foreground">
          {template.name} • A4 ({A4_WIDTH}×{A4_HEIGHT}px) • Click anywhere to edit • Drag sections to reorder
        </span>
        <span className="text-xs text-muted-foreground">
          Last saved: Just now
        </span>
      </div>
    </div>
  );
};

// Inline Editable Resume Document
interface InlineResumeDocumentProps {
  template: TemplateConfig;
  data: ResumeData;
  settings: DesignSettings;
  viewMode: "edit" | "preview";
  sectionLocks: SectionLockState;
  sectionOrder: string[];
  onToggleLock: (section: keyof SectionLockState) => void;
  onFieldChange: (field: string, value: string) => void;
  onAiImprove: (field: string, content: string) => void;
}

const InlineResumeDocument = ({ 
  template, 
  data, 
  settings, 
  viewMode,
  sectionLocks,
  sectionOrder,
  onToggleLock,
  onFieldChange,
  onAiImprove,
}: InlineResumeDocumentProps) => {
  const accentColor = settings.accentColor || template.accentColor;
  const fontScale = settings.fontSize / 100;
  const lineHeight = settings.lineSpacing;
  const sectionGap = settings.sectionSpacing;
  const isEditing = viewMode === "edit";

  const baseStyles = {
    fontFamily: settings.fontFamily,
    fontSize: `${11 * fontScale}pt`,
    lineHeight: lineHeight,
    color: '#1f2937',
  };

  // Render sections in order
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "summary":
        return (
          <SectionWrapper
            key="summary"
            id="summary"
            title="Professional Summary"
            locked={sectionLocks.summary}
            onToggleLock={() => onToggleLock("summary")}
            onAiImprove={isEditing ? () => onAiImprove("summary", data.summary) : undefined}
            accentColor={accentColor}
            isDraggable={isEditing}
          >
            <InlineEditableField
              value={data.summary}
              onChange={(value) => onFieldChange("summary", value)}
              fieldType="textarea"
              locked={sectionLocks.summary || !isEditing}
              role={data.personalInfo.title}
              multiline
              className="text-gray-700 leading-relaxed"
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
            locked={sectionLocks.skills}
            onToggleLock={() => onToggleLock("skills")}
            accentColor={accentColor}
            isDraggable={isEditing}
          >
            <div className="space-y-2">
              {data.skills.map((cat, i) => (
                <div key={i} className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[9pt] font-semibold text-gray-700 min-w-[80px]">{cat.category}:</span>
                  <div className="flex flex-wrap gap-1">
                    {cat.items.map((skill, j) => (
                      <span 
                        key={j}
                        className="px-2 py-0.5 text-[8pt] rounded text-gray-700"
                        style={{ backgroundColor: `${accentColor}15` }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
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
            locked={sectionLocks.experience}
            onToggleLock={() => onToggleLock("experience")}
            onAiImprove={isEditing ? () => onAiImprove("experience", JSON.stringify(data.experience)) : undefined}
            accentColor={accentColor}
            isDraggable={isEditing}
          >
            <div className="space-y-4">
              {data.experience.map((exp, expIdx) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <InlineEditableField
                      value={exp.position}
                      onChange={(value) => onFieldChange(`experience.${expIdx}.position`, value)}
                      fieldType="text"
                      locked={sectionLocks.experience || !isEditing}
                      className="font-bold text-gray-900 text-[12pt]"
                    />
                    <span className="text-[9pt] text-gray-500 font-medium">
                      {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                    <InlineEditableField
                      value={exp.company}
                      onChange={(value) => onFieldChange(`experience.${expIdx}.company`, value)}
                      fieldType="text"
                      locked={sectionLocks.experience || !isEditing}
                      className="font-semibold text-[10pt]"
                      style={{ color: accentColor }}
                    />
                    <span className="text-[9pt] text-gray-500">{exp.location}</span>
                  </div>
                  <ul className="space-y-1 mt-2">
                    {exp.bullets.map((bullet, bulletIdx) => (
                      <li key={bulletIdx} className="flex text-gray-700 text-[10pt]">
                        <span className="mr-2 text-gray-400">▸</span>
                        <InlineEditableField
                          value={bullet}
                          onChange={(value) => onFieldChange(`experience.${expIdx}.bullets.${bulletIdx}`, value)}
                          fieldType="bullet"
                          locked={sectionLocks.experience || !isEditing}
                          role={exp.position}
                          className="flex-1"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
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
            locked={sectionLocks.education}
            onToggleLock={() => onToggleLock("education")}
            accentColor={accentColor}
            isDraggable={isEditing}
          >
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <h3 className="font-bold text-gray-900 text-[11pt]">{edu.school}</h3>
                <p className="text-gray-600 text-[10pt]">{edu.degree} in {edu.field}</p>
                <p className="text-gray-500 text-[9pt]">
                  {edu.startDate} — {edu.endDate} {edu.gpa && `| GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </SectionWrapper>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full p-10 overflow-hidden" style={baseStyles}>
      {/* Header - Always first, not draggable */}
      <div 
        className={`text-center pb-5 border-b-2 mb-5 relative group ${sectionLocks.header ? "opacity-90" : ""}`}
        style={{ borderColor: accentColor }}
      >
        {/* Lock indicator */}
        {isEditing && (
          <button
            onClick={() => onToggleLock("header")}
            className={`absolute top-0 right-0 p-1 rounded transition-opacity ${
              sectionLocks.header 
                ? "opacity-100 text-amber-500" 
                : "opacity-0 group-hover:opacity-100 text-muted-foreground"
            }`}
            title={sectionLocks.header ? "Unlock header" : "Lock header"}
          >
            {sectionLocks.header ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
        )}

        {template.hasPhoto && data.personalInfo.photo && (
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-2 shadow-md" 
            style={{ borderColor: accentColor }}
          >
            <img src={data.personalInfo.photo} alt={data.personalInfo.name} className="w-full h-full object-cover" />
          </div>
        )}
        
        <InlineEditableField
          value={data.personalInfo.name}
          onChange={(value) => onFieldChange("personalInfo.name", value)}
          fieldType="text"
          locked={sectionLocks.header || !isEditing}
          className="font-bold text-gray-900 text-[24pt] text-center w-full block"
        />
        
        <InlineEditableField
          value={data.personalInfo.title}
          onChange={(value) => onFieldChange("personalInfo.title", value)}
          fieldType="text"
          locked={sectionLocks.header || !isEditing}
          className="font-semibold text-[12pt] text-center w-full block mb-3"
          style={{ color: accentColor }}
        />
        
        <div className="flex flex-wrap justify-center gap-4 text-gray-600 text-[9pt]">
          <span>✉ {data.personalInfo.email}</span>
          <span>•</span>
          <span>☎ {data.personalInfo.phone}</span>
          <span>•</span>
          <span>📍 {data.personalInfo.location}</span>
        </div>
      </div>

      {/* Sortable Sections */}
      <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
        <div style={{ display: "flex", flexDirection: "column", gap: `${sectionGap}px` }}>
          {sectionOrder.map(sectionId => renderSection(sectionId))}
        </div>
      </SortableContext>
    </div>
  );
};

export default LiveResumeCanvas;
