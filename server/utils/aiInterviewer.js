const { GoogleGenAI } = require("@google/genai");

// Uses a dedicated key for the Mock Interview feature.
// Falls back to the shared GEMINI_API_KEY if MOCK_INTERVIEW_API_KEY is not set.
const getMockInterviewClient = () => {
  const apiKey = process.env.MOCK_INTERVIEW_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

const chatWithInterviewer = async (message, history, resumeText, jobDescription) => {
  const genAI = getMockInterviewClient();
  if (!genAI) {
    throw new Error("Mock Interview API key is not configured. Please set MOCK_INTERVIEW_API_KEY in your environment variables.");
  }

  try {


    // The system prompt sets the context for the model.
    // In gemini-2.5, we can use systemInstruction if available, but to be safe, we can prepend it to the first user message if history is empty.
    
    let chatHistory = history || [];
    
    if (chatHistory.length === 0) {
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
      chatHistory = [
        { role: "user", parts: [{ text: systemContext }] },
        { role: "model", parts: [{ text: "Understood. I am ready to begin the interview." }] }
      ];
    }

    const chat = genAI.chats.create({
      model: "gemini-2.5-flash",
      history: chatHistory,
    });

    const result = await chat.sendMessage({ message });
    return result.text.trim();
  } catch (error) {
    console.error("Gemini AI Interviewer Error:", error.message);
    if (error.status === 429 || (error.message && error.message.includes("429"))) {
      throw new Error("Your Gemini API quota has been exhausted for today. Please generate a new API key from Google AI Studio and update MOCK_INTERVIEW_API_KEY in Render.");
    } else if (error.status === 503 || (error.message && error.message.includes("503"))) {
      throw new Error("Google AI servers are currently overloaded. Please wait a moment and try again.");
    } else if (error.status === 401 || (error.message && error.message.includes("key"))) {
      throw new Error("Authentication failed. Please verify your MOCK_INTERVIEW_API_KEY in Render.");
    }
    throw new Error(error.message || "Failed to generate response.");
  }
};

module.exports = chatWithInterviewer;
