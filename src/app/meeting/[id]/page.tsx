"use client"
import { useRouter, useParams, useSearchParams } from "next/navigation";
import BottomBar from "@/containers/meeting/BottomBar";

const Meeting = () => {
    const params = useParams();
    const searchParams = useSearchParams();

    console.log(params?.id, searchParams.get('nick_name'))
    return <div className="flex flex-col w-full h-full bg-black">
        <div className="h-full flex"></div>
        <BottomBar />
    </div>
}

export default Meeting;