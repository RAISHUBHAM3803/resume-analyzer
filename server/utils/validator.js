const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.BULLET_REWRITER_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Uses AI to determine if the uploaded PDF is actually a resume.
 * Falls back to a strict structural heuristic check if AI is unavailable.
 */
const validateResumeText = async (text) => {
  if (!text || text.trim().length < 100) {
    return { isValid: false, reason: "File content is too short to be a resume." };
  }

  // -- AI-powered classification (primary) ----------------------------------
  if (GROQ_API_KEY) {
    try {
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

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) throw new Error(`Groq API error: ${response.status}`);

      const result = await response.json();
      const generatedText = result.choices[0].message.content.trim();
      const parsed = JSON.parse(generatedText);

      if (parsed.isResume === false) {
        return {
          isValid: false,
          reason: parsed.reason || "This file does not appear to be a resume. Please upload a valid PDF resume."
        };
      }

      return { isValid: true };

    } catch (err) {
      console.warn("AI validation failed, falling back to heuristic check:", err.message);
      // Fall through to heuristic check below
    }
  }

  // -- Heuristic fallback (used if AI is unavailable) -------------------
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

