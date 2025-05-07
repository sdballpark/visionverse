const validateGeminiApiKey = (apiKey) => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Gemini API key is required');
  }
  if (!apiKey.startsWith('AIza')) {
    throw new Error('Invalid Gemini API key format. API keys should start with "AIza"');
  }
  if (apiKey.length < 39) {  // Gemini API keys are typically 39 characters long
    throw new Error('Invalid Gemini API key length. Expected at least 39 characters');
  }
};

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
validateGeminiApiKey(GEMINI_API_KEY);
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta';
export const GEMINI_MODEL = 'gemini-pro';
