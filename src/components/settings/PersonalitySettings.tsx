import React, { useState } from 'react';
import { Brain, Save, Loader2 } from 'lucide-react';
import { useAmeliaStore } from '../../lib/store/useAmeliaStore';

export const PersonalitySettings = () => {
  const { personality, setPersonality } = useAmeliaStore();
  const [isLoading, setIsLoading] = useState(false);
  const [localPersonality, setLocalPersonality] = useState(personality);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await setPersonality(localPersonality);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-cyan-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="w-5 h-5 text-cyan-500" />
          <h2 className="text-lg font-medium text-cyan-900">Personality Customization</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cyan-700 mb-2">
              Personality Description
            </label>
            <textarea
              value={localPersonality}
              onChange={(e) => setLocalPersonality(e.target.value)}
              className="w-full h-40 rounded-md border-cyan-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 resize-none"
              placeholder="Describe Amelia's personality, tone, and behavior..."
            />
            <p className="mt-2 text-sm text-cyan-600">
              Example: "Amelia is friendly and professional, with a touch of humor. She's direct in her responses but maintains a warm, helpful demeanor. She excels at explaining complex topics in simple terms."
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={isLoading || localPersonality === personality}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};