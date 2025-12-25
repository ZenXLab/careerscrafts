-- Fix search_path security issue for update_color_themes_updated_at function
CREATE OR REPLACE FUNCTION public.update_color_themes_updated_at()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;