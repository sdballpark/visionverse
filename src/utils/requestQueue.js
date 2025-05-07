class RequestQueue {
  constructor(maxConcurrent = 1) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }

  async add(request) {
    return new Promise((resolve, reject) => {
      // Add to queue
      this.queue.push({ request, resolve, reject });
      
      // Process queue if not already running
      if (this.running < this.maxConcurrent) {
        this.processQueue();
      }
    });
  }

  async processQueue() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const { request, resolve, reject } = this.queue.shift();
    this.running++;

    try {
      const result = await request();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      // Process next item in queue
      this.processQueue();
    }
  }
}

// Create a singleton instance for our API requests
export const apiRequestQueue = new RequestQueue(1);
