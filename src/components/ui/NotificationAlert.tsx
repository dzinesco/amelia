import React from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import { useNotificationStore, NotificationType } from '../../lib/store/useNotificationStore';

const icons: Record<NotificationType, typeof AlertCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles: Record<NotificationType, { container: string; icon: string }> = {
  success: {
    container: 'bg-green-50 text-green-800 border-green-200',
    icon: 'text-green-400',
  },
  error: {
    container: 'bg-red-50 text-red-800 border-red-200',
    icon: 'text-red-400',
  },
  info: {
    container: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: 'text-blue-400',
  },
  warning: {
    container: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    icon: 'text-yellow-400',
  },
};

export const NotificationAlert: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 min-w-[320px] max-w-[420px]">
      {notifications.map((notification) => {
        const Icon = icons[notification.type];
        const style = styles[notification.type];

        return (
          <div
            key={notification.id}
            className={`flex items-center p-4 rounded-lg border shadow-lg ${
              style.container
            } transform transition-all duration-300 ease-in-out`}
            role="alert"
          >
            <Icon className={`w-5 h-5 ${style.icon} flex-shrink-0`} />
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 flex-shrink-0 rounded-lg p-1.5 inline-flex text-gray-400 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <span className="sr-only">Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};