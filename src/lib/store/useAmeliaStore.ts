import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AIService } from '../services/aiService';
import { MemoryService } from '../services/memoryService';
import { AIMessage } from '../types/ai';
import { APP_CONFIG } from '../config/constants';

interface AmeliaState {
  isListening: boolean;
  messages: AIMessage[];
  isProcessing: boolean;
  personality: string;
  selectedModel: string;
  aiService?: AIService;
  setIsListening: (isListening: boolean) => void;
  addMessage: (message: AIMessage) => void;
  initializeAI: (openAIKey: string, pineconeKey: string) => void;
  processMessage: (content: string) => Promise<void>;
  setPersonality: (personality: string) => Promise<void>;
  setSelectedModel: (model: string) => void;
}

const DEFAULT_PERSONALITY = "Amelia is a friendly and professional AI assistant with a touch of humor. She's direct in her responses but maintains a warm, helpful demeanor. She excels at explaining complex topics in simple terms.";

export const useAmeliaStore = create<AmeliaState>()(
  persist(
    (set, get) => ({
      isListening: false,
      messages: [],
      isProcessing: false,
      personality: DEFAULT_PERSONALITY,
      selectedModel: APP_CONFIG.defaultModel,
      
      setIsListening: (isListening) => set({ isListening }),
      
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      
      initializeAI: (openAIKey, pineconeKey) => {
        const memoryService = new MemoryService(pineconeKey);
        const aiService = new AIService(openAIKey, memoryService);
        set({ aiService });
      },
      
      processMessage: async (content) => {
        const { aiService, messages, addMessage, personality, selectedModel } = get();
        if (!aiService) return;

        set({ isProcessing: true });
        
        try {
          const response = await aiService.processMessage(content, messages, {
            systemPrompt: personality,
            model: selectedModel,
          });
          
          addMessage({
            role: 'assistant',
            content: response,
            timestamp: new Date(),
          });
        } catch (error) {
          console.error('Error processing message:', error);
          addMessage({
            role: 'assistant',
            content: 'I apologize, but I encountered an error processing your request.',
            timestamp: new Date(),
          });
        } finally {
          set({ isProcessing: false });
        }
      },

      setPersonality: async (personality) => {
        set({ personality });
      },

      setSelectedModel: (model) => {
        set({ selectedModel: model });
      },
    }),
    {
      name: 'amelia-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        messages: state.messages,
        personality: state.personality,
        selectedModel: state.selectedModel,
      }),
    }
  )
);