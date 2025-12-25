import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Wand2, Target, Type } from "lucide-react";

interface InlineEditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  fieldType: "text" | "textarea" | "bullet";
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  locked?: boolean;
  onAiImprove?: (content: string) => void;
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
  locked = false,
  onAiImprove,
  multiline = false,
  maxLength,
}: InlineEditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const editRef = useRef<HTMLDivElement>(null);
  const aiMenuRef = useRef<HTMLDivElement>(null);

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
    if (locked) return;
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
    } else {
      setShowAiMenu(false);
      setSelectedText("");
    }
  };

  const handleAiAction = (action: "improve" | "quantify" | "fix" | "shorten") => {
    if (onAiImprove) {
      onAiImprove(`${action}:${selectedText || localValue}`);
    }
    setShowAiMenu(false);
  };

  return (
    <div className="relative inline-block w-full" style={style}>
      {/* Editable Content */}
      <div
        ref={editRef}
        contentEditable={!locked && isEditing}
        suppressContentEditableWarning
        onClick={handleClick}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onMouseUp={handleTextSelect}
        className={`
          outline-none transition-all duration-150
          ${locked ? "cursor-not-allowed opacity-70" : "cursor-text"}
          ${isEditing 
            ? "bg-primary/5 ring-1 ring-primary/30 rounded px-1 -mx-1" 
            : "hover:bg-primary/5 hover:ring-1 hover:ring-primary/20 rounded px-1 -mx-1"
          }
          ${!localValue && !isEditing ? "text-muted-foreground italic" : ""}
          ${className}
        `}
        style={{ minHeight: multiline ? "3em" : "1.2em" }}
      >
        {isEditing ? localValue : localValue || placeholder}
      </div>

      {/* AI Enhancement Menu */}
      <AnimatePresence>
        {showAiMenu && !locked && (
          <motion.div
            ref={aiMenuRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-card border border-border rounded-lg shadow-xl p-1 flex items-center gap-0.5">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lock indicator */}
      {locked && (
        <div className="absolute top-0 right-0 w-4 h-4 text-muted-foreground/50">
          🔒
        </div>
      )}
    </div>
  );
};

export default InlineEditableField;
