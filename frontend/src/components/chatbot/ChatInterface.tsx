/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types/chatbot';
import { MessageSender } from '../../types/chatbot';
import MessageItem from './MessageItem';
import { Send, Menu } from 'lucide-react';
import { AI_SERVICES } from '../../constants/aiServices';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (query: string) => void;
  isLoading: boolean;
  placeholderText?: string;
  initialQuerySuggestions?: string[];
  onSuggestedQueryClick?: (query: string) => void;
  isFetchingSuggestions?: boolean;
  onToggleSidebar?: () => void;
  onServiceSelect?: (service: string) => void;
  colorScheme?: 'blue' | 'green';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  placeholderText,
  initialQuerySuggestions,
  onSuggestedQueryClick,
  isFetchingSuggestions,
  onToggleSidebar,
  onServiceSelect,
  colorScheme = 'blue',
}) => {
  const [userQuery, setUserQuery] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Color classes based on scheme
  const isGreen = colorScheme === 'green';
  const borderColor = isGreen ? 'border-green-200' : 'border-blue-200';
  const bgColor = isGreen ? 'bg-green-50' : 'bg-blue-50';
  const hoverBgColor = isGreen ? 'hover:bg-green-50' : 'hover:bg-blue-50';
  const focusRingColor = isGreen ? 'focus:ring-green-400 focus:border-green-400' : 'focus:ring-blue-400 focus:border-blue-400';
  const buttonBgColor = isGreen ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600';
  const inputBorderColor = isGreen ? 'border-green-300' : 'border-blue-300';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (userQuery.trim() && !isLoading) {
      onSendMessage(userQuery.trim());
      setUserQuery('');
    }
  };

  const showSuggestions = initialQuerySuggestions && initialQuerySuggestions.length > 0 && messages.filter(m => m.sender !== MessageSender.SYSTEM).length <= 1;

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    if (service && onServiceSelect) {
      onServiceSelect(service);
    }
    if (service) {
      onSendMessage(`Tell me about the ${service}`);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-xl shadow-md border ${borderColor}`}>
      <div className={`p-4 border-b ${borderColor}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className={`p-1.5 text-gray-500 hover:text-gray-700 rounded-md ${hoverBgColor} transition-colors md:hidden`}
                aria-label="Open knowledge base"
              >
                <Menu size={20} />
              </button>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-700">AI Services Browser</h2>
              {placeholderText && messages.filter(m => m.sender !== MessageSender.SYSTEM).length === 0 && (
                <p className="text-xs text-gray-600 mt-1 max-w-md truncate" title={placeholderText}>{placeholderText}</p>
              )}
            </div>
          </div>
        </div>

        {/* AI Services Dropdown */}
        <div className="mt-2">
          <select
            value={selectedService}
            onChange={(e) => handleServiceChange(e.target.value)}
            className={`w-full px-3 py-2 text-sm border ${inputBorderColor} rounded-lg focus:ring-2 ${focusRingColor} transition-all outline-none bg-white text-gray-700`}
          >
            <option value="">Select an AI service to learn more...</option>
            {AI_SERVICES.map((service, index) => (
              <option key={index} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={`flex-grow p-4 overflow-y-auto chat-container ${bgColor}`}>
        {/* New wrapper for max-width and centering */}
        <div className="max-w-4xl mx-auto w-full">
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} colorScheme={colorScheme} />
          ))}
          
          {isFetchingSuggestions && (
              <div className="flex justify-center items-center p-3">
                  <div className="flex items-center space-x-1.5 text-[#A8ABB4]">
                      <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                      <span className="text-sm">Fetching suggestions...</span>
                  </div>
              </div>
          )}

          {showSuggestions && onSuggestedQueryClick && (
            <div className="my-3 px-1">
              <p className="text-xs text-[#A8ABB4] mb-1.5 font-medium">Or try one of these: </p>
              <div className="flex flex-wrap gap-1.5">
                {initialQuerySuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onSuggestedQueryClick(suggestion)}
                    className="bg-[#79B8FF]/10 text-[#79B8FF] px-2.5 py-1 rounded-full text-xs hover:bg-[#79B8FF]/20 transition-colors shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className={`p-4 border-t ${borderColor} bg-white rounded-b-xl`}>
        <div className="flex items-center gap-2">
          <textarea
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Ask about the documents..."
            className={`flex-grow h-8 min-h-[32px] py-1.5 px-2.5 border ${inputBorderColor} bg-white text-gray-700 placeholder-gray-500 rounded-lg focus:ring-2 ${focusRingColor} transition-shadow resize-none text-sm`}
            rows={1}
            disabled={isLoading || isFetchingSuggestions}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || isFetchingSuggestions || !userQuery.trim()}
            className={`h-8 w-8 p-1.5 ${buttonBgColor} text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:text-gray-500 flex items-center justify-center flex-shrink-0`}
            aria-label="Send message"
          >
            {(isLoading && messages[messages.length-1]?.isLoading && messages[messages.length-1]?.sender === MessageSender.MODEL) ?
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              : <Send size={16} />
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
