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

    return <div className='aspect-w-16 aspect-h-9'><video className='w-full h-full' autoPlay ref={videoRef} /></div>;
};

export default OpenViduVideoComponent;