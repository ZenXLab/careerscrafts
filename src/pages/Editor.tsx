import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { templates, getTemplateById } from "@/data/templates";
import { ResumeData } from "@/types/resume";
import { getResumeForTemplate } from "@/data/resumeProfiles";
import { useToast } from "@/hooks/use-toast";
import EditorSidebar from "@/components/editor/EditorSidebar";
import EditorFormPanel from "@/components/editor/EditorFormPanel";
import LiveResumeCanvas from "@/components/editor/LiveResumeCanvas";
import ContextualPanel from "@/components/editor/ContextualPanel";
import AddSectionModal from "@/components/editor/AddSectionModal";
import RearrangeSectionsModal from "@/components/editor/RearrangeSectionsModal";
import AIGenerationModal from "@/components/editor/AIGenerationModal";
import DesignPanel, { DesignSettings } from "@/components/editor/DesignPanel";
import PDFUploadModal from "@/components/editor/PDFUploadModal";
import { exportToPDF } from "@/utils/pdfExport";
import TemplatePreview from "@/components/TemplatePreview";
import { 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Zap,
  Award,
  FileDown
} from "lucide-react";

const Editor = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateId = searchParams.get("template") || "modern-minimal";
  const template = getTemplateById(templateId) || templates[0];
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [resumeData, setResumeData] = useState<ResumeData>(getResumeForTemplate(templateId));
  const [atsScore, setAtsScore] = useState(82);
  const [activeSection, setActiveSection] = useState("personal");
  
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

  // Sections for navigation
  const sections = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "summary", label: "Summary", icon: FileText },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Zap },
  ];

  // Sections for rearranging
  const [resumeSections, setResumeSections] = useState([
    { id: "header", name: "Header", locked: true, removable: false },
    { id: "summary", name: "Professional Summary", locked: false, removable: false },
    { id: "experience", name: "Experience", locked: false, removable: false },
    { id: "education", name: "Education", locked: false, removable: true },
    { id: "skills", name: "Skills", locked: false, removable: true },
  ]);

  const [existingSections, setExistingSections] = useState<string[]>([]);

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
    
    // Create a hidden preview element for PDF export
    const printContainer = document.createElement("div");
    printContainer.id = "pdf-print-container";
    printContainer.style.position = "fixed";
    printContainer.style.left = "-9999px";
    printContainer.style.top = "0";
    document.body.appendChild(printContainer);
    
    try {
      // Render the template preview
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
      locked: false,
      removable: true
    }]);
    setShowAddSection(false);
    toast({ title: "Section added", description: `${sectionType} section has been added.` });
  };

  const handleRemoveSection = (sectionId: string) => {
    setResumeSections(resumeSections.filter(s => s.id !== sectionId));
    setExistingSections(existingSections.filter(s => s !== sectionId));
    toast({ title: "Section removed" });
  };

  const handleReorderSections = (newOrder: typeof resumeSections) => {
    setResumeSections(newOrder);
    toast({ title: "Sections reordered" });
  };

  const handleAiImprove = (field: string, content: string) => {
    setContextualPanelMode("ai-suggestions");
    toast({ 
      title: "AI Analysis", 
      description: "Generating improvements for your content..." 
    });
  };

  const handleAiGenerate = (generatedData: ResumeData) => {
    setResumeData(generatedData);
    setAtsScore(85); // Reset ATS score for new resume
    toast({ 
      title: "Resume generated!", 
      description: "Review and customize your AI-generated resume." 
    });
  };

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
          <span className="font-medium text-sm">CareersCraft</span>
        </Link>
        
        <div className="h-6 w-px bg-border mx-2" />
        
        <span className="text-sm text-muted-foreground">
          Editing: <span className="text-foreground">{template.name}</span>
        </span>
        
        <div className="ml-auto flex items-center gap-2">
          <Link to="/templates">
            <Button variant="ghost" size="sm">Templates</Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => setShowAiGenerate(true)}>
            AI Generate
          </Button>
          <Button variant="hero" size="sm" onClick={handleExportPDF}>
            <FileDown className="w-4 h-4 mr-1.5" />
            Export PDF
          </Button>
        </div>
      </header>

      {/* Main Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Command Panel */}
        <EditorSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onAddSection={() => setShowAddSection(true)}
          onRearrange={() => setShowRearrange(true)}
          onTemplates={() => navigate("/templates")}
          onDesign={() => setShowDesignPanel(true)}
          onImproveText={() => setContextualPanelMode("ai-suggestions")}
          onAtsCheck={() => setContextualPanelMode("ats-warnings")}
          onJdMapping={() => setContextualPanelMode("jd-mapping")}
          onDownload={handleExportPDF}
          onShare={() => toast({ title: "Share", description: "Sharing options coming soon..." })}
          onHistory={() => toast({ title: "History", description: "Version history coming soon..." })}
          onAiGenerate={() => setShowAiGenerate(true)}
          onExportPDF={handleExportPDF}
          onPdfUpload={() => setShowPdfUpload(true)}
          atsScore={atsScore}
        />

        {/* Section Tabs */}
        <div className="w-12 border-r border-border/50 bg-card/20 flex flex-col items-center py-3 gap-1">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeSection === section.id 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={section.label}
            >
              <section.icon className="w-4 h-4" />
            </motion.button>
          ))}
        </div>

        {/* Form Panel */}
        <EditorFormPanel
          data={resumeData}
          activeSection={activeSection}
          onDataChange={setResumeData}
          onAiImprove={handleAiImprove}
        />

        {/* Live Preview Canvas with Inline Editing */}
        <div ref={previewRef} data-resume-preview className="flex-1">
          <LiveResumeCanvas
            template={template}
            data={resumeData}
            designSettings={designSettings}
            onDataChange={setResumeData}
            onAiImprove={handleAiImprove}
            sectionOrder={resumeSections.map(s => s.id).filter(id => id !== 'header')}
            onSectionOrderChange={(order) => {
              const newSections = [
                { id: "header", name: "Header", locked: true, removable: false },
                ...order.map(id => resumeSections.find(s => s.id === id) || { id, name: id, locked: false, removable: true })
              ];
              setResumeSections(newSections);
            }}
          />
        </div>

        {/* Right Contextual Panel */}
        {contextualPanelMode && (
          <ContextualPanel
            mode={contextualPanelMode}
            onClose={() => setContextualPanelMode(null)}
            currentContent={resumeData.summary}
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
