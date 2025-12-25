export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
    photo?: string;
  };
  summary: string;
  experience: {
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  certifications?: {
    id: string;
    name: string;
    issuer: string;
    date: string;
  }[];
  projects?: {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }[];
  languages?: {
    language: string;
    proficiency: string;
  }[];
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: "professional" | "modern" | "creative" | "executive" | "technical";
  accentColor: string;
  fontPrimary: string;
  fontSecondary: string;
  pages: 1 | 2;
  hasPhoto: boolean;
  layout: "single-column" | "two-column" | "sidebar";
}

export interface UserSegment {
  careerStage: "student" | "fresher" | "professional" | "senior" | "executive";
  urgency: "exploring" | "active" | "interview" | "emergency";
  yearsOfExperience: number;
  industry: string;
  targetRole: string;
  geography: "india" | "global";
  isReturning: boolean;
  resumeQualityScore?: number;
  atsRiskLevel?: "low" | "medium" | "high";
}

// Hero Section - Technical Java Architect Resume
export const heroResumeData: ResumeData = {
  personalInfo: {
    name: "Priya Sharma",
    title: "Senior Technical Java Architect",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
    linkedin: "linkedin.com/in/priyasharma",
    website: "priyasharma.dev",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
  },
  summary: "Distinguished Technical Architect with 12+ years of experience designing enterprise-scale Java applications and microservices architectures. Led digital transformation initiatives for Fortune 500 clients, delivering platforms processing 50M+ transactions daily. Expert in cloud-native solutions, distributed systems, and mentoring high-performing engineering teams.",
  experience: [
    {
      id: "exp1",
      company: "Infosys Technologies",
      position: "Principal Technical Architect",
      location: "Bangalore, India",
      startDate: "Apr 2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected microservices platform for banking client serving 25M+ users with 99.99% uptime",
        "Led team of 45 engineers across 3 countries, reducing time-to-market by 60%",
        "Designed event-driven architecture processing 2M+ real-time transactions per hour",
        "Implemented DevSecOps practices reducing security vulnerabilities by 85%"
      ]
    },
    {
      id: "exp2",
      company: "Wipro Digital",
      position: "Senior Solutions Architect",
      location: "Hyderabad, India",
      startDate: "Jan 2018",
      endDate: "Mar 2021",
      current: false,
      bullets: [
        "Designed cloud migration strategy for telecom giant, saving $4.2M annually in infrastructure costs",
        "Built real-time analytics platform ingesting 500GB+ daily using Kafka and Spark",
        "Established architectural governance framework adopted across 12 delivery centers",
        "Mentored 20+ developers, with 8 achieving senior architect roles"
      ]
    },
    {
      id: "exp3",
      company: "Tata Consultancy Services",
      position: "Technical Lead",
      location: "Mumbai, India",
      startDate: "Jul 2014",
      endDate: "Dec 2017",
      current: false,
      bullets: [
        "Developed core banking module handling ₹500Cr+ daily transactions",
        "Migrated legacy monolith to Spring Boot microservices, improving performance 4x",
        "Implemented CI/CD pipelines reducing deployment time from days to hours",
        "Won TCS Best Innovation Award for automated testing framework"
      ]
    },
    {
      id: "exp4",
      company: "Tech Mahindra",
      position: "Senior Software Engineer",
      location: "Pune, India",
      startDate: "Jun 2012",
      endDate: "Jun 2014",
      current: false,
      bullets: [
        "Built RESTful APIs for e-commerce platform serving 1M+ daily requests",
        "Optimized database queries reducing response time by 70%",
        "Contributed to open-source Java libraries with 2K+ GitHub stars"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      school: "Indian Institute of Technology, Delhi",
      degree: "Master of Technology",
      field: "Computer Science & Engineering",
      location: "New Delhi, India",
      startDate: "2010",
      endDate: "2012",
      gpa: "9.2/10"
    },
    {
      id: "edu2",
      school: "National Institute of Technology, Trichy",
      degree: "Bachelor of Technology",
      field: "Information Technology",
      location: "Tiruchirappalli, India",
      startDate: "2006",
      endDate: "2010",
      gpa: "8.8/10"
    }
  ],
  skills: [
    {
      category: "Languages & Frameworks",
      items: ["Java 17+", "Spring Boot", "Spring Cloud", "Hibernate", "Kotlin", "Python"]
    },
    {
      category: "Architecture & Design",
      items: ["Microservices", "Event-Driven", "Domain-Driven Design", "CQRS", "Saga Pattern", "API Gateway"]
    },
    {
      category: "Cloud & DevOps",
      items: ["AWS", "Azure", "Kubernetes", "Docker", "Terraform", "Jenkins", "ArgoCD"]
    },
    {
      category: "Data & Messaging",
      items: ["PostgreSQL", "MongoDB", "Redis", "Kafka", "RabbitMQ", "Elasticsearch"]
    }
  ],
  certifications: [
    { id: "cert1", name: "AWS Solutions Architect Professional", issuer: "Amazon Web Services", date: "2023" },
    { id: "cert2", name: "Google Cloud Professional Architect", issuer: "Google", date: "2022" },
    { id: "cert3", name: "Oracle Certified Master, Java SE", issuer: "Oracle", date: "2021" },
    { id: "cert4", name: "TOGAF 9.2 Certified", issuer: "The Open Group", date: "2020" }
  ],
  projects: [
    {
      id: "proj1",
      name: "Unified Payments Interface Gateway",
      description: "Designed high-availability payment gateway processing 10M+ UPI transactions daily for major Indian bank",
      technologies: ["Java 17", "Spring Boot", "Kafka", "Redis", "PostgreSQL", "Kubernetes"],
      link: "Confidential"
    },
    {
      id: "proj2",
      name: "Open Banking Platform",
      description: "Architected API banking platform enabling 200+ fintech integrations with PSD2 compliance",
      technologies: ["Spring Cloud", "OAuth2", "Kong API Gateway", "MongoDB", "Docker"],
      link: "Confidential"
    }
  ],
  languages: [
    { language: "English", proficiency: "Professional" },
    { language: "Hindi", proficiency: "Native" },
    { language: "Tamil", proficiency: "Conversational" }
  ]
};

// Sample resume data for previews
export const sampleResumeData: ResumeData = {
  personalInfo: {
    name: "Alexandra Chen",
    title: "Senior Product Manager",
    email: "alexandra.chen@email.com",
    phone: "(415) 555-0123",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexandrachen",
    website: "alexandrachen.com",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
  },
  summary: "Results-driven Product Manager with 8+ years of experience leading cross-functional teams to deliver innovative B2B SaaS products. Proven track record of increasing user engagement by 45% and driving $12M in annual recurring revenue. Expert in agile methodologies, user research, and data-driven decision making.",
  experience: [
    {
      id: "exp1",
      company: "TechVentures Inc.",
      position: "Senior Product Manager",
      location: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Led product strategy for enterprise platform serving 2M+ users, resulting in 45% increase in daily active users",
        "Managed $5M product budget and team of 12 engineers, designers, and analysts",
        "Launched AI-powered analytics feature that generated $4.2M in new ARR within first year",
        "Reduced customer churn by 32% through implementation of proactive support features"
      ]
    },
    {
      id: "exp2",
      company: "InnovateSoft",
      position: "Product Manager",
      location: "Seattle, WA",
      startDate: "Mar 2018",
      endDate: "Dec 2020",
      current: false,
      bullets: [
        "Drove product roadmap for B2B collaboration tool from 0 to 500K users",
        "Conducted 200+ user interviews to identify pain points and validate solutions",
        "Implemented OKR framework across product organization, improving goal alignment by 60%",
        "Partnered with sales team to close $8M in enterprise deals through custom feature development"
      ]
    },
    {
      id: "exp3",
      company: "StartupLabs",
      position: "Associate Product Manager",
      location: "Austin, TX",
      startDate: "Jun 2016",
      endDate: "Feb 2018",
      current: false,
      bullets: [
        "Managed product lifecycle for mobile app with 100K+ downloads",
        "Coordinated A/B testing program that improved conversion rates by 28%",
        "Created comprehensive product documentation and user guides"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      school: "Stanford University",
      degree: "Master of Business Administration",
      field: "Technology Management",
      location: "Stanford, CA",
      startDate: "2014",
      endDate: "2016",
      gpa: "3.9"
    },
    {
      id: "edu2",
      school: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2010",
      endDate: "2014",
      gpa: "3.7"
    }
  ],
  skills: [
    {
      category: "Product",
      items: ["Product Strategy", "Roadmap Planning", "User Research", "A/B Testing", "Agile/Scrum", "OKRs"]
    },
    {
      category: "Technical",
      items: ["SQL", "Python", "Figma", "Jira", "Amplitude", "Mixpanel"]
    },
    {
      category: "Leadership",
      items: ["Cross-functional Leadership", "Stakeholder Management", "Executive Presentations", "Mentoring"]
    }
  ],
  certifications: [
    { id: "cert1", name: "Certified Scrum Product Owner (CSPO)", issuer: "Scrum Alliance", date: "2022" },
    { id: "cert2", name: "Product Management Certificate", issuer: "Product School", date: "2020" }
  ],
  projects: [
    {
      id: "proj1",
      name: "AI Customer Insights Platform",
      description: "Led development of ML-powered platform that analyzes customer feedback to identify product opportunities",
      technologies: ["Python", "TensorFlow", "React", "AWS"],
      link: "github.com/alexchen/ai-insights"
    }
  ],
  languages: [
    { language: "English", proficiency: "Native" },
    { language: "Mandarin", proficiency: "Fluent" },
    { language: "Spanish", proficiency: "Intermediate" }
  ]
};

export const sampleResumeDataEngineer: ResumeData = {
  personalInfo: {
    name: "Marcus Johnson",
    title: "Senior Software Engineer",
    email: "marcus.johnson@email.com",
    phone: "(512) 555-0198",
    location: "Austin, TX",
    linkedin: "linkedin.com/in/marcusjohnson",
    website: "marcusjohnson.dev",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  summary: "Full-stack engineer with 7 years of experience building scalable web applications and distributed systems. Passionate about clean code, performance optimization, and mentoring junior developers. Contributed to open-source projects with 5K+ GitHub stars.",
  experience: [
    {
      id: "exp1",
      company: "Meta",
      position: "Senior Software Engineer",
      location: "Menlo Park, CA",
      startDate: "Feb 2022",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected real-time messaging infrastructure handling 500M+ messages daily",
        "Reduced API latency by 60% through implementation of GraphQL federation",
        "Led migration of legacy monolith to microservices, improving deployment frequency 10x",
        "Mentored 5 junior engineers, with 3 receiving promotions within 18 months"
      ]
    },
    {
      id: "exp2",
      company: "Stripe",
      position: "Software Engineer",
      location: "San Francisco, CA",
      startDate: "Jun 2019",
      endDate: "Jan 2022",
      current: false,
      bullets: [
        "Built payment processing pipeline handling $2B+ in annual transactions",
        "Developed fraud detection system that reduced chargebacks by 35%",
        "Created internal developer tools used by 200+ engineers daily",
        "Implemented automated testing infrastructure improving code coverage to 95%"
      ]
    },
    {
      id: "exp3",
      company: "Shopify",
      position: "Software Engineer",
      location: "Ottawa, Canada",
      startDate: "Jul 2017",
      endDate: "May 2019",
      current: false,
      bullets: [
        "Developed checkout optimization features increasing conversion by 12%",
        "Built real-time inventory sync system for 100K+ merchants",
        "Contributed to open-source Ruby gems with 2K+ downloads"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      school: "University of Texas at Austin",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "Austin, TX",
      startDate: "2013",
      endDate: "2017",
      gpa: "3.8"
    }
  ],
  skills: [
    {
      category: "Languages",
      items: ["TypeScript", "Python", "Go", "Rust", "Ruby", "SQL"]
    },
    {
      category: "Frameworks",
      items: ["React", "Node.js", "GraphQL", "Django", "Rails", "Next.js"]
    },
    {
      category: "Infrastructure",
      items: ["AWS", "Kubernetes", "Docker", "Terraform", "PostgreSQL", "Redis"]
    }
  ],
  certifications: [
    { id: "cert1", name: "AWS Solutions Architect Professional", issuer: "Amazon Web Services", date: "2023" },
    { id: "cert2", name: "Google Cloud Professional", issuer: "Google", date: "2022" }
  ],
  projects: [
    {
      id: "proj1",
      name: "OpenAPI Generator",
      description: "Open-source tool for generating type-safe API clients from OpenAPI specs",
      technologies: ["TypeScript", "Node.js", "GitHub Actions"],
      link: "github.com/marcusjohnson/openapi-gen"
    }
  ],
  languages: [
    { language: "English", proficiency: "Native" },
    { language: "Portuguese", proficiency: "Conversational" }
  ]
};

export const sampleResumeDataDesigner: ResumeData = {
  personalInfo: {
    name: "Sophia Martinez",
    title: "UX/UI Design Lead",
    email: "sophia.martinez@email.com",
    phone: "(323) 555-0167",
    location: "Los Angeles, CA",
    linkedin: "linkedin.com/in/sophiamartinez",
    website: "sophiamartinez.design",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  summary: "Creative design leader with 9 years of experience crafting user-centered digital experiences. Led design systems serving 50+ products and mentored teams of 8+ designers. Passionate about accessibility, design ethics, and bridging the gap between business goals and user needs.",
  experience: [
    {
      id: "exp1",
      company: "Airbnb",
      position: "Senior UX Design Lead",
      location: "San Francisco, CA",
      startDate: "Mar 2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Lead design for host experience platform serving 4M+ hosts globally",
        "Established design system reducing design-to-development time by 40%",
        "Increased host onboarding completion rate by 35% through redesigned flow",
        "Manage and mentor team of 8 product designers across 3 time zones"
      ]
    },
    {
      id: "exp2",
      company: "Spotify",
      position: "Senior Product Designer",
      location: "New York, NY",
      startDate: "Aug 2018",
      endDate: "Feb 2021",
      current: false,
      bullets: [
        "Redesigned podcast discovery experience reaching 100M+ listeners",
        "Led accessibility initiative achieving WCAG 2.1 AA compliance",
        "Created design language for new creator tools platform",
        "Conducted 150+ user research sessions across 12 countries"
      ]
    },
    {
      id: "exp3",
      company: "IDEO",
      position: "Product Designer",
      location: "Palo Alto, CA",
      startDate: "Jun 2015",
      endDate: "Jul 2018",
      current: false,
      bullets: [
        "Designed digital products for Fortune 500 clients including Nike, Ford, and Coca-Cola",
        "Facilitated design thinking workshops for executive leadership teams",
        "Won Cooper Hewitt Design Award for healthcare innovation project"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      school: "Rhode Island School of Design",
      degree: "Master of Fine Arts",
      field: "Graphic Design",
      location: "Providence, RI",
      startDate: "2013",
      endDate: "2015"
    },
    {
      id: "edu2",
      school: "UCLA",
      degree: "Bachelor of Arts",
      field: "Design Media Arts",
      location: "Los Angeles, CA",
      startDate: "2009",
      endDate: "2013"
    }
  ],
  skills: [
    {
      category: "Design",
      items: ["User Research", "Interaction Design", "Visual Design", "Prototyping", "Design Systems", "Accessibility"]
    },
    {
      category: "Tools",
      items: ["Figma", "Sketch", "Adobe Creative Suite", "Principle", "Framer", "Miro"]
    },
    {
      category: "Methods",
      items: ["Design Thinking", "User Testing", "A/B Testing", "Design Sprints", "Workshop Facilitation"]
    }
  ],
  certifications: [
    { id: "cert1", name: "Google UX Design Professional Certificate", issuer: "Google", date: "2022" }
  ],
  languages: [
    { language: "English", proficiency: "Native" },
    { language: "Spanish", proficiency: "Native" }
  ]
};

export const sampleResumeDataExecutive: ResumeData = {
  personalInfo: {
    name: "Robert Williams",
    title: "Chief Technology Officer",
    email: "robert.williams@email.com",
    phone: "(617) 555-0142",
    location: "Boston, MA",
    linkedin: "linkedin.com/in/robertwilliams",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  summary: "Visionary technology executive with 15+ years of experience scaling engineering organizations from startup to IPO. Successfully led technical transformation at 3 companies, generating over $500M in enterprise value. Board advisor to 4 tech startups and published author on engineering leadership.",
  experience: [
    {
      id: "exp1",
      company: "DataCloud Systems",
      position: "Chief Technology Officer",
      location: "Boston, MA",
      startDate: "Jan 2020",
      endDate: "Present",
      current: true,
      bullets: [
        "Scaled engineering organization from 50 to 300+ engineers across 5 global offices",
        "Led technical strategy for successful $2.1B IPO in 2023",
        "Architected cloud-native platform migration reducing infrastructure costs by $15M annually",
        "Established AI/ML center of excellence, launching 12 ML-powered products"
      ]
    },
    {
      id: "exp2",
      company: "FinanceFlow",
      position: "VP of Engineering",
      location: "New York, NY",
      startDate: "Mar 2016",
      endDate: "Dec 2019",
      current: false,
      bullets: [
        "Built and managed engineering team of 120 across 4 product lines",
        "Led acquisition integration of 2 companies with combined 80 engineers",
        "Reduced time-to-market by 65% through implementation of DevOps practices",
        "Achieved 99.99% uptime for mission-critical financial systems"
      ]
    },
    {
      id: "exp3",
      company: "TechStartup (Acquired by Google)",
      position: "Engineering Director",
      location: "San Francisco, CA",
      startDate: "Aug 2012",
      endDate: "Feb 2016",
      current: false,
      bullets: [
        "Led engineering team through $450M acquisition by Google",
        "Scaled real-time analytics platform to process 1B+ events daily",
        "Hired and developed team from 8 to 45 engineers"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      school: "MIT",
      degree: "Master of Science",
      field: "Computer Science",
      location: "Cambridge, MA",
      startDate: "2008",
      endDate: "2010"
    },
    {
      id: "edu2",
      school: "Harvard University",
      degree: "Bachelor of Arts",
      field: "Applied Mathematics",
      location: "Cambridge, MA",
      startDate: "2004",
      endDate: "2008",
      gpa: "Magna Cum Laude"
    }
  ],
  skills: [
    {
      category: "Leadership",
      items: ["Engineering Strategy", "M&A Integration", "Board Relations", "Investor Communications", "P&L Management"]
    },
    {
      category: "Technical",
      items: ["Cloud Architecture", "System Design", "AI/ML Strategy", "Security & Compliance", "DevOps"]
    }
  ],
  certifications: [
    { id: "cert1", name: "Board Leadership Program", issuer: "Harvard Business School", date: "2022" }
  ],
  languages: [
    { language: "English", proficiency: "Native" },
    { language: "German", proficiency: "Fluent" }
  ]
};
