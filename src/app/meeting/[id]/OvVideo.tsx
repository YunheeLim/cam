import React, { useEffect, useRef } from 'react';

interface OpenViduVideoComponentProps {
  streamManager: any;
}

const OpenViduVideoComponent: React.FC<OpenViduVideoComponentProps> = ({
  streamManager,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <div className="aspect-h-9 aspect-w-16">
      <video className="rounded-lg object-cover" autoPlay ref={videoRef} />
    </div>
  );
};

export default OpenViduVideoComponent;
