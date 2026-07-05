const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const chatWithInterviewer = async (message, history, resumeText, jobDescription) => {
  if (!genAI) {
    throw new Error("Gemini API key is not configured.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

    const chat = model.startChat({
      history: chatHistory,
    });

    const result = await chat.sendMessage(message);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini AI Interviewer Error:", error.message);
    throw new Error("Failed to generate response.");
  }
};

module.exports = chatWithInterviewer;
