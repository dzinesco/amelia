import { useState } from 'react';
import { Dashboard } from './components/ui/Dashboard';
import { Sidebar } from './components/ui/Sidebar';
import { ChatInterface } from './components/ui/ChatInterface';
import { NotificationAlert } from './components/ui/NotificationAlert';
import { SEO } from './lib/utils/seo';
import { useAuth } from './lib/auth/DevAuthProvider';
import { OnboardingPage } from './components/onboarding/OnboardingPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { SmartHomeIntegration } from './components/integrations/SmartHomeIntegration';
import { TeslaIntegration } from './components/integrations/TeslaIntegration';
import { NetworkIntegration } from './components/integrations/NetworkIntegration';
import { Life360Integration } from './components/integrations/Life360Integration';
import { ThreeCXIntegration } from './components/integrations/ThreeCXIntegration';

type View = 'chat' | 'dashboard' | 'email' | 'tesla' | 'home' | 'network' | 'apple' | 'life360' | '3cx' | 'settings' | 'workflow' | 'documents';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return (
      <>
        <SEO />
        <NotificationAlert />
        <div className="min-h-screen flex items-center justify-center bg-cyan-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-cyan-900 mb-4">Welcome to Amelia</h1>
            <p className="text-cyan-600 mb-6">Please sign in to continue.</p>
            <button
              onClick={() => login()}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!isOnboarded) {
    return <OnboardingPage />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return <ChatInterface />;
      case 'dashboard':
        return <Dashboard />;
      case 'tesla':
        return <TeslaIntegration />;
      case 'home':
        return <SmartHomeIntegration />;
      case 'network':
        return <NetworkIntegration />;
      case 'life360':
        return <Life360Integration />;
      case '3cx':
        return <ThreeCXIntegration />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <SEO />
      <NotificationAlert />
      <div className="flex h-screen bg-cyan-900">
        <Sidebar onViewChange={(view: View) => setCurrentView(view)} currentView={currentView} />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-cyan-800 border-b border-cyan-700 px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-cyan-50">Amelia AI Assistant</h1>
            <button
              onClick={() => setCurrentView(currentView === 'chat' ? 'dashboard' : 'chat')}
              className="px-4 py-2 bg-cyan-600 text-cyan-50 rounded-lg hover:bg-cyan-500 transition-colors"
            >
              {currentView === 'chat' ? 'View Dashboard' : 'Open Chat'}
            </button>
          </header>
          <div className="flex-1 overflow-auto bg-cyan-50">
            {renderView()}
          </div>
        </main>
      </div>
    </>
  );
}