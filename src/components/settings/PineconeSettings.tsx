import React, { useState } from 'react';
import { Database, Key, Loader2 } from 'lucide-react';
import { usePineconeStore } from '../../lib/store/usePineconeStore';

export const PineconeSettings = () => {
  const [credentials, setCredentials] = useState({
    apiKey: '',
    environment: '',
    openAIKey: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { connect, disconnect, isConnected } = usePineconeStore();

  const handleConnect = async () => {
    if (!credentials.apiKey || !credentials.environment || !credentials.openAIKey) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await connect(credentials.apiKey, credentials.environment, credentials.openAIKey);
    } catch (error) {
      alert('Failed to connect to Pinecone');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-cyan-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Database className="w-5 h-5 text-cyan-500" />
          <h2 className="text-lg font-medium text-cyan-900">Pinecone Configuration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyan-700">API Key</label>
            <input
              type="password"
              value={credentials.apiKey}
              onChange={(e) => setCredentials(prev => ({ ...prev, apiKey: e.target.value }))}
              className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              placeholder="Enter your Pinecone API key"
              disabled={isConnected}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-700">Environment</label>
            <input
              type="text"
              value={credentials.environment}
              onChange={(e) => setCredentials(prev => ({ ...prev, environment: e.target.value }))}
              className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              placeholder="e.g., us-east-1-aws"
              disabled={isConnected}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-700">OpenAI API Key</label>
            <input
              type="password"
              value={credentials.openAIKey}
              onChange={(e) => setCredentials(prev => ({ ...prev, openAIKey: e.target.value }))}
              className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              placeholder="Enter your OpenAI API key"
              disabled={isConnected}
            />
          </div>

          <div className="pt-4">
            <button
              onClick={isConnected ? disconnect : handleConnect}
              disabled={isLoading}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isConnected
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-cyan-600 hover:bg-cyan-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : isConnected ? (
                'Disconnect'
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Connect
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};