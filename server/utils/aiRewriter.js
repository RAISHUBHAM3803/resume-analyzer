// Uses Node.js built-in fetch (Node 18+) — no external dependency needed

// Uses a dedicated key for the Bullet Rewriter feature (Groq API).
// Falls back to the shared GROQ_API_KEY if BULLET_REWRITER_API_KEY is not set.
const GROQ_API_KEY = process.env.BULLET_REWRITER_API_KEY || process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const rewriteBulletPoint = async (bulletPoint, jobDescription, domain) => {
  const fallbackResponse = {
    suggestions: [
      `Developed and optimized core features for the ${domain || "application"}, improving overall performance and user experience.`,
      `Led the implementation of scalable solutions to address key requirements and drive project success.`,
      `Collaborated with cross-functional teams to deliver high-quality results matching industry standards.`
    ]
  };

  if (!GROQ_API_KEY) {
    console.warn("BULLET_REWRITER_API_KEY is not set. Falling back to default suggestions.");
    return fallbackResponse;
  }

  try {
    let systemPrompt = `You are an Expert Resume Writer and Career Coach. 
Your task is to rewrite the user's resume bullet point to be highly professional, impactful, and aligned with the STAR method (Situation, Task, Action, Result).
Return exactly 3 different variations of the rewritten bullet point. Each variation should sound unique but maintain the core meaning of the original text.
Output exactly a JSON object in the following format with NO markdown formatting, NO backticks, and NO other text:
{
  "suggestions": [
    "First impactful variation...",
    "Second impactful variation...",
    "Third impactful variation..."
  ]
}`;

    if (jobDescription) {
      systemPrompt += `\nAdditionally, tailor the rewrite to align with the key requirements and keywords found in the following Job Description (if applicable):\n"${jobDescription.substring(0, 1500)}"`;
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Original Bullet Point:\n"${bulletPoint}"` }
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const result = await response.json();
    const generatedText = result.choices[0].message.content.trim();
    
    const parsed = JSON.parse(generatedText);
    return {
      suggestions: parsed.suggestions && parsed.suggestions.length > 0
        ? parsed.suggestions
        : fallbackResponse.suggestions
    };

  } catch (error) {
    console.error("Groq Bullet Rewriter Error:", error.message);
    return fallbackResponse;
  }
};

module.exports = rewriteBulletPoint;
