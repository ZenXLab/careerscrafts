import { useState, useCallback, useEffect } from "react";
import { ResumeData } from "@/types/resume";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ResumeVersion {
  id: string;
  version: number;
  content: ResumeData;
  atsScore: number | null;
  createdAt: string;
  label?: string;
}

interface UseResumeVersionsReturn {
  versions: ResumeVersion[];
  currentVersion: number;
  isLoading: boolean;
  saveVersion: (data: ResumeData, atsScore?: number, label?: string) => Promise<void>;
  loadVersion: (versionId: string) => ResumeData | null;
  compareVersions: (versionA: string, versionB: string) => { added: string[]; removed: string[]; changed: string[] } | null;
  deleteVersion: (versionId: string) => void;
}

export const useResumeVersions = (resumeId?: string): UseResumeVersionsReturn => {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Load versions from local storage or database
  useEffect(() => {
    const loadVersions = async () => {
      // For now, use local storage
      const stored = localStorage.getItem(`resume_versions_${resumeId || 'default'}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setVersions(parsed);
          setCurrentVersion(parsed.length);
        } catch (e) {
          console.error("Error parsing stored versions:", e);
        }
      }
    };
    
    loadVersions();
  }, [resumeId]);

  const saveVersion = useCallback(async (data: ResumeData, atsScore?: number, label?: string) => {
    setIsLoading(true);
    
    try {
      const newVersion: ResumeVersion = {
        id: `v_${Date.now()}`,
        version: currentVersion + 1,
        content: JSON.parse(JSON.stringify(data)), // Deep clone
        atsScore: atsScore || null,
        createdAt: new Date().toISOString(),
        label: label || `Version ${currentVersion + 1}`,
      };
      
      const updatedVersions = [...versions, newVersion];
      setVersions(updatedVersions);
      setCurrentVersion(currentVersion + 1);
      
      // Save to local storage
      localStorage.setItem(
        `resume_versions_${resumeId || 'default'}`,
        JSON.stringify(updatedVersions)
      );
      
      toast.success(`Version ${currentVersion + 1} saved`);
    } catch (error) {
      console.error("Error saving version:", error);
      toast.error("Failed to save version");
    } finally {
      setIsLoading(false);
    }
  }, [versions, currentVersion, resumeId]);

  const loadVersion = useCallback((versionId: string): ResumeData | null => {
    const version = versions.find(v => v.id === versionId);
    return version?.content || null;
  }, [versions]);

  const compareVersions = useCallback((versionAId: string, versionBId: string) => {
    const versionA = versions.find(v => v.id === versionAId);
    const versionB = versions.find(v => v.id === versionBId);
    
    if (!versionA || !versionB) return null;
    
    const added: string[] = [];
    const removed: string[] = [];
    const changed: string[] = [];
    
    // Compare summaries
    if (versionA.content.summary !== versionB.content.summary) {
      changed.push("Summary");
    }
    
    // Compare experience bullets
    const bulletsA = versionA.content.experience.flatMap(e => e.bullets);
    const bulletsB = versionB.content.experience.flatMap(e => e.bullets);
    
    bulletsB.forEach(b => {
      if (!bulletsA.includes(b)) added.push(`Bullet: "${b.slice(0, 50)}..."`);
    });
    
    bulletsA.forEach(b => {
      if (!bulletsB.includes(b)) removed.push(`Bullet: "${b.slice(0, 50)}..."`);
    });
    
    // Compare skills
    const skillsA = versionA.content.skills?.flatMap(s => s.items) || [];
    const skillsB = versionB.content.skills?.flatMap(s => s.items) || [];
    
    skillsB.forEach(s => {
      if (!skillsA.includes(s)) added.push(`Skill: ${s}`);
    });
    
    skillsA.forEach(s => {
      if (!skillsB.includes(s)) removed.push(`Skill: ${s}`);
    });
    
    return { added, removed, changed };
  }, [versions]);

  const deleteVersion = useCallback((versionId: string) => {
    const updatedVersions = versions.filter(v => v.id !== versionId);
    setVersions(updatedVersions);
    
    localStorage.setItem(
      `resume_versions_${resumeId || 'default'}`,
      JSON.stringify(updatedVersions)
    );
    
    toast.success("Version deleted");
  }, [versions, resumeId]);

  return {
    versions,
    currentVersion,
    isLoading,
    saveVersion,
    loadVersion,
    compareVersions,
    deleteVersion,
  };
};

export default useResumeVersions;
