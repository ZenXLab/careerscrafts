import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

// ============================================
// CAREERSCRAFT SLATE SCHEMA (ATS-SAFE, LOCKED)
// ============================================

// Text leaf with ATS-safe marks only
export type TextNode = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  accent?: boolean;  // For headings/accent color
  muted?: boolean;   // For dates/metadata
};

// Alias for compatibility
export type CustomText = TextNode;
export type CustomMark = Omit<TextNode, "text">;

// Contact information structure
export type ContactInfo = {
  email: string;
  phone?: string;
  linkedin?: string;
  website?: string;
};

// Resume document metadata
export type ResumeMeta = {
  role: string;
  industry: string;
  experienceLevel: "student" | "fresher" | "professional" | "senior" | "executive";
  region: string;
};

// ============================================
// CORE NODES
// ============================================

// Header node with structured contact
export type HeaderNode = {
  type: "header";
  name: TextNode[];
  title: TextNode[];
  location: TextNode[];
  contact: ContactInfo;
  children: TextNode[]; // Required for Slate
};

// Summary node
export type SummaryNode = {
  type: "summary";
  children: TextNode[];
};

// ============================================
// EXPERIENCE
// ============================================

// ATS-safe bullet styles
export type BulletStyle = "dot" | "arrow" | "check";

export type BulletNode = {
  type: "bullet";
  style: BulletStyle;
  children: TextNode[];
};

export type BulletListElement = {
  type: "bullet-list";
  children: BulletNode[];
};

export type ExperienceItem = {
  type: "experience-item";
  id: string;
  role: TextNode[];
  company: TextNode[];
  location: TextNode[];
  startDate: string;  // YYYY-MM format
  endDate: string | "present";
  logo?: string;      // Optional company logo URL
  children: BulletNode[];
};

export type ExperienceSection = {
  type: "experience";
  children: ExperienceItem[];
};

// ============================================
// SKILLS
// ============================================

export type SkillGroup = {
  type: "skill-group";
  title: TextNode[];
  skills: TextNode[];
  children: TextNode[]; // Required for Slate
};

export type SkillsSection = {
  type: "skills";
  children: SkillGroup[];
};

// ============================================
// EDUCATION
// ============================================

export type EducationItem = {
  type: "education-item";
  id: string;
  degree: TextNode[];
  institution: TextNode[];
  field: TextNode[];
  year: string;
  gpa?: string;
  children: TextNode[]; // Required for Slate
};

export type EducationSection = {
  type: "education";
  children: EducationItem[];
};

// ============================================
// CERTIFICATIONS
// ============================================

export type CertificationItem = {
  type: "certification-item";
  id: string;
  name: TextNode[];
  issuer: TextNode[];
  date: string;
  children: TextNode[];
};

export type CertificationSection = {
  type: "certifications";
  children: CertificationItem[];
};

// ============================================
// LEGACY COMPATIBILITY ELEMENTS
// These maintain backward compatibility with existing code
// ============================================

export type ParagraphElement = {
  type: "paragraph";
  children: TextNode[];
};

export type SectionTitleElement = {
  type: "section-title";
  children: TextNode[];
};

// Legacy experience sub-elements for backward compatibility
export type ExperienceRoleElement = {
  type: "experience-role";
  children: TextNode[];
};

export type ExperienceCompanyElement = {
  type: "experience-company";
  children: TextNode[];
};

export type ExperienceDateElement = {
  type: "experience-date";
  startDate: string;
  endDate: string;
  isPresent: boolean;
  children: TextNode[];
};

export type ExperienceLocationElement = {
  type: "experience-location";
  children: TextNode[];
};

export type ExperienceEntryElement = {
  type: "experience-entry";
  id: string;
  logo?: string;
  children: (ExperienceRoleElement | ExperienceCompanyElement | ExperienceDateElement | ExperienceLocationElement | BulletListElement)[];
};

export type SkillItemElement = {
  type: "skill-item";
  children: TextNode[];
};

export type SkillGroupElement = {
  type: "skill-group";
  title: string;
  children: SkillItemElement[];
};

export type EducationEntryElement = {
  type: "education-entry";
  id: string;
  children: TextNode[];
};

export type SectionElement = {
  type: "section";
  sectionType: "summary" | "experience" | "education" | "skills" | "certifications" | "projects" | "languages";
  children: Descendant[];
};

// ============================================
// UNION TYPES
// ============================================

// All resume node types
export type ResumeNode =
  | HeaderNode
  | SummaryNode
  | ExperienceSection
  | SkillsSection
  | EducationSection
  | CertificationSection;

// All custom elements (includes legacy for compatibility)
export type CustomElement =
  | HeaderNode
  | SummaryNode
  | ExperienceSection
  | ExperienceItem
  | SkillsSection
  | SkillGroup
  | EducationSection
  | EducationItem
  | CertificationSection
  | CertificationItem
  | BulletNode
  | BulletListElement
  | ParagraphElement
  | SectionTitleElement
  | ExperienceRoleElement
  | ExperienceCompanyElement
  | ExperienceDateElement
  | ExperienceLocationElement
  | ExperienceEntryElement
  | SkillItemElement
  | SkillGroupElement
  | EducationEntryElement
  | SectionElement;

// ============================================
// TOP-LEVEL DOCUMENT
// ============================================

export type ResumeDocument = {
  id: string;
  type: "resume" | "cv" | "cover_letter";
  meta: ResumeMeta;
  content: ResumeNode[];
};

// ============================================
// SLATE TYPE EXTENSIONS
// ============================================

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: TextNode;
  }
}

// ============================================
// CONSTANTS (LOCKED)
// ============================================

// ATS-safe bullet symbols
export const BULLET_STYLES: Record<BulletStyle, string> = {
  dot: "•",
  arrow: "▸",
  check: "✓",
} as const;

// Typography tokens (locked for consistency)
export const TYPOGRAPHY = {
  name: { fontWeight: 600, fontSize: "26px", lineHeight: 1.2 },
  role: { fontWeight: 500, fontSize: "14px", lineHeight: 1.3 },
  section: { fontWeight: 600, fontSize: "12px", lineHeight: 1.4, textTransform: "uppercase" as const },
  body: { fontWeight: 400, fontSize: "11px", lineHeight: 1.6 },
  bullet: { fontWeight: 400, fontSize: "10px", lineHeight: 1.5 },
} as const;

// ATS formatting whitelist
export const ATS_ALLOWED_MARKS: (keyof CustomMark)[] = ["bold", "italic", "accent", "muted"];

// Forbidden formatting (silently ignored)
export const ATS_FORBIDDEN = [
  "underline",
  "strikethrough",
  "subscript",
  "superscript",
  "backgroundColor",
  "fontSize",
  "fontFamily",
] as const;
