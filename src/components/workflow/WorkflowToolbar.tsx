import React from 'react';
import { Undo, Redo, Play, Save, Plus } from 'lucide-react';

export const WorkflowToolbar: React.FC = () => {
  return (
    <div className="h-14 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-4">
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <Undo className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <Redo className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-gray-800 mx-2" />
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-green-400">
          <Play className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </button>
        <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Save Workflow
        </button>
      </div>
    </div>
  );
};