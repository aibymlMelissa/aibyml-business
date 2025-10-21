import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Minimize2, MessageSquare, Mic, MicOff } from 'lucide-react';
import type { CreateServiceRequestDTO } from '../types/index.js';
import { TalkingFace } from './TalkingFace.jsx';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
}

interface ChatbotProps {
  onFormPreFill: (data: Partial<CreateServiceRequestDTO>) => void;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export function Chatbot({ onFormPreFill, isMinimized, onToggleMinimize }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! I'm your AI assistant. I can help you create a service request. What can I help you with today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastBotMessage, setLastBotMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: 'typing',
      content: '...',
      sender: 'bot',
      timestamp: new Date(),
      typing: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await fetch('/api/chatbot/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
          conversationHistory: messages.filter(m => !m.typing).map(m => ({
            content: m.content,
            sender: m.sender
          }))
        }),
      });

      const data = await response.json();

      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== 'typing'));

      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        content: data.response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setLastBotMessage(data.response);

      // If AI suggests form pre-fill data
      if (data.suggestedFormData) {
        onFormPreFill(data.suggestedFormData);
      }
    } catch (error) {
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again or fill out the form directly.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={onToggleMinimize}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <TalkingFace 
              isActive={!isMinimized} 
              message={lastBotMessage}
              onSpeakingStateChange={() => {
                // Optional: Add speaking state handling
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-sm text-blue-100">Here to help with your request</p>
          </div>
        </div>
        <button
          onClick={onToggleMinimize}
          className="text-blue-100 hover:text-white p-1"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'bot' && (
                  <Bot className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                )}
                {message.sender === 'user' && (
                  <User className="w-4 h-4 mt-0.5 text-blue-100 flex-shrink-0" />
                )}
                <div className="flex-1">
                  {message.typing ? (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                  <span className={`text-xs ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  } block mt-1`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <button
            onClick={startVoiceInput}
            disabled={isLoading || isListening}
            className={`p-2 rounded-md transition-colors ${
              isListening
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } disabled:opacity-50`}
            title="Voice input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send • {isListening ? 'Listening...' : 'Click mic for voice input'}
        </p>
      </div>
    </div>
  );
}