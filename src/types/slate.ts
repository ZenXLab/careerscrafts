import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

// Custom marks (formatting that can be applied to any text)
export type CustomMark = {
  bold?: boolean;
  italic?: boolean;
  accent?: boolean;
  muted?: boolean;
};

// Custom text node
export type CustomText = {
  text: string;
} & CustomMark;

// Resume-specific element types
export type HeaderElement = {
  type: "header";
  children: CustomText[];
};

export type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
};

export type SectionTitleElement = {
  type: "section-title";
  children: CustomText[];
};

export type BulletElement = {
  type: "bullet";
  bulletStyle: "dot" | "arrow" | "check";
  children: CustomText[];
};

export type BulletListElement = {
  type: "bullet-list";
  children: BulletElement[];
};

export type ExperienceRoleElement = {
  type: "experience-role";
  children: CustomText[];
};

export type ExperienceCompanyElement = {
  type: "experience-company";
  children: CustomText[];
};

export type ExperienceDateElement = {
  type: "experience-date";
  startDate: string;
  endDate: string;
  isPresent: boolean;
  children: CustomText[];
};

export type ExperienceLocationElement = {
  type: "experience-location";
  children: CustomText[];
};

export type ExperienceEntryElement = {
  type: "experience-entry";
  id: string;
  children: (ExperienceRoleElement | ExperienceCompanyElement | ExperienceDateElement | ExperienceLocationElement | BulletListElement)[];
};

export type SkillGroupElement = {
  type: "skill-group";
  title: string;
  children: SkillItemElement[];
};

export type SkillItemElement = {
  type: "skill-item";
  children: CustomText[];
};

export type EducationEntryElement = {
  type: "education-entry";
  id: string;
  children: CustomText[];
};

export type SectionElement = {
  type: "section";
  sectionType: "summary" | "experience" | "education" | "skills" | "certifications" | "projects" | "languages";
  children: Descendant[];
};

// Union of all custom elements
export type CustomElement =
  | HeaderElement
  | ParagraphElement
  | SectionTitleElement
  | BulletElement
  | BulletListElement
  | ExperienceRoleElement
  | ExperienceCompanyElement
  | ExperienceDateElement
  | ExperienceLocationElement
  | ExperienceEntryElement
  | SkillGroupElement
  | SkillItemElement
  | EducationEntryElement
  | SectionElement;

// Extend Slate's types
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// ATS-safe bullet styles
export const BULLET_STYLES = {
  dot: "•",
  arrow: "▸",
  check: "✓",
} as const;

// Typography tokens (locked)
export const TYPOGRAPHY = {
  name: { fontWeight: 600, fontSize: "26px", lineHeight: 1.2 },
  role: { fontWeight: 500, fontSize: "14px", lineHeight: 1.3 },
  section: { fontWeight: 600, fontSize: "12px", lineHeight: 1.4, textTransform: "uppercase" as const },
  body: { fontWeight: 400, fontSize: "11px", lineHeight: 1.6 },
  bullet: { fontWeight: 400, fontSize: "10px", lineHeight: 1.5 },
} as const;
