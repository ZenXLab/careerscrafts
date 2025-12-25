import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, CircleDot, Briefcase, Palette, GraduationCap, TrendingUp, Users } from "lucide-react";

interface Audience {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  resumePreview: {
    name: string;
    title: string;
    company: string;
    summary: string;
    skills: string[];
    accentColor: string;
  };
}

const audiences: Audience[] = [
  {
    id: "senior",
    label: "Senior professionals & executives",
    description: "Two-page CVs with executive summaries, leadership highlights, and strategic impact metrics.",
    icon: <Briefcase className="w-5 h-5" />,
    features: ["Executive CV layouts", "Board-ready formatting", "Achievement-focused"],
    resumePreview: {
      name: "Robert Williams",
      title: "Chief Technology Officer",
      company: "DataCloud Systems",
      summary: "Technology leader with 15+ years scaling engineering organizations and delivering enterprise platforms.",
      skills: ["Engineering Strategy", "M&A", "Board Relations", "P&L Management"],
      accentColor: "hsl(220, 40%, 35%)"
    }
  },
  {
    id: "firsttime",
    label: "First-time job seekers",
    description: "Clean, simple templates that highlight education, projects, and transferable skills.",
    icon: <GraduationCap className="w-5 h-5" />,
    features: ["Fresher-friendly layouts", "Project highlights", "Education-first"],
    resumePreview: {
      name: "Arjun Mehta",
      title: "Software Engineering Graduate",
      company: "IIT Delhi",
      summary: "Computer Science graduate with strong foundation in algorithms and full-stack development.",
      skills: ["Python", "React", "Data Structures", "Machine Learning"],
      accentColor: "hsl(200, 70%, 50%)"
    }
  },
  {
    id: "professionals",
    label: "Professionals seeking structure & ATS-friendly resumes",
    description: "Industry-tested templates optimized for ATS parsing with clean, scannable layouts.",
    icon: <TrendingUp className="w-5 h-5" />,
    features: ["ATS-optimized", "Industry-specific", "Keyword-rich"],
    resumePreview: {
      name: "Priya Sharma",
      title: "Senior Software Engineer",
      company: "Infosys Technologies",
      summary: "Backend-focused engineer with 5+ years building scalable APIs and distributed systems.",
      skills: ["Node.js", "Java", "PostgreSQL", "AWS", "Docker"],
      accentColor: "hsl(243, 75%, 59%)"
    }
  },
  {
    id: "creative",
    label: "Creative professionals",
    description: "Templates that let you control fonts, colors, and layout while keeping them sleek and professional.",
    icon: <Palette className="w-5 h-5" />,
    features: ["Custom styling", "Portfolio sections", "Personal branding"],
    resumePreview: {
      name: "Sophia Martinez",
      title: "Senior UX Design Lead",
      company: "Airbnb",
      summary: "Product Designer focused on usability, accessibility, and conversion-driven design for SaaS platforms.",
      skills: ["Figma", "UX Research", "Design Systems", "Prototyping"],
      accentColor: "hsl(330, 65%, 50%)"
    }
  }
];

const AudienceSection = () => {
  const [activeAudience, setActiveAudience] = useState<string>("professionals");
  const currentAudience = audiences.find(a => a.id === activeAudience) || audiences[2];

  return (
    <section className="section-spacing relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.3 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald/5 rounded-full blur-[120px]"
        />
        
        {/* Decorative Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="currentColor" className="text-foreground" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Audience List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Section Header */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-8">
              Built for{" "}
              <span className="font-serif italic">every</span> career stage
            </h2>

            {/* Audience Items */}
            <div className="space-y-2">
              {audiences.map((audience, index) => (
                <motion.button
                  key={audience.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setActiveAudience(audience.id)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-300 ${
                    activeAudience === audience.id
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-secondary/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                    activeAudience === audience.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {activeAudience === audience.id ? (
                      <CircleDot className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium transition-colors duration-300 ${
                      activeAudience === audience.id ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {audience.label}
                    </h3>
                    <AnimatePresence mode="wait">
                      {activeAudience === audience.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-muted-foreground mt-2 mb-3">
                            {audience.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {audience.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right: Animated Resume Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative Background Cards */}
            <div className="absolute top-4 -left-4 w-full h-full">
              <div className="aspect-[210/297] max-w-[320px] mx-auto bg-white/5 rounded-lg transform -rotate-6" />
            </div>
            <div className="absolute top-2 -left-2 w-full h-full">
              <div className="aspect-[210/297] max-w-[320px] mx-auto bg-white/10 rounded-lg transform -rotate-3" />
            </div>

            {/* Main Resume Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentAudience.id}
                initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative max-w-[320px] mx-auto"
                style={{ perspective: "1000px" }}
              >
                <div className="aspect-[210/297] bg-white rounded-lg shadow-paper overflow-hidden">
                  <div className="p-5 h-full text-gray-900 text-[10px] leading-relaxed">
                    {/* Header */}
                    <div 
                      className="pb-3 mb-3 border-b-2"
                      style={{ borderColor: currentAudience.resumePreview.accentColor }}
                    >
                      <h3 className="text-lg font-bold text-gray-900">
                        {currentAudience.resumePreview.name}
                      </h3>
                      <p 
                        className="font-semibold text-sm"
                        style={{ color: currentAudience.resumePreview.accentColor }}
                      >
                        {currentAudience.resumePreview.title}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {currentAudience.resumePreview.company}
                      </p>
                    </div>

                    {/* Summary */}
                    <div className="mb-3">
                      <h4 
                        className="text-xs font-bold uppercase tracking-wider mb-1"
                        style={{ color: currentAudience.resumePreview.accentColor }}
                      >
                        Summary
                      </h4>
                      <p className="text-gray-600">
                        {currentAudience.resumePreview.summary}
                      </p>
                    </div>

                    {/* Experience Placeholder */}
                    <div className="mb-3">
                      <h4 
                        className="text-xs font-bold uppercase tracking-wider mb-2"
                        style={{ color: currentAudience.resumePreview.accentColor }}
                      >
                        Experience
                      </h4>
                      <div className="space-y-1">
                        <div className="h-2 bg-gray-100 rounded w-full" />
                        <div className="h-2 bg-gray-100 rounded w-11/12" />
                        <div className="h-2 bg-gray-100 rounded w-4/5" />
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h4 
                        className="text-xs font-bold uppercase tracking-wider mb-2"
                        style={{ color: currentAudience.resumePreview.accentColor }}
                      >
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {currentAudience.resumePreview.skills.map((skill, i) => (
                          <motion.span
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="px-2 py-0.5 rounded text-[9px] font-medium"
                            style={{ 
                              backgroundColor: `${currentAudience.resumePreview.accentColor}15`,
                              color: currentAudience.resumePreview.accentColor
                            }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-md border border-border rounded-full px-4 py-2 shadow-elevated"
                >
                  <div className="flex items-center gap-2">
                    {currentAudience.icon}
                    <span className="text-sm font-medium">{currentAudience.label.split(" ")[0]}</span>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Features for creatives */}
            {activeAudience === "creative" && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute -right-4 top-1/2 -translate-y-1/2 space-y-2"
              >
                {["Marketers", "Designers", "Freelancers", "Creatives"].map((role, i) => (
                  <motion.div
                    key={role}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="w-4 h-4 rounded-full bg-emerald/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald" />
                    </div>
                    {role}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
