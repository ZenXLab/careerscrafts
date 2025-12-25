import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, Loader2, Check, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ResumeData } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";

interface PDFUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtracted: (data: ResumeData) => void;
}

type UploadState = "idle" | "uploading" | "processing" | "success" | "error";

const PDFUploadModal = ({ isOpen, onClose, onExtracted }: PDFUploadModalProps) => {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setState("idle");
    setProgress(0);
    setError(null);
    setFileName(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      setState("error");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      setState("error");
      return;
    }

    setFileName(file.name);
    setState("uploading");
    setProgress(10);

    try {
      // Convert file to base64 for processing
      const reader = new FileReader();
      
      reader.onload = async () => {
        setProgress(30);
        setState("processing");

        try {
          const base64Content = (reader.result as string).split(",")[1];
          
          // Call edge function for OCR and parsing
          setProgress(50);
          
          const { data, error: fnError } = await supabase.functions.invoke("resume-ai", {
            body: {
              action: "parse-pdf",
              pdfContent: base64Content,
              fileName: file.name,
            },
          });

          if (fnError) throw fnError;

          setProgress(80);

          // Process and validate the extracted data
          const extractedData = processExtractedData(data.extractedData);
          
          setProgress(100);
          setState("success");

          // Wait a moment to show success state
          setTimeout(() => {
            onExtracted(extractedData);
            handleClose();
          }, 1500);

        } catch (err) {
          console.error("Processing error:", err);
          setError("Failed to process PDF. Please try again or use manual entry.");
          setState("error");
        }
      };

      reader.onerror = () => {
        setError("Failed to read file");
        setState("error");
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload file");
      setState("error");
    }
  };

  const processExtractedData = (data: any): ResumeData => {
    // Default structure with extracted data
    return {
      personalInfo: {
        name: data?.name || "Your Name",
        title: data?.title || "Professional Title",
        email: data?.email || "email@example.com",
        phone: data?.phone || "",
        location: data?.location || "",
        linkedin: data?.linkedin || "",
        website: data?.website || "",
      },
      summary: data?.summary || "",
      experience: data?.experience || [
        {
          id: "exp-1",
          company: "Company Name",
          position: "Position Title",
          location: "",
          startDate: "",
          endDate: "Present",
          current: true,
          bullets: ["Describe your responsibilities and achievements"],
        },
      ],
      education: data?.education || [
        {
          id: "edu-1",
          school: "University Name",
          degree: "Degree",
          field: "Field of Study",
          location: "",
          startDate: "",
          endDate: "",
        },
      ],
      skills: data?.skills || [
        {
          category: "Technical",
          items: [],
        },
      ],
      certifications: data?.certifications || [],
      projects: data?.projects || [],
      languages: data?.languages || [],
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
      handleFileSelect({ target: { files: dt.files } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Import from PDF</h3>
                  <p className="text-xs text-muted-foreground">
                    Upload your existing resume to edit
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-5">
              {state === "idle" && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium text-foreground mb-1">
                    Drop your PDF here or click to browse
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports PDF files up to 10MB
                  </p>
                  <Button variant="outline" size="sm">
                    Select PDF
                  </Button>
                </div>
              )}

              {(state === "uploading" || state === "processing") && (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <h4 className="font-medium text-foreground mb-1">
                    {state === "uploading" ? "Uploading..." : "Processing with AI..."}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {fileName && `File: ${fileName}`}
                  </p>
                  <Progress value={progress} className="h-2 w-full max-w-xs mx-auto" />
                  <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                    {progress >= 30 && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>PDF uploaded successfully</span>
                      </motion.div>
                    )}
                    {progress >= 50 && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span>Running OCR & text extraction...</span>
                      </motion.div>
                    )}
                    {progress >= 80 && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span>Mapping to resume structure...</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {state === "success" && (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Check className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h4 className="font-medium text-foreground mb-1">
                    Resume Imported Successfully!
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Opening editor with your content...
                  </p>
                </div>
              )}

              {state === "error" && (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  </div>
                  <h4 className="font-medium text-foreground mb-1">
                    Import Failed
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {error || "Something went wrong"}
                  </p>
                  <Button variant="outline" onClick={resetState}>
                    Try Again
                  </Button>
                </div>
              )}
            </div>

            {/* Footer */}
            {state === "idle" && (
              <div className="px-5 pb-5">
                <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">How it works:</strong> Our AI will extract
                    text from your PDF, identify sections like experience, education, and skills,
                    then map them to editable fields. You can review and edit everything after import.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PDFUploadModal;
