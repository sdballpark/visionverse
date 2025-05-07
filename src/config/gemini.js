const validateGeminiApiKey = (apiKey) => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Gemini API key is required. Please set VITE_GEMINI_API_KEY in your Vercel environment variables.');
  }
  if (!apiKey.startsWith('AIza')) {
    throw new Error('Invalid Gemini API key format. API keys must start with "AIza". Please verify your key in Google Cloud Console.');
  }
  if (apiKey.length < 39) {
    throw new Error('Invalid Gemini API key length. Gemini API keys must be at least 39 characters. Please verify your key in Google Cloud Console.');
  }
  if (apiKey.includes('AIzaSY')) {
    throw new Error('Invalid Gemini API key format. The key appears to be a legacy format. Please generate a new key in Google Cloud Console.');
  }
};

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
validateGeminiApiKey(GEMINI_API_KEY);
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1'; // Gemini API v1 endpoint
export const GEMINI_MODEL = 'gemini-pro-vision';

// Add API version validation
const validateApiUrl = (url) => {
  if (!url) {
    throw new Error('Gemini API URL is required. Please check your configuration.');
  }
  if (!url.includes('v1')) {
    throw new Error('Invalid API URL version. Expected v1. Please verify your configuration.');
  }
  if (!url.includes('generativelanguage.googleapis.com')) {
    throw new Error('Invalid API domain. Must use generativelanguage.googleapis.com. Please verify your configuration.');
  }
  if (!url.startsWith('https://')) {
    throw new Error('API URL must use HTTPS. Please verify your configuration.');
  }
};

validateApiUrl(GEMINI_API_URL);

// Add model validation
const validateModel = (model) => {
  if (!model) {
    throw new Error('Model name is required');
  }
  if (!model.includes('gemini-pro')) {
    throw new Error('Invalid model name. Must be a Gemini Pro model');
  }
};

validateModel(GEMINI_MODEL);
