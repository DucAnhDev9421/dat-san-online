import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useMobile from '../../hook/use-mobile';
import useToggle from '../../hook/use-toggle';
import chatbotAvatar from '../../assets/chatbot.png';
import './ChatButton.css';

const ChatButton = () => {
  const location = useLocation();
  const isMobile = useMobile(768);
  const [isOpen, { toggle: toggleChat }] = useToggle(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Hide chat button on auth pages, admin pages, and owner pages
  const authPages = ['/login', '/register', '/verify-otp', '/forgot-password', '/reset-password', '/auth/callback', '/auth/error'];
  const isAuthPage = authPages.some(path => location.pathname.startsWith(path));
  const isAdminPage = location.pathname.startsWith('/admin');
  const isOwnerPage = location.pathname.startsWith('/owner');

  // Simulate typing effect
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Don't render chat button on auth pages, admin pages, or owner pages
  if (isAuthPage || isAdminPage || isOwnerPage) {
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      <button 
        className={`chat-button ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
        title="Chat với AI Assistant"
      >
        <svg 
          className="chat-icon" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" 
            fill="currentColor"
          />
          <path 
            d="M7 9H17V11H7V9ZM7 12H15V14H7V12Z" 
            fill="currentColor"
          />
        </svg>
        {!isOpen && <span className="chat-badge">AI</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="chat-window"
          style={isMobile ? {
            width: 'calc(100vw - 40px)',
            height: 'calc(100vh - 120px)',
            bottom: '80px',
            right: '20px',
            left: '20px'
          } : undefined}
        >
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <img src={chatbotAvatar} alt="Chatbot Avatar" />
              </div>
              <div className="chat-header-text">
                <h4>AI Assistant</h4>
                <span className="status">Đang hoạt động</span>
              </div>
            </div>
            <button className="close-button" onClick={toggleChat}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          
          <div className="chat-messages">
            <div className="message bot-message">
              <div className="message-avatar">
                <img src={chatbotAvatar} alt="Chatbot Avatar" />
              </div>
              <div className="message-content">
                <p>Xin chào! Tôi là AI Assistant. Tôi có thể giúp bạn:</p>
                <ul>
                  <li>Hỗ trợ đặt sân</li>
                  <li>Trả lời câu hỏi về dịch vụ</li>
                  <li>Hướng dẫn sử dụng website</li>
                </ul>
                <span className="message-time">Vừa xong</span>
              </div>
            </div>
            
            {isTyping && (
              <div className="message bot-message typing-message">
                <div className="message-avatar">
                  <img src={chatbotAvatar} alt="Chatbot Avatar" />
                </div>
                <div className="message-content typing-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="chat-input">
            <div className="input-container">
              <input 
                type="text" 
                placeholder="Nhập tin nhắn của bạn..." 
                className="message-input"
              />
              <button className="send-button">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;
