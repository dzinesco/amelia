import React, { useState } from 'react';
import { Phone, MessageSquare, History, CheckCircle, XCircle, RefreshCw, Key } from 'lucide-react';

export const ThreeCXIntegration = () => {
  const [status, setStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    apiKey: '',
    baseUrl: '',
  });

  const handleConnect = async () => {
    if (!credentials.apiKey || !credentials.baseUrl) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setStatus('connected');
      setIsLoading(false);
    }, 1500);
  };

  const handleDisconnect = () => {
    setStatus('disconnected');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center space-x-3">
          <Phone className="w-8 h-8 text-cyan-600" />
          <h1 className="text-2xl font-bold text-cyan-900">3CX Phone System</h1>
        </div>
        <p className="mt-2 text-cyan-600">Connect your 3CX system for calls and messaging</p>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-cyan-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-cyan-900">3CX Configuration</h3>
              <p className="mt-1 text-sm text-cyan-500">Configure your 3CX API connection</p>
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

          {status === 'disconnected' && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-cyan-700">API Key</label>
                <input
                  type="password"
                  value={credentials.apiKey}
                  onChange={(e) => setCredentials({...credentials, apiKey: e.target.value})}
                  className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  placeholder="Enter your 3CX API key"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-cyan-700">Base URL</label>
                <input
                  type="text"
                  value={credentials.baseUrl}
                  onChange={(e) => setCredentials({...credentials, baseUrl: e.target.value})}
                  className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                  placeholder="https://your-3cx-instance.com/api"
                />
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={status === 'connected' ? handleDisconnect : handleConnect}
              disabled={isLoading}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                status === 'connected'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-cyan-600 hover:bg-cyan-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : status === 'connected' ? (
                'Disconnect'
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Connect 3CX
                </>
              )}
            </button>
          </div>

          {status === 'connected' && (
            <div className="mt-8 border-t border-cyan-200 pt-6">
              <h4 className="text-sm font-medium text-cyan-900 mb-4">Communication Stats</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-cyan-600" />
                    <span className="text-sm font-medium text-cyan-700">Calls Today</span>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-cyan-900">24</p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-cyan-600" />
                    <span className="text-sm font-medium text-cyan-700">Messages</span>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-cyan-900">156</p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <History className="w-5 h-5 text-cyan-600" />
                    <span className="text-sm font-medium text-cyan-700">Active Reminders</span>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-cyan-900">8</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};