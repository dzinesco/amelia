type EventType = 'page_view' | 'chat_message' | 'voice_command' | 'error';

interface AnalyticsEvent {
  type: EventType;
  data: Record<string, any>;
  timestamp: number;
}

class Analytics {
  private queue: AnalyticsEvent[] = [];
  private isProcessing = false;
  private readonly batchSize = 10;
  private readonly flushInterval = 30000; // 30 seconds

  constructor() {
    this.startAutoFlush();
  }

  track(type: EventType, data: Record<string, any> = {}) {
    this.queue.push({
      type,
      data,
      timestamp: Date.now(),
    });

    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  private async flush() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const events = this.queue.splice(0, this.batchSize);

    try {
      if (import.meta.env.PROD) {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events }),
        });
      } else {
        console.log('Analytics events:', events);
      }
    } catch (error) {
      console.error('Failed to send analytics:', error);
      // Re-queue failed events
      this.queue.unshift(...events);
    } finally {
      this.isProcessing = false;
    }
  }

  private startAutoFlush() {
    setInterval(() => this.flush(), this.flushInterval);
  }
}

export const analytics = new Analytics();