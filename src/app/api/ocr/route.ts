// pages/api/ocr.ts

import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

// Disable body parsing for raw data
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextApiRequest) {
  if (req.method !== 'POST') {
    NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    return;
  }

  console.log('req:', req);
  const ocr_key = process.env.NEXT_PUBLIC_OCR_API_KEY;

  // Collect raw data from request
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const rawBody = Buffer.concat(chunks).toString('utf-8'); // base64 image data

  const data = {
    version: 'V2',
    requestId: '1234',
    timestamp: Date.now().toString(),
    lang: 'ko',
    images: [
      {
        format: 'png',
        name: 'ocr_img',
        data: rawBody, // Pass the base64 image data here
      },
    ],
    enableTableDetection: false,
  };

  try {
    const response = await axios.post(
      'https://5mv4zmu94s.apigw.ntruss.com/custom/v1/34638/138074ec68ed56d430eac26486a538e26fa9b82b8fdc244935f2f7d9fd59f311/general',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-OCR-SECRET': ocr_key,
        },
      },
    );

    NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error making OCR request:', error);
    NextResponse.json(
      { error: 'Failed to process OCR request' },
      { status: 500 },
    );
  }
}
