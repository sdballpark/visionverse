# VisionVerse - AI-Powered Image-to-Poem Generator

## API Integration

The application uses the Gemini API to generate poems based on images. The API key is loaded from the .env file and used to authenticate requests to the Gemini API.

## Features

- Drag-and-drop or click-to-upload image interface
- AI-powered poem generation
- Responsive design with mobile-first approach
- Download generated poems as text files
- Audio playback of generated poems
- Dark/Light mode toggle
- Camera integration for mobile devices

## Setup

1. First, get a Gemini API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Enable the Generative AI API
   - Create a new API key
   - Copy the API key (it starts with "AIza")

2. Create a `.env` file in the root directory:
   ```bash
   echo "VITE_GEMINI_API_KEY=your_gemini_api_key_here" > .env
   ```

3. Clone the repository
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the development server:
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
