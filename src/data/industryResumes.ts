import { ResumeData } from "@/types/resume";

// Industry-specific resume data for gallery
export interface IndustryTemplate {
  id: string;
  name: string;
  role: string;
  industry: string;
  category: "technology" | "product" | "business" | "marketing" | "finance" | "healthcare" | "executive" | "creative";
  badge: "ATS-Optimized" | "Executive" | "Fresher-Friendly" | "Creative" | "Technical";
  accentColor: string;
  isFlagship?: boolean;
  data: ResumeData;
}

// ==========================================
// 🔹 FLAGSHIP TEMPLATE 01 — "CRAFT ATS ONE"
// ==========================================
export const craftAtsOneTemplate: IndustryTemplate = {
  id: "craft-ats-one",
  name: "Craft ATS One",
  role: "Default Resume",
  industry: "Universal",
  category: "technology",
  badge: "ATS-Optimized",
  accentColor: "hsl(220, 60%, 50%)",
  isFlagship: true,
  data: {
    personalInfo: {
      name: "Priya Sharma",
      title: "Senior Technical Java Architect",
      email: "priya.sharma@email.com",
      phone: "+91 98765 43210",
      location: "Bangalore, India",
      linkedin: "linkedin.com/in/priyasharma",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
    },
    summary: "Backend-focused Software Engineer with 5+ years of experience building scalable APIs and distributed systems. Proven track record of improving system reliability and reducing latency in production environments.",
    experience: [
      {
        id: "exp1",
        company: "FinTech SaaS",
        position: "Software Engineer",
        location: "Bangalore, India",
        startDate: "Jan 2021",
        endDate: "Present",
        current: true,
        bullets: [
          "Designed and maintained REST APIs handling 2M+ requests/day",
          "Reduced API latency by 32% through query optimization",
          "Implemented CI/CD pipelines improving deployment frequency by 40%"
        ]
      },
      {
        id: "exp2",
        company: "Tech Startup",
        position: "Junior Developer",
        location: "Mumbai, India",
        startDate: "Jun 2018",
        endDate: "Dec 2020",
        current: false,
        bullets: [
          "Built microservices architecture serving 500K+ daily users",
          "Developed automated testing suite with 85% code coverage",
          "Collaborated with product team to deliver 12 feature releases"
        ]
      }
    ],
    education: [{
      id: "edu1",
      school: "Indian Institute of Technology, Delhi",
      degree: "Bachelor of Technology",
      field: "Computer Science",
      location: "New Delhi, India",
      startDate: "2014",
      endDate: "2018",
      gpa: "8.5/10"
    }],
    skills: [
      { category: "Languages", items: ["Node.js", "Java", "Python", "TypeScript"] },
      { category: "Databases", items: ["PostgreSQL", "MongoDB", "Redis"] },
      { category: "Cloud & DevOps", items: ["AWS", "Docker", "Kubernetes", "CI/CD"] }
    ],
    certifications: [
      { id: "cert1", name: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "2023" }
    ]
  }
};

// ==========================================
// 🔹 FLAGSHIP TEMPLATE 02 — "CRAFT EXECUTIVE CV"
// ==========================================
export const craftExecutiveCvTemplate: IndustryTemplate = {
  id: "craft-executive-cv",
  name: "Craft Executive CV",
  role: "Default CV",
  industry: "Executive",
  category: "executive",
  badge: "Executive",
  accentColor: "hsl(220, 40%, 35%)",
  isFlagship: true,
  data: {
    personalInfo: {
      name: "Robert Williams",
      title: "Chief Technology Officer",
      email: "robert.williams@email.com",
      phone: "+1 (617) 555-0142",
      location: "Boston, MA",
      linkedin: "linkedin.com/in/robertwilliams",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
    },
    summary: "Technology leader with 15+ years of experience scaling engineering organizations and delivering enterprise platforms. Successfully led technical transformation at 3 companies, generating over $500M in enterprise value.",
    experience: [
      {
        id: "exp1",
        company: "SaaS Company",
        position: "Chief Technology Officer",
        location: "Boston, MA",
        startDate: "Jan 2020",
        endDate: "Present",
        current: true,
        bullets: [
          "Scaled engineering from 10 to 120+ members across 5 global offices",
          "Led architecture for platform serving 5M+ users with 99.99% uptime",
          "Drove cloud cost optimization saving $1.2M annually"
        ]
      },
      {
        id: "exp2",
        company: "Tech Startup (Acquired)",
        position: "VP of Engineering",
        location: "San Francisco, CA",
        startDate: "Mar 2016",
        endDate: "Dec 2019",
        current: false,
        bullets: [
          "Built engineering team from 8 to 45 engineers",
          "Led technical due diligence for $450M acquisition",
          "Implemented DevOps practices reducing deployment time by 80%"
        ]
      }
    ],
    education: [{
      id: "edu1",
      school: "MIT",
      degree: "Master of Science",
      field: "Computer Science",
      location: "Cambridge, MA",
      startDate: "2008",
      endDate: "2010"
    }],
    skills: [
      { category: "Leadership", items: ["Engineering Strategy", "M&A", "Board Relations", "P&L Management"] },
      { category: "Technical", items: ["Cloud Architecture", "System Design", "AI/ML Strategy"] }
    ]
  }
};

// ==========================================
// SAMPLE RESUME CONTENT (REALISTIC, DATA-FILLED)
// ==========================================
export const industryResumes: IndustryTemplate[] = [
  // Flagship Templates (Always First)
  craftAtsOneTemplate,
  craftExecutiveCvTemplate,
  
  // SOFTWARE ENGINEER (MID-LEVEL)
  {
    id: "software-engineer-mid",
    name: "Software Engineer",
    role: "Mid-Level",
    industry: "Technology",
    category: "technology",
    badge: "ATS-Optimized",
    accentColor: "hsl(220, 70%, 50%)",
    data: {
      personalInfo: {
        name: "Violet Rodriguez",
        title: "Senior Full-Stack Developer",
        email: "violet.rodriguez@email.com",
        phone: "+1 (408) 555-0134",
        location: "San Jose, CA",
        linkedin: "linkedin.com/in/violetrodriguez",
        photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Backend-focused Software Engineer with 5+ years of experience building scalable APIs and distributed systems. Proven track record of improving system reliability and reducing latency in production environments.",
      experience: [
        {
          id: "exp1",
          company: "FinTech SaaS",
          position: "Software Engineer",
          location: "San Jose, CA",
          startDate: "Mar 2022",
          endDate: "Present",
          current: true,
          bullets: [
            "Designed and maintained REST APIs handling 2M+ requests/day",
            "Reduced API latency by 32% through query optimization",
            "Implemented CI/CD pipelines improving deployment frequency by 40%"
          ]
        },
        {
          id: "exp2",
          company: "Dropbox",
          position: "Software Engineer",
          location: "San Francisco, CA",
          startDate: "Jun 2019",
          endDate: "Feb 2022",
          current: false,
          bullets: [
            "Built file sync engine handling 500M+ daily file operations",
            "Reduced cloud storage costs by 25% through optimization algorithms",
            "Developed internal testing framework used by 200+ engineers"
          ]
        }
      ],
      education: [{
        id: "edu1",
        school: "San Jose State University",
        degree: "Bachelor of Science",
        field: "Computer Science",
        location: "San Jose, CA",
        startDate: "2015",
        endDate: "2019"
      }],
      skills: [
        { category: "Languages", items: ["Node.js", "Java", "PostgreSQL", "AWS", "Docker", "REST APIs"] }
      ]
    }
  },

  // AI / ML ENGINEER
  {
    id: "ai-ml-engineer",
    name: "AI/ML Engineer",
    role: "Senior",
    industry: "Technology",
    category: "technology",
    badge: "Technical",
    accentColor: "hsl(270, 50%, 50%)",
    data: {
      personalInfo: {
        name: "Chen Wei",
        title: "Senior Machine Learning Engineer",
        email: "chen.wei@email.com",
        phone: "+1 (650) 555-0123",
        location: "Mountain View, CA",
        linkedin: "linkedin.com/in/chenwei",
        photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Machine Learning Engineer specializing in NLP and model deployment, with experience taking models from research to production.",
      experience: [
        {
          id: "exp1",
          company: "AI Startup",
          position: "ML Engineer",
          location: "Mountain View, CA",
          startDate: "Feb 2021",
          endDate: "Present",
          current: true,
          bullets: [
            "Built NLP pipelines improving document classification accuracy by 18%",
            "Deployed models using FastAPI and Kubernetes",
            "Collaborated with product teams to align ML outputs with business KPIs"
          ]
        }
      ],
      education: [{
        id: "edu1",
        school: "Stanford University",
        degree: "Master of Science",
        field: "Computer Science (AI Track)",
        location: "Stanford, CA",
        startDate: "2018",
        endDate: "2020"
      }],
      skills: [
        { category: "ML/AI", items: ["Python", "PyTorch", "NLP", "MLOps", "AWS SageMaker"] }
      ]
    }
  },

  // UI / UX DESIGNER
  {
    id: "ux-ui-designer",
    name: "UI/UX Designer",
    role: "Lead",
    industry: "Design",
    category: "creative",
    badge: "Creative",
    accentColor: "hsl(330, 65%, 50%)",
    data: {
      personalInfo: {
        name: "Sophia Martinez",
        title: "Senior Product Designer",
        email: "sophia.martinez@email.com",
        phone: "+1 (323) 555-0167",
        location: "Los Angeles, CA",
        linkedin: "linkedin.com/in/sophiamartinez",
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Product Designer focused on usability, accessibility, and conversion-driven design for SaaS platforms.",
      experience: [
        {
          id: "exp1",
          company: "B2B SaaS",
          position: "Product Designer",
          location: "San Francisco, CA",
          startDate: "Mar 2021",
          endDate: "Present",
          current: true,
          bullets: [
            "Redesigned onboarding flow, increasing activation by 24%",
            "Conducted usability testing with 50+ users",
            "Delivered Figma design systems adopted across 3 teams"
          ]
        }
      ],
      education: [{
        id: "edu1",
        school: "Rhode Island School of Design",
        degree: "Master of Fine Arts",
        field: "Graphic Design",
        location: "Providence, RI",
        startDate: "2013",
        endDate: "2015"
      }],
      skills: [
        { category: "Design", items: ["Figma", "UX Research", "Design Systems", "Prototyping"] }
      ]
    }
  },

  // PRODUCT MANAGER
  {
    id: "product-manager",
    name: "Product Manager",
    role: "Senior",
    industry: "Product",
    category: "product",
    badge: "ATS-Optimized",
    accentColor: "hsl(190, 60%, 42%)",
    data: {
      personalInfo: {
        name: "Mason Turner",
        title: "Senior Product Manager",
        email: "mason.turner@email.com",
        phone: "+1 (415) 555-0167",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/masonturner",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Product Manager with experience leading cross-functional teams to deliver data-driven SaaS products.",
      experience: [
        {
          id: "exp1",
          company: "Martech Platform",
          position: "Product Manager",
          location: "San Francisco, CA",
          startDate: "Jan 2021",
          endDate: "Present",
          current: true,
          bullets: [
            "Owned roadmap for analytics suite used by 10K+ users",
            "Increased feature adoption by 35% through user research",
            "Coordinated engineering, design, and GTM teams"
          ]
        }
      ],
      education: [{
        id: "edu1",
        school: "UC Berkeley",
        degree: "MBA",
        field: "Technology Management",
        location: "Berkeley, CA",
        startDate: "2017",
        endDate: "2019"
      }],
      skills: [
        { category: "Product", items: ["Product Strategy", "Analytics", "Agile", "Stakeholder Management"] }
      ]
    }
  },

  // MARKETING / GROWTH
  {
    id: "growth-marketer",
    name: "Growth Marketer",
    role: "Senior",
    industry: "Marketing",
    category: "marketing",
    badge: "ATS-Optimized",
    accentColor: "hsl(280, 60%, 50%)",
    data: {
      personalInfo: {
        name: "Emma Wilson",
        title: "Growth Manager",
        email: "emma.wilson@email.com",
        phone: "+1 (310) 555-0134",
        location: "Los Angeles, CA",
        linkedin: "linkedin.com/in/emmawilson",
        photo: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Growth marketer specializing in performance marketing and funnel optimization.",
      experience: [
        {
          id: "exp1",
          company: "D2C Brand",
          position: "Growth Manager",
          location: "Los Angeles, CA",
          startDate: "Jan 2021",
          endDate: "Present",
          current: true,
          bullets: [
            "Scaled paid acquisition from ₹10L to ₹1Cr monthly spend",
            "Improved CAC:LTV ratio from 1:2 to 1:4",
            "Built attribution dashboards for campaign optimization"
          ]
        }
      ],
      education: [{
        id: "edu1",
        school: "USC Marshall",
        degree: "Bachelor of Science",
        field: "Marketing",
        location: "Los Angeles, CA",
        startDate: "2013",
        endDate: "2017"
      }],
      skills: [
        { category: "Growth", items: ["Performance Marketing", "Funnel Optimization", "Analytics", "Attribution"] }
      ]
    }
  },

  // BUSINESS / CONSULTING
  {
    id: "business-analyst",
    name: "Business Analyst",
    role: "Senior",
    industry: "Business",
    category: "business",
    badge: "ATS-Optimized",
    accentColor: "hsl(220, 60%, 45%)",
    data: {
      personalInfo: {
        name: "James Moore",
        title: "Business Analyst",
        email: "james.moore@email.com",
        phone: "+1 (212) 555-0178",
        location: "New York, NY",
        linkedin: "linkedin.com/in/jamesmoore",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Business Analyst with consulting experience across operations, finance, and digital transformation.",
      experience: [
        {
          id: "exp1",
          company: "Consulting Firm",
          position: "Business Analyst",
          location: "New York, NY",
          startDate: "Aug 2020",
          endDate: "Present",
          current: true,
          bullets: [
            "Led process re-engineering projects saving ₹2Cr annually",
            "Built financial models for client decision-making",
            "Presented insights to CXO stakeholders"
          ]
        }
      ],
      education: [{
        id: "edu1",
        school: "Harvard Business School",
        degree: "MBA",
        field: "Strategy",
        location: "Boston, MA",
        startDate: "2018",
        endDate: "2020"
      }],
      skills: [
        { category: "Analysis", items: ["Process Re-engineering", "Financial Modeling", "Stakeholder Management"] }
      ]
    }
  },

  // FINANCE
  {
    id: "financial-analyst",
    name: "Financial Analyst",
    role: "Senior",
    industry: "Finance",
    category: "finance",
    badge: "ATS-Optimized",
    accentColor: "hsl(210, 50%, 40%)",
    data: {
      personalInfo: {
        name: "Sarah Johnson",
        title: "Financial Analyst",
        email: "sarah.johnson@email.com",
        phone: "+1 (312) 555-0156",
        location: "Chicago, IL",
        linkedin: "linkedin.com/in/sarahjohnson",
        photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Financial Analyst with experience in investment analysis and corporate finance.",
      experience: [
        {
          id: "exp1",
          company: "Investment Firm",
          position: "Financial Analyst",
          location: "Chicago, IL",
          startDate: "Jun 2020",
          endDate: "Present",
          current: true,
          bullets: [
            "Conducted valuation analysis for mid-market companies",
            "Built DCF and comparable models",
            "Supported deal execution teams"
          ]
        }
      ],
      education: [{
        id: "edu1",
        school: "University of Chicago",
        degree: "Master of Business Administration",
        field: "Finance",
        location: "Chicago, IL",
        startDate: "2018",
        endDate: "2020"
      }],
      skills: [
        { category: "Finance", items: ["Valuation", "DCF Modeling", "Financial Analysis", "Corporate Finance"] }
      ]
    }
  },

  // HEALTHCARE / EDUCATION
  {
    id: "healthcare-admin",
    name: "Healthcare Administrator",
    role: "Director",
    industry: "Healthcare",
    category: "healthcare",
    badge: "ATS-Optimized",
    accentColor: "hsl(180, 50%, 40%)",
    data: {
      personalInfo: {
        name: "Dr. Amanda Foster",
        title: "Operations Manager",
        email: "amanda.foster@email.com",
        phone: "+1 (713) 555-0189",
        location: "Houston, TX",
        linkedin: "linkedin.com/in/amandafoster",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Healthcare Administrator with experience managing clinical operations and compliance.",
      experience: [
        {
          id: "exp1",
          company: "Hospital",
          position: "Operations Manager",
          location: "Houston, TX",
          startDate: "Jan 2019",
          endDate: "Present",
          current: true,
          bullets: [
            "Managed daily operations across 4 departments",
            "Implemented compliance workflows reducing audit findings by 30%"
          ]
        }
      ],
      education: [{
        id: "edu1",
        school: "Johns Hopkins University",
        degree: "Master of Health Administration",
        field: "Healthcare Management",
        location: "Baltimore, MD",
        startDate: "2011",
        endDate: "2013"
      }],
      skills: [
        { category: "Healthcare", items: ["Operations Management", "Compliance", "Clinical Operations"] }
      ]
    }
  }
];

export const getTemplatesByCategory = (category: IndustryTemplate["category"]) => {
  return industryResumes.filter(t => t.category === category);
};

export const getTemplateById = (id: string) => {
  return industryResumes.find(t => t.id === id);
};

export const getFlagshipTemplates = () => {
  return industryResumes.filter(t => t.isFlagship);
};

export const categories = [
  { id: "technology", label: "Technology", icon: "Code" },
  { id: "product", label: "Product & Design", icon: "Palette" },
  { id: "business", label: "Business & Consulting", icon: "Briefcase" },
  { id: "marketing", label: "Marketing & Sales", icon: "TrendingUp" },
  { id: "finance", label: "Finance", icon: "DollarSign" },
  { id: "healthcare", label: "Healthcare", icon: "Heart" },
  { id: "executive", label: "Executive", icon: "Award" },
  { id: "creative", label: "Creative", icon: "Sparkles" }
] as const;
