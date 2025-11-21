import React, { useState, useRef, useEffect } from 'react';
import './AIChatbox.css';

const AIChatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m your AI assistant. How can I help you with your construction management today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const chatboxRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle dragging
  const handleMouseDown = (e) => {
    if (e.target.closest('.chatbox-header-drag')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Simulate AI response
  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Context-aware responses based on construction management
    if (lowerMessage.includes('project') || lowerMessage.includes('create')) {
      return 'To create a new project, navigate to the Projects page and click the "+ Add Project" button. Fill in the project name, description, dates, and status. Would you like help with anything else?';
    } else if (lowerMessage.includes('task')) {
      return 'Tasks can be created within each project. Go to a project\'s detail page and click "+ Add Task". You can assign tasks to employees, set priorities, and track their status. Need more guidance?';
    } else if (lowerMessage.includes('resource') || lowerMessage.includes('material') || lowerMessage.includes('machinery')) {
      return 'The Resources page lets you manage both materials and machinery. You can track quantities, availability, and assign resources to specific projects. Would you like to know more about resource management?';
    } else if (lowerMessage.includes('employee') || lowerMessage.includes('team')) {
      return 'If you\'re an Admin, you can manage employees from the Employees page. You can add new team members, view their details, and track their assigned tasks. Is there anything specific you\'d like to know?';
    } else if (lowerMessage.includes('dashboard')) {
      return 'The Dashboard provides an overview of your projects and tasks. It shows statistics like total projects, active projects, and pending tasks. You can also see recent projects and upcoming tasks at a glance.';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return 'I can help you with:\n• Creating and managing projects\n• Assigning and tracking tasks\n• Managing resources (materials & machinery)\n• Employee management\n• Navigation tips\n\nWhat would you like assistance with?';
    } else if (lowerMessage.includes('status')) {
      return 'You can update project and task statuses directly from their respective pages. Projects can be in Planning, In Progress, On Hold, Completed, or Cancelled. Tasks can be Pending, In Progress, Completed, or Blocked.';
    } else {
      return 'I\'m here to help you with the Construction Management System. You can ask me about projects, tasks, resources, employees, or any feature of the system. What would you like to know?';
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: generateAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        text: 'Chat cleared. How can I assist you?',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className={`ai-chatbox-toggle ${isOpen ? 'hidden' : ''}`}
        onClick={toggleChatbox}
        title="Open AI Assistant"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Chatbox */}
      {isOpen && (
        <div
          ref={chatboxRef}
          className="ai-chatbox"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: isDragging ? 'grabbing' : 'default'
          }}
        >
          {/* Header */}
          <div className="chatbox-header" onMouseDown={handleMouseDown}>
            <div className="chatbox-header-drag">
              <div className="chatbox-header-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="chatbox-header-info">
                <h3>AI Assistant</h3>
                <span className="chatbox-status">
                  <span className="status-dot"></span> Online
                </span>
              </div>
            </div>
            <div className="chatbox-header-actions">
              <button onClick={clearChat} title="Clear chat" className="header-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button onClick={toggleChatbox} title="Close chat" className="header-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbox-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-avatar">
                  {message.type === 'bot' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot typing">
                <div className="message-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="chatbox-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button type="submit" disabled={inputMessage.trim() === ''}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbox;
