import axios from 'axios';
import { apiRequestQueue } from './requestQueue';

export async function makeApiCallWithRetry(config, maxRetries = 5, initialDelay = 2000) {
  // First, add to the request queue to limit concurrent requests
  return await apiRequestQueue.add(async () => {
    let currentDelay = initialDelay;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Add delay before making the request
        await new Promise(resolve => setTimeout(resolve, currentDelay));
        
        const response = await axios(config);
        return response;
      } catch (error) {
        // Log detailed error information
        console.error('API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message,
          config: config.model
        });
        
        // Handle different types of errors
        if (error.response?.status === 429) {
          // For rate limit errors, use more aggressive backoff
          currentDelay = Math.min(currentDelay * 3, 60000); // Cap at 1 minute
          console.log(`Rate limit hit. Retrying in ${currentDelay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
          
          // If we've reached max retries, throw the error
          if (attempt === maxRetries - 1) {
            throw new Error(`Rate limit exceeded after ${maxRetries} attempts. Please try again later.`);
          }
        } else if (error.response?.status === 400) {
          // For bad request errors, throw immediately
          throw new Error(`Invalid request: ${error.response?.data?.error?.message}`);
        } else {
          // For other errors, use normal backoff
          currentDelay = Math.min(currentDelay * 2, 30000); // Cap at 30 seconds
          console.log(`API error. Retrying in ${currentDelay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
          
          // If we've reached max retries, throw the error
          if (attempt === maxRetries - 1) {
            throw error;
          }
        }
      }
    }
  });
}
