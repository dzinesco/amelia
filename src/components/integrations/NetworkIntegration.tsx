import React, { useState } from 'react';
import { Network, Wifi, Server, Activity, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export const NetworkIntegration = () => {
  const [status, setStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setStatus('connected');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center space-x-3">
          <Network className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">Network Integration</h1>
        </div>
        <p className="mt-2 text-gray-600">Connect and monitor your UniFi network</p>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">UniFi Controller</h3>
              <p className="mt-1 text-sm text-gray-500">Connect your UniFi controller to enable network monitoring</p>
            </div>
            <div className="flex items-center space-x-2">
              {status === 'connected' ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-500">Connected</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-red-500">Disconnected</span>
                </>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleConnect}
              disabled={isLoading || status === 'connected'}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : status === 'connected' ? (
                'Connected'
              ) : (
                'Connect UniFi'
              )}
            </button>
          </div>

          {status === 'connected' && (
            <div className="mt-6 border-t border-gray-200 pt-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Network Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Wifi className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-gray-700">Devices</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-gray-900">12 Connected</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Speed</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-gray-900">1 Gbps</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Server className="w-5 h-5 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700">Status</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold text-gray-900">Healthy</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Monitoring Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Enable device notifications</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Monitor bandwidth usage</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};