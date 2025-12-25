import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Shield, Sparkles, Check, TrendingUp, ChevronLeft, ChevronRight, Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

// Abhishek Panda's Resume Data (parsed from uploaded PDF) - Complete 2 pages
const uploadedResumeData = {
  page1: {
    personalInfo: {
      name: "Abhishek Panda",
      title: "Technical Architect / Full Stack Architect",
      tagline: ["Azure & AWS Cloud", "Microservices", "DevSecOps", "ML.NET"],
      email: "hello@abhishekpanda.com",
      phone: "+91-8917549065",
      location: "Bengaluru, India",
      linkedin: "abhishekpandaofficial",
      website: "abhishekpanda.com",
    },
    summary: [
      "Technical Full Stack Architect with 12+ years designing and delivering large-scale enterprise platforms across Banking, Airlines, Fintech, Automotive, and GCC public-sector aligned environments. Specialized in .NET Core, Azure/AWS cloud architecture, microservices, event‑driven systems, and high‑availability distributed platforms supporting millions of transactions.",
      "Proven track record leading 10–18 engineer teams, executing end‑to‑end cloud transformations, strengthening zero‑trust security baselines, and driving $1.2M+ in cloud cost savings through optimization, right‑sizing, and modernization.",
      "Known for architecting resilient, fault‑tolerant systems that reduce production downtime by up to 35%, improve performance by 20–40%, and elevate reliability through observability, automation, and DevSecOps engineering.",
      "Experienced in regulated environments (Banking, Aviation, Compliance-heavy GCC projects) with strong governance discipline—PCI, SOX, audit readiness, secure SDLC, and high-stakes release cycles."
    ],
    skills: [
      { category: "Enterprise Architecture", items: ["Microservices", "Distributed Systems", "High Availability", "System Modernization", "Legacy Migration", "API Architecture", "Event-Driven Architectures", "Domain-Driven Design (DDD)"] },
      { category: "Backend & Platforms (.NET CORE)", items: ["C#", "ASP.NET Core", "Web API", "EF Core", "LINQ", "REST Services", "gRPC", "Middleware Design", "Event Processing"] },
      { category: "Front End : UI/UX", items: ["Angular", "TypeScript", "HTML5", "Bootstrap", "Tailwind CSS", "React"] },
      { category: "Azure Cloud", items: ["App Services", "Functions", "AKS", "APIM", "Service Bus", "Event Grid", "Azure SQL", "Blob Storage", "Key Vault", "Entra ID", "RBAC", "Azure Monitor", "App Insights", "VNet", "Load Balancer", "GovCloud"] },
      { category: "AWS Cloud", items: ["EC2", "Lambda", "ECS/EKS", "S3", "RDS", "DynamoDB", "API Gateway", "SQS", "SNS", "IAM", "KMS", "VPC", "CloudWatch", "CloudTrail", "Step Functions", "ECR", "Secrets Manager", "SSM", "AWS GovCloud"] },
      { category: "DevSecOps & Automation", items: ["Git", "Docker", "Kubernetes", "Terraform", "Azure DevOps", "GitHub Actions", "Jenkins", "Helm", "ArgoCD", "CI/CD Pipelines", "Security Hardening", "Trivy", "SonarQube"] },
      { category: "Observability & Monitoring", items: ["Datadog", "Prometheus", "Grafana", "CloudWatch", "Azure Monitor", "Application Insights"] },
      { category: "Security Protocols & IAM", items: ["OAuth2", "OpenID Connect", "JWT", "TLS", "Identity & Access Management", "Policy Enforcement", "Secrets Governance"] },
      { category: "Databases", items: ["SQL Server", "PostgreSQL", "MongoDB", "DynamoDB", "AWS RDS"] },
    ],
    experience: [
      {
        id: "exp1",
        company: "SOLERA",
        position: "Technical Architect / Engineering Lead",
        location: "Bangalore, India",
        startDate: "08/2022",
        endDate: "11/2025",
        project: "Automotive / Fleet Management : GFP-Smart Drive",
        bullets: [
          "Architected cloud-native .NET Core microservices on Azure using App Services, Functions, Azure SQL, Service Bus, and API Management.",
          "Designed event-driven, high-availability architecture for real-time fleet telemetry and dispatch optimization.",
          "Implemented strong API security: OAuth2, JWT validation, rate limiting, IP filtering.",
          "Spearheaded CI/CD automation with Azure DevOps, Docker, Kubernetes, Terraform; delivered zero-downtime deployments.",
          "Defined Angular and TypeScript frontend architecture for real-time dashboards.",
          "Owned observability: Azure Monitor and Application Insights with proactive alerting.",
          "Improved system performance by 20% and delivered significant cloud cost savings via right-sizing and scaling optimizations.",
          "Led and mentored a team of over 18 engineers across backend, frontend, and cloud."
        ]
      },
      {
        id: "exp2",
        company: "WELLS FARGO",
        position: "Assistant Vice President / Technical Architect",
        location: "Hyderabad, India",
        startDate: "05/2020",
        endDate: "07/2022",
        project: "Wealth & Investment Management Technology : WIMT",
        bullets: [
          "Architected and managed 14+ mission-critical brokerage platforms in a regulated environment.",
          "Designed event-driven microservices using .NET Core, Kafka, and AWS Lambda for analytics, trade workflows, and batch automation.",
          "Built enterprise cloud infrastructure using AWS IAM, KMS, VPC, EC2, SQS, RDS, CloudWatch.",
          "Implemented strict security baselines, coding standards, architecture governance, and cross-team engineering practices.",
          "Led 24x7 AMS operations, production reliability, RCA, SLA governance, and incident/problem management.",
          "Improved processing efficiency by 35% through architecture modernization and workload tuning.",
          "Led blue-green and canary deployment strategies with automated rollback for high-risk banking workloads.",
          "Delivered 40% server efficiency improvement and $500K+ annual AWS cost savings via resource right-sizing.",
          "Managed and mentored an engineering team of 10+ developers across backend, cloud, and automation."
        ]
      }
    ],
  },
  page2: {
    experience: [
      {
        id: "exp3",
        company: "VIRTUSA",
        position: "Lead Consultant",
        location: "Doha, Qatar",
        startDate: "08/2018",
        endDate: "05/2020",
        project: "Qatar Airways (Airline PAX Disruption Management System)",
        bullets: [
          "Architected Azure-based .NET Core microservices replacing legacy monolithic services.",
          "Designed secure, production-grade APIs using Azure API Management with OAuth2, JWT validation.",
          "Built serverless event-processing pipelines using Azure Functions + Service Bus.",
          "Migrated several legacy .NET Framework modules to modern .NET Core."
        ]
      },
      {
        id: "exp4",
        company: "VIRTUSA",
        position: "Associate Consultant",
        location: "Bangalore, India",
        startDate: "08/2018",
        endDate: "05/2020",
        project: "CITIBANK : Financial & Business Reporting Platform",
        bullets: [
          "Engineered microservices using .NET Core, Angular, XUnit aligned with compliance.",
          "Architected a unified analytics platform consolidating multi-source financial data.",
          "Optimized AWS workloads using Lambda, SQS, EKS, RDS, API Gateway.",
          "Improved reporting accuracy by 30% with clean data modeling.",
          "Cut infrastructure costs by 20% via microservices re-architecture."
        ]
      },
      {
        id: "exp5",
        company: "CONDUENT",
        position: "Software Engineer",
        location: "Bangalore, India",
        startDate: "09/2014",
        endDate: "07/2018",
        project: "METLIFE (Healthcare/Insurance Systems)",
        bullets: [
          "Built scalable REST APIs supporting policy, claims, billing, and underwriting.",
          "Delivered responsive React UIs for internal operations.",
          "Implemented diagnostics, structured logging, and exception frameworks, reducing downtime by 35%."
        ]
      },
      {
        id: "exp6",
        company: "CONDUENT",
        position: "Associate Software Engineer",
        location: "Bangalore, India",
        startDate: "09/2014",
        endDate: "07/2018",
        project: "Bank of America (BOFA) – Financial Workflow Automation",
        bullets: [
          "Developed enterprise modules in .NET for credit operations and financial workflows.",
          "Automated document processing and approvals, reducing manual effort by 40%.",
          "Optimized SQL workloads, improving transaction performance by 30%."
        ]
      }
    ],
    education: [
      { school: "Biju Patnaik University of Technology", degree: "B.Tech", field: "Computer Science", gpa: "7.2/10", period: "2010 - 2014" },
      { school: "Council of Higher Secondary Education", degree: "12th", field: "", gpa: "8.1/10", period: "2007 - 2009" },
      { school: "ORISSA HSE, Odisha", degree: "10th", field: "", gpa: "9.3/10", period: "2004 - 2007" }
    ],
    awards: [
      "Solera Employee Of the Month : May 2024",
      "Wells Fargo Employee of the Year : 2021"
    ],
    certifications: [
      "Azure Solutions Architect (AZ-305) – Pursuing",
      "AWS Solutions Architect – Associate – Pursuing"
    ],
    additionalSkills: [
      { category: "AI/ML in .NET Ecosystem", items: ["ML.NET", "Azure AI Services", "OpenAI API Integration", "NLP", "LLMs & RAG", "Tokenization", "Transformers", "Prompt Engineering", "Semantic Kernel", "LangChain", "LangGraph"] },
      { category: "Agentization", items: ["Multistep Planning", "n8n", "Crew AI", "Autonomous AI Agents", "Claude", "OpenAI", "Mistral", "Azure OpenAI", "Pinecone/FAISS"] }
    ],
    languages: ["English (Native)"],
    links: {
      portfolio: "abhishekpanda.com",
      github: "abhishekpandaOfficial",
      linkedin: "abhishekpandaofficial"
    }
  }
};

// AI Insights
const aiInsights = [
  { id: 1, type: "strength", label: "Quantified Impact", detail: "$1.2M savings, 35% improvement" },
  { id: 2, type: "keyword", label: "32 ATS Keywords", detail: "High-value matches detected" },
  { id: 3, type: "structure", label: "Strong Structure", detail: "Clear hierarchy confirmed" },
];

// A4 dimensions at 96 DPI
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

interface HeroResumeAnalysisProps {
  onEditResume?: () => void;
  onUploadNew?: () => void;
}

const HeroResumeAnalysis = ({ onEditResume, onUploadNew }: HeroResumeAnalysisProps) => {
  const [atsScore, setAtsScore] = useState(0);
  const [phase, setPhase] = useState(0);
  const [bookOpened, setBookOpened] = useState(false);
  const finalAtsScore = 92;

  useEffect(() => {
    // Initial animation phases
    const phases = [
      { delay: 300, phase: 1 },
      { delay: 800, phase: 2 },
      { delay: 1500, phase: 3 },
      { delay: 2500, phase: 4 },
    ];

    phases.forEach(({ delay, phase: p }) => {
      setTimeout(() => setPhase(p), delay);
    });

    // Book opening animation
    setTimeout(() => setBookOpened(true), 600);

    // ATS Score animation
    setTimeout(() => {
      const duration = 800;
      const steps = 35;
      const increment = finalAtsScore / steps;
      let current = 0;
      
      const interval = setInterval(() => {
        current += increment;
        if (current >= finalAtsScore) {
          setAtsScore(finalAtsScore);
          clearInterval(interval);
        } else {
          setAtsScore(Math.floor(current));
        }
      }, duration / steps);
    }, 1800);
  }, []);

  const data = uploadedResumeData;

  return (
    <div className="relative w-full max-w-[800px] mx-auto px-4 sm:px-0">
      {/* Ambient Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 0.6 : 0 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-[100px] sm:blur-[180px] -z-10 scale-125 sm:scale-150"
      />

      {/* Book Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ 
          opacity: phase >= 1 ? 1 : 0, 
          y: phase >= 1 ? 0 : 30,
          scale: phase >= 1 ? 1 : 0.95
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
        style={{ perspective: "2500px" }}
      >
        {/* Book Wrapper with 3D Opening Effect */}
        <div className="relative flex justify-center items-start">
          {/* Book Spine/Binding - Center */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: bookOpened ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-20 hidden sm:block"
            style={{
              width: "10px",
              height: `${A4_HEIGHT * 0.28}px`,
              background: "linear-gradient(90deg, #1a1a1a 0%, #404040 30%, #666 50%, #404040 70%, #1a1a1a 100%)",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
              borderRadius: "2px"
            }}
          />

          {/* Left Page (Page 1) - Opens from center */}
          <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ 
              rotateY: bookOpened ? -3 : 90, 
              opacity: bookOpened ? 1 : 0 
            }}
            transition={{ 
              duration: 1.2, 
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="relative"
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "right center",
            }}
          >
            {/* Page Shadow on fold */}
            <div 
              className="absolute right-0 top-0 bottom-0 w-8 z-10"
              style={{
                background: "linear-gradient(to left, rgba(0,0,0,0.15), transparent)"
              }}
            />
            
            <div 
              className="relative bg-white rounded-l-[4px] overflow-hidden border border-gray-200"
              style={{
                width: `${A4_WIDTH * 0.32}px`,
                height: `${A4_HEIGHT * 0.36}px`,
                boxShadow: `
                  -20px 10px 50px -15px rgba(0, 0, 0, 0.35),
                  -5px 5px 20px -8px rgba(0, 0, 0, 0.2),
                  inset -2px 0 8px rgba(0, 0, 0, 0.08)
                `,
              }}
            >
              {/* Page texture overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-gray-50/50 pointer-events-none z-10" />
              
              {/* Resume Content Page 1 */}
              <div 
                className="origin-top-left"
                style={{
                  width: `${A4_WIDTH}px`,
                  height: `${A4_HEIGHT}px`,
                  transform: `scale(0.32)`,
                }}
              >
                <ResumePageOne data={data.page1} phase={phase} />
              </div>
            </div>
            
            {/* Page Number */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 font-medium"
            >
              Page 1
            </motion.div>
          </motion.div>

          {/* Right Page (Page 2) - Opens from center */}
          <motion.div
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ 
              rotateY: bookOpened ? 3 : -90, 
              opacity: bookOpened ? 1 : 0 
            }}
            transition={{ 
              duration: 1.2, 
              delay: 0.5,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="relative"
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "left center",
            }}
          >
            {/* Page Shadow on fold */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-8 z-10"
              style={{
                background: "linear-gradient(to right, rgba(0,0,0,0.15), transparent)"
              }}
            />
            
            <div 
              className="relative bg-white rounded-r-[4px] overflow-hidden border border-gray-200"
              style={{
                width: `${A4_WIDTH * 0.32}px`,
                height: `${A4_HEIGHT * 0.36}px`,
                boxShadow: `
                  20px 10px 50px -15px rgba(0, 0, 0, 0.35),
                  5px 5px 20px -8px rgba(0, 0, 0, 0.2),
                  inset 2px 0 8px rgba(0, 0, 0, 0.08)
                `,
              }}
            >
              {/* Page texture overlay */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-gray-50/50 pointer-events-none z-10" />
              
              {/* Resume Content Page 2 */}
              <div 
                className="origin-top-left"
                style={{
                  width: `${A4_WIDTH}px`,
                  height: `${A4_HEIGHT}px`,
                  transform: `scale(0.32)`,
                }}
              >
                <ResumePageTwo data={data.page2} phase={phase} />
              </div>
            </div>
            
            {/* Page Number */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 font-medium"
            >
              Page 2
            </motion.div>
          </motion.div>
        </div>

        {/* Book Base Shadow */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.5 }}
          animate={{ opacity: bookOpened ? 0.6 : 0, scaleX: bookOpened ? 1 : 0.5 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-10 bg-black/20 blur-2xl rounded-full"
        />

        {/* ATS Score Panel - Top Right */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.85 }}
          animate={{ 
            opacity: phase >= 2 ? 1 : 0,
            x: phase >= 2 ? 0 : 40,
            scale: phase >= 2 ? 1 : 0.85
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -right-4 md:-right-32 top-4"
        >
          <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">
                ATS Score
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <motion.span
                key={atsScore}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="text-4xl font-bold text-foreground tabular-nums"
              >
                {atsScore}
              </motion.span>
              <span className="text-base text-muted-foreground">/100</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full mt-4 overflow-hidden w-32">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${atsScore}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              />
            </div>
            <p className="text-[11px] text-emerald-500 font-medium mt-2">
              Excellent compatibility
            </p>
          </div>
        </motion.div>

        {/* AI Insights - Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ 
            opacity: phase >= 3 ? 1 : 0,
            x: phase >= 3 ? 0 : -40
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -left-4 md:-left-36 top-6"
        >
          <div className="bg-card/95 backdrop-blur-xl border border-primary/30 rounded-xl p-4 shadow-2xl max-w-[180px]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] text-primary font-bold tracking-widest uppercase">
                AI Insight
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-emerald-500 font-semibold block">Quantified Impact</span>
              <span className="text-foreground/80 text-[11px]">$1.2M+ savings highlighted</span>
            </p>
          </div>
        </motion.div>

        {/* Keywords Badge - Bottom Left */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ 
            opacity: phase >= 3 ? 1 : 0,
            y: phase >= 3 ? 0 : 25
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute -left-4 md:-left-28 bottom-24"
        >
          <div className="bg-card/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] text-emerald-500 font-bold tracking-wider uppercase">
                ATS Keywords
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-foreground font-bold text-lg">32</span> <span className="text-[11px]">matches found</span>
            </p>
          </div>
        </motion.div>

        {/* Auto-Fix Preview - Bottom Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: phase >= 4 ? 1 : 0,
            scale: phase >= 4 ? 1 : 0.9
          }}
          transition={{ duration: 0.5 }}
          className="absolute -right-4 md:-right-32 bottom-20"
        >
          <div className="bg-card/95 backdrop-blur-xl border border-amber-500/30 rounded-xl p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] text-amber-500 font-bold tracking-wider uppercase">
                AI Suggestion
              </span>
            </div>
            <div className="text-xs space-y-1">
              <p className="text-muted-foreground">Add certification dates</p>
              <p className="text-emerald-500 text-[11px] font-semibold">+3 ATS points</p>
            </div>
          </div>
        </motion.div>

        {/* Resume Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ 
            opacity: phase >= 4 ? 1 : 0,
            y: phase >= 4 ? 0 : 25
          }}
          transition={{ duration: 0.6 }}
          className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[340px]"
        >
          <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              {["Parsed", "Analyzed", "ATS-Ready"].map((step, i) => (
                <div key={step} className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 * i + 0.3 }}
                    className={`w-4 h-4 rounded-full mb-2 flex items-center justify-center ${
                      i === 2 
                        ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]" 
                        : "bg-emerald-500/70"
                    }`}
                  >
                    {i === 2 && <Check className="w-2.5 h-2.5 text-white" />}
                  </motion.div>
                  <span className="text-[10px] text-muted-foreground font-semibold">{step}</span>
                </div>
              ))}
            </div>
            <div className="flex mt-3 gap-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex-1 h-1 bg-emerald-500/60 rounded-full" 
              />
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="flex-1 h-1 bg-emerald-500/60 rounded-full" 
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Page 1 Content - Complete resume first page
const ResumePageOne = ({ data, phase }: { data: typeof uploadedResumeData.page1; phase: number }) => {
  const accentColor = "#2563eb";

  return (
    <div className="w-full h-full bg-white text-gray-900" style={{ fontSize: "10pt", lineHeight: 1.35 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="px-10 pt-8 pb-4 border-b-2 mb-4"
        style={{ borderColor: accentColor }}
      >
        <h1 className="text-[28pt] font-bold text-gray-900 tracking-tight mb-1">
          {data.personalInfo.name.toUpperCase()}
        </h1>
        <p className="text-[14pt] font-semibold mb-3" style={{ color: accentColor }}>
          {data.personalInfo.title}
        </p>
        
        {/* Tagline badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {data.personalInfo.tagline.map((tag, i) => (
            <span 
              key={i}
              className="px-2.5 py-1 text-[9pt] font-medium rounded"
              style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 text-[9pt] text-gray-600">
          <span className="flex items-center gap-1">📧 {data.personalInfo.email}</span>
          <span className="flex items-center gap-1">📞 {data.personalInfo.phone}</span>
          <span className="flex items-center gap-1">📍 {data.personalInfo.location}</span>
          <span className="flex items-center gap-1">🔗 {data.personalInfo.linkedin}</span>
          <span className="flex items-center gap-1">🌐 {data.personalInfo.website}</span>
        </div>
      </motion.div>

      <div className="px-10">
        {/* Summary */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-4"
        >
          <h2 
            className="text-[11pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
            style={{ color: accentColor, borderColor: accentColor }}
          >
            Summary
          </h2>
          <div className="text-[9pt] text-gray-700 leading-relaxed space-y-1.5">
            {data.summary.map((p, i) => (
              <p key={i}>• {p}</p>
            ))}
          </div>
        </motion.section>

        {/* Technical Skills */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-4"
        >
          <h2 
            className="text-[11pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
            style={{ color: accentColor, borderColor: accentColor }}
          >
            Technical Skills
          </h2>
          <div className="space-y-1">
            {data.skills.slice(0, 5).map((cat, i) => (
              <div key={i} className="text-[8pt]">
                <span className="font-bold text-gray-800">{cat.category}:</span>{" "}
                <span className="text-gray-600">{cat.items.slice(0, 8).join(" • ")}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Experience */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 
            className="text-[11pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
            style={{ color: accentColor, borderColor: accentColor }}
          >
            Experience
          </h2>
          {data.experience.slice(0, 2).map((exp, idx) => (
            <div key={exp.id} className={idx < data.experience.length - 1 ? "mb-3" : ""}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-[10pt] font-bold text-gray-900">{exp.position}</h3>
                <span className="text-[8pt] text-gray-500 font-medium">{exp.startDate} – {exp.endDate}</span>
              </div>
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="text-[9pt] font-semibold" style={{ color: accentColor }}>{exp.company}</span>
                <span className="text-[8pt] text-gray-500">{exp.location}</span>
              </div>
              {exp.project && (
                <p className="text-[8pt] text-gray-500 italic mb-1">{exp.project}</p>
              )}
              <ul className="space-y-0.5 text-[8pt] text-gray-700">
                {exp.bullets.slice(0, 4).map((bullet, i) => (
                  <li key={i} className="pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.section>
      </div>
    </div>
  );
};

// Page 2 Content - Complete resume second page
const ResumePageTwo = ({ data, phase }: { data: typeof uploadedResumeData.page2; phase: number }) => {
  const accentColor = "#2563eb";

  return (
    <div className="w-full h-full bg-white text-gray-900 px-10 pt-6" style={{ fontSize: "10pt", lineHeight: 1.35 }}>
      {/* Continued Experience */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4"
      >
        <h2 
          className="text-[11pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          Experience (Continued)
        </h2>
        {data.experience.map((exp, idx) => (
          <div key={exp.id} className={idx < data.experience.length - 1 ? "mb-2.5" : "mb-3"}>
            <div className="flex justify-between items-baseline">
              <h3 className="text-[10pt] font-bold text-gray-900">{exp.position}</h3>
              <span className="text-[8pt] text-gray-500 font-medium">{exp.startDate} – {exp.endDate}</span>
            </div>
            <div className="flex justify-between items-baseline mb-0.5">
              <span className="text-[9pt] font-semibold" style={{ color: accentColor }}>{exp.company}</span>
              <span className="text-[8pt] text-gray-500">{exp.location}</span>
            </div>
            {exp.project && (
              <p className="text-[8pt] text-gray-500 italic mb-0.5">{exp.project}</p>
            )}
            <ul className="space-y-0.5 text-[8pt] text-gray-700">
              {exp.bullets.slice(0, 3).map((bullet, i) => (
                <li key={i} className="pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.section>

      {/* Awards */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-3"
      >
        <h2 
          className="text-[11pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          Awards
        </h2>
        <ul className="text-[8pt] text-gray-700 space-y-0.5">
          {data.awards.map((award, i) => (
            <li key={i} className="pl-2 relative before:content-['⭐'] before:absolute before:left-0 before:text-amber-500 before:text-[6pt]">
              {award}
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Education */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mb-3"
      >
        <h2 
          className="text-[11pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          Education
        </h2>
        {data.education.map((edu, i) => (
          <div key={i} className="flex justify-between items-baseline mb-1 text-[8pt]">
            <div>
              <span className="font-bold text-gray-900">{edu.degree} {edu.field && `in ${edu.field}`}</span>
              <span className="text-gray-600"> — {edu.school}</span>
            </div>
            <span className="text-gray-500">{edu.period} • GPA: {edu.gpa}</span>
          </div>
        ))}
      </motion.section>

      {/* Certifications */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-3"
      >
        <h2 
          className="text-[11pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          Certification
        </h2>
        <ul className="text-[8pt] text-gray-700 space-y-0.5">
          {data.certifications.map((cert, i) => (
            <li key={i} className="pl-2 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
              {cert}
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Additional Skills */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="mb-3"
      >
        <h2 
          className="text-[11pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          Additional Skills
        </h2>
        {data.additionalSkills.map((cat, i) => (
          <div key={i} className="text-[8pt] mb-1">
            <span className="font-bold text-gray-800">{cat.category}:</span>{" "}
            <span className="text-gray-600">{cat.items.join(", ")}</span>
          </div>
        ))}
      </motion.section>

      {/* Languages & Links */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h2 
          className="text-[11pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          Find Me Online
        </h2>
        <div className="flex flex-wrap gap-4 text-[8pt] text-gray-600">
          <span>🌐 Portfolio: {data.links.portfolio}</span>
          <span>💻 GitHub: {data.links.github}</span>
          <span>🔗 LinkedIn: {data.links.linkedin}</span>
          <span>🗣️ Languages: {data.languages.join(", ")}</span>
        </div>
      </motion.section>
    </div>
  );
};

export default HeroResumeAnalysis;
