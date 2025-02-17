import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useContext(AuthContext);

  // Initialize with welcome message based on user type
  useEffect(() => {
    const welcomeMessage = user?.role === 'patient' 
      ? "Hello Pam! I'm your Care Companion. How can I help you today?"
      : "Hello Laurel! I'm here to help you care for Pam. What would you like to know?";
    
    setMessages([{
      id: 1,
      text: welcomeMessage,
      sender: 'bot'
    }]);
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = { 
      id: Date.now(), 
      text: newMessage, 
      sender: 'user' 
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chatbot/chat`, {
        message: newMessage,
        user_type: user.role
      });

      const botMessage = { 
        id: Date.now(), 
        text: response.data.response, 
        sender: 'bot'
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      // Handle alerts for caregivers
      if (response.data.alert && user.role === 'caregiver') {
        const alertMessage = {
          id: Date.now() + 1,
          text: `⚠️ Alert: ${response.data.alert_message}`,
          sender: 'alert'
        };
        setMessages((prevMessages) => [...prevMessages, alertMessage]);
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      const errorMessage = {
        id: Date.now(),
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'bot'
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    // Implement voice input functionality
    console.log('Voice input clicked');
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Chat Header */}
      <div className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Care Companion</h2>
            <p className="text-sm text-indigo-600">Always here to help</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-indigo-500 text-white rounded-br-none'
                  : message.sender === 'alert'
                  ? 'bg-amber-100 border-l-4 border-amber-500 text-amber-900'
                  : 'bg-white shadow-md rounded-bl-none'
              }`}
            >
              <p className={`text-lg ${
                message.sender === 'user' 
                  ? 'text-white' 
                  : message.sender === 'alert'
                  ? 'text-amber-900'
                  : 'text-slate-900'
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white shadow-md rounded-lg px-4 py-3 rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <button
            type="button"
            onClick={handleVoiceInput}
            className="p-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 border-2 border-indigo-100 rounded-full px-6 py-3 focus:outline-none focus:border-indigo-500 transition-colors text-lg text-slate-900 placeholder-slate-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white rounded-full p-3 hover:bg-indigo-600 transition-colors disabled:opacity-50"
            disabled={isTyping}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot; 