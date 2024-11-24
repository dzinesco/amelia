import React, { useState } from 'react';
import { Phone, Loader2 } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const ThreeCXConfig: React.FC<Props> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({
    apiKey: '',
    baseUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Implementation for 3CX connection
      onComplete();
    } catch (error) {
      console.error('Failed to connect 3CX:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-cyan-900">3CX Phone System</h2>
        <p className="mt-2 text-sm text-cyan-600">
          Connect your 3CX phone system for call and message management.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cyan-700">
            API Key
          </label>
          <input
            type="password"
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            placeholder="Enter your 3CX API key"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-700">
            Base URL
          </label>
          <input
            type="url"
            value={config.baseUrl}
            onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
            className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            placeholder="https://your-3cx-instance.com/api"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-600 via-pink-500 to-yellow-500 hover:from-cyan-700 hover:via-pink-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Phone className="w-4 h-4 mr-2" />
              Connect 3CX
            </>
          )}
        </button>
      </form>
    </div>
  );
};