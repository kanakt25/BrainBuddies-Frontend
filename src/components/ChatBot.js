import React, { useState } from "react";
import axios from "axios";
import '../styles/ChatBot.css';
import { MessageCircle, X } from "lucide-react";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hi! I'm JNU Assistant. How can I help you?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chat/chat", { message: input });
      setMessages([...newMessages, { role: "bot", content: res.data.reply }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { role: "bot", content: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chat-assistant-toggle"
        aria-label="Toggle Chat Assistant"
      >
        {isOpen ? <X className="chat-icon" /> : <MessageCircle className="chat-icon" />}

      </button>

      {isOpen && (
        <div className="chat-assistant-window">
          <h3 className="chat-assistant-title">JNU-AI Assistant</h3>
          <div className="chat-assistant-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                <span>{msg.content}</span>
              </div>
            ))}
            {loading && <div className="chat-loading">Typing...</div>}
          </div>
          <div className="chat-assistant-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask a question..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
