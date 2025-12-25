import { useCallback, useMemo, useState, useEffect } from "react";
import { createEditor, Descendant, Editor, Transforms, Range } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import { ResumeData } from "@/types/resume";
import SlateElement from "./SlateElements";
import SlateLeaf from "./SlateLeaves";
import SlateFloatingToolbar from "./SlateFloatingToolbar";
import {
  resumeDataToSlateValue,
  slateValueToResumeData,
  toggleMark,
  insertBullet,
  deleteEmptyBullet,
} from "./slateUtils";

interface SlateResumeEditorProps {
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
  accentColor?: string;
  readOnly?: boolean;
}

const SlateResumeEditor = ({
  data,
  onDataChange,
  accentColor = "#2563eb",
  readOnly = false,
}: SlateResumeEditorProps) => {
  // Create editor with plugins
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Initialize value from resume data
  const [value, setValue] = useState<Descendant[]>(() =>
    resumeDataToSlateValue(data)
  );

  // Sync with external data changes
  useEffect(() => {
    const newValue = resumeDataToSlateValue(data);
    setValue(newValue);
    // Reset editor to new value
    editor.children = newValue;
    editor.onChange();
  }, [data.personalInfo.name, data.summary]); // Only key fields to avoid infinite loops

  // Handle value changes
  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      setValue(newValue);

      // Check if content actually changed (not just selection)
      const isContentChange = editor.operations.some(
        (op) => op.type !== "set_selection"
      );

      if (isContentChange) {
        const updatedData = slateValueToResumeData(newValue, data);
        onDataChange(updatedData);
      }
    },
    [data, onDataChange, editor]
  );

  // Render element with accent color
  const renderElement = useCallback(
    (props: any) => <SlateElement {...props} accentColor={accentColor} />,
    [accentColor]
  );

  // Render leaf with accent color
  const renderLeaf = useCallback(
    (props: any) => <SlateLeaf {...props} accentColor={accentColor} />,
    [accentColor]
  );

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Bold: Ctrl/Cmd + B
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault();
        toggleMark(editor, "bold");
        return;
      }

      // Italic: Ctrl/Cmd + I
      if ((event.ctrlKey || event.metaKey) && event.key === "i") {
        event.preventDefault();
        toggleMark(editor, "italic");
        return;
      }

      // Enter in bullet list - create new bullet
      if (event.key === "Enter") {
        const { selection } = editor;
        if (!selection || !Range.isCollapsed(selection)) return;

        const [bulletMatch] = Array.from(
          Editor.nodes(editor, {
            match: (n: any) => n.type === "bullet",
          })
        );

        if (bulletMatch) {
          event.preventDefault();
          insertBullet(editor, "dot");
          return;
        }
      }

      // Backspace on empty bullet - delete bullet
      if (event.key === "Backspace") {
        const deleted = deleteEmptyBullet(editor);
        if (deleted) {
          event.preventDefault();
          return;
        }
      }

      // Tab - prevent default (no random indentation)
      if (event.key === "Tab") {
        event.preventDefault();
        return;
      }
    },
    [editor]
  );

  // Placeholder for empty nodes
  const renderPlaceholder = useCallback(
    ({ attributes, children }: any) => (
      <span {...attributes} className="text-gray-400 italic pointer-events-none">
        {children}
      </span>
    ),
    []
  );

  return (
    <div
      className="slate-resume-editor"
      style={{
        direction: "ltr",
        textAlign: "left",
        unicodeBidi: "embed",
      }}
    >
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        {!readOnly && <SlateFloatingToolbar accentColor={accentColor} />}
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck
          autoFocus={false}
          placeholder="Click to start editing..."
          style={{
            outline: "none",
            direction: "ltr",
            textAlign: "left",
            unicodeBidi: "embed",
          }}
          className="focus:outline-none"
        />
      </Slate>
    </div>
  );
};

export default SlateResumeEditor;
