import React, { useState } from 'react';
import { Network, Loader2 } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const NetworkConfig: React.FC<Props> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({
    controllerUrl: '',
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Implementation for UniFi connection
      onComplete();
    } catch (error) {
      console.error('Failed to connect UniFi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-cyan-900">Network Setup</h2>
        <p className="mt-2 text-sm text-cyan-600">
          Connect your UniFi controller to enable network management.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cyan-700">
            Controller URL
          </label>
          <input
            type="url"
            value={config.controllerUrl}
            onChange={(e) => setConfig({ ...config, controllerUrl: e.target.value })}
            className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            placeholder="https://unifi.local:8443"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-700">
            Username
          </label>
          <input
            type="text"
            value={config.username}
            onChange={(e) => setConfig({ ...config, username: e.target.value })}
            className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            placeholder="Enter your UniFi username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-700">
            Password
          </label>
          <input
            type="password"
            value={config.password}
            onChange={(e) => setConfig({ ...config, password: e.target.value })}
            className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            placeholder="Enter your UniFi password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-600 via-yellow-500 to-pink-500 hover:from-cyan-700 hover:via-yellow-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Network className="w-4 h-4 mr-2" />
              Connect UniFi
            </>
          )}
        </button>
      </form>
    </div>
  );
};