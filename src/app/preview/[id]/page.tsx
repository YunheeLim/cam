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
import { useHotkeys } from 'react-hotkeys-hook';
import DeviceModal from '@/components/DeviceModal';

const DATA = {
  user_name: '홍길동',
};

const Preview = () => {
  const router = useRouter();
  const params = useParams();
  const [isShortcut, setIsShortcut] = useState(false); // 키보드 단축키

  useEffect(() => {
    // 회의실 새로고침 관련
    window.sessionStorage.removeItem('firstLoadDone');

    // 단축키 설정 정보
    if (window.localStorage.getItem('shortcut') === 'true') {
      setIsShortcut(true);
    }
  }, []);

  const {
    isCameraOn,
    setIsCameraOn,
    isMicOn,
    setIsMicOn,
    selectedVideoDeviceId,
    setSelectedVideoDeviceId,
    selectedAudioDeviceId,
    setSelectedAudioDeviceId,
    videoDevices,
    setVideoDevices,
    audioDevices,
    setAudioDevices,
  } = useVideo();

  const [prevVideoDeviceId, setPrevVideoDeviceId] = useState<string>('');
  const [prevAudioDeviceId, setPrevAudioDeviceId] = useState<string>('');
  const [isNewStream, setIsNewStream] = useState(false); // 기기 변경으로 인한 새 스트림 생성 여부
  const [isVideoListOpen, setIsVideoListOpen] = useState(false);
  const [isAudioListOpen, setIsAudioListOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | string[]>('');
  const [nickName, setNickName] = useState<string>(DATA.user_name);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log('session id', params.id);
    setSessionId(params.id);
    getMedia();
  }, [params]);

  // 스트림 생성되면 기기 목록 가져오기
  useEffect(() => {
    if (stream) {
      console.log(stream);
      getDevices();
    }
  }, [stream]);

  // 첫 렌더링 시 비디오/오디오 기기 가져온 후 첫 기기로 설정
  useEffect(() => {
    if (!selectedVideoDeviceId && videoDevices.length) {
      setSelectedVideoDeviceId(videoDevices[0].deviceId);
      setPrevVideoDeviceId(videoDevices[0].deviceId);
    }
    if (!selectedVideoDeviceId && audioDevices.length) {
      setSelectedAudioDeviceId(audioDevices[0].deviceId);
      setPrevAudioDeviceId(audioDevices[0].deviceId);
    }
  }, [videoDevices, audioDevices]);

  // 기기 변경 시 새 스트림 생성
  useEffect(() => {
    if (isNewStream) {
      getMedia();
    }
  }, [isNewStream]);

  // 스트림 생성
  const getMedia = async () => {
    try {
      // 새 스트림 요청
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedAudioDeviceId
            ? { exact: selectedAudioDeviceId }
            : undefined,
        },
        video: {
          deviceId: selectedVideoDeviceId
            ? { exact: selectedVideoDeviceId }
            : undefined,
        },
      });

      // 기존 스트림 정리
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsNewStream(false);

      setStream(mediaStream);

      if (videoRef?.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true; // 오디오 플레잉백 방지
      }
    } catch (error) {
      console.log('Failed to access media devices', error);
    }
  };

  // 장치 목록 가져오기
  const getDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        device => device.kind === 'videoinput',
      );
      const audioDevices = devices.filter(
        device => device.kind === 'audioinput',
      );

      console.log('Video Devices:', videoDevices);
      console.log('Audio Devices:', audioDevices);

      setVideoDevices(videoDevices);
      setAudioDevices(audioDevices);
    } catch (error) {
      console.error('Error accessing devices:', error);
    }
  };

  // 카메라 토글
  const handleCameraClick = () => {
    setIsCameraOn(prevState => !prevState);
    stream?.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
  };

  // 마이크 토글
  const handleMicClick = () => {
    setIsMicOn(prevState => !prevState);
    stream?.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
  };

  // 비디오 기기 리스트 모달
  const handleVideoListClick = () => {
    setIsAudioListOpen(false);
    setIsVideoListOpen(prev => !prev);
  };

  // 오디오 기기 리스트 모달
  const handleAudioListClick = () => {
    setIsVideoListOpen(false);
    setIsAudioListOpen(prev => !prev);
  };

  // 모달창 외부 클릭 시 모달 닫힘
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsVideoListOpen(false);
      setIsAudioListOpen(false);
    }
  };

  // 닉네임 설정
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickName(e.target.value);
  };

  const handleJoinClick = () => {
    router.push(
      `/meeting/${sessionId}?nickName=${nickName ? nickName : DATA.user_name}`,
    );
  };

  useHotkeys('enter', handleJoinClick, {
    enabled: isShortcut,
  });

  useHotkeys('left', () => router.back(), { enabled: isShortcut });

  return (
    <div
      onClick={handleBackgroundClick}
      className="relative flex w-full flex-col items-center px-6"
    >
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

        <div
          className="my-6 flex w-full flex-row justify-between"
          onClick={handleBackgroundClick}
        >
          <div className="flex gap-4" onClick={handleBackgroundClick}>
            <div className="relative" onClick={handleBackgroundClick}>
              <Control
                name={'camera'}
                OnClick={handleCameraClick}
                OnMoreClick={handleVideoListClick}
              >
                {isCameraOn ? <CameraOn /> : <CameraOff />}
              </Control>
              {isVideoListOpen && (
                <DeviceModal
                  page={'preview'}
                  list={videoDevices}
                  selectedDeviceId={selectedVideoDeviceId}
                  prevDeviceId={prevVideoDeviceId}
                  onSetPrevDeviceId={setPrevVideoDeviceId}
                  onSetSelectedDeviceId={setSelectedVideoDeviceId}
                  onSetIsNewStream={setIsNewStream}
                  onClose={() => setIsVideoListOpen(false)}
                />
              )}
            </div>

            <div className="relative" onClick={handleBackgroundClick}>
              <Control
                name={'mic'}
                OnClick={handleMicClick}
                OnMoreClick={handleAudioListClick}
              >
                {isMicOn ? <MicOn /> : <MicOff width={32} height={32} />}
              </Control>
              {isAudioListOpen && (
                <DeviceModal
                  page={'preview'}
                  list={audioDevices}
                  selectedDeviceId={selectedAudioDeviceId}
                  prevDeviceId={prevAudioDeviceId}
                  onSetPrevDeviceId={setPrevAudioDeviceId}
                  onSetSelectedDeviceId={setSelectedAudioDeviceId}
                  onSetIsNewStream={setIsNewStream}
                  onClose={() => setIsAudioListOpen(false)}
                />
              )}
            </div>
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default Preview;
