interface PerformanceMetrics {
  responseTime: number;
  memoryUsage: number;
  cpuUsage?: number;
  timestamp: number;
}

interface MetricsOptions {
  sampleSize?: number;
  reportingInterval?: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private options: Required<MetricsOptions>;
  private reportingTimer?: NodeJS.Timer;

  constructor(options: MetricsOptions = {}) {
    this.options = {
      sampleSize: options.sampleSize ?? 100,
      reportingInterval: options.reportingInterval ?? 60000,
    };

    this.startReporting();
  }

  trackResponseTime(startTime: number): void {
    const responseTime = performance.now() - startTime;
    this.addMetric({
      responseTime,
      memoryUsage: this.getMemoryUsage(),
      cpuUsage: this.getCpuUsage(),
      timestamp: Date.now(),
    });
  }

  private addMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    if (this.metrics.length > this.options.sampleSize) {
      this.metrics.shift();
    }
  }

  getAverageResponseTime(): number {
    if (this.metrics.length === 0) return 0;
    const sum = this.metrics.reduce((acc, m) => acc + m.responseTime, 0);
    return sum / this.metrics.length;
  }

  getPercentile(percentile: number): number {
    if (this.metrics.length === 0) return 0;
    const sorted = [...this.metrics]
      .sort((a, b) => a.responseTime - b.responseTime);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index].responseTime;
  }

  private getMemoryUsage(): number {
    if (performance.memory) {
      return performance.memory.usedJSHeapSize;
    }
    return 0;
  }

  private getCpuUsage(): number | undefined {
    // Implementation depends on platform support
    return undefined;
  }

  private startReporting(): void {
    this.reportingTimer = setInterval(() => {
      const report = {
        averageResponseTime: this.getAverageResponseTime(),
        p95ResponseTime: this.getPercentile(95),
        p99ResponseTime: this.getPercentile(99),
        sampleSize: this.metrics.length,
        timestamp: Date.now(),
      };

      console.log('Performance Report:', report);
    }, this.options.reportingInterval);
  }

  destroy(): void {
    if (this.reportingTimer) {
      clearInterval(this.reportingTimer);
    }
  }
}