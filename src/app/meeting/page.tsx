'use client';

import { useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';

const VideoCall = () => {
  const socketRef = useRef<typeof Socket>();
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection>();

  // const { roomName } = useParams();
  const roomName = '123';

  const getMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }
      if (!(pcRef.current && socketRef.current)) {
        return;
      }
      stream.getTracks().forEach(track => {
        if (!pcRef.current) {
          return;
        }
        pcRef.current.addTrack(track, stream);
      });

      pcRef.current.onicecandidate = e => {
        console.log('here3');

        if (e.candidate) {
          if (!socketRef.current) {
            return;
          }
          console.log('recv candidate');
          socketRef.current.emit('candidate', e.candidate, roomName);
        }
      };

      pcRef.current.ontrack = e => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = e.streams[0];
        }
      };
    } catch (e) {
      console.error(e);
    }
  };

  const createOffer = async () => {
    console.log('create Offer');
    if (!(pcRef.current && socketRef.current)) {
      return;
    }
    try {
      const sdp = await pcRef.current.createOffer();
      pcRef.current.setLocalDescription(sdp);
      console.log('sent the offer');
      socketRef.current.emit('offer', sdp, roomName);
    } catch (e) {
      console.error(e);
    }
  };

  const createAnswer = async (sdp: RTCSessionDescription) => {
    console.log('createAnswer');
    if (!(pcRef.current && socketRef.current)) {
      return;
    }

    try {
      pcRef.current.setRemoteDescription(sdp);
      const answerSdp = await pcRef.current.createAnswer();
      pcRef.current.setLocalDescription(answerSdp);

      console.log('sent the answer');
      socketRef.current.emit('answer', answerSdp, roomName);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    socketRef.current = io('http://localhost:8080');

    pcRef.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    });

    getMedia();

    socketRef.current.on('all_users', (allUsers: Array<{ id: string }>) => {
      if (allUsers.length > 0) {
        createOffer();
      }
    });

    socketRef.current.on('getOffer', (sdp: RTCSessionDescription) => {
      console.log('recv Offer');
      createAnswer(sdp);
    });

    socketRef.current.on('getAnswer', (sdp: RTCSessionDescription) => {
      console.log('recv Answer', pcRef.current);
      if (!pcRef.current) {
        return;
      }
      pcRef.current.setRemoteDescription(sdp);
    });

    socketRef.current.on('getCandidate', async (candidate: RTCIceCandidate) => {
      console.log('recv Candidate');
      if (!pcRef.current) {
        return;
      }

      await pcRef.current.addIceCandidate(candidate);
    });

    socketRef.current.emit('join_room', {
      room: roomName,
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <video
        id="remotevideo"
        style={{
          width: 240,
          height: 240,
          backgroundColor: 'black',
        }}
        ref={myVideoRef}
        autoPlay
      />
      <video
        id="remotevideo"
        style={{
          width: 240,
          height: 240,
          backgroundColor: 'black',
        }}
        ref={remoteVideoRef}
        autoPlay
      />
    </div>
  );
};

export default VideoCall;

// 'use client';

// import React, { useEffect, useRef } from 'react';
// import io from 'socket.io-client';

// const pc_config = {
//   iceServers: [
//     // {
//     //   urls: 'stun:[STUN_IP]:[PORT]',
//     //   credentials: '[YOR CREDENTIALS]',
//     //   username: '[USERNAME]',
//     // },
//     {
//       urls: 'stun:stun.l.google.com:19302',
//     },
//   ],
// };
// const SOCKET_SERVER_URL = 'http://localhost:8080';

// const App = () => {
//   const socketRef = useRef<SocketIOClient.Socket>();
//   const pcRef = useRef<RTCPeerConnection>();
//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);

//   const setVideoTracks = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//       if (!(pcRef.current && socketRef.current)) return;
//       stream.getTracks().forEach(track => {
//         if (!pcRef.current) return;
//         pcRef.current.addTrack(track, stream);
//       });
//       pcRef.current.onicecandidate = e => {
//         if (e.candidate) {
//           if (!socketRef.current) return;
//           console.log('onicecandidate');
//           socketRef.current.emit('candidate', e.candidate);
//         }
//       };
//       pcRef.current.oniceconnectionstatechange = e => {
//         console.log(e);
//       };
//       pcRef.current.ontrack = ev => {
//         console.log('add remotetrack success');
//         if (remoteVideoRef.current) {
//           remoteVideoRef.current.srcObject = ev.streams[0];
//         }
//       };
//       socketRef.current.emit('join_room', {
//         room: '1234',
//       });
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const createOffer = async () => {
//     console.log('create offer');
//     if (!(pcRef.current && socketRef.current)) return;
//     try {
//       const sdp = await pcRef.current.createOffer({
//         offerToReceiveAudio: true,
//         offerToReceiveVideo: true,
//       });
//       await pcRef.current.setLocalDescription(new RTCSessionDescription(sdp));
//       socketRef.current.emit('offer', sdp);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const createAnswer = async (sdp: RTCSessionDescription) => {
//     if (!(pcRef.current && socketRef.current)) return;
//     try {
//       await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
//       console.log('answer set remote description success');
//       const mySdp = await pcRef.current.createAnswer({
//         offerToReceiveVideo: true,
//         offerToReceiveAudio: true,
//       });
//       console.log('create answer');
//       await pcRef.current.setLocalDescription(new RTCSessionDescription(mySdp));
//       socketRef.current.emit('answer', mySdp);
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   useEffect(() => {
//     socketRef.current = io.connect(SOCKET_SERVER_URL);
//     pcRef.current = new RTCPeerConnection(pc_config);

//     socketRef.current.on('all_users', (allUsers: Array<{ id: string }>) => {
//       if (allUsers.length > 0) {
//         createOffer();
//       }
//     });

//     socketRef.current.on('getOffer', (sdp: RTCSessionDescription) => {
//       //console.log(sdp);
//       console.log('get offer');
//       createAnswer(sdp);
//     });

//     socketRef.current.on('getAnswer', (sdp: RTCSessionDescription) => {
//       console.log('get answer');
//       if (!pcRef.current) return;
//       pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
//       //console.log(sdp);
//     });

//     socketRef.current.on(
//       'getCandidate',
//       async (candidate: RTCIceCandidateInit) => {
//         if (!pcRef.current) return;
//         await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
//         console.log('candidate add success');
//       },
//     );

//     setVideoTracks();

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//       if (pcRef.current) {
//         pcRef.current.close();
//       }
//     };
//   }, []);

//   return (
//     <div>
//       <video
//         style={{
//           width: 240,
//           height: 240,
//           margin: 5,
//           backgroundColor: 'black',
//         }}
//         muted
//         ref={localVideoRef}
//         autoPlay
//       />
//       <video
//         id="remotevideo"
//         style={{
//           width: 240,
//           height: 240,
//           margin: 5,
//           backgroundColor: 'black',
//         }}
//         ref={remoteVideoRef}
//         autoPlay
//       />
//     </div>
//   );
// };

// export default App;
