import { useEffect, useState } from 'react';
import { voiceService } from '../services/voiceService';

export function useVoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleTranscript = (event: CustomEvent<{ transcript: string }>) => {
      setTranscript(prev => prev + event.detail.transcript);
      setError(null);
    };

    const handleError = (event: CustomEvent<{ error: string }>) => {
      setError(event.detail.error);
      setIsListening(false);
    };

    window.addEventListener('voice-transcript' as any, handleTranscript as any);
    window.addEventListener('voice-error' as any, handleError as any);

    return () => {
      window.removeEventListener('voice-transcript' as any, handleTranscript as any);
      window.removeEventListener('voice-error' as any, handleError as any);
    };
  }, []);

  const startListening = () => {
    try {
      voiceService.startListening();
      setIsListening(true);
      setError(null);
    } catch (err) {
      setError('Failed to start voice recognition');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    clearTranscript,
  };
}