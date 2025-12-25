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
  data: ResumeData;
}

export const industryResumes: IndustryTemplate[] = [
  // TECHNOLOGY
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
      summary: "Full-stack developer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud infrastructure. Passionate about clean code and mentoring junior developers.",
      experience: [
        {
          id: "exp1",
          company: "Coinbase",
          position: "Senior Full-Stack Developer",
          location: "San Jose, CA",
          startDate: "Mar 2022",
          endDate: "Present",
          current: true,
          bullets: [
            "Architected real-time trading dashboard processing 100K+ transactions/minute",
            "Led migration from REST to GraphQL reducing API calls by 60%",
            "Mentored team of 4 junior developers, improving code quality by 35%"
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
        { category: "Languages", items: ["TypeScript", "Python", "Go", "SQL"] },
        { category: "Frameworks", items: ["React", "Node.js", "GraphQL", "Next.js"] },
        { category: "Cloud", items: ["AWS", "Docker", "Kubernetes", "Terraform"] }
      ]
    }
  },
  {
    id: "backend-engineer-senior",
    name: "Backend Engineer",
    role: "Senior",
    industry: "Technology",
    category: "technology",
    badge: "Technical",
    accentColor: "hsl(200, 70%, 45%)",
    data: {
      personalInfo: {
        name: "Brandon Hale",
        title: "Senior Backend Engineer",
        email: "brandon.hale@email.com",
        phone: "+1 (512) 555-0198",
        location: "Austin, TX",
        linkedin: "linkedin.com/in/brandonhale",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Backend engineer with 7+ years building distributed systems at scale. Expert in microservices architecture, database optimization, and API design. Led teams delivering platforms serving 50M+ users.",
      experience: [
        {
          id: "exp1",
          company: "Stripe",
          position: "Senior Backend Engineer",
          location: "San Francisco, CA",
          startDate: "Jan 2021",
          endDate: "Present",
          current: true,
          bullets: [
            "Designed payment processing system handling $2B+ annually",
            "Reduced API latency by 45% through caching and optimization",
            "Built fraud detection pipeline preventing $50M+ in losses"
          ]
        },
        {
          id: "exp2",
          company: "Uber",
          position: "Backend Engineer",
          location: "Austin, TX",
          startDate: "Aug 2018",
          endDate: "Dec 2020",
          current: false,
          bullets: [
            "Developed real-time pricing engine processing 10M+ requests/day",
            "Migrated monolith to microservices improving deployment by 10x",
            "Optimized database queries reducing costs by $1.2M annually"
          ]
        }
      ],
      education: [{
        id: "edu1",
        school: "University of Texas at Austin",
        degree: "Master of Science",
        field: "Computer Science",
        location: "Austin, TX",
        startDate: "2016",
        endDate: "2018"
      }],
      skills: [
        { category: "Languages", items: ["Go", "Python", "Java", "Rust"] },
        { category: "Databases", items: ["PostgreSQL", "Redis", "Cassandra", "MongoDB"] },
        { category: "Infrastructure", items: ["Kubernetes", "Kafka", "gRPC", "AWS"] }
      ]
    }
  },
  {
    id: "devops-engineer",
    name: "DevOps Engineer",
    role: "Senior",
    industry: "Technology",
    category: "technology",
    badge: "Technical",
    accentColor: "hsl(160, 65%, 40%)",
    data: {
      personalInfo: {
        name: "Aisha Patel",
        title: "Senior DevOps Engineer",
        email: "aisha.patel@email.com",
        phone: "+1 (206) 555-0156",
        location: "Seattle, WA",
        linkedin: "linkedin.com/in/aishapatel",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
      },
      summary: "DevOps engineer with 6+ years expertise in cloud infrastructure and CI/CD automation. Reduced deployment times by 80% and achieved 99.99% uptime across production systems.",
      experience: [
        {
          id: "exp1",
          company: "Amazon Web Services",
          position: "Senior DevOps Engineer",
          location: "Seattle, WA",
          startDate: "Apr 2021",
          endDate: "Present",
          current: true,
          bullets: [
            "Managed infrastructure for 500+ microservices serving millions",
            "Implemented GitOps workflow reducing deployment failures by 75%",
            "Built cost optimization tools saving $3M+ annually"
          ]
        }
      ],
      education: [{
        id: "edu1",
        school: "University of Washington",
        degree: "Bachelor of Science",
        field: "Information Systems",
        location: "Seattle, WA",
        startDate: "2014",
        endDate: "2018"
      }],
      skills: [
        { category: "Cloud", items: ["AWS", "GCP", "Azure", "Terraform"] },
        { category: "Containers", items: ["Docker", "Kubernetes", "ECS", "Helm"] },
        { category: "CI/CD", items: ["Jenkins", "GitHub Actions", "ArgoCD", "Spinnaker"] }
      ]
    }
  },
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
      summary: "ML engineer with 5+ years building production AI systems. Expertise in NLP, computer vision, and recommendation systems. Published researcher with 3 papers at top conferences.",
      experience: [
        {
          id: "exp1",
          company: "Google",
          position: "Senior ML Engineer",
          location: "Mountain View, CA",
          startDate: "Feb 2021",
          endDate: "Present",
          current: true,
          bullets: [
            "Led development of LLM-powered search features used by 1B+ users",
            "Improved recommendation accuracy by 35% using transformer models",
            "Designed ML infrastructure reducing training costs by 40%"
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
        { category: "ML/AI", items: ["PyTorch", "TensorFlow", "Transformers", "LLMs"] },
        { category: "Languages", items: ["Python", "C++", "CUDA", "SQL"] },
        { category: "Infrastructure", items: ["MLflow", "Kubeflow", "Ray", "Spark"] }
      ]
    }
  },

  // PRODUCT & DESIGN
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
      summary: "Product leader with 8+ years driving B2B SaaS growth from 0 to $50M ARR. Expert in user research, data-driven decision making, and cross-functional leadership.",
      experience: [
        {
          id: "exp1",
          company: "Figma",
          position: "Senior Product Manager",
          location: "San Francisco, CA",
          startDate: "Jan 2021",
          endDate: "Present",
          current: true,
          bullets: [
            "Led product strategy for collaboration features used by 4M+ designers",
            "Drove 45% increase in enterprise adoption through security features",
            "Managed roadmap for $15M annual product line"
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
        { category: "Product", items: ["Strategy", "Roadmapping", "User Research", "A/B Testing"] },
        { category: "Technical", items: ["SQL", "Amplitude", "Figma", "Jira"] },
        { category: "Leadership", items: ["Cross-functional", "OKRs", "Stakeholder Management"] }
      ]
    }
  },
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
        name: "Isabella Adams",
        title: "Senior UX Design Lead",
        email: "isabella.adams@email.com",
        phone: "+1 (323) 555-0189",
        location: "Los Angeles, CA",
        linkedin: "linkedin.com/in/isabellaadams",
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Design leader with 9+ years creating user-centered digital experiences. Led design systems serving 50+ products and mentored teams of 8+ designers.",
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
            "Lead design for host experience serving 4M+ hosts globally",
            "Established design system reducing design-dev time by 40%",
            "Increased host onboarding completion by 35%"
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
        { category: "Design", items: ["User Research", "Interaction Design", "Visual Design", "Prototyping"] },
        { category: "Tools", items: ["Figma", "Sketch", "Principle", "Framer"] },
        { category: "Methods", items: ["Design Thinking", "User Testing", "Design Sprints"] }
      ]
    }
  },

  // BUSINESS & CONSULTING
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
        name: "Abigail Hall",
        title: "Senior Business Analyst",
        email: "abigail.hall@email.com",
        phone: "+1 (617) 555-0145",
        location: "Boston, MA",
        linkedin: "linkedin.com/in/abigailhall",
        photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Business analyst with 7+ years translating complex requirements into actionable solutions. Expert in process optimization, stakeholder management, and data-driven insights.",
      experience: [
        {
          id: "exp1",
          company: "Deloitte",
          position: "Senior Business Analyst",
          location: "Boston, MA",
          startDate: "Apr 2020",
          endDate: "Present",
          current: true,
          bullets: [
            "Led requirements for $50M digital transformation program",
            "Reduced operational costs by 30% through process optimization",
            "Managed stakeholder relationships across 12 business units"
          ]
        }
      ],
      education: [{
        id: "edu1",
        school: "Boston University",
        degree: "Master of Science",
        field: "Business Analytics",
        location: "Boston, MA",
        startDate: "2016",
        endDate: "2018"
      }],
      skills: [
        { category: "Analysis", items: ["Requirements Gathering", "Process Mapping", "Data Analysis"] },
        { category: "Tools", items: ["SQL", "Tableau", "JIRA", "Confluence"] },
        { category: "Business", items: ["Stakeholder Management", "Agile", "Scrum"] }
      ]
    }
  },
  {
    id: "management-consultant",
    name: "Management Consultant",
    role: "Associate",
    industry: "Consulting",
    category: "business",
    badge: "Executive",
    accentColor: "hsl(35, 70%, 45%)",
    data: {
      personalInfo: {
        name: "James Moore",
        title: "Senior Strategy Consultant",
        email: "james.moore@email.com",
        phone: "+1 (212) 555-0178",
        location: "New York, NY",
        linkedin: "linkedin.com/in/jamesmoore",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Strategy consultant with 6+ years at top-tier firms advising Fortune 500 clients on growth strategy, M&A, and digital transformation.",
      experience: [
        {
          id: "exp1",
          company: "McKinsey & Company",
          position: "Senior Associate",
          location: "New York, NY",
          startDate: "Aug 2020",
          endDate: "Present",
          current: true,
          bullets: [
            "Led 15+ engagements generating $200M+ in client value",
            "Advised C-suite on $5B merger integration strategy",
            "Built proprietary AI tool adopted across 40+ projects"
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
        { category: "Strategy", items: ["Corporate Strategy", "M&A", "Market Entry", "Due Diligence"] },
        { category: "Analysis", items: ["Financial Modeling", "Market Sizing", "Competitive Analysis"] },
        { category: "Leadership", items: ["Executive Presentations", "Team Leadership", "Client Management"] }
      ]
    }
  },

  // MARKETING & SALES
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
        title: "Senior Growth Marketing Manager",
        email: "emma.wilson@email.com",
        phone: "+1 (310) 555-0134",
        location: "Los Angeles, CA",
        linkedin: "linkedin.com/in/emmawilson",
        photo: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Growth marketer with 6+ years scaling startups from seed to Series C. Expert in acquisition, retention, and data-driven experimentation.",
      experience: [
        {
          id: "exp1",
          company: "HubSpot",
          position: "Senior Growth Marketing Manager",
          location: "Los Angeles, CA",
          startDate: "Jan 2021",
          endDate: "Present",
          current: true,
          bullets: [
            "Drove 150% YoY growth in organic acquisition",
            "Managed $5M annual marketing budget with 4.5x ROAS",
            "Built A/B testing program improving conversion by 45%"
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
        { category: "Growth", items: ["SEO", "Paid Acquisition", "CRO", "Retention"] },
        { category: "Tools", items: ["Google Analytics", "Mixpanel", "Optimizely", "Segment"] },
        { category: "Analysis", items: ["SQL", "Excel", "Looker", "Tableau"] }
      ]
    }
  },
  {
    id: "b2b-sales-manager",
    name: "B2B Sales Manager",
    role: "Senior",
    industry: "Sales",
    category: "marketing",
    badge: "ATS-Optimized",
    accentColor: "hsl(25, 70%, 50%)",
    data: {
      personalInfo: {
        name: "Michael Chen",
        title: "Senior Enterprise Sales Manager",
        email: "michael.chen@email.com",
        phone: "+1 (646) 555-0167",
        location: "New York, NY",
        linkedin: "linkedin.com/in/michaelchen",
        photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Enterprise sales leader with 8+ years closing complex B2B deals. Consistently exceeded quotas by 130%+ and built high-performing sales teams.",
      experience: [
        {
          id: "exp1",
          company: "Salesforce",
          position: "Senior Enterprise Account Executive",
          location: "New York, NY",
          startDate: "Mar 2020",
          endDate: "Present",
          current: true,
          bullets: [
            "Closed $15M+ in enterprise deals annually at 135% quota",
            "Built strategic relationships with 50+ Fortune 500 accounts",
            "Mentored 6 AEs, 4 promoted to senior roles"
          ]
        }
      ],
      education: [{
        id: "edu1",
        school: "NYU Stern",
        degree: "Bachelor of Science",
        field: "Business Administration",
        location: "New York, NY",
        startDate: "2012",
        endDate: "2016"
      }],
      skills: [
        { category: "Sales", items: ["Enterprise Sales", "Solution Selling", "Negotiation", "Account Management"] },
        { category: "Tools", items: ["Salesforce", "Outreach", "LinkedIn Sales Navigator", "Gong"] },
        { category: "Leadership", items: ["Team Building", "Coaching", "Pipeline Management"] }
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
        title: "Senior Financial Analyst",
        email: "sarah.johnson@email.com",
        phone: "+1 (312) 555-0156",
        location: "Chicago, IL",
        linkedin: "linkedin.com/in/sarahjohnson",
        photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Financial analyst with 5+ years in corporate finance and FP&A. Expert in financial modeling, forecasting, and strategic planning for high-growth companies.",
      experience: [
        {
          id: "exp1",
          company: "Goldman Sachs",
          position: "Senior Financial Analyst",
          location: "Chicago, IL",
          startDate: "Jun 2020",
          endDate: "Present",
          current: true,
          bullets: [
            "Built financial models for $2B+ M&A transactions",
            "Led quarterly forecasting process with 98% accuracy",
            "Identified $15M in cost savings through variance analysis"
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
        { category: "Finance", items: ["Financial Modeling", "Valuation", "FP&A", "M&A"] },
        { category: "Tools", items: ["Excel", "Bloomberg", "Capital IQ", "Tableau"] },
        { category: "Technical", items: ["SQL", "Python", "Power BI", "SAP"] }
      ]
    }
  },

  // HEALTHCARE
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
        title: "Director of Healthcare Operations",
        email: "amanda.foster@email.com",
        phone: "+1 (713) 555-0189",
        location: "Houston, TX",
        linkedin: "linkedin.com/in/amandafoster",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Healthcare executive with 10+ years leading hospital operations and quality improvement initiatives. Reduced costs by $8M while improving patient satisfaction scores.",
      experience: [
        {
          id: "exp1",
          company: "Houston Methodist Hospital",
          position: "Director of Operations",
          location: "Houston, TX",
          startDate: "Jan 2019",
          endDate: "Present",
          current: true,
          bullets: [
            "Oversee operations for 800-bed facility with $500M budget",
            "Improved patient satisfaction scores from 78% to 94%",
            "Led COVID-19 response serving 50K+ patients"
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
        { category: "Healthcare", items: ["Operations Management", "Quality Improvement", "Patient Safety", "Compliance"] },
        { category: "Leadership", items: ["Strategic Planning", "Budget Management", "Team Leadership"] },
        { category: "Technical", items: ["Epic EHR", "Lean Six Sigma", "Healthcare Analytics"] }
      ]
    }
  },

  // EXECUTIVE
  {
    id: "cto",
    name: "Chief Technology Officer",
    role: "C-Level",
    industry: "Executive",
    category: "executive",
    badge: "Executive",
    accentColor: "hsl(0, 0%, 25%)",
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
      summary: "Technology executive with 15+ years scaling engineering organizations from startup to IPO. Led technical transformation generating $500M+ in enterprise value.",
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
            "Scaled engineering from 50 to 300+ engineers globally",
            "Led technical strategy for $2.1B IPO in 2023",
            "Reduced infrastructure costs by $15M annually"
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
        { category: "Leadership", items: ["Engineering Strategy", "M&A", "Board Relations", "P&L"] },
        { category: "Technical", items: ["Cloud Architecture", "AI/ML Strategy", "Security", "DevOps"] }
      ]
    }
  },
  {
    id: "engineering-manager",
    name: "Engineering Manager",
    role: "Senior",
    industry: "Technology",
    category: "executive",
    badge: "Executive",
    accentColor: "hsl(220, 40%, 35%)",
    data: {
      personalInfo: {
        name: "David Kim",
        title: "Senior Engineering Manager",
        email: "david.kim@email.com",
        phone: "+1 (425) 555-0134",
        location: "Seattle, WA",
        linkedin: "linkedin.com/in/davidkim",
        photo: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Engineering leader with 10+ years building and scaling high-performing teams. Led organizations of 50+ engineers delivering products used by millions.",
      experience: [
        {
          id: "exp1",
          company: "Microsoft",
          position: "Senior Engineering Manager",
          location: "Seattle, WA",
          startDate: "Feb 2020",
          endDate: "Present",
          current: true,
          bullets: [
            "Lead 45+ engineers across 4 teams building Azure services",
            "Improved team velocity by 60% through process improvements",
            "Launched 3 products generating $100M+ ARR"
          ]
        }
      ],
      education: [{
        id: "edu1",
        school: "Carnegie Mellon University",
        degree: "Master of Science",
        field: "Software Engineering",
        location: "Pittsburgh, PA",
        startDate: "2010",
        endDate: "2012"
      }],
      skills: [
        { category: "Leadership", items: ["Team Building", "Hiring", "Performance Management", "Strategy"] },
        { category: "Technical", items: ["System Design", "Architecture Review", "Technical Roadmapping"] },
        { category: "Process", items: ["Agile", "Scrum", "OKRs", "Continuous Improvement"] }
      ]
    }
  },
  {
    id: "director-product",
    name: "Director of Product",
    role: "Director",
    industry: "Product",
    category: "executive",
    badge: "Executive",
    accentColor: "hsl(243, 75%, 45%)",
    data: {
      personalInfo: {
        name: "Jennifer Park",
        title: "Director of Product Management",
        email: "jennifer.park@email.com",
        phone: "+1 (408) 555-0178",
        location: "San Jose, CA",
        linkedin: "linkedin.com/in/jenniferpark",
        photo: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&h=150&fit=crop&crop=face"
      },
      summary: "Product executive with 12+ years leading product organizations. Built product teams from 0 to 25+ PMs and launched products generating $200M+ ARR.",
      experience: [
        {
          id: "exp1",
          company: "Atlassian",
          position: "Director of Product Management",
          location: "San Jose, CA",
          startDate: "Apr 2020",
          endDate: "Present",
          current: true,
          bullets: [
            "Lead product strategy for Jira Software with 10M+ users",
            "Grew product organization from 8 to 25 PMs",
            "Drove 40% increase in enterprise revenue through new features"
          ]
        }
      ],
      education: [{
        id: "edu1",
        school: "Stanford Graduate School of Business",
        degree: "MBA",
        field: "Technology Management",
        location: "Stanford, CA",
        startDate: "2012",
        endDate: "2014"
      }],
      skills: [
        { category: "Product", items: ["Product Strategy", "Roadmap Planning", "Go-to-Market", "Pricing"] },
        { category: "Leadership", items: ["Org Building", "Executive Communication", "Cross-functional Leadership"] },
        { category: "Analysis", items: ["Market Research", "Competitive Analysis", "Business Cases"] }
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
