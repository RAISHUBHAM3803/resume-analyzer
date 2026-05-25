const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const generateFeedback = async (resumeText, analysis) => {
  const fallbackResponse = {
    domain: "Software Engineering",
    feedback: `• Focus on domain-specific certifications.\n• Quantify your impact in previous projects.\n• Highlight expertise in modern tools and frameworks.`,
    questions: [
      "What is your preferred architectural pattern?",
      "Explain a complex technical challenge you faced in your last role.",
      "How do you stay updated with the latest industry trends?"
    ]
  };

  if (!genAI) return fallbackResponse;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

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

Identified Technical Skills: ${analysis.skills ? analysis.skills.join(", ") : ""}

Return ONLY a valid JSON object matching the following structure:
{
  "domain": "Detected Domain Name",
  "feedback": "• Suggestion 1\\n• Suggestion 2\\n• Suggestion 3",
  "questions": ["Question 1", "Question 2", "Question 3"]
}
`;

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text().trim());
    
    return {
      domain: parsed.domain || fallbackResponse.domain,
      feedback: parsed.feedback || fallbackResponse.feedback,
      questions: parsed.questions || fallbackResponse.questions
    };
  } catch (error) {
    console.error("Gemini AI Feedback Error:", error.message);
    return fallbackResponse;
  }
};

module.exports = generateFeedback;
