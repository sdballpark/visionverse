import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function generatePoem(image) {
  try {
    console.log('Attempting to generate poem with image:', image.name);
    
    // Convert image to base64
    const reader = new FileReader();
    const promise = new Promise((resolve, reject) => {
      reader.onload = (event) => {
        const base64Image = event.target.result;
        console.log('Base64 image created successfully');
        resolve(base64Image);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        reject(new Error('Failed to read image file'));
      };
      reader.readAsDataURL(image);
    });

    const base64Image = await promise;
    
    // For now, we'll use a mock response until we implement the real API
    return {
      poem: `In the frame where ${image.name} lies,
A scene unfolds before our eyes.
Pixels dance in digital grace,
Capturing moments in a single space.`,
      metadata: {
        model: 'mock-model',
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error(`Gemini API Error: Failed to generate poem. Detailed error: ${error.message}`);
    console.error('Error stack:', error.stack);
    throw new Error(`Gemini API Error: Failed to generate poem. ${error.message}`);
  }
}
