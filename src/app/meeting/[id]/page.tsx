"use client"
import { useRouter, useParams, useSearchParams } from "next/navigation";

const Meeting = () => {
    const params = useParams();
    const searchParams = useSearchParams();

    console.log(params?.id, searchParams.get('nick_name'))
    return <div className="w-full h-full bg-black"></div>
}

export default Meeting;