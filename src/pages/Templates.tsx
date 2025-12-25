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
  sampleResumeDataExecutive 
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

const getSampleDataForTemplate = (template: TemplateConfig) => {
  if (template.category === "technical") return sampleResumeDataEngineer;
  if (template.category === "creative") return sampleResumeDataDesigner;
  if (template.category === "executive") return sampleResumeDataExecutive;
  return sampleResumeData;
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
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-primary" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <span className="font-semibold text-foreground tracking-tight">CareersCraft</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link to="/editor">
              <Button variant="hero" size="sm">
                Start Building
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              Premium <span className="font-serif italic">Templates</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every template is ATS-tested and recruiter-approved. Choose your style, we'll handle the formatting.
            </p>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  {/* Template Card */}
                  <div className="relative mb-4 rounded-lg overflow-hidden bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-glow">
                    <div className="aspect-[210/297] relative overflow-hidden">
                      <div className="absolute inset-0 flex items-start justify-center p-4">
                        <TemplatePreview 
                          template={template} 
                          data={getSampleDataForTemplate(template)} 
                          scale={0.28}
                        />
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-border">
                          Preview Template
                        </span>
                      </div>
                    </div>

                    {/* Template Info Bar */}
                    <div className="p-4 border-t border-border/50 bg-card/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium mb-0.5">{template.name}</h3>
                          <p className="text-xs text-muted-foreground">{template.pages} page{template.pages > 1 ? 's' : ''} • {template.layout.replace('-', ' ')}</p>
                        </div>
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0" 
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
            className="text-center mt-12 text-muted-foreground text-sm"
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
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card border border-border rounded-xl shadow-elevated max-w-5xl w-full max-h-[90vh] overflow-hidden flex"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Preview Side */}
              <div className="flex-1 bg-muted/30 p-8 overflow-auto flex items-start justify-center">
                <div className="transform scale-75 origin-top">
                  <TemplatePreview 
                    template={selectedTemplate} 
                    data={getSampleDataForTemplate(selectedTemplate)} 
                    scale={0.7}
                  />
                </div>
              </div>

              {/* Info Side */}
              <div className="w-80 p-6 border-l border-border flex flex-col">
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="mb-6">
                  <div 
                    className="w-8 h-8 rounded-lg mb-4" 
                    style={{ backgroundColor: selectedTemplate.accentColor }}
                  />
                  <h2 className="text-2xl font-semibold mb-2">{selectedTemplate.name}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {selectedTemplate.description}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="text-sm font-medium capitalize">{selectedTemplate.category}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Pages</span>
                    <span className="text-sm font-medium">{selectedTemplate.pages}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Layout</span>
                    <span className="text-sm font-medium capitalize">{selectedTemplate.layout.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Photo</span>
                    <span className="text-sm font-medium">{selectedTemplate.hasPhoto ? 'Included' : 'No photo'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">ATS Score</span>
                    <span className="text-sm font-medium text-emerald">Optimized</span>
                  </div>
                </div>

                <div className="mt-auto space-y-3">
                  <Link to={`/editor?template=${selectedTemplate.id}`} className="block">
                    <Button variant="hero" size="lg" className="w-full">
                      Use This Template
                    </Button>
                  </Link>
                  <Button 
                    variant="hero-secondary" 
                    size="lg" 
                    className="w-full"
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
