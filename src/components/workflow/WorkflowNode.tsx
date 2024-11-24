import React, { useState } from 'react';
import { MoreHorizontal, AlertCircle, CheckCircle } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface WorkflowNodeProps {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  position: Position;
  onSelect: (id: string) => void;
  selected: boolean;
}

export const WorkflowNode: React.FC<WorkflowNodeProps> = ({
  id,
  type,
  position,
  onSelect,
  selected,
}) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'error' | 'success'>('idle');
  const [isHovered, setIsHovered] = useState(false);

  const getNodeColors = () => {
    switch (type) {
      case 'trigger':
        return 'from-blue-500 to-blue-600';
      case 'action':
        return 'from-purple-500 to-purple-600';
      case 'condition':
        return 'from-amber-500 to-amber-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIndicator = () => {
    switch (status) {
      case 'running':
        return <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-400" />;
    }
  };

  return (
    <div
      className={`absolute cursor-pointer transform transition-transform hover:scale-105 ${selected ? 'z-10' : 'z-0'}`}
      style={{ left: position.x, top: position.y }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(id)}
    >
      <div
        className={`
          w-48 rounded-lg bg-gradient-to-br ${getNodeColors()}
          ${selected ? 'ring-2 ring-white ring-opacity-50' : ''}
          shadow-lg backdrop-blur-sm
        `}
      >
        {/* Node Header */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center space-x-2">
            {getStatusIndicator()}
            <span className="text-sm font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </div>
          <button className="p-1 hover:bg-white/10 rounded-full">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Node Content */}
        <div className="p-4">
          <h3 className="text-sm font-medium mb-2">Gmail Trigger</h3>
          <p className="text-xs text-white/70">Triggers when new email arrives</p>
        </div>

        {/* Connection Points */}
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 rounded-full bg-white/20 border-2 border-white/40" />
        </div>
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 rounded-full bg-white/20 border-2 border-white/40" />
        </div>

        {/* Hover Effects */}
        {isHovered && (
          <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
            <div className="px-2 py-1 rounded bg-gray-800 text-xs">
              Click to configure
            </div>
          </div>
        )}
      </div>
    </div>
  );
};