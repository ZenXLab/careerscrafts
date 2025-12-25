import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { templates, getTemplateById } from "@/data/templates";
import { ResumeData, TemplateConfig } from "@/types/resume";
import { getResumeForTemplate } from "@/data/resumeProfiles";
import { useToast } from "@/hooks/use-toast";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import EditorSidebar from "@/components/editor/EditorSidebar";
import LiveResumeCanvas from "@/components/editor/LiveResumeCanvas";
import ContextualPanel from "@/components/editor/ContextualPanel";
import AddSectionModal from "@/components/editor/AddSectionModal";
import RearrangeSectionsModal from "@/components/editor/RearrangeSectionsModal";
import LayoutStructureModal from "@/components/editor/LayoutStructureModal";
import AIGenerationModal from "@/components/editor/AIGenerationModal";
import DesignPanel, { DesignSettings } from "@/components/editor/DesignPanel";
import PDFUploadModal from "@/components/editor/PDFUploadModal";
import VersionCompareModal from "@/components/editor/VersionCompareModal";
import TemplateSwitchModal from "@/components/editor/TemplateSwitchModal";
import ATSScoreWidget from "@/components/editor/ATSScoreWidget";
import ProfilePhotoUpload from "@/components/editor/ProfilePhotoUpload";
import ThemeManager from "@/components/editor/ThemeManager";
import { useATSScore } from "@/hooks/useATSScore";
import { useResumeVersions } from "@/hooks/useResumeVersions";
import { exportToPDF } from "@/utils/pdfExport";
import { FileDown, Menu, Palette as PaletteIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Editor = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateId = searchParams.get("template") || "modern-minimal";
  const [currentTemplate, setCurrentTemplate] = useState<TemplateConfig>(
    getTemplateById(templateId) || templates[0]
  );
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const [resumeData, setResumeData] = useState<ResumeData>(getResumeForTemplate(templateId));
  const [previousData, setPreviousData] = useState<ResumeData | null>(null);
  
  // ATS Score Hook
  const { 
    score: atsScore, 
    animatedScore, 
    breakdown: atsBreakdown,
    feedback: atsFeedback, 
    sectionSignals, 
    isHighScore,
    recalculate: recalculateATS 
  } = useATSScore(resumeData);
  
  // Resume Versions Hook
  const {
    versions,
    currentVersion,
    saveVersion,
    loadVersion,
    compareVersions,
    deleteVersion,
  } = useResumeVersions();
  
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
  
  // Modal states
  const [showAddSection, setShowAddSection] = useState(false);
  const [showRearrange, setShowRearrange] = useState(false);
  const [showLayoutStructure, setShowLayoutStructure] = useState(false);
  const [showAiGenerate, setShowAiGenerate] = useState(false);
  const [showDesignPanel, setShowDesignPanel] = useState(false);
  const [showPdfUpload, setShowPdfUpload] = useState(false);
  const [showVersionCompare, setShowVersionCompare] = useState(false);
  const [showTemplateSwitch, setShowTemplateSwitch] = useState(false);
  const [showThemeManager, setShowThemeManager] = useState(false);
  const [contextualPanelMode, setContextualPanelMode] = useState<"ai-suggestions" | "jd-mapping" | "ats-warnings" | null>(null);
  
  // Design settings
  const [designSettings, setDesignSettings] = useState<DesignSettings>({
    fontFamily: "'Inter', sans-serif",
    fontSize: 100,
    lineSpacing: 1.4,
    sectionSpacing: 20,
    accentColor: currentTemplate.accentColor || "hsl(221, 83%, 53%)",
    layout: "single-column",
  });

  // Section order for rearranging
  const [sectionOrder, setSectionOrder] = useState(["summary", "skills", "experience", "education"]);
  
  // Sections for modals
  const [resumeSections, setResumeSections] = useState([
    { id: "header", name: "Header", removable: false, locked: true },
    { id: "summary", name: "Professional Summary", removable: false },
    { id: "experience", name: "Experience", removable: false },
    { id: "education", name: "Education", removable: true },
    { id: "skills", name: "Skills", removable: true },
  ]);

  const [existingSections, setExistingSections] = useState<string[]>([]);

  // Close all modals helper
  const closeAllModals = useCallback(() => {
    setShowAddSection(false);
    setShowRearrange(false);
    setShowLayoutStructure(false);
    setShowAiGenerate(false);
    setShowDesignPanel(false);
    setShowPdfUpload(false);
    setShowVersionCompare(false);
    setShowTemplateSwitch(false);
    setShowThemeManager(false);
    setContextualPanelMode(null);
  }, []);

  // Handle save
  const handleSave = useCallback(() => {
    saveVersion(resumeData, atsScore);
    toast({ title: "Saved!", description: "Your resume has been saved." });
  }, [resumeData, atsScore, saveVersion, toast]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (previousData) {
      setResumeData(previousData);
      toast({ title: "Undone", description: "Last change has been reverted." });
    }
  }, [previousData, toast]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSave: handleSave,
    onUndo: handleUndo,
    onExport: () => handleExportPDF(),
    onEscape: closeAllModals,
  });

  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarCollapsed(isMobile);
  }, [isMobile]);

  // Recalculate ATS score when resume data changes
  useEffect(() => {
    recalculateATS(resumeData);
  }, [resumeData, recalculateATS]);

  // Handle resume data changes with undo support
  const handleResumeDataChange = useCallback((newData: ResumeData) => {
    setPreviousData(resumeData);
    setResumeData(newData);
  }, [resumeData]);

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
      
      await exportToPDF(previewElement, currentTemplate, resumeData, {
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
    
    // Initialize default data for the new section
    const newResumeData = { ...resumeData };
    
    switch(sectionType) {
      case "languages":
        if (!newResumeData.languages) {
          newResumeData.languages = [
            { language: "English", proficiency: "Professional" }
          ];
        }
        break;
      case "certifications":
        if (!newResumeData.certifications) {
          newResumeData.certifications = [
            { id: "cert1", name: "Certification Name", issuer: "Issuing Organization", date: "2024" }
          ];
        }
        break;
      case "projects":
        if (!newResumeData.projects) {
          newResumeData.projects = [
            { 
              id: "proj1", 
              name: "Project Name", 
              description: "Project description here", 
              technologies: ["Technology 1", "Technology 2"],
              link: ""
            }
          ];
        }
        break;
    }
    
    setResumeData(newResumeData);
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
    // Update section order for preview - filter out 'header' which is always at top
    setSectionOrder(newOrder.filter(s => s.id !== 'header').map(s => s.id));
  };

  const handleAiGenerate = (generatedData: ResumeData) => {
    setResumeData(generatedData);
    toast({ 
      title: "Resume generated!", 
      description: "Review and customize your AI-generated resume." 
    });
  };

  const handleTemplateSwitch = (template: TemplateConfig) => {
    setCurrentTemplate(template);
    setSearchParams({ template: template.id });
    setDesignSettings(prev => ({
      ...prev,
      accentColor: template.accentColor,
      layout: template.layout,
    }));
    toast({ 
      title: "Template switched", 
      description: `Now using ${template.name} template.` 
    });
  };

  const handleLayoutStructure = (layout: "single-column" | "two-column" | "sidebar") => {
    setDesignSettings(prev => ({
      ...prev,
      layout,
    }));
    toast({ 
      title: "Layout changed", 
      description: `Switched to ${layout.replace("-", " ")} layout.` 
    });
  };

  const handleRestoreVersion = (data: ResumeData) => {
    setResumeData(data);
    toast({ title: "Version restored" });
  };

  const handleProfilePhotoChange = (url: string | null) => {
    const newData = {
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        photo: url || undefined
      }
    };
    setResumeData(newData);
  };

  const handleApplyTheme = (theme: Partial<{ accent_color: string }>) => {
    if (theme.accent_color) {
      setDesignSettings(prev => ({
        ...prev,
        accentColor: theme.accent_color!
      }));
    }
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
              template={currentTemplate}
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
        
        <button 
          onClick={() => setShowTemplateSwitch(true)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden md:block"
        >
          Template: <span className="text-foreground">{currentTemplate.name}</span>
        </button>
        
        {/* ATS Score Widget in Header */}
        <div className="ml-auto flex items-center gap-3">
          <ATSScoreWidget
            score={atsScore}
            animatedScore={animatedScore}
            feedback={atsFeedback}
            isHighScore={isHighScore}
            breakdown={atsBreakdown}
            compact
          />
          
          <div className="h-6 w-px bg-border hidden sm:block" />

          {/* Profile Photo Upload */}
          <ProfilePhotoUpload
            currentPhotoUrl={resumeData.personalInfo.photo}
            onPhotoChange={handleProfilePhotoChange}
            className="hidden sm:block"
          />
          
          <div className="h-6 w-px bg-border hidden sm:block" />
          
          {/* Theme Manager Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowThemeManager(true)}
            className="hidden sm:flex gap-1.5"
            title="Manage color themes"
          >
            <PaletteIcon className="w-4 h-4" />
            <span>Themes</span>
          </Button>
          
          <div className="h-6 w-px bg-border hidden sm:block" />
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowVersionCompare(true)}
            className="hidden sm:flex"
          >
            v{currentVersion || 1}
          </Button>
          
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
          onLayoutStructure={() => setShowLayoutStructure(true)}
          onTemplates={() => setShowTemplateSwitch(true)}
          onDesign={() => setShowDesignPanel(true)}
          onImproveText={() => setContextualPanelMode("ai-suggestions")}
          onAtsCheck={() => setContextualPanelMode("ats-warnings")}
          onJdMapping={() => setContextualPanelMode("jd-mapping")}
          onShare={() => toast({ title: "Share", description: "Sharing options coming soon..." })}
          onHistory={() => setShowVersionCompare(true)}
          onAiGenerate={() => setShowAiGenerate(true)}
          onExportPDF={handleExportPDF}
          onPdfUpload={() => setShowPdfUpload(true)}
          atsScore={animatedScore}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Live Preview Canvas with Inline Editing */}
        <div ref={previewRef} data-resume-preview className="flex-1">
          <LiveResumeCanvas
            template={currentTemplate}
            data={resumeData}
            designSettings={designSettings}
            onDataChange={handleResumeDataChange}
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

      <LayoutStructureModal
        isOpen={showLayoutStructure}
        onClose={() => setShowLayoutStructure(false)}
        currentLayout={designSettings.layout}
        onSelectLayout={handleLayoutStructure}
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

      <ThemeManager
        isOpen={showThemeManager}
        onClose={() => setShowThemeManager(false)}
        currentAccentColor={designSettings.accentColor}
        onApplyTheme={handleApplyTheme}
      />

      <PDFUploadModal
        isOpen={showPdfUpload}
        onClose={() => setShowPdfUpload(false)}
        onExtracted={(data) => {
          setResumeData(data);
          toast({ title: "Resume imported!", description: "Edit your imported resume." });
        }}
      />

      <VersionCompareModal
        isOpen={showVersionCompare}
        onClose={() => setShowVersionCompare(false)}
        versions={versions}
        currentData={resumeData}
        onSaveVersion={saveVersion}
        onLoadVersion={loadVersion}
        onRestoreVersion={handleRestoreVersion}
        onDeleteVersion={deleteVersion}
        compareVersions={compareVersions}
        atsScore={atsScore}
      />

      <TemplateSwitchModal
        isOpen={showTemplateSwitch}
        onClose={() => setShowTemplateSwitch(false)}
        currentTemplate={currentTemplate}
        onSelectTemplate={handleTemplateSwitch}
        currentATSScore={atsScore}
      />
    </div>
  );
};

export default Editor;
