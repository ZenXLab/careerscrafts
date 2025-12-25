import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ParsedKeyword {
  keyword: string;
  category: "skill" | "experience" | "qualification" | "soft-skill";
  importance: "high" | "medium" | "low";
  found: boolean;
}

export interface JDAnalysis {
  keywords: ParsedKeyword[];
  matchScore: number;
  suggestions: {
    section: string;
    suggestion: string;
    keyword: string;
  }[];
  missingKeywords: string[];
  matchedKeywords: string[];
}

interface UseJDParserOptions {
  resumeContent: string;
}

export const useJDParser = ({ resumeContent }: UseJDParserOptions) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<JDAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseJobDescription = useCallback(async (jobDescription: string) => {
    if (!jobDescription.trim()) {
      setError("Please provide a job description");
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("resume-ai", {
        body: {
          action: "parse-jd",
          jobDescription,
          resumeContent,
        },
      });

      if (fnError) throw fnError;

      const parsedAnalysis = data as JDAnalysis;
      setAnalysis(parsedAnalysis);
      return parsedAnalysis;
    } catch (err) {
      console.error("JD parsing error:", err);
      
      // Fallback to local keyword extraction if AI fails
      const fallbackAnalysis = localKeywordExtraction(jobDescription, resumeContent);
      setAnalysis(fallbackAnalysis);
      return fallbackAnalysis;
    } finally {
      setIsAnalyzing(false);
    }
  }, [resumeContent]);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    parseJobDescription,
    clearAnalysis,
    isAnalyzing,
    analysis,
    error,
  };
};

// Local fallback keyword extraction
function localKeywordExtraction(jobDescription: string, resumeContent: string): JDAnalysis {
  const jdLower = jobDescription.toLowerCase();
  const resumeLower = resumeContent.toLowerCase();

  // Common technical skills to look for
  const technicalSkills = [
    "javascript", "typescript", "react", "node.js", "python", "java", "sql",
    "aws", "docker", "kubernetes", "git", "agile", "scrum", "rest", "api",
    "html", "css", "mongodb", "postgresql", "redis", "graphql", "vue",
    "angular", "next.js", "express", "django", "flask", "spring", "c++",
    "go", "rust", "swift", "kotlin", "terraform", "ci/cd", "jenkins",
    "machine learning", "data analysis", "excel", "tableau", "power bi",
    "salesforce", "hubspot", "jira", "confluence", "figma", "sketch",
  ];

  // Common soft skills
  const softSkills = [
    "leadership", "communication", "teamwork", "problem-solving", "analytical",
    "collaboration", "strategic", "initiative", "adaptability", "creativity",
    "time management", "attention to detail", "critical thinking", "mentoring",
  ];

  // Experience keywords
  const experienceKeywords = [
    "years of experience", "senior", "junior", "lead", "manager", "director",
    "architect", "principal", "staff", "intern", "entry-level", "mid-level",
  ];

  const keywords: ParsedKeyword[] = [];
  const matched: string[] = [];
  const missing: string[] = [];

  // Check technical skills
  technicalSkills.forEach((skill) => {
    if (jdLower.includes(skill)) {
      const found = resumeLower.includes(skill);
      keywords.push({
        keyword: skill,
        category: "skill",
        importance: "high",
        found,
      });
      if (found) matched.push(skill);
      else missing.push(skill);
    }
  });

  // Check soft skills
  softSkills.forEach((skill) => {
    if (jdLower.includes(skill)) {
      const found = resumeLower.includes(skill);
      keywords.push({
        keyword: skill,
        category: "soft-skill",
        importance: "medium",
        found,
      });
      if (found) matched.push(skill);
      else missing.push(skill);
    }
  });

  // Check experience keywords
  experienceKeywords.forEach((keyword) => {
    if (jdLower.includes(keyword)) {
      const found = resumeLower.includes(keyword);
      keywords.push({
        keyword,
        category: "experience",
        importance: keyword.includes("senior") || keyword.includes("lead") ? "high" : "medium",
        found,
      });
      if (found) matched.push(keyword);
      else missing.push(keyword);
    }
  });

  // Extract unique words from JD that might be important (capitalized words, etc.)
  const uniqueTerms = jobDescription
    .match(/\b[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*\b/g) || [];
  
  const filteredTerms = [...new Set(uniqueTerms)]
    .filter(term => term.length > 3 && !["The", "This", "That", "With", "From", "About"].includes(term));

  filteredTerms.slice(0, 10).forEach((term) => {
    const termLower = term.toLowerCase();
    if (!keywords.some(k => k.keyword === termLower)) {
      const found = resumeLower.includes(termLower);
      keywords.push({
        keyword: term,
        category: "qualification",
        importance: "medium",
        found,
      });
      if (found) matched.push(term);
      else missing.push(term);
    }
  });

  // Calculate match score
  const totalKeywords = keywords.length || 1;
  const matchedCount = keywords.filter(k => k.found).length;
  const matchScore = Math.round((matchedCount / totalKeywords) * 100);

  // Generate suggestions
  const suggestions = missing.slice(0, 5).map((keyword) => {
    const kw = keywords.find(k => k.keyword === keyword);
    let section = "Skills";
    if (kw?.category === "experience") section = "Experience";
    else if (kw?.category === "soft-skill") section = "Summary";

    return {
      section,
      suggestion: `Consider adding "${keyword}" to your ${section.toLowerCase()} section to improve alignment`,
      keyword,
    };
  });

  return {
    keywords,
    matchScore,
    suggestions,
    missingKeywords: missing,
    matchedKeywords: matched,
  };
}

export default useJDParser;
