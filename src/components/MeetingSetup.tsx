'use client'
import {DeviceSettings, useCall, VideoPreview} from "@stream-io/video-react-sdk";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import '@stream-io/video-react-sdk/dist/css/styles.css';

type Props = {
    setIsSetupComplete: (value: boolean) => void
};
export default function MeetingSetup({setIsSetupComplete}: Props) {
    const [isMicCamToggleOn, setIsMicCamToggleOn] = useState(false)

    const call = useCall();

    if (!call) {
        throw new Error('usecall must be used')
    }
    useEffect(() => {
        if (isMicCamToggleOn) {
            call?.camera.disable()
            call?.microphone.disable()
        } else {
            call?.camera.enable()
            call?.microphone.enable()
        }

    }, [isMicCamToggleOn, call?.camera, call?.microphone]);
    return (
        <div className={'flex h-screen w-full flex-col items-center justify-center gap-3 text-white'}>
            <h1 className={'text-2xl font-bold'}>Setup</h1>
            <VideoPreview/>
            <div className={'flex h-16 items-center justify-center gap-3'}>
                <label className={'flex items-center justify-center gap-2 font-medium'}>
                    <input type="checkbox" checked={isMicCamToggleOn}
                           onChange={(e) => setIsMicCamToggleOn(e.target.checked)}/>
                    Join with mic and camera off
                </label>
                <DeviceSettings/>
            </div>
            <Button className={'rounded-md bg-green-500 px-4'} onClick={() => {
                call?.join()
                setIsSetupComplete(true)
            }}>
                Join Meeting
            </Button>
        </div>
    );
};
