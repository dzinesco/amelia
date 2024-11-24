import React from 'react';
import { X, Save } from 'lucide-react';

interface ConfigPanelProps {
  nodeId: string;
  onClose: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ nodeId, onClose }) => {
  return (
    <div className="w-96 border-l border-gray-800 bg-gray-900">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-medium">Node Configuration</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Node Settings */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Name
          </label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Node name"
          />
        </div>

        {/* Node Parameters */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Parameters
          </label>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-3">
              <label className="block text-xs text-gray-400 mb-1">
                Trigger Condition
              </label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm">
                <option>New email arrives</option>
                <option>Email matches filter</option>
                <option>Email from specific sender</option>
              </select>
            </div>

            <div className="bg-gray-800 rounded-lg p-3">
              <label className="block text-xs text-gray-400 mb-1">
                Action
              </label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm">
                <option>Forward to address</option>
                <option>Mark as important</option>
                <option>Move to folder</option>
              </select>
            </div>
          </div>
        </div>

        {/* Test Configuration */}
        <div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
            Test Configuration
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900">
        <button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};