import { useCallback, useMemo, useState, useEffect } from "react";
import { createEditor, Descendant, Editor, Transforms, Range } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import {
  useFloating,
  offset,
  flip,
  shift,
  FloatingPortal,
} from "@floating-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Bold, Italic, Wand2, Sparkles, Target, Loader2, X, Check } from "lucide-react";
import { useAITextImprovement, AIAction } from "@/hooks/useAITextImprovement";

interface SlateInlineFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  role?: string;
  multiline?: boolean;
  accentColor?: string;
}

const SlateInlineField = ({
  value,
  onChange,
  placeholder = "Click to edit",
  className = "",
  style,
  role = "Professional",
  multiline = false,
  accentColor = "#2563eb",
}: SlateInlineFieldProps) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [isFocused, setIsFocused] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const editorRef = useMemo(() => ({ current: null as HTMLDivElement | null }), []);

  const initialValue: Descendant[] = useMemo(() => [
    { type: "paragraph", children: [{ text: value || "" }] } as any,
  ], []);

  const { improveText, isLoading, previewText, clearPreview } = useAITextImprovement({
    role,
    onSuccess: () => {},
  });

  const { refs, floatingStyles, update } = useFloating({
    placement: "top",
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });

  useEffect(() => {
    const currentText = Editor.string(editor, []);
    if (value !== currentText) {
      Transforms.delete(editor, {
        at: { anchor: Editor.start(editor, []), focus: Editor.end(editor, []) },
      });
      Transforms.insertText(editor, value || "");
    }
  }, [value, editor]);

  const handleChange = useCallback(() => {
    const text = Editor.string(editor, []);
    if (text !== value) onChange(text);
    
    const { selection } = editor;
    if (selection && !Range.isCollapsed(selection)) {
      setShowToolbar(true);
      update();
    } else if (!previewText) {
      setShowToolbar(false);
    }
  }, [editor, value, onChange, update, previewText]);

  const toggleMark = (format: string) => {
    const marks = Editor.marks(editor) as any;
    const isActive = marks ? marks[format] === true : false;
    if (isActive) Editor.removeMark(editor, format);
    else Editor.addMark(editor, format, true);
  };

  const renderLeaf = useCallback(({ attributes, children, leaf }: any) => {
    let el = children;
    if (leaf.bold) el = <strong>{el}</strong>;
    if (leaf.italic) el = <em>{el}</em>;
    if (leaf.accent) el = <span style={{ color: accentColor }}>{el}</span>;
    return <span {...attributes} style={{ direction: "ltr" }}>{el}</span>;
  }, [accentColor]);

  const handleAiAction = async (action: AIAction) => {
    const { selection } = editor;
    if (!selection) return;
    const selectedText = Editor.string(editor, selection);
    if (selectedText) await improveText(action, selectedText);
  };

  const applyAiSuggestion = () => {
    if (!previewText) return;
    Transforms.delete(editor, { at: editor.selection! });
    Transforms.insertText(editor, previewText);
    clearPreview();
    setShowToolbar(false);
    onChange(Editor.string(editor, []));
  };

  return (
    <div className="relative inline-block w-full group">
      <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
        <div ref={refs.setReference}>
          <Editable
            renderLeaf={renderLeaf}
            onFocus={() => setIsFocused(true)}
            onBlur={() => { setIsFocused(false); setTimeout(() => !previewText && setShowToolbar(false), 200); }}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "b") { e.preventDefault(); toggleMark("bold"); }
              if ((e.ctrlKey || e.metaKey) && e.key === "i") { e.preventDefault(); toggleMark("italic"); }
              if (e.key === "Enter" && !multiline) e.preventDefault();
              if (e.key === "Tab") e.preventDefault();
            }}
            placeholder={placeholder}
            spellCheck
            className={`outline-none transition-all cursor-text ${isFocused ? "bg-blue-50/50 ring-1 ring-blue-200 rounded px-1 -mx-1" : "hover:bg-blue-50/30 rounded px-1 -mx-1"} ${!value ? "text-muted-foreground italic" : ""} ${className}`}
            style={{ ...style, minHeight: multiline ? "3em" : "1.2em", direction: "ltr", textAlign: "left" }}
          />
        </div>

        <FloatingPortal>
          <AnimatePresence>
            {showToolbar && isFocused && (
              <motion.div ref={refs.setFloating} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={floatingStyles} className="z-[100]">
                <div className="bg-background border border-border rounded-lg shadow-xl p-1 flex items-center gap-0.5">
                  {previewText ? (
                    <div className="flex items-center gap-2 px-2 max-w-[300px]">
                      <Sparkles className="w-3 h-3 text-primary shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">{previewText}</span>
                      <button onMouseDown={(e) => { e.preventDefault(); applyAiSuggestion(); }} className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded"><Check className="w-3 h-3" /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); clearPreview(); }} className="p-0.5 text-muted-foreground"><X className="w-3 h-3" /></button>
                    </div>
                  ) : isLoading ? (
                    <div className="flex items-center gap-2 px-3 py-1"><Loader2 className="w-3 h-3 animate-spin" /><span className="text-xs">AI...</span></div>
                  ) : (
                    <>
                      <button onMouseDown={(e) => { e.preventDefault(); toggleMark("bold"); }} className="p-1.5 rounded hover:bg-muted" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); toggleMark("italic"); }} className="p-1.5 rounded hover:bg-muted" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
                      <div className="w-px h-5 bg-border mx-1" />
                      <button onMouseDown={(e) => { e.preventDefault(); handleAiAction("improve"); }} className="p-1.5 rounded hover:bg-muted" title="Improve"><Wand2 className="w-3.5 h-3.5" /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); handleAiAction("quantify"); }} className="p-1.5 rounded hover:bg-muted" title="Add metrics"><Target className="w-3.5 h-3.5" /></button>
                      <button onMouseDown={(e) => { e.preventDefault(); handleAiAction("shorten"); }} className="p-1.5 rounded hover:bg-muted" title="Shorten"><Sparkles className="w-3.5 h-3.5" /></button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </FloatingPortal>
      </Slate>
    </div>
  );
};

export default SlateInlineField;
