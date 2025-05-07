const validateGeminiApiKey = (apiKey) => {
  // Log the validation process
  console.log('Validating Gemini API key...');
  
  // Basic validation
  if (!apiKey) {
    console.error('No API key provided');
    throw new Error('Gemini API key is required. Please set VITE_GEMINI_API_KEY in your environment variables.');
  }

  const trimmedKey = apiKey.trim();
  if (trimmedKey === '') {
    console.error('API key is empty after trimming whitespace');
    throw new Error('Gemini API key cannot be empty. Please check your environment variables.');
  }

  // Gemini API key format validation
  const apiKeyFormat = /^AIza[A-Za-z0-9_-]{35,}$/;
  if (!apiKeyFormat.test(trimmedKey)) {
    console.log('API key format validation failed');
    
    // Validate Gemini API key format
    if (!trimmedKey.startsWith('AIza')) {
      console.error('Invalid Gemini API key format');
      throw new Error('Invalid Gemini API key format.\n' +
        'Expected format: AIza followed by 35+ alphanumeric characters\n' +
        'Please verify your key in Google Cloud Console');
    }

    // Check key length
    if (trimmedKey.length < 39) {
      console.error('Gemini API key too short');
      throw new Error('Gemini API key is too short. It should be at least 39 characters long.');
    }

    // Check for any invalid characters
    const invalidChars = trimmedKey.match(/[^A-Za-z0-9_-]/g);
    if (invalidChars) {
      console.error('Invalid characters found in API key:', invalidChars);
      throw new Error('Gemini API key contains invalid characters. Only letters, numbers, underscores, and hyphens are allowed.');
    }

    // Log successful validation
    console.log('API key validation successful');
    console.log('Key length:', trimmedKey.length);
  }
};

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Validate API key immediately
if (!GEMINI_API_KEY) {
  console.error('Gemini API key is missing. Please set VITE_GEMINI_API_KEY in your environment variables.');
  throw new Error('Gemini API key is required');
}

validateGeminiApiKey(GEMINI_API_KEY);
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/projects/visionverse-app/locations/global/models/gemini-pro-vision';
export const GEMINI_MODEL = 'gemini-pro-vision';

// Add API version validation
const validateApiUrl = (url) => {
  if (!url) {
    throw new Error('Gemini API URL is required. Please check your configuration.');
  }
  if (!url.includes('generativelanguage.googleapis.com')) {
    throw new Error('Invalid API URL format. Please use the correct Gemini API endpoint.');
  }
  if (!url.includes('gemini-pro-vision')) {
    throw new Error('Invalid model specification. Expected gemini-pro-vision model.');
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
