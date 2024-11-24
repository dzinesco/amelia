import React from 'react';
import { Mail, Calendar, Car, Home, Network, Workflow, Filter } from 'lucide-react';

interface NodePanelProps {
  onDragStart: (e: React.DragEvent, nodeType: string) => void;
}

const nodeCategories = [
  {
    title: 'Triggers',
    nodes: [
      { type: 'gmail-trigger', icon: Mail, label: 'Gmail Trigger' },
      { type: 'calendar-trigger', icon: Calendar, label: 'Calendar Trigger' },
      { type: 'tesla-trigger', icon: Car, label: 'Tesla Trigger' },
    ],
  },
  {
    title: 'Actions',
    nodes: [
      { type: 'gmail-action', icon: Mail, label: 'Gmail Action' },
      { type: 'smart-home', icon: Home, label: 'Smart Home' },
      { type: 'network', icon: Network, label: 'Network' },
    ],
  },
  {
    title: 'Logic',
    nodes: [
      { type: 'workflow', icon: Workflow, label: 'Workflow' },
      { type: 'filter', icon: Filter, label: 'Filter' },
    ],
  },
];

export const NodePanel: React.FC<NodePanelProps> = ({ onDragStart }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {nodeCategories.map((category) => (
        <div key={category.title} className="p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">
            {category.title}
          </h3>
          <div className="space-y-2">
            {category.nodes.map((node) => (
              <div
                key={node.type}
                draggable
                onDragStart={(e) => onDragStart(e, node.type)}
                className="flex items-center p-2 rounded-lg hover:bg-gray-800 cursor-move transition-colors group"
              >
                <node.icon className="w-5 h-5 text-gray-400 group-hover:text-white mr-3" />
                <span className="text-sm text-gray-300 group-hover:text-white">
                  {node.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};