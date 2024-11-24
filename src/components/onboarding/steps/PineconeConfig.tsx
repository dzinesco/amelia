import React, { useState } from 'react';
import { Database, Loader2 } from 'lucide-react';
import { usePineconeStore } from '../../../lib/store/usePineconeStore';

interface Props {
  onComplete: () => void;
}

export const PineconeConfig: React.FC<Props> = ({ onComplete }) => {
  const [credentials, setCredentials] = useState({
    apiKey: '',
    environment: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { connect } = usePineconeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await connect(credentials.apiKey, credentials.environment);
      onComplete();
    } catch (error) {
      console.error('Failed to connect to Pinecone:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-cyan-900">Pinecone Setup</h2>
        <p className="mt-2 text-sm text-cyan-600">
          Configure Pinecone for long-term memory and document storage.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cyan-700">
            API Key
          </label>
          <input
            type="password"
            value={credentials.apiKey}
            onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
            className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
            placeholder="Enter your Pinecone API key"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-700">
            Environment
          </label>
          <input
            type="text"
            value={credentials.environment}
            onChange={(e) => setCredentials({ ...credentials, environment: e.target.value })}
            className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
            placeholder="e.g., us-east-1-aws"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !credentials.apiKey || !credentials.environment}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Database className="w-4 h-4 mr-2" />
              Connect Pinecone
            </>
          )}
        </button>
      </form>
    </div>
  );
};