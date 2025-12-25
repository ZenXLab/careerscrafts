import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Eye, Star, Shield, Code, Briefcase, TrendingUp, Award, Sparkles, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { industryResumes, IndustryTemplate, categories } from "@/data/industryResumes";
import { ResumeData } from "@/types/resume";
import { Link } from "react-router-dom";

// A4 dimensions at 96 DPI
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

// Density targets (in percentage of page height)
const DENSITY_MIN = 92;
const DENSITY_MAX = 98;
const MAX_WHITESPACE = 6;

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  technology: <Code className="w-4 h-4" />,
  product: <Palette className="w-4 h-4" />,
  business: <Briefcase className="w-4 h-4" />,
  marketing: <TrendingUp className="w-4 h-4" />,
  executive: <Award className="w-4 h-4" />,
  creative: <Sparkles className="w-4 h-4" />,
};

// Density Auto-Balancing Logic
interface DensityMetrics {
  pageHeightUsed: number;
  remainingSpace: number;
  sectionHeights: Record<string, number>;
  status: 'UNDER-FILLED' | 'OVER-FILLED' | 'ACCEPTABLE';
}

const calculateDensity = (data: ResumeData): DensityMetrics => {
  // Estimate content heights based on content length
  const headerHeight = 120;
  const summaryHeight = data.summary ? Math.min(80, 40 + (data.summary.length / 4)) : 0;
  const skillsHeight = data.skills?.length ? 60 + (data.skills.reduce((acc, s) => acc + s.items.length * 8, 0)) : 0;
  const experienceHeight = data.experience?.length ? data.experience.reduce((acc, exp) => {
    return acc + 60 + (exp.bullets.length * 22);
  }, 0) : 0;
  const educationHeight = data.education?.length ? data.education.length * 50 : 0;
  const certificationsHeight = data.certifications?.length ? 40 + (data.certifications.length * 24) : 0;
  
  const totalHeight = headerHeight + summaryHeight + skillsHeight + experienceHeight + educationHeight + certificationsHeight + 80; // 80px for margins/spacing
  const usedPercentage = (totalHeight / A4_HEIGHT) * 100;
  const remainingPercentage = 100 - usedPercentage;
  
  let status: DensityMetrics['status'];
  if (remainingPercentage > MAX_WHITESPACE + 2) {
    status = 'UNDER-FILLED';
  } else if (remainingPercentage < 2) {
    status = 'OVER-FILLED';
  } else {
    status = 'ACCEPTABLE';
  }
  
  return {
    pageHeightUsed: usedPercentage,
    remainingSpace: remainingPercentage,
    sectionHeights: {
      header: headerHeight,
      summary: summaryHeight,
      skills: skillsHeight,
      experience: experienceHeight,
      education: educationHeight,
      certifications: certificationsHeight,
    },
    status,
  };
};

// Auto-balance resume content to fill page
const autoBalanceResume = (data: ResumeData): ResumeData => {
  const metrics = calculateDensity(data);
  const balanced = { ...data };
  
  if (metrics.status === 'UNDER-FILLED') {
    // Experience Enrichment: Add bullet points if under-filled
    if (balanced.experience && balanced.experience.length > 0) {
      balanced.experience = balanced.experience.map((exp, idx) => {
        if (idx === 0 && exp.bullets.length < 5) {
          const additionalBullets = [
            `Drove ${15 + Math.floor(Math.random() * 20)}% improvement in team productivity through process optimization`,
            `Collaborated with cross-functional teams to deliver ${2 + Math.floor(Math.random() * 3)} high-impact initiatives`,
            `Mentored ${3 + Math.floor(Math.random() * 5)} junior team members, accelerating their professional growth`,
          ];
          return {
            ...exp,
            bullets: [...exp.bullets, ...additionalBullets.slice(0, Math.min(2, 6 - exp.bullets.length))]
          };
        }
        return exp;
      });
    }
    
    // Skills Expansion: Add more skills if still under-filled
    if (balanced.skills && balanced.skills.length > 0 && metrics.remainingSpace > 10) {
      const additionalSkills = ['Problem Solving', 'Strategic Thinking', 'Cross-functional Collaboration'];
      balanced.skills = balanced.skills.map((cat, idx) => {
        if (idx === 0 && cat.items.length < 8) {
          return { ...cat, items: [...cat.items, ...additionalSkills.slice(0, 2)] };
        }
        return cat;
      });
    }
  }
  
  return balanced;
};

const CinematicResumePreview = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Filter templates by category if selected, otherwise show all
  const templates = useMemo(() => {
    const allTemplates = industryResumes;
    if (activeCategory) {
      return allTemplates.filter(t => t.category === activeCategory);
    }
    return allTemplates.slice(0, 10); // Show max 10 templates
  }, [activeCategory]);
  
  // Reset index when category changes
  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategory]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? templates.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === templates.length - 1 ? 0 : prev + 1));
  };

  const activeTemplate = templates[activeIndex];
  
  // Auto-balance the resume data for proper density
  const balancedData = useMemo(() => {
    if (!activeTemplate) return null;
    return autoBalanceResume(activeTemplate.data);
  }, [activeTemplate]);

  if (!activeTemplate || !balancedData) return null;

  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/10 to-background overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Industry-Specific Templates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Professionally crafted, recruiter-ready resumes. Full pages, real content, auto-balanced density.
          </p>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              All Templates
            </button>
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {categoryIcons[cat.id]}
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-20 w-12 h-12 rounded-full bg-card/95 backdrop-blur-sm border border-border shadow-xl flex items-center justify-center hover:bg-card hover:scale-105 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-20 w-12 h-12 rounded-full bg-card/95 backdrop-blur-sm border border-border shadow-xl flex items-center justify-center hover:bg-card hover:scale-105 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Carousel Container */}
          <div 
            className="flex justify-center items-center gap-4 md:gap-8"
            style={{ perspective: "1500px" }}
          >
            {/* Left Preview */}
            <motion.div
              key={`left-${(activeIndex - 1 + templates.length) % templates.length}`}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 0.3, x: 0, rotateY: 20 }}
              transition={{ duration: 0.5 }}
              className="hidden lg:block relative"
              style={{ transform: "scale(0.65)" }}
            >
              <ResumeCard 
                template={templates[(activeIndex - 1 + templates.length) % templates.length]} 
                data={autoBalanceResume(templates[(activeIndex - 1 + templates.length) % templates.length].data)}
                isActive={false}
              />
            </motion.div>

            {/* Active Resume - Center */}
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <ResumeCard 
                template={activeTemplate} 
                data={balancedData}
                isActive={true} 
              />
              
              {/* Template Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full max-w-sm"
              >
                <div className="bg-card/95 backdrop-blur-xl border border-border rounded-xl p-4 shadow-2xl text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span 
                      className="px-2 py-0.5 text-[10px] font-semibold rounded-full"
                      style={{ 
                        backgroundColor: activeTemplate.accentColor + "20",
                        color: activeTemplate.accentColor 
                      }}
                    >
                      {activeTemplate.badge}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {activeTemplate.industry}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {balancedData.personalInfo.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {balancedData.personalInfo.title}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Link to={`/editor?template=${activeTemplate.id}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                    </Link>
                    <Link to={`/editor?template=${activeTemplate.id}`}>
                      <Button 
                        size="sm" 
                        className="text-xs text-white"
                        style={{ backgroundColor: activeTemplate.accentColor }}
                      >
                        Use Template
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Preview */}
            <motion.div
              key={`right-${(activeIndex + 1) % templates.length}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 0.3, x: 0, rotateY: -20 }}
              transition={{ duration: 0.5 }}
              className="hidden lg:block relative"
              style={{ transform: "scale(0.65)" }}
            >
              <ResumeCard 
                template={templates[(activeIndex + 1) % templates.length]} 
                data={autoBalanceResume(templates[(activeIndex + 1) % templates.length].data)}
                isActive={false}
              />
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-32">
            {templates.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === activeIndex 
                    ? "bg-primary w-8" 
                    : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <Link to="/templates">
            <Button variant="outline" size="lg" className="gap-2">
              <Sparkles className="w-4 h-4" />
              View All Templates
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// Full A4 Resume Card with Auto-Balanced Content
const ResumeCard = ({ 
  template, 
  data,
  isActive 
}: { 
  template: IndustryTemplate; 
  data: ResumeData;
  isActive: boolean;
}) => {
  const accentColor = template.accentColor;
  const scale = isActive ? 0.42 : 0.38;

  return (
    <div 
      className={`relative bg-white rounded-sm overflow-hidden transition-all duration-300 ${
        isActive ? "shadow-2xl" : "shadow-lg"
      }`}
      style={{
        width: `${A4_WIDTH * scale}px`,
        height: `${A4_HEIGHT * scale}px`,
        boxShadow: isActive 
          ? `0 40px 80px -20px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.05)`
          : `0 20px 40px -15px rgba(0,0,0,0.25)`,
      }}
    >
      {/* Flagship Badge */}
      {template.isFlagship && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded text-[8px] font-semibold shadow-lg">
          <Star className="w-2.5 h-2.5 fill-current" />
          Flagship
        </div>
      )}

      {/* Resume Content - Fixed A4 */}
      <div 
        className="origin-top-left"
        style={{
          width: `${A4_WIDTH}px`,
          height: `${A4_HEIGHT}px`,
          transform: `scale(${scale})`,
        }}
      >
        <FullPageResume data={data} accentColor={accentColor} />
      </div>
    </div>
  );
};

// Full Page Resume Renderer with Proper Density
const FullPageResume = ({ data, accentColor }: { data: ResumeData; accentColor: string }) => {
  return (
    <div className="w-full h-full p-12 text-gray-900 text-[10pt] leading-[1.45] bg-white flex flex-col">
      {/* Header */}
      <header 
        className="text-center pb-5 border-b-2 mb-5 flex-shrink-0"
        style={{ borderColor: accentColor }}
      >
        <h1 className="text-[26pt] font-bold text-gray-900 mb-1 tracking-tight">
          {data.personalInfo.name.toUpperCase()}
        </h1>
        <p className="text-[13pt] font-semibold mb-3" style={{ color: accentColor }}>
          {data.personalInfo.title}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-[9pt] text-gray-600">
          <span>✉ {data.personalInfo.email}</span>
          <span>•</span>
          <span>📱 {data.personalInfo.phone}</span>
          <span>•</span>
          <span>📍 {data.personalInfo.location}</span>
          {data.personalInfo.linkedin && (
            <>
              <span>•</span>
              <span>🔗 {data.personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </header>

      {/* Main Content - Fills remaining space */}
      <div className="flex-1 flex flex-col">
        {/* Summary */}
        {data.summary && (
          <section className="mb-5">
            <h2 
              className="text-[10pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
              style={{ color: accentColor, borderColor: accentColor }}
            >
              Professional Summary
            </h2>
            <p className="text-[9pt] text-gray-700 leading-relaxed">
              {data.summary}
            </p>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-5">
            <h2 
              className="text-[10pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
              style={{ color: accentColor, borderColor: accentColor }}
            >
              Core Skills & Technologies
            </h2>
            <div className="space-y-2">
              {data.skills.map((cat, i) => (
                <div key={i} className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[9pt] font-semibold text-gray-700 min-w-[80px]">{cat.category}:</span>
                  <div className="flex flex-wrap gap-1">
                    {cat.items.map((skill, j) => (
                      <span 
                        key={j}
                        className="px-2 py-0.5 text-[8pt] rounded text-gray-700"
                        style={{ backgroundColor: `${accentColor}15` }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-5 flex-1">
            <h2 
              className="text-[10pt] font-bold uppercase tracking-widest mb-3 pb-1 border-b"
              style={{ color: accentColor, borderColor: accentColor }}
            >
              Professional Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-[10pt] font-bold text-gray-900">{exp.position}</h3>
                    <span className="text-[8pt] text-gray-500">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[9pt] font-semibold" style={{ color: accentColor }}>
                      {exp.company}
                    </span>
                    <span className="text-[8pt] text-gray-500">{exp.location}</span>
                  </div>
                  <ul className="space-y-1 mt-1">
                    {exp.bullets.map((bullet, i) => (
                      <li 
                        key={i} 
                        className="text-[8.5pt] text-gray-700 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="mb-4">
            <h2 
              className="text-[10pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
              style={{ color: accentColor, borderColor: accentColor }}
            >
              Education
            </h2>
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-[9pt] font-bold text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-[8pt] text-gray-600">{edu.school}</p>
                  </div>
                  <span className="text-[8pt] text-gray-500">
                    {edu.endDate} {edu.gpa && `• GPA: ${edu.gpa}`}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section>
            <h2 
              className="text-[10pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
              style={{ color: accentColor, borderColor: accentColor }}
            >
              Certifications
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.certifications.map((cert) => (
                <span 
                  key={cert.id}
                  className="flex items-center gap-1 px-2 py-0.5 text-[8pt] rounded border"
                  style={{ borderColor: `${accentColor}40`, color: accentColor }}
                >
                  <Shield className="w-2.5 h-2.5" />
                  {cert.name} {cert.date && `(${cert.date})`}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer spacer for visual balance */}
      <div className="h-4 flex-shrink-0" />
    </div>
  );
};

export default CinematicResumePreview;
