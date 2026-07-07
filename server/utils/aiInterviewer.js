const getGroqApiKey = () => {
  return process.env.GROQ_API_KEY || process.env.BULLET_REWRITER_API_KEY;
};
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const chatWithInterviewer = async (message, history, resumeText, jobDescription) => {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error("Mock Interview API key is not configured. Please set MOCK_INTERVIEW_API_KEY in your environment variables.");
  }

  try {
    let chatHistory = history || [];
    let messages = [];

    const systemContext = `
You are an expert Technical Recruiter conducting a mock interview.
The candidate has applied for a role based on this Job Description:
${jobDescription || "A technical role matching their skills."}

Here is their Resume:
${resumeText.substring(0, 3000)}

Instructions:
1. Act exclusively as the interviewer. Never break character.
2. Ask one question at a time.
3. Provide constructive feedback on the candidate's answers based on their resume context.
4. Keep your responses concise (1-2 paragraphs max).
5. Start the interview by introducing yourself briefly and asking the first question.
`;

    messages.push({ role: "system", content: systemContext });

    // Convert existing history to OpenAI/Groq format
    if (chatHistory.length > 0) {
      for (const msg of chatHistory) {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.parts && msg.parts[0] ? msg.parts[0].text : (msg.text || "")
        });
      }
    } else {
      // First turn
      messages.push({ role: "assistant", content: "Understood. I am ready to begin the interview." });
    }

    // Add current user message
    messages.push({ role: "user", content: message });

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: messages,
        temperature: 0.6,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Your AI quota has been exhausted. Please try again later.");
      } else if (response.status === 401) {
        throw new Error("Authentication failed. Please verify your API Key.");
      }
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    return result.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI Interviewer Error:", error.message);
    throw new Error(error.message || "Failed to generate response.");
  }
};

module.exports = chatWithInterviewer;

