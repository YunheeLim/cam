import blobToBase64 from './blobToBase64';
import { StreamManager } from 'openvidu-browser';
import getOcrText from './getOcr';

const handleCapture = async (mainStreamManager: StreamManager) => {
  if (mainStreamManager?.stream) {
    const videoTrack = mainStreamManager?.stream
      ?.getMediaStream()
      .getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);

    try {
      const imageBitmap = await imageCapture.grabFrame();

      // Create a canvas to draw the frame and convert it to a Blob
      const canvas = document.createElement('canvas');
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(imageBitmap, 0, 0);
        canvas.toBlob(async blob => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            // 생성된 blob 확인
            console.log('blob:', blob);

            const base64Data = await blobToBase64(blob);
            // Remove the "data:image/png;base64," prefix
            const base64String = base64Data.split(',')[1];

            // 캡쳐 확인 테스트용
            window.open(url, '_blank');

            // ocr api
            try {
              const ocrResult = await getOcrText(base64String);
              console.log('OCR Result:', ocrResult);
            } catch (error) {
              console.error('Failed to get OCR text:', error);
            }
          } else {
            console.error('Failed to create Blob from canvas');
          }
        });
      } else {
        console.error('Failed to get canvas 2D context');
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }
};

export default handleCapture;
