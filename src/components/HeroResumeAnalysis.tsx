import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Shield, Sparkles, Check, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

// Abhishek Panda's Resume Data (parsed from uploaded PDF) - Split into 2 pages
const uploadedResumeData = {
  page1: {
    personalInfo: {
      name: "Abhishek Panda",
      title: "Technical Architect / Full Stack Architect",
      email: "hello@abhishekpanda.com",
      phone: "+91-8917549065",
      location: "Bengaluru, India",
      linkedin: "abhishekpandaofficial",
      website: "abhishekpanda.com",
    },
    summary: "Technical Full Stack Architect with 12+ years designing and delivering large-scale enterprise platforms across Banking, Airlines, Fintech, Automotive, and GCC public-sector aligned environments. Specialized in .NET Core, Azure/AWS cloud architecture, microservices, event‑driven systems, and high‑availability distributed platforms supporting millions of transactions.",
    highlights: [
      "Led 10–18 engineer teams",
      "$1.2M+ in cloud cost savings",
      "35% reduction in production downtime",
      "20–40% performance improvement"
    ],
    experience: [
      {
        id: "exp1",
        company: "Solera",
        position: "Technical Architect / Engineering Lead",
        location: "Bangalore, India",
        startDate: "08/2022",
        endDate: "11/2025",
        project: "Automotive / Fleet Management : GFP-Smart Drive",
        bullets: [
          "Architected cloud-native .NET Core microservices on Azure using App Services, Functions, Azure SQL, Service Bus, and API Management",
          "Designed event-driven, high-availability architecture for real-time fleet telemetry and dispatch optimization",
          "Implemented strong API security: OAuth2, JWT validation, rate limiting, IP filtering",
          "Spearheaded CI/CD automation with Azure DevOps, Docker, Kubernetes, Terraform"
        ]
      }
    ],
    skills: [
      { category: "Cloud", items: ["Azure", "AWS", "Kubernetes", "Docker", "Terraform"] },
      { category: "Backend", items: ["C#", ".NET Core", "ASP.NET", "gRPC", "REST APIs"] },
    ]
  },
  page2: {
    experience: [
      {
        id: "exp2",
        company: "Wells Fargo",
        position: "Assistant Vice President / Technical Architect",
        location: "Hyderabad, India",
        startDate: "05/2020",
        endDate: "07/2022",
        project: "Wealth & Investment Management Technology : WIMT",
        bullets: [
          "Architected and managed 14+ mission-critical brokerage platforms in a regulated environment",
          "Designed event-driven microservices using .NET Core, Kafka, and AWS Lambda for analytics and trade workflows",
          "Built enterprise cloud infrastructure using AWS IAM, KMS, VPC, EC2, SQS, RDS, CloudWatch",
          "Improved processing efficiency by 35% through architecture modernization",
          "Delivered $500K+ annual AWS cost savings via resource right-sizing and autoscaling strategies"
        ]
      },
      {
        id: "exp3",
        company: "Emirates Group",
        position: "Senior Software Developer",
        location: "Dubai, UAE",
        startDate: "01/2017",
        endDate: "04/2020",
        project: "Airline Operations: Flight & Crew Management",
        bullets: [
          "Developed real-time flight operations dashboard serving 500+ airline staff",
          "Integrated crew scheduling system with 99.9% uptime",
          "Reduced manual scheduling errors by 45% through automation"
        ]
      }
    ],
    skills: [
      { category: "DevOps", items: ["Azure DevOps", "GitHub Actions", "Jenkins", "ArgoCD"] },
      { category: "Databases", items: ["SQL Server", "PostgreSQL", "MongoDB", "DynamoDB"] }
    ],
    education: [
      {
        school: "Biju Patnaik University of Technology",
        degree: "B.Tech",
        field: "Computer Science",
        gpa: "7.2/10",
        endDate: "2014"
      }
    ],
    certifications: [
      "Azure Solutions Architect (AZ-305) – Pursuing",
      "AWS Solutions Architect – Associate – Pursuing"
    ],
    awards: [
      "Solera Employee Of the Month : May 2024",
      "Wells Fargo Employee of the Year : 2021"
    ]
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
  const [currentPage, setCurrentPage] = useState(0); // 0 = show both pages (book view)
  const finalAtsScore = 89;

  useEffect(() => {
    const phases = [
      { delay: 300, phase: 1 },
      { delay: 1200, phase: 2 },
      { delay: 2500, phase: 3 },
      { delay: 4000, phase: 4 },
    ];

    phases.forEach(({ delay, phase: p }) => {
      setTimeout(() => setPhase(p), delay);
    });

    setTimeout(() => {
      const duration = 700;
      const steps = 30;
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
    }, 1500);
  }, []);

  const data = uploadedResumeData;

  return (
    <div className="relative w-full max-w-[680px] mx-auto">
      {/* Ambient Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 0.5 : 0 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-primary/10 rounded-full blur-[150px] -z-10 scale-125"
      />

      {/* Book Container */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateY: -10 }}
        animate={{ 
          opacity: phase >= 1 ? 1 : 0, 
          y: phase >= 1 ? 0 : 40,
          rotateY: phase >= 1 ? 0 : -10
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative perspective-1000"
        style={{ perspective: "1500px" }}
      >
        {/* Book Wrapper with 3D Effect */}
        <div className="relative flex justify-center items-start gap-1">
          {/* Book Spine Shadow */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-full bg-gradient-to-r from-black/20 via-black/5 to-black/20 z-10"
            style={{ marginTop: "4px" }}
          />

          {/* Left Page (Page 1) */}
          <motion.div
            initial={{ rotateY: 15, opacity: 0 }}
            animate={{ 
              rotateY: phase >= 1 ? 0 : 15, 
              opacity: phase >= 1 ? 1 : 0 
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative origin-right"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateY(-2deg)",
            }}
          >
            <div 
              className="relative bg-white rounded-l-sm overflow-hidden"
              style={{
                width: `${A4_WIDTH * 0.33}px`,
                height: `${A4_HEIGHT * 0.38}px`,
                boxShadow: `
                  -15px 0 40px -10px rgba(0, 0, 0, 0.25),
                  -5px 0 15px -5px rgba(0, 0, 0, 0.15),
                  inset 1px 0 3px rgba(0, 0, 0, 0.05)
                `,
              }}
            >
              {/* Page Edge Effect */}
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-gray-100 to-transparent" />
              
              {/* Resume Content Page 1 */}
              <div 
                className="origin-top-left"
                style={{
                  width: `${A4_WIDTH}px`,
                  height: `${A4_HEIGHT}px`,
                  transform: `scale(0.33)`,
                }}
              >
                <ResumePageOne data={data.page1} phase={phase} />
              </div>
            </div>
            
            {/* Page Number */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] text-gray-400 font-medium">
              1
            </div>
          </motion.div>

          {/* Right Page (Page 2) */}
          <motion.div
            initial={{ rotateY: -15, opacity: 0 }}
            animate={{ 
              rotateY: phase >= 1 ? 0 : -15, 
              opacity: phase >= 1 ? 1 : 0 
            }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative origin-left"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateY(2deg)",
            }}
          >
            <div 
              className="relative bg-white rounded-r-sm overflow-hidden"
              style={{
                width: `${A4_WIDTH * 0.33}px`,
                height: `${A4_HEIGHT * 0.38}px`,
                boxShadow: `
                  15px 0 40px -10px rgba(0, 0, 0, 0.25),
                  5px 0 15px -5px rgba(0, 0, 0, 0.15),
                  inset -1px 0 3px rgba(0, 0, 0, 0.05)
                `,
              }}
            >
              {/* Page Edge Effect */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-gray-100 to-transparent" />
              
              {/* Resume Content Page 2 */}
              <div 
                className="origin-top-left"
                style={{
                  width: `${A4_WIDTH}px`,
                  height: `${A4_HEIGHT}px`,
                  transform: `scale(0.33)`,
                }}
              >
                <ResumePageTwo data={data.page2} phase={phase} />
              </div>
            </div>
            
            {/* Page Number */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] text-gray-400 font-medium">
              2
            </div>
          </motion.div>
        </div>

        {/* Book Base Shadow */}
        <div 
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-black/10 blur-xl rounded-full"
        />

        {/* ATS Score Panel - Top Right */}
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.9 }}
          animate={{ 
            opacity: phase >= 2 ? 1 : 0,
            x: phase >= 2 ? 0 : 30,
            scale: phase >= 2 ? 1 : 0.9
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute -right-6 md:-right-24 top-4"
        >
          <div className="bg-card/95 backdrop-blur-xl border border-border rounded-xl p-4 shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] text-muted-foreground font-semibold tracking-widest uppercase">
                ATS Compatibility
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <motion.span
                key={atsScore}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-bold text-foreground tabular-nums"
              >
                {atsScore}
              </motion.span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            <div className="h-2 bg-muted rounded-full mt-3 overflow-hidden w-28">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${atsScore}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Excellent recruiter compatibility
            </p>
          </div>
        </motion.div>

        {/* AI Insights - Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ 
            opacity: phase >= 3 ? 1 : 0,
            x: phase >= 3 ? 0 : -30
          }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute -left-6 md:-left-28 top-8"
        >
          <div className="bg-card/95 backdrop-blur-xl border border-primary/30 rounded-xl p-3 shadow-xl max-w-[160px]">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] text-primary font-semibold tracking-widest uppercase">
                AI Insight
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              <span className="text-emerald-500 font-medium">Quantified impact</span>
              <br />
              <span className="text-foreground/70">Recruiter priority signal</span>
            </p>
          </div>
        </motion.div>

        {/* Keywords Badge - Bottom Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: phase >= 3 ? 1 : 0,
            y: phase >= 3 ? 0 : 20
          }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute -left-6 md:-left-20 bottom-20"
        >
          <div className="bg-card/90 backdrop-blur-md border border-emerald-500/30 rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-[9px] text-emerald-500 font-semibold tracking-widest uppercase">
                Keywords
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              <span className="text-foreground font-semibold">32</span> matches
            </p>
          </div>
        </motion.div>

        {/* Auto-Fix Preview - Bottom Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: phase >= 4 ? 1 : 0,
            scale: phase >= 4 ? 1 : 0.95
          }}
          transition={{ duration: 0.4 }}
          className="absolute -right-6 md:-right-24 bottom-16"
        >
          <div className="bg-card/90 backdrop-blur-md border border-amber-500/30 rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="text-[9px] text-amber-500 font-semibold tracking-widest uppercase">
                Auto-fix Available
              </span>
            </div>
            <div className="text-[10px] space-y-0.5">
              <p className="text-muted-foreground">Add certification dates</p>
              <p className="text-emerald-500 text-[9px] font-medium">+3 ATS points</p>
            </div>
          </div>
        </motion.div>

        {/* Resume Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: phase >= 4 ? 1 : 0,
            y: phase >= 4 ? 0 : 20
          }}
          transition={{ duration: 0.5 }}
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[300px]"
        >
          <div className="bg-card/90 backdrop-blur-md border border-border rounded-xl p-3 shadow-lg">
            <div className="flex items-center justify-between">
              {["Parsed", "Analyzed", "ATS-Ready"].map((step, i) => (
                <div key={step} className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15 * i + 0.2 }}
                    className={`w-3 h-3 rounded-full mb-1 flex items-center justify-center ${
                      i === 2 
                        ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" 
                        : "bg-emerald-500/60"
                    }`}
                  >
                    {i === 2 && <Check className="w-2 h-2 text-white" />}
                  </motion.div>
                  <span className="text-[9px] text-muted-foreground font-medium">{step}</span>
                </div>
              ))}
            </div>
            <div className="flex mt-2 gap-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex-1 h-0.5 bg-emerald-500/50 rounded" 
              />
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex-1 h-0.5 bg-emerald-500/50 rounded" 
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Page 1 Content
const ResumePageOne = ({ data, phase }: { data: typeof uploadedResumeData.page1; phase: number }) => {
  const accentColor = "#3b82f6";

  return (
    <div className="w-full h-full p-10 text-gray-900 text-[10pt] leading-[1.4] bg-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pb-4 border-b-2 mb-5"
        style={{ borderColor: accentColor }}
      >
        <h1 className="text-[24pt] font-bold text-gray-900 mb-1 tracking-tight">
          {data.personalInfo.name.toUpperCase()}
        </h1>
        <p className="text-[12pt] font-semibold mb-3" style={{ color: accentColor }}>
          {data.personalInfo.title}
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-[9pt] text-gray-600">
          <span>✉ {data.personalInfo.email}</span>
          <span>•</span>
          <span>☎ {data.personalInfo.phone}</span>
          <span>•</span>
          <span>📍 {data.personalInfo.location}</span>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4"
      >
        <h2 
          className="text-[10pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          Professional Summary
        </h2>
        <p className="text-[9pt] text-gray-700 leading-relaxed">
          {data.summary}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {data.highlights.map((h, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, scale: phase >= 2 ? 1 : 0.9 }}
              transition={{ delay: 0.1 * i }}
              className="px-1.5 py-0.5 text-[8pt] rounded font-medium"
              style={{ 
                backgroundColor: `${accentColor}15`,
                color: accentColor
              }}
            >
              ✓ {h}
            </motion.span>
          ))}
        </div>
      </motion.section>

      {/* Skills */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-4"
      >
        <h2 
          className="text-[10pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          Technical Skills
        </h2>
        <div className="space-y-1.5">
          {data.skills.map((cat, i) => (
            <div key={i} className="flex flex-wrap gap-1 items-center">
              <span className="text-[9pt] font-semibold text-gray-700 w-16">{cat.category}:</span>
              {cat.items.map((skill, j) => (
                <span 
                  key={j}
                  className="px-1.5 py-0.5 text-[8pt] rounded text-gray-700"
                  style={{ backgroundColor: `${accentColor}10` }}
                >
                  {skill}
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.section>

      {/* Experience */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-4"
      >
        <h2 
          className="text-[10pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          Professional Experience
        </h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-3">
            <div className="flex justify-between items-baseline">
              <h3 className="text-[10pt] font-bold text-gray-900">{exp.position}</h3>
              <span className="text-[8pt] text-gray-500">{exp.startDate} – {exp.endDate}</span>
            </div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[9pt] font-semibold" style={{ color: accentColor }}>{exp.company}</span>
              <span className="text-[8pt] text-gray-500">{exp.location}</span>
            </div>
            {exp.project && (
              <p className="text-[8pt] text-gray-600 italic mb-1">{exp.project}</p>
            )}
            <ul className="space-y-0.5">
              {exp.bullets.map((bullet, i) => (
                <li key={i} className="text-[8pt] text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.section>
    </div>
  );
};

// Page 2 Content
const ResumePageTwo = ({ data, phase }: { data: typeof uploadedResumeData.page2; phase: number }) => {
  const accentColor = "#3b82f6";

  return (
    <div className="w-full h-full p-10 text-gray-900 text-[10pt] leading-[1.4] bg-white">
      {/* Continued Experience */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <h2 
          className="text-[10pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          Professional Experience (Continued)
        </h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-3">
            <div className="flex justify-between items-baseline">
              <h3 className="text-[10pt] font-bold text-gray-900">{exp.position}</h3>
              <span className="text-[8pt] text-gray-500">{exp.startDate} – {exp.endDate}</span>
            </div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[9pt] font-semibold" style={{ color: accentColor }}>{exp.company}</span>
              <span className="text-[8pt] text-gray-500">{exp.location}</span>
            </div>
            {exp.project && (
              <p className="text-[8pt] text-gray-600 italic mb-1">{exp.project}</p>
            )}
            <ul className="space-y-0.5">
              {exp.bullets.map((bullet, i) => (
                <li key={i} className="text-[8pt] text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.section>

      {/* Skills */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4"
      >
        <h2 
          className="text-[10pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          Additional Skills
        </h2>
        <div className="space-y-1.5">
          {data.skills.map((cat, i) => (
            <div key={i} className="flex flex-wrap gap-1 items-center">
              <span className="text-[9pt] font-semibold text-gray-700 w-16">{cat.category}:</span>
              {cat.items.map((skill, j) => (
                <span 
                  key={j}
                  className="px-1.5 py-0.5 text-[8pt] rounded text-gray-700"
                  style={{ backgroundColor: `${accentColor}10` }}
                >
                  {skill}
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.section>

      {/* Education */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-4"
      >
        <h2 
          className="text-[10pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          Education
        </h2>
        {data.education.map((edu, i) => (
          <div key={i} className="flex justify-between items-baseline">
            <div>
              <h3 className="text-[9pt] font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
              <p className="text-[8pt] text-gray-600">{edu.school}</p>
            </div>
            <span className="text-[8pt] text-gray-500">{edu.endDate} • GPA: {edu.gpa}</span>
          </div>
        ))}
      </motion.section>

      {/* Certifications */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-4"
      >
        <h2 
          className="text-[10pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          Certifications
        </h2>
        <ul className="space-y-0.5">
          {data.certifications.map((cert, i) => (
            <li key={i} className="text-[8pt] text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400">
              {cert}
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Awards */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-4"
      >
        <h2 
          className="text-[10pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
          style={{ color: accentColor, borderColor: accentColor }}
        >
          Awards & Recognition
        </h2>
        <ul className="space-y-0.5">
          {data.awards.map((award, i) => (
            <li key={i} className="text-[8pt] text-gray-700 pl-3 relative before:content-['⭐'] before:absolute before:left-0 before:text-amber-500 before:text-[6pt]">
              {award}
            </li>
          ))}
        </ul>
      </motion.section>
    </div>
  );
};

export default HeroResumeAnalysis;
