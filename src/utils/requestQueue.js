import { GEMINI_API_KEY, GEMINI_API_URL } from '../config/gemini';

class RequestQueue {
  constructor(maxConcurrent = 1, timeout = 30000) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
    this.timeout = timeout;
    this.requestId = 0;
    this.progressCallbacks = new Map();
    
    // Validate API configuration
    if (!GEMINI_API_KEY) {
      console.error('Gemini API key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.');
      throw new Error('Gemini API key is required');
    }
    if (!GEMINI_API_URL) {
      console.error('Gemini API URL is missing. Please check your configuration.');
      throw new Error('Gemini API URL is required');
    }
  }

  async add(request, options = {}) {
    const requestId = this.requestId++;
    
    return new Promise((resolve, reject) => {
      const requestObj = {
        id: requestId,
        request,
        resolve,
        reject,
        priority: options.priority || 0,
        timeout: options.timeout || this.timeout,
        startTime: Date.now(),
        progress: 0
      };

      // Add to queue with priority
      const index = this.queue.findIndex(q => q.priority < requestObj.priority);
      if (index === -1) {
        this.queue.push(requestObj);
      } else {
        this.queue.splice(index, 0, requestObj);
      }

      // Process queue if not already running
      if (this.running < this.maxConcurrent) {
        this.processQueue();
      }

      // Return a cancellation function
      return () => this.cancelRequest(requestId);
    });
  }

  cancelRequest(requestId) {
    const index = this.queue.findIndex(req => req.id === requestId);
    if (index !== -1) {
      const { reject } = this.queue[index];
      this.queue.splice(index, 1);
      reject(new Error('Request cancelled'));
    }
  }

  async processQueue() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const current = this.queue.shift();
    this.running++;

    const timeoutId = setTimeout(() => {
      current.reject(new Error('Request timeout'));
    }, current.timeout);

    try {
      // Wrap request in a progress tracking wrapper
      const wrappedRequest = async () => {
        try {
          const result = await current.request();
          this.updateProgress(current.id, 100);
          return result;
        } catch (error) {
          this.updateProgress(current.id, 0);
          throw error;
        }
      };

      const result = await wrappedRequest();
      current.resolve(result);
    } catch (error) {
      current.reject(error);
    } finally {
      clearTimeout(timeoutId);
      this.running--;
      // Process next item in queue
      this.processQueue();
    }
  }

  updateProgress(requestId, progress) {
    const callbacks = this.progressCallbacks.get(requestId);
    if (callbacks) {
      callbacks.forEach(cb => cb(progress));
    }
  }

  onProgress(requestId, callback) {
    if (!this.progressCallbacks.has(requestId)) {
      this.progressCallbacks.set(requestId, []);
    }
    this.progressCallbacks.get(requestId).push(callback);

    // Clean up callback when request completes
    return () => {
      const callbacks = this.progressCallbacks.get(requestId);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  getQueueLength() {
    return this.queue.length;
  }

  getRunningCount() {
    return this.running;
  }
}

// Create a singleton instance for our API requests
export const apiRequestQueue = new RequestQueue(3, 30000);
