import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// CareersCraft AI System Prompt
const SYSTEM_PROMPT = `You are CareersCraft AI.

Your role is to produce ATS-safe, recruiter-grade resume content.
You must never generate:
- Emojis
- Decorative symbols
- Tables
- Inline styling instructions
- Multi-column logic unless explicitly requested

All outputs must:
- Be one-page unless CV is explicitly requested
- Use impact-driven bullet points
- Quantify results wherever possible
- Match the target role, seniority, and geography
- Respect ATS parsing rules strictly

You do not invent credentials.
You improve clarity, relevance, and positioning.

When generating a resume, output ONLY valid JSON in this exact format:
{
  "personalInfo": {
    "name": "Full Name",
    "title": "Job Title",
    "email": "email@example.com",
    "phone": "+1 234 567 8900",
    "location": "City, Country",
    "linkedin": "linkedin.com/in/username"
  },
  "summary": "2-3 sentence professional summary",
  "experience": [
    {
      "id": "exp1",
      "company": "Company Name",
      "position": "Job Title",
      "location": "City, Country",
      "startDate": "Jan 2020",
      "endDate": "Present",
      "current": true,
      "bullets": ["Achievement 1 with metrics", "Achievement 2 with impact"]
    }
  ],
  "education": [
    {
      "id": "edu1",
      "school": "University Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "location": "City, Country",
      "startDate": "2016",
      "endDate": "2020"
    }
  ],
  "skills": [
    {
      "category": "Technical",
      "items": ["Skill 1", "Skill 2", "Skill 3"]
    }
  ]
}`;

const RESUME_GENERATION_PROMPT = `Generate a complete, one-page professional resume.

INPUT CONTEXT:
- Target Role: {{role}}
- Industry: {{industry}}
- Experience Level: {{years_experience}} years
- Geography: {{region}}
- Additional Context: {{context}}

OUTPUT REQUIREMENTS:
- Header with name, role, location, contact
- Professional summary (2-3 lines)
- Experience (minimum 2 roles, reverse chronological)
- Skills section (ATS keywords)
- Education section

BULLET RULES:
- Start each bullet with an action verb
- Include metrics where applicable (percentages, numbers, dollar amounts)
- Avoid generic responsibilities
- No filler phrases

Tone: professional, confident, recruiter-friendly
Length: strictly one page

Generate realistic but fictional professional data. Output ONLY valid JSON.`;

const BULLET_IMPROVEMENT_PROMPT = `Rewrite this bullet to be impact-driven.

Original bullet:
{{bullet_text}}

Target role:
{{role}}

Rules:
- Keep meaning intact
- Add quantification if possible
- Use strong action verbs
- One sentence only

Return only the improved bullet text, nothing else.`;

const JD_MAPPING_PROMPT = `You are aligning a resume to a job description.

STEP 1 - Extract from JD:
- Core skills
- Required technologies
- Role responsibilities
- Seniority signals
- Industry keywords

STEP 2 - Compare with resume:
- Identify missing keywords
- Identify weak or generic bullets
- Identify irrelevant experience

STEP 3 - Suggest improvements:
- Rewrite bullets to match JD language
- Insert missing keywords naturally
- Maintain honesty (do not invent experience)

JOB DESCRIPTION:
{{jd_text}}

CURRENT RESUME:
{{resume_json}}

OUTPUT as JSON:
{
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": [
    {
      "section": "experience",
      "original": "original text",
      "improved": "improved text",
      "reason": "why this improves ATS match"
    }
  ],
  "overallMatch": 75,
  "recommendations": ["recommendation 1", "recommendation 2"]
}`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data, provider = "lovable" } = await req.json();
    
    console.log(`Resume AI request: action=${action}, provider=${provider}`);
    
    let prompt = "";
    let systemPrompt = SYSTEM_PROMPT;
    
    // Build prompt based on action
    switch (action) {
      case "generate":
        prompt = RESUME_GENERATION_PROMPT
          .replace("{{role}}", data.role || "Software Engineer")
          .replace("{{industry}}", data.industry || "Technology")
          .replace("{{years_experience}}", data.yearsExperience || "5")
          .replace("{{region}}", data.region || "Global")
          .replace("{{context}}", data.context || "");
        break;
        
      case "improve_bullet":
        prompt = BULLET_IMPROVEMENT_PROMPT
          .replace("{{bullet_text}}", data.bulletText || "")
          .replace("{{role}}", data.role || "Professional");
        break;
        
      case "jd_mapping":
        prompt = JD_MAPPING_PROMPT
          .replace("{{jd_text}}", data.jdText || "")
          .replace("{{resume_json}}", JSON.stringify(data.resumeData || {}));
        break;
        
      case "improve_section":
        prompt = `Improve this ${data.sectionType || "section"} for a ${data.role || "professional"} resume. 
        
Current content:
${data.content || ""}

Return improved content in the same format. Focus on:
- Stronger action verbs
- Quantifiable achievements
- ATS-friendly keywords
- Professional tone`;
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    // Select API endpoint and key based on provider
    let apiUrl: string;
    let apiKey: string | undefined;
    let model: string;
    let headers: Record<string, string>;
    
    switch (provider) {
      case "openai":
        apiUrl = "https://api.openai.com/v1/chat/completions";
        apiKey = Deno.env.get("OPENAI_API_KEY");
        model = "gpt-4o-mini";
        headers = {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        };
        break;
        
      case "anthropic":
        apiUrl = "https://api.anthropic.com/v1/messages";
        apiKey = Deno.env.get("ANTHROPIC_API_KEY");
        model = "claude-3-haiku-20240307";
        headers = {
          "x-api-key": apiKey || "",
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        };
        break;
        
      case "deepseek":
        apiUrl = "https://api.deepseek.com/v1/chat/completions";
        apiKey = Deno.env.get("DEEPSEEK_API_KEY");
        model = "deepseek-chat";
        headers = {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        };
        break;
        
      case "lovable":
      default:
        apiUrl = "https://ai.gateway.lovable.dev/v1/chat/completions";
        apiKey = Deno.env.get("LOVABLE_API_KEY");
        model = "google/gemini-2.5-flash";
        headers = {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        };
        break;
    }
    
    if (!apiKey) {
      console.error(`API key not found for provider: ${provider}`);
      return new Response(
        JSON.stringify({ 
          error: `API key not configured for ${provider}. Please add the required API key.`,
          provider 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Calling ${provider} API with model ${model}`);
    
    // Build request body based on provider
    let requestBody: Record<string, unknown>;
    
    if (provider === "anthropic") {
      requestBody = {
        model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: prompt }],
      };
    } else {
      requestBody = {
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      };
    }
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${provider} API error:`, response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `AI provider error: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const responseData = await response.json();
    console.log(`${provider} response received`);
    
    // Extract content based on provider
    let content: string;
    if (provider === "anthropic") {
      content = responseData.content?.[0]?.text || "";
    } else {
      content = responseData.choices?.[0]?.message?.content || "";
    }
    
    // Try to parse JSON responses
    let result: unknown = content;
    if (action === "generate" || action === "jd_mapping") {
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
        result = JSON.parse(jsonStr);
      } catch (parseError) {
        console.log("Could not parse as JSON, returning raw content");
        result = { rawContent: content };
      }
    }
    
    return new Response(
      JSON.stringify({ result, provider }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Resume AI error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
