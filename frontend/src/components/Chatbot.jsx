import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
import './Chatbot.css';
import API from '../api/axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm the CleanStreet bot. How can I help you?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput("");
    setIsLoading(true);

    try {
      // Get user ID from local storage if logged in
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.id || user?._id;

      // Call Backend API
      // Note: Adjust URL if your backend runs on a different port/url
      
      const response = await API.post("/chat",{
        message : userMessage,
        userId : userId
      })

      // Add bot response to UI
      setMessages(prev => [...prev, { text: response.data.message, sender: 'bot' }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-title">
              <i className="fas fa-robot"></i> CleanStreet Support
            </div>
            <button className="close-btn" onClick={toggleChat}>&times;</button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-bubble typing">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button className="chat-toggle-btn" onClick={toggleChat}>
        {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-comment-dots"></i>}
      </button>
    </div>
  );
};

export default Chatbot;