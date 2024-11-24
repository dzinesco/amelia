import React, { useState } from 'react';
import { Apple, Loader2 } from 'lucide-react';
import { useAppleStore } from '../../../lib/store/useAppleStore';

interface Props {
  onComplete: () => void;
}

export const AppleConfig: React.FC<Props> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({
    teamId: '',
    keyId: '',
    bundleId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Implementation for Apple services connection
      onComplete();
    } catch (error) {
      console.error('Failed to connect Apple services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-cyan-900">Apple Services</h2>
        <p className="mt-2 text-sm text-cyan-600">
          Configure Apple services integration for iOS and macOS devices.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cyan-700">
            Team ID
          </label>
          <input
            type="text"
            value={config.teamId}
            onChange={(e) => setConfig({ ...config, teamId: e.target.value })}
            className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            placeholder="Enter your Apple Team ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-700">
            Key ID
          </label>
          <input
            type="text"
            value={config.keyId}
            onChange={(e) => setConfig({ ...config, keyId: e.target.value })}
            className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            placeholder="Enter your Key ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-cyan-700">
            Bundle ID
          </label>
          <input
            type="text"
            value={config.bundleId}
            onChange={(e) => setConfig({ ...config, bundleId: e.target.value })}
            className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            placeholder="com.example.app"
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
              <Apple className="w-4 h-4 mr-2" />
              Connect Apple Services
            </>
          )}
        </button>
      </form>
    </div>
  );
};