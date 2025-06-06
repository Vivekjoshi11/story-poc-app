/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface GenerateImageRequest {
  prompt: string;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt }: GenerateImageRequest = await req.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey="sk-wMeUGI6UV7pXY_gXJFSGcIRk15qTBfQ1EK0FpheFPj3SCF7g";
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await axios.post(
      'https://api.goenhance.ai/api/v1/text2image/generate', 
      {
        args: {
          prompt,
          model: 'default', 
          resolution: '512x512', 
        },
        type: 'mx-text-to-image', 
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const imageUrl = response.data.data?.url;
    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL returned' }, { status: 500 });
    }

    return NextResponse.json({ image: imageUrl }, { status: 200 });
  } catch (error: any) {
    console.error('Error generating image:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}