import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  GripVertical, 
  Palette, 
  Sparkles, 
  Shield, 
  Download, 
  Share2, 
  History, 
  FileText,
  Briefcase,
  Target,
  ChevronRight,
  Wand2,
  FileDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onAddSection: () => void;
  onRearrange: () => void;
  onTemplates: () => void;
  onDesign: () => void;
  onImproveText: () => void;
  onAtsCheck: () => void;
  onJdMapping: () => void;
  onDownload: () => void;
  onShare: () => void;
  onHistory: () => void;
  onAiGenerate: () => void;
  onExportPDF: () => void;
  onPdfUpload: () => void;
  atsScore: number;
}

const sidebarItems = [
  { id: "ai-generate", icon: Wand2, label: "AI Generate Resume", action: "aiGenerate", highlight: true, primary: true },
  { id: "pdf-upload", icon: FileText, label: "Import PDF", action: "pdfUpload" },
  { id: "add-section", icon: Plus, label: "Add Section", action: "addSection" },
  { id: "rearrange", icon: GripVertical, label: "Rearrange Sections", action: "rearrange" },
  { id: "templates", icon: FileText, label: "Templates", action: "templates" },
  { id: "design", icon: Palette, label: "Design & Font", action: "design" },
  { id: "improve", icon: Sparkles, label: "Improve Text (AI)", action: "improve", highlight: true },
  { id: "ats", icon: Shield, label: "ATS Check", action: "ats" },
  { id: "jd-mapping", icon: Target, label: "JD Mapping", action: "jdMapping", highlight: true },
  { id: "export-pdf", icon: FileDown, label: "Export PDF", action: "exportPDF" },
  { id: "share", icon: Share2, label: "Share", action: "share" },
  { id: "history", icon: History, label: "History", action: "history" },
];

const EditorSidebar = ({
  activeSection,
  onSectionChange,
  onAddSection,
  onRearrange,
  onTemplates,
  onDesign,
  onImproveText,
  onAtsCheck,
  onJdMapping,
  onDownload,
  onShare,
  onHistory,
  onAiGenerate,
  onExportPDF,
  onPdfUpload,
  atsScore
}: EditorSidebarProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleAction = (action: string) => {
    switch (action) {
      case "aiGenerate": onAiGenerate(); break;
      case "pdfUpload": onPdfUpload(); break;
      case "exportPDF": onExportPDF(); break;
      case "addSection": onAddSection(); break;
      case "rearrange": onRearrange(); break;
      case "templates": onTemplates(); break;
      case "design": onDesign(); break;
      case "improve": onImproveText(); break;
      case "ats": onAtsCheck(); break;
      case "jdMapping": onJdMapping(); break;
      case "download": onDownload(); break;
      case "share": onShare(); break;
      case "history": onHistory(); break;
    }
  };

  return (
    <aside className="w-60 border-r border-border/50 bg-card/30 flex flex-col h-full">
      {/* Command Panel */}
      <div className="p-3 flex-1 overflow-y-auto">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3 px-2">
          Command Panel
        </p>
        <div className="space-y-0.5">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleAction(item.action)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group ${
                (item as any).primary
                  ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                  : item.highlight 
                    ? "text-primary hover:bg-primary/10" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.highlight && !(item as any).primary && (
                <span className="text-[9px] px-1.5 py-0.5 bg-primary/20 text-primary rounded-full">
                  AI
                </span>
              )}
              <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity`} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* ATS Score Panel */}
      <div className="p-3 border-t border-border/50">
        <div className="bg-card rounded-lg p-4 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              ATS Score
            </span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <motion.span 
              className="text-3xl font-semibold text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={atsScore}
            >
              {atsScore}
            </motion.span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${
                atsScore >= 90 ? "bg-emerald-500" :
                atsScore >= 70 ? "bg-yellow-500" :
                "bg-red-500"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${atsScore}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {atsScore >= 90 ? "Excellent! Your resume passes ATS checks." :
             atsScore >= 70 ? "Good, but could be improved." :
             "Needs improvement for ATS compatibility."}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default EditorSidebar;
