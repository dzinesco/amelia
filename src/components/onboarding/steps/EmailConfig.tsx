import React, { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../../../lib/auth/DevAuthProvider';

interface Props {
  onComplete: () => void;
}

export const EmailConfig: React.FC<Props> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<'gmail' | 'outlook' | null>(null);
  const { getToken } = useAuth();

  const handleConnect = async () => {
    if (!selectedService) return;
    
    setIsLoading(true);
    try {
      const token = await getToken();
      // Implementation for email service connection
      onComplete();
    } catch (error) {
      console.error('Failed to connect email service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-cyan-900">Email Integration</h2>
        <p className="mt-2 text-sm text-cyan-600">
          Connect your email accounts to enable email management.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setSelectedService('gmail')}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedService === 'gmail'
              ? 'border-pink-400 bg-pink-50'
              : 'border-gray-200 hover:border-pink-200'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <Mail className="w-8 h-8 text-pink-500" />
            <span className="font-medium text-gray-900">Gmail</span>
          </div>
        </button>

        <button
          onClick={() => setSelectedService('outlook')}
          className={`p-4 rounded-lg border-2 transition-all ${
            selectedService === 'outlook'
              ? 'border-yellow-400 bg-yellow-50'
              : 'border-gray-200 hover:border-yellow-200'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <Mail className="w-8 h-8 text-yellow-500" />
            <span className="font-medium text-gray-900">Outlook</span>
          </div>
        </button>
      </div>

      <button
        onClick={handleConnect}
        disabled={isLoading || !selectedService}
        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          'Connect Email'
        )}
      </button>
    </div>
  );
};