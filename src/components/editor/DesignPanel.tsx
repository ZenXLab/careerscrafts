import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Type, Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface DesignPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DesignSettings;
  onSettingsChange: (settings: DesignSettings) => void;
}

export interface DesignSettings {
  fontFamily: string;
  fontSize: number;
  lineSpacing: number;
  sectionSpacing: number;
  accentColor: string;
  layout: "single-column" | "two-column" | "sidebar";
}

const FONT_OPTIONS = [
  { id: "inter", name: "Inter", preview: "Professional & Modern", family: "'Inter', sans-serif" },
  { id: "georgia", name: "Georgia", preview: "Classic & Elegant", family: "'Georgia', serif" },
  { id: "roboto", name: "Roboto", preview: "Clean & Readable", family: "'Roboto', sans-serif" },
  { id: "merriweather", name: "Merriweather", preview: "Sophisticated", family: "'Merriweather', serif" },
  { id: "source-sans", name: "Source Sans Pro", preview: "Open & Friendly", family: "'Source Sans Pro', sans-serif" },
  { id: "lato", name: "Lato", preview: "Warm & Stable", family: "'Lato', sans-serif" },
];

const ACCENT_COLORS = [
  { id: "blue", name: "Professional Blue", value: "hsl(221, 83%, 53%)" },
  { id: "emerald", name: "Success Green", value: "hsl(160, 84%, 39%)" },
  { id: "slate", name: "Classic Slate", value: "hsl(215, 20%, 35%)" },
  { id: "violet", name: "Creative Violet", value: "hsl(270, 70%, 55%)" },
  { id: "amber", name: "Warm Amber", value: "hsl(38, 92%, 50%)" },
  { id: "rose", name: "Bold Rose", value: "hsl(350, 89%, 60%)" },
  { id: "teal", name: "Modern Teal", value: "hsl(175, 77%, 35%)" },
  { id: "neutral", name: "Minimalist", value: "hsl(0, 0%, 25%)" },
];

const DesignPanel = ({ isOpen, onClose, settings, onSettingsChange }: DesignPanelProps) => {
  const [activeTab, setActiveTab] = useState<"font" | "color">("font");

  const updateSetting = <K extends keyof DesignSettings>(key: K, value: DesignSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border/50 shadow-xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div>
              <h3 className="font-semibold text-foreground">Design & Style</h3>
              <p className="text-xs text-muted-foreground">Customize typography and colors</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Tabs - Only Typography and Colors */}
          <div className="flex border-b border-border/50">
            {[
              { id: "font", label: "Typography", icon: Type },
              { id: "color", label: "Colors", icon: Palette },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Typography Tab */}
            {activeTab === "font" && (
              <div className="space-y-6">
                {/* Font Family */}
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">
                    Font Family
                  </Label>
                  <div className="space-y-2">
                    {FONT_OPTIONS.map((font) => (
                      <motion.button
                        key={font.id}
                        onClick={() => updateSetting("fontFamily", font.family)}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          settings.fontFamily === font.family
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground" style={{ fontFamily: font.family }}>
                              {font.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{font.preview}</p>
                          </div>
                          {settings.fontFamily === font.family && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Font Size Scale
                    </Label>
                    <span className="text-sm font-medium text-foreground">{settings.fontSize}%</span>
                  </div>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([value]) => updateSetting("fontSize", value)}
                    min={80}
                    max={120}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Compact</span>
                    <span>Large</span>
                  </div>
                </div>

                {/* Line Spacing */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Line Spacing
                    </Label>
                    <span className="text-sm font-medium text-foreground">{settings.lineSpacing}</span>
                  </div>
                  <Slider
                    value={[settings.lineSpacing]}
                    onValueChange={([value]) => updateSetting("lineSpacing", value)}
                    min={1}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Tight</span>
                    <span>Relaxed</span>
                  </div>
                </div>

                {/* Section Spacing */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Section Spacing
                    </Label>
                    <span className="text-sm font-medium text-foreground">{settings.sectionSpacing}px</span>
                  </div>
                  <Slider
                    value={[settings.sectionSpacing]}
                    onValueChange={([value]) => updateSetting("sectionSpacing", value)}
                    min={12}
                    max={32}
                    step={2}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Compact</span>
                    <span>Spacious</span>
                  </div>
                </div>
              </div>
            )}

            {/* Colors Tab */}
            {activeTab === "color" && (
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">
                  Accent Color
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {ACCENT_COLORS.map((color) => (
                    <motion.button
                      key={color.id}
                      onClick={() => updateSetting("accentColor", color.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        settings.accentColor === color.value
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border border-border/50"
                          style={{ backgroundColor: color.value }}
                        />
                        <span className="text-xs font-medium text-foreground">{color.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Preview */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">Preview</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold" style={{ color: settings.accentColor }}>
                      Section Title
                    </h4>
                    <div className="h-1 w-16 rounded" style={{ backgroundColor: settings.accentColor }} />
                    <p className="text-sm text-foreground">
                      Your resume content will use this accent color for headers and highlights.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <Button className="w-full" onClick={onClose}>
              Apply Changes
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DesignPanel;
