import OpenAI from 'openai';

const getCaption = async (image: string) => {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'You are an AI that analyzes images. If the image contains any visual elements such as objects, people, or scenery, provide a detailed description of the image content in Korean. However, if the image contains only text with no other visual elements, respond with "Failed".',
          },
          {
            type: 'image_url',
            image_url: {
              url: image,
            },
          },
        ],
      },
    ],
  });

  console.log('image caption in getCaption:', completion.choices[0].message);
  return completion.choices[0].message;
};

export default getCaption;
