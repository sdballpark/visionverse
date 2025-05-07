import { GEMINI_API_KEY, GEMINI_API_URL, GEMINI_MODEL } from '../config/gemini';
import { makeApiCallWithRetry } from '../utils/apiUtils';

// Validate API key format
const validateApiKey = (apiKey) => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API key is required');
  }
  // Gemini API keys have a different format
  if (!apiKey.startsWith('AIza')) {
    throw new Error('Invalid API key format. Gemini API keys should start with "AIza"');
  }
}

export async function generatePoem(imageFile) {
  if (!imageFile) {
    throw new Error('No image file provided');
  }
  if (!imageFile.name) {
    throw new Error('Invalid image file');
  }
  try {
    // Validate API key
    validateApiKey(GEMINI_API_KEY);
    console.log('Gemini API Key:', GEMINI_API_KEY.substring(0, 5) + '...' + GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 5));

    console.log('Attempting to generate poem with image:', imageFile.name);
    
    // Generate a more natural description based on the image file name
    const imageName = imageFile.name.replace(/\.[^/.]+$/, ""); // Remove file extension
    // Handle common technical terms
    const cleanName = imageName
      .replace(/[-_]/g, ' ')
      .replace(/funciton/gi, 'function') // Fix common spelling mistakes
      .replace(/orig/gi, 'original') // Convert abbreviations
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words
    
    // Create a more natural description
    const description = `A visualization of ${cleanName}`;

    // Format the poem with proper line breaks and spacing
    const formatPoem = (text) => {
      return text
        .split('\n')
        .map(line => line.trim())
        .join('\n\n'); // Double line breaks for better spacing
    };

    // Use a local template-based approach
    const poemTemplate = `In the realm of ${description}, where nature's breath is free,
A tale unfolds in verse, for all to see.
The colors dance, the shadows play,
In this moment, beauty finds its way.

The ${cleanName} stands proud and tall,
A symbol of nature's eternal call.
Its presence speaks in silent grace,
In every word, a work of heart.`;
    
    // Use a local template-based approach
    const templates = [
      `In the realm of ${description}, where nature's breath is free,
      A tale unfolds in verse, for all to see.
      The colors dance, the shadows play,
      In this moment, beauty finds its way.
      
      The ${cleanName} stands proud and tall,
      A symbol of nature's eternal call.
      Its presence speaks in silent grace,
      In every word, a work of heart.`,
      
      `Beneath the sky where ${description} lies,
      A poem begins to weave its ties.
      The canvas speaks in colors bold,
      A story told in shades of gold.
      
      The ${cleanName} stands as witness,
      To moments captured without bliss.
      In every stroke, a tale unfolds,
      Of nature's beauty, young and old.
      
      The light that dances through the frame,
      Creates a world without shame.
      Where shadows play and colors blend,
      In this moment, beauty never ends.
      
      So let this image be our guide,
      Through landscapes where the wild resides.
      In every hue, in every line,
      A story of beauty, pure and divine.
      
      ${description} becomes our muse,
      In this poem, its essence we choose.
      A testament to nature's art,
      In every word, a work of heart.`,
      
      `In the realm of ${description}, where light and shadows meet,
      A poem begins its gentle beat.
      The canvas speaks in colors true,
      A story told in shades of blue.
      
      The ${cleanName} stands as witness,
      To moments captured without bliss.
      In every stroke, a tale unfolds,
      Of nature's beauty, young and old.
      
      The light that dances through the frame,
      Creates a world without shame.
      Where shadows play and colors blend,
      In this moment, beauty never ends.
      
      So let this image be our guide,
      Through landscapes where the wild resides.
      In every hue, in every line,
      A story of beauty, pure and divine.
      
      ${description} becomes our muse,
      In this poem, its essence we choose.
      A testament to nature's art,
      In every word, a work of heart.`,
      
      // Add more templates as needed
    ];
    
    // Randomly select a template
    const template = templates[Math.floor(Math.random() * templates.length)];
    
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
    throw new Error(`Failed to generate poem: ${error.message}`);
  }
}
