'use client'

import React, { useEffect, useState } from 'react';
import { OpenVidu, Session, Publisher } from 'openvidu-browser';
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

const App: React.FC = () => {
    const [sessionId, setSessionId] = useState<string>('SessionScreenA');
    const [userName, setUserName] = useState<string>(`Participant${Math.floor(Math.random() * 100)}`);
    const [subscribers, setSubscribers] = useState<any[]>([]);

    useEffect(() => {
        generateParticipantInfo();
    }, []);

    const joinSession = async () => {
        mySessionId = sessionId;
        myUserName = userName;

        // --- 1) Create two OpenVidu objects.
        OVCamera = new OpenVidu();
        OVScreen = new OpenVidu();

        // --- 2) Init two OpenVidu Session Objects ---
        sessionCamera = OVCamera.initSession();
        sessionScreen = OVScreen.initSession();

        // --- 3) Specify the actions when events of type 'streamCreated' take place in the session. ---
        sessionCamera.on('streamCreated', (event: any) => {
            if (event.stream.typeOfVideo === "CAMERA") {
                const subscriber = sessionCamera.subscribe(event.stream, 'container-cameras');
                subscriber.on('videoElementCreated', (event: any) => {
                    appendUserData(event.element, subscriber.stream.connection);
                });
            }
        });

        sessionScreen.on('streamCreated', (event: any) => {
            if (event.stream.typeOfVideo === "SCREEN") {
                const existingSubscriber = subscribers.find(sub => sub.stream.streamId === event.stream.streamId);
                if (!existingSubscriber) {
                    const subscriberScreen = sessionScreen.subscribe(event.stream, 'container-screens');
                    subscriberScreen.on('videoElementCreated', (event: any) => {
                        appendUserData(event.element, subscriberScreen.stream.connection);
                    });
                    setSubscribers((prevSubscribers) => [...prevSubscribers, subscriberScreen]);
                }
            }
        });

        sessionCamera.on('streamDestroyed', (event: any) => {
            removeUserData(event.stream.connection);
        });

        sessionCamera.on('exception', (exception: any) => {
            console.warn(exception);
        });

        // --- 4) Connect to the session with two different tokens: one for the camera and other for the screen ---
        try {
            const token = await getToken(mySessionId);
            await sessionCamera.connect(token, { clientData: myUserName });

            document.getElementById('session-title')!.innerText = mySessionId;
            document.getElementById('join')!.style.display = 'none';
            document.getElementById('session')!.style.display = 'block';

            const publisher = OVCamera.initPublisher('container-cameras', {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false
            });

            publisher.on('videoElementCreated', (event: any) => {
                initMainVideo(event.element, myUserName);
                appendUserData(event.element, myUserName);
                event.element['muted'] = true;
            });

            sessionCamera.publish(publisher);
        } catch (error) {
            console.log('There was an error connecting to the session:', error);
        }

        try {
            const tokenScreen = await getToken(mySessionId);
            await sessionScreen.connect(tokenScreen, { clientData: myUserName });
            document.getElementById('buttonScreenShare')!.classList.remove('hidden');
            console.log("Session screen connected");
        } catch (error) {
            console.warn('There was an error connecting to the session for screen share:', error);
        }
    };

    const publishScreenShare = () => {
        const publisherScreen = OVScreen.initPublisher("container-screens", { videoSource: "screen" });

        publisherScreen.once('accessAllowed', () => {
            document.getElementById('buttonScreenShare')!.classList.add('hidden');
            screensharing = true;
            publisherScreen.stream.getMediaStream().getVideoTracks()[0].addEventListener('ended', () => {
                console.log('User pressed the "Stop sharing" button');
                sessionScreen.unpublish(publisherScreen);
                document.getElementById('buttonScreenShare')!.classList.remove('hidden');
                screensharing = false;
            });
            sessionScreen.publish(publisherScreen);
        });

        publisherScreen.on('videoElementCreated', (event: any) => {
            appendUserData(event.element, sessionScreen.connection);
            event.element['muted'] = true;
        });

        publisherScreen.once('accessDenied', () => {
            console.error('Screen Share: Access Denied');
        });
    };

    const leaveSession = () => {
        sessionScreen.disconnect();
        sessionCamera.disconnect();
        removeAllUserData();
        document.getElementById('join')!.style.display = 'block';
        document.getElementById('session')!.style.display = 'none';
        screensharing = false;
    };

    const generateParticipantInfo = () => {
        setSessionId('SessionScreenA');
        setUserName(`Participant${Math.floor(Math.random() * 100)}`);
    };

    const appendUserData = (videoElement: HTMLElement, connection: any) => {
        let userData: string;
        let nodeId: string;
        if (typeof connection === "string") {
            userData = connection;
            nodeId = connection;
        } else {
            userData = JSON.parse(connection.data).clientData;
            nodeId = connection.connectionId;
        }
        const dataNode = document.createElement('div');
        dataNode.className = "data-node";
        dataNode.id = "data-" + nodeId;
        dataNode.innerHTML = "<p>" + userData + "</p>";
        videoElement.parentNode!.insertBefore(dataNode, videoElement.nextSibling);
        addClickListener(videoElement, userData);
    };

    const removeUserData = (connection: any) => {
        const dataNodeToRemove = document.getElementById("data-" + connection.connectionId);
        if (dataNodeToRemove) {
            dataNodeToRemove.parentNode!.removeChild(dataNodeToRemove);
        }
    };

    const removeAllUserData = () => {
        const nicknameElements = document.getElementsByClassName('data-node');
        while (nicknameElements[0]) {
            nicknameElements[0].parentNode!.removeChild(nicknameElements[0]);
        }
    };

    const addClickListener = (videoElement: HTMLElement, userData: string) => {
        videoElement.addEventListener('click', () => {
            const mainVideo = document.querySelector('#main-video video') as HTMLVideoElement;
            if (mainVideo.srcObject !== videoElement.srcObject) {
                document.getElementById('main-video')!.classList.add('hidden');
                document.getElementById('main-video')!.querySelector('p')!.innerHTML = userData;
                mainVideo.srcObject = videoElement.srcObject;
                document.getElementById('main-video')!.classList.remove('hidden');
            }
        });
    };

    const initMainVideo = (videoElement: HTMLVideoElement, userData: string) => {
        const mainVideo = document.querySelector('#main-video video') as HTMLVideoElement;
        mainVideo.srcObject = videoElement.srcObject;
        document.querySelector('#main-video p')!.innerHTML = userData;
        mainVideo['muted'] = true;
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
        <div className="p-4">
            <div id="join" className="space-y-4">
                <input
                    id="sessionId"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="Session ID"
                />
                <input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="User Name"
                />
                <button onClick={joinSession} className="bg-blue-500 text-white p-2 rounded w-full">
                    Join Session
                </button>
            </div>
            <div id="session" className="hidden space-y-4">
                <h1 id="session-title" className="text-xl font-bold"></h1>
                <div id="container-cameras" className="grid grid-cols-2 gap-4"></div>
                <div id="container-screens" className="grid grid-cols-2 gap-4"></div>
                <button
                    id="buttonScreenShare"
                    onClick={publishScreenShare}
                    className="bg-green-500 text-white p-2 rounded w-full hidden"
                >
                    Share Screen
                </button>
                <button onClick={leaveSession} className="bg-red-500 text-white p-2 rounded w-full">
                    Leave Session
                </button>
            </div>
            <div id="main-video" className="hidden">
                <video className="w-full"></video>
                <p className="text-center mt-2"></p>
            </div>
        </div>
    );
};

export default App;