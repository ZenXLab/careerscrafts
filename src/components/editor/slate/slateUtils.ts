import { Editor, Transforms, Element as SlateElement, Text, Range } from "slate";
import { CustomMark, CustomElement, BulletElement, BULLET_STYLES } from "@/types/slate";
import { ResumeData } from "@/types/resume";

// Check if mark is active
export const isMarkActive = (editor: Editor, format: keyof CustomMark): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

// Toggle mark on/off
export const toggleMark = (editor: Editor, format: keyof CustomMark) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

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

// Insert new bullet
export const insertBullet = (editor: Editor, bulletStyle: "dot" | "arrow" | "check" = "dot") => {
  const bullet: BulletElement = {
    type: "bullet",
    bulletStyle,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, bullet);
};

// Delete bullet if empty
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
      const text = node.children.map((c) => ("text" in c ? c.text : "")).join("");
      if (text === "") {
        Transforms.removeNodes(editor, { at: path });
        return true;
      }
    }
  }
  return false;
};

// Change bullet style
export const changeBulletStyle = (editor: Editor, newStyle: "dot" | "arrow" | "check") => {
  const { selection } = editor;
  if (!selection) return;

  const [match] = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === "bullet",
    })
  );

  if (match) {
    const [, path] = match;
    Transforms.setNodes(editor, { bulletStyle: newStyle }, { at: path });
  }
};

// Convert ResumeData to Slate value
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
              bulletStyle: "dot" as const,
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
      newData.personalInfo.name = node.children.map((c: any) => c.text).join("");
    }

    if (node.type === "section") {
      if (node.sectionType === "summary") {
        const paragraphs = node.children.filter((c: any) => c.type === "paragraph");
        if (paragraphs.length > 0) {
          newData.summary = paragraphs[0].children.map((c: any) => c.text).join("");
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
            position: role?.children.map((c: any) => c.text).join("") || "",
            company: company?.children.map((c: any) => c.text).join("") || "",
            startDate: date?.startDate || "",
            endDate: date?.endDate || "",
            current: date?.isPresent || false,
            location: location?.children.map((c: any) => c.text).join("") || "",
            bullets: bulletList?.children.map((b: any) => b.children.map((c: any) => c.text).join("")) || [],
          };
        });
      }

      if (node.sectionType === "skills") {
        const groups = node.children.filter((c: any) => c.type === "skill-group");
        newData.skills = groups.map((group: any) => ({
          category: group.title,
          items: group.children.map((item: any) => item.children.map((c: any) => c.text).join("")),
        }));
      }
    }
  });

  return newData;
};

// Get plain text from selection for AI
export const getSelectedText = (editor: Editor): string => {
  const { selection } = editor;
  if (!selection || Range.isCollapsed(selection)) return "";
  return Editor.string(editor, selection);
};
