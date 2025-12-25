import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { templates, getTemplateById } from "@/data/templates";
import { ResumeData } from "@/types/resume";
import { getResumeForTemplate } from "@/data/resumeProfiles";
import TemplatePreview from "@/components/TemplatePreview";
import { useToast } from "@/hooks/use-toast";
const Editor = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template") || "modern-minimal";
  const template = getTemplateById(templateId) || templates[0];
  const { toast } = useToast();
  
  const [resumeData, setResumeData] = useState<ResumeData>(getResumeForTemplate(templateId));
  const [atsScore, setAtsScore] = useState(82);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (atsScore < 94) setAtsScore(prev => Math.min(prev + 1, 94));
    }, 2000);
    return () => clearTimeout(timer);
  }, [resumeData, atsScore]);

  const handleExport = () => {
    toast({ title: "Export ready", description: "Your resume is ready for download." });
  };
  const [activeSection, setActiveSection] = useState<string>("personal");

  const sections = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "summary", label: "Summary", icon: "📝" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "skills", label: "Skills", icon: "⚡" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center px-4 gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-primary" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <span className="font-medium text-sm">CareersCraft</span>
        </Link>
        
        <div className="h-6 w-px bg-border mx-2" />
        
        <span className="text-sm text-muted-foreground">Editing: <span className="text-foreground">{template.name}</span></span>
        
        <div className="ml-auto flex items-center gap-2">
          <Link to="/templates">
            <Button variant="ghost" size="sm">Templates</Button>
          </Link>
          <Button variant="hero" size="sm">Download PDF</Button>
        </div>
      </header>

      {/* Main Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Sections */}
        <aside className="w-56 border-r border-border/50 bg-card/30 p-3 overflow-y-auto">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3 px-2">Sections</p>
          <div className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeSection === section.id 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3 px-2">ATS Score</p>
            <div className="bg-card rounded-lg p-3 border border-border/50">
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-semibold text-foreground">92</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald rounded-full" style={{ width: "92%" }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Excellent! Your resume passes ATS checks.</p>
            </div>
          </div>
        </aside>

        {/* Center - Form */}
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            {activeSection === "personal" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
                    <input 
                      type="text" 
                      value={resumeData.personalInfo.name}
                      onChange={(e) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, name: e.target.value}})}
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Job Title</label>
                    <input 
                      type="text" 
                      value={resumeData.personalInfo.title}
                      onChange={(e) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, title: e.target.value}})}
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                    <input 
                      type="email" 
                      value={resumeData.personalInfo.email}
                      onChange={(e) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, email: e.target.value}})}
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Phone</label>
                    <input 
                      type="tel" 
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, phone: e.target.value}})}
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-muted-foreground mb-1.5 block">Location</label>
                    <input 
                      type="text" 
                      value={resumeData.personalInfo.location}
                      onChange={(e) => setResumeData({...resumeData, personalInfo: {...resumeData.personalInfo, location: e.target.value}})}
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === "summary" && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Professional Summary</h2>
                <textarea 
                  value={resumeData.summary}
                  onChange={(e) => setResumeData({...resumeData, summary: e.target.value})}
                  rows={5}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Write a compelling summary of your professional background..."
                />
                <p className="text-xs text-muted-foreground mt-2">{resumeData.summary.length} / 500 characters recommended</p>
              </div>
            )}

            {activeSection === "experience" && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Work Experience</h2>
                {resumeData.experience.map((exp, idx) => (
                  <div key={exp.id} className="mb-6 p-4 bg-card rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">{exp.position} at {exp.company}</span>
                      <span className="text-xs text-muted-foreground">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {exp.bullets.slice(0, 2).map((b, i) => (
                        <li key={i} className="flex gap-2"><span>•</span>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {activeSection === "education" && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Education</h2>
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="mb-4 p-4 bg-card rounded-lg border border-border/50">
                    <p className="font-medium">{edu.school}</p>
                    <p className="text-sm text-muted-foreground">{edu.degree} in {edu.field}</p>
                    <p className="text-xs text-muted-foreground mt-1">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            )}

            {activeSection === "skills" && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Skills</h2>
                {resumeData.skills.map((cat, idx) => (
                  <div key={idx} className="mb-4">
                    <p className="text-sm font-medium mb-2">{cat.category}</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-secondary text-sm rounded-full">{skill}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </main>

        {/* Right - Live Preview */}
        <aside className="w-[380px] border-l border-border/50 bg-muted/30 p-4 overflow-y-auto flex items-start justify-center">
          <div className="sticky top-4">
            <TemplatePreview template={template} data={resumeData} scale={0.42} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Editor;
