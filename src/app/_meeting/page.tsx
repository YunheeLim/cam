'use client';

import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';

const VideoCall = () => {
  const socketRef = useRef<typeof Socket>();
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection>();

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
        if (e.candidate) {
          if (!socketRef.current) {
            return;
          }
          console.log('Sending ICE candidate:', e.candidate);
          socketRef.current.emit('candidate', e.candidate, roomName);
        }
      };

      pcRef.current.ontrack = e => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = e.streams[0];
        }
      };
    } catch (e) {
      console.error('Error getting media:', e);
    }
  };

  const createOffer = async () => {
    console.log('Creating offer');
    if (!(pcRef.current && socketRef.current)) {
      return;
    }
    try {
      const sdp = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(sdp);
      console.log('Sending offer:', sdp);
      socketRef.current.emit('offer', sdp, roomName);
    } catch (e) {
      console.error('Error creating offer:', e);
    }
  };

  const createAnswer = async (sdp: RTCSessionDescription) => {
    console.log('Creating answer');
    if (!(pcRef.current && socketRef.current)) {
      return;
    }

    try {
      await pcRef.current.setRemoteDescription(sdp);
      const answerSdp = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answerSdp);

      console.log('Sending answer:', answerSdp);
      socketRef.current.emit('answer', answerSdp, roomName);
    } catch (e) {
      console.error('Error creating answer:', e);
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
      console.log('Received offer:', sdp);
      createAnswer(sdp);
    });

    socketRef.current.on('getAnswer', (sdp: RTCSessionDescription) => {
      console.log('Received answer:', sdp);
      if (!pcRef.current) {
        return;
      }
      pcRef.current.setRemoteDescription(sdp);
    });

    socketRef.current.on('getCandidate', async (candidate: RTCIceCandidate) => {
      console.log('Received ICE candidate:', candidate);
      if (!pcRef.current) {
        return;
      }

      try {
        await pcRef.current.addIceCandidate(candidate);
        console.log('Added ICE candidate successfully');
      } catch (e) {
        console.error('Error adding received ICE candidate:', e);
      }
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
        id="myVideo"
        style={{
          width: 240,
          height: 240,
          backgroundColor: 'black',
        }}
        ref={myVideoRef}
        autoPlay
      />
      <video
        id="remoteVideo"
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