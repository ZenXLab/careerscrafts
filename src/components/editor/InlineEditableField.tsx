import { useState, useRef, useEffect, KeyboardEvent, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Wand2, Target, Type, Check, Loader2 } from "lucide-react";
import { useAITextImprovement, AIAction } from "@/hooks/useAITextImprovement";

// Common spelling mistakes and suggestions
const commonMisspellings: Record<string, string> = {
  "recieve": "receive",
  "acheive": "achieve",
  "managment": "management",
  "developement": "development",
  "occured": "occurred",
  "seperate": "separate",
  "definately": "definitely",
  "accomodate": "accommodate",
  "occurence": "occurrence",
  "proffesional": "professional",
  "responsability": "responsibility",
  "successfull": "successful",
  "enviroment": "environment",
  "beleive": "believe",
  "excercise": "exercise",
  "refered": "referred",
  "liason": "liaison",
  "maintainance": "maintenance",
  "occassion": "occasion",
  "priviledge": "privilege",
};

interface SpellIssue {
  word: string;
  start: number;
  end: number;
  suggestion: string;
  type: "spelling" | "grammar";
}

interface InlineEditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  fieldType: "text" | "textarea" | "bullet";
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  role?: string;
  multiline?: boolean;
  maxLength?: number;
  enableSpellCheck?: boolean;
}

export const InlineEditableField = ({
  value,
  onChange,
  fieldType,
  placeholder = "Click to edit",
  className = "",
  style,
  role = "Professional",
  multiline = false,
  maxLength,
  enableSpellCheck = true,
}: InlineEditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [aiPreview, setAiPreview] = useState<string | null>(null);
  const [hoveredIssue, setHoveredIssue] = useState<SpellIssue | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [aiMenuPosition, setAiMenuPosition] = useState({ x: 0, y: 0 });
  const editRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { improveText, isLoading, clearPreview } = useAITextImprovement({
    role,
    onSuccess: (improvedText) => {
      setAiPreview(improvedText);
    },
  });

  // Detect spelling issues
  const issues = useMemo(() => {
    if (!enableSpellCheck || !localValue) return [];
    
    const detectedIssues: SpellIssue[] = [];
    const words = localValue.split(/(\s+)/);
    let currentIndex = 0;

    words.forEach((word) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?;:'"]/g, "");
      if (commonMisspellings[cleanWord]) {
        detectedIssues.push({
          word: cleanWord,
          start: currentIndex,
          end: currentIndex + word.length,
          suggestion: commonMisspellings[cleanWord],
          type: "spelling",
        });
      }
      currentIndex += word.length;
    });

    return detectedIssues;
  }, [localValue, enableSpellCheck]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  // Calculate safe position within viewport
  const calculateSafePosition = useCallback((elementRect: DOMRect, tooltipWidth: number, tooltipHeight: number) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 16;

    let x = elementRect.left;
    let y = elementRect.bottom + 8;

    // Ensure tooltip stays within viewport horizontally (prefer left-to-right)
    if (x + tooltipWidth > viewportWidth - padding) {
      x = Math.max(padding, viewportWidth - tooltipWidth - padding);
    }
    if (x < padding) {
      x = padding;
    }

    // If tooltip would go below viewport, show above
    if (y + tooltipHeight > viewportHeight - padding) {
      y = elementRect.top - tooltipHeight - 8;
    }

    return { x, y };
  }, []);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setLocalValue(value);
      setIsEditing(false);
      setShowAiMenu(false);
      setAiPreview(null);
    }
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Enter" && multiline && e.shiftKey) {
      // Allow shift+enter for new line
    } else if (e.key === "Enter" && multiline && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Tab") {
      e.preventDefault();
    }
    if (e.key === "Backspace" && fieldType === "bullet" && !localValue) {
      e.preventDefault();
    }
  };

  const handleInput = () => {
    if (editRef.current) {
      let newValue = editRef.current.innerText;
      if (maxLength && newValue.length > maxLength) {
        newValue = newValue.slice(0, maxLength);
        editRef.current.innerText = newValue;
      }
      setLocalValue(newValue);
    }
  };

  const handleTextSelect = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 3) {
      setSelectedText(selection.toString());
      
      // Position AI menu near selection
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const safePos = calculateSafePosition(rect, 280, 50);
      setAiMenuPosition({ x: safePos.x, y: rect.top - 50 });
      setShowAiMenu(true);
    } else if (!isLoading && !aiPreview) {
      setShowAiMenu(false);
      setSelectedText("");
    }
  };

  const handleAiAction = async (action: AIAction) => {
    const textToImprove = selectedText || localValue;
    if (!textToImprove) return;
    await improveText(action, textToImprove);
  };

  const acceptAiSuggestion = () => {
    if (aiPreview) {
      if (selectedText) {
        const newValue = localValue.replace(selectedText, aiPreview);
        setLocalValue(newValue);
        onChange(newValue);
        if (editRef.current) {
          editRef.current.innerText = newValue;
        }
      } else {
        setLocalValue(aiPreview);
        onChange(aiPreview);
        if (editRef.current) {
          editRef.current.innerText = aiPreview;
        }
      }
      setAiPreview(null);
      setShowAiMenu(false);
      clearPreview();
    }
  };

  const rejectAiSuggestion = () => {
    setAiPreview(null);
    setShowAiMenu(false);
    clearPreview();
  };

  const applySpellFix = (issue: SpellIssue) => {
    const newValue = localValue.slice(0, issue.start) + issue.suggestion + localValue.slice(issue.end);
    setLocalValue(newValue);
    onChange(newValue);
    if (editRef.current) {
      editRef.current.innerText = newValue;
    }
    setHoveredIssue(null);
  };

  const handleIssueHover = (issue: SpellIssue, e: React.MouseEvent) => {
    setHoveredIssue(issue);
    const rect = e.currentTarget.getBoundingClientRect();
    const safePos = calculateSafePosition(rect, 220, 40);
    setTooltipPosition(safePos);
  };

  // Render text with underlines for issues
  const renderTextWithIssues = () => {
    if (!enableSpellCheck || issues.length === 0 || isEditing) {
      return localValue || placeholder;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    issues.forEach((issue, idx) => {
      if (issue.start > lastIndex) {
        parts.push(localValue.slice(lastIndex, issue.start));
      }

      const issueWord = localValue.slice(issue.start, issue.end);
      parts.push(
        <span
          key={idx}
          className={`relative cursor-pointer ${
            issue.type === "spelling" 
              ? "underline decoration-wavy decoration-red-400 underline-offset-2" 
              : "underline decoration-dotted decoration-amber-400 underline-offset-2"
          }`}
          onMouseEnter={(e) => handleIssueHover(issue, e)}
          onMouseLeave={() => setHoveredIssue(null)}
          onClick={(e) => {
            e.stopPropagation();
            applySpellFix(issue);
          }}
        >
          {issueWord}
        </span>
      );

      lastIndex = issue.end;
    });

    if (lastIndex < localValue.length) {
      parts.push(localValue.slice(lastIndex));
    }

    return parts.length > 0 ? parts : (localValue || placeholder);
  };

  return (
    <div ref={containerRef} className="relative inline-block w-full group text-left" dir="ltr" style={style}>
      {/* Display layer */}
      {!isEditing && (
        <div
          onClick={handleClick}
          className={`
            outline-none transition-all duration-150 cursor-text text-left
            hover:bg-blue-50/30 rounded px-1 -mx-1
            ${!localValue ? "text-muted-foreground italic" : ""}
            ${className}
          `}
          style={{ minHeight: multiline ? "3em" : "1.2em", direction: "ltr" }}
        >
          {renderTextWithIssues()}
        </div>
      )}

      {/* Editable layer */}
      {isEditing && (
        <div
          ref={editRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onMouseUp={handleTextSelect}
          dir="ltr"
          className={`
            outline-none transition-all duration-150 cursor-text text-left
            bg-blue-50/50 ring-1 ring-blue-200 rounded px-1 -mx-1
            ${!localValue ? "text-muted-foreground italic" : ""}
            ${className}
          `}
          style={{ minHeight: multiline ? "3em" : "1.2em", direction: "ltr", unicodeBidi: "plaintext" }}
        >
          {localValue || placeholder}
        </div>
      )}

      {/* Spell/Grammar Suggestion Tooltip - Fixed positioning with bounds check */}
      <AnimatePresence>
        {hoveredIssue && !isEditing && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="fixed z-[100] bg-background border border-border rounded-lg shadow-xl p-2.5 text-xs max-w-[220px]"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
            }}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`w-2 h-2 rounded-full shrink-0 ${hoveredIssue.type === "spelling" ? "bg-red-400" : "bg-amber-400"}`} />
              <span className="text-muted-foreground">
                {hoveredIssue.type === "spelling" ? "Spelling:" : "Grammar:"}
              </span>
              <span className="font-medium text-foreground">{hoveredIssue.suggestion}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  applySpellFix(hoveredIssue);
                }}
                className="ml-auto px-2 py-0.5 bg-primary text-primary-foreground rounded text-[10px] hover:bg-primary/90 transition-colors"
              >
                Fix
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Preview Banner - Positioned below with proper alignment */}
      <AnimatePresence>
        {aiPreview && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            className="absolute left-0 top-full mt-2 z-[100] w-full min-w-[280px] max-w-md"
          >
            <div className="bg-background border border-primary/20 rounded-lg shadow-xl p-3">
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 text-left">
                  <p className="text-xs text-muted-foreground mb-1">AI Suggestion:</p>
                  <p className="text-sm text-foreground leading-relaxed">{aiPreview}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={rejectAiSuggestion}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                >
                  <X className="w-3 h-3" />
                  Reject
                </button>
                <button
                  onClick={acceptAiSuggestion}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors"
                >
                  <Check className="w-3 h-3" />
                  Accept
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Enhancement Menu - Fixed position near selection */}
      <AnimatePresence>
        {showAiMenu && !aiPreview && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="fixed z-[100]"
            style={{
              left: `${Math.max(16, aiMenuPosition.x)}px`,
              top: `${Math.max(16, aiMenuPosition.y)}px`,
            }}
          >
            <div className="bg-background border border-border rounded-lg shadow-xl p-1 flex items-center gap-0.5">
              {isLoading ? (
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Improving...</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleAiAction("improve")}
                    className="flex items-center gap-1 px-2 py-1.5 text-xs hover:bg-primary/10 hover:text-primary rounded transition-colors"
                    title="Improve wording"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Improve</span>
                  </button>
                  <button
                    onClick={() => handleAiAction("quantify")}
                    className="flex items-center gap-1 px-2 py-1.5 text-xs hover:bg-primary/10 hover:text-primary rounded transition-colors"
                    title="Add metrics"
                  >
                    <Target className="w-3 h-3" />
                    <span>Quantify</span>
                  </button>
                  <button
                    onClick={() => handleAiAction("fix")}
                    className="flex items-center gap-1 px-2 py-1.5 text-xs hover:bg-primary/10 hover:text-primary rounded transition-colors"
                    title="Fix grammar"
                  >
                    <Type className="w-3 h-3" />
                    <span>Fix</span>
                  </button>
                  <button
                    onClick={() => handleAiAction("shorten")}
                    className="flex items-center gap-1 px-2 py-1.5 text-xs hover:bg-primary/10 hover:text-primary rounded transition-colors"
                    title="Make concise"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Shorten</span>
                  </button>
                  <div className="w-px h-5 bg-border mx-1" />
                  <button
                    onClick={() => setShowAiMenu(false)}
                    className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InlineEditableField;
