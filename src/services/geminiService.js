import { GEMINI_API_KEY, GEMINI_API_URL, GEMINI_MODEL } from '../config/gemini';

const geminiService = {
  async generateContent(imageData) {
    try {
      console.log('Gemini API Key:', GEMINI_API_KEY.substring(0, 4) + '...' + GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 4));
      
      const response = await fetch(`${GEMINI_API_URL}/models/gemini-pro-vision:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
          'X-Goog-Api-Key': GEMINI_API_KEY,
          'Accept': 'application/json',
          'User-Agent': 'Visionverse/1.0',
          'X-Goog-Api-Key-Version': '1.0'
        },
        body: JSON.stringify({
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
            candidateCount: 1
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Gemini API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: error
        });
        throw new Error(`Gemini API Error (${response.status}): ${error.message || response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
      console.error('Error in generateContent:', error);
      throw error;
    }
  }
};

export default geminiService;
