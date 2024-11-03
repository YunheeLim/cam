import React, { useEffect, useState } from 'react';
import OpenViduVideoComponent from './OvVideo';
import MicOff from "../../../public/svgs/mic_off.svg";

interface UserVideoComponentProps {
  streamManager: any;
}

const UserVideoComponent: React.FC<UserVideoComponentProps> = ({ streamManager }) => {
  const [videoActive, setVideoActive] = useState(streamManager.stream.videoActive);
  const [audioActive, setAudioActive] = useState(streamManager.stream.audioActive);

  useEffect(() => {
    const handleStreamPropertyChanged = (event: any) => {
      if (event.changedProperty === 'videoActive') {
        setVideoActive(event.newValue);
      }
      if (event.changedProperty === 'audioActive') {
        setAudioActive(event.newValue);
      }
    };

    streamManager.on('streamPropertyChanged', handleStreamPropertyChanged);

    return () => {
      streamManager.off('streamPropertyChanged', handleStreamPropertyChanged);
    };
  }, [streamManager]);

  const getNicknameTag = () => {
    // Gets the nickName of the user
    // return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <div>
      {streamManager ? (
        <div className="relative streamcomponent w-full max-h-650">
          <OpenViduVideoComponent streamManager={streamManager} />
          <div className="absolute bottom-2 left-2 flex justify-center items-center py-1 px-2 bg-[#060709] text-white text-sm">
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