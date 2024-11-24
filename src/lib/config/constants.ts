export const APP_CONFIG = {
  name: 'Amelia AI Assistant',
  version: '1.0.0',
  description: 'Your intelligent personal assistant',
  apiEndpoint: import.meta.env.DEV ? 'http://localhost:3000/api' : 'https://api.amelia-ai.com',
  maxTokens: 2000,
  defaultModel: import.meta.env.VITE_DEFAULT_MODEL || 'gpt-3.5-turbo',
  supportEmail: 'support@amelia-ai.com',
} as const;

export const AVAILABLE_MODELS = [
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective' },
  { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo', description: 'Most capable model' },
] as const;

export const PINECONE_CONFIG = {
  environment: import.meta.env.VITE_PINECONE_ENVIRONMENT,
  apiKey: import.meta.env.VITE_PINECONE_API_KEY,
  indexName: 'amelia-memory',
} as const;

export const OPENAI_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  organization: import.meta.env.VITE_OPENAI_ORG_ID,
} as const;