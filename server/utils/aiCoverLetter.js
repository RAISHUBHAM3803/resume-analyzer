const getGroqApiKey = () => {
  return process.env.GROQ_API_KEY || process.env.BULLET_REWRITER_API_KEY;
};
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const generateCoverLetter = async (resumeText, jobDescription) => {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
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

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) throw new Error(`Groq API error: ${response.status}`);

    const result = await response.json();
    return result.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI Cover Letter Error:", error.message);
    throw new Error("Failed to generate cover letter.");
  }
};

module.exports = generateCoverLetter;

