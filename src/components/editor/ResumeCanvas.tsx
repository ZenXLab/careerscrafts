import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { createEditor, Descendant, Editor, Transforms, Range, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { motion } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, 
  GripVertical, Camera, Eye, EyeOff, Upload, Trash2, 
  Download, FileText, FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResumeData, TemplateConfig } from "@/types/resume";
import { DesignSettings } from "./DesignPanel";
import SlateFloatingToolbar from "./slate/SlateFloatingToolbar";
import { BULLET_STYLES, TYPOGRAPHY } from "@/types/slate";
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

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

interface ResumeCanvasProps {
  template: TemplateConfig;
  data: ResumeData;
  designSettings?: DesignSettings;
  onDataChange?: (data: ResumeData) => void;
  readOnly?: boolean;
  sectionOrder?: string[];
  onSectionOrderChange?: (order: string[]) => void;
  onExportPDF?: () => void;
}

// Section type mapping - All 18 sections
const SECTION_TITLES: Record<string, string> = {
  // Core (5)
  summary: "PROFESSIONAL SUMMARY",
  experience: "PROFESSIONAL EXPERIENCE",
  skills: "SKILLS",
  education: "EDUCATION",
  // Standard (6)
  projects: "PROJECTS",
  certifications: "CERTIFICATIONS",
  awards: "AWARDS & ACHIEVEMENTS",
  languages: "LANGUAGES",
  publications: "PUBLICATIONS",
  volunteering: "VOLUNTEERING",
  // Advanced (4)
  additional_experience: "ADDITIONAL EXPERIENCE",
  leadership: "LEADERSHIP & MANAGEMENT",
  consulting: "CONSULTING & FREELANCE",
  teaching: "TEACHING & MENTORING",
  // Personal (3)
  interests: "INTERESTS",
  training: "TRAINING & COURSES",
  books_talks: "BOOKS & TALKS",
};

// Sortable Section Wrapper
interface SortableSectionProps {
  id: string;
  children: React.ReactNode;
  accentColor: string;
  readOnly?: boolean;
}

const SortableSection = ({ id, children, accentColor, readOnly }: SortableSectionProps) => {
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
      className="group relative"
    >
      {/* Drag Handle */}
      {!readOnly && (
        <button
          {...attributes}
          {...listeners}
          className="absolute -left-8 top-0 h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary rounded hover:bg-primary/10"
          title="Drag to reorder section"
        >
          <GripVertical className="w-4 h-4" />
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
  // If photo is hidden, show only a small toggle button
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

  // If no photo and hidden, show nothing (collapse the area)
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
    <div className="photo-controls-wrapper group/photo relative" contentEditable={false}>
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
          {/* Photo action buttons */}
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

// Section content renderer
interface SectionContentProps {
  sectionType: string;
  data: ResumeData;
  accentColor: string;
  isEditing?: boolean;
}

const SectionContent = ({ sectionType, data, accentColor, isEditing }: SectionContentProps) => {
  const title = SECTION_TITLES[sectionType] || sectionType.toUpperCase().replace(/_/g, " ");

  // Section title header style
  const titleStyle = {
    fontSize: "11px",
    fontWeight: 700,
    color: accentColor,
    borderBottom: `1px solid ${accentColor}`,
    paddingBottom: "4px",
    marginBottom: "8px",
    letterSpacing: "0.05em",
  };

  // Render placeholder for empty sections
  const renderPlaceholder = () => (
    <section style={{ marginBottom: "16px", opacity: 0.5 }}>
      <h2 style={titleStyle}>{title}</h2>
      <p style={{ fontSize: "9px", color: "#9CA3AF", fontStyle: "italic" }}>
        Click to add content...
      </p>
    </section>
  );

  // Check if section has content
  const hasContent = (): boolean => {
    switch (sectionType) {
      case "summary": return !!data.summary;
      case "skills": return (data.skills?.length ?? 0) > 0;
      case "experience": return (data.experience?.length ?? 0) > 0;
      case "education": return (data.education?.length ?? 0) > 0;
      case "certifications": return (data.certifications?.length ?? 0) > 0;
      case "languages": return (data.languages?.length ?? 0) > 0;
      case "projects": return (data.projects?.length ?? 0) > 0;
      // Placeholder sections (will render placeholder UI)
      case "awards":
      case "volunteering":
      case "additional_experience":
      case "leadership":
      case "consulting":
      case "teaching":
      case "interests":
      case "training":
      case "books_talks":
      case "publications":
        return false; // Will show placeholder
      default: 
        return false;
    }
  };

  if (!hasContent()) {
    return renderPlaceholder();
  }

  return (
    <section style={{ marginBottom: "16px" }}>
      <h2 style={titleStyle}>{title}</h2>

      {/* Summary */}
      {sectionType === "summary" && data.summary && (
        <p style={{ fontSize: "10px", lineHeight: 1.5, color: "#374151" }}>{data.summary}</p>
      )}

      {/* Skills */}
      {sectionType === "skills" && data.skills?.map((group, i) => (
        <div key={i} style={{ marginBottom: "6px", fontSize: "9px" }}>
          <span style={{ fontWeight: 600, color: "#374151" }}>{group.category}: </span>
          <span style={{ color: "#374151" }}>{group.items.join(" · ")}</span>
        </div>
      ))}

      {/* Experience */}
      {sectionType === "experience" && data.experience?.map((exp) => (
        <div key={exp.id} style={{ marginBottom: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontWeight: 700, fontSize: "11px", color: "#111827" }}>{exp.position}</span>
            <span style={{ fontSize: "9px", color: "#6B7280", flexShrink: 0 }}>
              {exp.startDate} — {exp.current ? "Present" : exp.endDate}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontWeight: 600, fontSize: "10px", color: accentColor }}>{exp.company}</span>
            <span style={{ fontSize: "9px", color: "#6B7280" }}>{exp.location}</span>
          </div>
          <ul style={{ margin: "6px 0 0 0", padding: 0, listStyle: "none" }}>
            {exp.bullets?.map((bullet, i) => (
              <li key={i} style={{ display: "flex", gap: "8px", marginBottom: "3px", fontSize: "9px", lineHeight: 1.4 }}>
                <span style={{ color: accentColor, flexShrink: 0 }}>▸</span>
                <span style={{ color: "#374151" }}>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Education */}
      {sectionType === "education" && data.education?.map((edu) => (
        <div key={edu.id} style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontWeight: 700, fontSize: "11px", color: "#111827" }}>{edu.degree}</span>
            <span style={{ fontSize: "9px", color: "#6B7280" }}>{edu.startDate} — {edu.endDate}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "10px", color: accentColor }}>{edu.school}</span>
            <span style={{ fontSize: "9px", color: "#6B7280" }}>{edu.location}</span>
          </div>
          {edu.gpa && <p style={{ fontSize: "9px", color: "#6B7280", marginTop: "2px" }}>GPA: {edu.gpa}</p>}
        </div>
      ))}

      {/* Certifications */}
      {sectionType === "certifications" && data.certifications?.map((cert) => (
        <div key={cert.id} style={{ marginBottom: "6px" }}>
          <span style={{ fontWeight: 600, fontSize: "10px", display: "block", color: "#111827" }}>{cert.name}</span>
          <span style={{ fontSize: "9px", color: "#6B7280" }}>{cert.issuer} • {cert.date}</span>
        </div>
      ))}

      {/* Languages */}
      {sectionType === "languages" && data.languages && (
        <p style={{ fontSize: "9px", color: "#374151" }}>
          {data.languages.map(l => `${l.language} (${l.proficiency})`).join(" • ")}
        </p>
      )}

      {/* Projects */}
      {sectionType === "projects" && data.projects?.map((proj) => (
        <div key={proj.id} style={{ marginBottom: "10px" }}>
          <span style={{ fontWeight: 600, fontSize: "11px", display: "block", color: "#111827" }}>{proj.name}</span>
          <p style={{ fontSize: "9px", color: "#374151", margin: "2px 0" }}>{proj.description}</p>
          <span style={{ fontSize: "8px", color: accentColor, fontStyle: "italic" }}>
            {proj.technologies.join(" • ")}
          </span>
        </div>
      ))}
    </section>
  );
};

const ResumeCanvas = ({
  template,
  data,
  designSettings,
  onDataChange,
  readOnly = false,
  sectionOrder: externalSectionOrder,
  onSectionOrderChange,
  onExportPDF,
}: ResumeCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [zoom, setZoom] = useState(0.7);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPhoto, setShowPhoto] = useState(!!data.personalInfo.photo);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [sectionOrder, setSectionOrder] = useState<string[]>(
    externalSectionOrder || ["summary", "skills", "experience", "education"]
  );

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
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
    const calculateZoom = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 100;
        const containerHeight = containerRef.current.clientHeight - 100;
        const fitWidth = containerWidth / A4_WIDTH;
        const fitHeight = containerHeight / A4_HEIGHT;
        setZoom(Math.max(0.4, Math.min(Math.min(fitWidth, fitHeight), 0.85)));
      }
    };
    calculateZoom();
    window.addEventListener("resize", calculateZoom);
    return () => window.removeEventListener("resize", calculateZoom);
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.3));
  const handleFitToPage = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 100;
      const containerHeight = containerRef.current.clientHeight - 100;
      const fitWidth = containerWidth / A4_WIDTH;
      const fitHeight = containerHeight / A4_HEIGHT;
      setZoom(Math.min(fitWidth, fitHeight, 1));
    }
  };

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
      return; // Prevent invalid order
    }

    setSectionOrder(newOrder);
    onSectionOrderChange?.(newOrder);
  };

  // Photo handlers
  const handleTogglePhoto = () => setShowPhoto(!showPhoto);
  
  const handleUploadPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onDataChange) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newData = {
          ...data,
          personalInfo: {
            ...data.personalInfo,
            photo: reader.result as string
          }
        };
        onDataChange(newData);
        setShowPhoto(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    if (onDataChange) {
      const newData = {
        ...data,
        personalInfo: {
          ...data.personalInfo,
          photo: undefined
        }
      };
      onDataChange(newData);
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
  const layout = settings.layout || "single-column";

  // Get visible sections - show all sections in sectionOrder
  const visibleSections = sectionOrder;

  // Determine if photo area should be shown in header
  const shouldShowPhotoArea = !readOnly || (showPhoto && data.personalInfo.photo);

  // Layout-specific rendering
  const renderSections = () => {
    if (layout === "sidebar") {
      const sidebarSections = ["skills", "languages", "certifications"].filter(s => visibleSections.includes(s));
      const mainSections = visibleSections.filter(s => !sidebarSections.includes(s));

      return (
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "20px" }}>
          {/* Sidebar */}
          <div style={{ background: `${accentColor}08`, padding: "12px", borderRadius: "4px" }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
              <SortableContext items={sidebarSections} strategy={verticalListSortingStrategy}>
                {sidebarSections.map((sectionType) => (
                  <SortableSection key={sectionType} id={sectionType} accentColor={accentColor} readOnly={readOnly || isPreviewMode}>
                    <SectionContent sectionType={sectionType} data={data} accentColor={accentColor} />
                  </SortableSection>
                ))}
              </SortableContext>
            </DndContext>
          </div>
          {/* Main content */}
          <div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
              <SortableContext items={mainSections} strategy={verticalListSortingStrategy}>
                {mainSections.map((sectionType) => (
                  <SortableSection key={sectionType} id={sectionType} accentColor={accentColor} readOnly={readOnly || isPreviewMode}>
                    <SectionContent sectionType={sectionType} data={data} accentColor={accentColor} />
                  </SortableSection>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      );
    }

    if (layout === "two-column") {
      const midpoint = Math.ceil(visibleSections.length / 2);
      const leftSections = visibleSections.slice(0, midpoint);
      const rightSections = visibleSections.slice(midpoint);

      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
              <SortableContext items={leftSections} strategy={verticalListSortingStrategy}>
                {leftSections.map((sectionType) => (
                  <SortableSection key={sectionType} id={sectionType} accentColor={accentColor} readOnly={readOnly || isPreviewMode}>
                    <SectionContent sectionType={sectionType} data={data} accentColor={accentColor} />
                  </SortableSection>
                ))}
              </SortableContext>
            </DndContext>
          </div>
          <div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
              <SortableContext items={rightSections} strategy={verticalListSortingStrategy}>
                {rightSections.map((sectionType) => (
                  <SortableSection key={sectionType} id={sectionType} accentColor={accentColor} readOnly={readOnly || isPreviewMode}>
                    <SectionContent sectionType={sectionType} data={data} accentColor={accentColor} />
                  </SortableSection>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      );
    }

    // Single column (default) - with drag and drop
    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
        <SortableContext items={visibleSections} strategy={verticalListSortingStrategy}>
          {visibleSections.map((sectionType) => (
            <SortableSection key={sectionType} id={sectionType} accentColor={accentColor} readOnly={readOnly || isPreviewMode}>
              <SectionContent sectionType={sectionType} data={data} accentColor={accentColor} />
            </SortableSection>
          ))}
        </SortableContext>
      </DndContext>
    );
  };

  // Download handlers
  const handleDownloadPDF = () => {
    onExportPDF?.();
  };

  const handleDownloadDOCX = () => {
    // TODO: Implement DOCX export
    console.log("DOCX export coming soon");
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
            Page {currentPage} of {template.pages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, template.pages))}
            disabled={currentPage === template.pages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Right: Preview & Download */}
        <div className="flex items-center gap-2">
          <Button
            variant={isPreviewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
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
              <DropdownMenuItem onClick={handleDownloadPDF}>
                <FileText className="w-4 h-4 mr-2" />
                Download as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadDOCX} disabled>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download as DOCX
                <span className="ml-2 text-xs text-muted-foreground">(soon)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Canvas Area */}
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
                    gridTemplateColumns: shouldShowPhotoArea && showPhoto && data.personalInfo.photo 
                      ? "auto 1fr" 
                      : shouldShowPhotoArea && !readOnly 
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
                  {!readOnly && (
                    <PhotoControls
                      photo={data.personalInfo.photo}
                      showPhoto={showPhoto}
                      onTogglePhoto={handleTogglePhoto}
                      onUploadPhoto={handleUploadPhoto}
                      onRemovePhoto={handleRemovePhoto}
                      accentColor={accentColor}
                    />
                  )}
                  {readOnly && showPhoto && data.personalInfo.photo && (
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
                  <div style={{ textAlign: shouldShowPhotoArea && (showPhoto && data.personalInfo.photo || !readOnly) ? "left" : "center" }}>
                    <h1 style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: "2px",
                      letterSpacing: "0.02em",
                    }}>
                      {data.personalInfo.name || "Your Name"}
                    </h1>
                    <p style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: accentColor,
                      marginBottom: "6px",
                    }}>
                      {data.personalInfo.title || "Your Title"}
                    </p>
                    <p style={{
                      fontSize: "9px",
                      color: "#6B7280",
                    }}>
                      {[
                        data.personalInfo.email,
                        data.personalInfo.phone,
                        data.personalInfo.location,
                        data.personalInfo.linkedin,
                        data.personalInfo.website
                      ].filter(Boolean).join(" • ")}
                    </p>
                  </div>
                </header>

                {/* Sections with Drag & Drop */}
                <div style={{ paddingLeft: readOnly || isPreviewMode ? "0" : "10px" }}>
                  {renderSections()}
                </div>
              </div>
            </div>
          </motion.div>
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
          {template.name} • A4 • {layout.replace("-", " ")} layout
          {!readOnly && !isPreviewMode && " • Drag sections to reorder"}
        </span>
        <span className="text-xs text-muted-foreground">
          {isPreviewMode ? "Preview mode" : "Auto-saved"}
        </span>
      </div>
    </div>
  );
};

export default ResumeCanvas;
