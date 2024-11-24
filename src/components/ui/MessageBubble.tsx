import React from 'react';
import { AIMessage, MessageRole } from '../../lib/types/ai';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: AIMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === MessageRole.User;
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] ${
          isUser
            ? 'bg-blue-500 text-white rounded-l-lg rounded-br-lg'
            : 'bg-white text-gray-800 rounded-r-lg rounded-bl-lg shadow-sm'
        } p-4`}
      >
        <div className="text-sm md:text-base whitespace-pre-wrap">
          {message.content}
        </div>
        {message.timestamp && (
          <div className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-400'
          }`}>
            {format(message.timestamp, 'HH:mm')}
          </div>
        )}
      </div>
    </div>
  );
};