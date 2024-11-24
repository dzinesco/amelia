import React from 'react';
import { Settings, Brain, Bell, Shield, Database, Workflow } from 'lucide-react';
import { PineconeSettings } from './PineconeSettings';
import { PersonalitySettings } from './PersonalitySettings';
import { ModelSettings } from './ModelSettings';
import { AppleSettings } from './AppleSettings';
import { TeamsSettings } from './TeamsSettings';
import { MattermostSettings } from './MattermostSettings';

export const SettingsPage = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto h-full overflow-auto">
      <header className="mb-8">
        <div className="flex items-center space-x-3">
          <Settings className="w-8 h-8 text-cyan-600" />
          <h1 className="text-2xl font-bold text-cyan-900">Settings</h1>
        </div>
        <p className="mt-2 text-cyan-600">Manage your preferences and configurations</p>
      </header>

      <div className="space-y-6">
        <ModelSettings />
        <PersonalitySettings />
        <TeamsSettings />
        <MattermostSettings />
        <AppleSettings />
        <PineconeSettings />
      </div>
    </div>
  );
};