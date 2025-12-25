import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Trash2, GripVertical, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResumeData } from "@/types/resume";

interface EditorFormPanelProps {
  data: ResumeData;
  activeSection: string;
  onDataChange: (data: ResumeData) => void;
  onAiImprove?: (field: string, content: string) => void;
}

const EditorFormPanel = ({ data, activeSection, onDataChange, onAiImprove }: EditorFormPanelProps) => {
  const [expandedExperience, setExpandedExperience] = useState<string | null>(data.experience[0]?.id || null);
  const [expandedEducation, setExpandedEducation] = useState<string | null>(data.education[0]?.id || null);

  const updatePersonalInfo = (field: string, value: string) => {
    onDataChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const updateSummary = (value: string) => {
    onDataChange({ ...data, summary: value });
  };

  const updateExperience = (id: string, field: string, value: string | string[]) => {
    onDataChange({
      ...data,
      experience: data.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const addExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""]
    };
    onDataChange({ ...data, experience: [...data.experience, newExp] });
    setExpandedExperience(newExp.id);
  };

  const removeExperience = (id: string) => {
    onDataChange({
      ...data,
      experience: data.experience.filter(exp => exp.id !== id)
    });
  };

  const addBullet = (expId: string) => {
    onDataChange({
      ...data,
      experience: data.experience.map(exp => 
        exp.id === expId ? { ...exp, bullets: [...exp.bullets, ""] } : exp
      )
    });
  };

  const updateBullet = (expId: string, bulletIndex: number, value: string) => {
    onDataChange({
      ...data,
      experience: data.experience.map(exp => 
        exp.id === expId 
          ? { ...exp, bullets: exp.bullets.map((b, i) => i === bulletIndex ? value : b) }
          : exp
      )
    });
  };

  const removeBullet = (expId: string, bulletIndex: number) => {
    onDataChange({
      ...data,
      experience: data.experience.map(exp => 
        exp.id === expId 
          ? { ...exp, bullets: exp.bullets.filter((_, i) => i !== bulletIndex) }
          : exp
      )
    });
  };

  return (
    <div className="w-[420px] border-r border-border/50 bg-card/30 overflow-y-auto">
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Personal Info */}
            {activeSection === "personal" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  Personal Information
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground mb-1.5 block">Full Name</label>
                    <Input 
                      value={data.personalInfo.name}
                      onChange={(e) => updatePersonalInfo("name", e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground mb-1.5 block">Job Title</label>
                    <Input 
                      value={data.personalInfo.title}
                      onChange={(e) => updatePersonalInfo("title", e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
                    <Input 
                      type="email"
                      value={data.personalInfo.email}
                      onChange={(e) => updatePersonalInfo("email", e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Phone</label>
                    <Input 
                      type="tel"
                      value={data.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground mb-1.5 block">Location</label>
                    <Input 
                      value={data.personalInfo.location}
                      onChange={(e) => updatePersonalInfo("location", e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">LinkedIn</label>
                    <Input 
                      value={data.personalInfo.linkedin || ""}
                      onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/yourname"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Website</label>
                    <Input 
                      value={data.personalInfo.website || ""}
                      onChange={(e) => updatePersonalInfo("website", e.target.value)}
                      placeholder="yourwebsite.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            {activeSection === "summary" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Professional Summary</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-primary"
                    onClick={() => onAiImprove?.("summary", data.summary)}
                  >
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    Improve
                  </Button>
                </div>
                <Textarea 
                  value={data.summary}
                  onChange={(e) => updateSummary(e.target.value)}
                  rows={6}
                  className="resize-none"
                  placeholder="Write a compelling summary of your professional background..."
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{data.summary.length} characters</span>
                  <span>Recommended: 150-300 characters</span>
                </div>
              </div>
            )}

            {/* Experience */}
            {activeSection === "experience" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Work Experience</h2>
                  <Button variant="ghost" size="sm" onClick={addExperience}>
                    <Plus className="w-3 h-3 mr-1.5" />
                    Add Role
                  </Button>
                </div>
                <div className="space-y-3">
                  {data.experience.map((exp, idx) => (
                    <div 
                      key={exp.id} 
                      className="border border-border rounded-lg overflow-hidden bg-background/50"
                    >
                      <button
                        onClick={() => setExpandedExperience(expandedExperience === exp.id ? null : exp.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                      >
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">
                            {exp.position || "New Position"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {exp.company || "Company"} • {exp.startDate || "Start"} - {exp.current ? "Present" : exp.endDate || "End"}
                          </p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${
                          expandedExperience === exp.id ? "rotate-180" : ""
                        }`} />
                      </button>
                      
                      <AnimatePresence>
                        {expandedExperience === exp.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-border"
                          >
                            <div className="p-3 space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                  <label className="text-xs text-muted-foreground mb-1 block">Position</label>
                                  <Input 
                                    value={exp.position}
                                    onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                                    placeholder="Job Title"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <label className="text-xs text-muted-foreground mb-1 block">Company</label>
                                  <Input 
                                    value={exp.company}
                                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                                    placeholder="Company Name"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-muted-foreground mb-1 block">Start Date</label>
                                  <Input 
                                    value={exp.startDate}
                                    onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                                    placeholder="Jan 2020"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-muted-foreground mb-1 block">End Date</label>
                                  <Input 
                                    value={exp.current ? "Present" : exp.endDate}
                                    onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                    placeholder="Present"
                                    disabled={exp.current}
                                  />
                                </div>
                              </div>

                              {/* Bullets */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="text-xs text-muted-foreground">Achievements</label>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-6 text-xs text-primary"
                                    onClick={() => onAiImprove?.(`experience.${exp.id}`, exp.bullets.join("\n"))}
                                  >
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Improve All
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  {exp.bullets.map((bullet, bulletIdx) => (
                                    <div key={bulletIdx} className="flex items-start gap-2">
                                      <span className="text-muted-foreground mt-2.5 text-sm">•</span>
                                      <Textarea 
                                        value={bullet}
                                        onChange={(e) => updateBullet(exp.id, bulletIdx, e.target.value)}
                                        placeholder="Describe your achievement with impact..."
                                        rows={2}
                                        className="flex-1 text-sm resize-none"
                                      />
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeBullet(exp.id, bulletIdx)}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="mt-2 w-full text-muted-foreground"
                                  onClick={() => addBullet(exp.id)}
                                >
                                  <Plus className="w-3 h-3 mr-1.5" />
                                  Add Achievement
                                </Button>
                              </div>

                              {/* Remove Experience */}
                              {data.experience.length > 1 && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => removeExperience(exp.id)}
                                >
                                  <Trash2 className="w-3 h-3 mr-1.5" />
                                  Remove Position
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {activeSection === "education" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Education</h2>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-3 h-3 mr-1.5" />
                    Add Education
                  </Button>
                </div>
                {data.education.map((edu) => (
                  <div key={edu.id} className="p-4 border border-border rounded-lg bg-background/50 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="text-xs text-muted-foreground mb-1 block">School/University</label>
                        <Input value={edu.school} placeholder="University Name" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Degree</label>
                        <Input value={edu.degree} placeholder="Bachelor's" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Field of Study</label>
                        <Input value={edu.field} placeholder="Computer Science" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Start Year</label>
                        <Input value={edu.startDate} placeholder="2016" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">End Year</label>
                        <Input value={edu.endDate} placeholder="2020" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {activeSection === "skills" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Skills</h2>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-3 h-3 mr-1.5" />
                    Add Category
                  </Button>
                </div>
                {data.skills.map((category, idx) => (
                  <div key={idx} className="p-4 border border-border rounded-lg bg-background/50">
                    <div className="mb-3">
                      <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                      <Input value={category.category} placeholder="Technical Skills" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {category.items.map((skill, skillIdx) => (
                          <span 
                            key={skillIdx}
                            className="px-3 py-1.5 bg-secondary text-sm rounded-full flex items-center gap-2"
                          >
                            {skill}
                            <button className="text-muted-foreground hover:text-foreground">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        <button className="px-3 py-1.5 border border-dashed border-border rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                          + Add Skill
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// X icon for skills
const X = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export default EditorFormPanel;
