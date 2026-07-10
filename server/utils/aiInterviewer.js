const { getGeminiClient, markCurrentKeyExhausted, isQuotaError, GEMINI_MODEL } = require("./geminiKeyManager");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const getGroqKey = () => process.env.GROQ_API_KEY || process.env.BULLET_REWRITER_API_KEY;

const buildSystemPrompt = (resumeText, jobDescription) => `
You are an expert Technical Recruiter conducting a mock interview.
Candidate applied for: ${jobDescription || "A technical role matching their skills."}
Candidate Resume: ${resumeText.substring(0, 3000)}
Instructions:
1. Act exclusively as the interviewer. Never break character.
2. Ask one question at a time and wait for the response.
3. Provide brief constructive feedback on answers.
4. Keep responses concise (1-2 paragraphs max).
5. Start by introducing yourself briefly and asking the first technical question.`;

const chatWithInterviewer = async (message, history, resumeText, jobDescription) => {
  const systemPrompt = buildSystemPrompt(resumeText, jobDescription);

  // Try Gemini with key rotation
  let geminiClient = getGeminiClient();
  while (geminiClient) {
    try {
      let chatHistory = [];
      if (history && history.length > 0) {
        // Convert from Gemini parts format to plain text if needed
        for (const msg of history) {
          const text = msg.parts ? msg.parts[0].text : (msg.text || "");
          chatHistory.push({ role: msg.role === "user" ? "user" : "model", parts: [{ text }] });
        }
      } else {
        chatHistory = [
          { role: "user", parts: [{ text: systemPrompt }] },
          { role: "model", parts: [{ text: "Understood. I am ready to begin the mock interview." }] }
        ];
      }

      const chat = geminiClient.chats.create({ model: GEMINI_MODEL, history: chatHistory });
      const result = await chat.sendMessage({ message });
      console.log("Mock Interview: Gemini 2.0 Flash");
      return result.text.trim();
    } catch (err) {
      if (isQuotaError(err)) {
        markCurrentKeyExhausted();
        geminiClient = getGeminiClient();
        continue;
      }
      console.warn("Gemini interviewer error, falling back to Groq:", err.message.substring(0, 60));
      break;
    }
  }

  // Groq fallback
  const groqKey = getGroqKey();
  if (groqKey) {
    try {
      const messages = [{ role: "system", content: systemPrompt }];

      if (history && history.length > 0) {
        for (const msg of history) {
          const text = msg.parts ? msg.parts[0].text : (msg.text || "");
          messages.push({ role: msg.role === "user" ? "user" : "assistant", content: text });
        }
      }
      messages.push({ role: "user", content: message });

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${groqKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages,
          temperature: 0.6,
          max_tokens: 800
        })
      });

      if (response.status === 429) throw new Error("Groq quota also exhausted. Please try again in a moment.");
      if (!response.ok) throw new Error(`Groq API error: ${response.status}`);

      const result = await response.json();
      console.log("Mock Interview: Groq Llama 3.1 (fallback)");
      return result.choices[0].message.content.trim();
    } catch (err) {
      throw new Error(err.message || "All AI services are currently unavailable. Please try again.");
    }
  }

  throw new Error("No AI API key is configured. Please set GEMINI_KEY_1 or BULLET_REWRITER_API_KEY.");
};

module.exports = chatWithInterviewer;
