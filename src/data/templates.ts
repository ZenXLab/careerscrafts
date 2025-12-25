import { TemplateConfig } from "@/types/resume";

export const templates: TemplateConfig[] = [
  // Technical Templates
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
    id: "devops-pro",
    name: "DevOps Pro",
    description: "Infrastructure-focused design for DevOps and SRE roles. Clean technical layout.",
    category: "technical",
    accentColor: "hsl(180, 60%, 40%)",
    fontPrimary: "Inter",
    fontSecondary: "Inter",
    pages: 1,
    hasPhoto: false,
    layout: "single-column"
  },
  {
    id: "ai-ml-engineer",
    name: "AI/ML Engineer",
    description: "Research and production-ready format for ML engineers. Showcases projects and publications.",
    category: "technical",
    accentColor: "hsl(280, 60%, 55%)",
    fontPrimary: "Inter",
    fontSecondary: "Inter",
    pages: 2,
    hasPhoto: false,
    layout: "single-column"
  },
  
  // Professional/Business Templates
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
    id: "finance-analyst",
    name: "Finance Analyst",
    description: "Numbers-focused layout for financial analysts. Clean, professional, metrics-driven.",
    category: "professional",
    accentColor: "hsl(210, 50%, 40%)",
    fontPrimary: "Inter",
    fontSecondary: "Inter",
    pages: 1,
    hasPhoto: false,
    layout: "single-column"
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
  },
  
  // Creative Templates
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
    id: "product-manager",
    name: "Product Manager",
    description: "Balanced design showcasing both leadership and technical skills. Perfect for PM roles.",
    category: "creative",
    accentColor: "hsl(190, 60%, 42%)",
    fontPrimary: "Inter",
    fontSecondary: "Inter",
    pages: 2,
    hasPhoto: true,
    layout: "sidebar"
  },
  {
    id: "ux-designer",
    name: "UX Designer",
    description: "Portfolio-ready format for UX/UI designers. Showcases process and impact.",
    category: "creative",
    accentColor: "hsl(350, 60%, 55%)",
    fontPrimary: "Inter",
    fontSecondary: "Inter",
    pages: 1,
    hasPhoto: true,
    layout: "two-column"
  },
  
  // Executive Templates
  {
    id: "executive-classic",
    name: "Executive Classic",
    description: "Traditional serif typography with maximum whitespace. Perfect for C-level and senior leadership.",
    category: "executive",
    accentColor: "hsl(var(--emerald-slate))",
    fontPrimary: "Playfair Display",
    fontSecondary: "Inter",
    pages: 2,
    hasPhoto: false,
    layout: "single-column"
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
    id: "director-level",
    name: "Director Level",
    description: "Strategic leadership focus for directors and VPs. Highlights team impact and vision.",
    category: "executive",
    accentColor: "hsl(220, 35%, 30%)",
    fontPrimary: "Playfair Display",
    fontSecondary: "Inter",
    pages: 2,
    hasPhoto: false,
    layout: "single-column"
  },
  {
    id: "cxo-prestige",
    name: "CXO Prestige",
    description: "Board-ready CV format for C-suite executives. Maximum authority and presence.",
    category: "executive",
    accentColor: "hsl(45, 70%, 40%)",
    fontPrimary: "Playfair Display",
    fontSecondary: "Inter",
    pages: 2,
    hasPhoto: false,
    layout: "single-column"
  },
  
  // Modern/Startup Templates
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
    id: "growth-hacker",
    name: "Growth Hacker",
    description: "Results-driven format for marketing and growth roles. Metrics-first presentation.",
    category: "modern",
    accentColor: "hsl(150, 60%, 45%)",
    fontPrimary: "Inter",
    fontSecondary: "Inter",
    pages: 1,
    hasPhoto: false,
    layout: "single-column"
  },
  {
    id: "sales-impact",
    name: "Sales Impact",
    description: "Achievement-focused layout for B2B sales professionals. Numbers that sell.",
    category: "modern",
    accentColor: "hsl(25, 80%, 50%)",
    fontPrimary: "Inter",
    fontSecondary: "Inter",
    pages: 1,
    hasPhoto: true,
    layout: "sidebar"
  }
];

export const getTemplateById = (id: string): TemplateConfig | undefined => {
  return templates.find(t => t.id === id);
};

export const getTemplatesByCategory = (category: TemplateConfig["category"]): TemplateConfig[] => {
  return templates.filter(t => t.category === category);
};
