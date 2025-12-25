-- Create table for custom color themes
CREATE TABLE IF NOT EXISTS public.color_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  primary_text_color TEXT DEFAULT '#1f2937',
  secondary_text_color TEXT DEFAULT '#6b7280',
  background_color TEXT DEFAULT '#ffffff',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.color_themes ENABLE ROW LEVEL SECURITY;

-- Users can view their own themes
CREATE POLICY "Users can view their own themes"
ON public.color_themes FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own themes
CREATE POLICY "Users can create themes"
ON public.color_themes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own themes
CREATE POLICY "Users can update their own themes"
ON public.color_themes FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own themes
CREATE POLICY "Users can delete their own themes"
ON public.color_themes FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_color_themes_user_id ON public.color_themes(user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_color_themes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_color_themes_updated_at
BEFORE UPDATE ON public.color_themes
FOR EACH ROW
EXECUTE FUNCTION public.update_color_themes_updated_at();