import Control from "@/components/Control";
import Button from "@/components/Button";
import CameraOn from "../../../public/svgs/camera_on.svg";
import CameraOff from "../../../public/svgs/camera_off.svg";
import MicOn from "../../../public/svgs/mic_on.svg";
import MicOff from "../../../public/svgs/mic_off.svg";
import SpeakerOn from "../../../public/svgs/speaker_on.svg";
import SpeakerOff from "../../../public/svgs/speaker_off.svg";
import ScreenShareIcon from "../../../public/svgs/screenshare.svg";
import SettingIcon from "../../../public/svgs/setting.svg";
import PeopleIcon from "../../../public/svgs/people.svg";
import ExitIcon from "../../../public/svgs/exit.svg";
import { useState } from "react";

const BottomBar = () => {
    const [peopleCnt, setPeopleCnt] = useState(1)

    return <div className="relative w-full flex flex-row p-6 justify-between">
        <div className="flex gap-4">
            <Control name='camera' OnClick={() => { }}><CameraOn /></Control>
            <Control name='mic' OnClick={() => { }}><MicOn /></Control>
            <Control name='speaker' OnClick={() => { }}><SpeakerOn /></Control>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-row gap-4">
            <Button className="p-2"><ScreenShareIcon /></Button>
            <Button className="p-2 bg-secondary"><ExitIcon /></Button>
        </div>
        <div className="flex gap-4">
            <Button className="flex gap-2 p-2 font-semibold"><PeopleIcon />{peopleCnt}</Button>
            <Button className="p-2"><SettingIcon fill={'#ffffff'} /></Button>
        </div>
    </div>
}

export default BottomBar;