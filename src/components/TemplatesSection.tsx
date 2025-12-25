import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { industryResumes, categories, IndustryTemplate } from "@/data/industryResumes";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Shield, Award, Code, Palette, Briefcase, TrendingUp, DollarSign, Heart, Star, Eye } from "lucide-react";
import { ResumeData } from "@/types/resume";

// A4 dimensions
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

const iconMap: Record<string, React.ReactNode> = {
  Code: <Code className="w-4 h-4" />,
  Palette: <Palette className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  DollarSign: <DollarSign className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Award: <Award className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />
};

const badgeStyles: Record<string, string> = {
  "ATS-Optimized": "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
  "Executive": "bg-amber-500/10 text-amber-500 border-amber-500/30",
  "Fresher-Friendly": "bg-primary/10 text-primary border-primary/30",
  "Creative": "bg-pink-500/10 text-pink-400 border-pink-500/30",
  "Technical": "bg-blue-500/10 text-blue-400 border-blue-500/30"
};

// Auto-balance resume content to fill page
const autoBalanceResume = (data: ResumeData): ResumeData => {
  const balanced = { ...data };
  
  if (balanced.experience && balanced.experience.length > 0) {
    balanced.experience = balanced.experience.map((exp, idx) => {
      if (idx === 0 && exp.bullets.length < 5) {
        const additionalBullets = [
          `Drove ${15 + Math.floor(Math.random() * 20)}% improvement in team productivity through process optimization`,
          `Collaborated with cross-functional teams to deliver ${2 + Math.floor(Math.random() * 3)} high-impact initiatives`,
        ];
        return {
          ...exp,
          bullets: [...exp.bullets, ...additionalBullets.slice(0, Math.min(2, 5 - exp.bullets.length))]
        };
      }
      return exp;
    });
  }
  
  return balanced;
};

const TemplatesSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>("technology");
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const filteredTemplates = industryResumes.filter(t => t.category === activeCategory);

  return (
    <section id="templates" className="py-16 md:py-24 lg:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-4">
            Industry-Specific{" "}
            <span className="font-serif italic">Templates</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Professionally crafted, recruiter-ready resumes. Full pages, real content, auto-balanced density.
          </p>
        </motion.div>

        {/* Category Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap shrink-0 ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {iconMap[cat.icon]}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </motion.nav>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredTemplates.map((template, index) => (
            <FullPageTemplateCard
              key={template.id}
              template={template}
              index={index}
              isHovered={hoveredTemplate === template.id}
              onHover={setHoveredTemplate}
            />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10 md:mt-16"
        >
          <Link to="/templates">
            <Button variant="outline" size="lg" className="group">
              View All Templates
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// Full-page A4 template card
const FullPageTemplateCard = ({ 
  template, 
  index, 
  isHovered, 
  onHover 
}: { 
  template: IndustryTemplate; 
  index: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}) => {
  const data = autoBalanceResume(template.data);
  const accentColor = template.accentColor;
  const scale = 0.28;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => onHover(template.id)}
      onMouseLeave={() => onHover(null)}
      className="group cursor-pointer"
    >
      {/* Template Card */}
      <div className="relative mb-3">
        {/* Flagship Badge */}
        {template.isFlagship && (
          <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded text-[8px] font-semibold shadow-lg">
            <Star className="w-2.5 h-2.5 fill-current" />
            Flagship
          </div>
        )}

        {/* Category Badge */}
        <div className={`absolute top-2 left-2 z-20 px-2 py-1 rounded-full text-[9px] font-semibold border ${badgeStyles[template.badge]}`}>
          <div className="flex items-center gap-1">
            {template.badge === "ATS-Optimized" && <Shield className="w-2.5 h-2.5" />}
            {template.badge === "Executive" && <Award className="w-2.5 h-2.5" />}
            {template.badge === "Technical" && <Code className="w-2.5 h-2.5" />}
            {template.badge === "Creative" && <Sparkles className="w-2.5 h-2.5" />}
            <span className="hidden sm:inline">{template.badge}</span>
          </div>
        </div>

        {/* Full A4 Resume Preview */}
        <motion.div 
          animate={{ 
            y: isHovered ? -6 : 0,
            scale: isHovered ? 1.02 : 1
          }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg overflow-hidden transition-shadow duration-500"
          style={{
            width: "100%",
            aspectRatio: "210 / 297",
            boxShadow: isHovered 
              ? "0 20px 50px -15px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)"
              : "0 8px 30px -10px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.03)",
          }}
        >
          <div 
            className="origin-top-left"
            style={{
              width: `${A4_WIDTH}px`,
              height: `${A4_HEIGHT}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <FullPageResumeContent data={data} accentColor={accentColor} />
          </div>
        </motion.div>

        {/* Hover Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent rounded-lg flex flex-col items-center justify-end p-4"
        >
          <div className="flex gap-2">
            <Link to={`/editor?template=${template.id}`}>
              <Button size="sm" variant="outline" className="text-xs bg-background/80 backdrop-blur-sm">
                <Eye className="w-3 h-3 mr-1" />
                Preview
              </Button>
            </Link>
            <Link to={`/editor?template=${template.id}`}>
              <Button 
                size="sm" 
                className="text-xs text-white"
                style={{ backgroundColor: accentColor }}
              >
                Use Template
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Template Info */}
      <div className="text-center px-2">
        <h3 className="font-medium text-sm sm:text-base mb-0.5 truncate">{template.name}</h3>
        <p className="text-xs text-muted-foreground truncate">{template.role} • {template.industry}</p>
      </div>
    </motion.div>
  );
};

// Full-page resume content renderer
const FullPageResumeContent = ({ data, accentColor }: { data: ResumeData; accentColor: string }) => {
  return (
    <div className="w-full h-full p-12 text-gray-900 text-[10pt] leading-[1.4] bg-white flex flex-col">
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

      {/* Main Content */}
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
                        className="px-2 py-0.5 text-[8pt] rounded"
                        style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
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
              className="text-[10pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
              style={{ color: accentColor, borderColor: accentColor }}
            >
              Professional Experience
            </h2>
            {data.experience.map((exp, idx) => (
              <div key={exp.id} className={idx < data.experience.length - 1 ? "mb-4" : ""}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-[10pt] font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-[8pt] text-gray-500 font-medium">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[9pt] font-semibold" style={{ color: accentColor }}>{exp.company}</span>
                  <span className="text-[8pt] text-gray-500">{exp.location}</span>
                </div>
                <ul className="space-y-1">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i} className="flex text-[8pt] text-gray-700">
                      <span className="mr-2 flex-shrink-0" style={{ color: accentColor }}>▸</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="flex-shrink-0">
            <h2 
              className="text-[10pt] font-bold uppercase tracking-widest mb-2 pb-1 border-b"
              style={{ color: accentColor, borderColor: accentColor }}
            >
              Education
            </h2>
            {data.education.map((edu, i) => (
              <div key={edu.id} className="flex justify-between items-baseline mb-1">
                <div>
                  <span className="text-[9pt] font-bold text-gray-900">{edu.degree}</span>
                  {edu.field && <span className="text-[9pt] text-gray-700"> in {edu.field}</span>}
                  <span className="text-[9pt] text-gray-500"> — {edu.school}</span>
                </div>
                <span className="text-[8pt] text-gray-500">{edu.endDate}</span>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default TemplatesSection;
