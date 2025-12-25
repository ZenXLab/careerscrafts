import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { createEditor, Descendant, Editor, Transforms, Range, Node } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { motion } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, 
  GripVertical, Camera, Eye, EyeOff, Upload, Trash2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

// Section type mapping
const SECTION_TITLES: Record<string, string> = {
  summary: "PROFESSIONAL SUMMARY",
  skills: "CORE SKILLS",
  experience: "PROFESSIONAL EXPERIENCE",
  education: "EDUCATION",
  certifications: "CERTIFICATIONS",
  languages: "LANGUAGES",
  projects: "PROJECTS",
  awards: "AWARDS",
  volunteering: "VOLUNTEERING",
  interests: "INTERESTS",
  references: "REFERENCES",
};

// Sortable Section Wrapper
interface SortableSectionProps {
  id: string;
  children: React.ReactNode;
  accentColor: string;
}

const SortableSection = ({ id, children, accentColor }: SortableSectionProps) => {
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
    <div
      ref={setNodeRef}
      style={style}
      className="group relative"
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1"
        title="Drag to reorder section"
      >
        <GripVertical className="w-4 h-4" />
      </button>
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // This will trigger onUploadPhoto with the data URL
        onUploadPhoto();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="photo-controls-wrapper group/photo relative" contentEditable={false}>
      {showPhoto && photo ? (
        <div className="relative">
          <img
            src={photo}
            alt="Profile"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `3px solid ${accentColor}`,
            }}
          />
          {/* Photo action buttons */}
          <div className="absolute -right-2 -bottom-2 flex gap-1 opacity-0 group-hover/photo:opacity-100 transition-opacity">
            <button
              onClick={onTogglePhoto}
              className="p-1.5 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
              title="Hide photo"
            >
              <EyeOff className="w-3 h-3 text-gray-600" />
            </button>
            <button
              onClick={onRemovePhoto}
              className="p-1.5 rounded-full bg-white shadow-md hover:bg-red-50 transition-colors"
              title="Remove photo"
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 hover:border-primary/50 flex flex-col items-center justify-center gap-1 transition-colors bg-gray-50 hover:bg-gray-100"
          title="Upload photo"
        >
          <Camera className="w-5 h-5 text-gray-400" />
          <span className="text-[8px] text-gray-400">Add Photo</span>
        </button>
      )}
      {!showPhoto && photo && (
        <button
          onClick={onTogglePhoto}
          className="absolute top-0 right-0 p-1 rounded-full bg-white shadow-md hover:bg-gray-100 opacity-0 group-hover/photo:opacity-100 transition-opacity"
          title="Show photo"
        >
          <Eye className="w-3 h-3 text-gray-600" />
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

// Convert ResumeData to Slate value for a specific section
const createSectionContent = (sectionType: string, data: ResumeData): any[] => {
  const children: any[] = [
    { type: "section-title", children: [{ text: SECTION_TITLES[sectionType] || sectionType.toUpperCase() }] }
  ];

  switch (sectionType) {
    case "summary":
      if (data.summary) {
        children.push({ type: "paragraph", children: [{ text: data.summary }] });
      }
      break;

    case "skills":
      if (data.skills?.length) {
        data.skills.forEach((group) => {
          children.push({
            type: "skill-group",
            title: group.category,
            children: group.items.map((skill) => ({
              type: "skill-item",
              children: [{ text: skill }]
            }))
          });
        });
      }
      break;

    case "experience":
      if (data.experience?.length) {
        data.experience.forEach((exp) => {
          children.push({
            type: "experience-entry",
            id: exp.id,
            children: [
              {
                type: "experience-header",
                children: [
                  { type: "experience-role", children: [{ text: exp.position }] },
                  { type: "experience-date", children: [{ text: `${exp.startDate} — ${exp.current ? "Present" : exp.endDate}` }] }
                ]
              },
              {
                type: "experience-subheader",
                children: [
                  { type: "experience-company", children: [{ text: exp.company }] },
                  { type: "experience-location", children: [{ text: exp.location }] }
                ]
              },
              ...(exp.bullets?.length ? [{
                type: "bullet-list",
                children: exp.bullets.map((bullet) => ({
                  type: "bullet",
                  style: "arrow",
                  children: [{ text: bullet }]
                }))
              }] : [])
            ]
          });
        });
      }
      break;

    case "education":
      if (data.education?.length) {
        data.education.forEach((edu) => {
          children.push({
            type: "education-entry",
            id: edu.id,
            children: [
              {
                type: "education-header",
                children: [
                  { type: "education-degree", children: [{ text: edu.degree }] },
                  { type: "education-date", children: [{ text: `${edu.startDate} — ${edu.endDate}` }] }
                ]
              },
              {
                type: "education-subheader",
                children: [
                  { type: "education-school", children: [{ text: edu.school }] },
                  { type: "education-location", children: [{ text: edu.location }] }
                ]
              },
              ...(edu.gpa ? [{ type: "education-gpa", children: [{ text: `GPA: ${edu.gpa}` }] }] : [])
            ]
          });
        });
      }
      break;

    case "certifications":
      if (data.certifications?.length) {
        data.certifications.forEach((cert) => {
          children.push({
            type: "certification-entry",
            children: [
              { type: "certification-name", children: [{ text: cert.name }] },
              { type: "certification-meta", children: [{ text: `${cert.issuer} • ${cert.date}` }] }
            ]
          });
        });
      }
      break;

    case "languages":
      if (data.languages?.length) {
        children.push({
          type: "paragraph",
          children: [{ text: data.languages.map(l => `${l.language} (${l.proficiency})`).join(" • ") }]
        });
      }
      break;

    case "projects":
      if (data.projects?.length) {
        data.projects.forEach((proj) => {
          children.push({
            type: "project-entry",
            children: [
              { type: "project-name", children: [{ text: proj.name }] },
              { type: "paragraph", children: [{ text: proj.description }] },
              { type: "project-tech", children: [{ text: proj.technologies.join(" • ") }] }
            ]
          });
        });
      }
      break;
  }

  return children.length > 1 ? children : [];
};

// Convert ResumeData to Slate value with section order
const resumeDataToSlate = (data: ResumeData, sectionOrder: string[]): Descendant[] => {
  const nodes: Descendant[] = [];

  // Header section (always first)
  nodes.push({
    type: "header-section",
    children: [
      { type: "name", children: [{ text: data.personalInfo.name || "" }] },
      { type: "title", children: [{ text: data.personalInfo.title || "" }] },
      {
        type: "contact-line",
        children: [
          { text: [
            data.personalInfo.email,
            data.personalInfo.phone,
            data.personalInfo.location,
            data.personalInfo.linkedin,
            data.personalInfo.website
          ].filter(Boolean).join(" • ") }
        ]
      }
    ]
  } as any);

  // Add sections in order
  sectionOrder.forEach((sectionType) => {
    const content = createSectionContent(sectionType, data);
    if (content.length > 0) {
      nodes.push({
        type: "section",
        sectionType,
        children: content
      } as any);
    }
  });

  return nodes.length > 0 ? nodes : [{ type: "paragraph", children: [{ text: "" }] }];
};

// Extract text from Slate children
const extractText = (children: any[]): string => {
  if (!children) return "";
  return children.map((child: any) => {
    if (child.text !== undefined) return child.text;
    if (child.children) return extractText(child.children);
    return "";
  }).join("");
};

// Convert Slate value back to ResumeData
const slateToResumeData = (nodes: Descendant[], existingData: ResumeData): ResumeData => {
  const newData = { ...existingData };

  nodes.forEach((node: any) => {
    if (node.type === "header-section") {
      node.children?.forEach((child: any) => {
        if (child.type === "name") {
          newData.personalInfo = { ...newData.personalInfo, name: extractText(child.children) };
        } else if (child.type === "title") {
          newData.personalInfo = { ...newData.personalInfo, title: extractText(child.children) };
        }
      });
    } else if (node.type === "section") {
      if (node.sectionType === "summary") {
        const para = node.children?.find((c: any) => c.type === "paragraph");
        if (para) {
          newData.summary = extractText(para.children);
        }
      } else if (node.sectionType === "experience") {
        const entries = node.children?.filter((c: any) => c.type === "experience-entry") || [];
        newData.experience = entries.map((entry: any, idx: number) => {
          const existing = existingData.experience[idx] || {
            id: `exp-${idx}`,
            company: "",
            position: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            bullets: []
          };
          
          let position = existing.position;
          let company = existing.company;
          const bullets: string[] = [];

          entry.children?.forEach((child: any) => {
            if (child.type === "experience-header") {
              child.children?.forEach((h: any) => {
                if (h.type === "experience-role") {
                  position = extractText(h.children);
                }
              });
            } else if (child.type === "experience-subheader") {
              child.children?.forEach((h: any) => {
                if (h.type === "experience-company") {
                  company = extractText(h.children);
                }
              });
            } else if (child.type === "bullet-list") {
              child.children?.forEach((b: any) => {
                if (b.type === "bullet") {
                  bullets.push(extractText(b.children));
                }
              });
            }
          });

          return {
            ...existing,
            position,
            company,
            bullets: bullets.length > 0 ? bullets : existing.bullets
          };
        });
      } else if (node.sectionType === "skills") {
        const groups = node.children?.filter((c: any) => c.type === "skill-group") || [];
        newData.skills = groups.map((group: any, idx: number) => {
          const existing = existingData.skills[idx] || { category: "", items: [] };
          const items = group.children?.map((item: any) => extractText(item.children)).filter(Boolean) || [];
          return {
            category: group.title || existing.category,
            items: items.length > 0 ? items : existing.items
          };
        });
      } else if (node.sectionType === "education") {
        const entries = node.children?.filter((c: any) => c.type === "education-entry") || [];
        newData.education = entries.map((entry: any, idx: number) => {
          const existing = existingData.education[idx] || {
            id: `edu-${idx}`,
            school: "",
            degree: "",
            field: "",
            location: "",
            startDate: "",
            endDate: ""
          };
          
          let degree = existing.degree;
          let school = existing.school;

          entry.children?.forEach((child: any) => {
            if (child.type === "education-header") {
              child.children?.forEach((h: any) => {
                if (h.type === "education-degree") {
                  degree = extractText(h.children);
                }
              });
            } else if (child.type === "education-subheader") {
              child.children?.forEach((h: any) => {
                if (h.type === "education-school") {
                  school = extractText(h.children);
                }
              });
            }
          });

          return { ...existing, degree, school };
        });
      }
    }
  });

  return newData;
};

// Custom element renderer
const RenderElement = ({ attributes, children, element, accentColor, layout }: any) => {
  const baseStyle: React.CSSProperties = {
    direction: "ltr",
    textAlign: "left",
    unicodeBidi: "embed",
  };

  switch (element.type) {
    case "header-section":
      return (
        <header
          {...attributes}
          style={{
            ...baseStyle,
            textAlign: "center",
            marginBottom: "16px",
            paddingBottom: "12px",
            borderBottom: `2px solid ${accentColor}`,
          }}
        >
          {children}
        </header>
      );

    case "name":
      return (
        <h1
          {...attributes}
          style={{
            ...baseStyle,
            ...TYPOGRAPHY.name,
            color: "#111827",
            marginBottom: "4px",
          }}
        >
          {children}
        </h1>
      );

    case "title":
      return (
        <p
          {...attributes}
          style={{
            ...baseStyle,
            fontSize: "14px",
            fontWeight: 500,
            color: accentColor,
            marginBottom: "8px",
          }}
        >
          {children}
        </p>
      );

    case "contact-line":
      return (
        <p
          {...attributes}
          style={{
            ...baseStyle,
            fontSize: "9px",
            color: "#6B7280",
          }}
        >
          {children}
        </p>
      );

    case "section":
      return (
        <section
          {...attributes}
          style={{
            ...baseStyle,
            marginBottom: "16px",
          }}
          data-section-type={element.sectionType}
        >
          {children}
        </section>
      );

    case "section-title":
      return (
        <h2
          {...attributes}
          style={{
            ...baseStyle,
            ...TYPOGRAPHY.section,
            color: accentColor,
            borderBottom: `1px solid ${accentColor}`,
            paddingBottom: "4px",
            marginBottom: "8px",
            letterSpacing: "0.05em",
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
            ...baseStyle,
            ...TYPOGRAPHY.body,
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          {children}
        </p>
      );

    case "experience-entry":
      return (
        <div {...attributes} style={{ ...baseStyle, marginBottom: "14px" }}>
          {children}
        </div>
      );

    case "experience-header":
    case "experience-subheader":
      return (
        <div
          {...attributes}
          style={{
            ...baseStyle,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "2px",
          }}
        >
          {children}
        </div>
      );

    case "experience-role":
      return (
        <span
          {...attributes}
          style={{
            ...baseStyle,
            fontWeight: 700,
            fontSize: "12px",
            color: "#111827",
          }}
        >
          {children}
        </span>
      );

    case "experience-company":
      return (
        <span
          {...attributes}
          style={{
            ...baseStyle,
            fontWeight: 600,
            fontSize: "11px",
            color: accentColor,
          }}
        >
          {children}
        </span>
      );

    case "experience-date":
    case "experience-location":
      return (
        <span
          {...attributes}
          style={{
            ...baseStyle,
            fontSize: "9px",
            color: "#6B7280",
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          {children}
        </span>
      );

    case "bullet-list":
      return (
        <ul
          {...attributes}
          style={{
            ...baseStyle,
            listStyle: "none",
            padding: 0,
            margin: "6px 0 0 0",
          }}
        >
          {children}
        </ul>
      );

    case "bullet":
      const bulletChar = BULLET_STYLES[element.style as keyof typeof BULLET_STYLES] || "▸";
      return (
        <li
          {...attributes}
          style={{
            ...baseStyle,
            ...TYPOGRAPHY.bullet,
            color: "#374151",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            marginBottom: "3px",
            paddingLeft: "4px",
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

    case "skill-group":
      return (
        <div {...attributes} style={{ ...baseStyle, marginBottom: "6px" }}>
          <span
            contentEditable={false}
            style={{
              fontWeight: 600,
              fontSize: "9px",
              color: "#374151",
              display: "inline",
            }}
          >
            {element.title}:{" "}
          </span>
          <span style={{ fontSize: "9px", color: "#374151" }}>{children}</span>
        </div>
      );

    case "skill-item":
      return (
        <span {...attributes} style={{ ...baseStyle }}>
          {children}
          <span contentEditable={false}> · </span>
        </span>
      );

    case "education-entry":
      return (
        <div {...attributes} style={{ ...baseStyle, marginBottom: "10px" }}>
          {children}
        </div>
      );

    case "education-header":
    case "education-subheader":
      return (
        <div
          {...attributes}
          style={{
            ...baseStyle,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "2px",
          }}
        >
          {children}
        </div>
      );

    case "education-degree":
      return (
        <span
          {...attributes}
          style={{
            ...baseStyle,
            fontWeight: 700,
            fontSize: "11px",
            color: "#111827",
          }}
        >
          {children}
        </span>
      );

    case "education-school":
      return (
        <span
          {...attributes}
          style={{
            ...baseStyle,
            fontSize: "10px",
            color: accentColor,
          }}
        >
          {children}
        </span>
      );

    case "education-date":
    case "education-location":
      return (
        <span
          {...attributes}
          style={{
            ...baseStyle,
            fontSize: "9px",
            color: "#6B7280",
            flexShrink: 0,
          }}
        >
          {children}
        </span>
      );

    case "education-gpa":
      return (
        <p
          {...attributes}
          style={{
            ...baseStyle,
            fontSize: "9px",
            color: "#6B7280",
            marginTop: "2px",
          }}
        >
          {children}
        </p>
      );

    case "certification-entry":
      return (
        <div {...attributes} style={{ ...baseStyle, marginBottom: "6px" }}>
          {children}
        </div>
      );

    case "certification-name":
      return (
        <span
          {...attributes}
          style={{
            ...baseStyle,
            fontWeight: 600,
            fontSize: "10px",
            color: "#111827",
            display: "block",
          }}
        >
          {children}
        </span>
      );

    case "certification-meta":
      return (
        <span
          {...attributes}
          style={{
            ...baseStyle,
            fontSize: "9px",
            color: "#6B7280",
          }}
        >
          {children}
        </span>
      );

    case "project-entry":
      return (
        <div {...attributes} style={{ ...baseStyle, marginBottom: "10px" }}>
          {children}
        </div>
      );

    case "project-name":
      return (
        <span
          {...attributes}
          style={{
            ...baseStyle,
            fontWeight: 600,
            fontSize: "11px",
            color: "#111827",
            display: "block",
          }}
        >
          {children}
        </span>
      );

    case "project-tech":
      return (
        <span
          {...attributes}
          style={{
            ...baseStyle,
            fontSize: "9px",
            color: accentColor,
            fontStyle: "italic",
          }}
        >
          {children}
        </span>
      );

    default:
      return (
        <p {...attributes} style={baseStyle}>
          {children}
        </p>
      );
  }
};

// Custom leaf renderer
const RenderLeaf = ({ attributes, children, leaf, accentColor }: any) => {
  let style: React.CSSProperties = {};

  if (leaf.bold) {
    style.fontWeight = 700;
  }
  if (leaf.italic) {
    style.fontStyle = "italic";
  }
  if (leaf.accent) {
    style.color = accentColor;
  }
  if (leaf.muted) {
    style.color = "#6B7280";
  }

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  );
};

// Toggle mark helper
const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor) as any;
  return marks ? marks[format] === true : false;
};

// Insert new bullet helper
const insertBullet = (editor: Editor) => {
  const newBullet = {
    type: "bullet",
    style: "arrow",
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, newBullet as any);
};

// Delete empty bullet helper
const deleteEmptyBullet = (editor: Editor): boolean => {
  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection)) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      match: (n: any) => n.type === "bullet",
    })
  );

  if (match) {
    const [node, path] = match;
    const text = Node.string(node);
    if (text === "") {
      Transforms.removeNodes(editor, { at: path });
      return true;
    }
  }
  return false;
};

// Get layout styles
const getLayoutStyles = (layout: string, hasPhoto: boolean) => {
  switch (layout) {
    case "two-column":
      return {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
      };
    case "sidebar":
      return {
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        gap: "24px",
      };
    default: // single-column
      return {
        display: "block",
      };
  }
};

const ResumeCanvas = ({
  template,
  data,
  designSettings,
  onDataChange,
  readOnly = false,
  sectionOrder: externalSectionOrder,
  onSectionOrderChange,
}: ResumeCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [zoom, setZoom] = useState(0.75);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPhoto, setShowPhoto] = useState(!!data.personalInfo.photo);
  const [sectionOrder, setSectionOrder] = useState<string[]>(
    externalSectionOrder || ["summary", "skills", "experience", "education"]
  );

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // Sync external section order
  useEffect(() => {
    if (externalSectionOrder) {
      setSectionOrder(externalSectionOrder);
    }
  }, [externalSectionOrder]);

  // Create editor with plugins - memoized for performance
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Initialize Slate value
  const [value, setValue] = useState<Descendant[]>(() => 
    resumeDataToSlate(data, sectionOrder)
  );

  // Sync with external data changes
  useEffect(() => {
    const newValue = resumeDataToSlate(data, sectionOrder);
    setValue(newValue);
    editor.children = newValue;
    editor.onChange();
  }, [data.personalInfo.name, data.summary, sectionOrder, editor]);

  // Calculate optimal zoom
  useEffect(() => {
    const calculateZoom = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 80;
        const containerHeight = containerRef.current.clientHeight - 80;
        const fitWidth = containerWidth / A4_WIDTH;
        const fitHeight = containerHeight / A4_HEIGHT;
        setZoom(Math.max(0.4, Math.min(Math.min(fitWidth, fitHeight), 0.9)));
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
      const containerWidth = containerRef.current.clientWidth - 80;
      const containerHeight = containerRef.current.clientHeight - 80;
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

  // Handle value changes
  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      setValue(newValue);

      const isContentChange = editor.operations.some(
        (op) => op.type !== "set_selection"
      );

      if (isContentChange && onDataChange) {
        const updatedData = slateToResumeData(newValue, data);
        onDataChange(updatedData);
      }
    },
    [data, onDataChange, editor]
  );

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

  // Memoized render callbacks
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

  const renderElement = useCallback(
    (props: any) => <RenderElement {...props} accentColor={accentColor} layout={layout} />,
    [accentColor, layout]
  );

  const renderLeaf = useCallback(
    (props: any) => <RenderLeaf {...props} accentColor={accentColor} />,
    [accentColor]
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
          insertBullet(editor);
          return;
        }
      }

      // Backspace on empty bullet - delete bullet
      if (event.key === "Backspace") {
        if (deleteEmptyBullet(editor)) {
          event.preventDefault();
          return;
        }
      }

      // Tab - prevent default
      if (event.key === "Tab") {
        event.preventDefault();
        return;
      }
    },
    [editor]
  );

  // Get content sections (excluding header)
  const contentSections = sectionOrder.filter(s => {
    if (s === "summary") return !!data.summary;
    if (s === "skills") return data.skills?.length > 0;
    if (s === "experience") return data.experience?.length > 0;
    if (s === "education") return data.education?.length > 0;
    if (s === "certifications") return data.certifications?.length > 0;
    if (s === "languages") return data.languages?.length > 0;
    if (s === "projects") return data.projects?.length > 0;
    return false;
  });

  // Layout-specific content rendering
  const renderLayoutContent = () => {
    if (layout === "sidebar") {
      // Sidebar layout: Skills + Languages on left, rest on right
      const sidebarSections = ["skills", "languages", "certifications"].filter(s => contentSections.includes(s));
      const mainSections = contentSections.filter(s => !sidebarSections.includes(s));

      return (
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "24px" }}>
          {/* Sidebar */}
          <div style={{ background: `${accentColor}08`, padding: "16px", borderRadius: "4px" }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
              <SortableContext items={sidebarSections} strategy={verticalListSortingStrategy}>
                {sidebarSections.map((sectionType) => (
                  <SortableSection key={sectionType} id={sectionType} accentColor={accentColor}>
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
                  <SortableSection key={sectionType} id={sectionType} accentColor={accentColor}>
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
      // Two column: split sections evenly
      const midpoint = Math.ceil(contentSections.length / 2);
      const leftSections = contentSections.slice(0, midpoint);
      const rightSections = contentSections.slice(midpoint);

      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
              <SortableContext items={leftSections} strategy={verticalListSortingStrategy}>
                {leftSections.map((sectionType) => (
                  <SortableSection key={sectionType} id={sectionType} accentColor={accentColor}>
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
                  <SortableSection key={sectionType} id={sectionType} accentColor={accentColor}>
                    <SectionContent sectionType={sectionType} data={data} accentColor={accentColor} />
                  </SortableSection>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      );
    }

    // Single column (default)
    return null; // Use Slate editor for single column
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

        <div className="w-24" />
      </div>

      {/* Canvas Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto flex justify-center items-start p-4 sm:p-6 lg:p-8"
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
                  0 25px 50px -12px rgba(0, 0, 0, 0.25),
                  0 12px 25px -8px rgba(0, 0, 0, 0.15),
                  0 0 0 1px rgba(0, 0, 0, 0.05)
                `,
              }}
            >
              <div
                className="resume-canvas"
                style={{
                  padding: "32px 36px",
                  fontFamily: settings.fontFamily,
                  lineHeight: settings.lineSpacing,
                  minHeight: `${A4_HEIGHT - 64}px`,
                }}
              >
                {/* Header with Photo */}
                <header 
                  style={{
                    display: "grid",
                    gridTemplateColumns: showPhoto && data.personalInfo.photo ? "auto 1fr" : "1fr",
                    gap: "16px",
                    alignItems: "start",
                    marginBottom: "16px",
                    paddingBottom: "12px",
                    borderBottom: `2px solid ${accentColor}`,
                  }}
                >
                  {/* Photo Controls - Inside Header */}
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
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: `3px solid ${accentColor}`,
                      }}
                    />
                  )}

                  {/* Header Content */}
                  <div style={{ textAlign: showPhoto && data.personalInfo.photo ? "left" : "center" }}>
                    <Slate editor={editor} initialValue={value} onChange={handleChange}>
                      {!readOnly && <SlateFloatingToolbar accentColor={accentColor} />}
                      <Editable
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        onKeyDown={handleKeyDown}
                        readOnly={readOnly}
                        spellCheck
                        autoFocus={false}
                        placeholder="Click anywhere to start editing..."
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

                {/* Layout-specific content for two-column and sidebar */}
                {layout !== "single-column" && renderLayoutContent()}
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
      <div className="hidden sm:flex items-center justify-between px-4 py-2 border-t border-border/50 bg-card/50 backdrop-blur-sm flex-shrink-0">
        <span className="text-xs text-muted-foreground">
          {template.name} • A4 • {layout.replace("-", " ")} • Drag sections to reorder
        </span>
        <span className="text-xs text-muted-foreground">Auto-saved</span>
      </div>
    </div>
  );
};

// Section content renderer for multi-column layouts
interface SectionContentProps {
  sectionType: string;
  data: ResumeData;
  accentColor: string;
}

const SectionContent = ({ sectionType, data, accentColor }: SectionContentProps) => {
  const title = SECTION_TITLES[sectionType] || sectionType.toUpperCase();

  return (
    <section style={{ marginBottom: "16px" }}>
      <h2
        style={{
          ...TYPOGRAPHY.section,
          color: accentColor,
          borderBottom: `1px solid ${accentColor}`,
          paddingBottom: "4px",
          marginBottom: "8px",
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </h2>

      {sectionType === "summary" && data.summary && (
        <p style={{ ...TYPOGRAPHY.body, color: "#374151" }}>{data.summary}</p>
      )}

      {sectionType === "skills" && data.skills?.map((group, i) => (
        <div key={i} style={{ marginBottom: "6px", fontSize: "9px" }}>
          <span style={{ fontWeight: 600, color: "#374151" }}>{group.category}: </span>
          <span style={{ color: "#374151" }}>{group.items.join(" · ")}</span>
        </div>
      ))}

      {sectionType === "experience" && data.experience?.map((exp) => (
        <div key={exp.id} style={{ marginBottom: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, fontSize: "12px" }}>{exp.position}</span>
            <span style={{ fontSize: "9px", color: "#6B7280" }}>
              {exp.startDate} — {exp.current ? "Present" : exp.endDate}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600, fontSize: "11px", color: accentColor }}>{exp.company}</span>
            <span style={{ fontSize: "9px", color: "#6B7280" }}>{exp.location}</span>
          </div>
          <ul style={{ margin: "6px 0 0 0", padding: 0, listStyle: "none" }}>
            {exp.bullets?.map((bullet, i) => (
              <li key={i} style={{ display: "flex", gap: "8px", marginBottom: "3px", fontSize: "10px" }}>
                <span style={{ color: accentColor }}>▸</span>
                <span style={{ color: "#374151" }}>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {sectionType === "education" && data.education?.map((edu) => (
        <div key={edu.id} style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, fontSize: "11px" }}>{edu.degree}</span>
            <span style={{ fontSize: "9px", color: "#6B7280" }}>{edu.startDate} — {edu.endDate}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "10px", color: accentColor }}>{edu.school}</span>
            <span style={{ fontSize: "9px", color: "#6B7280" }}>{edu.location}</span>
          </div>
          {edu.gpa && <p style={{ fontSize: "9px", color: "#6B7280" }}>GPA: {edu.gpa}</p>}
        </div>
      ))}

      {sectionType === "certifications" && data.certifications?.map((cert) => (
        <div key={cert.id} style={{ marginBottom: "6px" }}>
          <span style={{ fontWeight: 600, fontSize: "10px", display: "block" }}>{cert.name}</span>
          <span style={{ fontSize: "9px", color: "#6B7280" }}>{cert.issuer} • {cert.date}</span>
        </div>
      ))}

      {sectionType === "languages" && data.languages && (
        <p style={{ fontSize: "9px", color: "#374151" }}>
          {data.languages.map(l => `${l.language} (${l.proficiency})`).join(" • ")}
        </p>
      )}
    </section>
  );
};

export default ResumeCanvas;
