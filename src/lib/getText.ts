import blobToBase64 from './blobToBase64';
import { StreamManager } from 'openvidu-browser';
import getOcrText from './getOcr';
import getCaption from './getCaption';

interface fieldType {
  inferConfidence: number;
  inferText: string;
  lineBreak: boolean;
  type: string;
  valueType: string;
}
interface imageType {
  convertedImageInfo: {
    height: number;
    longImage: boolean;
    pageIndex: number;
    width: number;
  };
  fields: fieldType[];
  inferResult: string;
  message: string;
  name: string;
  uid: string;
}

interface itemType {
  images: imageType[];
  requestId: string;
  timestamp: number;
  version: string;
}

const getText = async (mainStreamManager: StreamManager) => {
  // 최종 텍스트
  let returnText = '';

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

        const blob = await new Promise<Blob | null>(resolve =>
          canvas.toBlob(resolve),
        );

        if (blob) {
          const url = URL.createObjectURL(blob);
          // 생성된 blob 확인
          console.log('blob:', blob);
          // const new_blob = resizeImageBlob(blob, 100, 100, 0.7);

          const base64Data = await blobToBase64(blob);
          // Remove the "data:image/png;base64," prefix
          const base64String = base64Data.split(',')[1];

          // 캡쳐 확인 테스트용
          // window.open(url, '_blank');

          // caption api
          try {
            const captionResult = await getCaption(base64Data);
            const formattedCaption = captionResult?.content;
            console.log('formatted Caption Result:', formattedCaption);

            if (formattedCaption !== 'Failed') {
              returnText += formattedCaption;
            }
          } catch (error) {
            console.error('Failed to get Caption Text', error);
          }

          // ocr api
          try {
            const ocrResult = await getOcrText(base64String);
            const extractedText = ocrResult.images[0].fields
              .map((item: fieldType) => item.inferText)
              .join(' ');
            console.log('formatted OCR Result:', extractedText);
            return returnText + extractedText;
          } catch (error) {
            console.error('Failed to get OCR text:', error);
          }
        } else {
          console.error('Failed to create Blob from canvas');
        }
      } else {
        console.error('Failed to get canvas 2D context');
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }
};

export default getText;
