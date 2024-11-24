import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

interface PineconeState {
  client: Pinecone | null;
  openai: OpenAI | null;
  isConnected: boolean;
  credentials: {
    apiKey: string;
    environment: string;
    openAIKey: string;
  } | null;
  connect: (apiKey: string, environment: string, openAIKey: string) => Promise<void>;
  disconnect: () => void;
  uploadDocument: (filename: string, content: string) => Promise<void>;
}

export const usePineconeStore = create<PineconeState>()(
  persist(
    (set, get) => ({
      client: null,
      openai: null,
      isConnected: false,
      credentials: null,

      connect: async (apiKey: string, environment: string, openAIKey: string) => {
        try {
          const pinecone = new Pinecone({ apiKey, environment });
          const openai = new OpenAI({ apiKey: openAIKey });
          
          set({ 
            client: pinecone,
            openai,
            isConnected: true,
            credentials: { apiKey, environment, openAIKey }
          });
        } catch (error) {
          console.error('Failed to connect to Pinecone:', error);
          throw error;
        }
      },

      disconnect: () => {
        set({ 
          client: null,
          openai: null,
          isConnected: false,
          credentials: null
        });
      },

      uploadDocument: async (filename: string, content: string) => {
        const { client, openai, isConnected } = get();
        
        if (!client || !openai || !isConnected) {
          throw new Error('Not connected to Pinecone');
        }

        try {
          const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: content,
          });

          const embedding = response.data[0].embedding;

          const index = client.index('amelia-docs');
          await index.upsert([{
            id: `doc_${Date.now()}_${filename}`,
            values: embedding,
            metadata: {
              filename,
              content,
              timestamp: new Date().toISOString()
            }
          }]);
        } catch (error) {
          console.error('Failed to upload document:', error);
          throw error;
        }
      }
    }),
    {
      name: 'pinecone-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        credentials: state.credentials,
        isConnected: state.isConnected,
      }),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            credentials: null,
            isConnected: false,
          };
        }
        return persistedState;
      },
    }
  )
);