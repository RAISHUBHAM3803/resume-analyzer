const { GoogleGenAI } = require("@google/genai");

// Uses a dedicated key for the Cover Letter feature.
// Falls back to the shared GEMINI_API_KEY if COVER_LETTER_API_KEY is not set.
const getCoverLetterClient = () => {
  const apiKey = process.env.COVER_LETTER_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

const generateCoverLetter = async (resumeText, jobDescription) => {
  const genAI = getCoverLetterClient();
  if (!genAI) {
    return "Error: Cover Letter API key is not configured. Please set COVER_LETTER_API_KEY in your environment variables.";
  }

  try {
    const prompt = `
You are an expert career coach and professional copywriter.
Generate a highly persuasive, professional cover letter for the user based on their resume and the target job description.
The cover letter should be formatted in standard business letter format (without the physical address block at the very top, start directly with the greeting).
Do NOT include placeholders like [Your Name] or [Company Name] if the information is available in the resume/job description. If not available, use sensible generic terms or omit the placeholder cleanly.

Resume Content:
${resumeText.substring(0, 4000)}

Target Job Description:
${jobDescription ? jobDescription.substring(0, 4000) : "A standard role matching the resume's skills."}

Instructions:
1. Start with a strong, engaging opening that hooks the reader.
2. Highlight 1-2 major achievements from the resume that directly align with the job description.
3. Keep the tone confident, professional, and enthusiastic.
4. Conclude with a strong call to action requesting an interview.
5. Return ONLY the plain text of the cover letter. No markdown formatting, no JSON, just the text.
`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    return result.text.trim();
  } catch (error) {
    console.error("Gemini AI Cover Letter Error:", error.message);
    throw new Error("Failed to generate cover letter.");
  }
};

module.exports = generateCoverLetter;
