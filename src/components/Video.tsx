import MicOff from "../../public/svgs/mic_off.svg"

interface VideoProps {
    width?: string;
    height: string;
    videoRef: React.RefObject<HTMLVideoElement>;
    isCameraOn: boolean;
    isMicOn: boolean;
    nickName: string;
    userName: string;
}

const Video: React.FC<VideoProps> = ({ width, height, videoRef, isCameraOn, isMicOn, nickName, userName }) => {
    return <div className={`relative flex ${height} w-full bg-black rounded-2xl`}>
        <video ref={videoRef} autoPlay className={`h-full w-full rounded-2xl`}></video>
        {/* 카메라 on일 때 name tag */}
        {isCameraOn && <div className="absolute bottom-2 left-2 flex justify-center items-center py-1 px-2 bg-[rgba(6,7,9,0.7)] text-white text-sm rounded-md">

            {nickName}</div>}
        {/* 카메라 off */}
        {!isCameraOn && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 flex justify-center items-center bg-primary-2 text-white font-semibold text-4xl rounded-full">
            {/* 입력한 닉네임이 공백일 때 기본 이름으로 설정 */}
            {nickName[0] ?? userName[0]}
        </div>}
        {/* 마이크 off */}
        {!isMicOn && <div className="absolute top-2 right-2 flex justify-center items-center h-8 w-8 rounded-full bg-[#293042]"><MicOff width={16} height={16} /></div>}
    </div>
}

export default Video;