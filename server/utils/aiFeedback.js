const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateFeedback = async (resumeText, analysis) => {
  try {
    const prompt = `
You are a Senior Technical Career Coach and Expert Recruiter. 

Analyze the following Resume content.

TASKS:
1. Identify the professional domain (e.g., Frontend, AI/ML, DevOps, Data Science, etc.).
2. Evaluate the resume's impact, clarity, and keyword optimization.
3. Check specifically for Education and Contact details.
4. Generate 3-5 specific, professional recommendations.
5. Generate 3 challenging, domain-specific interview questions.

Resume Content:
${resumeText.substring(0, 4000)}

Identified Technical Skills: ${analysis.skills.join(", ")}

Return ONLY a valid JSON object:
{
  "domain": "Detected Domain Name",
  "feedback": "• Sugestion 1\\n• Suggestion 2\\n• Suggestion 3",
  "questions": ["Question 1", "Question 2", "Question 3"]
}

Focus on being EXTREMELY realistic and professional.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 600,
    });

    const parsed = JSON.parse(response.choices[0].message.content.trim());
    return {
      domain: parsed.domain || "Software Engineering",
      feedback: parsed.feedback,
      questions: parsed.questions
    };

  } catch (error) {
    console.error("AI Feedback Error:", error.message);
    const fallbackDomain = "Software Engineering";
    return {
      domain: fallbackDomain,
      feedback: `• Focus on domain-specific certifications in ${fallbackDomain}.\n• Quantify your impact in previous projects.\n• Highlight expertise in modern ${fallbackDomain} tools and frameworks.`,
      questions: [`What is your preferred architectural pattern in ${fallbackDomain}?`, "Explain a complex technical challenge you faced in your last role.", "How do you stay updated with the latest industry trends?"]
    };
  }
};

module.exports = generateFeedback;
