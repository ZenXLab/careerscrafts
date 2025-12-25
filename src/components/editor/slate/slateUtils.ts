import { Editor, Transforms, Element as SlateElement, Range, Node } from "slate";
import { 
  CustomMark, 
  CustomElement, 
  BulletNode, 
  BulletStyle,
  BULLET_STYLES,
  TextNode,
  ExperienceItem,
  SkillGroup,
  EducationItem,
} from "@/types/slate";
import { ResumeData } from "@/types/resume";

// ============================================
// MARK OPERATIONS (ATS-SAFE ONLY)
// ============================================

// Check if mark is active
export const isMarkActive = (editor: Editor, format: keyof CustomMark): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

// Toggle mark on/off (ATS-safe marks only)
export const toggleMark = (editor: Editor, format: keyof CustomMark) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// ============================================
// BLOCK OPERATIONS
// ============================================

// Check if block is active
export const isBlockActive = (editor: Editor, format: CustomElement["type"]): boolean => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  );

  return !!match;
};

// ============================================
// BULLET OPERATIONS
// ============================================

// Insert new bullet with specified style
export const insertBullet = (editor: Editor, style: BulletStyle = "dot") => {
  const bullet: BulletNode = {
    type: "bullet",
    style,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, bullet);
};

// Delete bullet if empty (on backspace)
export const deleteEmptyBullet = (editor: Editor): boolean => {
  const { selection } = editor;
  if (!selection || !Range.isCollapsed(selection)) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "bullet",
    })
  );

  if (match) {
    const [node, path] = match;
    if (SlateElement.isElement(node) && node.type === "bullet") {
      const text = (node as BulletNode).children.map((c: TextNode) => c.text).join("");
      if (text === "") {
        Transforms.removeNodes(editor, { at: path });
        return true;
      }
    }
  }
  return false;
};

// Change bullet style (dot, arrow, check)
export const changeBulletStyle = (editor: Editor, newStyle: BulletStyle) => {
  const { selection } = editor;
  if (!selection) return;

  const [match] = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "bullet",
    })
  );

  if (match) {
    const [, path] = match;
    Transforms.setNodes(editor, { style: newStyle } as Partial<BulletNode>, { at: path });
  }
};

// Get bullet symbol for display
export const getBulletSymbol = (style: BulletStyle): string => {
  return BULLET_STYLES[style] || BULLET_STYLES.dot;
};

// ============================================
// RESUME DATA CONVERSION
// ============================================

// Convert ResumeData to Slate-compatible value
export const resumeDataToSlateValue = (data: ResumeData): any[] => {
  const nodes: any[] = [];

  // Header section
  nodes.push({
    type: "header",
    children: [{ text: data.personalInfo.name }],
  });

  // Summary section
  if (data.summary) {
    nodes.push({
      type: "section",
      sectionType: "summary",
      children: [
        { type: "section-title", children: [{ text: "Professional Summary" }] },
        { type: "paragraph", children: [{ text: data.summary }] },
      ],
    });
  }

  // Experience section
  if (data.experience?.length) {
    const expChildren: any[] = [
      { type: "section-title", children: [{ text: "Professional Experience" }] },
    ];

    data.experience.forEach((exp) => {
      expChildren.push({
        type: "experience-entry",
        id: exp.id,
        children: [
          { type: "experience-role", children: [{ text: exp.position }] },
          { type: "experience-company", children: [{ text: exp.company }] },
          {
            type: "experience-date",
            startDate: exp.startDate,
            endDate: exp.endDate,
            isPresent: exp.current,
            children: [{ text: `${exp.startDate} — ${exp.current ? "Present" : exp.endDate}` }],
          },
          { type: "experience-location", children: [{ text: exp.location }] },
          {
            type: "bullet-list",
            children: exp.bullets.map((bullet) => ({
              type: "bullet",
              style: "dot" as BulletStyle,
              children: [{ text: bullet }],
            })),
          },
        ],
      });
    });

    nodes.push({
      type: "section",
      sectionType: "experience",
      children: expChildren,
    });
  }

  // Skills section
  if (data.skills?.length) {
    const skillChildren: any[] = [
      { type: "section-title", children: [{ text: "Core Skills" }] },
    ];

    data.skills.forEach((group) => {
      skillChildren.push({
        type: "skill-group",
        title: group.category,
        children: group.items.map((item) => ({
          type: "skill-item",
          children: [{ text: item }],
        })),
      });
    });

    nodes.push({
      type: "section",
      sectionType: "skills",
      children: skillChildren,
    });
  }

  // Education section
  if (data.education?.length) {
    const eduChildren: any[] = [
      { type: "section-title", children: [{ text: "Education" }] },
    ];

    data.education.forEach((edu) => {
      eduChildren.push({
        type: "education-entry",
        id: edu.id,
        children: [{ text: `${edu.degree} in ${edu.field} | ${edu.school} | ${edu.startDate} - ${edu.endDate}` }],
      });
    });

    nodes.push({
      type: "section",
      sectionType: "education",
      children: eduChildren,
    });
  }

  return nodes.length > 0 ? nodes : [{ type: "paragraph", children: [{ text: "" }] }];
};

// Convert Slate value back to ResumeData (for saving)
export const slateValueToResumeData = (value: any[], existingData: ResumeData): ResumeData => {
  const newData = { ...existingData };

  value.forEach((node) => {
    if (node.type === "header") {
      newData.personalInfo.name = extractText(node.children);
    }

    if (node.type === "section") {
      if (node.sectionType === "summary") {
        const paragraphs = node.children.filter((c: any) => c.type === "paragraph");
        if (paragraphs.length > 0) {
          newData.summary = extractText(paragraphs[0].children);
        }
      }

      if (node.sectionType === "experience") {
        const entries = node.children.filter((c: any) => c.type === "experience-entry");
        newData.experience = entries.map((entry: any) => {
          const role = entry.children.find((c: any) => c.type === "experience-role");
          const company = entry.children.find((c: any) => c.type === "experience-company");
          const date = entry.children.find((c: any) => c.type === "experience-date");
          const location = entry.children.find((c: any) => c.type === "experience-location");
          const bulletList = entry.children.find((c: any) => c.type === "bullet-list");

          return {
            id: entry.id,
            position: extractText(role?.children),
            company: extractText(company?.children),
            startDate: date?.startDate || "",
            endDate: date?.endDate || "",
            current: date?.isPresent || false,
            location: extractText(location?.children),
            bullets: bulletList?.children.map((b: any) => extractText(b.children)) || [],
          };
        });
      }

      if (node.sectionType === "skills") {
        const groups = node.children.filter((c: any) => c.type === "skill-group");
        newData.skills = groups.map((group: any) => ({
          category: group.title,
          items: group.children.map((item: any) => extractText(item.children)),
        }));
      }

      if (node.sectionType === "education") {
        const entries = node.children.filter((c: any) => c.type === "education-entry");
        // Note: simplified for now, full parsing would extract structured data
      }
    }
  });

  return newData;
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Extract plain text from children array
export const extractText = (children: any[] | undefined): string => {
  if (!children) return "";
  return children.map((c: any) => c.text || "").join("");
};

// Get selected text for AI operations
export const getSelectedText = (editor: Editor): string => {
  const { selection } = editor;
  if (!selection || Range.isCollapsed(selection)) return "";
  return Editor.string(editor, selection);
};

// Get node context for AI (which section, what type)
export const getNodeContext = (editor: Editor): { sectionType: string; nodeType: string } | null => {
  const { selection } = editor;
  if (!selection) return null;

  // Find the closest section
  const [sectionMatch] = Array.from(
    Editor.nodes(editor, {
      at: selection,
      match: (n) => SlateElement.isElement(n) && n.type === "section",
    })
  );

  // Find the current node type
  const [nodeMatch] = Array.from(
    Editor.nodes(editor, {
      at: selection,
      match: (n) => SlateElement.isElement(n) && n.type !== "section",
    })
  );

  return {
    sectionType: sectionMatch ? (sectionMatch[0] as any).sectionType : "unknown",
    nodeType: nodeMatch ? (nodeMatch[0] as any).type : "unknown",
  };
};

// Format date for display (YYYY-MM to Mon YYYY)
export const formatDate = (dateStr: string): string => {
  if (dateStr === "present") return "Present";
  if (!dateStr) return "";
  
  const [year, month] = dateStr.split("-");
  if (!month) return year;
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthIndex = parseInt(month, 10) - 1;
  
  return `${months[monthIndex] || month} ${year}`;
};

// Parse date from display format back to YYYY-MM
export const parseDate = (displayStr: string): string => {
  if (displayStr.toLowerCase() === "present") return "present";
  
  const months: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };
  
  const parts = displayStr.toLowerCase().split(" ");
  if (parts.length === 2) {
    const month = months[parts[0]] || "01";
    return `${parts[1]}-${month}`;
  }
  
  return displayStr;
};

// Generate unique ID for new elements
export const generateId = (prefix: string = "item"): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
