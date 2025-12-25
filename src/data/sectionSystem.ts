import { 
  FileText, User, Briefcase, GraduationCap, Award, Languages, 
  FolderOpen, Trophy, Heart, BookOpen, Users, Lightbulb, 
  Building2, Presentation, Star, Mic2, BookMarked, Coffee
} from "lucide-react";

// ============================================
// SECTION CATEGORIES
// ============================================

export type SectionCategory = "core" | "standard" | "advanced" | "personal";

export type SectionStatus = "available" | "added" | "locked" | "required";

// ============================================
// ALL 18 SECTIONS
// ============================================

export interface SectionDefinition {
  id: string;
  name: string;
  category: SectionCategory;
  icon: typeof FileText;
  description: string;
  preview: string;
  multiInstance: boolean;
  removable: boolean;
  minEntries?: number;
  maxEntries?: number;
  lockedTooltip?: string;
}

// 🔒 CORE (5) - Always exist, non-removable
export const CORE_SECTIONS: SectionDefinition[] = [
  {
    id: "header",
    name: "Header",
    category: "core",
    icon: User,
    description: "Your name, title, and contact information",
    preview: "John Doe • Software Engineer • john@email.com",
    multiInstance: false,
    removable: false,
  },
  {
    id: "summary",
    name: "Professional Summary",
    category: "core",
    icon: FileText,
    description: "2-3 line career overview (max 450 chars)",
    preview: "Results-driven professional with 5+ years...",
    multiInstance: false,
    removable: false,
    minEntries: 1,
  },
  {
    id: "experience",
    name: "Professional Experience",
    category: "core",
    icon: Briefcase,
    description: "Your work history with achievements",
    preview: "Senior Engineer at TechCorp • 2020-Present",
    multiInstance: false,
    removable: false,
    minEntries: 1,
  },
  {
    id: "skills",
    name: "Skills",
    category: "core",
    icon: Star,
    description: "Grouped keywords - no ratings or meters",
    preview: "Backend: Node.js · Python · PostgreSQL",
    multiInstance: false,
    removable: false,
  },
  {
    id: "education",
    name: "Education",
    category: "core",
    icon: GraduationCap,
    description: "Degrees and academic achievements",
    preview: "B.S. Computer Science • MIT • 2018",
    multiInstance: false,
    removable: false,
    minEntries: 1,
  },
];

// 🔓 STANDARD (6) - Optional, single-instance
export const STANDARD_SECTIONS: SectionDefinition[] = [
  {
    id: "projects",
    name: "Projects",
    category: "standard",
    icon: FolderOpen,
    description: "Notable projects with impact and technologies",
    preview: "AI Platform • Increased efficiency by 40%",
    multiInstance: false,
    removable: true,
  },
  {
    id: "certifications",
    name: "Certifications",
    category: "standard",
    icon: Award,
    description: "Professional certifications and licenses",
    preview: "AWS Solutions Architect • 2024",
    multiInstance: false,
    removable: true,
  },
  {
    id: "awards",
    name: "Awards & Achievements",
    category: "standard",
    icon: Trophy,
    description: "Recognition and notable achievements",
    preview: "Employee of the Year • Innovation Award",
    multiInstance: false,
    removable: true,
  },
  {
    id: "languages",
    name: "Languages",
    category: "standard",
    icon: Languages,
    description: "Languages with proficiency levels",
    preview: "English (Native) • Spanish (Fluent)",
    multiInstance: false,
    removable: true,
  },
  {
    id: "publications",
    name: "Publications",
    category: "standard",
    icon: BookOpen,
    description: "Research papers, articles, publications",
    preview: "Machine Learning in Healthcare • IEEE 2023",
    multiInstance: false,
    removable: true,
  },
  {
    id: "volunteering",
    name: "Volunteering",
    category: "standard",
    icon: Heart,
    description: "Volunteer work and community involvement",
    preview: "Tech Mentor • Code.org • 2022-Present",
    multiInstance: false,
    removable: true,
  },
];

// 🔁 ADVANCED (4) - Optional, multi-instance
export const ADVANCED_SECTIONS: SectionDefinition[] = [
  {
    id: "additional_experience",
    name: "Additional Experience",
    category: "advanced",
    icon: Briefcase,
    description: "Earlier or supplementary work experience",
    preview: "Freelance Developer • 2015-2018",
    multiInstance: true,
    removable: true,
    lockedTooltip: "Recommended after 5+ years of experience",
  },
  {
    id: "leadership",
    name: "Leadership & Management",
    category: "advanced",
    icon: Users,
    description: "Leadership roles and team management",
    preview: "Engineering Manager • Led team of 12",
    multiInstance: true,
    removable: true,
    lockedTooltip: "Recommended for senior/executive roles",
  },
  {
    id: "consulting",
    name: "Consulting & Freelance",
    category: "advanced",
    icon: Building2,
    description: "Client engagements and freelance work",
    preview: "Strategy Consultant • Fortune 500 clients",
    multiInstance: true,
    removable: true,
    lockedTooltip: "Recommended for consultants and freelancers",
  },
  {
    id: "teaching",
    name: "Teaching & Mentoring",
    category: "advanced",
    icon: Presentation,
    description: "Teaching, training, and mentorship roles",
    preview: "Adjunct Professor • Data Science • NYU",
    multiInstance: true,
    removable: true,
    lockedTooltip: "Recommended for educators and mentors",
  },
];

// 🧠 PERSONAL (3) - Hidden by default, strict
export const PERSONAL_SECTIONS: SectionDefinition[] = [
  {
    id: "interests",
    name: "Interests",
    category: "personal",
    icon: Coffee,
    description: "Personal interests and hobbies (text only)",
    preview: "Open Source • Tech Writing • Hiking",
    multiInstance: false,
    removable: true,
  },
  {
    id: "training",
    name: "Training & Courses",
    category: "personal",
    icon: Lightbulb,
    description: "Relevant courses and training programs",
    preview: "Machine Learning Specialization • Coursera",
    multiInstance: false,
    removable: true,
  },
  {
    id: "books_talks",
    name: "Books & Talks",
    category: "personal",
    icon: Mic2,
    description: "Conference talks and book contributions",
    preview: "Speaker at ReactConf 2024 • O'Reilly Author",
    multiInstance: false,
    removable: true,
  },
];

// All sections combined
export const ALL_SECTIONS: SectionDefinition[] = [
  ...CORE_SECTIONS,
  ...STANDARD_SECTIONS,
  ...ADVANCED_SECTIONS,
  ...PERSONAL_SECTIONS,
];

// ============================================
// ROLE-BASED UNLOCK MATRIX
// ============================================

export type RoleType = 
  | "student"
  | "fresher"
  | "software_engineer"
  | "designer"
  | "data_ai"
  | "product_manager"
  | "consultant"
  | "manager"
  | "director"
  | "academic";

export const ROLE_SECTION_MATRIX: Record<RoleType, string[]> = {
  student: ["header", "summary", "experience", "skills", "education", "projects", "training"],
  fresher: ["header", "summary", "experience", "skills", "education", "projects", "training", "certifications"],
  software_engineer: ["header", "summary", "experience", "skills", "education", "projects", "certifications"],
  designer: ["header", "summary", "experience", "skills", "education", "projects", "awards"],
  data_ai: ["header", "summary", "experience", "skills", "education", "projects", "publications"],
  product_manager: ["header", "summary", "experience", "skills", "education", "leadership"],
  consultant: ["header", "summary", "experience", "skills", "education", "consulting", "additional_experience"],
  manager: ["header", "summary", "experience", "skills", "education", "leadership"],
  director: ["header", "summary", "experience", "skills", "education", "leadership", "additional_experience"],
  academic: ["header", "summary", "experience", "skills", "education", "publications", "teaching"],
};

export const ROLE_LABELS: Record<RoleType, string> = {
  student: "Student / Intern",
  fresher: "Entry Level / Fresher",
  software_engineer: "Software Engineer",
  designer: "Designer",
  data_ai: "Data / AI",
  product_manager: "Product Manager",
  consultant: "Consultant",
  manager: "Manager",
  director: "Director / Executive",
  academic: "Academic / Researcher",
};

// ============================================
// DEFAULT SECTION PRESETS BY INDUSTRY
// ============================================

export const INDUSTRY_PRESETS: Record<string, string[]> = {
  technology: ["summary", "experience", "skills", "projects", "education", "certifications"],
  product: ["summary", "experience", "skills", "projects", "education", "awards"],
  business: ["summary", "experience", "leadership", "skills", "education"],
  data_ai: ["summary", "experience", "skills", "projects", "publications", "education"],
  executive: ["summary", "experience", "leadership", "additional_experience", "education"],
  academic: ["summary", "experience", "publications", "teaching", "education"],
};

// ============================================
// ATS SCORE PENALTIES
// ============================================

export interface ATSPenalty {
  violation: string;
  penalty: number;
  description: string;
}

export const ATS_PENALTIES: ATSPenalty[] = [
  { violation: "missing_summary", penalty: -10, description: "Missing professional summary" },
  { violation: "short_summary", penalty: -5, description: "Summary too short (< 2 lines)" },
  { violation: "single_bullet", penalty: -8, description: "Only 1 bullet in experience role" },
  { violation: "no_quantified_bullets", penalty: -6, description: "No quantified achievements" },
  { violation: "skill_meters", penalty: -20, description: "Using skill meters/ratings" },
  { violation: "decorative_icons", penalty: -15, description: "Decorative icons in content" },
  { violation: "too_many_sections", penalty: -10, description: "More than 10 sections" },
  { violation: "personal_overused", penalty: -5, description: "Too many personal sections" },
  { violation: "empty_section", penalty: -12, description: "Empty optional section" },
  { violation: "missing_year", penalty: -5, description: "Education missing year" },
];

export const ATS_HARD_FAILS = [
  "tables",
  "charts",
  "progress_bars",
  "absolute_positioning",
  "canvas_widgets",
];

// ============================================
// SECTION UTILITIES
// ============================================

export const getSectionById = (id: string): SectionDefinition | undefined => {
  return ALL_SECTIONS.find(s => s.id === id);
};

export const getSectionsByCategory = (category: SectionCategory): SectionDefinition[] => {
  return ALL_SECTIONS.filter(s => s.category === category);
};

export const getUnlockedSections = (role: RoleType): string[] => {
  return ROLE_SECTION_MATRIX[role] || ROLE_SECTION_MATRIX.software_engineer;
};

export const isSectionLockedForRole = (sectionId: string, role: RoleType): boolean => {
  const unlocked = getUnlockedSections(role);
  const section = getSectionById(sectionId);
  
  // Core sections are never locked
  if (section?.category === "core") return false;
  
  // Check if section is in the unlocked list for this role
  return !unlocked.includes(sectionId);
};

export const getSectionStatus = (
  sectionId: string, 
  existingSections: string[], 
  role: RoleType
): SectionStatus => {
  const section = getSectionById(sectionId);
  
  if (!section) return "available";
  
  // Core sections are always required
  if (section.category === "core" && !section.removable) {
    return "required";
  }
  
  // Check if already added
  if (existingSections.includes(sectionId)) {
    return "added";
  }
  
  // ALL SECTIONS UNLOCKED - No role-based locking
  // Users can add any section they want
  return "available";
};
