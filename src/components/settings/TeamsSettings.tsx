import React, { useState } from 'react';
import { MessageSquare, Key, Loader2 } from 'lucide-react';
import { useChatStore } from '../../lib/store/useChatStore';
import { ChatPlatform } from '../../lib/integrations/chat/types';

export const TeamsSettings = () => {
  const { configs, updateConfig } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    clientId: '',
    clientSecret: '',
    tenantId: '',
    botId: '',
    botName: ''
  });

  const teamsConfig = configs.find(c => c.platform === ChatPlatform.Teams);

  const handleConnect = async () => {
    if (!credentials.clientId || !credentials.clientSecret || !credentials.tenantId) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      updateConfig(ChatPlatform.Teams, {
        enabled: true,
        credentials: credentials,
        webhooks: {
          incoming: [],
          outgoing: []
        }
      });
    } catch (error) {
      alert('Failed to connect to Microsoft Teams');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-cyan-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <MessageSquare className="w-5 h-5 text-cyan-500" />
          <h2 className="text-lg font-medium text-cyan-900">Microsoft Teams Integration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyan-700">Client ID</label>
            <input
              type="text"
              value={credentials.clientId}
              onChange={(e) => setCredentials(prev => ({ ...prev, clientId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              placeholder="Enter your Teams app Client ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-700">Client Secret</label>
            <input
              type="password"
              value={credentials.clientSecret}
              onChange={(e) => setCredentials(prev => ({ ...prev, clientSecret: e.target.value }))}
              className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              placeholder="Enter your Teams app Client Secret"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-700">Tenant ID</label>
            <input
              type="text"
              value={credentials.tenantId}
              onChange={(e) => setCredentials(prev => ({ ...prev, tenantId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              placeholder="Enter your Microsoft Tenant ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-700">Bot ID</label>
            <input
              type="text"
              value={credentials.botId}
              onChange={(e) => setCredentials(prev => ({ ...prev, botId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              placeholder="Enter your Teams Bot ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-700">Bot Name</label>
            <input
              type="text"
              value={credentials.botName}
              onChange={(e) => setCredentials(prev => ({ ...prev, botName: e.target.value }))}
              className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              placeholder="Enter your Teams Bot Name"
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
                  Connect Teams
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};