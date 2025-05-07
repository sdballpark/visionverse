import { GEMINI_API_KEY, GEMINI_API_URL, GEMINI_MODEL } from '../config/gemini';

const validateRequest = (imageData, apiKey) => {
  if (!imageData) {
    throw new Error('No image data provided');
  }
  if (!apiKey || !apiKey.startsWith('AIza')) {
    throw new Error('Invalid Gemini API key');
  }
  if (apiKey.length < 39) {
    throw new Error('Gemini API key too short');
  }
};

const geminiService = {
  async generateContent(imageData) {
    try {
      // Validate inputs
      validateRequest(imageData, GEMINI_API_KEY);
      
      console.log('Starting Gemini API request...');
      console.log('API Configuration:', {
        url: `${GEMINI_API_URL}/models/${GEMINI_MODEL}:generateContent`,
        apiKeyLength: GEMINI_API_KEY.length,
        startsWithAIza: GEMINI_API_KEY.startsWith('AIza'),
        model: GEMINI_MODEL
      });
      console.log('Starting Gemini API request...');

      // Construct the full API URL
      const apiUrl = `${GEMINI_API_URL}/models/${GEMINI_MODEL}:generateContent`;
      console.log('Making API request to:', apiUrl);

      try {
        console.log('Sending request to:', apiUrl);
        console.log('Request headers:', Object.keys({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
          'Accept': 'application/json',
          'User-Agent': 'Visionverse/1.0',
          'X-Goog-Api-Key-Version': '1.0',
          'X-Goog-Api-Key-Location': 'header',
          'X-Request-ID': Math.random().toString(36).substring(2, 15),
          'X-Goog-User-Project': 'visionverse-app',
          'X-Goog-Api-Key-Format': 'v2',
          'X-Goog-Api-Key-Source': 'visionverse-web',
          'X-Goog-Api-Key-Region': 'global',
          'X-Goog-Api-Key-Type': 'service_account',
          'X-Goog-Api-Key-Usage': 'image-generation'
        }));
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GEMINI_API_KEY}`,
            'Accept': 'application/json',
            'User-Agent': 'Visionverse/1.0',
            'X-Goog-Api-Key-Version': '1.0',
            'X-Goog-Api-Key-Location': 'header',
            'X-Request-ID': Math.random().toString(36).substring(2, 15),
            'X-Goog-User-Project': 'visionverse-app',
            'X-Goog-Api-Key-Format': 'v2',
            'X-Goog-Api-Key-Source': 'visionverse-web',
            'X-Goog-Api-Key-Region': 'global',
            'X-Goog-Api-Key-Type': 'service_account',
            'X-Goog-Api-Key-Usage': 'image-generation'
          },
          body: JSON.stringify({
            model: 'gemini-pro-vision',
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
                {
                  category: 'HARM_CATEGORY_HARASSMENT',
                  threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                },
                {
                  category: 'HARM_CATEGORY_HATE_SPEECH',
                  threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                },
                {
                  category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                  threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                },
                {
                  category: 'HARM_CATEGORY_DANGEROUS',
                  threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                },
                {
                  category: 'HARM_CATEGORY_HARSH',
                  threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                },
                {
                  category: 'HARM_CATEGORY_SELF_HARM',
                  threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                },
                {
                  category: 'HARM_CATEGORY_VIOLENCE',
                  threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                }
              ],
            }
          })
        });

        if (!response.ok) {
          try {
            const error = await response.json();
            console.error('Gemini API Error Details:', {
              status: response.status,
              statusText: response.statusText,
              error: error,
              headers: Object.fromEntries(response.headers.entries()),
              requestUrl: `${GEMINI_API_URL}/models/${GEMINI_MODEL}:generateContent`,
              responseTime: Date.now() - startTime
            });
          } catch (parseError) {
            console.error('Failed to parse error response:', {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries()),
              requestUrl: `${GEMINI_API_URL}/models/${GEMINI_MODEL}:generateContent`,
              responseTime: Date.now() - startTime
            });
          }

          const errorMessage = `Gemini API Error (${response.status}): ${error.message || response.statusText}`;
          console.error(errorMessage);
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error('Gemini API Request Error:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });

        if (error.response) {
          console.error('API Response Details:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
          });
        }

        throw error;
      }

      const data = await response.json();
      console.log('Gemini API Response:', {
        status: response.status,
        candidates: data.candidates?.length,
        response: data,
        requestUrl: `${GEMINI_API_URL}/models/${GEMINI_MODEL}:generateContent`
      });

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No content generated by Gemini API');
      }

      return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
      console.error('Error in generateContent:', error);
      throw error;
    }
  }
};

export default geminiService;
