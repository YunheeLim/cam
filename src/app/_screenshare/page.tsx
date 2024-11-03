"use client";

import { useEffect, useState } from 'react';
import { OpenVidu, Publisher, Session, StreamManager } from 'openvidu-browser';
import axios from 'axios';
import UserVideoComponent from '../meeting/[id]/UserVideoComponent';

const APPLICATION_SERVER_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000/';

const Meeting: React.FC = () => {
    const [mySessionId, setMySessionId] = useState('SessionA');
    const [myUserName, setMyUserName] = useState('Participant' + Math.floor(Math.random() * 100));
    const [session, setSession] = useState<Session | undefined>(undefined);
    const [screenSession, setScreenSession] = useState<Session | undefined>(undefined);
    const [mainStreamManager, setMainStreamManager] = useState<Publisher | undefined>(undefined);
    const [publisher, setPublisher] = useState<Publisher | undefined>(undefined);
    const [subscribers, setSubscribers] = useState<StreamManager[]>([]);
    const [currentVideoDevice, setCurrentVideoDevice] = useState<MediaDeviceInfo | undefined>(undefined);
    const [screensharing, setScreensharing] = useState(false);
    let OV: OpenVidu | null = null;
    let OVScreen: OpenVidu | null = null;

    useEffect(() => {
        const handleBeforeUnload = () => leaveSession();
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [session, screenSession]);

    const handleChangeSessionId = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMySessionId(e.target.value);
    };

    const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMyUserName(e.target.value);
    };

    const handleMainVideoStream = (stream: StreamManager) => {
        if (mainStreamManager !== stream) {
            setMainStreamManager(stream as Publisher);
        }
    };

    const deleteSubscriber = (streamManager: StreamManager) => {
        setSubscribers((prevSubscribers) =>
            prevSubscribers.filter((subscriber) => subscriber !== streamManager)
        );
    };

    const joinSession = async () => {
        OV = new OpenVidu();
        OVScreen = new OpenVidu();

        const newSession = OV.initSession();
        const screenSession = OVScreen.initSession();

        newSession.on('streamCreated', (event) => {
            if (event.stream.typeOfVideo === "CAMERA") {
                const subscriber = newSession.subscribe(event.stream, 'container-cameras');
                setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
            }
        });

        screenSession.on('streamCreated', (event) => {
            if (event.stream.typeOfVideo === "SCREEN") {
                const existingSubscriber = subscribers.find(sub => sub.stream.streamId === event.stream.streamId);
                if (!existingSubscriber) {
                    const subscriberScreen = screenSession.subscribe(event.stream, 'container-screens');
                    setSubscribers((prevSubscribers) => [...prevSubscribers, subscriberScreen]);
                }
            }
        })

        newSession.on('streamDestroyed', (event) => {
            deleteSubscriber(event.stream.streamManager);
        });

        try {
            const token = await getToken();
            await newSession.connect(token, { clientData: myUserName });

            const newPublisher = await OV.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
            });

            newSession.publish(newPublisher);

            const devices = await OV.getDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            const currentVideoDeviceId = newPublisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
            const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

            setSession(newSession);
            setMainStreamManager(newPublisher);
            setPublisher(newPublisher);
            setCurrentVideoDevice(currentVideoDevice as MediaDeviceInfo | undefined);
        } catch (error) {
            console.log('Error connecting to the session:', error);
        }

        try {
            const tokenScreen = await getToken();
            await screenSession.connect(tokenScreen, { clientData: myUserName });


        } catch (error) {
            console.warn('There was an error connecting to the session for screen share:', error);

        }
    };

    const startScreenShare = async () => {
        try {
            const OVScreen = new OpenVidu();
            const screenSession = OVScreen.initSession();

            screenSession.on('streamCreated', (event) => {
                const existingSubscriber = subscribers.find(sub => sub.stream.streamId === event.stream.streamId);
                if (!existingSubscriber) {
                    const subscriber = screenSession.subscribe(event.stream, 'container-screens');
                    setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
                }
            });

            const token = await getToken();
            await screenSession.connect(token, { clientData: myUserName });

            const publisher = OVScreen.initPublisher(undefined, {
                videoSource: 'screen',
                publishAudio: false,
                publishVideo: true,
                mirror: false,
            });

            screenSession.publish(publisher);
            setScreenSession(screenSession);
        } catch (error) {
            console.log('Error starting screen share:', error);
        }
    };

    const leaveSession = () => {
        if (session) session.disconnect();
        if (screenSession) screenSession.disconnect();

        OV = null;
        OVScreen = null;

        setSession(undefined);
        setScreenSession(undefined);
        setSubscribers([]);
        setMySessionId('SessionA');
        setMyUserName('Participant' + Math.floor(Math.random() * 100));
        setMainStreamManager(undefined);
        setPublisher(undefined);
        setScreensharing(false);
    };

    const switchCamera = async () => {
        if (OV && currentVideoDevice) {
            try {
                const devices = await OV.getDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                const newVideoDevice = videoDevices.find(device => device.deviceId !== currentVideoDevice.deviceId) as MediaDeviceInfo | undefined;

                if (newVideoDevice && session && mainStreamManager) {
                    const newPublisher = OV.initPublisher(undefined, {
                        videoSource: newVideoDevice.deviceId,
                        publishAudio: true,
                        publishVideo: true,
                        mirror: true,
                    });

                    // Ensure mainStreamManager is a Publisher before unpublishing
                    if (mainStreamManager instanceof Publisher) {
                        await session.unpublish(mainStreamManager);
                    }
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
        const response = await axios.post(
            `${APPLICATION_SERVER_URL}api/sessions`,
            { customSessionId: sessionId },
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
    };

    const createToken = async (sessionId: string) => {
        const response = await axios.post(
            `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`,
            {},
            { headers: { 'Content-Type': 'application/json' } }
        );
        return response.data;
    };

    return (
        <div className="container">
            {!session ? (
                <div id="join">
                    <div id="img-div">
                        <img src="resources/images/openvidu_grey_bg_transp_cropped.png" alt="OpenVidu logo" />
                    </div>
                    <div id="join-dialog" className="jumbotron vertical-center">
                        <h1>Join a video session</h1>
                        <form className="form-group" onSubmit={(e) => { e.preventDefault(); joinSession(); }}>
                            <p>
                                <label>Participant:</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="userName"
                                    value={myUserName}
                                    onChange={handleChangeUserName}
                                    required
                                />
                            </p>
                            <p>
                                <label>Session:</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    id="sessionId"
                                    value={mySessionId}
                                    onChange={handleChangeSessionId}
                                    required
                                />
                            </p>
                            <p className="text-center">
                                <input className="btn btn-lg btn-success" name="commit" type="submit" value="JOIN" />
                            </p>
                        </form>
                    </div>
                </div>
            ) : (
                <div id="session">
                    <div id="session-header">
                        <h1 id="session-title">{mySessionId}</h1>
                        <input
                            className="btn btn-large btn-danger"
                            type="button"
                            id="buttonLeaveSession"
                            onClick={leaveSession}
                            value="Leave session"
                        />
                        <input
                            className="btn btn-large btn-success"
                            type="button"
                            id="buttonSwitchCamera"
                            onClick={switchCamera}
                            value="Switch Camera"
                        />
                        <input
                            className="btn btn-large btn-success"
                            type="button"
                            id="buttonScreenShare"
                            onClick={startScreenShare}
                            value={screensharing ? "Stop Screen Share" : "Start Screen Share"}
                        />
                    </div>

                    {mainStreamManager && (
                        <div id="main-video" className="col-md-6">
                            <UserVideoComponent streamManager={mainStreamManager} />
                        </div>
                    )}
                    <div id="video-container" className="col-md-6">
                        {publisher && (
                            <div
                                className="stream-container col-md-6 col-xs-6"
                                onClick={() => handleMainVideoStream(publisher)}
                            >
                                <UserVideoComponent streamManager={publisher} />
                            </div>
                        )}
                        {subscribers.map((sub, i) => (
                            <div
                                key={i}
                                className="stream-container col-md-6 col-xs-6"
                                onClick={() => handleMainVideoStream(sub)}
                            >
                                <span>{sub.id}</span>
                                <UserVideoComponent streamManager={sub} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Meeting;