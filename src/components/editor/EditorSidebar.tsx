import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  GripVertical, 
  Palette, 
  Sparkles, 
  Shield, 
  Share2, 
  History, 
  FileText,
  Target,
  ChevronRight,
  Wand2,
  FileDown,
  Upload,
  LayoutTemplate,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorSidebarProps {
  onAddSection: () => void;
  onRearrange: () => void;
  onTemplates: () => void;
  onDesign: () => void;
  onImproveText: () => void;
  onAtsCheck: () => void;
  onJdMapping: () => void;
  onShare: () => void;
  onHistory: () => void;
  onAiGenerate: () => void;
  onExportPDF: () => void;
  onPdfUpload: () => void;
  atsScore: number;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const sidebarGroups = [
  {
    label: "AI Generate",
    items: [
      { id: "ai-generate", icon: Wand2, label: "Generate from JD", action: "aiGenerate", highlight: true, primary: true },
      { id: "improve", icon: Sparkles, label: "Improve Text", action: "improve", highlight: true },
    ]
  },
  {
    label: "Import",
    items: [
      { id: "pdf-upload", icon: Upload, label: "Import PDF", action: "pdfUpload" },
    ]
  },
  {
    label: "Sections",
    items: [
      { id: "add-section", icon: Plus, label: "Add Section", action: "addSection" },
      { id: "rearrange", icon: GripVertical, label: "Rearrange", action: "rearrange" },
    ]
  },
  {
    label: "Templates",
    items: [
      { id: "templates", icon: LayoutTemplate, label: "Switch Template", action: "templates" },
    ]
  },
  {
    label: "Design",
    items: [
      { id: "design", icon: Palette, label: "Font & Colors", action: "design" },
    ]
  },
  {
    label: "ATS Check",
    items: [
      { id: "ats", icon: Shield, label: "Run ATS Check", action: "ats" },
      { id: "jd-mapping", icon: Target, label: "JD Mapping", action: "jdMapping", highlight: true },
    ]
  },
  {
    label: "Export",
    items: [
      { id: "export-pdf", icon: FileDown, label: "Export PDF", action: "exportPDF" },
      { id: "share", icon: Share2, label: "Share Link", action: "share" },
    ]
  },
  {
    label: "History",
    items: [
      { id: "history", icon: History, label: "Version History", action: "history" },
    ]
  },
];

const EditorSidebar = ({
  onAddSection,
  onRearrange,
  onTemplates,
  onDesign,
  onImproveText,
  onAtsCheck,
  onJdMapping,
  onShare,
  onHistory,
  onAiGenerate,
  onExportPDF,
  onPdfUpload,
  atsScore,
  collapsed = false,
  onToggleCollapse,
}: EditorSidebarProps) => {
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
      case "share": onShare(); break;
      case "history": onHistory(); break;
    }
  };

  // Collapsed view (icon rail)
  if (collapsed) {
    return (
      <aside className="w-14 border-r border-border/50 bg-card/30 flex flex-col h-full py-2">
        <Button
          variant="ghost"
          size="icon"
          className="mx-auto mb-2"
          onClick={onToggleCollapse}
        >
          <Menu className="w-4 h-4" />
        </Button>
        <div className="flex-1 flex flex-col items-center gap-1 overflow-y-auto">
          {sidebarGroups.flatMap(group => group.items).slice(0, 8).map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleAction(item.action)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                (item as any).primary
                  ? "bg-primary/10 text-primary"
                  : item.highlight 
                    ? "text-primary hover:bg-primary/10" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={item.label}
            >
              <item.icon className="w-4 h-4" />
            </motion.button>
          ))}
        </div>
        {/* Mini ATS Score */}
        <div className="mx-auto mt-2 p-2">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
              atsScore >= 90 ? "bg-emerald-500/20 text-emerald-500" :
              atsScore >= 70 ? "bg-yellow-500/20 text-yellow-500" :
              "bg-red-500/20 text-red-500"
            }`}
          >
            {atsScore}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-56 lg:w-64 border-r border-border/50 bg-card/30 flex flex-col h-full">
      {/* Header with collapse button */}
      <div className="p-3 border-b border-border/50 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Command Panel
        </span>
        {onToggleCollapse && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onToggleCollapse}>
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Command Groups */}
      <div className="flex-1 overflow-y-auto p-2">
        {sidebarGroups.map((group, groupIdx) => (
          <div key={group.label} className={groupIdx > 0 ? "mt-4" : ""}>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1 px-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleAction(item.action)}
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-all group ${
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
                  <span className="flex-1 text-left text-xs">{item.label}</span>
                  {item.highlight && !(item as any).primary && (
                    <span className="text-[8px] px-1 py-0.5 bg-primary/20 text-primary rounded">
                      AI
                    </span>
                  )}
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ATS Score Panel */}
      <div className="p-3 border-t border-border/50">
        <div className="bg-card rounded-lg p-3 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              ATS Score
            </span>
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <motion.span 
              className="text-2xl font-semibold text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={atsScore}
            >
              {atsScore}
            </motion.span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
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
          <p className="text-[10px] text-muted-foreground mt-1.5">
            {atsScore >= 90 ? "Excellent!" :
             atsScore >= 70 ? "Good, could improve" :
             "Needs work"}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default EditorSidebar;
