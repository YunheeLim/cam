'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useVideo } from '@/app/contexts/VideoContext';
import Video from '@/components/Video';
import Control from '@/components/Control';
import CameraOn from '../../../../public/svgs/camera_on.svg';
import CameraOff from '../../../../public/svgs/camera_off.svg';
import MicOn from '../../../../public/svgs/mic_on.svg';
import MicOff from '../../../../public/svgs/mic_off.svg';
import SettingIcon from '../../../../public/svgs/setting.svg';
import Input from '@/components/Input';
import Button from '@/components/Button';

declare global {
  interface ImageCapture {
    new (videoTrack: MediaStreamTrack): ImageCapture;
    takePhoto(): Promise<Blob>;
    grabFrame(): Promise<ImageBitmap>;
  }

  var ImageCapture: {
    prototype: ImageCapture;
    new (videoTrack: MediaStreamTrack): ImageCapture;
  };
}

const DATA = {
  user_name: '홍길동',
};

const Preview = () => {
  const router = useRouter();
  const params = useParams();
  const {
    videoRef,
    stream,
    setStream,
    isCameraOn,
    setIsCameraOn,
    isMicOn,
    setIsMicOn,
  } = useVideo();

  // const [isCameraOn, setIsCameraOn] = useState(true);
  // const [isMicOn, setIsMicOn] = useState(true);
  const [sessionId, setSessionId] = useState<string | string[]>('');
  const [nickName, setNickName] = useState<string>(DATA.user_name);
  // const [stream, setStream] = useState<MediaStream | null>(null);
  // const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log('session id', params.id);
    setSessionId(params.id);
    getMedia();
  }, [params]);

  const getMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: isMicOn,
        video: isCameraOn,
      });
      setStream(mediaStream);
      if (videoRef?.current) {
        videoRef.current.srcObject = mediaStream;
      }
      detectChanges();
    } catch (error) {
      console.log('Failed to access media devices', error);
    }
  };

  const handleCameraClick = () => {
    setIsCameraOn(prevState => !prevState);
    stream?.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
  };

  const handleMicClick = () => {
    setIsMicOn(prevState => !prevState);
    stream?.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickName(e.target.value);
  };

  const handleJoinClick = () => {
    router.push(
      `/meeting/${sessionId}?nickName=${nickName ? nickName : DATA.user_name}`,
    );
  };

  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Captured image state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevFrameData = useRef<ImageData | null>(null);

  const handleCapture = async () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(videoTrack);
      try {
        const blob = await imageCapture.takePhoto();
        const url = URL.createObjectURL(blob);
        setCapturedImage(url); // Update state with the image URL

        // downloadImage(url, 'capture.png');
        console.log(blob);
      } catch (error) {
        console.error('Error capturing image:', error);
      }
    }
  };

  const detectChanges = async () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const track = stream?.getVideoTracks()[0];
    if (!track) return;

    const imageCapture = new (window as any).ImageCapture(track);

    const checkFrame = async () => {
      try {
        const bitmap = await imageCapture.grabFrame();
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);

        const currentFrameData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        if (
          prevFrameData.current &&
          hasFrameChanged(prevFrameData.current, currentFrameData)
        ) {
          console.log('Screen content changed, capturing...');
          const capturedBlob = canvas.toDataURL('image/png');
          setCapturedImage(capturedBlob);
        }

        prevFrameData.current = currentFrameData;
      } catch (error) {
        console.error('Error capturing frame:', error);
      }

      requestAnimationFrame(checkFrame);
    };

    requestAnimationFrame(checkFrame);
  };

  const hasFrameChanged = (prev: ImageData, current: ImageData) => {
    const threshold = 10000; // Define a difference threshold
    let diffCount = 0;

    for (let i = 0; i < prev.data.length; i += 4) {
      const rDiff = Math.abs(prev.data[i] - current.data[i]);
      const gDiff = Math.abs(prev.data[i + 1] - current.data[i + 1]);
      const bDiff = Math.abs(prev.data[i + 2] - current.data[i + 2]);

      if (rDiff + gDiff + bDiff > 50) {
        // If color difference is significant
        diffCount++;
      }

      if (diffCount > threshold) return true; // If enough pixels have changed
    }

    return false;
  };

  return (
    <div className="relative flex w-full flex-col items-center px-6">
      <div className="absolute top-1/20 flex w-full max-w-515 flex-col items-center">
        <h1 className="text-4xl font-bold text-primary">미리 보기</h1>
        <p className="mb-10 mt-2 text-primary">비디오와 오디오를 설정하세요</p>
        <Video
          width={'full'}
          height={'h-80'}
          videoRef={videoRef}
          isCameraOn={isCameraOn}
          isMicOn={isMicOn}
          nickName={nickName}
          userName={DATA.user_name}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className="my-6 flex w-full flex-row justify-between">
          <div className="flex gap-4">
            <Control name={'camera'} OnClick={handleCameraClick}>
              {isCameraOn ? <CameraOn /> : <CameraOff />}
            </Control>
            <Control name={'mic'} OnClick={handleMicClick}>
              {isMicOn ? <MicOn /> : <MicOff width={32} height={32} />}
            </Control>
          </div>
          <button className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary">
            <SettingIcon fill={'#5856D6'} />
          </button>
        </div>
        <div className="flex w-full flex-row gap-4">
          <Input
            placeholder="사용할 이름을 입력해주세요"
            defaultValue={'홍길동'}
            onChange={handleChange}
            className="basis-3/4"
          />
          <Button onClick={handleJoinClick} className="basis-1/4">
            참가
          </Button>
          <Button onClick={handleCapture} className="mt-4">
            캡처
          </Button>
        </div>
        {capturedImage && ( // Show the captured image if available
          <div className="mt-4">
            <h2 className="text-lg font-semibold">캡처된 이미지:</h2>
            <img src={capturedImage} alt="Captured preview" className="mt-2" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
