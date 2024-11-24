import React, { useState } from 'react';
import { MapPin, Users, Battery, CheckCircle, XCircle, RefreshCw, Key } from 'lucide-react';

export const Life360Integration = () => {
  const [status, setStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleConnect = async () => {
    if (!credentials.email || !credentials.password) {
      alert('Please fill in all required fields');
      return;
    }

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
          <MapPin className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">Life360 Integration</h1>
        </div>
        <p className="mt-2 text-gray-600">Connect your Life360 account to track family locations</p>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Life360 Account</h3>
              <p className="mt-1 text-sm text-gray-500">Connect your Life360 account to enable location tracking</p>
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
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Life360 account email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Life360 account password"
                />
              </div>
            </div>
          )}

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
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Connect Life360
                </>
              )}
            </button>
          </div>

          {status === 'connected' && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Circle Members</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Family Circle</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">4 members connected</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Battery className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Device Status</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">All devices reporting</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};