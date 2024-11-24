import React, { useState } from 'react';
import { Home, Loader2 } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const SmartHomeConfig: React.FC<Props> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({
    hubIp: '',
    accessToken: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Implementation for smart home connection
      onComplete();
    } catch (error) {
      console.error('Failed to connect smart home:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-cyan-900">Smart Home Setup</h2>
        <p className="mt-2 text-sm text-cyan-600">
          Connect your Hubitat hub to enable smart home controls.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cyan-700">
            Hub IP Address
          </label>
          <input
            type="text"
            value={config.hubIp}
            onChange={(e) => setConfig({ ...config, hubIp: e.target.value })}
            className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            placeholder="192.168.1.x"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-700">
            Access Token
          </label>
          <input
            type="password"
            value={config.accessToken}
            onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
            className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            placeholder="Enter your Hubitat access token"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Home className="w-4 h-4 mr-2" />
              Connect Smart Home
            </>
          )}
        </button>
      </form>
    </div>
  );
};