import { GEMINI_API_KEY, GEMINI_API_URL, GEMINI_MODEL } from '../config/gemini';
import geminiService from '../services/geminiService';
import { apiRequestQueue } from '../utils/requestQueue';

export async function generatePoem(imageFile) {
  if (!imageFile) {
    throw new Error('No image file provided');
  }
  if (!imageFile.name) {
    throw new Error('Invalid image file');
  }
  try {
    console.log('Starting poem generation for image:', imageFile.name);
    
    // Convert image to base64
    const fileBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(fileBuffer).toString('base64');

    // Create request function
    const request = async () => {
      return geminiService.generateContent(base64Image);
    };

    // Add to request queue with priority
    const cancel = await apiRequestQueue.add(request, {
      priority: 10, // Higher priority for poem generation
      timeout: 60000 // 60 second timeout
    });

    // Track progress
    const cleanup = apiRequestQueue.onProgress(request.id, (progress) => {
      console.log(`Poem generation progress: ${progress}%`);
    });

    try {
      const result = await request;
      
      // Format the poem with proper line breaks and spacing
      const formatPoem = (text) => {
        return text
          .split('\n')
          .map(line => line.trim())
          .join('\n\n'); // Double line breaks for better spacing
      };
      
      return formatPoem(result);
    } finally {
      // Clean up progress listener
      cleanup();
    }
  } catch (error) {
    console.error('Poem generation error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw error;
  }
    
    // Replace both description and image name in the template
    const poem = template
      .replace('{description}', description)
      .replace('{image.name}', imageName);
    console.log('Generated poem:', poem);
    
    return {
      poem,
      metadata: {
        model: 'Local Template',
        timestamp: new Date().toISOString(),
        image_description: description
      }
    };
  } catch (error) {
    console.error('Error in poem generation:', error);
    console.error('Detailed error:', error);
    console.error('Error stack:', error.stack);
    throw new Error(`Gemini API Error: Failed to generate poem. ${error.message}`);
  }
}
