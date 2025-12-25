import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Languages, Award, Heart, Briefcase, GraduationCap, Globe, BookOpen, Trophy, Users, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (sectionType: string) => void;
  existingSections: string[];
}

const availableSections = [
  { 
    id: "custom", 
    name: "Custom Section", 
    icon: FileText, 
    description: "Create your own section with custom content",
    preview: "Custom content area"
  },
  { 
    id: "languages", 
    name: "Languages", 
    icon: Languages, 
    description: "Languages you speak and proficiency levels",
    preview: "English (Native) • Spanish (Fluent)"
  },
  { 
    id: "strengths", 
    name: "Strengths", 
    icon: Award, 
    description: "Key professional strengths and qualities",
    preview: "Leadership • Problem Solving • Communication"
  },
  { 
    id: "volunteering", 
    name: "Volunteering", 
    icon: Heart, 
    description: "Volunteer work and community involvement",
    preview: "NGO Coordinator • Community Leader"
  },
  { 
    id: "industry-expertise", 
    name: "Industry Expertise", 
    icon: Briefcase, 
    description: "Domain-specific knowledge and experience",
    preview: "FinTech • Healthcare • E-commerce"
  },
  { 
    id: "certifications", 
    name: "Certifications", 
    icon: GraduationCap, 
    description: "Professional certifications and licenses",
    preview: "AWS Certified • PMP • Scrum Master"
  },
  { 
    id: "awards", 
    name: "Awards", 
    icon: Trophy, 
    description: "Recognition and achievements",
    preview: "Employee of the Year • Innovation Award"
  },
  { 
    id: "publications", 
    name: "Publications", 
    icon: BookOpen, 
    description: "Research papers, articles, and publications",
    preview: "Journal of Tech • IEEE Paper"
  },
  { 
    id: "courses", 
    name: "Courses", 
    icon: GraduationCap, 
    description: "Relevant courses and training programs",
    preview: "Machine Learning • Data Science"
  },
  { 
    id: "interests", 
    name: "Interests", 
    icon: Heart, 
    description: "Personal interests and hobbies",
    preview: "Open Source • Tech Blogging"
  },
  { 
    id: "references", 
    name: "References", 
    icon: Users, 
    description: "Professional references",
    preview: "Available upon request"
  },
  { 
    id: "links", 
    name: "Find Me Online", 
    icon: Link2, 
    description: "Portfolio, GitHub, and social profiles",
    preview: "GitHub • LinkedIn • Portfolio"
  },
];

const AddSectionModal = ({ isOpen, onClose, onAddSection, existingSections }: AddSectionModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[700px] md:max-h-[80vh] bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold">Add Section</h2>
                <p className="text-sm text-muted-foreground">Choose a section to add to your resume</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Section Grid */}
            <div className="p-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableSections.map((section) => {
                  const isAdded = existingSections.includes(section.id);
                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => !isAdded && onAddSection(section.id)}
                      disabled={isAdded}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        isAdded 
                          ? "border-border/30 bg-muted/30 opacity-50 cursor-not-allowed" 
                          : "border-border hover:border-primary/50 hover:bg-secondary/50"
                      }`}
                      whileHover={!isAdded ? { scale: 1.02 } : {}}
                      whileTap={!isAdded ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isAdded ? "bg-muted" : "bg-primary/10"}`}>
                          <section.icon className={`w-4 h-4 ${isAdded ? "text-muted-foreground" : "text-primary"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{section.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{section.description}</p>
                        </div>
                      </div>
                      {/* Mini Preview */}
                      <div className="mt-3 p-2 bg-muted/50 rounded text-[10px] text-muted-foreground truncate">
                        {section.preview}
                      </div>
                      {isAdded && (
                        <span className="text-[10px] text-muted-foreground mt-2 block">Already added</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                All sections are ATS-safe and professionally structured
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddSectionModal;
