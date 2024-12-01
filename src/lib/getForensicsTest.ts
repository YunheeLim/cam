import axios from 'axios';

const getTest = async () => {
  const data = {
    latitude: '37.237555 N',
    longitude: '127.0710272 E',
    dateTime: '2024-11-04T15:55:00.012Z',
  };

  try {
    const response = await axios.post(
      'http://localhost:8080/api/result',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // 쿠키 허용
      },
    );
    if (response.status === 200) {
      console.log('response:', response); // 성공 응답 출력
    }
  } catch (error) {
    console.error('Error test request:', error);
    throw new Error('Failed to test request.');
  }
};

export default getTest;
