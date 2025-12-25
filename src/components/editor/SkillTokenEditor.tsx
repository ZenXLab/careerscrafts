import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillTokenEditorProps {
  category: string;
  items: string[];
  categoryIndex: number;
  accentColor: string;
  onCategoryChange: (categoryIndex: number, newCategory: string) => void;
  onItemsChange: (categoryIndex: number, newItems: string[]) => void;
}

const SkillTokenEditor = ({
  category,
  items,
  categoryIndex,
  accentColor,
  onCategoryChange,
  onItemsChange,
}: SkillTokenEditorProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [categoryValue, setCategoryValue] = useState(category);
  const inputRef = useRef<HTMLInputElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCategoryValue(category);
  }, [category]);

  // Handle input key events for tokenization
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const trimmedValue = inputValue.trim();

    // Comma or Enter = create new skill
    if ((e.key === "," || e.key === "Enter") && trimmedValue) {
      e.preventDefault();
      // Remove trailing comma if user typed it
      const cleanValue = trimmedValue.replace(/,+$/, "").trim();
      if (cleanValue && !items.includes(cleanValue)) {
        onItemsChange(categoryIndex, [...items, cleanValue]);
      }
      setInputValue("");
    }

    // Backspace on empty input = remove last skill
    if (e.key === "Backspace" && !inputValue && items.length > 0) {
      e.preventDefault();
      onItemsChange(categoryIndex, items.slice(0, -1));
    }

    // Tab = move to next category or create skill if input has value
    if (e.key === "Tab" && trimmedValue) {
      const cleanValue = trimmedValue.replace(/,+$/, "").trim();
      if (cleanValue && !items.includes(cleanValue)) {
        onItemsChange(categoryIndex, [...items, cleanValue]);
      }
      setInputValue("");
    }
  };

  // Handle paste - split by comma and add multiple skills
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const newSkills = pastedText
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter((s) => s && !items.includes(s));

    if (newSkills.length > 0) {
      onItemsChange(categoryIndex, [...items, ...newSkills]);
    }
  };

  // Remove a specific skill
  const removeSkill = (index: number) => {
    onItemsChange(
      categoryIndex,
      items.filter((_, i) => i !== index)
    );
  };

  // Handle category edit
  const handleCategoryKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (categoryValue.trim()) {
        onCategoryChange(categoryIndex, categoryValue.trim());
      }
      setIsEditingCategory(false);
      inputRef.current?.focus();
    }
    if (e.key === "Escape") {
      setCategoryValue(category);
      setIsEditingCategory(false);
    }
  };

  const handleCategoryBlur = () => {
    if (categoryValue.trim() && categoryValue !== category) {
      onCategoryChange(categoryIndex, categoryValue.trim());
    }
    setIsEditingCategory(false);
  };

  return (
    <div className="flex flex-wrap gap-1.5 items-start">
      {/* Category Label */}
      {isEditingCategory ? (
        <input
          ref={categoryInputRef}
          type="text"
          value={categoryValue}
          onChange={(e) => setCategoryValue(e.target.value)}
          onKeyDown={handleCategoryKeyDown}
          onBlur={handleCategoryBlur}
          autoFocus
          className="text-[9pt] font-semibold text-gray-700 min-w-[60px] max-w-[120px] bg-transparent border-b border-gray-400 outline-none px-0.5"
          style={{ width: `${Math.max(60, categoryValue.length * 7)}px` }}
        />
      ) : (
        <span
          onClick={() => setIsEditingCategory(true)}
          className="text-[9pt] font-semibold text-gray-700 min-w-[80px] cursor-text hover:bg-gray-100 rounded px-0.5 -mx-0.5 transition-colors"
          title="Click to edit category"
        >
          {category}:
        </span>
      )}

      {/* Skill Tokens */}
      <div className="flex flex-wrap gap-1 items-center flex-1">
        <AnimatePresence mode="popLayout">
          {items.map((skill, idx) => (
            <motion.span
              key={`${skill}-${idx}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="group inline-flex items-center gap-1 px-2 py-0.5 text-[8pt] rounded text-gray-700 cursor-default"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              {skill}
              <button
                onClick={() => removeSkill(idx)}
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 -mr-0.5"
                title="Remove skill"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Inline Input for New Skills */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Add skill..."
          className="text-[8pt] bg-transparent outline-none min-w-[60px] max-w-[100px] placeholder:text-gray-400 text-gray-700"
          style={{ width: `${Math.max(60, inputValue.length * 6)}px` }}
        />
      </div>
    </div>
  );
};

export default SkillTokenEditor;
