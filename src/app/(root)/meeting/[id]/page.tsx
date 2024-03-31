'use client'
import {useUser} from "@clerk/nextjs";
import {StreamCall, StreamTheme} from "@stream-io/video-react-sdk";
import {useState} from "react";
import MeetingSetup from "@/components/MeetingSetup";
import MeetingRoom from "@/components/MeetingRoom";
import {useGetCallById} from "@/hooks/useGetCallById";
import Loader from "@/components/Loader";

type Props = {
    params: {
        id: string
    }
};
export default function Meeting({params: {id}}: Props) {
    const {user, isLoaded} = useUser()
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const {callLoading, call} = useGetCallById(id)

    if(!isLoaded || callLoading) return  <Loader/>

    return (
        <main className={'h-screen w-full'}>
            <StreamCall call={call}>
                <StreamTheme>
                    {!isSetupComplete ? (
                        <MeetingSetup setIsSetupComplete={setIsSetupComplete}/>
                    ) : (
                        <MeetingRoom/>
                    )}
                </StreamTheme>
            </StreamCall>
        </main>
    );
};
