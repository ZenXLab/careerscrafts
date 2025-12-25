import { useEffect, useRef, useState, useCallback } from "react";
import { Editor, Range } from "slate";
import { useSlate, useFocused } from "slate-react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bold,
  Italic,
  Palette,
  Type,
  Wand2,
  Sparkles,
  Target,
  Loader2,
} from "lucide-react";
import { isMarkActive, toggleMark, getSelectedText } from "./slateUtils";
import { useAITextImprovement, AIAction } from "@/hooks/useAITextImprovement";

interface SlateFloatingToolbarProps {
  accentColor?: string;
}

const SlateFloatingToolbar = ({ accentColor = "#2563eb" }: SlateFloatingToolbarProps) => {
  const editor = useSlate();
  const inFocus = useFocused();
  const [isVisible, setIsVisible] = useState(false);
  const [showAiTools, setShowAiTools] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles, update } = useFloating({
    placement: "top",
    middleware: [offset(10), flip(), shift({ padding: 8 })],
  });

  const { improveText, isLoading, previewText, clearPreview } = useAITextImprovement({
    role: "Professional",
    onSuccess: () => {},
  });

  // Update toolbar position when selection changes
  const updateToolbarPosition = useCallback(() => {
    const { selection } = editor;
    if (!selection || Range.isCollapsed(selection) || !inFocus) {
      setIsVisible(false);
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) {
      setIsVisible(false);
      return;
    }

    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();

    if (rect.width === 0) {
      setIsVisible(false);
      return;
    }

    // Create virtual element for floating-ui
    refs.setReference({
      getBoundingClientRect: () => rect,
    });

    setIsVisible(true);
    update();
  }, [editor, inFocus, refs, update]);

  useEffect(() => {
    const { selection } = editor;
    if (!selection || Range.isCollapsed(selection) || !inFocus) {
      setIsVisible(false);
      setShowAiTools(false);
      return;
    }

    updateToolbarPosition();
  }, [editor.selection, inFocus, updateToolbarPosition]);

  // Handle AI actions
  const handleAiAction = async (action: AIAction) => {
    const selectedText = getSelectedText(editor);
    if (!selectedText) return;
    await improveText(action, selectedText);
  };

  // Apply AI suggestion
  const applyAiSuggestion = () => {
    if (!previewText) return;
    
    const { selection } = editor;
    if (!selection) return;

    Editor.deleteFragment(editor);
    Editor.insertText(editor, previewText);
    clearPreview();
    setShowAiTools(false);
  };

  const ToolbarButton = ({
    active,
    onClick,
    children,
    title,
  }: {
    active?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`
        p-1.5 rounded transition-colors
        ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}
      `}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <FloatingPortal>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={refs.setFloating}
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={floatingStyles}
            className="z-[100]"
          >
            <div
              ref={toolbarRef}
              className="bg-background border border-border rounded-lg shadow-xl p-1 flex items-center gap-0.5"
            >
              {/* Preview Banner */}
              {previewText && (
                <div className="flex items-center gap-2 px-2">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {previewText}
                  </span>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      applyAiSuggestion();
                    }}
                    className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
                  >
                    Apply
                  </button>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      clearPreview();
                    }}
                    className="px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center gap-2 px-3 py-1">
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">Improving...</span>
                </div>
              )}

              {/* Main Toolbar */}
              {!previewText && !isLoading && (
                <>
                  {/* Text Formatting (ATS-Safe Only) */}
                  <ToolbarButton
                    active={isMarkActive(editor, "bold")}
                    onClick={() => toggleMark(editor, "bold")}
                    title="Bold (Ctrl+B)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </ToolbarButton>

                  <ToolbarButton
                    active={isMarkActive(editor, "italic")}
                    onClick={() => toggleMark(editor, "italic")}
                    title="Italic (Ctrl+I)"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </ToolbarButton>

                  <div className="w-px h-5 bg-border mx-1" />

                  {/* Color - Semantic only */}
                  <ToolbarButton
                    active={isMarkActive(editor, "accent")}
                    onClick={() => toggleMark(editor, "accent")}
                    title="Accent Color"
                  >
                    <Palette className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  </ToolbarButton>

                  <ToolbarButton
                    active={isMarkActive(editor, "muted")}
                    onClick={() => toggleMark(editor, "muted")}
                    title="Muted (for dates/metadata)"
                  >
                    <Type className="w-3.5 h-3.5 text-gray-400" />
                  </ToolbarButton>

                  <div className="w-px h-5 bg-border mx-1" />

                  {/* AI Tools Toggle */}
                  {!showAiTools ? (
                    <ToolbarButton
                      onClick={() => setShowAiTools(true)}
                      title="AI Tools"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                    </ToolbarButton>
                  ) : (
                    <>
                      <ToolbarButton
                        onClick={() => handleAiAction("improve")}
                        title="Improve wording"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() => handleAiAction("quantify")}
                        title="Add metrics"
                      >
                        <Target className="w-3.5 h-3.5" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() => handleAiAction("shorten")}
                        title="Make concise"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </ToolbarButton>
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setShowAiTools(false);
                        }}
                        className="ml-1 text-xs text-muted-foreground hover:text-foreground px-1"
                      >
                        ←
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
};

export default SlateFloatingToolbar;
