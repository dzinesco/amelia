import React from 'react';
import { Lock } from 'lucide-react';

interface SecuritySetupProps {
  onInitialized: () => void;
}

export const SecuritySetup: React.FC<SecuritySetupProps> = ({ onInitialized }) => {
  // Auto-initialize after a brief delay to show the welcome screen
  React.useEffect(() => {
    const timer = setTimeout(onInitialized, 1500);
    return () => clearTimeout(timer);
  }, [onInitialized]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Amelia
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Initializing your personal AI assistant...
          </p>
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
};