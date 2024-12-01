'use client';

import React, { createContext, useRef, useContext, useState } from 'react';

interface VideoContextProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  isCameraOn: boolean;
  setIsCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
  isMicOn: boolean;
  setIsMicOn: React.Dispatch<React.SetStateAction<boolean>>;
  selectedVideoDeviceId: string;
  setSelectedVideoDeviceId: React.Dispatch<React.SetStateAction<string>>;
  selectedAudioDeviceId: string;
  setSelectedAudioDeviceId: React.Dispatch<React.SetStateAction<string>>;
}

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] =
    useState<string>('');
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] =
    useState<string>('');

  return (
    <VideoContext.Provider
      value={{
        videoRef,
        stream,
        setStream,
        isCameraOn,
        setIsCameraOn,
        isMicOn,
        setIsMicOn,
        selectedVideoDeviceId,
        setSelectedVideoDeviceId,
        selectedAudioDeviceId,
        setSelectedAudioDeviceId,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};
