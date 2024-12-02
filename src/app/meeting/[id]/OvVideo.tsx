import React, { useEffect, useRef, forwardRef } from 'react';

interface OpenViduVideoComponentProps {
  streamManager: any;
  screenRef?: React.RefObject<HTMLVideoElement>;
}

const OpenViduVideoComponent: React.FC<OpenViduVideoComponentProps> =
  forwardRef(({ streamManager }, screenRef) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (videoRef.current) {
        streamManager?.addVideoElement(videoRef.current);
      }
    }, [streamManager]);

    return (
      <div className="aspect-h-9 aspect-w-16">
        {/* <div> */}
        <video className="rounded-lg object-cover" autoPlay ref={videoRef} />
      </div>
    );
  });

export default OpenViduVideoComponent;
