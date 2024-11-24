import React from 'react';
import { Brain } from 'lucide-react';
import { AVAILABLE_MODELS } from '../../lib/config/constants';
import { useAmeliaStore } from '../../lib/store/useAmeliaStore';

export const ModelSettings = () => {
  const { selectedModel, setSelectedModel } = useAmeliaStore();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-cyan-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="w-5 h-5 text-cyan-500" />
          <h2 className="text-lg font-medium text-cyan-900">AI Model Selection</h2>
        </div>

        <div className="space-y-4">
          {AVAILABLE_MODELS.map((model) => (
            <div
              key={model.id}
              className="relative flex items-center p-4 border rounded-lg hover:bg-cyan-50 transition-colors"
            >
              <input
                type="radio"
                id={model.id}
                name="model"
                value={model.id}
                checked={selectedModel === model.id}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
              />
              <label htmlFor={model.id} className="ml-3 flex flex-col cursor-pointer">
                <span className="block text-sm font-medium text-cyan-900">
                  {model.name}
                </span>
                <span className="block text-sm text-cyan-500">
                  {model.description}
                </span>
              </label>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-cyan-600">
          Select the AI model that best suits your needs. GPT-3.5 Turbo is recommended for most use cases,
          while GPT-4 Turbo offers enhanced capabilities for more complex tasks.
        </p>
      </div>
    </div>
  );
};