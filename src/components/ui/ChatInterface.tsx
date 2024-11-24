import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Loader2, AlertCircle } from 'lucide-react';
import { useAmeliaStore } from '../../lib/store/useAmeliaStore';
import { voiceService } from '../../lib/services/voiceService';
import { MessageRole } from '../../lib/types/ai';
import { MessageBubble } from './MessageBubble';
import { VoiceIndicator } from './VoiceIndicator';

export const ChatInterface: React.FC = () => {
  const [input, setInput] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    isListening, 
    messages, 
    isProcessing,
    setIsListening, 
    processMessage 
  } = useAmeliaStore();

  useEffect(() => {
    const handleTranscript = (event: CustomEvent<{ transcript: string }>) => {
      setInput(prev => prev + event.detail.transcript);
      setError(null);
    };

    const handleVoiceError = (event: CustomEvent<{ error: string }>) => {
      setError(event.detail.error);
      setIsListening(false);
    };

    window.addEventListener('voice-transcript' as any, handleTranscript as any);
    window.addEventListener('voice-error' as any, handleVoiceError as any);
    
    return () => {
      window.removeEventListener('voice-transcript' as any, handleTranscript as any);
      window.removeEventListener('voice-error' as any, handleVoiceError as any);
    };
  }, [setIsListening]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    
    const userMessage = input.trim();
    setInput('');
    setError(null);
    
    try {
      await processMessage(userMessage);
    } catch (err) {
      setError('Failed to process message. Please try again.');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      try {
        voiceService.startListening();
        setIsListening(true);
        setError(null);
      } catch (err) {
        setError('Voice recognition not available in this browser.');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <div className="flex items-center text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        </div>
      )}
      
      <div className="border-t bg-white p-4">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-full transition-colors ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 text-white" />
                <VoiceIndicator />
              </>
            ) : (
              <Mic className="w-5 h-5 text-gray-600" />
            )}
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? 'Listening...' : 'Type your message...'}
              className="w-full p-3 pr-12 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isProcessing}
            />
            
            <button
              onClick={handleSend}
              disabled={isProcessing || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};