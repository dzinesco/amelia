import React, { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { OpenAIConfig } from './steps/OpenAIConfig';
import { PineconeConfig } from './steps/PineconeConfig';
import { EmailConfig } from './steps/EmailConfig';
import { AppleConfig } from './steps/AppleConfig';
import { TeslaConfig } from './steps/TeslaConfig';
import { SmartHomeConfig } from './steps/SmartHomeConfig';
import { NetworkConfig } from './steps/NetworkConfig';
import { ThreeCXConfig } from './steps/ThreeCXConfig';
import { Life360Config } from './steps/Life360Config';

const steps = [
  { id: 'openai', title: 'OpenAI Setup', component: OpenAIConfig },
  { id: 'pinecone', title: 'Pinecone Setup', component: PineconeConfig },
  { id: 'email', title: 'Email Integration', component: EmailConfig },
  { id: 'apple', title: 'Apple Services', component: AppleConfig },
  { id: 'tesla', title: 'Tesla Integration', component: TeslaConfig },
  { id: 'smarthome', title: 'Smart Home', component: SmartHomeConfig },
  { id: 'network', title: 'Network Setup', component: NetworkConfig },
  { id: '3cx', title: '3CX Phone System', component: ThreeCXConfig },
  { id: 'life360', title: 'Life360', component: Life360Config },
];

export const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-cyan-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-cyan-900 mb-6">Welcome to Amelia</h1>
          
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-cyan-600">Setup Progress</span>
              <span className="text-sm text-cyan-600">
                {completedSteps.length} of {steps.length} completed
              </span>
            </div>
            <div className="h-2 bg-cyan-100 rounded-full">
              <div 
                className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Steps sidebar */}
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1 space-y-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between ${
                    currentStep === index
                      ? 'bg-cyan-100 text-cyan-900'
                      : completedSteps.includes(step.id)
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  <span className="text-sm font-medium">{step.title}</span>
                  {completedSteps.includes(step.id) ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : currentStep === index ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : null}
                </button>
              ))}
            </div>

            {/* Current step content */}
            <div className="col-span-3 bg-gray-50 rounded-lg p-6">
              <CurrentStepComponent onComplete={() => handleStepComplete(steps[currentStep].id)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};