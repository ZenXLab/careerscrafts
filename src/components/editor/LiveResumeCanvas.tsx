import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeData, TemplateConfig } from "@/types/resume";
import { DesignSettings } from "./DesignPanel";

// A4 dimensions at 96 DPI (LOCKED - DO NOT CHANGE)
const A4_WIDTH = 794; // px
const A4_HEIGHT = 1123; // px

interface LiveResumeCanvasProps {
  template: TemplateConfig;
  data: ResumeData;
  designSettings?: DesignSettings;
  onFieldEdit?: (field: string, value: string) => void;
  mode?: "edit" | "preview" | "recruiter";
}

const LiveResumeCanvas = ({ 
  template, 
  data, 
  designSettings,
  onFieldEdit, 
  mode = "edit" 
}: LiveResumeCanvasProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(0.75);
  const totalPages = template.pages;
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"edit" | "preview">(mode === "recruiter" ? "preview" : "edit");

  // Calculate optimal zoom to fit viewport
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 64; // padding
      const containerHeight = container.clientHeight - 64;
      
      const fitWidth = containerWidth / A4_WIDTH;
      const fitHeight = containerHeight / A4_HEIGHT;
      const optimalZoom = Math.min(fitWidth, fitHeight, 1);
      
      setZoom(Math.max(0.5, Math.min(optimalZoom, 0.95)));
    }
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const handleFitToPage = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 64;
      const containerHeight = container.clientHeight - 64;
      const fitWidth = containerWidth / A4_WIDTH;
      const fitHeight = containerHeight / A4_HEIGHT;
      setZoom(Math.min(fitWidth, fitHeight, 1));
    }
  };

  // Default design settings
  const settings: DesignSettings = designSettings || {
    fontFamily: "'Inter', sans-serif",
    fontSize: 100,
    lineSpacing: 1.4,
    sectionSpacing: 20,
    accentColor: template.accentColor,
    layout: template.layout as DesignSettings["layout"],
  };

  return (
    <div className="flex-1 flex flex-col bg-muted/20 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center font-mono">
            {Math.round(zoom * 100)}%
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <div className="w-px h-5 bg-border mx-1" />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleFitToPage}
            title="Fit to Page"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "preview" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode(viewMode === "edit" ? "preview" : "edit")}
            className="h-8 text-xs"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            {viewMode === "preview" ? "Recruiter View" : "Edit View"}
          </Button>
        </div>
      </div>

      {/* Canvas Area - Viewport that scrolls, page stays fixed */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto flex justify-center items-start p-8"
        style={{
          background: `
            radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.03) 0%, transparent 50%),
            linear-gradient(180deg, hsl(var(--muted) / 0.3) 0%, hsl(var(--background)) 100%)
          `
        }}
      >
        {/* Zoom Container - scales the viewport, not the document */}
        <div 
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out'
          }}
        >
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Paper with Shadow - Fixed A4 Dimensions */}
            <div 
              className="relative bg-white rounded-sm"
              style={{
                width: `${A4_WIDTH}px`,
                height: `${A4_HEIGHT}px`,
                boxShadow: `
                  0 25px 50px -12px rgba(0, 0, 0, 0.25),
                  0 12px 25px -8px rgba(0, 0, 0, 0.15),
                  0 0 0 1px rgba(0, 0, 0, 0.05)
                `,
              }}
            >
              {/* Resume Content - Fixed A4 Page */}
              <ResumeDocument 
                template={template}
                data={data}
                settings={settings}
                viewMode={viewMode}
              />
            </div>

            {/* Page Indicators for Multi-Page */}
            {totalPages > 1 && (
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-2.5 h-10 rounded-full transition-all ${
                      currentPage === idx + 1 
                        ? "bg-primary shadow-sm" 
                        : "bg-border hover:bg-muted-foreground/50"
                    }`}
                    title={`Page ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border/50 bg-card/50 backdrop-blur-sm flex-shrink-0">
        <span className="text-xs text-muted-foreground">
          {template.name} • A4 ({A4_WIDTH}×{A4_HEIGHT}px) • {settings.layout === 'single-column' ? 'Single Column' : settings.layout === 'sidebar' ? 'Sidebar' : 'Two Column'}
        </span>
        <span className="text-xs text-muted-foreground">
          Last saved: Just now
        </span>
      </div>
    </div>
  );
};

// Fixed A4 Resume Document Component
interface ResumeDocumentProps {
  template: TemplateConfig;
  data: ResumeData;
  settings: DesignSettings;
  viewMode: "edit" | "preview";
}

const ResumeDocument = ({ template, data, settings, viewMode }: ResumeDocumentProps) => {
  const accentColor = settings.accentColor || template.accentColor;
  const fontScale = settings.fontSize / 100;
  const lineHeight = settings.lineSpacing;
  const sectionGap = settings.sectionSpacing;

  const baseStyles = {
    fontFamily: settings.fontFamily,
    fontSize: `${11 * fontScale}pt`,
    lineHeight: lineHeight,
    color: '#1f2937',
  };

  // Render based on layout
  if (settings.layout === 'sidebar') {
    return (
      <div 
        className="w-full h-full flex overflow-hidden"
        style={baseStyles}
      >
        {/* Sidebar */}
        <div 
          className="w-[240px] h-full p-6 text-white flex-shrink-0"
          style={{ backgroundColor: accentColor }}
        >
          {/* Photo */}
          {template.hasPhoto && data.personalInfo.photo && (
            <div className="w-24 h-24 rounded-full mx-auto mb-5 overflow-hidden border-4 border-white/30 shadow-lg">
              <img 
                src={data.personalInfo.photo} 
                alt={data.personalInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <h1 
            className="text-center mb-1 font-bold"
            style={{ fontSize: `${18 * fontScale}pt` }}
          >
            {data.personalInfo.name}
          </h1>
          <p 
            className="text-center text-white/80 mb-6"
            style={{ fontSize: `${10 * fontScale}pt` }}
          >
            {data.personalInfo.title}
          </p>

          {/* Contact */}
          <div className="mb-6">
            <SidebarSectionTitle>Contact</SidebarSectionTitle>
            <div className="space-y-2 text-white/90" style={{ fontSize: `${9 * fontScale}pt` }}>
              <p>✉ {data.personalInfo.email}</p>
              <p>☎ {data.personalInfo.phone}</p>
              <p>📍 {data.personalInfo.location}</p>
              {data.personalInfo.linkedin && <p>🔗 {data.personalInfo.linkedin}</p>}
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <SidebarSectionTitle>Skills</SidebarSectionTitle>
            <div className="space-y-3">
              {data.skills.map((cat, i) => (
                <div key={i}>
                  <p className="text-white/60 mb-1.5" style={{ fontSize: `${8 * fontScale}pt` }}>{cat.category}</p>
                  <div className="flex flex-wrap gap-1">
                    {cat.items.map((skill, j) => (
                      <span 
                        key={j} 
                        className="px-2 py-0.5 bg-white/15 rounded text-white/90"
                        style={{ fontSize: `${8 * fontScale}pt` }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          {data.languages && data.languages.length > 0 && (
            <div className="mb-6">
              <SidebarSectionTitle>Languages</SidebarSectionTitle>
              <div className="space-y-1.5" style={{ fontSize: `${9 * fontScale}pt` }}>
                {data.languages.map((lang, i) => (
                  <p key={i} className="text-white/90 flex justify-between">
                    <span>{lang.language}</span>
                    <span className="text-white/60">{lang.proficiency}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <div>
              <SidebarSectionTitle>Certifications</SidebarSectionTitle>
              <div className="space-y-2">
                {data.certifications.map((cert) => (
                  <div key={cert.id} style={{ fontSize: `${9 * fontScale}pt` }}>
                    <p className="font-medium text-white/90">{cert.name}</p>
                    <p className="text-white/50" style={{ fontSize: `${8 * fontScale}pt` }}>{cert.issuer} • {cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-hidden">
          {/* Summary */}
          <section style={{ marginBottom: `${sectionGap}px` }}>
            <SectionTitle color={accentColor} fontScale={fontScale}>Professional Summary</SectionTitle>
            <p className="text-gray-700 leading-relaxed" style={{ fontSize: `${10 * fontScale}pt` }}>
              {data.summary}
            </p>
          </section>

          {/* Experience */}
          <section style={{ marginBottom: `${sectionGap}px` }}>
            <SectionTitle color={accentColor} fontScale={fontScale}>Experience</SectionTitle>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900" style={{ fontSize: `${11 * fontScale}pt` }}>{exp.position}</h3>
                  <span className="text-gray-500" style={{ fontSize: `${9 * fontScale}pt` }}>{exp.startDate} — {exp.endDate}</span>
                </div>
                <p className="text-gray-600 font-medium mb-1.5" style={{ fontSize: `${10 * fontScale}pt` }}>{exp.company} | {exp.location}</p>
                <ul className="text-gray-700 space-y-1" style={{ fontSize: `${10 * fontScale}pt` }}>
                  {exp.bullets.slice(0, 3).map((bullet, i) => (
                    <li key={i} className="flex leading-relaxed">
                      <span className="mr-2 text-gray-400">▸</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Education */}
          <section>
            <SectionTitle color={accentColor} fontScale={fontScale}>Education</SectionTitle>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <h3 className="font-bold text-gray-900" style={{ fontSize: `${11 * fontScale}pt` }}>{edu.school}</h3>
                <p className="text-gray-600" style={{ fontSize: `${10 * fontScale}pt` }}>{edu.degree} in {edu.field}</p>
                <p className="text-gray-500" style={{ fontSize: `${9 * fontScale}pt` }}>{edu.startDate} — {edu.endDate} {edu.gpa && `| GPA: ${edu.gpa}`}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    );
  }

  // Single Column Layout (Default)
  return (
    <div 
      className="w-full h-full p-10 overflow-hidden"
      style={baseStyles}
    >
      {/* Header */}
      <div 
        className="text-center pb-5 border-b-2"
        style={{ borderColor: accentColor, marginBottom: `${sectionGap}px` }}
      >
        {template.hasPhoto && data.personalInfo.photo && (
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-2 shadow-md" 
            style={{ borderColor: accentColor }}
          >
            <img 
              src={data.personalInfo.photo} 
              alt={data.personalInfo.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 
          className="font-bold text-gray-900 mb-2"
          style={{ fontSize: `${24 * fontScale}pt` }}
        >
          {data.personalInfo.name}
        </h1>
        <p 
          className="font-semibold mb-3"
          style={{ color: accentColor, fontSize: `${12 * fontScale}pt` }}
        >
          {data.personalInfo.title}
        </p>
        <div 
          className="flex flex-wrap justify-center gap-4 text-gray-600"
          style={{ fontSize: `${9 * fontScale}pt` }}
        >
          <span>✉ {data.personalInfo.email}</span>
          <span>•</span>
          <span>☎ {data.personalInfo.phone}</span>
          <span>•</span>
          <span>📍 {data.personalInfo.location}</span>
          {data.personalInfo.linkedin && (
            <>
              <span>•</span>
              <span>{data.personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      <section style={{ marginBottom: `${sectionGap}px` }}>
        <SectionTitle color={accentColor} fontScale={fontScale}>Professional Summary</SectionTitle>
        <p className="text-gray-700 leading-relaxed" style={{ fontSize: `${10 * fontScale}pt` }}>
          {data.summary}
        </p>
      </section>

      {/* Experience */}
      <section style={{ marginBottom: `${sectionGap}px` }}>
        <SectionTitle color={accentColor} fontScale={fontScale}>Professional Experience</SectionTitle>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-5">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold text-gray-900" style={{ fontSize: `${12 * fontScale}pt` }}>{exp.position}</h3>
              <span className="text-gray-500 font-medium" style={{ fontSize: `${9 * fontScale}pt` }}>{exp.startDate} — {exp.endDate}</span>
            </div>
            <p className="font-semibold text-gray-600 mb-2" style={{ fontSize: `${10 * fontScale}pt` }}>{exp.company} | {exp.location}</p>
            <ul className="text-gray-700 space-y-1.5" style={{ fontSize: `${10 * fontScale}pt` }}>
              {exp.bullets.map((bullet, i) => (
                <li key={i} className="flex leading-relaxed">
                  <span className="mr-2 text-gray-400">▸</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Education */}
      <section style={{ marginBottom: `${sectionGap}px` }}>
        <SectionTitle color={accentColor} fontScale={fontScale}>Education</SectionTitle>
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-3">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-gray-900" style={{ fontSize: `${12 * fontScale}pt` }}>{edu.school}</h3>
              <span className="text-gray-500" style={{ fontSize: `${9 * fontScale}pt` }}>{edu.startDate} — {edu.endDate}</span>
            </div>
            <p className="text-gray-600" style={{ fontSize: `${10 * fontScale}pt` }}>{edu.degree} in {edu.field}</p>
            {edu.gpa && <p className="text-gray-500" style={{ fontSize: `${9 * fontScale}pt` }}>GPA: {edu.gpa}</p>}
          </div>
        ))}
      </section>

      {/* Skills */}
      <section style={{ marginBottom: `${sectionGap}px` }}>
        <SectionTitle color={accentColor} fontScale={fontScale}>Skills</SectionTitle>
        <div className="space-y-2">
          {data.skills.map((cat, i) => (
            <div key={i} className="flex flex-wrap gap-1.5">
              <span className="font-semibold text-gray-700 mr-2" style={{ fontSize: `${10 * fontScale}pt` }}>{cat.category}:</span>
              {cat.items.map((skill, j) => (
                <span 
                  key={j} 
                  className="px-2 py-0.5 rounded text-gray-700"
                  style={{ 
                    backgroundColor: `${accentColor}15`,
                    fontSize: `${9 * fontScale}pt`
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <SectionTitle color={accentColor} fontScale={fontScale}>Certifications</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            {data.certifications.map((cert) => (
              <div key={cert.id} style={{ fontSize: `${10 * fontScale}pt` }}>
                <p className="font-medium text-gray-800">{cert.name}</p>
                <p className="text-gray-500" style={{ fontSize: `${9 * fontScale}pt` }}>{cert.issuer} • {cert.date}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// Helper Components
const SectionTitle = ({ children, color, fontScale }: { children: React.ReactNode; color: string; fontScale: number }) => (
  <h2 
    className="font-bold uppercase tracking-widest mb-3 pb-1 border-b"
    style={{ 
      color, 
      borderColor: color,
      fontSize: `${10 * fontScale}pt`
    }}
  >
    {children}
  </h2>
);

const SidebarSectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-white/70 border-b border-white/20 pb-1">
    {children}
  </h3>
);

export default LiveResumeCanvas;
