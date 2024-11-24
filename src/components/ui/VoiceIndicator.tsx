import React from 'react';

export const VoiceIndicator: React.FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center space-x-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-1 h-4 bg-white rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: '0.75s',
            }}
          />
        ))}
      </div>
    </div>
  );
};