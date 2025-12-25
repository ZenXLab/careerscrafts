import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { templates, getTemplateById } from "@/data/templates";
import { ResumeData } from "@/types/resume";
import { getResumeForTemplate } from "@/data/resumeProfiles";
import { useToast } from "@/hooks/use-toast";
import EditorSidebar from "@/components/editor/EditorSidebar";
import LiveResumeCanvas from "@/components/editor/LiveResumeCanvas";
import ContextualPanel from "@/components/editor/ContextualPanel";
import AddSectionModal from "@/components/editor/AddSectionModal";
import RearrangeSectionsModal from "@/components/editor/RearrangeSectionsModal";
import AIGenerationModal from "@/components/editor/AIGenerationModal";
import DesignPanel, { DesignSettings } from "@/components/editor/DesignPanel";
import PDFUploadModal from "@/components/editor/PDFUploadModal";
import { exportToPDF } from "@/utils/pdfExport";
import { FileDown, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Editor = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateId = searchParams.get("template") || "modern-minimal";
  const template = getTemplateById(templateId) || templates[0];
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const [resumeData, setResumeData] = useState<ResumeData>(getResumeForTemplate(templateId));
  const [atsScore, setAtsScore] = useState(82);
  
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
  
  // Modal states
  const [showAddSection, setShowAddSection] = useState(false);
  const [showRearrange, setShowRearrange] = useState(false);
  const [showAiGenerate, setShowAiGenerate] = useState(false);
  const [showDesignPanel, setShowDesignPanel] = useState(false);
  const [showPdfUpload, setShowPdfUpload] = useState(false);
  const [contextualPanelMode, setContextualPanelMode] = useState<"ai-suggestions" | "jd-mapping" | "ats-warnings" | null>(null);
  
  // Design settings
  const [designSettings, setDesignSettings] = useState<DesignSettings>({
    fontFamily: "'Inter', sans-serif",
    fontSize: 100,
    lineSpacing: 1.4,
    sectionSpacing: 20,
    accentColor: "hsl(221, 83%, 53%)",
    layout: "single-column",
  });

  // Section order for rearranging
  const [sectionOrder, setSectionOrder] = useState(["summary", "skills", "experience", "education"]);
  
  // Sections for modals
  const [resumeSections, setResumeSections] = useState([
    { id: "header", name: "Header", removable: false },
    { id: "summary", name: "Professional Summary", removable: false },
    { id: "experience", name: "Experience", removable: false },
    { id: "education", name: "Education", removable: true },
    { id: "skills", name: "Skills", removable: true },
  ]);

  const [existingSections, setExistingSections] = useState<string[]>([]);

  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarCollapsed(isMobile);
  }, [isMobile]);

  // ATS score animation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (atsScore < 94) setAtsScore(prev => Math.min(prev + 1, 94));
    }, 1500);
    return () => clearTimeout(timer);
  }, [atsScore]);

  const handleExportPDF = async () => {
    toast({ 
      title: "Preparing PDF", 
      description: "Opening print dialog..." 
    });
    
    const printContainer = document.createElement("div");
    printContainer.id = "pdf-print-container";
    printContainer.style.position = "fixed";
    printContainer.style.left = "-9999px";
    printContainer.style.top = "0";
    document.body.appendChild(printContainer);
    
    try {
      const previewElement = document.createElement("div");
      previewElement.innerHTML = `
        <div style="width: 210mm; min-height: 297mm; background: white; font-family: Inter, sans-serif;">
          ${document.querySelector('[data-resume-preview]')?.innerHTML || ''}
        </div>
      `;
      printContainer.appendChild(previewElement);
      
      await exportToPDF(previewElement, template, resumeData, {
        format: "pdf",
        filename: `${resumeData.personalInfo.name.replace(/\s+/g, "_")}_Resume`
      });
    } finally {
      document.body.removeChild(printContainer);
    }
  };

  const handleAddSection = (sectionType: string) => {
    setExistingSections([...existingSections, sectionType]);
    setResumeSections([...resumeSections, {
      id: sectionType,
      name: sectionType.charAt(0).toUpperCase() + sectionType.slice(1).replace("-", " "),
      removable: true
    }]);
    setSectionOrder([...sectionOrder, sectionType]);
    setShowAddSection(false);
    toast({ title: "Section added", description: `${sectionType} section has been added.` });
  };

  const handleRemoveSection = (sectionId: string) => {
    setResumeSections(resumeSections.filter(s => s.id !== sectionId));
    setExistingSections(existingSections.filter(s => s !== sectionId));
    setSectionOrder(sectionOrder.filter(s => s !== sectionId));
    toast({ title: "Section removed" });
  };

  const handleReorderSections = (newOrder: typeof resumeSections) => {
    setResumeSections(newOrder);
    setSectionOrder(newOrder.filter(s => s.id !== 'header').map(s => s.id));
    toast({ title: "Sections reordered" });
  };

  const handleAiGenerate = (generatedData: ResumeData) => {
    setResumeData(generatedData);
    setAtsScore(85);
    toast({ 
      title: "Resume generated!", 
      description: "Review and customize your AI-generated resume." 
    });
  };

  // Mobile read-only view
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Mobile Header */}
        <header className="h-14 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center px-4 gap-3 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-primary" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <span className="font-medium text-sm">CareersCraft</span>
          </Link>
          <div className="ml-auto">
            <Button variant="hero" size="sm" onClick={handleExportPDF}>
              <FileDown className="w-4 h-4 mr-1.5" />
              Export
            </Button>
          </div>
        </header>

        {/* Mobile Preview */}
        <div className="flex-1 overflow-auto p-4">
          <div className="bg-card rounded-lg p-6 text-center mb-4 border border-border">
            <h2 className="text-lg font-semibold mb-2">Edit on Desktop</h2>
            <p className="text-sm text-muted-foreground">
              For the best editing experience, please use a desktop or tablet device.
            </p>
          </div>
          <div ref={previewRef} data-resume-preview className="pointer-events-none">
            <LiveResumeCanvas
              template={template}
              data={resumeData}
              designSettings={designSettings}
              sectionOrder={sectionOrder}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center px-4 gap-4 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-primary" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <span className="font-medium text-sm hidden sm:inline">CareersCraft</span>
        </Link>
        
        <div className="h-6 w-px bg-border mx-2 hidden sm:block" />
        
        <span className="text-sm text-muted-foreground hidden md:block">
          Editing: <span className="text-foreground">{template.name}</span>
        </span>
        
        <div className="ml-auto flex items-center gap-2">
          <Link to="/templates" className="hidden sm:block">
            <Button variant="ghost" size="sm">Templates</Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => setShowAiGenerate(true)} className="hidden sm:flex">
            AI Generate
          </Button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="hero" size="sm" onClick={handleExportPDF}>
              <FileDown className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Main Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Command Panel */}
        <EditorSidebar
          onAddSection={() => setShowAddSection(true)}
          onRearrange={() => setShowRearrange(true)}
          onTemplates={() => navigate("/templates")}
          onDesign={() => setShowDesignPanel(true)}
          onImproveText={() => setContextualPanelMode("ai-suggestions")}
          onAtsCheck={() => setContextualPanelMode("ats-warnings")}
          onJdMapping={() => setContextualPanelMode("jd-mapping")}
          onShare={() => toast({ title: "Share", description: "Sharing options coming soon..." })}
          onHistory={() => toast({ title: "History", description: "Version history coming soon..." })}
          onAiGenerate={() => setShowAiGenerate(true)}
          onExportPDF={handleExportPDF}
          onPdfUpload={() => setShowPdfUpload(true)}
          atsScore={atsScore}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Live Preview Canvas with Inline Editing */}
        <div ref={previewRef} data-resume-preview className="flex-1">
          <LiveResumeCanvas
            template={template}
            data={resumeData}
            designSettings={designSettings}
            onDataChange={setResumeData}
            sectionOrder={sectionOrder}
            onSectionOrderChange={setSectionOrder}
          />
        </div>

        {/* Right Contextual Panel */}
        {contextualPanelMode && (
          <ContextualPanel
            mode={contextualPanelMode}
            onClose={() => setContextualPanelMode(null)}
            currentContent={resumeData.summary}
            resumeContent={`${resumeData.personalInfo.name} ${resumeData.personalInfo.title} ${resumeData.summary} ${
              resumeData.experience.map(e => `${e.position} ${e.company} ${e.bullets.join(' ')}`).join(' ')
            } ${resumeData.education.map(e => `${e.degree} ${e.school} ${e.field || ''}`).join(' ')} ${
              resumeData.skills?.map(s => s.items.join(' ')).join(' ') || ''
            }`}
          />
        )}
      </div>

      {/* Modals */}
      <AddSectionModal
        isOpen={showAddSection}
        onClose={() => setShowAddSection(false)}
        onAddSection={handleAddSection}
        existingSections={existingSections}
      />

      <RearrangeSectionsModal
        isOpen={showRearrange}
        onClose={() => setShowRearrange(false)}
        sections={resumeSections}
        onReorder={handleReorderSections}
        onRemove={handleRemoveSection}
      />

      <AIGenerationModal
        isOpen={showAiGenerate}
        onClose={() => setShowAiGenerate(false)}
        onGenerate={handleAiGenerate}
      />

      <DesignPanel
        isOpen={showDesignPanel}
        onClose={() => setShowDesignPanel(false)}
        settings={designSettings}
        onSettingsChange={setDesignSettings}
      />

      <PDFUploadModal
        isOpen={showPdfUpload}
        onClose={() => setShowPdfUpload(false)}
        onExtracted={(data) => {
          setResumeData(data);
          toast({ title: "Resume imported!", description: "Edit your imported resume." });
        }}
      />
    </div>
  );
};

export default Editor;
