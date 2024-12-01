import axios from 'axios';
import TestImg from '../../public/images/test.jpg';

const getCaption = async (picture: string) => {
  const captionKey = process.env.NEXT_PUBLIC_CAPTION_API_KEY;

  if (!captionKey) {
    throw new Error(
      'Caption API Key is missing. Please check your environment variables.',
    );
  }

  const data = {
    image: TestImg,
  };
  const imagePath = '/images/test.jpg';

  // 이미지 파일을 Blob으로 읽기
  const response = await fetch(imagePath);
  const blob = await response.blob();

  // FormData 생성 및 Blob 추가
  const formData = new FormData();
  formData.append('image', blob, 'test.jpg'); // 세 번째 인자는 파일 이름
  try {
    const response = await axios.post(
      `/api/captionProxy?appKey=${captionKey}`,
      { image: picture },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    console.log('Caption Response:', response.data.caption);
    return response.data.caption;
  } catch (error) {
    console.error('Error during Caption request:', error);
    throw new Error('Failed to process Caption request.');
  }
};

export default getCaption;
