import { GEMINI_API_KEY, GEMINI_API_URL, GEMINI_MODEL } from '../config/gemini';

const validateRequest = (imageData, apiKey) => {
  if (!imageData) {
    throw new Error('No image data provided');
  }
  
  // Strict Gemini API key validation
  if (!apiKey) {
    throw new Error('Gemini API key is missing. Please check your VITE_GEMINI_API_KEY in Vercel settings.');
  }
  
  // Check Gemini key format
  if (!apiKey.startsWith('AIza')) {
    throw new Error('Invalid Gemini API key format. Please verify your key starts with "AIza" in Vercel settings.');
  }
  
  // Check key length
  if (apiKey.length < 39) {
    throw new Error('Gemini API key too short. Please verify your key is at least 39 characters long in Vercel settings.');
  }
  
  // Check for invalid characters
  const invalidChars = apiKey.match(/[^A-Za-z0-9_-]/g);
  if (invalidChars) {
    throw new Error(`Invalid characters in Gemini API key. Only letters, numbers, underscores, and hyphens are allowed. Found: ${invalidChars.join(', ')}`);
  }
};

const geminiService = {
  async generateContent(imageData) {
    try {
      // Validate inputs
      validateRequest(imageData, GEMINI_API_KEY);
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
        'Accept': 'application/json',
        'User-Agent': 'Visionverse/1.0',
        'X-Goog-Api-Key-Version': '1.0',
        'X-Goog-Api-Key-Location': 'header',
        'X-Goog-User-Project': 'projects/visionverse-app',
        'X-Goog-Api-Key-Format': 'v2',
        'X-Goog-Api-Key-Source': 'visionverse-web',
        'X-Goog-Api-Key-Region': 'global',
        'X-Goog-Api-Key-Type': 'service_account',
        'X-Goog-Api-Key-Usage': 'image-generation'
      };

      console.log('Starting Gemini API request...');
      console.log('API Configuration:', {
        apiUrl: `${GEMINI_API_URL}/projects/visionverse-app/locations/global/models/${GEMINI_MODEL}:generateContent`,
        apiKeyLength: GEMINI_API_KEY.length,
        startsWithAIza: GEMINI_API_KEY.startsWith('AIza'),
        model: GEMINI_MODEL,
        headers: Object.keys(headers)
      });

      const startTime = Date.now();
      // Format the image data for Gemini API
      const formattedImageData = {
        contents: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageData
            }
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
          candidateCount: 1,
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HARSH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SELF_HARM', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_VIOLENCE', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
          ]
        }
      };

      console.log('Formatted request body:', {
        contents: formattedImageData.contents.length,
        mimeType: formattedImageData.contents[0].inlineData.mimeType,
        dataLength: formattedImageData.contents[0].inlineData.data.length
      });

      const response = await fetch(`${GEMINI_API_URL}/projects/visionverse-app/locations/global/models/${GEMINI_MODEL}:generateContent`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formattedImageData)
      });

      const responseTime = Date.now() - startTime;
      console.log('API Response Time:', responseTime + 'ms');
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Gemini API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          error: error
        });
        
        let errorMessage = 'Failed to generate poem using Gemini API.';
        if (error.message) {
          errorMessage = `Gemini API Error: ${error.message}`;
          if (error.message.includes('invalid_api_key')) {
            errorMessage = 'Invalid Gemini API key format. Please verify your key starts with "AIza" in Vercel settings.';
          } else if (error.message.includes('rate_limit')) {
            errorMessage = 'Gemini API rate limit exceeded. Please wait a moment and try again.';
          } else if (error.message.includes('401')) {
            errorMessage = 'Unauthorized access. Please check your Gemini API key in Vercel settings.';
          } else if (error.message.includes('403')) {
            errorMessage = 'Forbidden access. Please check your Gemini API key permissions.';
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API Response:', {
        candidates: data.candidates?.length || 0,
        responseCode: response.status,
        responseTime: responseTime + 'ms'
      });

      // Extract the generated text from the response
      const text = data.candidates?.[0]?.content?.text;
      if (!text) {
        throw new Error('No text generated by Gemini API');
      }

      return text;

    } catch (error) {
      console.error('Error in generateContent:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      throw error;
    }
  }
};

export default geminiService;
