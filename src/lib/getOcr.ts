import axios from 'axios';

const getOcrText = async (image: string) => {
  const ocrKey = process.env.NEXT_PUBLIC_OCR_API_KEY;

  if (!ocrKey) {
    throw new Error(
      'OCR API Key is missing. Please check your environment variables.',
    );
  }

  const data = {
    version: 'V2',
    requestId: '1234',
    timestamp: Date.now().toString(),
    lang: 'ko',
    images: [
      {
        format: 'png',
        name: 'ocr_img',
        data: image, // Base64 image data
      },
    ],
    enableTableDetection: false,
  };

  try {
    const response = await axios.post('/api/ocrProxy', data, {
      headers: {
        'Content-Type': 'application/json',
        'X-OCR-SECRET': ocrKey,
      },
    });
    console.log('OCR Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during OCR request:', error);
    throw new Error('Failed to process OCR request.');
  }
};

export default getOcrText;
