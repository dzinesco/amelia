import React, { useState } from 'react';
import { MessageCircle, Key, Loader2 } from 'lucide-react';
import { useChatStore } from '../../lib/store/useChatStore';
import { ChatPlatform } from '../../lib/integrations/chat/types';

export const MattermostSettings = () => {
  const { configs, updateConfig } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    serverUrl: '',
    token: '',
    botUsername: '',
    webhookSecret: ''
  });

  const mattermostConfig = configs.find(c => c.platform === ChatPlatform.Mattermost);

  const handleConnect = async () => {
    if (!credentials.serverUrl || !credentials.token || !credentials.botUsername) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      updateConfig(ChatPlatform.Mattermost, {
        enabled: true,
        credentials: credentials,
        webhooks: {
          incoming: [],
          outgoing: []
        }
      });
    } catch (error) {
      alert('Failed to connect to Mattermost');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-cyan-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <MessageCircle className="w-5 h-5 text-cyan-500" />
          <h2 className="text-lg font-medium text-cyan-900">Mattermost Integration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyan-700">Server URL</label>
            <input
              type="text"
              value={credentials.serverUrl}
              onChange={(e) => setCredentials(prev => ({ ...prev, serverUrl: e.target.value }))}
              className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              placeholder="https://your-mattermost-server.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-700">Bot Access Token</label>
            <input
              type="password"
              value={credentials.token}
              onChange={(e) => setCredentials(prev => ({ ...prev, token: e.target.value }))}
              className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              placeholder="Enter your bot access token"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-700">Bot Username</label>
            <input
              type="text"
              value={credentials.botUsername}
              onChange={(e) => setCredentials(prev => ({ ...prev, botUsername: e.target.value }))}
              className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              placeholder="amelia_bot"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-700">Webhook Secret</label>
            <input
              type="password"
              value={credentials.webhookSecret}
              onChange={(e) => setCredentials(prev => ({ ...prev, webhookSecret: e.target.value }))}
              className="mt-1 block w-full rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500"
              placeholder="Enter webhook secret for outgoing webhooks"
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
                  Connect Mattermost
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};