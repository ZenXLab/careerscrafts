import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { templates } from "@/data/templates";
import TemplatePreview from "@/components/TemplatePreview";
import TemplateGalleryCard from "@/components/TemplateGalleryCard";
import { 
  sampleResumeData, 
  sampleResumeDataEngineer, 
  sampleResumeDataDesigner, 
  sampleResumeDataExecutive,
  heroResumeData
} from "@/types/resume";
import { TemplateConfig } from "@/types/resume";

// Industry sections for organized display
const industrySections = [
  {
    id: "technology",
    title: "Technology & Engineering",
    description: "Built for developers, engineers, and tech professionals",
    categories: ["technical"],
    icon: "💻"
  },
  {
    id: "business",
    title: "Business & Consulting",
    description: "For analysts, consultants, and corporate roles",
    categories: ["professional"],
    icon: "📊"
  },
  {
    id: "creative",
    title: "Product, Design & Creative",
    description: "For designers, PMs, and creative professionals",
    categories: ["creative"],
    icon: "🎨"
  },
  {
    id: "executive",
    title: "Executive & Leadership",
    description: "For senior leaders, directors, and C-suite",
    categories: ["executive"],
    icon: "👔"
  },
  {
    id: "modern",
    title: "Startup & Modern",
    description: "Dynamic layouts for innovative roles",
    categories: ["modern"],
    icon: "🚀"
  }
];

const getSampleDataForTemplate = (template: TemplateConfig, index: number) => {
  const samples = [sampleResumeData, sampleResumeDataEngineer, sampleResumeDataDesigner, sampleResumeDataExecutive, heroResumeData];
  if (template.category === "technical") return index % 2 === 0 ? sampleResumeDataEngineer : heroResumeData;
  if (template.category === "creative") return sampleResumeDataDesigner;
  if (template.category === "executive") return sampleResumeDataExecutive;
  return samples[index % samples.length];
};

const Templates = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null);
  
  // Group templates by section
  const templatesBySection = useMemo(() => {
    return industrySections.map(section => ({
      ...section,
      templates: templates.filter(t => section.categories.includes(t.category))
    })).filter(section => section.templates.length > 0);
  }, []);

  // Filter templates
  const filteredSections = useMemo(() => {
    if (activeFilter === "all") return templatesBySection;
    return templatesBySection.filter(s => s.id === activeFilter);
  }, [activeFilter, templatesBySection]);

  const totalTemplates = templates.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/90 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <span className="font-semibold text-foreground tracking-tight text-sm sm:text-base">CareersCraft</span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/onboarding">
              <Button variant="hero" size="sm" className="text-xs sm:text-sm px-3 sm:px-4">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-10"
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight mb-3">
              Templates built for <span className="font-serif italic">industries</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Every template is ATS-safe, professionally structured, and designed for a specific career stage.
              Not aesthetics — impact.
            </p>
          </motion.div>

          {/* Industry Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10"
          >
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeFilter === "all" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              All Templates ({totalTemplates})
            </button>
            {industrySections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveFilter(section.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  activeFilter === section.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span>{section.icon}</span>
                <span className="hidden sm:inline">{section.title.split(" ")[0]}</span>
                <span className="sm:hidden">{section.title.split(" ")[0]}</span>
              </button>
            ))}
          </motion.div>

          {/* Templates by Section */}
          <div className="space-y-12 sm:space-y-16">
            {filteredSections.map((section, sectionIndex) => (
              <motion.section
                key={section.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-foreground">{section.title}</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">{section.description}</p>
                  </div>
                  <div className="flex-1 h-px bg-border/50 ml-4 hidden sm:block" />
                </div>

                {/* Templates Grid - 4 columns on desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {section.templates.map((template, index) => (
                    <TemplateGalleryCard
                      key={template.id}
                      template={template}
                      data={getSampleDataForTemplate(template, index)}
                      index={index}
                      onClick={() => setSelectedTemplate(template)}
                    />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Template Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-10 sm:mt-12 text-muted-foreground text-xs sm:text-sm"
          >
            {activeFilter === "all" 
              ? `Showing all ${totalTemplates} templates`
              : `Showing ${filteredSections.reduce((acc, s) => acc + s.templates.length, 0)} templates`
            }
          </motion.div>
        </div>
      </main>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col lg:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button Mobile */}
              <button 
                onClick={() => setSelectedTemplate(null)}
                className="lg:hidden absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Preview Side - Larger */}
              <div className="flex-1 bg-gradient-to-br from-muted/30 to-muted/10 p-6 sm:p-10 overflow-auto flex items-start justify-center min-h-[50vh] lg:min-h-0">
                <div className="shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] rounded-sm">
                  <TemplatePreview 
                    template={selectedTemplate} 
                    data={getSampleDataForTemplate(selectedTemplate, 0)} 
                    scale={0.55}
                  />
                </div>
              </div>

              {/* Info Side */}
              <div className="w-full lg:w-80 p-5 sm:p-6 border-t lg:border-t-0 lg:border-l border-border flex flex-col bg-card">
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="hidden lg:flex absolute top-4 right-4 w-8 h-8 items-center justify-center rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="mb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-8 h-8 rounded-lg" 
                      style={{ backgroundColor: selectedTemplate.accentColor }}
                    />
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ATS Optimized
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">{selectedTemplate.name}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {selectedTemplate.description}
                  </p>
                </div>

                <div className="space-y-3 mb-6 flex-1">
                  {[
                    ["Format", selectedTemplate.category.charAt(0).toUpperCase() + selectedTemplate.category.slice(1)],
                    ["Pages", `${selectedTemplate.pages} page${selectedTemplate.pages > 1 ? "s" : ""}`],
                    ["Layout", selectedTemplate.layout.replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())],
                    ["Photo", selectedTemplate.hasPhoto ? "Included" : "No photo"],
                    ["ATS Score", "Optimized"]
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-border/30">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className={`text-xs font-medium ${label === "ATS Score" ? "text-emerald-400" : "text-foreground"}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 mt-auto">
                  <Link to={`/onboarding?template=${selectedTemplate.id}`} className="block">
                    <Button variant="hero" size="lg" className="w-full text-sm">
                      Use This Template
                    </Button>
                  </Link>
                  <Button 
                    variant="hero-secondary" 
                    size="lg" 
                    className="w-full text-sm"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Keep Browsing
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Templates;
