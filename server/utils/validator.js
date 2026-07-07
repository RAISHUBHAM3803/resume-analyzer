const { getGeminiClient, markCurrentKeyExhausted, isQuotaError } = require("./geminiKeyManager");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const getGroqKey = () => process.env.GROQ_API_KEY || process.env.BULLET_REWRITER_API_KEY;

const validateResumeText = async (text) => {
  if (!text || text.trim().length < 100) {
    return { isValid: false, reason: "File content is too short to be a resume." };
  }

  const prompt = `You are a document classifier. Determine if this text is from a professional RESUME or CV.
A resume: belongs to one person, has contact info, Work Experience, Education, Skills sections.
NOT a resume: exam paper, textbook, article, report, company document.
Analyze the first 2000 chars and return JSON only:
{"isResume": true or false, "reason": "brief reason if false, empty string if true"}
Text: ${text.substring(0, 2000)}`;

  // Try Gemini keys with rotation
  let geminiClient = getGeminiClient();
  while (geminiClient) {
    try {
      const result = await geminiClient.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const parsed = JSON.parse(result.text.trim());
      if (parsed.isResume === false) {
        return { isValid: false, reason: parsed.reason || "This file does not appear to be a resume." };
      }
      return { isValid: true };
    } catch (err) {
      if (isQuotaError(err)) {
        markCurrentKeyExhausted();
        geminiClient = getGeminiClient();
        continue;
      }
      console.warn("Gemini validator error, falling back to Groq:", err.message.substring(0, 60));
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
          temperature: 0.1,
          response_format: { type: "json_object" }
        })
      });
      if (response.ok) {
        const result = await response.json();
        const parsed = JSON.parse(result.choices[0].message.content.trim());
        if (parsed.isResume === false) {
          return { isValid: false, reason: parsed.reason || "This file does not appear to be a resume." };
        }
        return { isValid: true };
      }
    } catch (err) {
      console.warn("Groq validator fallback error:", err.message);
    }
  }

  // Heuristic fallback
  const lowerText = text.toLowerCase();
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  const hasDateRange = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[\s,]\d{4}/i.test(text);
  const hasExperience = ["experience", "work history", "employment"].some(k => lowerText.includes(k));
  const hasEducation = ["education", "university", "college", "degree"].some(k => lowerText.includes(k));
  const hasSkills = ["skills", "technologies", "technical skills"].some(k => lowerText.includes(k));
  const sectionCount = [hasExperience, hasEducation, hasSkills].filter(Boolean).length;

  if (!(hasEmail || hasPhone) || sectionCount < 2 || !hasDateRange) {
    return { isValid: false, reason: "This file does not appear to be a resume. Please upload a valid resume." };
  }
  return { isValid: true };
};

module.exports = { validateResumeText };
