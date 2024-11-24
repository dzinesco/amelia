import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ChatManager } from '../integrations/chat/ChatManager';
import { ChatConfig, ChatPlatform } from '../integrations/chat/types';

interface ChatState {
  manager: ChatManager;
  configs: ChatConfig[];
  isInitialized: boolean;
  initialize: (configs: ChatConfig[]) => Promise<void>;
  shutdown: () => Promise<void>;
  updateConfig: (platform: ChatPlatform, updates: Partial<ChatConfig>) => void;
  broadcastMessage: (content: string, platforms?: ChatPlatform[]) => Promise<void>;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      manager: new ChatManager(),
      configs: [],
      isInitialized: false,

      initialize: async (configs) => {
        const { manager } = get();
        await manager.initialize(configs);
        set({ configs, isInitialized: true });
      },

      shutdown: async () => {
        const { manager } = get();
        await manager.shutdown();
        set({ isInitialized: false });
      },

      updateConfig: (platform, updates) => {
        set((state) => ({
          configs: state.configs.map(config =>
            config.platform === platform
              ? { ...config, ...updates }
              : config
          )
        }));
      },

      broadcastMessage: async (content, platforms) => {
        const { manager } = get();
        await manager.broadcastMessage(content, platforms);
      },
    }),
    {
      name: 'chat-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        configs: state.configs,
        isInitialized: state.isInitialized,
      }),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            configs: [],
            isInitialized: false,
          };
        }
        return persistedState;
      },
    }
  )
);