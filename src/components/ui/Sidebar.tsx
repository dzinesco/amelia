import { FC } from 'react';
import { 
  MessageSquare, 
  GitBranch, 
  FileText,
  Mail, 
  Car, 
  Home, 
  Network, 
  Apple, 
  MapPin, 
  Phone,
  Settings,
  Monitor,
} from 'lucide-react';
import { useSidebarStore } from '../../lib/store/useSidebarStore';
import { SidebarLinkType } from '../../lib/store/useSidebarStore';

type View = 'chat' | 'dashboard' | 'email' | 'tesla' | 'home' | 'network' | 'apple' | 'life360' | '3cx' | 'settings' | 'workflow' | 'documents';

interface SidebarProps {
  onViewChange: (view: View) => void;
  currentView: View;
}

const iconMap = {
  MessageSquare,
  GitBranch,
  FileText,
  Mail,
  Car,
  Home,
  Network,
  Apple,
  MapPin,
  Phone,
  Settings,
  Monitor,
};

export const Sidebar: FC<SidebarProps> = ({ onViewChange, currentView }) => {
  const { links } = useSidebarStore();

  const enabledLinks = links
    .filter(link => link.enabled)
    .sort((a, b) => a.order - b.order);

  const handleLinkClick = (link: SidebarLinkType) => {
    onViewChange(link.view as View);
  };

  const getIcon = (iconName: keyof typeof iconMap) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon className="w-6 h-6" /> : null;
  };

  return (
    <div className="w-16 bg-cyan-800 h-screen flex flex-col items-center py-4">
      <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center mb-6">
        <span className="text-cyan-50 font-bold">A</span>
      </div>
      
      <nav className="flex-1 flex flex-col items-center space-y-4">
        {enabledLinks.map((link) => (
          <button 
            key={link.id}
            onClick={() => handleLinkClick(link)}
            className={`p-3 rounded-lg transition-colors relative group ${
              currentView === link.view 
                ? 'text-cyan-50 bg-cyan-700' 
                : 'text-cyan-200 hover:text-cyan-50 hover:bg-cyan-700'
            }`}
            title={link.label}
          >
            {getIcon(link.iconName as keyof typeof iconMap)}
            <span className="absolute left-full ml-2 px-2 py-1 bg-cyan-700 text-cyan-50 text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
              {link.label}
            </span>
          </button>
        ))}
      </nav>
      
      <button 
        onClick={() => onViewChange('settings')}
        className={`p-3 rounded-lg transition-colors ${
          currentView === 'settings'
            ? 'text-cyan-50 bg-cyan-700' 
            : 'text-cyan-200 hover:text-cyan-50 hover:bg-cyan-700'
        }`}
        title="Settings"
      >
        <Settings className="w-6 h-6" />
      </button>
    </div>
  );
};