import MicOff from '../../public/svgs/mic_off.svg';

interface VideoProps {
  width?: string;
  height: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  isCameraOn: boolean;
  isMicOn: boolean;
  nickName: string | null;
  userName: string | null;
}

const Video: React.FC<VideoProps> = ({
  width,
  height,
  videoRef,
  isCameraOn,
  isMicOn,
  nickName,
  userName,
}) => {
  return (
    <div
      className={`aspect-h-9 aspect-w-16 relative flex h-full w-full rounded-2xl bg-black`}
    >
      <video
        ref={videoRef}
        autoPlay
        className={`rounded-2xl object-cover`}
      ></video>
      {/* 카메라 on일 때 name tag */}
      {/* {isCameraOn && <div className="absolute bottom-2 left-2 flex justify-center items-center py-1 px-2 bg-[rgba(6,7,9,0.7)] text-white text-sm rounded-md">
            {nickName}</div>} */}
      {/* 카메라 off */}
      {!isCameraOn && (
        <div className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-primary-2 text-4xl font-semibold text-white">
          {/* 입력한 닉네임이 공백일 때 기본 이름으로 설정 */}
          {nickName && userName && (nickName[0] ?? userName[0])}
        </div>
      )}
      {/* 마이크 off */}
      <div>
        {!isMicOn && (
          <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#293042]">
            <MicOff width={16} height={16} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;
