import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2,
  GripVertical, Camera, Eye, EyeOff, Upload, Trash2,
  Download, FileText, FileSpreadsheet, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResumeData, TemplateConfig } from "@/types/resume";
import { DesignSettings } from "../DesignPanel";
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
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useResumeCanvasStore } from "@/stores/resumeCanvasStore";
import InlineEditableField from "./InlineEditableField";
import DraggableExperienceEntry from "./DraggableExperienceEntry";
import LiveATSWidget from "./LiveATSWidget";

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;
const A4_PADDING = 28;

// Section titles
const SECTION_TITLES: Record<string, string> = {
  summary: "PROFESSIONAL SUMMARY",
  experience: "PROFESSIONAL EXPERIENCE",
  skills: "SKILLS",
  education: "EDUCATION",
  projects: "PROJECTS",
  certifications: "CERTIFICATIONS",
  awards: "AWARDS & ACHIEVEMENTS",
  languages: "LANGUAGES",
  publications: "PUBLICATIONS",
  volunteering: "VOLUNTEERING",
  additional_experience: "ADDITIONAL EXPERIENCE",
  leadership: "LEADERSHIP & MANAGEMENT",
  consulting: "CONSULTING & FREELANCE",
  teaching: "TEACHING & MENTORING",
  interests: "INTERESTS",
  training: "TRAINING & COURSES",
  books_talks: "BOOKS & TALKS",
};

interface InlineSlateCanvasProps {
  template: TemplateConfig;
  data: ResumeData;
  designSettings?: DesignSettings;
  onDataChange?: (data: ResumeData) => void;
  readOnly?: boolean;
  sectionOrder?: string[];
  onSectionOrderChange?: (order: string[]) => void;
  onExportPDF?: () => void;
  atsScore?: number;
  atsAnimatedScore?: number;
  atsBreakdown?: any;
  atsFeedback?: any;
  atsSectionSignals?: any[];
  atsIsHighScore?: boolean;
}

// Draggable Section Wrapper
interface DraggableSectionProps {
  id: string;
  children: React.ReactNode;
  readOnly?: boolean;
  isActive?: boolean;
  onActivate?: () => void;
}

const DraggableSection = ({ id, children, readOnly, isActive, onActivate }: DraggableSectionProps) => {
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
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isActive ? 'ring-2 ring-primary/30 rounded' : ''}`}
      onClick={onActivate}
    >
      {!readOnly && (
        <button
          {...attributes}
          {...listeners}
          className="absolute -left-7 top-1 h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary rounded hover:bg-primary/10"
          title="Drag to reorder section"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
      )}
      {children}
    </div>
  );
};

// Photo Controls Component
interface PhotoControlsProps {
  photo?: string;
  showPhoto: boolean;
  onTogglePhoto: () => void;
  onUploadPhoto: () => void;
  onRemovePhoto: () => void;
  accentColor: string;
}

const PhotoControls = ({
  photo,
  showPhoto,
  onTogglePhoto,
  onUploadPhoto,
  onRemovePhoto,
  accentColor
}: PhotoControlsProps) => {
  if (!showPhoto && photo) {
    return (
      <button
        onClick={onTogglePhoto}
        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
        title="Show photo"
      >
        <Eye className="w-4 h-4 text-muted-foreground" />
      </button>
    );
  }

  if (!showPhoto && !photo) {
    return (
      <button
        onClick={onUploadPhoto}
        className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 flex flex-col items-center justify-center gap-0.5 transition-colors bg-muted/30 hover:bg-muted/50"
        title="Upload photo"
      >
        <Camera className="w-4 h-4 text-muted-foreground" />
        <span className="text-[7px] text-muted-foreground">Photo</span>
      </button>
    );
  }

  return (
    <div className="photo-controls-wrapper group/photo relative">
      {showPhoto && photo ? (
        <div className="relative">
          <img
            src={photo}
            alt="Profile"
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${accentColor}`,
            }}
          />
          <div className="absolute -right-1 -bottom-1 flex gap-0.5 opacity-0 group-hover/photo:opacity-100 transition-opacity">
            <button
              onClick={onTogglePhoto}
              className="p-1 rounded-full bg-card shadow-md hover:bg-muted transition-colors border border-border"
              title="Hide photo"
            >
              <EyeOff className="w-3 h-3 text-muted-foreground" />
            </button>
            <button
              onClick={onRemovePhoto}
              className="p-1 rounded-full bg-card shadow-md hover:bg-destructive/10 transition-colors border border-border"
              title="Remove photo"
            >
              <Trash2 className="w-3 h-3 text-destructive" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={onUploadPhoto}
          className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 flex flex-col items-center justify-center gap-0.5 transition-colors bg-muted/30 hover:bg-muted/50"
          title="Upload photo"
        >
          <Camera className="w-4 h-4 text-muted-foreground" />
          <span className="text-[7px] text-muted-foreground">Photo</span>
        </button>
      )}
    </div>
  );
};

const InlineSlateCanvas = ({
  template,
  data,
  designSettings,
  onDataChange,
  readOnly = false,
  sectionOrder: externalSectionOrder,
  onSectionOrderChange,
  onExportPDF,
  atsScore = 0,
  atsAnimatedScore = 0,
  atsBreakdown = { structure: 0, keywords: 0, content: 0, readability: 0, completeness: 0 },
  atsFeedback = null,
  atsSectionSignals = [],
  atsIsHighScore = false,
}: InlineSlateCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    zoom, setZoom, 
    showPhoto, setShowPhoto, 
    isPreviewMode, setPreviewMode,
    activeSection, setActiveSection 
  } = useResumeCanvasStore();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sectionOrder, setSectionOrder] = useState<string[]>(
    externalSectionOrder || ["summary", "experience", "skills", "education"]
  );
  const resumeContentRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Sync external section order
  useEffect(() => {
    if (externalSectionOrder) {
      setSectionOrder(externalSectionOrder);
    }
  }, [externalSectionOrder]);

  // Calculate optimal zoom and page count
  useEffect(() => {
    const calculateZoom = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 100;
        const containerHeight = containerRef.current.clientHeight - 100;
        const fitWidth = containerWidth / A4_WIDTH;
        const fitHeight = containerHeight / A4_HEIGHT;
        setZoom(Math.max(0.4, Math.min(Math.min(fitWidth, fitHeight), 0.85)));
      }
    };
    
    const calculatePages = () => {
      if (resumeContentRef.current) {
        const contentHeight = resumeContentRef.current.scrollHeight;
        const pages = Math.max(1, Math.ceil(contentHeight / (A4_HEIGHT - A4_PADDING * 2)));
        setTotalPages(pages);
      }
    };
    
    calculateZoom();
    calculatePages();
    
    window.addEventListener("resize", calculateZoom);
    
    // Recalculate pages when data changes
    const observer = new ResizeObserver(calculatePages);
    if (resumeContentRef.current) {
      observer.observe(resumeContentRef.current);
    }
    
    return () => {
      window.removeEventListener("resize", calculateZoom);
      observer.disconnect();
    };
  }, [setZoom, data, sectionOrder]);

  // Handle section drag end
  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sectionOrder.indexOf(String(active.id));
    const newIndex = sectionOrder.indexOf(String(over.id));

    if (oldIndex === -1 || newIndex === -1) return;

    // ATS guardrail: Experience must be before Education
    const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
    const expIdx = newOrder.indexOf("experience");
    const eduIdx = newOrder.indexOf("education");
    if (expIdx > eduIdx && newOrder.includes("experience") && newOrder.includes("education")) {
      return;
    }

    setSectionOrder(newOrder);
    onSectionOrderChange?.(newOrder);
  };

  // Handle experience entry drag end
  const handleExperienceDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onDataChange) return;

    const oldIndex = data.experience.findIndex(e => e.id === active.id);
    const newIndex = data.experience.findIndex(e => e.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newExperience = arrayMove(data.experience, oldIndex, newIndex);
      onDataChange({ ...data, experience: newExperience });
    }
  };

  // Handle data field changes
  const handleFieldChange = useCallback((path: string, value: any) => {
    if (!onDataChange) return;
    
    const newData = { ...data };
    const keys = path.split(".");
    let current: any = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    onDataChange(newData);
  }, [data, onDataChange]);

  // Handle experience entry change
  const handleExperienceChange = useCallback((index: number, entry: any) => {
    if (!onDataChange) return;
    const newExperience = [...data.experience];
    newExperience[index] = entry;
    onDataChange({ ...data, experience: newExperience });
  }, [data, onDataChange]);

  // Handle experience entry delete
  const handleExperienceDelete = useCallback((index: number) => {
    if (!onDataChange || data.experience.length <= 1) return;
    const newExperience = data.experience.filter((_, i) => i !== index);
    onDataChange({ ...data, experience: newExperience });
  }, [data, onDataChange]);

  // Add new experience entry
  const handleAddExperience = useCallback(() => {
    if (!onDataChange) return;
    const newEntry = {
      id: `exp-${Date.now()}`,
      company: "Company Name",
      position: "Job Title",
      location: "Location",
      startDate: "Jan 2024",
      endDate: "Present",
      current: true,
      bullets: ["Add your key achievement or responsibility here"],
    };
    onDataChange({ ...data, experience: [...data.experience, newEntry] });
  }, [data, onDataChange]);

  // Photo handlers
  const handleTogglePhoto = () => setShowPhoto(!showPhoto);
  const handleUploadPhoto = () => fileInputRef.current?.click();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onDataChange) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onDataChange({
          ...data,
          personalInfo: { ...data.personalInfo, photo: reader.result as string }
        });
        setShowPhoto(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    if (onDataChange) {
      onDataChange({
        ...data,
        personalInfo: { ...data.personalInfo, photo: undefined }
      });
      setShowPhoto(false);
    }
  };

  // Settings
  const settings = designSettings || {
    fontFamily: "'Inter', sans-serif",
    fontSize: 100,
    lineSpacing: 1.4,
    sectionSpacing: 20,
    accentColor: template.accentColor,
    layout: template.layout,
  };

  const accentColor = settings.accentColor || template.accentColor || "#2563eb";
  const shouldShowPhotoArea = !readOnly || (showPhoto && data.personalInfo.photo);
  const isEditable = !readOnly && !isPreviewMode;

  // Zoom controls
  const handleZoomIn = () => setZoom(zoom + 0.1);
  const handleZoomOut = () => setZoom(zoom - 0.1);
  const handleFitToPage = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 100;
      const containerHeight = containerRef.current.clientHeight - 100;
      const fitWidth = containerWidth / A4_WIDTH;
      const fitHeight = containerHeight / A4_HEIGHT;
      setZoom(Math.min(fitWidth, fitHeight, 1));
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-muted/20 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-card/80 backdrop-blur-sm flex-shrink-0">
        {/* Left: Zoom Controls */}
        <div className="flex items-center gap-1">
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

        {/* Center: Page Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Right: Preview & Download */}
        <div className="flex items-center gap-2">
          <Button
            variant={isPreviewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode(!isPreviewMode)}
            className="h-8"
          >
            <Eye className="w-4 h-4 mr-1.5" />
            {isPreviewMode ? "Edit" : "Preview"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="hero" size="sm" className="h-8">
                <Download className="w-4 h-4 mr-1.5" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onExportPDF}>
                <FileText className="w-4 h-4 mr-2" />
                Download as PDF
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download as DOCX
                <span className="ml-2 text-xs text-muted-foreground">(soon)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto flex justify-center items-start p-6 lg:p-8"
          style={{
            background: `
              radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.03) 0%, transparent 50%),
              linear-gradient(180deg, hsl(var(--muted) / 0.3) 0%, hsl(var(--background)) 100%)
            `,
          }}
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              transition: "transform 0.2s ease-out",
            }}
          >
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              data-resume-preview
            >
              {/* Resume Shell */}
              <div
                className="resume-shell relative rounded-sm overflow-hidden"
                style={{
                  width: `${A4_WIDTH}px`,
                  minHeight: `${A4_HEIGHT}px`,
                  background: "white",
                  boxShadow: `
                    0 25px 50px -12px rgba(0, 0, 0, 0.2),
                    0 12px 25px -8px rgba(0, 0, 0, 0.1),
                    0 0 0 1px rgba(0, 0, 0, 0.05)
                  `,
                }}
              >
                <div
                  ref={resumeContentRef}
                  className="resume-canvas"
                  style={{
                    padding: "28px 32px",
                    fontFamily: settings.fontFamily,
                    lineHeight: settings.lineSpacing,
                    minHeight: `${A4_HEIGHT - 56}px`,
                  }}
                >
                  {/* Header */}
                  <header
                    style={{
                      display: "grid",
                      gridTemplateColumns: shouldShowPhotoArea && (showPhoto && data.personalInfo.photo || !readOnly && !isPreviewMode)
                        ? "auto 1fr"
                        : "1fr",
                      gap: shouldShowPhotoArea ? "16px" : "0",
                      alignItems: "center",
                      marginBottom: "16px",
                      paddingBottom: "12px",
                      borderBottom: `2px solid ${accentColor}`,
                    }}
                  >
                    {/* Photo Controls */}
                    {isEditable && (
                      <PhotoControls
                        photo={data.personalInfo.photo}
                        showPhoto={showPhoto}
                        onTogglePhoto={handleTogglePhoto}
                        onUploadPhoto={handleUploadPhoto}
                        onRemovePhoto={handleRemovePhoto}
                        accentColor={accentColor}
                      />
                    )}
                    {!isEditable && showPhoto && data.personalInfo.photo && (
                      <img
                        src={data.personalInfo.photo}
                        alt="Profile"
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: `2px solid ${accentColor}`,
                        }}
                      />
                    )}

                    {/* Header Content */}
                    <div style={{ textAlign: shouldShowPhotoArea && (showPhoto && data.personalInfo.photo || isEditable) ? "left" : "center" }}>
                      <InlineEditableField
                        value={data.personalInfo.name}
                        onChange={(v) => handleFieldChange("personalInfo.name", v)}
                        placeholder="Your Name"
                        disabled={!isEditable}
                        style={{
                          fontSize: "22px",
                          fontWeight: 700,
                          color: "#111827",
                          marginBottom: "2px",
                          letterSpacing: "0.02em",
                        }}
                      />
                      <InlineEditableField
                        value={data.personalInfo.title}
                        onChange={(v) => handleFieldChange("personalInfo.title", v)}
                        placeholder="Professional Title"
                        disabled={!isEditable}
                        style={{
                          fontSize: "12px",
                          color: accentColor,
                          fontWeight: 500,
                        }}
                      />
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-[9px] text-gray-600">
                        <InlineEditableField
                          value={data.personalInfo.email}
                          onChange={(v) => handleFieldChange("personalInfo.email", v)}
                          placeholder="email@example.com"
                          disabled={!isEditable}
                          style={{ fontSize: "9px", color: "#4B5563" }}
                        />
                        <span>•</span>
                        <InlineEditableField
                          value={data.personalInfo.phone}
                          onChange={(v) => handleFieldChange("personalInfo.phone", v)}
                          placeholder="Phone"
                          disabled={!isEditable}
                          style={{ fontSize: "9px", color: "#4B5563" }}
                        />
                        <span>•</span>
                        <InlineEditableField
                          value={data.personalInfo.location}
                          onChange={(v) => handleFieldChange("personalInfo.location", v)}
                          placeholder="Location"
                          disabled={!isEditable}
                          style={{ fontSize: "9px", color: "#4B5563" }}
                        />
                      </div>
                    </div>
                  </header>

                  {/* Sections - Draggable */}
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
                    <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                      {sectionOrder.map((sectionId) => (
                        <DraggableSection
                          key={sectionId}
                          id={sectionId}
                          readOnly={!isEditable}
                          isActive={activeSection === sectionId}
                          onActivate={() => setActiveSection(sectionId)}
                        >
                          <div className="mb-5">
                            {/* Section Title */}
                            <h2
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                color: accentColor,
                                borderBottom: `1px solid ${accentColor}`,
                                paddingBottom: "4px",
                                marginBottom: "10px",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                              }}
                            >
                              {SECTION_TITLES[sectionId] || sectionId.toUpperCase()}
                            </h2>
                            
                            {/* Section Content */}
                            <div style={{ fontSize: "10px", lineHeight: 1.5, color: "#374151" }}>
                              {/* Summary Section */}
                              {sectionId === "summary" && (
                                <InlineEditableField
                                  value={data.summary}
                                  onChange={(v) => handleFieldChange("summary", v)}
                                  placeholder="Write a compelling 2-3 line summary of your professional experience..."
                                  disabled={!isEditable}
                                  multiline
                                  style={{
                                    fontSize: "10px",
                                    lineHeight: 1.5,
                                    color: "#374151",
                                  }}
                                />
                              )}
                              
                              {/* Experience Section - Nested DnD */}
                              {sectionId === "experience" && (
                                <DndContext
                                  sensors={sensors}
                                  collisionDetection={closestCenter}
                                  onDragEnd={handleExperienceDragEnd}
                                >
                                  <SortableContext
                                    items={data.experience.map(e => e.id)}
                                    strategy={verticalListSortingStrategy}
                                  >
                                    <AnimatePresence>
                                      {data.experience.map((exp, idx) => (
                                        <DraggableExperienceEntry
                                          key={exp.id}
                                          entry={exp}
                                          onChange={(entry) => handleExperienceChange(idx, entry)}
                                          onDelete={() => handleExperienceDelete(idx)}
                                          accentColor={accentColor}
                                          readOnly={!isEditable}
                                        />
                                      ))}
                                    </AnimatePresence>
                                  </SortableContext>
                                </DndContext>
                              )}
                              
                              {/* Add Experience Button */}
                              {sectionId === "experience" && isEditable && (
                                <button
                                  onClick={handleAddExperience}
                                  className="flex items-center gap-1 text-[9px] text-muted-foreground hover:text-primary transition-colors mt-2"
                                >
                                  <Plus className="w-3 h-3" />
                                  Add experience
                                </button>
                              )}
                              
                              {/* Skills Section */}
                              {sectionId === "skills" && data.skills && (
                                <div className="space-y-1.5">
                                  {data.skills.map((skillGroup, idx) => (
                                    <div key={idx} className="flex flex-wrap items-baseline gap-1">
                                      <InlineEditableField
                                        value={skillGroup.category}
                                        onChange={(v) => {
                                          const newSkills = [...data.skills];
                                          newSkills[idx] = { ...skillGroup, category: v };
                                          handleFieldChange("skills", newSkills);
                                        }}
                                        placeholder="Category"
                                        disabled={!isEditable}
                                        style={{
                                          fontWeight: 600,
                                          fontSize: "9px",
                                          color: "#374151",
                                        }}
                                      />
                                      <span className="text-[9px]">:</span>
                                      <InlineEditableField
                                        value={skillGroup.items.join(" · ")}
                                        onChange={(v) => {
                                          const newSkills = [...data.skills];
                                          newSkills[idx] = { ...skillGroup, items: v.split(" · ").map(s => s.trim()).filter(Boolean) };
                                          handleFieldChange("skills", newSkills);
                                        }}
                                        placeholder="Skill 1 · Skill 2 · Skill 3"
                                        disabled={!isEditable}
                                        style={{
                                          fontSize: "9px",
                                          color: "#374151",
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Education Section */}
                              {sectionId === "education" && data.education && (
                                <div className="space-y-3">
                                  {data.education.map((edu, idx) => (
                                    <div key={edu.id || idx}>
                                      <InlineEditableField
                                        value={`${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`}
                                        onChange={(v) => {
                                          const newEdu = [...data.education];
                                          const parts = v.split(" in ");
                                          newEdu[idx] = { ...edu, degree: parts[0], field: parts[1] || "" };
                                          handleFieldChange("education", newEdu);
                                        }}
                                        placeholder="Degree in Field"
                                        disabled={!isEditable}
                                        style={{
                                          fontWeight: 700,
                                          fontSize: "10px",
                                          color: "#111827",
                                        }}
                                      />
                                      <InlineEditableField
                                        value={edu.school}
                                        onChange={(v) => {
                                          const newEdu = [...data.education];
                                          newEdu[idx] = { ...edu, school: v };
                                          handleFieldChange("education", newEdu);
                                        }}
                                        placeholder="Institution Name"
                                        disabled={!isEditable}
                                        style={{
                                          fontSize: "10px",
                                          color: accentColor,
                                        }}
                                      />
                                      <div className="text-[9px] text-gray-500">
                                        <InlineEditableField
                                          value={edu.endDate}
                                          onChange={(v) => {
                                            const newEdu = [...data.education];
                                            newEdu[idx] = { ...edu, endDate: v };
                                            handleFieldChange("education", newEdu);
                                          }}
                                          placeholder="Graduation Year"
                                          disabled={!isEditable}
                                          style={{ fontSize: "9px", color: "#6B7280", display: "inline" }}
                                        />
                                        {edu.gpa && (
                                          <span>
                                            {" • GPA: "}
                                            <InlineEditableField
                                              value={edu.gpa}
                                              onChange={(v) => {
                                                const newEdu = [...data.education];
                                                newEdu[idx] = { ...edu, gpa: v };
                                                handleFieldChange("education", newEdu);
                                              }}
                                              placeholder="GPA"
                                              disabled={!isEditable}
                                              style={{ fontSize: "9px", color: "#6B7280", display: "inline" }}
                                            />
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Projects Section */}
                              {sectionId === "projects" && data.projects && (
                                <div className="space-y-3">
                                  {data.projects.map((project, idx) => (
                                    <div key={project.id || idx}>
                                      <InlineEditableField
                                        value={project.name}
                                        onChange={(v) => {
                                          const newProjects = [...(data.projects || [])];
                                          newProjects[idx] = { ...project, name: v };
                                          handleFieldChange("projects", newProjects);
                                        }}
                                        placeholder="Project Name"
                                        disabled={!isEditable}
                                        style={{
                                          fontWeight: 700,
                                          fontSize: "10px",
                                          color: "#111827",
                                        }}
                                      />
                                      <InlineEditableField
                                        value={project.description}
                                        onChange={(v) => {
                                          const newProjects = [...(data.projects || [])];
                                          newProjects[idx] = { ...project, description: v };
                                          handleFieldChange("projects", newProjects);
                                        }}
                                        placeholder="Project description"
                                        disabled={!isEditable}
                                        multiline
                                        style={{
                                          fontSize: "9px",
                                          color: "#374151",
                                          marginTop: "2px",
                                        }}
                                      />
                                      {project.technologies && (
                                        <div className="text-[9px] text-gray-500 mt-1">
                                          {project.technologies.join(" · ")}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Certifications Section */}
                              {sectionId === "certifications" && data.certifications && (
                                <div className="space-y-1">
                                  {data.certifications.map((cert, idx) => (
                                    <div key={cert.id || idx} className="flex items-baseline gap-1 text-[9px]">
                                      <InlineEditableField
                                        value={cert.name}
                                        onChange={(v) => {
                                          const newCerts = [...(data.certifications || [])];
                                          newCerts[idx] = { ...cert, name: v };
                                          handleFieldChange("certifications", newCerts);
                                        }}
                                        placeholder="Certification Name"
                                        disabled={!isEditable}
                                        style={{ fontWeight: 600, fontSize: "9px", color: "#111827" }}
                                      />
                                      <span>•</span>
                                      <InlineEditableField
                                        value={cert.issuer}
                                        onChange={(v) => {
                                          const newCerts = [...(data.certifications || [])];
                                          newCerts[idx] = { ...cert, issuer: v };
                                          handleFieldChange("certifications", newCerts);
                                        }}
                                        placeholder="Issuer"
                                        disabled={!isEditable}
                                        style={{ fontSize: "9px", color: "#374151" }}
                                      />
                                      <span>•</span>
                                      <InlineEditableField
                                        value={cert.date}
                                        onChange={(v) => {
                                          const newCerts = [...(data.certifications || [])];
                                          newCerts[idx] = { ...cert, date: v };
                                          handleFieldChange("certifications", newCerts);
                                        }}
                                        placeholder="Year"
                                        disabled={!isEditable}
                                        style={{ fontSize: "9px", color: "#6B7280" }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Languages Section */}
                              {sectionId === "languages" && data.languages && (
                                <div className="flex flex-wrap gap-2 text-[9px]">
                                  {data.languages.map((lang, idx) => (
                                    <span key={idx}>
                                      <InlineEditableField
                                        value={`${lang.language} (${lang.proficiency})`}
                                        onChange={(v) => {
                                          const match = v.match(/^(.+?)\s*\((.+?)\)$/);
                                          if (match) {
                                            const newLangs = [...(data.languages || [])];
                                            newLangs[idx] = { language: match[1], proficiency: match[2] };
                                            handleFieldChange("languages", newLangs);
                                          }
                                        }}
                                        placeholder="Language (Proficiency)"
                                        disabled={!isEditable}
                                        style={{ fontSize: "9px", color: "#374151" }}
                                      />
                                      {idx < (data.languages?.length || 0) - 1 && <span className="ml-1">·</span>}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              {/* Placeholder for other sections */}
                              {!["summary", "experience", "skills", "education", "projects", "certifications", "languages"].includes(sectionId) && (
                                <p className="text-[9px] text-gray-400 italic">
                                  Click to add content for {SECTION_TITLES[sectionId] || sectionId}...
                                </p>
                              )}
                            </div>
                          </div>
                        </DraggableSection>
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ATS Score Sidebar */}
        <div className="w-72 border-l border-border/50 bg-card/50 backdrop-blur-sm overflow-y-auto p-4 hidden lg:block">
          <LiveATSWidget
            score={atsScore}
            animatedScore={atsAnimatedScore}
            breakdown={atsBreakdown}
            feedback={atsFeedback}
            sectionSignals={atsSectionSignals}
            isHighScore={atsIsHighScore}
            expanded
          />
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Status Bar */}
      <div className="hidden sm:flex items-center justify-between px-4 py-2 border-t border-border/50 bg-card/80 backdrop-blur-sm flex-shrink-0">
        <span className="text-xs text-muted-foreground">
          {template.name} • A4 • {settings.layout?.replace("-", " ")} layout
          {isEditable && " • Click any text to edit inline"}
        </span>
        <span className="text-xs text-muted-foreground">
          {isPreviewMode ? "Preview mode" : "Auto-saved"}
        </span>
      </div>
    </div>
  );
};

export default InlineSlateCanvas;
