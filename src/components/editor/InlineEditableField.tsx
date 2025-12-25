import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Wand2, Target, Type, Check, Loader2 } from "lucide-react";
import { useAITextImprovement, AIAction } from "@/hooks/useAITextImprovement";

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
}: InlineEditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [aiPreview, setAiPreview] = useState<string | null>(null);
  const editRef = useRef<HTMLDivElement>(null);

  const { improveText, isLoading, clearPreview } = useAITextImprovement({
    role,
    onSuccess: (improvedText) => {
      setAiPreview(improvedText);
    },
  });

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
    // Handle Tab for indentation (future feature)
    if (e.key === "Tab") {
      e.preventDefault();
    }
    // Handle backspace on empty bullet
    if (e.key === "Backspace" && fieldType === "bullet" && !localValue) {
      e.preventDefault();
      // Could trigger bullet removal here via callback
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

  return (
    <div className="relative inline-block w-full" style={style}>
      {/* Editable Content */}
      <div
        ref={editRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onClick={handleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onMouseUp={handleTextSelect}
        className={`
          outline-none transition-all duration-150 cursor-text
          ${isEditing 
            ? "bg-blue-50/50 ring-1 ring-blue-200 rounded px-1 -mx-1" 
            : "hover:bg-blue-50/30 rounded px-1 -mx-1"
          }
          ${!localValue && !isEditing ? "text-gray-400 italic" : ""}
          ${className}
        `}
        style={{ minHeight: multiline ? "3em" : "1.2em" }}
      >
        {isEditing ? localValue : localValue || placeholder}
      </div>

      {/* AI Preview Banner */}
      <AnimatePresence>
        {aiPreview && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            className="absolute left-0 right-0 top-full mt-2 z-50"
          >
            <div className="bg-white border border-blue-200 rounded-lg shadow-xl p-3">
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">AI Suggestion:</p>
                  <p className="text-sm text-gray-800 leading-relaxed">{aiPreview}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={rejectAiSuggestion}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-3 h-3" />
                  Reject
                </button>
                <button
                  onClick={acceptAiSuggestion}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded transition-colors"
                >
                  <Check className="w-3 h-3" />
                  Accept
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Enhancement Menu */}
      <AnimatePresence>
        {showAiMenu && !aiPreview && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-1 flex items-center gap-0.5">
              {isLoading ? (
                <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Improving...</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleAiAction("improve")}
                    className="flex items-center gap-1 px-2 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                    title="Improve wording"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Improve</span>
                  </button>
                  <button
                    onClick={() => handleAiAction("quantify")}
                    className="flex items-center gap-1 px-2 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                    title="Add metrics"
                  >
                    <Target className="w-3 h-3" />
                    <span>Quantify</span>
                  </button>
                  <button
                    onClick={() => handleAiAction("fix")}
                    className="flex items-center gap-1 px-2 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                    title="Fix grammar"
                  >
                    <Type className="w-3 h-3" />
                    <span>Fix</span>
                  </button>
                  <button
                    onClick={() => handleAiAction("shorten")}
                    className="flex items-center gap-1 px-2 py-1.5 text-xs hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                    title="Make concise"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Shorten</span>
                  </button>
                  <div className="w-px h-5 bg-gray-200 mx-1" />
                  <button
                    onClick={() => setShowAiMenu(false)}
                    className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded transition-colors"
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
