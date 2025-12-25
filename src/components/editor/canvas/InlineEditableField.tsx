import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface InlineEditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const InlineEditableField = ({
  value,
  onChange,
  placeholder = "Click to edit...",
  className = "",
  style = {},
  multiline = false,
  disabled = false,
  onFocus,
  onBlur,
}: InlineEditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLDivElement>(null);

  // Sync local value with prop
  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value);
    }
  }, [value, isEditing]);

  const handleFocus = useCallback(() => {
    setIsEditing(true);
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
    onBlur?.();
  }, [localValue, value, onChange, onBlur]);

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || "";
    setLocalValue(text);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Prevent Enter for single-line fields
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur();
    }
    
    // Escape to cancel editing
    if (e.key === "Escape") {
      setLocalValue(value);
      inputRef.current?.blur();
    }

    // Bold: Ctrl/Cmd + B
    if ((e.ctrlKey || e.metaKey) && e.key === "b") {
      e.preventDefault();
      document.execCommand("bold");
    }

    // Italic: Ctrl/Cmd + I
    if ((e.ctrlKey || e.metaKey) && e.key === "i") {
      e.preventDefault();
      document.execCommand("italic");
    }
  }, [multiline, value]);

  return (
    <motion.div
      ref={inputRef}
      contentEditable={!disabled}
      suppressContentEditableWarning
      onFocus={handleFocus}
      onBlur={handleBlur}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={`
        outline-none cursor-text transition-all duration-150
        ${isEditing ? "ring-2 ring-primary/20 rounded px-1 -mx-1" : ""}
        ${!localValue && !isEditing ? "text-muted-foreground" : ""}
        ${className}
      `}
      style={{
        ...style,
        minWidth: "20px",
        direction: "ltr",
        textAlign: style.textAlign || "left",
      }}
      whileFocus={{ scale: 1.001 }}
    >
      {localValue || (!isEditing ? placeholder : "")}
    </motion.div>
  );
};

export default InlineEditableField;
