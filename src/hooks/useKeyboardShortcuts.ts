import { useEffect, useCallback, useRef } from "react";

interface ShortcutConfig {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onBold?: () => void;
  onItalic?: () => void;
  onExport?: () => void;
  onEscape?: () => void;
}

export const useKeyboardShortcuts = (config: ShortcutConfig) => {
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modKey = isMac ? e.metaKey : e.ctrlKey;

    // Ctrl/Cmd + S: Save
    if (modKey && e.key === 's') {
      e.preventDefault();
      config.onSave?.();
      return;
    }

    // Ctrl/Cmd + Z: Undo
    if (modKey && !e.shiftKey && e.key === 'z') {
      e.preventDefault();
      config.onUndo?.();
      return;
    }

    // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
    if ((modKey && e.shiftKey && e.key === 'z') || (modKey && e.key === 'y')) {
      e.preventDefault();
      config.onRedo?.();
      return;
    }

    // Ctrl/Cmd + B: Bold
    if (modKey && e.key === 'b') {
      e.preventDefault();
      config.onBold?.();
      return;
    }

    // Ctrl/Cmd + I: Italic
    if (modKey && e.key === 'i') {
      e.preventDefault();
      config.onItalic?.();
      return;
    }

    // Ctrl/Cmd + E: Export
    if (modKey && e.key === 'e') {
      e.preventDefault();
      config.onExport?.();
      return;
    }

    // Escape: Close modals/panels
    if (e.key === 'Escape') {
      config.onEscape?.();
      return;
    }
  }, [config]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // History management for undo/redo
  const pushHistory = useCallback((state: string) => {
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(state);
    historyIndexRef.current = historyRef.current.length - 1;
  }, []);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  return { pushHistory, canUndo, canRedo };
};
