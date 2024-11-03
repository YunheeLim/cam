"use client"

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useVideo } from "@/app/contexts/VideoContext";
import BottomBar from "@/containers/meeting/BottomBar";
import Control from "@/components/Control";
import Button from "@/components/Button";
import CameraOn from "../../../../public/svgs/camera_on.svg";
import CameraOff from "../../../../public/svgs/camera_off.svg";
import MicOn from "../../../../public/svgs/mic_on.svg";
import MicOff from "../../../../public/svgs/mic_off.svg";
import SpeakerOn from "../../../../public/svgs/speaker_on.svg";
import SpeakerOff from "../../../../public/svgs/speaker_off.svg";
import ScreenShareIcon from "../../../../public/svgs/screenshare.svg";
import SettingIcon from "../../../../public/svgs/setting.svg";
import PeopleIcon from "../../../../public/svgs/people.svg";
import ExitIcon from "../../../../public/svgs/exit.svg";
import Video from "@/components/Video";
import { useCallback, useEffect, useRef, useState } from "react";
import UserVideoComponent from "./UserVideoComponent";
import OpenViduVideoComponent from "./OvVideo";

import { OpenVidu, Session, Publisher, StreamManager } from 'openvidu-browser';
import axios from 'axios';

// OpenVidu global variables
let OVCamera: any;
let OVScreen: any;
let sessionCamera: Session;
let sessionScreen: Session;

// User name and session name global variables
let myUserName: string;
let mySessionId: string;
let screensharing = false;

const APPLICATION_SERVER_URL = "http://localhost:5000/";

const DATA = {
    user_name: "홍길동"
}

const Meeting = () => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const [isOcrOn, setIsOcrOn] = useState(false); // TODO: API로 호출
    const [peopleCnt, setPeopleCnt] = useState(2);

    const { videoRef, stream, isCameraOn, setIsCameraOn, isMicOn, setIsMicOn } = useVideo();

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

    const handleCameraClick = () => {
        if (publisher) {
            setIsCameraOn((prevState) => !prevState);
            publisher.publishVideo(!isCameraOn);
        }
    };

    const handleMicClick = () => {
        if (publisher) {
            setIsMicOn((prevState) => !prevState);
            publisher.publishAudio(!isMicOn);
        }
    };

    const handleOcrClick = () => {
        setIsOcrOn((prevState) => !prevState);
    };

    const [mySessionId, setMySessionId] = useState<string>('SessionA');
    const [myUserName, setMyUserName] = useState<string>('참여자' + Math.floor(Math.random() * 100));

    const [isNickNameSet, setIsNickNameSet] = useState(false);

    const [session, setSession] = useState<Session>();
    const [mainStreamManager, setMainStreamManager] = useState<StreamManager>();
    const [publisher, setPublisher] = useState<Publisher>();
    const [subscribers, setSubscribers] = useState<StreamManager[]>([]);
    const [screenSession, setScreenSession] = useState<Session>();
    const [screenPublisher, setScreenPublisher] = useState<Publisher>();
    const [screenSharing, setScreenSharing] = useState(false);
    const [currentVideoDevice, setCurrentVideoDevice] = useState<MediaDeviceInfo>();

    const OV = useRef<OpenVidu>();
    const OVScreen = useRef<OpenVidu>();


    useEffect(() => {
        const onBeforeUnload = () => leaveSession();
        window.addEventListener('beforeunload', onBeforeUnload);

        return () => window.removeEventListener('beforeunload', onBeforeUnload);
    }, [session]);

    const handleMainVideoStream = (stream: StreamManager) => {
        if (mainStreamManager !== stream) setMainStreamManager(stream);
    };

    const deleteSubscriber = (streamManager: StreamManager) => {
        setSubscribers((prevSubscribers) =>
            prevSubscribers.filter((sub) => sub !== streamManager)
        );
    };

    useEffect(() => {
        if (params.id) {
            console.log(params.id)
        }
    }, [params])

    useEffect(() => {
        if (searchParams) {
            const nickName = searchParams.get('nickName');
            if (nickName) {
                setMyUserName(nickName);
                setIsNickNameSet(true);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (isNickNameSet) {
            joinSession();
        }
    }, [isNickNameSet]);

    const joinSession = async () => {
        console.log('joinSession triggered')
        // e.preventDefault();
        OV.current = new OpenVidu();
        // OVScreen.current = new OpenVidu();

        const newSession = OV.current.initSession();
        // const screenSession = OV.current.initSession();

        newSession.on('streamCreated', (event) => {
            const subscriber = newSession.subscribe(event.stream, undefined);
            setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
        });

        // screenSession.on('streamCreated', (event) => {
        //     const subscriber = screenSession.subscribe(event.stream, undefined);
        //     setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
        // });

        newSession.on('streamDestroyed', (event) => {
            deleteSubscriber(event.stream.streamManager);
        });

        newSession.on('exception', (exception) => console.warn(exception));

        try {
            const token = await getToken();
            await newSession.connect(token, { clientData: myUserName });
            const newPublisher = await OV.current?.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
            });
            if (newPublisher) {
                newSession.publish(newPublisher);
                const devices = await OV.current?.getDevices();
                const videoDevices = devices?.filter((device) => device.kind === 'videoinput');
                const currentVideoDeviceId = newPublisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
                const currentDevice = videoDevices?.find((device) => device.deviceId === currentVideoDeviceId);

                setPublisher(newPublisher);
                setMainStreamManager(newPublisher);
                setCurrentVideoDevice(currentDevice);
                setSession(newSession);
            }
        } catch (error) {
            console.log('Error connecting to the session:', error);
        }

        // try {
        //     const tokenScreen = await getToken();
        //     await screenSession.connect(tokenScreen, { clientData: myUserName });
        //     console.log("Session screen connected");

        // } catch (error) {
        //     console.log('Error connecting to the session:', error);
        // }
    };

    const publishScreenShare = async () => {
        // var OVScreen = new OpenVidu();
        OVScreen.current = new OpenVidu();

        // var sessionScreen = OVScreen.initSession();
        const sessionScreen = OVScreen.current.initSession();


        getToken().then((token) => {
            sessionScreen.connect(token).then(() => {
                var publisher = OVScreen?.current?.initPublisher("html-element-id", { videoSource: "screen" });

                publisher?.once('accessAllowed', (event) => {
                    publisher?.stream.getMediaStream().getVideoTracks()[0].addEventListener('ended', () => {
                        console.log('User pressed the "Stop sharing" button');
                        sessionScreen.unpublish(publisher);
                    });
                    sessionScreen.publish(publisher);
                    setScreenSession(sessionScreen);
                    setScreenPublisher(publisher);
                });

                publisher?.once('accessDenied', (event) => {
                    console.warn('ScreenShare: Access Denied');
                });

            }).catch((error => {
                console.warn('There was an error connecting to the session:', error.code, error.message);

            }));
        });
    };

    const leaveSession = () => {
        if (screenSession && screenPublisher) {
            screenSession.unpublish(screenPublisher);
        }

        session?.disconnect();
        sessionScreen?.disconnect();

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

        router.push('/')
    };

    const switchCamera = async () => {
        if (OV.current && currentVideoDevice) {
            try {
                const devices = await OV.current.getDevices();
                const videoDevices = devices.filter((device) => device.kind === 'videoinput');
                const newVideoDevice = videoDevices.find((device) => device.deviceId !== currentVideoDevice.deviceId);

                if (newVideoDevice && session && publisher) {
                    const newPublisher = OV.current.initPublisher(undefined, {
                        videoSource: newVideoDevice.deviceId,
                        publishAudio: true,
                        publishVideo: true,
                        mirror: true,
                    });
                    await session.unpublish(publisher);
                    await session.publish(newPublisher);
                    setCurrentVideoDevice(newVideoDevice);
                    setMainStreamManager(newPublisher);
                    setPublisher(newPublisher);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    const getToken = async () => {
        const sessionId = await createSession(mySessionId);
        return await createToken(sessionId);
    };

    const createSession = async (sessionId: string) => {
        const response = await axios.post(`${APPLICATION_SERVER_URL}api/sessions`, { customSessionId: sessionId }, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    };

    const createToken = async (sessionId: string) => {
        const response = await axios.post(`${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`, {}, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    };

    return <div className="flex flex-col w-full h-full bg-black">
        {/* <div className="h-full flex px-6">
            <Video height={'h-650'} videoRef={videoRef} userName={DATA.user_name} nickName={searchParams.get('nickName') as string} isCameraOn={isCameraOn} isMicOn={isMicOn} />
        </div> */}

        <div id="session" className="flex flex-col h-full max-h-650 px-6 overflow-auto">
            {/* {mainStreamManager && (
                <div id="main-video" className="col-md-6">
                    <UserVideoComponent streamManager={mainStreamManager} />
                </div>
            )} */}
            <div
                id="video-container"
                className={`grid w-full max-h-650 ${subscribers.length === 0
                    ? 'grid-cols-1'
                    : subscribers.length === 1
                        ? 'grid-cols-2 justify-center'
                        : 'grid-cols-3'
                    } gap-4`}
            >
                {publisher && (
                    <div className={`stream-container`} onClick={() => handleMainVideoStream(publisher)}>
                        <UserVideoComponent streamManager={publisher} />
                    </div>
                )}
                {subscribers.map((sub, i) => (
                    <div key={i} className="stream-container" onClick={() => handleMainVideoStream(sub)}>
                        <UserVideoComponent streamManager={sub} />
                    </div>
                ))}
            </div>
        </div>


        <div className="relative w-full flex flex-row p-6 justify-between">
            <div className="flex gap-4">
                <Control name='camera' OnClick={handleCameraClick}>{isCameraOn ? <CameraOn /> : <CameraOff />}</Control>
                <Control name='mic' OnClick={handleMicClick}>{isMicOn ? <MicOn /> : <MicOff width={32} height={32} />}</Control>
                <Control name='speaker' OnClick={handleOcrClick}>{isOcrOn ? <SpeakerOn /> : <SpeakerOff />}</Control>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-row gap-4">
                <Button onClick={publishScreenShare} className="p-2"><ScreenShareIcon /></Button>
                <Button onClick={leaveSession} className="p-2 bg-secondary"><ExitIcon /></Button>
            </div>
            <div className="flex gap-4">
                <Button className="flex gap-2 p-2 font-semibold"><PeopleIcon />{peopleCnt}</Button>
                <Button className="p-2"><SettingIcon fill={'#ffffff'} /></Button>
            </div>
        </div>
        {/* <BottomBar /> */}
    </div>
}

export default Meeting;