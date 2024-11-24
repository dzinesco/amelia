import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface NodeSearchProps {
  onClose: () => void;
}

export const NodeSearch: React.FC<NodeSearchProps> = ({ onClose }) => {
  const [search, setSearch] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="w-full max-w-2xl bg-gray-900 rounded-lg shadow-xl">
        <div className="p-4 border-b border-gray-800 flex items-center">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nodes..."
            className="flex-1 bg-transparent border-none focus:outline-none text-white"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {/* Search results would go here */}
          <div className="p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
            <h3 className="text-sm font-medium">Gmail Trigger</h3>
            <p className="text-xs text-gray-400 mt-1">
              Triggers when new email arrives
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};