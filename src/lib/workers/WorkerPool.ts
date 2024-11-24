type WorkerTask<T> = () => Promise<T>;

interface WorkerThread {
  id: number;
  busy: boolean;
}

export class WorkerPool {
  private workers: WorkerThread[];
  private taskQueue: Array<{
    task: WorkerTask<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor(size: number = navigator.hardwareConcurrency || 4) {
    this.workers = Array.from({ length: size }, (_, i) => ({
      id: i,
      busy: false,
    }));
  }

  async execute<T>(task: WorkerTask<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const availableWorker = this.workers.find(w => !w.busy);

      if (availableWorker) {
        this.runTask(availableWorker, task, resolve, reject);
      } else {
        this.taskQueue.push({ task, resolve, reject });
      }
    });
  }

  private async runTask<T>(
    worker: WorkerThread,
    task: WorkerTask<T>,
    resolve: (value: T) => void,
    reject: (error: any) => void
  ): Promise<void> {
    worker.busy = true;

    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      worker.busy = false;
      this.processQueue();
    }
  }

  private processQueue(): void {
    const nextTask = this.taskQueue.shift();
    if (nextTask) {
      const availableWorker = this.workers.find(w => !w.busy);
      if (availableWorker) {
        this.runTask(
          availableWorker,
          nextTask.task,
          nextTask.resolve,
          nextTask.reject
        );
      }
    }
  }

  get activeWorkers(): number {
    return this.workers.filter(w => w.busy).length;
  }

  get queueLength(): number {
    return this.taskQueue.length;
  }
}