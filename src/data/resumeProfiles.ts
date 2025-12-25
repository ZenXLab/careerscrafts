import { ResumeData } from "@/types/resume";

// 1️⃣ SOFTWARE ENGINEER — "Modern Minimal"
export const softwareEngineerResume: ResumeData = {
  personalInfo: {
    name: "Arjun Mehta",
    title: "Software Engineer",
    email: "arjun.mehta@email.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    linkedin: "linkedin.com/in/arjunmehta",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  summary: "Backend-focused Software Engineer with experience building scalable APIs and cloud-native services. Strong in performance optimization and production reliability.",
  experience: [
    {
      id: "exp1",
      company: "SaaS FinTech Platform",
      position: "Software Engineer",
      location: "Bengaluru, India",
      startDate: "Jan 2022",
      endDate: "Present",
      current: true,
      bullets: [
        "Built REST APIs handling 1.8M+ requests/day",
        "Reduced average response time by 29%",
        "Implemented CI/CD pipelines improving deployment frequency by 35%"
      ]
    },
    {
      id: "exp2",
      company: "Product Startup",
      position: "Junior Software Engineer",
      location: "Bengaluru, India",
      startDate: "Jun 2020",
      endDate: "Dec 2021",
      current: false,
      bullets: [
        "Developed backend services in Node.js and PostgreSQL",
        "Collaborated with frontend teams to ship 12+ features"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      school: "VTU University",
      degree: "B.Tech",
      field: "Computer Science",
      location: "Karnataka, India",
      startDate: "2016",
      endDate: "2020"
    }
  ],
  skills: [
    {
      category: "Technical",
      items: ["Node.js", "Java", "PostgreSQL", "AWS", "Docker", "REST APIs"]
    }
  ]
};

// 2️⃣ BACKEND / DEVOPS — "Tech Focused"
export const devopsEngineerResume: ResumeData = {
  personalInfo: {
    name: "Rohit Kulkarni",
    title: "Backend & DevOps Engineer",
    email: "rohit.kulkarni@email.com",
    phone: "+91 98123 45678",
    location: "Pune, India",
    linkedin: "linkedin.com/in/rohitkulkarni",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  },
  summary: "Backend and DevOps Engineer specializing in distributed systems, infrastructure automation, and cloud cost optimization.",
  experience: [
    {
      id: "exp1",
      company: "Cloud SaaS Company",
      position: "Senior Backend Engineer",
      location: "Pune, India",
      startDate: "Mar 2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Designed microservices processing 3M+ events/day",
        "Reduced infrastructure cost by 22% via autoscaling",
        "Led migration from monolith to Kubernetes"
      ]
    },
    {
      id: "exp2",
      company: "Enterprise IT Firm",
      position: "Backend Engineer",
      location: "Pune, India",
      startDate: "Jul 2018",
      endDate: "Feb 2021",
      current: false,
      bullets: [
        "Maintained Java-based services with 99.9% uptime",
        "Implemented monitoring using Prometheus & Grafana"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      school: "Pune University",
      degree: "B.E.",
      field: "Computer Engineering",
      location: "Pune, India",
      startDate: "2014",
      endDate: "2018"
    }
  ],
  skills: [
    {
      category: "Technical",
      items: ["Java", "Kubernetes", "AWS", "Terraform", "CI/CD", "Microservices"]
    }
  ]
};

// 3️⃣ AI / ML ENGINEER — "Professional Plus"
export const mlEngineerResume: ResumeData = {
  personalInfo: {
    name: "Neha Verma",
    title: "Machine Learning Engineer",
    email: "neha.verma@email.com",
    phone: "+91 99887 76655",
    location: "Hyderabad, India",
    linkedin: "linkedin.com/in/nehaverma",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
  },
  summary: "Machine Learning Engineer with hands-on experience deploying NLP and predictive models into production environments.",
  experience: [
    {
      id: "exp1",
      company: "AI Startup",
      position: "ML Engineer",
      location: "Hyderabad, India",
      startDate: "Apr 2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Built NLP pipelines improving classification accuracy by 17%",
        "Deployed models using FastAPI and Docker",
        "Worked closely with product teams to align ML outputs with business goals"
      ]
    },
    {
      id: "exp2",
      company: "Analytics Firm",
      position: "Data Scientist",
      location: "Hyderabad, India",
      startDate: "Jun 2019",
      endDate: "Mar 2021",
      current: false,
      bullets: [
        "Developed forecasting models for demand prediction",
        "Improved model inference speed by 25%"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      school: "IIIT Hyderabad",
      degree: "M.Tech",
      field: "Data Science",
      location: "Hyderabad, India",
      startDate: "2017",
      endDate: "2019"
    }
  ],
  skills: [
    {
      category: "Technical",
      items: ["Python", "PyTorch", "NLP", "ML Pipelines", "Docker", "SQL"]
    }
  ]
};

// 4️⃣ PRODUCT MANAGER — "Executive Clean"
export const productManagerResume: ResumeData = {
  personalInfo: {
    name: "Ankit Sharma",
    title: "Product Manager",
    email: "ankit.sharma@email.com",
    phone: "+91 98765 11223",
    location: "Gurugram, India",
    linkedin: "linkedin.com/in/ankitsharma",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  summary: "Product Manager experienced in building B2B SaaS products through data-driven decision making and cross-functional leadership.",
  experience: [
    {
      id: "exp1",
      company: "Martech SaaS",
      position: "Senior Product Manager",
      location: "Gurugram, India",
      startDate: "Jan 2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Owned roadmap for analytics product used by 15K+ users",
        "Increased feature adoption by 38%",
        "Conducted user research influencing 6 major releases"
      ]
    },
    {
      id: "exp2",
      company: "E-commerce Platform",
      position: "Product Analyst",
      location: "Gurugram, India",
      startDate: "Aug 2017",
      endDate: "Dec 2020",
      current: false,
      bullets: [
        "Analyzed funnel metrics to reduce drop-offs by 21%",
        "Worked with engineering and design teams on MVP launches"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      school: "IIM Indore",
      degree: "MBA",
      field: "Business Administration",
      location: "Indore, India",
      startDate: "2015",
      endDate: "2017"
    }
  ],
  skills: [
    {
      category: "Product",
      items: ["Product Strategy", "Analytics", "Agile", "Stakeholder Management"]
    }
  ]
};

// 5️⃣ UI / UX DESIGNER — "Creative ATS Safe"
export const uxDesignerResume: ResumeData = {
  personalInfo: {
    name: "Aditi Rao",
    title: "UI/UX Designer",
    email: "aditi.rao@email.com",
    phone: "+91 99223 44556",
    location: "Mumbai, India",
    linkedin: "linkedin.com/in/aditirao",
    website: "aditirao.design",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
  },
  summary: "Product Designer focused on usability, accessibility, and conversion-oriented design for SaaS platforms.",
  experience: [
    {
      id: "exp1",
      company: "B2B SaaS Company",
      position: "Product Designer",
      location: "Mumbai, India",
      startDate: "Jun 2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Redesigned onboarding flow improving activation by 26%",
        "Built scalable design system used across 3 teams",
        "Conducted usability testing with 40+ users"
      ]
    },
    {
      id: "exp2",
      company: "Digital Agency",
      position: "UI Designer",
      location: "Mumbai, India",
      startDate: "Jan 2020",
      endDate: "May 2021",
      current: false,
      bullets: [
        "Delivered UI designs for fintech and healthcare clients",
        "Collaborated with developers to ensure design fidelity"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      school: "NIFT Mumbai",
      degree: "B.Des",
      field: "Communication Design",
      location: "Mumbai, India",
      startDate: "2016",
      endDate: "2020"
    }
  ],
  skills: [
    {
      category: "Design",
      items: ["Figma", "UX Research", "Design Systems", "Prototyping"]
    }
  ]
};

// 6️⃣ MARKETING / GROWTH — "Growth Pro"
export const growthMarketerResume: ResumeData = {
  personalInfo: {
    name: "Kunal Shah",
    title: "Growth Marketing Manager",
    email: "kunal.shah@email.com",
    phone: "+91 98001 23456",
    location: "Ahmedabad, India",
    linkedin: "linkedin.com/in/kunalshah",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
  },
  summary: "Growth marketer specializing in performance marketing, funnel optimization, and data-driven experimentation.",
  experience: [
    {
      id: "exp1",
      company: "D2C Brand",
      position: "Growth Manager",
      location: "Ahmedabad, India",
      startDate: "Feb 2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Scaled paid acquisition from Rs15L to Rs1Cr/month",
        "Improved CAC:LTV ratio from 1:2 to 1:4",
        "Built attribution dashboards for campaign analysis"
      ]
    },
    {
      id: "exp2",
      company: "Startup",
      position: "Digital Marketing Lead",
      location: "Ahmedabad, India",
      startDate: "Jun 2018",
      endDate: "Jan 2021",
      current: false,
      bullets: [
        "Led SEO and paid media initiatives",
        "Increased organic traffic by 45%"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      school: "Gujarat University",
      degree: "BBA",
      field: "Marketing",
      location: "Ahmedabad, India",
      startDate: "2014",
      endDate: "2017"
    }
  ],
  skills: [
    {
      category: "Marketing",
      items: ["Performance Marketing", "Analytics", "SEO", "Paid Media"]
    }
  ]
};

// 7️⃣ FINANCE — "Finance Professional"
export const financeAnalystResume: ResumeData = {
  personalInfo: {
    name: "Rakesh Iyer",
    title: "Financial Analyst",
    email: "rakesh.iyer@email.com",
    phone: "+91 98445 67890",
    location: "Chennai, India",
    linkedin: "linkedin.com/in/rakeshiyer",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face"
  },
  summary: "Financial Analyst with experience in valuation, financial modeling, and investment research.",
  experience: [
    {
      id: "exp1",
      company: "Investment Firm",
      position: "Financial Analyst",
      location: "Chennai, India",
      startDate: "Mar 2020",
      endDate: "Present",
      current: true,
      bullets: [
        "Built DCF and comparable valuation models",
        "Supported deal teams on mid-market transactions",
        "Conducted industry research and financial due diligence"
      ]
    },
    {
      id: "exp2",
      company: "Consulting Firm",
      position: "Junior Analyst",
      location: "Chennai, India",
      startDate: "Jul 2018",
      endDate: "Feb 2020",
      current: false,
      bullets: [
        "Prepared financial reports and dashboards",
        "Assisted in budgeting and forecasting exercises"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      school: "XLRI Jamshedpur",
      degree: "MBA",
      field: "Finance",
      location: "Jamshedpur, India",
      startDate: "2016",
      endDate: "2018"
    }
  ],
  skills: [
    {
      category: "Finance",
      items: ["Financial Modeling", "Valuation", "Excel", "PowerPoint"]
    }
  ]
};

// 8️⃣ HEALTHCARE / EDUCATION — "Academic Professional"
export const healthcareManagerResume: ResumeData = {
  personalInfo: {
    name: "Dr. Pooja Nair",
    title: "Healthcare Operations Manager",
    email: "pooja.nair@email.com",
    phone: "+91 94567 89012",
    location: "Kochi, India",
    linkedin: "linkedin.com/in/poojanair",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
  },
  summary: "Healthcare operations professional with experience managing clinical workflows and compliance.",
  experience: [
    {
      id: "exp1",
      company: "Multi-Specialty Hospital",
      position: "Operations Manager",
      location: "Kochi, India",
      startDate: "Jan 2019",
      endDate: "Present",
      current: true,
      bullets: [
        "Managed daily operations across 5 departments",
        "Reduced patient wait times by 18%",
        "Implemented compliance workflows reducing audit findings"
      ]
    },
    {
      id: "exp2",
      company: "Private Clinic",
      position: "Healthcare Administrator",
      location: "Kochi, India",
      startDate: "Aug 2015",
      endDate: "Dec 2018",
      current: false,
      bullets: [
        "Coordinated patient scheduling and reporting systems",
        "Managed vendor and insurance coordination"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      school: "Amrita University",
      degree: "MBA",
      field: "Healthcare Management",
      location: "Kochi, India",
      startDate: "2013",
      endDate: "2015"
    }
  ],
  skills: [
    {
      category: "Healthcare",
      items: ["Healthcare Operations", "Compliance", "Process Optimization"]
    }
  ]
};

// 9️⃣ EXECUTIVE / CXO — "Executive Classic CV"
export const ctoExecutiveResume: ResumeData = {
  personalInfo: {
    name: "Sandeep Malhotra",
    title: "Chief Technology Officer",
    email: "sandeep.malhotra@email.com",
    phone: "+65 9123 4567",
    location: "Singapore",
    linkedin: "linkedin.com/in/sandeepmalhotra",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
  },
  summary: "Technology leader with experience scaling engineering organizations and delivering enterprise-grade platforms.",
  experience: [
    {
      id: "exp1",
      company: "Global SaaS Company",
      position: "Chief Technology Officer",
      location: "Singapore",
      startDate: "Jan 2020",
      endDate: "Present",
      current: true,
      bullets: [
        "Scaled engineering team from 15 to 140+",
        "Led architecture for platform serving 6M+ users",
        "Reduced cloud costs by $1.4M annually"
      ]
    },
    {
      id: "exp2",
      company: "Enterprise Software Firm",
      position: "Engineering Director",
      location: "Singapore",
      startDate: "Mar 2014",
      endDate: "Dec 2019",
      current: false,
      bullets: [
        "Oversaw delivery of large-scale distributed systems",
        "Mentored senior engineering leadership"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      school: "National University of Singapore",
      degree: "M.S.",
      field: "Computer Science",
      location: "Singapore",
      startDate: "2004",
      endDate: "2006"
    }
  ],
  skills: [
    {
      category: "Leadership",
      items: ["Technology Strategy", "Cloud Architecture", "Leadership"]
    }
  ]
};

// Template to Resume mapping
export const templateResumeMap: Record<string, ResumeData> = {
  // Technical
  "modern-minimal": softwareEngineerResume,
  "tech-focused": devopsEngineerResume,
  "devops-pro": devopsEngineerResume,
  "ai-ml-engineer": mlEngineerResume,
  "data-driven": mlEngineerResume,
  
  // Professional/Business
  "corporate-standard": financeAnalystResume,
  "professional-plus": mlEngineerResume,
  "consultant-pro": productManagerResume,
  "finance-analyst": financeAnalystResume,
  "healthcare-pro": healthcareManagerResume,
  
  // Creative
  "creative-edge": uxDesignerResume,
  "product-manager": productManagerResume,
  "ux-designer": uxDesignerResume,
  
  // Executive
  "executive-classic": ctoExecutiveResume,
  "academic-formal": healthcareManagerResume,
  "director-level": ctoExecutiveResume,
  "cxo-prestige": ctoExecutiveResume,
  
  // Modern/Startup
  "startup-ready": softwareEngineerResume,
  "growth-hacker": growthMarketerResume,
  "sales-impact": growthMarketerResume,
};

export const getResumeForTemplate = (templateId: string): ResumeData => {
  return templateResumeMap[templateId] || softwareEngineerResume;
};
