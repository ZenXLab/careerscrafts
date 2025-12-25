import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { createEditor, Descendant, Editor, Transforms, Range, Node, Element as SlateElement } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeData, TemplateConfig } from "@/types/resume";
import { DesignSettings } from "./DesignPanel";
import SlateFloatingToolbar from "./slate/SlateFloatingToolbar";
import { BULLET_STYLES, TYPOGRAPHY } from "@/types/slate";

// A4 dimensions in pixels at 96 DPI
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

interface ResumeCanvasProps {
  template: TemplateConfig;
  data: ResumeData;
  designSettings?: DesignSettings;
  onDataChange?: (data: ResumeData) => void;
  readOnly?: boolean;
}

// Convert ResumeData to Slate value
const resumeDataToSlate = (data: ResumeData): Descendant[] => {
  const nodes: Descendant[] = [];

  // Header section
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

  // Summary section
  if (data.summary) {
    nodes.push({
      type: "section",
      sectionType: "summary",
      children: [
        { type: "section-title", children: [{ text: "PROFESSIONAL SUMMARY" }] },
        { type: "paragraph", children: [{ text: data.summary }] }
      ]
    } as any);
  }

  // Skills section
  if (data.skills?.length) {
    const skillChildren: any[] = [
      { type: "section-title", children: [{ text: "CORE SKILLS" }] }
    ];
    
    data.skills.forEach((group) => {
      skillChildren.push({
        type: "skill-group",
        title: group.category,
        children: group.items.map((skill, idx) => ({
          type: "skill-item",
          children: [{ text: skill }]
        }))
      });
    });
    
    nodes.push({
      type: "section",
      sectionType: "skills",
      children: skillChildren
    } as any);
  }

  // Experience section
  if (data.experience?.length) {
    const expChildren: any[] = [
      { type: "section-title", children: [{ text: "PROFESSIONAL EXPERIENCE" }] }
    ];
    
    data.experience.forEach((exp) => {
      const entryChildren: any[] = [
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
        }
      ];

      // Bullets
      if (exp.bullets?.length) {
        entryChildren.push({
          type: "bullet-list",
          children: exp.bullets.map((bullet) => ({
            type: "bullet",
            style: "arrow",
            children: [{ text: bullet }]
          }))
        });
      }

      expChildren.push({
        type: "experience-entry",
        id: exp.id,
        children: entryChildren
      });
    });
    
    nodes.push({
      type: "section",
      sectionType: "experience",
      children: expChildren
    } as any);
  }

  // Education section
  if (data.education?.length) {
    const eduChildren: any[] = [
      { type: "section-title", children: [{ text: "EDUCATION" }] }
    ];
    
    data.education.forEach((edu) => {
      eduChildren.push({
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
    
    nodes.push({
      type: "section",
      sectionType: "education",
      children: eduChildren
    } as any);
  }

  // Certifications section
  if (data.certifications?.length) {
    const certChildren: any[] = [
      { type: "section-title", children: [{ text: "CERTIFICATIONS" }] }
    ];
    
    data.certifications.forEach((cert) => {
      certChildren.push({
        type: "certification-entry",
        children: [
          { type: "certification-name", children: [{ text: cert.name }] },
          { type: "certification-meta", children: [{ text: `${cert.issuer} • ${cert.date}` }] }
        ]
      });
    });
    
    nodes.push({
      type: "section",
      sectionType: "certifications",
      children: certChildren
    } as any);
  }

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
const RenderElement = ({ attributes, children, element, accentColor }: any) => {
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

const ResumeCanvas = ({
  template,
  data,
  designSettings,
  onDataChange,
  readOnly = false,
}: ResumeCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.75);
  const [currentPage, setCurrentPage] = useState(1);

  // Create editor with plugins - memoized for performance
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Initialize Slate value
  const [value, setValue] = useState<Descendant[]>(() => resumeDataToSlate(data));

  // Sync with external data changes
  useEffect(() => {
    const newValue = resumeDataToSlate(data);
    setValue(newValue);
    editor.children = newValue;
    editor.onChange();
  }, [data.personalInfo.name, data.summary, editor]);

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

  // Memoized render callbacks
  const accentColor = designSettings?.accentColor || template.accentColor || "#2563eb";

  const renderElement = useCallback(
    (props: any) => <RenderElement {...props} accentColor={accentColor} />,
    [accentColor]
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

  const settings = designSettings || {
    fontFamily: "'Inter', sans-serif",
    fontSize: 100,
    lineSpacing: 1.4,
    sectionSpacing: 20,
    accentColor: template.accentColor,
    layout: template.layout,
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
            {/* Resume Shell with Grid for Photo */}
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
                display: "grid",
                gridTemplateColumns: data.personalInfo.photo ? "auto 1fr" : "1fr",
                gap: "16px",
              }}
            >
              {/* Photo Slot - Outside Slate, Grid-Anchored */}
              {data.personalInfo.photo && (
                <div
                  className="photo-slot"
                  style={{
                    padding: "32px 0 32px 32px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                  contentEditable={false}
                >
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
                </div>
              )}

              {/* Single Slate Editor */}
              <div
                className="resume-canvas"
                style={{
                  padding: data.personalInfo.photo ? "32px 32px 32px 0" : "32px 36px",
                  fontFamily: settings.fontFamily,
                  lineHeight: settings.lineSpacing,
                  minHeight: `${A4_HEIGHT - 64}px`,
                }}
              >
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
            </div>
          </motion.div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="hidden sm:flex items-center justify-between px-4 py-2 border-t border-border/50 bg-card/50 backdrop-blur-sm flex-shrink-0">
        <span className="text-xs text-muted-foreground">
          {template.name} • A4 • Single Slate Editor • Click anywhere to edit
        </span>
        <span className="text-xs text-muted-foreground">Auto-saved</span>
      </div>
    </div>
  );
};

export default ResumeCanvas;
