import { NextResponse } from 'next/server';
import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

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

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    // Prepare Gemini API request
    const prompt = "Generate a beautiful, descriptive poem of 5-10 lines based on the following image. Focus on capturing the emotions and atmosphere of the scene.";

    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          inlineData: {
            mimeType: file.type,
            data: base64
          }
        },
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 256
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Extract and format the poem
    const poem = response.data.candidates[0].content.parts[0].text;
    
    return NextResponse.json({ 
      poem: poem.trim(),
      metadata: {
        model: 'gemini-pro-vision',
        timestamp: new Date().toISOString(),
        imageType: file.type
      }
    });
  } catch (error) {
    console.error('Error generating poem:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate poem' },
      { status: 500 }
    );
  }
}
