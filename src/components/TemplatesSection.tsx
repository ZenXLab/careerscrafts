import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { industryResumes, categories, IndustryTemplate } from "@/data/industryResumes";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Shield, Award, Code, Palette, Briefcase, TrendingUp, DollarSign, Heart } from "lucide-react";

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
  "ATS-Optimized": "bg-emerald/10 text-emerald border-emerald/30",
  "Executive": "bg-gold/10 text-gold border-gold/30",
  "Fresher-Friendly": "bg-primary/10 text-primary border-primary/30",
  "Creative": "bg-pink-500/10 text-pink-400 border-pink-500/30",
  "Technical": "bg-blue-500/10 text-blue-400 border-blue-500/30"
};

const TemplatesSection = () => {
  const [activeCategory, setActiveCategory] = useState<string>("technology");
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const filteredTemplates = industryResumes.filter(t => t.category === activeCategory);

  return (
    <section id="templates" className="section-spacing relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-4">
            Templates built for{" "}
            <span className="font-serif italic">industries</span> — not aesthetics
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every template is ATS-safe, professionally structured, and designed for a specific career stage. 
            Click any template to start editing immediately.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {iconMap[cat.icon]}
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Template Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template, index) => (
            <TemplateCard
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
          className="text-center mt-12"
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

const TemplateCard = ({ 
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
  const data = template.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => onHover(template.id)}
      onMouseLeave={() => onHover(null)}
      className="group cursor-pointer"
    >
      {/* Template Card */}
      <div className="relative mb-3">
        {/* Badge */}
        <div className={`absolute top-3 left-3 z-10 px-2 py-1 rounded-full text-[10px] font-semibold border ${badgeStyles[template.badge]}`}>
          <div className="flex items-center gap-1">
            {template.badge === "ATS-Optimized" && <Shield className="w-3 h-3" />}
            {template.badge === "Executive" && <Award className="w-3 h-3" />}
            {template.badge === "Technical" && <Code className="w-3 h-3" />}
            {template.badge === "Creative" && <Sparkles className="w-3 h-3" />}
            {template.badge}
          </div>
        </div>

        {/* Mini Resume Preview */}
        <motion.div 
          animate={{ 
            y: isHovered ? -8 : 0,
            rotateX: isHovered ? 2 : 0,
            scale: isHovered ? 1.02 : 1
          }}
          transition={{ duration: 0.3 }}
          className="aspect-[210/297] bg-white rounded-lg shadow-paper overflow-hidden group-hover:shadow-elevated transition-shadow duration-500"
          style={{ perspective: "1000px" }}
        >
          <div className="p-3 h-full text-[7px] text-gray-900 leading-tight overflow-hidden">
            {/* Header */}
            <div className="flex items-start gap-2 mb-2 pb-1.5 border-b-2" style={{ borderColor: template.accentColor }}>
              {data.personalInfo.photo && (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border" style={{ borderColor: template.accentColor }}>
                  <img 
                    src={data.personalInfo.photo} 
                    alt={data.personalInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-[9px] font-bold text-gray-900 truncate">{data.personalInfo.name}</h3>
                <p className="text-[7px] font-semibold truncate" style={{ color: template.accentColor }}>
                  {data.personalInfo.title}
                </p>
                <p className="text-[5px] text-gray-400 truncate">{data.personalInfo.email}</p>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-1.5">
              <h4 className="text-[6px] font-bold uppercase tracking-wider mb-0.5" style={{ color: template.accentColor }}>
                Summary
              </h4>
              <p className="text-gray-600 line-clamp-2 text-[5px]">{data.summary}</p>
            </div>

            {/* Experience */}
            <div className="mb-1.5">
              <h4 className="text-[6px] font-bold uppercase tracking-wider mb-0.5" style={{ color: template.accentColor }}>
                Experience
              </h4>
              {data.experience.slice(0, 1).map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[6px]">{exp.position}</span>
                    <span className="text-[4px] text-gray-400">{exp.startDate}</span>
                  </div>
                  <p className="text-[5px] text-gray-500">{exp.company}</p>
                  <ul className="mt-0.5">
                    {exp.bullets.slice(0, 1).map((bullet, i) => (
                      <li key={i} className="flex text-[5px] text-gray-600">
                        <span className="mr-0.5" style={{ color: template.accentColor }}>▸</span>
                        <span className="line-clamp-1">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-[6px] font-bold uppercase tracking-wider mb-0.5" style={{ color: template.accentColor }}>
                Skills
              </h4>
              <div className="flex flex-wrap gap-0.5">
                {data.skills.flatMap(s => s.items).slice(0, 6).map((skill, i) => (
                  <span 
                    key={i} 
                    className="px-1 py-0.5 rounded text-[4px]"
                    style={{ backgroundColor: `${template.accentColor}15`, color: template.accentColor }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hover Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent rounded-lg flex items-end justify-center p-4"
        >
          <div className="flex gap-2">
            <Link to={`/editor?template=${template.id}`}>
              <Button size="sm" variant="default" className="text-xs">
                Use Template
              </Button>
            </Link>
            <Button size="sm" variant="outline" className="text-xs">
              Preview
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Template Info */}
      <div className="text-center">
        <h3 className="font-medium text-sm mb-0.5">{template.name}</h3>
        <p className="text-xs text-muted-foreground">{template.role} • {template.industry}</p>
      </div>
    </motion.div>
  );
};

export default TemplatesSection;
