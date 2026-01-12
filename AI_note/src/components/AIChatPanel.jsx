import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose, IoMdSend } from "react-icons/io";
import ReactMarkdown from "react-markdown";
import aiService from "../services/ai";

const AIChatPanel = ({ isOpen, onClose, noteContext }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I can help you analyze this document. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await aiService.chatWithAI(input, noteContext);
      const aiMessage = { role: "assistant", content: result.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 350, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col border-l border-white/10 bg-bg-surface flex-shrink-0"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-indigo-600/10">
        <h2 className="font-semibold text-sm text-text-main">
          Document Assistant
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-white"
        >
          <IoMdClose size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[90%] p-3 rounded-lg text-sm ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-bg-base border border-white/10 text-text-main rounded-bl-none"
              }`}
            >
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-bg-base border border-white/10 p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div
                  className="w-1.5 h-1.5 bg-text-muted/50 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-1.5 h-1.5 bg-text-muted/50 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-1.5 h-1.5 bg-text-muted/50 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-bg-base/30">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about this document..."
            className="flex-1 p-2 bg-bg-base border border-white/10 rounded-md text-sm text-text-main placeholder:text-text-muted/30 focus:outline-none focus:border-accent/50"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <IoMdSend size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChatPanel;
