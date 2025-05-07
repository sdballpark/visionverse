# VisionVerse - AI-Powered Image-to-Poem Generator

A modern web application that generates beautiful poems based on uploaded images using AI.

## Features

- Drag-and-drop or click-to-upload image interface
- AI-powered poem generation
- Responsive design with mobile-first approach
- Download generated poems as text files
- Audio playback of generated poems
- Dark/Light mode toggle
- Camera integration for mobile devices

## Setup

1. First, get an OpenAI API key:
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Copy the API key

2. Create a `.env` file in the project root:
   ```bash
   echo "VITE_OPENAI_API_KEY=your_openai_api_key_here" > .env
   ```

3. Clone the repository
4. Install dependencies:
   ```bash
   npm install
   ```
5. Create a `.env` file with your API keys:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

The application is deployed using Vercel. You can deploy your own instance by:
1. Creating a new Vercel project
2. Connecting your GitHub repository
3. Adding environment variables in Vercel dashboard

## Tech Stack

- React
- Vite
- Tailwind CSS
- Google Gemini Pro Vision API
- OpenAI API
- Web Speech API
- Express.js (Backend)

## License

MIT
