import { TemplateConfig } from "@/types/resume";

export const templates: TemplateConfig[] = [
  {
    id: "executive-classic",
    name: "Executive Classic",
    description: "Traditional serif typography with maximum whitespace. Perfect for C-level and senior leadership roles.",
    category: "executive",
    accentColor: "hsl(var(--emerald-slate))",
    fontPrimary: "Playfair Display",
    fontSecondary: "Inter",
    pages: 2,
    hasPhoto: false,
    layout: "single-column"
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean sans-serif design with subtle accent lines. Ideal for tech and startup environments.",
    category: "modern",
    accentColor: "hsl(var(--royal-indigo))",
    fontPrimary: "Inter",
    fontSecondary: "Inter",
    pages: 1,
    hasPhoto: false,
    layout: "single-column"
  },
  {
    id: "professional-plus",
    name: "Professional Plus",
    description: "Balanced two-column layout with sidebar for skills. Great for experienced professionals.",
    category: "professional",
    accentColor: "hsl(220, 60%, 45%)",
    fontPrimary: "Inter",
    fontSecondary: "Inter",
    pages: 1,
    hasPhoto: true,
    layout: "sidebar"
  },
  {
    id: "tech-focused",
    name: "Tech Focused",
    description: "Monospace accents with structured layout. Built for software engineers and developers.",
    category: "technical",
    accentColor: "hsl(200, 70%, 45%)",
    fontPrimary: "JetBrains Mono",
    fontSecondary: "Inter",
    pages: 2,
    hasPhoto: false,
    layout: "single-column"
  },
  {
    id: "creative-edge",
    name: "Creative Edge",
    description: "Bold typography with asymmetric layout. Perfect for designers and creative roles.",
    category: "creative",
    accentColor: "hsl(330, 65%, 50%)",
    fontPrimary: "Playfair Display",
    fontSecondary: "Inter",
    pages: 1,
    hasPhoto: true,
    layout: "two-column"
  },
  {
    id: "corporate-standard",
    name: "Corporate Standard",
    description: "Traditional corporate formatting that passes all ATS systems. For finance and consulting.",
    category: "professional",
    accentColor: "hsl(220, 40%, 35%)",
    fontPrimary: "Inter",
    fontSecondary: "Inter",
    pages: 1,
    hasPhoto: false,
    layout: "single-column"
  },
  {
    id: "startup-ready",
    name: "Startup Ready",
    description: "Dynamic layout with modern color accents. Shows you're innovative and adaptable.",
    category: "modern",
    accentColor: "hsl(160, 65%, 40%)",
    fontPrimary: "Inter",
    fontSecondary: "Inter",
    pages: 1,
    hasPhoto: true,
    layout: "sidebar"
  },
  {
    id: "academic-formal",
    name: "Academic Formal",
    description: "Scholarly design for academic and research positions. Includes publications section.",
    category: "executive",
    accentColor: "hsl(0, 0%, 25%)",
    fontPrimary: "Libre Baskerville",
    fontSecondary: "Inter",
    pages: 2,
    hasPhoto: false,
    layout: "single-column"
  },
  {
    id: "consultant-pro",
    name: "Consultant Pro",
    description: "Clean and impactful design for consultants and advisors. Emphasizes achievements.",
    category: "professional",
    accentColor: "hsl(35, 70%, 45%)",
    fontPrimary: "Inter",
    fontSecondary: "Inter",
    pages: 1,
    hasPhoto: false,
    layout: "single-column"
  },
  {
    id: "data-driven",
    name: "Data Driven",
    description: "Metrics-focused layout for analysts and data professionals. Highlights quantifiable impact.",
    category: "technical",
    accentColor: "hsl(270, 50%, 50%)",
    fontPrimary: "Inter",
    fontSecondary: "Inter",
    pages: 1,
    hasPhoto: false,
    layout: "single-column"
  },
  {
    id: "product-manager",
    name: "Product Manager",
    description: "Balanced design showcasing both leadership and technical skills. Perfect for PM roles.",
    category: "modern",
    accentColor: "hsl(190, 60%, 42%)",
    fontPrimary: "Inter",
    fontSecondary: "Inter",
    pages: 2,
    hasPhoto: true,
    layout: "sidebar"
  },
  {
    id: "healthcare-pro",
    name: "Healthcare Pro",
    description: "Professional design for medical and healthcare professionals. Clean and trustworthy.",
    category: "professional",
    accentColor: "hsl(180, 50%, 40%)",
    fontPrimary: "Inter",
    fontSecondary: "Inter",
    pages: 2,
    hasPhoto: true,
    layout: "single-column"
  }
];

export const getTemplateById = (id: string): TemplateConfig | undefined => {
  return templates.find(t => t.id === id);
};

export const getTemplatesByCategory = (category: TemplateConfig["category"]): TemplateConfig[] => {
  return templates.filter(t => t.category === category);
};
