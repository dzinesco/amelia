import React, { useState } from 'react';
import { Apple, Key, Loader2, Smartphone, Monitor } from 'lucide-react';
import { useAppleStore } from '../../lib/store/useAppleStore';
import { AppleDevice, ApplePlatform } from '../../lib/integrations/apple/types';

export const AppleSettings = () => {
  const { isInitialized, initialize, devices, addDevice } = useAppleStore();
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({
    teamId: '',
    keyId: '',
    privateKey: '',
    bundleId: '',
    pushCertificate: '',
  });

  const handleConnect = async () => {
    if (!config.teamId || !config.keyId || !config.bundleId) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      initialize(config);
    } catch (error) {
      alert('Failed to initialize Apple integration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDevice = async (platform: ApplePlatform) => {
    const device: AppleDevice = {
      id: `${platform}_${Date.now()}`,
      name: `Test ${platform} Device`,
      platform,
      osVersion: '16.0',
      model: 'Test Model',
      pushToken: 'test-token',
    };
    addDevice(device);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-cyan-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Apple className="w-5 h-5 text-cyan-500" />
          <h2 className="text-lg font-medium text-cyan-900">Apple Integration</h2>
        </div>

        {!isInitialized ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-700">Team ID</label>
              <input
                type="text"
                value={config.teamId}
                onChange={(e) => setConfig(prev => ({ ...prev, teamId: e.target.value }))}
                className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                placeholder="Enter your Apple Team ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700">Key ID</label>
              <input
                type="text"
                value={config.keyId}
                onChange={(e) => setConfig(prev => ({ ...prev, keyId: e.target.value }))}
                className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                placeholder="Enter your Key ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-700">Bundle ID</label>
              <input
                type="text"
                value={config.bundleId}
                onChange={(e) => setConfig(prev => ({ ...prev, bundleId: e.target.value }))}
                className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
                placeholder="com.example.app"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={handleConnect}
                disabled={isLoading}
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
                    Connect Apple Services
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-cyan-700 mb-4">Connected Devices</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {devices.map(device => (
                  <div key={device.id} className="bg-cyan-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {device.platform === ApplePlatform.iOS ? (
                        <Smartphone className="w-5 h-5 text-cyan-600" />
                      ) : (
                        <Monitor className="w-5 h-5 text-cyan-600" />
                      )}
                      <span className="text-sm font-medium text-cyan-700">{device.name}</span>
                    </div>
                    <p className="mt-1 text-xs text-cyan-600">{device.model} ({device.osVersion})</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleAddDevice(ApplePlatform.iOS)}
                className="inline-flex items-center px-4 py-2 border border-cyan-300 rounded-md shadow-sm text-sm font-medium text-cyan-700 bg-white hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Add iOS Device
              </button>
              <button
                onClick={() => handleAddDevice(ApplePlatform.macOS)}
                className="inline-flex items-center px-4 py-2 border border-cyan-300 rounded-md shadow-sm text-sm font-medium text-cyan-700 bg-white hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              >
                <Monitor className="w-4 h-4 mr-2" />
                Add Mac Device
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};