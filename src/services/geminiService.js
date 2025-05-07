import { GEMINI_API_KEY, GEMINI_API_URL, GEMINI_MODEL } from '../config/openai';

const geminiService = {
  async generateContent(imageData) {
    try {
      console.log('Gemini API Key:', GEMINI_API_KEY.substring(0, 4) + '...' + GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 4));
      
      const response = await fetch(`${GEMINI_API_URL}/models/${GEMINI_MODEL}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GEMINI_API_KEY}`
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
          tools: ['image'],
          generationConfig: {
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Gemini API Error:', error);
        throw new Error(`Gemini API Error: ${error.message}`);
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
