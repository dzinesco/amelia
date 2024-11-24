import 'regenerator-runtime/runtime';

class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private retryCount = 0;
  private maxRetries = 3;

  constructor() {
    this.initializeRecognition();
  }

  private initializeRecognition() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join(' ');

      window.dispatchEvent(
        new CustomEvent('voice-transcript', { detail: { transcript } })
      );
    };

    this.recognition.onerror = (event) => {
      if (event.error === 'no-speech' && this.retryCount < this.maxRetries) {
        this.retryCount++;
        this.restartRecognition();
      } else {
        this.handleError(event.error);
      }
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        this.restartRecognition();
      }
    };
  }

  private handleError(error: string) {
    let errorMessage = 'An error occurred with voice recognition';
    
    switch (error) {
      case 'no-speech':
        errorMessage = 'No speech was detected. Please try again.';
        break;
      case 'audio-capture':
        errorMessage = 'No microphone was found. Ensure it is plugged in and allowed.';
        break;
      case 'not-allowed':
        errorMessage = 'Microphone permission was denied. Please allow access to use voice input.';
        break;
      case 'network':
        errorMessage = 'Network error occurred. Please check your connection.';
        break;
    }

    window.dispatchEvent(
      new CustomEvent('voice-error', { detail: { error: errorMessage } })
    );
  }

  private restartRecognition() {
    if (!this.recognition || !this.isListening) return;
    
    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error restarting recognition:', error);
    }
  }

  startListening() {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    if (this.isListening) return;

    this.isListening = true;
    this.retryCount = 0;
    
    try {
      this.recognition.start();
    } catch (error) {
      this.handleError('Failed to start voice recognition');
    }
  }

  stopListening() {
    if (!this.recognition || !this.isListening) return;
    
    this.isListening = false;
    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Error stopping recognition:', error);
    }
  }

  speak(text: string, options: SpeechSynthesisUtterance = new SpeechSynthesisUtterance()) {
    return new Promise<void>((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Copy provided options
      Object.assign(utterance, options);
      
      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);
      
      window.speechSynthesis.speak(utterance);
    });
  }
}

export const voiceService = new VoiceService();