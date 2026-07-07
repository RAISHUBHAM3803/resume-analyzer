const { getGeminiClient, markCurrentKeyExhausted, isQuotaError } = require("./geminiKeyManager");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const getGroqKey = () => process.env.GROQ_API_KEY || process.env.BULLET_REWRITER_API_KEY;

const generateCoverLetter = async (resumeText, jobDescription) => {
  const prompt = `You are an expert career coach and professional copywriter.
Generate a highly persuasive, professional cover letter based on the resume and job description.
Format: standard business letter (start with greeting, no physical address block).
Do NOT use placeholders like [Your Name] if info is available in the resume.

Resume:
${resumeText.substring(0, 4000)}

Job Description:
${jobDescription ? jobDescription.substring(0, 4000) : "A standard role matching the resume skills."}

Instructions:
1. Start with a strong, engaging opening that hooks the reader.
2. Highlight 1-2 major achievements from the resume that align with the job.
3. Keep the tone confident, professional, and enthusiastic.
4. Conclude with a strong call to action requesting an interview.
5. Return ONLY the plain text of the cover letter. No markdown, no JSON.`;

  // Try Gemini keys with rotation
  let geminiClient = getGeminiClient();
  while (geminiClient) {
    try {
      const result = await geminiClient.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
      });
      console.log("Cover Letter: Gemini 2.0 Flash");
      return result.text.trim();
    } catch (err) {
      if (isQuotaError(err)) {
        markCurrentKeyExhausted();
        geminiClient = getGeminiClient();
        continue;
      }
      console.warn("Gemini cover letter error, falling back to Groq:", err.message.substring(0, 60));
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
          temperature: 0.7,
          max_tokens: 1500
        })
      });
      if (!response.ok) throw new Error(`Groq API error: ${response.status}`);
      const result = await response.json();
      console.log("Cover Letter: Groq Llama 3.1 (fallback)");
      return result.choices[0].message.content.trim();
    } catch (err) {
      console.error("Groq Cover Letter Error:", err.message);
    }
  }

  throw new Error("Failed to generate cover letter. All AI services are currently unavailable.");
};

module.exports = generateCoverLetter;
