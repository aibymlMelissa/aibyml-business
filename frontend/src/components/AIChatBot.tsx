import React, { useState, useEffect, useCallback } from 'react';
import type { ChatMessage } from '../types/chatbot';
import { MessageSender } from '../types/chatbot';
import { generateContentWithUrlContext } from '../services/geminiService';
import ChatInterface from './chatbot/ChatInterface';
import { AI_SERVICES, AI_SERVICES_MAP, DEFAULT_AI_SERVICE_URLS } from '../constants/aiServices';

interface AIChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'general' | 'service-request' | 'customer-service';
}

const AIChatBot: React.FC<AIChatBotProps> = ({ isOpen, onClose, mode = 'general' }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');

  useEffect(() => {
    if (isOpen && chatMessages.length === 0) {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      let welcomeMessage = '';
      if (!apiKey) {
        welcomeMessage = 'ERROR: Gemini API Key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.';
      } else if (mode === 'customer-service') {
        welcomeMessage = 'Hello! I\'m John, your AI Customer Service Manager powered by GPT-4o from OpenAI. 👋\n\n' +
          'I\'m here to help you with your service request as a valued subscriber. I can assist you with:\n\n' +
          '• Understanding your current subscription and services\n' +
          '• Troubleshooting issues with your AI services\n' +
          '• Guiding you through maintenance requests\n' +
          '• Explaining service features and capabilities\n' +
          '• Escalating urgent matters to our technical team\n\n' +
          'Please tell me about your issue, and I\'ll help you fill out the service request form or resolve it directly if possible. What brings you here today?';
      } else if (mode === 'service-request') {
        welcomeMessage = 'Hello! I\'m Mary, powered by GPT-4o from OpenAI. I\'m here to help you with your service request. Please tell me:\n\n' +
          '1. Your username or account email\n' +
          '2. Which AI service you\'re subscribed to\n' +
          '3. What type of service you need (maintenance, feature update, support, etc.)\n' +
          '4. The urgency level\n' +
          '5. A description of your issue or request\n\n' +
          'I\'ll help collect this information and can fill out the service request form for you!';
      } else {
        welcomeMessage = 'Hello! I\'m Mary, your AI assistant powered by GPT-4o from OpenAI. 👋\n\n' +
          'I\'m here to introduce you to our AI services from AIbyML.com. We offer:\n\n' +
          AI_SERVICES.map(service => `• ${service}`).join('\n') + '\n\n' +
          'How can I help you today? Feel free to ask about any of our services or select one from the dropdown menu above!';
      }

      setChatMessages([{
        id: `system-welcome-${Date.now()}`,
        text: welcomeMessage,
        sender: MessageSender.SYSTEM,
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, mode]);

  const handleSendMessage = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setChatMessages(prev => [...prev, {
        id: `error-apikey-${Date.now()}`,
        text: 'ERROR: API Key is not configured. Please contact support.',
        sender: MessageSender.SYSTEM,
        timestamp: new Date(),
      }]);
      return;
    }

    setIsLoading(true);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: query,
      sender: MessageSender.USER,
      timestamp: new Date(),
    };

    const modelPlaceholderMessage: ChatMessage = {
      id: `model-response-${Date.now()}`,
      text: 'Thinking...',
      sender: MessageSender.MODEL,
      timestamp: new Date(),
      isLoading: true,
    };

    setChatMessages(prevMessages => [...prevMessages, userMessage, modelPlaceholderMessage]);

    try {
      // Add context based on mode
      let enhancedQuery = query;
      if (mode === 'customer-service') {
        enhancedQuery = `As John, the AI Customer Service Manager for AIbyML.com, help the subscriber with their issue. You are assisting an existing customer with their subscribed AI service. Be professional, empathetic, and solution-oriented. Focus on: troubleshooting, explaining service features, guiding through maintenance requests, and helping fill out service request forms when needed. Current user message: ${query}`;
      } else if (mode === 'service-request') {
        enhancedQuery = `As an AI assistant helping with service requests, please help collect the following information from the user: username/email, subscribed AI service, request type (maintenance, feature update, support, etc.), urgency level, and detailed description. Current user message: ${query}`;
      }

      // Determine which URLs to use based on selected service
      let urlsToSearch: string[] = DEFAULT_AI_SERVICE_URLS;

      // Check if the query is asking about a specific service
      for (const [serviceName, serviceUrl] of Object.entries(AI_SERVICES_MAP)) {
        if (query.toLowerCase().includes(serviceName.toLowerCase()) || selectedService === serviceName) {
          // Use specific service URL when asking about that service
          urlsToSearch = [serviceUrl, "https://www.aibyml.com"];
          break;
        }
      }

      const response = await generateContentWithUrlContext(enhancedQuery, urlsToSearch);
      setChatMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === modelPlaceholderMessage.id
            ? { ...modelPlaceholderMessage, text: response.text || "I received an empty response.", isLoading: false, urlContext: response.urlContextMetadata }
            : msg
        )
      );
    } catch (e: any) {
      const errorMessage = e.message || 'Failed to get response from AI.';
      setChatMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === modelPlaceholderMessage.id
            ? { ...modelPlaceholderMessage, text: `Error: ${errorMessage}`, sender: MessageSender.SYSTEM, isLoading: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Determine color scheme based on mode
  const isCustomerService = mode === 'customer-service';
  const gradientClass = isCustomerService
    ? 'bg-gradient-to-br from-green-50 to-green-100'
    : 'bg-gradient-to-br from-blue-50 to-blue-100';
  const borderClass = isCustomerService ? 'border-green-200' : 'border-blue-200';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`${gradientClass} rounded-xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col`}>
        {/* Header */}
        <div className={`p-4 border-b ${borderClass} flex justify-between items-center`}>
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              {mode === 'customer-service'
                ? 'AI Customer Service Manager'
                : mode === 'service-request'
                  ? 'Service Request Assistant'
                  : 'AI Service Assistant'}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              {mode === 'customer-service'
                ? 'John is here to help with your subscription and service issues'
                : mode === 'service-request'
                  ? 'I\'ll help you describe your service request'
                  : 'Ask me anything about our AI services'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close chat"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholderText="Ask about our AI services..."
            onServiceSelect={setSelectedService}
            colorScheme={isCustomerService ? 'green' : 'blue'}
          />
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;
