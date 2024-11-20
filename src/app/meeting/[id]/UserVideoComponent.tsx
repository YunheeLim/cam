import React, { useEffect, useState, forwardRef } from 'react';
import OpenViduVideoComponent from './OvVideo';
import MicOff from '../../../../public/svgs/mic_off.svg';

interface UserVideoComponentProps {
  streamManager: any;
  screenRef?: React.RefObject<HTMLDivElement>;
}

const UserVideoComponent: React.FC<UserVideoComponentProps> = forwardRef(
  ({ streamManager }, screenRef) => {
    const [videoActive, setVideoActive] = useState(
      streamManager.stream.videoActive,
    );
    const [audioActive, setAudioActive] = useState(
      streamManager.stream.audioActive,
    );
    const [bgColor, setBgColor] = useState('');

    // 비디오/오디오 활성화 여부
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

    // 네임태그
    const getNicknameTag = () => {
      if (streamManager.stream.typeOfVideo == 'SCREEN') {
        // console.log(streamManager);
        const jsonString = streamManager?.stream?.session?.options?.metadata;
        const parsedData = JSON.parse(jsonString);
        const owner = parsedData.clientData;
        return `공유 화면`;
      } else {
        // Gets the nickName of the user
        return JSON.parse(streamManager.stream.connection.data).clientData;
      }
    };

    // 비디오 비활성화 시 이름 색 랜덤
    useEffect(() => {
      const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };
      setBgColor(getRandomColor());
    }, []);

    return (
      <div className="flex h-full w-full flex-col">
        {streamManager ? (
          <div className="streamcomponent relative">
            <OpenViduVideoComponent streamManager={streamManager} />
            <div className="absolute bottom-2 left-2 flex items-center justify-center rounded-md bg-[rgba(6,7,9,0.7)] px-2 py-1 text-sm text-white">
              {getNicknameTag()}
            </div>
            {/* 비디오 off */}
            {!videoActive && (
              <div
                style={{ backgroundColor: bgColor }}
                className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full text-4xl font-semibold text-white"
              >
                {/* 입력한 닉네임이 공백일 때 기본 이름으로 설정 */}
                {getNicknameTag()[0]}
              </div>
            )}
            {/* 마이크 off (공유 화면은 제외) */}
            {!audioActive && streamManager.stream.typeOfVideo !== 'SCREEN' && (
              <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#293042]">
                <MicOff width={16} height={16} />
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  },
);

export default UserVideoComponent;
