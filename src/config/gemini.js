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
  if (!apiKey.includes('AIza')) {
    throw new Error('Invalid Gemini API key format. Must contain "AIza"');
  }
};

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
validateGeminiApiKey(GEMINI_API_KEY);
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1';
export const GEMINI_MODEL = 'gemini-pro-vision';

// Add API version validation
const validateApiUrl = (url) => {
  if (!url.includes('v1')) {
    throw new Error('Invalid API URL version. Expected v1');
  }
  if (!url.includes('generativelanguage.googleapis.com')) {
    throw new Error('Invalid API domain. Must use generativelanguage.googleapis.com');
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
