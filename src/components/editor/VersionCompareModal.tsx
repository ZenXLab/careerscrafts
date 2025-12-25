import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GitCompare, Plus, Minus, RefreshCw, Clock, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeVersion } from "@/hooks/useResumeVersions";
import { ResumeData } from "@/types/resume";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VersionCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: ResumeVersion[];
  currentData: ResumeData;
  onSaveVersion: (data: ResumeData, atsScore?: number, label?: string) => void;
  onLoadVersion: (versionId: string) => ResumeData | null;
  onRestoreVersion: (data: ResumeData) => void;
  onDeleteVersion: (versionId: string) => void;
  compareVersions: (versionA: string, versionB: string) => { added: string[]; removed: string[]; changed: string[] } | null;
  atsScore?: number;
}

export const VersionCompareModal = ({
  isOpen,
  onClose,
  versions,
  currentData,
  onSaveVersion,
  onLoadVersion,
  onRestoreVersion,
  onDeleteVersion,
  compareVersions,
  atsScore,
}: VersionCompareModalProps) => {
  const [selectedVersionA, setSelectedVersionA] = useState<string>("");
  const [selectedVersionB, setSelectedVersionB] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "compare">("list");

  const comparison = useMemo(() => {
    if (!selectedVersionA || !selectedVersionB) return null;
    return compareVersions(selectedVersionA, selectedVersionB);
  }, [selectedVersionA, selectedVersionB, compareVersions]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card border border-border rounded-xl w-full max-w-3xl max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <GitCompare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Resume Versions</h2>
                <p className="text-xs text-muted-foreground">
                  {versions.length} saved version{versions.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSaveVersion(currentData, atsScore)}
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save Current
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                History
              </Button>
              <Button
                variant={viewMode === "compare" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("compare")}
                disabled={versions.length < 2}
              >
                <GitCompare className="w-3.5 h-3.5 mr-1.5" />
                Compare
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[60vh]">
            {viewMode === "list" && (
              <div className="space-y-2">
                {versions.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">No saved versions yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Click "Save Current" to create your first version
                    </p>
                  </div>
                ) : (
                  versions.slice().reverse().map((version) => (
                    <motion.div
                      key={version.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg border border-border bg-background/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                            v{version.version}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{version.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(version.createdAt)}
                              {version.atsScore && (
                                <span className="ml-2 text-primary">
                                  ATS: {version.atsScore}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const data = onLoadVersion(version.id);
                              if (data) onRestoreVersion(data);
                              onClose();
                            }}
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Restore
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => onDeleteVersion(version.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {viewMode === "compare" && (
              <div className="space-y-4">
                {/* Version Selectors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Compare Version
                    </label>
                    <Select value={selectedVersionA} onValueChange={setSelectedVersionA}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        {versions.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            v{v.version} - {v.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      With Version
                    </label>
                    <Select value={selectedVersionB} onValueChange={setSelectedVersionB}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        {versions.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            v{v.version} - {v.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Comparison Results */}
                {comparison && (
                  <div className="space-y-4 mt-6">
                    {comparison.added.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-emerald-600 flex items-center gap-2 mb-2">
                          <Plus className="w-4 h-4" />
                          Added ({comparison.added.length})
                        </h4>
                        <div className="space-y-1">
                          {comparison.added.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs p-2 bg-emerald-500/10 border border-emerald-500/20 rounded"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {comparison.removed.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-red-600 flex items-center gap-2 mb-2">
                          <Minus className="w-4 h-4" />
                          Removed ({comparison.removed.length})
                        </h4>
                        <div className="space-y-1">
                          {comparison.removed.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs p-2 bg-red-500/10 border border-red-500/20 rounded"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {comparison.changed.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-yellow-600 flex items-center gap-2 mb-2">
                          <RefreshCw className="w-4 h-4" />
                          Changed ({comparison.changed.length})
                        </h4>
                        <div className="space-y-1">
                          {comparison.changed.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs p-2 bg-yellow-500/10 border border-yellow-500/20 rounded"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {comparison.added.length === 0 && comparison.removed.length === 0 && comparison.changed.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No differences found between these versions
                      </div>
                    )}
                  </div>
                )}

                {!comparison && selectedVersionA && selectedVersionB && (
                  <div className="text-center py-8 text-muted-foreground">
                    Select two different versions to compare
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VersionCompareModal;
