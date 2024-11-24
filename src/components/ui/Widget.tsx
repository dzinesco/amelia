import React, { ReactNode } from 'react';
import { MoreVertical, Loader2 } from 'lucide-react';

interface WidgetProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  loading?: boolean;
}

export const Widget: React.FC<WidgetProps> = ({
  title,
  icon,
  children,
  loading = false,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              {icon}
            </div>
            <h2 className="font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            className="p-1 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="Widget options"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">{children}</div>
        )}
      </div>
    </div>
  );
};