import React, { useEffect, useRef } from 'react';

interface OpenViduVideoComponentProps {
    streamManager: any;
}

const OpenViduVideoComponent: React.FC<OpenViduVideoComponentProps> = ({ streamManager }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);

    return <video className='w-full max-h-650' autoPlay ref={videoRef} />;
};

export default OpenViduVideoComponent;