import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { templates } from "@/data/templates";
import TemplatePreview from "@/components/TemplatePreview";
import { 
  sampleResumeData, 
  sampleResumeDataEngineer, 
  sampleResumeDataDesigner, 
  sampleResumeDataExecutive,
  heroResumeData
} from "@/types/resume";
import { TemplateConfig } from "@/types/resume";

const categoryLabels = {
  all: "All Templates",
  professional: "Professional",
  modern: "Modern",
  creative: "Creative",
  executive: "Executive",
  technical: "Technical"
};

const getSampleDataForTemplate = (template: TemplateConfig, index: number) => {
  const samples = [sampleResumeData, sampleResumeDataEngineer, sampleResumeDataDesigner, sampleResumeDataExecutive, heroResumeData];
  if (template.category === "technical") return index % 2 === 0 ? sampleResumeDataEngineer : heroResumeData;
  if (template.category === "creative") return sampleResumeDataDesigner;
  if (template.category === "executive") return sampleResumeDataExecutive;
  return samples[index % samples.length];
};

const Templates = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateConfig | null>(null);
  
  const filteredTemplates = activeCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === activeCategory);

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
        <div className="container mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight mb-3 sm:mb-4">
              Premium <span className="font-serif italic">Templates</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-4">
              Every template is ATS-tested and recruiter-approved. Choose your style, we handle the formatting.
            </p>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-12 px-2"
          >
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeCategory === key 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </motion.div>

          {/* Templates Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  {/* Template Card */}
                  <div className="relative rounded-xl overflow-hidden bg-card border border-border/50 hover:border-primary/40 transition-all duration-500 hover:shadow-glow">
                    <div className="aspect-[3/4] relative overflow-hidden bg-muted/30 p-3 sm:p-4">
                      <div className="w-full h-full overflow-hidden rounded flex items-start justify-center">
                        <TemplatePreview 
                          template={template} 
                          data={getSampleDataForTemplate(template, index)} 
                          scale={0.22}
                        />
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-card/95 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-border shadow-lg">
                          Preview
                        </span>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="p-3 sm:p-4 border-t border-border/50 bg-card">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-medium text-sm sm:text-base truncate">{template.name}</h3>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">
                            {template.pages} page{template.pages > 1 ? "s" : ""} • {template.layout.replace("-", " ")}
                          </p>
                        </div>
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0 border border-white/20" 
                          style={{ backgroundColor: template.accentColor }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Template Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 sm:mt-12 text-muted-foreground text-xs sm:text-sm"
          >
            Showing {filteredTemplates.length} of {templates.length} templates
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
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card border border-border rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col lg:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button Mobile */}
              <button 
                onClick={() => setSelectedTemplate(null)}
                className="lg:hidden absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Preview Side */}
              <div className="flex-1 bg-muted/30 p-4 sm:p-8 overflow-auto flex items-start justify-center min-h-[40vh] lg:min-h-0">
                <TemplatePreview 
                  template={selectedTemplate} 
                  data={getSampleDataForTemplate(selectedTemplate, 0)} 
                  scale={0.45}
                />
              </div>

              {/* Info Side */}
              <div className="w-full lg:w-80 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-border flex flex-col">
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="hidden lg:block absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="mb-4 sm:mb-6">
                  <div 
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg mb-3 sm:mb-4" 
                    style={{ backgroundColor: selectedTemplate.accentColor }}
                  />
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">{selectedTemplate.name}</h2>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    {selectedTemplate.description}
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {[
                    ["Category", selectedTemplate.category],
                    ["Pages", selectedTemplate.pages.toString()],
                    ["Layout", selectedTemplate.layout.replace("-", " ")],
                    ["Photo", selectedTemplate.hasPhoto ? "Included" : "No photo"],
                    ["ATS Score", "Optimized"]
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-xs sm:text-sm text-muted-foreground">{label}</span>
                      <span className={`text-xs sm:text-sm font-medium capitalize ${label === "ATS Score" ? "text-emerald" : ""}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto space-y-2 sm:space-y-3">
                  <Link to={`/onboarding?template=${selectedTemplate.id}`} className="block">
                    <Button variant="hero" size="lg" className="w-full text-sm sm:text-base">
                      Use This Template
                    </Button>
                  </Link>
                  <Button 
                    variant="hero-secondary" 
                    size="lg" 
                    className="w-full text-sm sm:text-base"
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
