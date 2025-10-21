/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import type { ChatMessage } from '../../types/chatbot';
import { MessageSender } from '../../types/chatbot';

// Configure marked to use highlight.js for syntax highlighting
marked.setOptions({
  highlight: function(code: string, lang: string) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-', // Prefix for CSS classes
} as any); // Added 'as any' to bypass the type error

interface MessageItemProps {
  message: ChatMessage;
  colorScheme?: 'blue' | 'green';
}

const SenderAvatar: React.FC<{ sender: MessageSender; colorScheme?: 'blue' | 'green' }> = ({ sender, colorScheme = 'blue' }) => {
  const isGreen = colorScheme === 'green';

  if (sender === MessageSender.USER) {
    // User avatar with letter 'U'
    const bgColorClass = isGreen ? 'bg-green-500' : 'bg-blue-500';
    return (
      <div className={`w-8 h-8 rounded-full ${bgColorClass} text-white flex items-center justify-center text-sm font-semibold flex-shrink-0`}>
        U
      </div>
    );
  } else if (sender === MessageSender.MODEL) {
    // AI assistant avatar with custom chat icon
    // Green (John - Customer Service Manager) uses chaticon_1.JPG
    // Blue (Mary - AI Service Assistant) uses chaticon_2.JPG
    const chatIcon = isGreen ? '/chaticon_1.JPG' : '/chaticon_2.JPG';
    const assistantName = isGreen ? 'John - Customer Service Manager' : 'Mary - AI Service Assistant';

    return (
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-200">
        <img
          src={chatIcon}
          alt={assistantName}
          className="w-full h-full object-cover"
        />
      </div>
    );
  } else { // SYSTEM
    // System message avatar with letter 'S'
    return (
      <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
        S
      </div>
    );
  }
};

const MessageItem: React.FC<MessageItemProps> = ({ message, colorScheme = 'blue' }) => {
  const isUser = message.sender === MessageSender.USER;
  const isModel = message.sender === MessageSender.MODEL;
  const isSystem = message.sender === MessageSender.SYSTEM;
  const isGreen = colorScheme === 'green';

  const renderMessageContent = () => {
    if (isModel && !message.isLoading) {
      const proseClasses = "prose prose-sm prose-gray w-full min-w-0";
      const rawMarkup = marked.parse(message.text || "") as string;
      return <div className={proseClasses} dangerouslySetInnerHTML={{ __html: rawMarkup }} />;
    }

    let textColorClass = '';
    if (isUser) {
        textColorClass = 'text-gray-700';
    } else if (isSystem) {
        textColorClass = 'text-gray-600';
    } else { // Model loading
        textColorClass = 'text-gray-700';
    }
    return <div className={`whitespace-pre-wrap text-sm ${textColorClass}`}>{message.text}</div>;
  };
  
  let bubbleClasses = "p-3 rounded-lg shadow w-full "; // Added w-full

  if (isUser) {
    const userBgColor = isGreen ? "bg-green-100" : "bg-blue-100";
    const userBorderColor = isGreen ? "border-green-200" : "border-blue-200";
    bubbleClasses += `${userBgColor} text-gray-700 rounded-br-none border ${userBorderColor}`;
  } else if (isModel) {
    bubbleClasses += "bg-white text-gray-700 rounded-bl-none border border-gray-200";
  } else { // System message
    bubbleClasses += "bg-gray-100 text-gray-600 rounded-bl-none border border-gray-300";
  }

  const loadingDotColor = isUser ? (isGreen ? 'bg-green-600' : 'bg-blue-600') : 'bg-gray-500';

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start gap-2 max-w-[85%]`}>
        {!isUser && <SenderAvatar sender={message.sender} colorScheme={colorScheme} />}
        <div className={bubbleClasses}>
          {message.isLoading ? (
            <div className="flex items-center space-x-1.5">
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s] ${loadingDotColor}`}></div>
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s] ${loadingDotColor}`}></div>
              <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${loadingDotColor}`}></div>
            </div>
          ) : (
            renderMessageContent()
          )}
          
          {isModel && message.urlContext && message.urlContext.length > 0 && (
            <div className="mt-2.5 pt-2.5 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-600 mb-1">Context URLs Retrieved:</h4>
              <ul className="space-y-0.5">
                {message.urlContext.map((meta, index) => {
                  const statusText = typeof meta.urlRetrievalStatus === 'string'
                    ? meta.urlRetrievalStatus.replace('URL_RETRIEVAL_STATUS_', '')
                    : 'UNKNOWN';
                  const isSuccess = meta.urlRetrievalStatus === 'URL_RETRIEVAL_STATUS_SUCCESS';

                  return (
                    <li key={index} className="text-[11px] text-gray-600">
                      <a href={meta.retrievedUrl} target="_blank" rel="noopener noreferrer" className="hover:underline break-all text-blue-600">
                        {meta.retrievedUrl}
                      </a>
                      <span className={`ml-1.5 px-1 py-0.5 rounded-sm text-[9px] ${
                        isSuccess
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {statusText}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        {isUser && <SenderAvatar sender={message.sender} colorScheme={colorScheme} />}
      </div>
    </div>
  );
};

export default MessageItem;
