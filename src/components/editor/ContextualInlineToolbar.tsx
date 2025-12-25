import { motion, AnimatePresence } from "framer-motion";
import { Bold, Italic, Type, Palette, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContextualInlineToolbarProps {
  isVisible: boolean;
  position: { x: number; y: number };
  currentFormatting?: {
    isBold?: boolean;
    isItalic?: boolean;
    color?: 'primary' | 'accent' | 'muted';
    spacing?: 'compact' | 'standard' | 'relaxed';
  };
  onToggleBold?: () => void;
  onToggleItalic?: () => void;
  onChangeColor?: (color: 'primary' | 'accent' | 'muted') => void;
  onChangeSpacing?: (spacing: 'compact' | 'standard' | 'relaxed') => void;
  onClose?: () => void;
}

export const ContextualInlineToolbar = ({
  isVisible,
  position,
  currentFormatting = {},
  onToggleBold,
  onToggleItalic,
  onChangeColor,
  onChangeSpacing,
  onClose,
}: ContextualInlineToolbarProps) => {
  const handleToggleBold = () => {
    onToggleBold?.();
  };

  const handleToggleItalic = () => {
    onToggleItalic?.();
  };

  const handleChangeColor = (color: 'primary' | 'accent' | 'muted') => {
    onChangeColor?.(color);
  };

  const handleIncreaseSpacing = () => {
    const spacingOrder: Array<'compact' | 'standard' | 'relaxed'> = ['compact', 'standard', 'relaxed'];
    const currentIndex = spacingOrder.indexOf(currentFormatting.spacing || 'standard');
    if (currentIndex < spacingOrder.length - 1) {
      onChangeSpacing?.(spacingOrder[currentIndex + 1]);
    }
  };

  const handleDecreaseSpacing = () => {
    const spacingOrder: Array<'compact' | 'standard' | 'relaxed'> = ['compact', 'standard', 'relaxed'];
    const currentIndex = spacingOrder.indexOf(currentFormatting.spacing || 'standard');
    if (currentIndex > 0) {
      onChangeSpacing?.(spacingOrder[currentIndex - 1]);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed z-[200]"
          style={{
            left: `${Math.max(16, Math.min(position.x, window.innerWidth - 300))}px`,
            top: `${Math.max(16, position.y - 60)}px`,
          }}
        >
          <div className="bg-card border border-border rounded-lg shadow-2xl p-1.5 flex items-center gap-1">
            {/* Text Styling */}
            {onToggleBold && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleBold}
                className={`h-8 w-8 p-0 ${currentFormatting.isBold ? 'bg-primary/10 text-primary' : ''}`}
                title="Bold (ATS-safe)"
              >
                <Bold className="w-4 h-4" />
              </Button>
            )}
            {onToggleItalic && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleItalic}
                className={`h-8 w-8 p-0 ${currentFormatting.isItalic ? 'bg-primary/10 text-primary' : ''}`}
                title="Italic (ATS-safe)"
              >
                <Italic className="w-4 h-4" />
              </Button>
            )}

            {/* Divider */}
            {(onToggleBold || onToggleItalic) && onChangeColor && (
              <div className="w-px h-6 bg-border mx-0.5" />
            )}

            {/* Color Options */}
            {onChangeColor && (
              <div className="flex items-center gap-0.5 px-1">
                <button
                  onClick={() => handleChangeColor('primary')}
                  className={`w-6 h-6 rounded border-2 transition-all ${
                    currentFormatting.color === 'primary' || !currentFormatting.color
                      ? 'border-primary scale-110' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ backgroundColor: '#1f2937' }}
                  title="Primary text"
                />
                <button
                  onClick={() => handleChangeColor('accent')}
                  className={`w-6 h-6 rounded border-2 transition-all ${
                    currentFormatting.color === 'accent' 
                      ? 'border-primary scale-110' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ backgroundColor: 'hsl(221, 83%, 53%)' }}
                  title="Accent color"
                />
                <button
                  onClick={() => handleChangeColor('muted')}
                  className={`w-6 h-6 rounded border-2 transition-all ${
                    currentFormatting.color === 'muted' 
                      ? 'border-primary scale-110' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ backgroundColor: '#6b7280' }}
                  title="Muted (dates, metadata)"
                />
              </div>
            )}

            {/* Divider */}
            {onChangeColor && onChangeSpacing && (
              <div className="w-px h-6 bg-border mx-0.5" />
            )}

            {/* Spacing Controls */}
            {onChangeSpacing && (
              <div className="flex items-center gap-0.5 px-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDecreaseSpacing}
                  className="h-8 w-8 p-0"
                  title="Decrease spacing"
                  disabled={currentFormatting.spacing === 'compact'}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xs text-muted-foreground px-1 min-w-[50px] text-center">
                  {currentFormatting.spacing || 'standard'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleIncreaseSpacing}
                  className="h-8 w-8 p-0"
                  title="Increase spacing"
                  disabled={currentFormatting.spacing === 'relaxed'}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>

          {/* ATS-Safe Indicator */}
          <div className="mt-1 text-[10px] text-center text-muted-foreground">
            ATS-Safe Formatting
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContextualInlineToolbar;