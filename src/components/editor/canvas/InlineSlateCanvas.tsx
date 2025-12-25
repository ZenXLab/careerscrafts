import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { createEditor, Descendant, Editor, Transforms, Range, Node, Element as SlateElement } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
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
import { DesignSettings } from "../DesignPanel";
import SlateFloatingToolbar from "../slate/SlateFloatingToolbar";
import { BULLET_STYLES, BulletStyle } from "@/types/slate";
import {
  resumeDataToSlateValue,
  slateValueToResumeData,
  toggleMark,
  insertBullet,
  deleteEmptyBullet,
} from "../slate/slateUtils";
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

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

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
}

// Draggable Section Wrapper (outside Slate for drag handles)
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
      {/* Drag Handle - outside editable area */}
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
}: InlineSlateCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Zustand store for layout state
  const { 
    zoom, setZoom, 
    showPhoto, setShowPhoto, 
    isPreviewMode, setPreviewMode,
    activeSection, setActiveSection 
  } = useResumeCanvasStore();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sectionOrder, setSectionOrder] = useState<string[]>(
    externalSectionOrder || ["summary", "experience", "skills", "education"]
  );

  // Create Slate editor with plugins
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Initialize Slate value from resume data
  const [slateValue, setSlateValue] = useState<Descendant[]>(() =>
    resumeDataToSlateValue(data)
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

  // Sync Slate value when data changes significantly
  useEffect(() => {
    const newValue = resumeDataToSlateValue(data);
    setSlateValue(newValue);
    editor.children = newValue;
    editor.onChange();
  }, [data.personalInfo.name]);

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
  }, [setZoom]);

  // Handle Slate value changes
  const handleSlateChange = useCallback(
    (newValue: Descendant[]) => {
      setSlateValue(newValue);

      // Check if content actually changed (not just selection)
      const isContentChange = editor.operations.some(
        (op) => op.type !== "set_selection"
      );

      if (isContentChange && onDataChange) {
        const updatedData = slateValueToResumeData(newValue, data);
        onDataChange(updatedData);
      }
    },
    [data, onDataChange, editor]
  );

  // Render Slate element
  const renderElement = useCallback(
    (props: any) => {
      const { attributes, children, element } = props;
      const accentColor = designSettings?.accentColor || template.accentColor || "#2563eb";

      const baseTextStyle: React.CSSProperties = {
        direction: "ltr",
        textAlign: "left",
        unicodeBidi: "embed",
      };

      switch (element.type) {
        case "header":
          return (
            <h1
              {...attributes}
              style={{
                ...baseTextStyle,
                fontSize: "22px",
                fontWeight: 700,
                color: "#111827",
                marginBottom: "2px",
                letterSpacing: "0.02em",
              }}
            >
              {children}
            </h1>
          );

        case "section-title":
          return (
            <h2
              {...attributes}
              style={{
                ...baseTextStyle,
                fontSize: "11px",
                fontWeight: 700,
                color: accentColor,
                borderBottom: `1px solid ${accentColor}`,
                paddingBottom: "4px",
                marginBottom: "8px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {children}
            </h2>
          );

        case "paragraph":
          return (
            <p
              {...attributes}
              style={{
                ...baseTextStyle,
                fontSize: "10px",
                lineHeight: 1.5,
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              {children}
            </p>
          );

        case "bullet-list":
          return (
            <ul
              {...attributes}
              style={{
                ...baseTextStyle,
                listStyle: "none",
                padding: 0,
                margin: "6px 0 0 0",
              }}
            >
              {children}
            </ul>
          );

        case "bullet":
          const bulletStyle = (element as any).style || "dot";
          const bulletChar = BULLET_STYLES[bulletStyle as BulletStyle] || "▸";
          return (
            <li
              {...attributes}
              style={{
                ...baseTextStyle,
                fontSize: "9px",
                lineHeight: 1.4,
                color: "#374151",
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                marginBottom: "3px",
              }}
            >
              <span
                contentEditable={false}
                style={{
                  color: accentColor,
                  flexShrink: 0,
                  userSelect: "none",
                }}
              >
                {bulletChar}
              </span>
              <span style={{ flex: 1 }}>{children}</span>
            </li>
          );

        case "experience-entry":
          return (
            <div
              {...attributes}
              style={{
                ...baseTextStyle,
                marginBottom: "14px",
              }}
            >
              {children}
            </div>
          );

        case "experience-role":
          return (
            <div
              {...attributes}
              style={{
                ...baseTextStyle,
                fontWeight: 700,
                fontSize: "11px",
                color: "#111827",
              }}
            >
              {children}
            </div>
          );

        case "experience-company":
          return (
            <div
              {...attributes}
              style={{
                ...baseTextStyle,
                fontWeight: 600,
                fontSize: "10px",
                color: accentColor,
              }}
            >
              {children}
            </div>
          );

        case "experience-date":
          return (
            <span
              {...attributes}
              style={{
                ...baseTextStyle,
                fontSize: "9px",
                color: "#6B7280",
                fontWeight: 500,
              }}
            >
              {children}
            </span>
          );

        case "experience-location":
          return (
            <span
              {...attributes}
              style={{
                ...baseTextStyle,
                fontSize: "9px",
                color: "#6B7280",
              }}
            >
              {children}
            </span>
          );

        case "skill-group":
          return (
            <div
              {...attributes}
              style={{
                ...baseTextStyle,
                marginBottom: "6px",
                fontSize: "9px",
              }}
            >
              <span
                contentEditable={false}
                style={{
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                {typeof (element as any).title === "string"
                  ? (element as any).title
                  : ""}: 
              </span>
              <span>{children}</span>
            </div>
          );

        case "skill-item":
          return (
            <span
              {...attributes}
              style={{
                ...baseTextStyle,
                color: "#374151",
              }}
            >
              {children}
            </span>
          );

        case "education-entry":
          return (
            <div
              {...attributes}
              style={{
                ...baseTextStyle,
                fontSize: "10px",
                color: "#374151",
                marginBottom: "10px",
              }}
            >
              {children}
            </div>
          );

        case "section":
          return (
            <section
              {...attributes}
              style={{
                ...baseTextStyle,
                marginBottom: "16px",
              }}
              data-section-type={(element as any).sectionType}
            >
              {children}
            </section>
          );

        default:
          return (
            <p {...attributes} style={baseTextStyle}>
              {children}
            </p>
          );
      }
    },
    [designSettings?.accentColor, template.accentColor]
  );

  // Render Slate leaf (text formatting)
  const renderLeaf = useCallback(
    (props: any) => {
      const { attributes, children, leaf } = props;
      const accentColor = designSettings?.accentColor || template.accentColor || "#2563eb";
      let styledChildren = children;

      if (leaf.bold) {
        styledChildren = <strong>{styledChildren}</strong>;
      }
      if (leaf.italic) {
        styledChildren = <em>{styledChildren}</em>;
      }
      if (leaf.accent) {
        styledChildren = <span style={{ color: accentColor }}>{styledChildren}</span>;
      }
      if (leaf.muted) {
        styledChildren = <span className="text-gray-500">{styledChildren}</span>;
      }

      return (
        <span
          {...attributes}
          style={{
            direction: "ltr",
            textAlign: "left",
            unicodeBidi: "embed",
          }}
        >
          {styledChildren}
        </span>
      );
    },
    [designSettings?.accentColor, template.accentColor]
  );

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Bold: Ctrl/Cmd + B
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault();
        toggleMark(editor, "bold");
        return;
      }

      // Italic: Ctrl/Cmd + I
      if ((event.ctrlKey || event.metaKey) && event.key === "i") {
        event.preventDefault();
        toggleMark(editor, "italic");
        return;
      }

      // Enter in bullet list - create new bullet
      if (event.key === "Enter") {
        const { selection } = editor;
        if (!selection || !Range.isCollapsed(selection)) return;

        const [bulletMatch] = Array.from(
          Editor.nodes(editor, {
            match: (n: any) => n.type === "bullet",
          })
        );

        if (bulletMatch) {
          event.preventDefault();
          insertBullet(editor, "dot");
          return;
        }
      }

      // Backspace on empty bullet - delete bullet
      if (event.key === "Backspace") {
        const deleted = deleteEmptyBullet(editor);
        if (deleted) {
          event.preventDefault();
          return;
        }
      }

      // Tab - prevent
      if (event.key === "Tab") {
        event.preventDefault();
        return;
      }
    },
    [editor]
  );

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
  const shouldShowPhotoArea = !readOnly || (showPhoto && data.personalInfo.photo);

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

  // Download handlers
  const handleDownloadPDF = () => {
    onExportPDF?.();
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
              <DropdownMenuItem onClick={handleDownloadPDF}>
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
                  {!readOnly && !isPreviewMode && (
                    <PhotoControls
                      photo={data.personalInfo.photo}
                      showPhoto={showPhoto}
                      onTogglePhoto={handleTogglePhoto}
                      onUploadPhoto={handleUploadPhoto}
                      onRemovePhoto={handleRemovePhoto}
                      accentColor={accentColor}
                    />
                  )}
                  {(readOnly || isPreviewMode) && showPhoto && data.personalInfo.photo && (
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

                  {/* Header Content - Inline Editable */}
                  <div style={{ textAlign: shouldShowPhotoArea && (showPhoto && data.personalInfo.photo || !readOnly) ? "left" : "center" }}>
                    <Slate editor={editor} initialValue={slateValue} onChange={handleSlateChange}>
                      {!readOnly && !isPreviewMode && <SlateFloatingToolbar accentColor={accentColor} />}
                      <Editable
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        onKeyDown={handleKeyDown}
                        readOnly={readOnly || isPreviewMode}
                        spellCheck
                        autoFocus={false}
                        placeholder="Click to start editing..."
                        style={{
                          outline: "none",
                          direction: "ltr",
                          textAlign: "left",
                          unicodeBidi: "embed",
                        }}
                        className="focus:outline-none"
                      />
                    </Slate>
                  </div>
                </header>
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
          {template.name} • A4 • {settings.layout?.replace("-", " ")} layout
          {!readOnly && !isPreviewMode && " • Click any text to edit inline"}
        </span>
        <span className="text-xs text-muted-foreground">
          {isPreviewMode ? "Preview mode" : "Auto-saved"}
        </span>
      </div>
    </div>
  );
};

export default InlineSlateCanvas;
