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
    } catch (error) {
      console.log('Failed to access media devices', error);
    }
  };

  // useEffect(() => {
  //     if (isCameraOn) {
  //         console.log('camera on')
  //         console.log(stream?.getVideoTracks())

  //         stream?.getVideoTracks().forEach((track) => (track.enabled = isCameraOn));

  //         getMedia();
  //     } else {
  //         console.log('camera off')
  //         console.log(stream?.getVideoTracks())

  //         stream?.getVideoTracks().forEach((track) => (track.enabled = isCameraOn));
  //         // stream?.getVideoTracks().forEach((track) => (track.stop()));

  //     }
  // }, [isCameraOn]);

  // useEffect(() => {
  //     if (isMicOn) {
  //         console.log('mic on');
  //         console.log(stream?.getAudioTracks())

  //         stream?.getAudioTracks().forEach((track) => (track.enabled = isMicOn));

  //         getMedia();
  //     } else {
  //         console.log('mic off');
  //         console.log(stream?.getAudioTracks())
  //         stream?.getAudioTracks().forEach((track) => (track.enabled = isMicOn));
  //         // stream?.getAudioTracks().forEach((track) => (track.stop()));

  //     }
  // }, [isMicOn]);

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

    // router.push(`/test_meeting`);
  };

  return (
    <div className="relative w-full flex flex-col items-center px-6">
      <div className="absolute top-1/20 max-w-515 w-full flex flex-col items-center">
        <h1 className="text-primary font-bold text-4xl">미리 보기</h1>
        <p className="mt-2 text-primary mb-10">비디오와 오디오를 설정하세요</p>
        <Video
          width={'full'}
          height={'h-80'}
          videoRef={videoRef}
          isCameraOn={isCameraOn}
          isMicOn={isMicOn}
          nickName={nickName}
          userName={DATA.user_name}
        />
        <div className="w-full my-6 flex flex-row justify-between">
          <div className="flex gap-4">
            <Control name={'camera'} OnClick={handleCameraClick}>
              {isCameraOn ? <CameraOn /> : <CameraOff />}
            </Control>
            <Control name={'mic'} OnClick={handleMicClick}>
              {isMicOn ? <MicOn /> : <MicOff width={32} height={32} />}
            </Control>
          </div>
          <button className="h-12 w-12 flex justify-center items-center border border-primary rounded-lg">
            <SettingIcon fill={'#5856D6'} />
          </button>
        </div>
        <div className="flex flex-row w-full gap-4">
          <Input
            placeholder="사용할 이름을 입력해주세요"
            defaultValue={'홍길동'}
            onChange={handleChange}
            className="basis-3/4"
          />
          <Button onClick={handleJoinClick} className="basis-1/4">
            참가
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
