const { getGeminiClient, markCurrentKeyExhausted, isQuotaError, GEMINI_MODEL } = require("./geminiKeyManager");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const getGroqKey = () => process.env.GROQ_API_KEY || process.env.BULLET_REWRITER_API_KEY;

const buildPrompt = (resumeText, analysis) => `
You are a Senior Technical Career Coach and Expert Recruiter.
Analyze the following Resume and return ONLY a valid JSON object:
{
  "domain": "Detected Domain Name",
  "feedback": "Suggestion 1\nSuggestion 2\nSuggestion 3\nSuggestion 4",
  "questions": ["Question 1", "Question 2", "Question 3"]
}
TASKS:
1. Identify professional domain (Frontend, Backend, AI/ML, DevOps, Data Science, etc.)
2. Generate 3-5 specific, actionable resume improvement suggestions
3. Generate 3 challenging domain-specific interview questions
Resume Content: ${resumeText.substring(0, 4000)}
Identified Skills: ${analysis.skills ? analysis.skills.join(", ") : "Not specified"}`;

const generateFeedback = async (resumeText, analysis) => {
  const fallbackResponse = {
    domain: "Software Engineering",
    feedback: "Focus on domain-specific certifications.\nQuantify your impact in previous projects.\nHighlight expertise in modern tools and frameworks.\nAdd measurable achievements to your work experience.",
    questions: [
      "What is your preferred architectural pattern and why?",
      "Explain a complex technical challenge you faced and how you resolved it.",
      "How do you stay updated with the latest industry trends?"
    ]
  };

  const prompt = buildPrompt(resumeText, analysis);

  // Try Gemini keys with rotation
  let geminiClient = getGeminiClient();
  while (geminiClient) {
    try {
      const result = await geminiClient.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const parsed = JSON.parse(result.text.trim());
      console.log("AI Feedback: Gemini 2.0 Flash");
      return {
        domain: parsed.domain || fallbackResponse.domain,
        feedback: parsed.feedback || fallbackResponse.feedback,
        questions: parsed.questions || fallbackResponse.questions
      };
    } catch (err) {
      if (isQuotaError(err)) {
        markCurrentKeyExhausted();
        geminiClient = getGeminiClient();
        continue;
      }
      console.warn("Gemini feedback error, falling back to Groq:", err.message.substring(0, 60));
      break;
    }
  }

  // Groq fallback
  const groqKey = getGroqKey();
  if (groqKey) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${groqKey}`, "Content-Type": "application/json" },
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
      console.log("AI Feedback: Groq Llama 3.1 (fallback)");
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
