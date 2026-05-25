const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

/**
 * Uses Gemini AI to determine if the uploaded PDF is actually a resume.
 * Falls back to a strict structural heuristic check if AI is unavailable.
 */
const validateResumeText = async (text) => {
  if (!text || text.trim().length < 100) {
    return { isValid: false, reason: "File content is too short to be a resume." };
  }

  // ── AI-powered classification (primary) ──────────────────────────────────
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      const prompt = `
You are a document classifier. Your ONLY task is to determine if the following text is from a professional RESUME or CV.

A resume/CV:
- Belongs to one specific individual
- Contains their contact info (name, email, phone, etc.)
- Has structured sections: Work Experience, Education, Skills, Projects, etc.
- Lists job titles, dates of employment, institutions attended

It is NOT a resume if it is: an exam answer sheet, a textbook, an article, a report, a cover letter, a company document, or any other document not written as a personal career profile.

Analyze the first 2000 characters of the text below and return a JSON object:
{
  "isResume": true or false,
  "reason": "brief reason if false, empty string if true"
}

Text:
${text.substring(0, 2000)}
      `;

      const result = await model.generateContent(prompt);
      const parsed = JSON.parse(result.response.text().trim());

      if (parsed.isResume === false) {
        return {
          isValid: false,
          reason: parsed.reason || "This file does not appear to be a resume. Please upload a valid PDF resume."
        };
      }

      return { isValid: true };

    } catch (err) {
      console.warn("Gemini validation failed, falling back to heuristic check:", err.message);
      // Fall through to heuristic check below
    }
  }

  // ── Heuristic fallback (used if Gemini is unavailable) ───────────────────
  const lowerText = text.toLowerCase();

  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  const hasDateRange = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)[\s,]\d{4}\s*([-–—]\s*(present|current|\d{4}))?/i.test(text);

  const hasExperience = ["experience", "work history", "employment"].some(k => lowerText.includes(k));
  const hasEducation = ["education", "university", "college", "degree"].some(k => lowerText.includes(k));
  const hasSkills = ["skills", "technologies", "technical skills"].some(k => lowerText.includes(k));

  const sectionCount = [hasExperience, hasEducation, hasSkills].filter(Boolean).length;
  const hasContact = hasEmail || hasPhone;

  if (!hasContact || sectionCount < 2 || !hasDateRange) {
    return {
      isValid: false,
      reason: "This file does not appear to be a resume. Please upload a valid resume with your contact details, work experience (with dates), education, and skills."
    };
  }

  return { isValid: true };
};

module.exports = { validateResumeText };
