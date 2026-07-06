import { useState, useRef, useEffect } from "react";
import { X, Send, User, Bot, Sparkles } from "lucide-react";
import { mockInterview } from "../services/api";
import ReactMarkdown from "react-markdown";
import "./InterviewChat.css";

function InterviewChat({ resumeText, jobDescription, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize the interview when the chat opens
  useEffect(() => {
    const startInterview = async () => {
      setLoading(true);
      try {
        const res = await mockInterview({
          message: "Hello, I am ready to begin the interview.",
          history: [],
          resumeText,
          jobDescription
        });
        
        setMessages([
          { role: "model", text: res.data.reply }
        ]);
      } catch (err) {
        const errMsg = err.response?.data?.error || "Error connecting to interviewer. Please try again.";
        setMessages([{ role: "model", text: errMsg }]);
      } finally {
        setLoading(false);
      }
    };
    
    startInterview();
  }, [resumeText, jobDescription]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    
    const newMessages = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Format history for Gemini API (only user/model roles are accepted)
      const history = newMessages.slice(0, -1).map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));

      const res = await mockInterview({
        message: userMessage,
        history,
        resumeText,
        jobDescription
      });

      setMessages(prev => [...prev, { role: "model", text: res.data.reply }]);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Sorry, I encountered an error. Please try answering again.";
      setMessages(prev => [...prev, { role: "model", text: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content chat-modal fade-in-up">
        <div className="modal-header chat-header">
          <div className="modal-title">
            <Sparkles size={20} className="c-accent" />
            <div>
              <h2>TechRecruit AI</h2>
              <span className="chat-subtitle">Practice with a technical recruiter</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble-container ${msg.role === "user" ? "chat-right" : "chat-left"}`}>
              <div className="chat-avatar">
                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`chat-bubble ${msg.role === "user" ? "bubble-user" : "bubble-bot"}`}>
                {msg.role === "user" ? (
                  msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)
                ) : (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble-container chat-left fade-in">
              <div className="chat-avatar"><Bot size={16} /></div>
              <div className="chat-bubble bubble-bot bubble-typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <input
            type="text"
            className="chat-input"
            placeholder="Type your answer here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            className="chat-send-btn"
            disabled={!input.trim() || loading}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default InterviewChat;
