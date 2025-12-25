import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Check, Palette, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ColorTheme {
  id: string;
  name: string;
  accent_color: string;
  primary_text_color: string;
  secondary_text_color: string;
  background_color: string;
  is_default: boolean;
}

interface ThemeManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentAccentColor: string;
  onApplyTheme: (theme: Partial<ColorTheme>) => void;
}

export const ThemeManager = ({ isOpen, onClose, currentAccentColor, onApplyTheme }: ThemeManagerProps) => {
  const [themes, setThemes] = useState<ColorTheme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadThemes();
    }
  }, [isOpen]);

  const loadThemes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('color_themes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setThemes(data || []);
    } catch (error) {
      console.error('Error loading themes:', error);
      toast({ 
        title: "Failed to load themes", 
        description: "Please try again", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCurrentTheme = async () => {
    if (!newThemeName.trim()) {
      toast({ title: "Name required", description: "Please enter a theme name", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('color_themes')
        .insert({
          user_id: user.id,
          name: newThemeName.trim(),
          accent_color: currentAccentColor,
          primary_text_color: '#1f2937',
          secondary_text_color: '#6b7280',
          background_color: '#ffffff',
          is_default: false
        });

      if (error) throw error;

      toast({ title: "Theme saved", description: `"${newThemeName}" saved successfully` });
      setNewThemeName("");
      setShowCreateForm(false);
      loadThemes();
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({ 
        title: "Failed to save theme", 
        description: "Please try again", 
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyTheme = (theme: ColorTheme) => {
    onApplyTheme({
      accent_color: theme.accent_color,
      primary_text_color: theme.primary_text_color,
      secondary_text_color: theme.secondary_text_color,
      background_color: theme.background_color
    });
    toast({ title: "Theme applied", description: `"${theme.name}" applied to resume` });
  };

  const handleDeleteTheme = async (themeId: string, themeName: string) => {
    try {
      const { error } = await supabase
        .from('color_themes')
        .delete()
        .eq('id', themeId);

      if (error) throw error;

      toast({ title: "Theme deleted", description: `"${themeName}" deleted` });
      loadThemes();
    } catch (error) {
      console.error('Error deleting theme:', error);
      toast({ 
        title: "Failed to delete theme", 
        description: "Please try again", 
        variant: "destructive" 
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div 
            className="relative w-full max-w-[550px] max-h-[80vh] bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">My Color Themes</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto flex-1">
              {/* Save Current Theme */}
              {!showCreateForm ? (
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(true)}
                  className="w-full mb-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Save Current Colors as Theme
                </Button>
              ) : (
                <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border">
                  <Label className="text-sm font-medium mb-2 block">Theme Name</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newThemeName}
                      onChange={(e) => setNewThemeName(e.target.value)}
                      placeholder="e.g., Professional Blue"
                      className="flex-1"
                    />
                    <Button onClick={handleSaveCurrentTheme} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" onClick={() => { setShowCreateForm(false); setNewThemeName(""); }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded border border-border" style={{ backgroundColor: currentAccentColor }} />
                    <span className="text-xs text-muted-foreground">Current accent color</span>
                  </div>
                </div>
              )}

              {/* Theme List */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : themes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Palette className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No saved themes yet</p>
                  <p className="text-sm mt-1">Save your first theme above</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {themes.map((theme) => (
                    <motion.div
                      key={theme.id}
                      className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors flex items-center justify-between group"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div 
                          className="w-10 h-10 rounded border border-border shrink-0" 
                          style={{ backgroundColor: theme.accent_color }} 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{theme.name}</p>
                          <p className="text-xs text-muted-foreground">{theme.accent_color}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApplyTheme(theme)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Apply
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTheme(theme.id, theme.name)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ThemeManager;