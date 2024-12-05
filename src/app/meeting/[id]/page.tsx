'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useVideo } from '@/app/contexts/VideoContext';
import BottomBar from '@/containers/meeting/BottomBar';
import Control from '@/components/Control';
import Button from '@/components/Button';
import CameraOn from '../../../../public/svgs/camera_on.svg';
import CameraOff from '../../../../public/svgs/camera_off.svg';
import MicOn from '../../../../public/svgs/mic_on.svg';
import MicOff from '../../../../public/svgs/mic_off.svg';
import { RiSpeakLine } from 'react-icons/ri';
// import SpeakerOn from '../../../../public/svgs/speaker_on.svg';
// import SpeakerOff from '../../../../public/svgs/speaker_off.svg';
import ScreenShareIcon from '../../../../public/svgs/screenshare.svg';
import SettingIcon from '../../../../public/svgs/setting.svg';
import PeopleIcon from '../../../../public/svgs/people.svg';
import ExitIcon from '../../../../public/svgs/exit.svg';
import Video from '@/components/Video';
import { useCallback, useEffect, useRef, useState } from 'react';
import UserVideoComponent from '../../../containers/meeting/UserVideoComponent';
import OpenViduVideoComponent from '../../../containers/meeting/OvVideo';
import { OpenVidu, Session, Publisher, StreamManager } from 'openvidu-browser';
import axios from 'axios';
import { HiOutlineSpeakerWave as SpeakerOn } from 'react-icons/hi2';
import { HiOutlineSpeakerXMark as SpeakerOff } from 'react-icons/hi2';
import getText from '@/lib/getText';
import { getSpeechForOne, getSpeechForBoth } from '@/lib/getSpeech';
import { useHotkeys } from 'react-hotkeys-hook';
import DeviceModal from '@/components/DeviceModal';
import ExitModal from '@/containers/meeting/ExitModal';
import ParticipantsModal from '@/containers/meeting/ParticipantsModal';
import CopyMeetingId from '@/containers/meeting/CopyMeetingId';
import LoadingIndicator from '@/components/LoadingIndicator';

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

interface ExtendedStreamManager extends StreamManager {
  subscribeToAudio: (value: boolean) => void;
}

// OpenVidu global variables

// let sessionScreen: Session;

// const APPLICATION_SERVER_URL = 'http://localhost:5000/';

const Meeting = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isOcrOn, setIsOcrOn] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true); // 공유 화면 읽기 시 발화자 오디오 비활성화 유무
  const isSpeakerOnRef = useRef<boolean>(true); // 구독자 참조

  useEffect(() => {
    isSpeakerOnRef.current = isSpeakerOn;

    // 다시 소리 켜기
    if (isSpeakerOnRef.current && subscribersRef.current.length) {
      subscribersRef.current.forEach(subscriber => {
        console.log(subscriber);
        (subscriber as ExtendedStreamManager).subscribeToAudio(true);
        console.log('Unmuted audio for the speaker');
      });
    }
  }, [isSpeakerOn]);

  const [numParticipants, setNumParticipants] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    videoRef,
    stream,
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
  const [isVideoListOpen, setIsVideoListOpen] = useState(false);
  const [isAudioListOpen, setIsAudioListOpen] = useState(false);
  const [prevVideoDeviceId, setPrevVideoDeviceId] = useState<string>('');
  const [prevAudioDeviceId, setPrevAudioDeviceId] = useState<string>('');
  const [isNewStream, setIsNewStream] = useState(false); // 기기 변경으로 인한 새 스트림 생성 여부

  const [capturedImage, setCapturedImage] = useState<string | undefined>(''); // 캡쳐 이미지
  const canvasRef = useRef<HTMLCanvasElement>(null); // 프레임 변화 감지를 위한 canvas

  const prevFrameData = useRef<ImageData | null>(null); // 변화 이전 프레임

  const intervalIdRef = useRef<number | null>(null);
  const sharedScreenRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState(''); // ocr 텍스트
  const [isShortcut, setIsShortcut] = useState(false); // 키보드 단축키
  const [isReading, setIsReading] = useState(false); // ocr 텍스트 리딩 상태
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false); // 참여자 리스트 모달
  const [isSettingOpen, setIsSettingOpen] = useState(false); // 셋팅 모달

  // 단축키 설정 정보
  useEffect(() => {
    if (window.sessionStorage.getItem('shortcut') === 'true') {
      setIsShortcut(true);
    }
  }, [window.sessionStorage.getItem('shortcut')]);

  // 새로고침 시 메인 페이지로
  useEffect(() => {
    if (window.sessionStorage.getItem('firstLoadDone') === null) {
      console.log('첫 로드');
      window.sessionStorage.setItem('firstLoadDone', '1');
    } else {
      console.log('리로드');
      window.sessionStorage.removeItem('firstLoadDone');
      router.replace('/');
    }

    // 단축키 설정 정보
    if (window.localStorage.getItem('shortcut') === 'true') setIsShortcut(true);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      // Do something with the videoRef
      console.log('Video element:', videoRef.current);
      videoRef.current.srcObject = stream;
    }
    if (stream) {
      // Do something with the stream
      console.log('MediaStream:', stream);
    }
  }, [videoRef, stream]);

  // 카메라 mute/unmute
  const handleCameraClick = () => {
    if (publisher) {
      setIsCameraOn(prevState => !prevState);
      publisher.publishVideo(!isCameraOn);
    }
  };

  // 마이크 mute/unmute
  const handleMicClick = () => {
    if (publisher) {
      setIsMicOn(prevState => !prevState);
      publisher.publishAudio(!isMicOn);
    }
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

  // 참여자 클릭
  const handleParticipantsClick = () => {
    setIsParticipantsOpen(prev => !prev);
  };

  // 스피커 클릭
  const handleSpeakerClick = () => {
    setIsSpeakerOn(prev => !prev);
  };

  // 셋팅 클릭
  const handleSettingClick = () => {
    setIsSettingOpen(prev => !prev);
  };

  // 모달창 외부 클릭 시 모달 닫힘
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsVideoListOpen(false);
      setIsAudioListOpen(false);
      setIsParticipantsOpen(false);
    }
  };

  const [mySessionId, setMySessionId] = useState<string>('SessionA');
  const [myUserName, setMyUserName] = useState<string>('');
  const [isNickNameSet, setIsNickNameSet] = useState(false);
  const [session, setSession] = useState<Session>();
  const [mainStreamManager, setMainStreamManager] = useState<
    StreamManager | undefined
  >(undefined);
  const [publisher, setPublisher] = useState<Publisher>();
  const [subscribers, setSubscribers] = useState<StreamManager[]>([]);
  const subscribersRef = useRef<StreamManager[]>([]); // 구독자 참조
  const [screenSession, setScreenSession] = useState<Session>();
  const [screenPublisher, setScreenPublisher] = useState<Publisher>();

  const OV = useRef<OpenVidu>();
  const OVScreen = useRef<OpenVidu>();

  useEffect(() => {
    const onBeforeUnload = () => leaveSession();
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [session, screenSession]);

  const handleMainVideoStream = (stream: StreamManager) => {
    if (mainStreamManager !== stream) setMainStreamManager(stream);
  };

  const deleteSubscriber = (streamManager: StreamManager) => {
    setSubscribers(prevSubscribers =>
      prevSubscribers.filter(sub => sub !== streamManager),
    );
  };

  // 쿼리로 미팅ID 가져오기
  useEffect(() => {
    if (params?.id) {
      setMySessionId(`${params?.id}`);
    }
  }, [params]);

  // 쿼리로 닉네임 가져오기
  useEffect(() => {
    if (searchParams) {
      const nickName = searchParams.get('nickName');
      if (nickName) {
        setMyUserName(nickName);
        setIsNickNameSet(true);
      }
    }
  }, [searchParams]);

  useEffect(() => {}, []);

  useEffect(() => {
    if (isNickNameSet) {
      joinSession();
    }
  }, [isNickNameSet]);

  // 참여자 수 가져오기
  useEffect(() => {
    let num = 1;
    subscribers.map((sub: any) => {
      // 화면 공유 스트림은 개수에서 제외
      if (sub?.stream?.typeOfVideo === 'CAMERA') {
        num += 1;
      } else {
        // 화면 공유 스트림은 메인으로 설정
        setMainStreamManager(sub);
      }
    });
    setNumParticipants(num);

    subscribersRef.current = subscribers;
  }, [subscribers]);

  const joinSession = async () => {
    console.log('joinSession triggered');
    // e.preventDefault();
    OV.current = new OpenVidu();
    // OVScreen.current = new OpenVidu();

    const newSession = OV.current.initSession();
    // const screenSession = OV.current.initSession();

    newSession.on('streamCreated', event => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers(prevSubscribers => [...prevSubscribers, subscriber]);
    });

    newSession.on('streamDestroyed', event => {
      deleteSubscriber(event.stream.streamManager);
      if (event.stream.streamManager.stream.typeOfVideo === 'SCREEN') {
        setMainStreamManager(undefined);
      }
    });

    // 발화자 오디오 비활성화
    newSession.on('publisherStartSpeaking', event => {
      const speakingConnectionId = event.connection.connectionId;
      // console.log(speakingConnectionId);
      // console.log(subscribersRef.current); // 항상 최신 값
      // console.log('isSpeakerOn:', isSpeakerOnRef.current);

      if (!isSpeakerOnRef.current && subscribersRef.current.length) {
        subscribersRef.current.forEach(subscriber => {
          console.log(subscriber);
          if (
            subscriber.stream.connection.connectionId === speakingConnectionId
          ) {
            (subscriber as ExtendedStreamManager).subscribeToAudio(false);
            console.log('Muted audio for the speaker');
          }
        });
      }
    });

    newSession.on('exception', exception => console.warn(exception));

    try {
      const token = await getToken();
      await newSession.connect(token, { clientData: myUserName });

      const newPublisher = await OV.current?.initPublisherAsync(undefined, {
        audioSource: selectedAudioDeviceId || undefined,
        videoSource: selectedVideoDeviceId || undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
        mirror: false,
      });
      if (newPublisher) {
        newSession.publish(newPublisher);

        // 오디오 감도 설정
        newPublisher.updatePublisherSpeakingEventsOptions({
          interval: 20, // 20ms 간격으로 감지
          threshold: -80, // -80dB로 작은 소리도 감지
        });

        // 미리보기에서 비디오/오디오 mute/unmute 여부
        newPublisher.publishVideo(isCameraOn);
        newPublisher.publishAudio(isMicOn);

        setPublisher(newPublisher);
        // setMainStreamManager(newPublisher);
        setSession(newSession);
      }
    } catch (error) {
      console.log('Error connecting to the session:', error);
    }
  };

  // 카메라 교체
  const changeCamera = async (deviceId: string) => {
    try {
      if (!publisher) {
        console.warn('No publisher to replace track on');
        return;
      }

      // 새로운 비디오 트랙 생성
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
      });
      const newTrack = mediaStream.getVideoTracks()[0];

      // 기존 트랙 교체
      await publisher.replaceTrack(newTrack);
      console.log('Camera switched successfully!');

      // 상태 업데이트
      // setSelectedVideoDeviceId(deviceId); // 선택된 카메라 업데이트
      setPrevVideoDeviceId(deviceId);
    } catch (error) {
      console.error('Error switching camera:', error);
    }
    setIsNewStream(false);
  };

  // 오디오 교체
  const changeAudioDevice = async (deviceId: string) => {
    try {
      if (!publisher) {
        console.warn('No publisher to replace audio track on');
        return;
      }

      // 새로운 오디오 트랙 생성
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } },
      });
      const newTrack = mediaStream.getAudioTracks()[0];

      // 기존 오디오 트랙 교체
      await publisher.replaceTrack(newTrack);
      console.log('Audio device switched successfully!');

      // 상태 업데이트
      // setSelectedAudioDeviceId(deviceId); // 선택된 오디오 장치 ID 업데이트
      setPrevAudioDeviceId(deviceId);
    } catch (error) {
      console.error('Error switching audio device:', error);
    }
    setIsNewStream(false);
  };

  // 다른 기기가 선택되면 비디오 기기 변경
  useEffect(() => {
    if (isNewStream) {
      changeCamera(selectedVideoDeviceId);
      changeAudioDevice(selectedAudioDeviceId);
    }
  }, [isNewStream]);

  // 화면 공유 스트림 생성
  const publishScreenShare = async () => {
    OVScreen.current = new OpenVidu();
    const sessionScreen = OVScreen.current.initSession();

    getToken().then(token => {
      sessionScreen
        .connect(token)
        .then(() => {
          const publisher = OVScreen?.current?.initPublisher(
            'html-element-id',
            {
              videoSource: 'screen',
              publishAudio: false,
            },
          );

          publisher?.once('accessAllowed', event => {
            publisher?.stream
              .getMediaStream()
              .getVideoTracks()[0]
              .addEventListener('ended', () => {
                console.log('User pressed the "Stop sharing" button');
                sessionScreen.unpublish(publisher);
                setMainStreamManager(undefined);
              });
            sessionScreen.publish(publisher);
            setScreenSession(sessionScreen);
            setScreenPublisher(publisher);
          });

          publisher?.once('accessDenied', event => {
            console.warn('ScreenShare: Access Denied');
          });
        })
        .catch(error => {
          console.warn(
            'There was an error connecting to the session:',
            error.code,
            error.message,
          );
        });
    });
  };

  const leaveSession = () => {
    if (screenSession && screenPublisher) {
      screenSession.unpublish(screenPublisher);
    }

    session?.disconnect();
    screenSession?.disconnect();

    OV.current = undefined;
    OVScreen.current = undefined;

    setSession(undefined);
    setScreenSession(undefined);

    setSubscribers([]);
    setMySessionId('SessionA');
    setMyUserName('참여자' + Math.floor(Math.random() * 100));
    setMainStreamManager(undefined);

    setPublisher(undefined);
    setScreenPublisher(undefined);

    router.push('/');
  };

  const getToken = async () => {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  };

  const APPLICATION_SERVER_URL = '';
  // const APPLICATION_SERVER_URL = 'http://localhost:5000';

  const createSession = async (sessionId: string) => {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}/api/test`,
      { customSessionId: sessionId },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    console.log('세션아이디:', response.data.sessionId);
    return response.data.sessionId;
  };

  const createToken = async (sessionId: string) => {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}/api/test?sessionId=${sessionId}`,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    console.log('토큰:', response.data.token);
    return response.data.token;
  };

  // 공유 화면 읽기 (버튼 누를 때만 한시적으로)
  const handleCapture = async () => {
    if (mainStreamManager && isReading) {
      setIsReading(false);
      window.speechSynthesis.cancel();
      // 읽는 중일 때 멈추기
    } else {
      // 읽기 시작
      if (mainStreamManager) {
        setIsReading(true);
        const textData = await getText(mainStreamManager);
        if (typeof textData === 'string') {
          // getText(textData);
          getSpeechForOne(textData);
        }
        console.log('text in handlecapture', textData);
      }
    }
  };

  const stop = useRef(true); // 읽기 중단했을 때
  const changeDetected = useRef(false); // 프레임 변화 여부

  // 프레임 변화 시 자동 감지 되는 ocr
  const handleTest = async () => {
    if (!mainStreamManager) return;

    if (isOcrOn) {
      stop.current = true;

      setIsOcrOn(false);
      prevFrameData.current = null;
      window.speechSynthesis.cancel();
      changeDetected.current = false; // Use useRef for changeDetected
      setIsReading(false);
      // Cleanup requestAnimationFrame on component unmount
      if (intervalIdRef.current) {
        console.log('========cleanup 1=========');
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null; // Clear the interval ID
      }
    } else {
      stop.current = false;

      setIsOcrOn(true);
      detectChanges();
    }
  };

  // 공유 화면 읽기 (자동으로)
  const detectChanges = async () => {
    if (stop.current) return;

    setIsLoading(true);
    console.log('detect change called');

    if (!canvasRef.current || !mainStreamManager) return;

    if (isReading) {
      setIsReading(false);
      window.speechSynthesis.cancel();
      // 읽는 중일 때 멈추기
    } else {
      if (stop.current) {
        return;
      }
      setIsReading(true);

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      const track = mainStreamManager?.stream
        ?.getMediaStream()
        ?.getVideoTracks()[0];
      if (!track) return;

      let imageCapture = new ImageCapture(track);

      const checkFrame = async () => {
        if (stop.current) {
          return;
        }
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
            !stop.current &&
            (!prevFrameData.current ||
              hasFrameChanged(prevFrameData.current, currentFrameData))
          ) {
            if (!changeDetected.current) {
              window.speechSynthesis.cancel();

              console.log('Screen content changed');
              changeDetected.current = true;

              const textData = await getText(mainStreamManager);
              if (typeof textData === 'string') {
                getSpeechForOne(textData);
              }
              console.log('text in handlecapture', textData);
              setIsLoading(false);
            }
          } else {
            // Reset the flag if no change is detected
            changeDetected.current = false;
            setIsLoading(false);
          }

          prevFrameData.current = currentFrameData;
        } catch (error) {
          console.error('Error capturing frame:', error);
          setIsLoading(false);
        }
      };
      if (!stop.current) {
        intervalIdRef.current = window.setInterval(checkFrame, 1000); // 1-second interval
      }
    }
  };

  const hasFrameChanged = (prev: ImageData | null, current: ImageData) => {
    if (!prev) return false;
    const threshold = 50000; // Define a difference threshold
    let diffCount = 0;
    const length = prev.data.length;

    // Step size를 늘려서 모든 픽셀을 비교하지 않음
    for (let i = 0; i < length; i += 16) {
      // 매 4픽셀(4 * 4 = 16 바이트)마다 비교
      const rDiff = Math.abs(prev.data[i] - current.data[i]);
      const gDiff = Math.abs(prev.data[i + 1] - current.data[i + 1]);
      const bDiff = Math.abs(prev.data[i + 2] - current.data[i + 2]);

      if (rDiff + gDiff + bDiff > 50) {
        diffCount++;
        if (diffCount > threshold) return true; // 조기 종료
      }
    }

    return false;
  };

  // 프레임 감지 클린업
  useEffect(() => {
    return () => {
      prevFrameData.current = null;

      // Cleanup requestAnimationFrame on component unmount
      if (intervalIdRef.current) {
        console.log('========cleanup 2=========');
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null; // Clear the interval ID
      }
    };
  }, [mainStreamManager?.stream]);

  // tts 클린업
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text]);

  // 화면 캡쳐 및 ocr 단축키
  useHotkeys('ctrl+o', handleCapture, { enabled: isShortcut });

  // 회의 나가기 버튼 클릭
  const handleExitClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 회의 나가기
  useHotkeys('ctrl+q', handleExitClick, { enabled: isShortcut });

  // tts 언어 한 개 or 두 개 감지 테스트
  // useEffect(() => {
  //   getSpeechForBoth(
  //     '한국어 영어 혼합 × SLR클럽 http://www.slrclub com> 자유게시판 chatGPT 실제 필요한 곳에 사용해 봤습니다. 2023. 2. 14. - 이렇게 하면 GTTS가 문장의 한글 부분을 한국어로 발음하고, 영어 부분은 영어로 발음합니 다. 이와 같은 방식으로, 다른 언어도 혼합해서 사용할 수 GitHub https://joungheekim.github.io > 2021/04/01 ) code-review [코드리뷰]타코트론2 TTS 시스템 1/2 2021. 4. 1.- 따라서 직접 음성과 스크립트를 제작할 때 이를 반영하여 미리 영어, 숫자, 특수문자등을 한글 로 작성하는 것을 추천드립니다. 스크립트 예시. 1.3 녹음된 티스토리 https://music-audio-aitistory.com> [논문들소개] Neural Text-to-Speech(TTS) 2022. 8. 19. - Text-to-Speech(보통 TTS라고 줄여서 씀)는 텍스트를 오디오로 읽어주는 기술을 말함. 즉 입력으로 텍스트 혹은 캐릭터와 비스무리한게 들어오면 출력 Korea Science KS http://www.koreascience.kr article CFKO2018... PDF : 음성합성을 위한 텍스트 음역 시스템과 숫자 음역 모호성 처리 JY Park 저술 2018-TTS(Text-to-Speech)는 문자 텍스트가 입력되었을 때,. 이를 자동으로 음성 변환 하여 출력해주는 음성합성 기술. 을 말한다. TTS는 현재 기술의 완성도가 높아짐에 네이버 지식iN https://kin. .naver.com > qna > detail : balabolka (TTS프로그램) 한 : 네이버 지식iN 우리나라 말과 영어가 혼합된 것이라면 듣기가 조금 불편할 수도 있습니다. 영어면 원래 영어로 셋팅하고 한국',
  //   );
  // }, []);

  return (
    <>
      {isModalOpen && <ExitModal onOk={leaveSession} onClose={closeModal} />}
      {isLoading && <LoadingIndicator />}
      <div
        onClick={handleBackgroundClick}
        className="flex h-full w-full flex-col justify-center bg-black"
      >
        <div
          id="session"
          className={`flex h-video-container w-full ${
            mainStreamManager
              ? 'flex-row items-center gap-4'
              : 'flex-col overflow-auto'
          }
       justify-center px-6`}
        >
          {mainStreamManager && (
            <>
              <div id="main-video" ref={sharedScreenRef} className="w-4/6">
                <UserVideoComponent streamManager={mainStreamManager} />
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </>
          )}
          <div
            id="video-container"
            // className="flex h-full w-full items-center justify-center"
            className={`${
              mainStreamManager
                ? 'flex max-h-video-container flex-col overflow-auto'
                : subscribers.length === 0
                ? 'grid h-video-container grid-cols-1 items-center justify-center px-1/10'
                : subscribers.length === 1
                ? 'grid h-video-container grid-cols-2 items-center justify-center'
                : subscribers.length <= 3
                ? 'grid h-video-container grid-cols-2 items-center justify-center px-1/10'
                : 'grid h-video-container grid-cols-3 items-center justify-center'
            } gap-4`}
          >
            {publisher && (
              <div
                id="stream-container"
                className={`${mainStreamManager ? ' w-60' : ''}`}
                onClick={() => {
                  // handleMainVideoStream(publisher)
                }}
              >
                <UserVideoComponent streamManager={publisher} />
              </div>
            )}
            {subscribers.map((sub, i) => {
              // 공유된 화면은 제외 (메인 스트림에 있음)
              return (
                sub.stream.typeOfVideo !== 'SCREEN' && (
                  <div
                    key={i}
                    id="stream-container"
                    className={`${mainStreamManager ? ' w-60' : ''}`}
                    onClick={() => {
                      // handleMainVideoStream(sub)
                    }}
                  >
                    <UserVideoComponent streamManager={sub} />
                  </div>
                )
              );
            })}
          </div>
        </div>
        {/* 픽셀 변화 감지 확인용 */}
        {capturedImage && intervalIdRef.current && (
          <div className="mt-4 h-80 w-80">
            <img src={capturedImage} alt="Captured preview" className="mt-2" />
          </div>
        )}
        {/* Bottom bar */}
        <div
          className="relative flex h-24 w-full flex-row justify-between p-6"
          onClick={handleBackgroundClick}
        >
          <div className="flex gap-4" onClick={handleBackgroundClick}>
            <div className="relative" onClick={handleBackgroundClick}>
              <Control
                name="camera"
                OnClick={handleCameraClick} // mute or unmute
                OnMoreClick={handleVideoListClick} // 카메라 기기 선택
              >
                {isCameraOn ? <CameraOn /> : <CameraOff />}
              </Control>
              {isVideoListOpen && (
                <DeviceModal
                  page={'meeting'}
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
                name="mic"
                OnClick={handleMicClick}
                OnMoreClick={handleAudioListClick} // 카메라 기기 선택
              >
                {isMicOn ? <MicOn /> : <MicOff width={32} height={32} />}
              </Control>
              {isAudioListOpen && (
                <DeviceModal
                  page={'meeting'}
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
            <Button
              name="speaker"
              onClick={handleSpeakerClick}
              className="px-3"
            >
              {isSpeakerOn ? (
                <SpeakerOn size={32} color="white" />
              ) : (
                <SpeakerOff size={32} color="white" />
              )}
            </Button>
            <Button
              onClick={handleTest}
              disabled={!mainStreamManager} // 버튼 비활성화
              className={`gap-2 px-4 ${
                mainStreamManager ? '' : '!text-gray-400 hover:!bg-primary'
              }`}
            >
              <RiSpeakLine size={32} />
              {isOcrOn ? '공유 화면 읽기 중단' : '공유 화면 읽기'}
            </Button>
          </div>
          <div className="absolute left-1/2 flex -translate-x-1/2 transform flex-row gap-4">
            <Button onClick={publishScreenShare} className="p-2">
              <ScreenShareIcon />
            </Button>
            <Button
              onClick={handleExitClick}
              className="bg-secondary p-2 hover:bg-secondary-hover"
            >
              <ExitIcon />
            </Button>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Button
                onClick={handleParticipantsClick}
                className="flex gap-2 p-2 font-semibold"
              >
                <PeopleIcon />
                {numParticipants}
              </Button>
              {publisher && isParticipantsOpen && (
                <ParticipantsModal
                  publisher={publisher}
                  subscribers={subscribers}
                />
              )}
            </div>
            <div className="relative">
              <Button onClick={handleSettingClick} className="p-2">
                <SettingIcon fill={'#ffffff'} />
              </Button>
            </div>
            {isSettingOpen && (
              <CopyMeetingId
                onClose={() => setIsSettingOpen(false)}
                meetingId={mySessionId}
              />
            )}
          </div>
        </div>
        {/* <BottomBar /> */}
      </div>
    </>
  );
};

export default Meeting;
