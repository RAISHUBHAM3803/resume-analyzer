// AI Feedback uses Gemini 2.0 Flash as primary, falls back to Groq (Llama 3.1) if quota is exhausted.
const { GoogleGenAI } = require("@google/genai");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

const getGroqKey = () => process.env.GROQ_API_KEY || process.env.BULLET_REWRITER_API_KEY;

const buildPrompt = (resumeText, analysis) => `
You are a Senior Technical Career Coach and Expert Recruiter.
Analyze the following Resume content.
TASKS:
1. Identify the professional domain (e.g., Frontend, AI/ML, DevOps, Data Science, etc.).
2. Evaluate the resume impact, clarity, and keyword optimization.
3. Check specifically for Education and Contact details.
4. Generate 3-5 specific, professional recommendations.
5. Generate 3 challenging, domain-specific interview questions.
Resume Content:
${resumeText.substring(0, 4000)}
Identified Technical Skills: ${analysis.skills ? analysis.skills.join(", ") : ""}
Return ONLY a valid JSON object:
{
  "domain": "Detected Domain Name",
  "feedback": "Suggestion 1\nSuggestion 2\nSuggestion 3",
  "questions": ["Question 1", "Question 2", "Question 3"]
}
`;

const generateFeedback = async (resumeText, analysis) => {
  const fallbackResponse = {
    domain: "Software Engineering",
    feedback: "Focus on domain-specific certifications.\nQuantify your impact in previous projects.\nHighlight expertise in modern tools and frameworks.",
    questions: [
      "What is your preferred architectural pattern?",
      "Explain a complex technical challenge you faced in your last role.",
      "How do you stay updated with the latest industry trends?"
    ]
  };

  const prompt = buildPrompt(resumeText, analysis);

  // Primary: Gemini 2.0 Flash
  const genAI = getGeminiClient();
  if (genAI) {
    try {
      const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const parsed = JSON.parse(result.text.trim());
      console.log("AI Feedback: used Gemini 2.0 Flash");
      return {
        domain: parsed.domain || fallbackResponse.domain,
        feedback: parsed.feedback || fallbackResponse.feedback,
        questions: parsed.questions || fallbackResponse.questions
      };
    } catch (err) {
      console.warn("Gemini AI Feedback failed, falling back to Groq:", err.message.substring(0, 80));
    }
  }

  // Fallback: Groq Llama 3.1
  const groqKey = getGroqKey();
  if (groqKey) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) throw new Error(`Groq API error: ${response.status}`);
      const result = await response.json();
      const parsed = JSON.parse(result.choices[0].message.content.trim());
      console.log("AI Feedback: used Groq Llama 3.1 fallback");
      return {
        domain: parsed.domain || fallbackResponse.domain,
        feedback: parsed.feedback || fallbackResponse.feedback,
        questions: parsed.questions || fallbackResponse.questions
      };
    } catch (err) {
      console.error("Groq AI Feedback Error:", err.message);
    }
  }

  return fallbackResponse;
};

module.exports = generateFeedback;
