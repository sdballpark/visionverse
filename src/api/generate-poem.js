import { NextResponse } from 'next/server';
import axios from 'axios';
import { GEMINI_API_KEY, GEMINI_API_URL, GEMINI_MODEL } from '../config/gemini';

export async function POST(request) {
  try {
    console.log('Starting image processing...');
    console.log('Gemini API Configuration:', {
      apiKey: GEMINI_API_KEY.substring(0, 5) + '...' + GEMINI_API_KEY.substring(GEMINI_API_KEY.length - 5),
      apiUrl: GEMINI_API_URL,
      model: GEMINI_MODEL
    });

    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      console.error('No image provided in request');
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    console.log('File info:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and GIF are supported.' },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit.' },
        { status: 400 }
      );
    }

    // Process the image
    const imageBuffer = Buffer.from(await file.arrayBuffer());
    const base64Image = imageBuffer.toString('base64');

    console.log('Image processed successfully. Starting Gemini API call...');

    // Generate content using Gemini
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}/models/gemini-pro-vision:generateContent`,
        {
          contents: [
            {
              inlineData: {
                mimeType: file.type,
                data: base64Image
              }
            }
          ],
          tools: ['image'],
          generationConfig: {
            temperature: 0.7
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GEMINI_API_KEY}`,
            'X-Goog-Api-Key': GEMINI_API_KEY
          }
        }
      );

      console.log('Gemini API response:', {
        status: response.status,
        statusText: response.statusText
      });

      const data = response.data;
      console.log('Response data:', data);

      // Extract and format the poem
      const poem = data.candidates[0].content.parts[0].text;
      
      return NextResponse.json({
        success: true,
        poem: poem.trim(),
        metadata: {
          model: 'gemini-pro-vision',
          timestamp: new Date().toISOString(),
          imageType: file.type
        }
      });

    } catch (apiError) {
      console.error('Gemini API Error:', {
        message: apiError.message,
        status: apiError.response?.status,
        statusText: apiError.response?.statusText,
        data: apiError.response?.data
      });
      throw apiError;
    }
  } catch (error) {
    console.error('Error in generate-poem:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    
    // Provide more specific error messages
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your Gemini API key configuration.' },
        { status: 401 }
      );
    } else if (error.response?.status === 403) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Please check your API key permissions.' },
        { status: 403 }
      );
    } else if (error.response?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment and try again.' },
        { status: 429 }
      );
    } else {
      return NextResponse.json(
        { error: `Gemini API Error: ${error.message || 'Failed to generate poem'}` },
        { status: error.response?.status || 500 }
      );
    }
  }
}
