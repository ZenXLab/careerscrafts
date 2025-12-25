import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type AIAction = "improve" | "quantify" | "fix" | "shorten";

interface UseAITextImprovementOptions {
  role?: string;
  onSuccess?: (improvedText: string) => void;
  onError?: (error: string) => void;
}

export const useAITextImprovement = (options: UseAITextImprovementOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewText, setPreviewText] = useState<string | null>(null);

  const improveText = useCallback(async (
    action: AIAction,
    text: string
  ): Promise<string | null> => {
    if (!text.trim()) {
      toast.error("Please enter some text to improve");
      return null;
    }

    setIsLoading(true);
    setPreviewText(null);

    try {
      // Build the appropriate prompt based on action
      let actionPrompt = "";
      switch (action) {
        case "improve":
          actionPrompt = `Improve this resume bullet point to be more impactful and professional. 
Use stronger action verbs and clearer language.
Original: ${text}
Return ONLY the improved text, nothing else.`;
          break;
        case "quantify":
          actionPrompt = `Add quantifiable metrics to this resume bullet point.
If numbers aren't available, suggest realistic placeholder metrics.
Original: ${text}
Return ONLY the improved text with metrics, nothing else.`;
          break;
        case "fix":
          actionPrompt = `Fix any grammar, spelling, or punctuation errors in this text.
Also improve clarity without changing the meaning.
Original: ${text}
Return ONLY the corrected text, nothing else.`;
          break;
        case "shorten":
          actionPrompt = `Make this resume bullet point more concise while keeping the impact.
Remove unnecessary words and keep the core message.
Original: ${text}
Return ONLY the shortened text, nothing else.`;
          break;
      }

      const { data, error } = await supabase.functions.invoke("resume-ai", {
        body: {
          action: "improve_bullet",
          data: {
            bulletText: actionPrompt,
            role: options.role || "Professional",
          },
          provider: "lovable",
        },
      });

      if (error) {
        console.error("AI improvement error:", error);
        
        if (error.message?.includes("429") || error.message?.includes("rate limit")) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (error.message?.includes("402")) {
          toast.error("AI credits exhausted. Please add credits to continue.");
        } else {
          toast.error("Failed to improve text. Please try again.");
        }
        
        options.onError?.(error.message);
        return null;
      }

      const improvedText = data?.result?.trim() || data?.result?.rawContent?.trim();
      
      if (improvedText) {
        setPreviewText(improvedText);
        options.onSuccess?.(improvedText);
        return improvedText;
      } else {
        toast.error("No improvement suggestions available.");
        return null;
      }
    } catch (err) {
      console.error("AI text improvement error:", err);
      toast.error("An error occurred. Please try again.");
      options.onError?.(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const clearPreview = useCallback(() => {
    setPreviewText(null);
  }, []);

  return {
    improveText,
    isLoading,
    previewText,
    clearPreview,
  };
};

export default useAITextImprovement;
