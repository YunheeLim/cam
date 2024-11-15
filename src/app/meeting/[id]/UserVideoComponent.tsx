import React, { useEffect, useState } from 'react';
import OpenViduVideoComponent from './OvVideo';
import MicOff from '../../../../public/svgs/mic_off.svg';

interface UserVideoComponentProps {
  streamManager: any;
}

const UserVideoComponent: React.FC<UserVideoComponentProps> = ({
  streamManager,
}) => {
  const [videoActive, setVideoActive] = useState(
    streamManager.stream.videoActive,
  );
  const [audioActive, setAudioActive] = useState(
    streamManager.stream.audioActive,
  );

  useEffect(() => {
    const handleStreamPropertyChanged = (event: any) => {
      if (event.changedProperty === 'videoActive') {
        setVideoActive(event.newValue);
      }
      if (event.changedProperty === 'audioActive') {
        setAudioActive(event.newValue);
      }
    };
    console.log('video type: ', streamManager.stream.typeOfVideo);
    console.log('streamManager: ', streamManager);

    streamManager.on('streamPropertyChanged', handleStreamPropertyChanged);

    return () => {
      streamManager.off('streamPropertyChanged', handleStreamPropertyChanged);
    };
  }, [streamManager]);

  const getNicknameTag = () => {
    if (streamManager.stream.typeOfVideo == 'SCREEN') {
      console.log(streamManager);
      const jsonString = streamManager?.stream?.session?.options?.metadata;
      const parsedData = JSON.parse(jsonString);
      const owner = parsedData.clientData;
      return `${owner}의 화면`;
    } else {
      // Gets the nickName of the user
      return JSON.parse(streamManager.stream.connection.data).clientData;
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center">
      {streamManager ? (
        <div className="relative streamcomponent">
          <OpenViduVideoComponent streamManager={streamManager} />
          <div className="absolute bottom-2 left-2 flex justify-center items-center py-1 px-2 bg-[rgba(6,7,9,0.7)] text-white text-sm rounded-md">
            {getNicknameTag()}
          </div>
          {!videoActive && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex justify-center items-center bg-primary-2 text-white font-semibold text-4xl rounded-full">
              {/* 입력한 닉네임이 공백일 때 기본 이름으로 설정 */}
              {getNicknameTag()[0]}
            </div>
          )}
          {/* 마이크 off */}
          {!audioActive && (
            <div className="absolute top-2 right-2 flex justify-center items-center h-8 w-8 rounded-full bg-[#293042]">
              <MicOff width={16} height={16} />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default UserVideoComponent;
