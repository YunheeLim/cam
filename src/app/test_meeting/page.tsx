'use client';

import React, { useState, useEffect, useRef } from 'react';
import { OpenVidu, Publisher, Session, StreamManager } from 'openvidu-browser';
import axios from 'axios';
import UserVideoComponent from '../meeting/[id]/UserVideoComponent';

const APPLICATION_SERVER_URL =
  process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000/';

const App: React.FC = () => {
  const [mySessionId, setMySessionId] = useState<string>('SessionA');
  const [myUserName, setMyUserName] = useState<string>(
    'Participant' + Math.floor(Math.random() * 100),
  );
  const [session, setSession] = useState<Session>();
  const [mainStreamManager, setMainStreamManager] = useState<StreamManager>();
  const [publisher, setPublisher] = useState<Publisher>();
  const [subscribers, setSubscribers] = useState<StreamManager[]>([]);
  const [currentVideoDevice, setCurrentVideoDevice] =
    useState<MediaDeviceInfo>();

  const OV = useRef<OpenVidu>();

  useEffect(() => {
    const onBeforeUnload = () => leaveSession();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [session]);

  const handleChangeSessionId = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMySessionId(e.target.value);
  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMyUserName(e.target.value);

  const handleMainVideoStream = (stream: StreamManager) => {
    if (mainStreamManager !== stream) setMainStreamManager(stream);
  };

  const deleteSubscriber = (streamManager: StreamManager) => {
    setSubscribers(prevSubscribers =>
      prevSubscribers.filter(sub => sub !== streamManager),
    );
  };

  const joinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    OV.current = new OpenVidu();
    const newSession = OV.current.initSession();

    newSession.on('streamCreated', event => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers(prevSubscribers => [...prevSubscribers, subscriber]);
    });

    newSession.on('streamDestroyed', event => {
      deleteSubscriber(event.stream.streamManager);
    });

    newSession.on('exception', exception => console.warn(exception));

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
        const videoDevices = devices?.filter(
          device => device.kind === 'videoinput',
        );
        const currentVideoDeviceId = newPublisher.stream
          .getMediaStream()
          .getVideoTracks()[0]
          .getSettings().deviceId;
        const currentDevice = videoDevices?.find(
          device => device.deviceId === currentVideoDeviceId,
        );

        setPublisher(newPublisher);
        setMainStreamManager(newPublisher);
        setCurrentVideoDevice(currentDevice);
        setSession(newSession);
      }
    } catch (error) {
      console.log('Error connecting to the session:', error);
    }
  };

  const leaveSession = () => {
    session?.disconnect();
    OV.current = undefined;
    setSession(undefined);
    setSubscribers([]);
    setMySessionId('SessionA');
    setMyUserName('Participant' + Math.floor(Math.random() * 100));
    setMainStreamManager(undefined);
    setPublisher(undefined);
  };

  const switchCamera = async () => {
    if (OV.current && currentVideoDevice) {
      try {
        const devices = await OV.current.getDevices();
        const videoDevices = devices.filter(
          device => device.kind === 'videoinput',
        );
        const newVideoDevice = videoDevices.find(
          device => device.deviceId !== currentVideoDevice.deviceId,
        );

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
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}api/sessions`,
      { customSessionId: sessionId },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data;
  };

  const createToken = async (sessionId: string) => {
    const response = await axios.post(
      `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return response.data;
  };

  return (
    <div className="container">
      {session === undefined ? (
        <div id="join">
          <div id="img-div">
            <img
              src="resources/images/openvidu_grey_bg_transp_cropped.png"
              alt="OpenVidu logo"
            />
          </div>
          <div id="join-dialog" className="jumbotron vertical-center">
            <h1>Join a video session</h1>
            <form className="form-group" onSubmit={joinSession}>
              <p>
                <label>Participant: </label>
                <input
                  className="form-control"
                  type="text"
                  value={myUserName}
                  onChange={handleChangeUserName}
                  required
                />
              </p>
              <p>
                <label>Session: </label>
                <input
                  className="form-control"
                  type="text"
                  value={mySessionId}
                  onChange={handleChangeSessionId}
                  required
                />
              </p>
              <p className="text-center">
                <input
                  className="btn btn-lg btn-success"
                  type="submit"
                  value="JOIN"
                />
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
              onClick={leaveSession}
              value="Leave session"
            />
            <input
              className="btn btn-large btn-success"
              type="button"
              onClick={switchCamera}
              value="Switch Camera"
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
                <UserVideoComponent streamManager={sub} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

// 'use client'

// import React, { useEffect, useState } from 'react';
// import { OpenVidu, Session, Publisher, StreamManager } from 'openvidu-browser';
// import axios from 'axios';

// // OpenVidu global variables
// let OVCamera: any;
// let OVScreen: any;
// let sessionCamera: Session;
// let sessionScreen: Session;

// // User name and session name global variables
// let myUserName: string;
// let mySessionId: string;
// let screensharing = false;

// const APPLICATION_SERVER_URL = "http://localhost:5000/";

// const App: React.FC = () => {
//     const [sessionId, setSessionId] = useState<string>('SessionScreenA');
//     const [userName, setUserName] = useState<string>(`Participant${Math.floor(Math.random() * 100)}`);
//     // const [sessionCamera, setSessionCamera] = useState<Session | undefined>(undefined);
//     // const [sessionScreen, setSessionScreen] = useState<Session | undefined>(undefined);
//     const [mainStreamManager, setMainStreamManager] = useState<Publisher | undefined>(undefined)
//     const [subscribers, setSubscribers] = useState<any[]>([]);

//     useEffect(() => {
//         generateParticipantInfo();
//     }, []);

//     const joinSession = async () => {
//         mySessionId = sessionId;
//         myUserName = userName;

//         // --- 1) Create two OpenVidu objects.
//         OVCamera = new OpenVidu();
//         OVScreen = new OpenVidu();

//         // --- 2) Init two OpenVidu Session Objects ---
//         sessionCamera = OVCamera.initSession();
//         sessionScreen = OVScreen.initSession();

//         // --- 3) Specify the actions when events of type 'streamCreated' take place in the session. ---
//         sessionCamera.on('streamCreated', (event: any) => {
//             if (event.stream.typeOfVideo === "CAMERA") {
//                 const subscriber = sessionCamera.subscribe(event.stream, 'container-cameras');
//                 subscriber.on('videoElementCreated', (event: any) => {
//                     appendUserData(event.element, subscriber.stream.connection);
//                 });
//             }
//         });

//         sessionScreen.on('streamCreated', (event: any) => {
//             if (event.stream.typeOfVideo === "SCREEN") {
//                 const existingSubscriber = subscribers.find(sub => sub.stream.streamId === event.stream.streamId);
//                 if (!existingSubscriber) {
//                     const subscriberScreen = sessionScreen.subscribe(event.stream, 'container-screens');
//                     subscriberScreen.on('videoElementCreated', (event: any) => {
//                         appendUserData(event.element, subscriberScreen.stream.connection);
//                     });
//                     setSubscribers((prevSubscribers) => [...prevSubscribers, subscriberScreen]);
//                 }
//             }
//         });

//         sessionCamera.on('streamDestroyed', (event: any) => {
//             removeUserData(event.stream.connection);
//         });

//         sessionCamera.on('exception', (exception: any) => {
//             console.warn(exception);
//         });

//         // --- 4) Connect to the session with two different tokens: one for the camera and other for the screen ---
//         try {
//             const token = await getToken();
//             await sessionCamera.connect(token, { clientData: myUserName });

//             document.getElementById('session-title')!.innerText = mySessionId;
//             document.getElementById('join')!.style.display = 'none';
//             document.getElementById('session')!.style.display = 'block';

//             const publisher = OVCamera.initPublisher('container-cameras', {
//                 audioSource: undefined,
//                 videoSource: undefined,
//                 publishAudio: true,
//                 publishVideo: true,
//                 resolution: '640x480',
//                 frameRate: 30,
//                 insertMode: 'APPEND',
//                 mirror: false
//             });

//             publisher.on('videoElementCreated', (event: any) => {
//                 initMainVideo(event.element, myUserName);
//                 appendUserData(event.element, myUserName);
//                 event.element['muted'] = true;
//             });
//             sessionCamera.publish(publisher);

//         } catch (error) {
//             console.log('There was an error connecting to the session:', error);
//         }

//         try {
//             const tokenScreen = await getToken();
//             await sessionScreen.connect(tokenScreen, { clientData: myUserName });
//             document.getElementById('buttonScreenShare')!.classList.remove('hidden');
//             console.log("Session screen connected");
//         } catch (error) {
//             console.warn('There was an error connecting to the session for screen share:', error);
//         }
//     };

//     const publishScreenShare = () => {
//         const publisherScreen = OVScreen.initPublisher("container-screens", { videoSource: "screen" });

//         publisherScreen.once('accessAllowed', () => {
//             document.getElementById('buttonScreenShare')!.classList.add('hidden');
//             screensharing = true;
//             publisherScreen.stream.getMediaStream().getVideoTracks()[0].addEventListener('ended', () => {
//                 console.log('User pressed the "Stop sharing" button');
//                 sessionScreen.unpublish(publisherScreen);
//                 document.getElementById('buttonScreenShare')!.classList.remove('hidden');
//                 screensharing = false;
//             });
//             sessionScreen.publish(publisherScreen);
//         });

//         publisherScreen.on('videoElementCreated', (event: any) => {
//             appendUserData(event.element, sessionScreen.connection);
//             event.element['muted'] = true;
//         });

//         publisherScreen.once('accessDenied', () => {
//             console.error('Screen Share: Access Denied');
//         });
//     };

//     const leaveSession = () => {
//         sessionScreen.disconnect();
//         sessionCamera.disconnect();
//         removeAllUserData();
//         document.getElementById('join')!.style.display = 'block';
//         document.getElementById('session')!.style.display = 'none';
//         screensharing = false;
//     };

//     const generateParticipantInfo = () => {
//         setSessionId('SessionScreenA');
//         setUserName(`Participant${Math.floor(Math.random() * 100)}`);
//     };

//     const appendUserData = (videoElement: HTMLElement, connection: any) => {
//         let userData: string;
//         let nodeId: string;
//         if (typeof connection === "string") {
//             userData = connection;
//             nodeId = connection;
//         } else {
//             userData = JSON.parse(connection.data).clientData;
//             nodeId = connection.connectionId;
//         }
//         const dataNode = document.createElement('div');
//         dataNode.className = "data-node";
//         dataNode.id = "data-" + nodeId;
//         dataNode.innerHTML = "<p>" + userData + "</p>";
//         videoElement.parentNode!.insertBefore(dataNode, videoElement.nextSibling);
//         addClickListener(videoElement, userData);
//     };

//     const removeUserData = (connection: any) => {
//         const dataNodeToRemove = document.getElementById("data-" + connection.connectionId);
//         if (dataNodeToRemove) {
//             dataNodeToRemove.parentNode!.removeChild(dataNodeToRemove);
//         }
//     };

//     const removeAllUserData = () => {
//         const nicknameElements = document.getElementsByClassName('data-node');
//         while (nicknameElements[0]) {
//             nicknameElements[0].parentNode!.removeChild(nicknameElements[0]);
//         }
//     };

//     const addClickListener = (videoElement: HTMLElement, userData: string) => {
//         videoElement.addEventListener('click', () => {
//             const mainVideo = document.querySelector('#main-video video') as HTMLVideoElement;
//             if (mainVideo.srcObject !== videoElement.srcObject) {
//                 document.getElementById('main-video')!.classList.add('hidden');
//                 document.getElementById('main-video')!.querySelector('p')!.innerHTML = userData;
//                 mainVideo.srcObject = videoElement.srcObject;
//                 document.getElementById('main-video')!.classList.remove('hidden');
//             }
//         });
//     };

//     const initMainVideo = (videoElement: HTMLVideoElement, userData: string) => {
//         const mainVideo = document.querySelector('#main-video video') as HTMLVideoElement;
//         mainVideo.srcObject = videoElement.srcObject;
//         document.querySelector('#main-video p')!.innerHTML = userData;
//         mainVideo['muted'] = true;
//     };

//     const getToken = async () => {
//         const sessionId = await createSession(mySessionId);
//         return await createToken(sessionId);
//     };

//     const createSession = async (sessionId: string) => {
//         const response = await axios.post(
//             `${APPLICATION_SERVER_URL}api/sessions`,
//             { customSessionId: sessionId },
//             { headers: { 'Content-Type': 'application/json' } }
//         );
//         return response.data;
//     };

//     const createToken = async (sessionId: string) => {
//         const response = await axios.post(
//             `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`,
//             {},
//             { headers: { 'Content-Type': 'application/json' } }
//         );
//         return response.data;
//     };

//     return (
//         <div className="p-4">
//             <div id="join" className="space-y-4">
//                 <input
//                     id="sessionId"
//                     value={sessionId}
//                     onChange={(e) => setSessionId(e.target.value)}
//                     className="border p-2 rounded w-full"
//                     placeholder="Session ID"
//                 />
//                 <input
//                     id="userName"
//                     value={userName}
//                     onChange={(e) => setUserName(e.target.value)}
//                     className="border p-2 rounded w-full"
//                     placeholder="User Name"
//                 />
//                 <button onClick={joinSession} className="bg-blue-500 text-white p-2 rounded w-full">
//                     Join Session
//                 </button>
//             </div>
//             <div id="session" className="hidden space-y-4">
//                 <h1 id="session-title" className="text-xl font-bold"></h1>
//                 <div id="container-cameras" className="grid grid-cols-2 gap-4"></div>
//                 <div id="container-screens" className="grid grid-cols-2 gap-4"></div>
//                 <button
//                     id="buttonScreenShare"
//                     onClick={publishScreenShare}
//                     className="bg-green-500 text-white p-2 rounded w-full hidden"
//                 >
//                     Share Screen
//                 </button>
//                 <button onClick={leaveSession} className="bg-red-500 text-white p-2 rounded w-full">
//                     Leave Session
//                 </button>
//             </div>
//             <div id="main-video" className="hidden">
//                 <video className="w-full"></video>
//                 <p className="text-center mt-2"></p>
//             </div>
//         </div>
//     );
// };

// export default App;
