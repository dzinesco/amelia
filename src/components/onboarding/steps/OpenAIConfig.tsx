import React, { useState } from 'react';
import { Key, Loader2 } from 'lucide-react';
import { useAmeliaStore } from '../../../lib/store/useAmeliaStore';

interface Props {
  onComplete: () => void;
}

export const OpenAIConfig: React.FC<Props> = ({ onComplete }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { initializeAI } = useAmeliaStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await initializeAI(apiKey, ''); // Pinecone key will be added later
      onComplete();
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-cyan-900">OpenAI Configuration</h2>
        <p className="mt-2 text-sm text-cyan-600">
          Connect Amelia to OpenAI's GPT models for natural language processing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cyan-700">
            OpenAI API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
            placeholder="sk-..."
            required
          />
          <p className="mt-2 text-xs text-cyan-500">
            You can find your API key in the OpenAI dashboard
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !apiKey}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Key className="w-4 h-4 mr-2" />
              Connect OpenAI
            </>
          )}
        </button>
      </form>
    </div>
  );
};