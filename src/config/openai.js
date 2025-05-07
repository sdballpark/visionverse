export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
export const OPENAI_API_URL = 'https://api.openai.com/v1';
export const IMAGE_DESCRIPTION_MODEL = 'text-davinci-003';
export const POEM_GENERATION_MODEL = 'text-davinci-003';

export const POEM_PROMPT = `You are a skilled poet who can create beautiful, meaningful poems based on visual content.

Given an image description, generate an original poem that captures the essence and emotions of the scene.

Key characteristics:
- Use vivid, descriptive language
- Maintain a consistent rhythm and meter
- Create a clear narrative or theme
- Use metaphors and imagery that relate to the visual elements
- Keep the poem between 12-20 lines

Image description: {description}

Poem:`;
