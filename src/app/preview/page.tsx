"use client";

import { useState, useEffect } from "react";
import Control from "@/components/Control";
import CameraOn from "../../../public/svgs/camera_on.svg";
import CameraOff from "../../../public/svgs/camera_off.svg"
import MicOn from "../../../public/svgs/mic_on.svg"
import MicOff from "../../../public/svgs/mic_off.svg"
import SettingIcon from "../../../public/svgs/setting.svg"
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

const Preview = () => {
    const router = useRouter();

    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);

    const handleCameraClick = () => {
        setIsCameraOn(prevState => !prevState);
    }
    const handleMicClick = () => {
        setIsMicOn(prevState => !prevState);
    }
    const handleJoinClick = () => {
        router.push(`/meeting`);
    }

    return <div className="w-full flex flex-col items-center px-6">
        <div className="max-w-515 w-full flex flex-col items-center">
            <h1 className="text-primary font-bold text-4xl">미리 보기</h1>
            <p className="mt-2 text-primary">비디오와 오디오를 설정하세요</p>
            <div className="h-80 w-full mt-10 mb-6 bg-[#141218] rounded-2xl"></div>
            <div className="w-full mb-6 flex flex-row justify-between">
                <div className="flex gap-4">
                    <Control name={'camera'} OnClick={handleCameraClick}>{isCameraOn ? <CameraOn /> : <CameraOff />}</Control>
                    <Control name={'mic'} OnClick={handleMicClick}>{isMicOn ? <MicOn /> : <MicOff />}</Control>
                </div>
                <button className="h-12 w-12 flex justify-center items-center border border-primary rounded-lg">
                    <SettingIcon />
                </button>
            </div>
            <div className="flex flex-row w-full gap-4">
                <Input placeholder="사용할 이름을 입력해주세요" defaultValue={'홍길동'} className="basis-3/4" />
                <Button onClick={handleJoinClick} className="basis-1/4">참가</Button>
            </div>
        </div>
    </div >
}

export default Preview;