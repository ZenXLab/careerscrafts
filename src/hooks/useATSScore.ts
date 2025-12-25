import { useState, useCallback, useRef, useEffect } from "react";
import { ResumeData } from "@/types/resume";

interface ATSScoreBreakdown {
  structure: number;
  keywords: number;
  content: number;
  readability: number;
  completeness: number;
}

interface ATSFeedback {
  message: string;
  delta: number;
  timestamp: number;
}

interface SectionSignal {
  sectionId: string;
  status: "strong" | "needs-improvement" | "risk";
  message: string;
}

interface UseATSScoreReturn {
  score: number;
  animatedScore: number;
  breakdown: ATSScoreBreakdown;
  feedback: ATSFeedback | null;
  sectionSignals: SectionSignal[];
  isHighScore: boolean;
  recalculate: (data: ResumeData, jdKeywords?: string[]) => void;
}

// Score calculation weights (internal only)
const WEIGHTS = {
  structure: 0.25,
  keywords: 0.30,
  content: 0.20,
  readability: 0.15,
  completeness: 0.10,
};

const calculateStructureScore = (data: ResumeData): number => {
  let score = 100;
  
  // Check for required sections
  if (!data.personalInfo.name) score -= 15;
  if (!data.personalInfo.email) score -= 10;
  if (!data.personalInfo.phone) score -= 5;
  if (!data.summary || data.summary.length < 50) score -= 15;
  if (data.experience.length === 0) score -= 25;
  if (data.education.length === 0) score -= 10;
  if (!data.skills || data.skills.length === 0) score -= 10;
  
  return Math.max(0, score);
};

const calculateKeywordScore = (data: ResumeData, jdKeywords: string[] = []): number => {
  if (jdKeywords.length === 0) return 75; // Default if no JD provided
  
  const resumeText = `
    ${data.summary}
    ${data.experience.map(e => e.bullets.join(' ')).join(' ')}
    ${data.skills?.map(s => s.items.join(' ')).join(' ') || ''}
  `.toLowerCase();
  
  const matchedKeywords = jdKeywords.filter(kw => 
    resumeText.includes(kw.toLowerCase())
  );
  
  return Math.round((matchedKeywords.length / jdKeywords.length) * 100);
};

const calculateContentScore = (data: ResumeData): number => {
  let score = 100;
  
  // Check bullet quality
  const allBullets = data.experience.flatMap(e => e.bullets);
  const actionVerbPatterns = /^(led|managed|developed|created|implemented|designed|built|improved|increased|reduced|achieved|launched|delivered|optimized|established|coordinated|analyzed|executed)/i;
  
  const bulletsWithActionVerbs = allBullets.filter(b => actionVerbPatterns.test(b.trim()));
  const actionVerbRatio = allBullets.length > 0 ? bulletsWithActionVerbs.length / allBullets.length : 0;
  
  if (actionVerbRatio < 0.5) score -= 20;
  if (actionVerbRatio < 0.3) score -= 10;
  
  // Check for metrics/numbers
  const bulletsWithMetrics = allBullets.filter(b => /\d+[%$KM+]|\$[\d,]+|[\d,]+ (users|customers|employees|team members)/i.test(b));
  const metricsRatio = allBullets.length > 0 ? bulletsWithMetrics.length / allBullets.length : 0;
  
  if (metricsRatio < 0.4) score -= 15;
  if (metricsRatio < 0.2) score -= 10;
  
  return Math.max(0, score);
};

const calculateReadabilityScore = (data: ResumeData): number => {
  let score = 100;
  
  // Check summary length
  if (data.summary.length > 500) score -= 10;
  if (data.summary.length < 100) score -= 10;
  
  // Check bullet length
  const allBullets = data.experience.flatMap(e => e.bullets);
  const avgBulletLength = allBullets.reduce((acc, b) => acc + b.length, 0) / (allBullets.length || 1);
  
  if (avgBulletLength > 150) score -= 15;
  if (avgBulletLength < 30) score -= 10;
  
  return Math.max(0, score);
};

const calculateCompletenessScore = (data: ResumeData): number => {
  let score = 0;
  const maxSections = 7;
  let filledSections = 0;
  
  if (data.personalInfo.name && data.personalInfo.email) filledSections++;
  if (data.summary && data.summary.length > 50) filledSections++;
  if (data.experience.length > 0) filledSections++;
  if (data.education.length > 0) filledSections++;
  if (data.skills && data.skills.length > 0) filledSections++;
  if (data.certifications && data.certifications.length > 0) filledSections++;
  if (data.projects && data.projects.length > 0) filledSections++;
  
  score = Math.round((filledSections / maxSections) * 100);
  return score;
};

const generateSectionSignals = (data: ResumeData): SectionSignal[] => {
  const signals: SectionSignal[] = [];
  
  // Summary check
  if (data.summary.length < 100) {
    signals.push({ sectionId: "summary", status: "risk", message: "Summary too short for ATS impact" });
  } else if (data.summary.length < 200) {
    signals.push({ sectionId: "summary", status: "needs-improvement", message: "Consider expanding your summary" });
  } else {
    signals.push({ sectionId: "summary", status: "strong", message: "Summary is well-structured" });
  }
  
  // Experience check
  const avgBulletsPerJob = data.experience.length > 0 
    ? data.experience.reduce((acc, e) => acc + e.bullets.length, 0) / data.experience.length 
    : 0;
    
  if (avgBulletsPerJob < 2) {
    signals.push({ sectionId: "experience", status: "risk", message: "Add more bullet points to each role" });
  } else if (avgBulletsPerJob < 4) {
    signals.push({ sectionId: "experience", status: "needs-improvement", message: "Consider adding more achievements" });
  } else {
    signals.push({ sectionId: "experience", status: "strong", message: "Experience section is comprehensive" });
  }
  
  // Skills check
  const totalSkills = data.skills?.reduce((acc, s) => acc + s.items.length, 0) || 0;
  if (totalSkills < 5) {
    signals.push({ sectionId: "skills", status: "risk", message: "Add more relevant skills" });
  } else if (totalSkills < 10) {
    signals.push({ sectionId: "skills", status: "needs-improvement", message: "Consider adding industry-specific skills" });
  } else {
    signals.push({ sectionId: "skills", status: "strong", message: "Skills section is well-populated" });
  }
  
  // Education check
  if (data.education.length === 0) {
    signals.push({ sectionId: "education", status: "risk", message: "Add your educational background" });
  } else {
    signals.push({ sectionId: "education", status: "strong", message: "Education section is complete" });
  }
  
  return signals;
};

const generateFeedbackMessage = (oldScore: number, newScore: number, data: ResumeData): string => {
  const delta = newScore - oldScore;
  
  if (delta > 0) {
    if (delta >= 5) return "Significant improvement in resume quality";
    if (delta >= 3) return "Added measurable impact to experience";
    return "Content improvement detected";
  } else if (delta < 0) {
    if (delta <= -5) return "Content may need more detail";
    return "Minor adjustment detected";
  }
  
  return "";
};

export const useATSScore = (initialData?: ResumeData): UseATSScoreReturn => {
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [breakdown, setBreakdown] = useState<ATSScoreBreakdown>({
    structure: 0,
    keywords: 0,
    content: 0,
    readability: 0,
    completeness: 0,
  });
  const [feedback, setFeedback] = useState<ATSFeedback | null>(null);
  const [sectionSignals, setSectionSignals] = useState<SectionSignal[]>([]);
  
  const previousScoreRef = useRef(score);
  const debounceRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<NodeJS.Timeout>();
  
  // Smooth score animation
  useEffect(() => {
    if (animatedScore === score) return;
    
    const duration = 500;
    const startScore = animatedScore;
    const endScore = score;
    const diff = endScore - startScore;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentScore = Math.round(startScore + diff * easeOut);
      
      setAnimatedScore(currentScore);
      
      if (progress < 1) {
        animationRef.current = setTimeout(animate, 16);
      }
    };
    
    animate();
    
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [score]);
  
  const recalculate = useCallback((data: ResumeData, jdKeywords: string[] = []) => {
    // Debounce - wait 800ms after user stops typing
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(() => {
      const newBreakdown: ATSScoreBreakdown = {
        structure: calculateStructureScore(data),
        keywords: calculateKeywordScore(data, jdKeywords),
        content: calculateContentScore(data),
        readability: calculateReadabilityScore(data),
        completeness: calculateCompletenessScore(data),
      };
      
      const newScore = Math.round(
        newBreakdown.structure * WEIGHTS.structure +
        newBreakdown.keywords * WEIGHTS.keywords +
        newBreakdown.content * WEIGHTS.content +
        newBreakdown.readability * WEIGHTS.readability +
        newBreakdown.completeness * WEIGHTS.completeness
      );
      
      setBreakdown(newBreakdown);
      
      // Generate feedback if score changed
      const oldScore = previousScoreRef.current;
      if (newScore !== oldScore) {
        const message = generateFeedbackMessage(oldScore, newScore, data);
        if (message) {
          setFeedback({
            message,
            delta: newScore - oldScore,
            timestamp: Date.now(),
          });
          
          // Clear feedback after 2 seconds
          setTimeout(() => setFeedback(null), 2000);
        }
      }
      
      previousScoreRef.current = newScore;
      setScore(newScore);
      setSectionSignals(generateSectionSignals(data));
    }, 800);
  }, []);
  
  // Initialize with sample data
  useEffect(() => {
    if (initialData) {
      recalculate(initialData);
    }
  }, []);
  
  const isHighScore = score >= 90;
  
  return {
    score,
    animatedScore,
    breakdown,
    feedback,
    sectionSignals,
    isHighScore,
    recalculate,
  };
};

export default useATSScore;
