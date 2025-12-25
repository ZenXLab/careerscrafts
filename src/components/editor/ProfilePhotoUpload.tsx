import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (url: string | null) => void;
  className?: string;
}

export const ProfilePhotoUpload = ({ currentPhotoUrl, onPhotoChange, className }: ProfilePhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ 
        title: "Invalid file type", 
        description: "Please select an image file (JPG, PNG, WEBP)", 
        variant: "destructive" 
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ 
        title: "File too large", 
        description: "Please select an image smaller than 5MB", 
        variant: "destructive" 
      });
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(data.path);

      onPhotoChange(publicUrl);
      setShowOptions(false);
      toast({ title: "Photo uploaded", description: "Profile photo updated successfully" });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ 
        title: "Upload failed", 
        description: "Failed to upload photo. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    onPhotoChange(null);
    setShowOptions(false);
    toast({ title: "Photo removed" });
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Photo Display / Upload Button */}
      <div className="relative group">
        {currentPhotoUrl ? (
          <div 
            className="w-24 h-24 rounded-full overflow-hidden border-2 border-border cursor-pointer hover:border-primary transition-colors"
            onClick={() => setShowOptions(!showOptions)}
          >
            <img 
              src={currentPhotoUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="w-24 h-24 rounded-full border-2 border-dashed border-border hover:border-primary transition-colors flex items-center justify-center bg-muted/20 group"
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
            ) : (
              <ImageIcon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </button>
        )}
      </div>

      {/* Options Menu */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 z-50 bg-card border border-border rounded-lg shadow-xl p-2 min-w-[180px]"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full justify-start"
            >
              <Upload className="w-4 h-4 mr-2" />
              {currentPhotoUrl ? 'Change Photo' : 'Upload Photo'}
            </Button>
            {currentPhotoUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemovePhoto}
                disabled={isUploading}
                className="w-full justify-start text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4 mr-2" />
                Remove Photo
              </Button>
            )}
            <div className="text-xs text-muted-foreground px-2 py-1 mt-1 border-t border-border">
              Max 5MB • JPG, PNG, WEBP
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePhotoUpload;