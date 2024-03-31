'use client'
import {useCall, useCallStateHooks} from "@stream-io/video-react-sdk";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

type Props = {};
export default function EndCallButton({}: Props) {
    const call = useCall();
    const router = useRouter()
    const {useLocalParticipant} = useCallStateHooks()
    const localParticipant = useLocalParticipant();
    const isMeetingOwner = localParticipant && call?.state.createdBy && localParticipant.userId === call.state.createdBy.id;

    if (!isMeetingOwner) return null
    return (
        <Button variant={'destructive'} className={'bg-red-700'} onClick={ async () => {
            await call?.endCall()
            router.push('/')
        } }>
        End call for everyone
        </Button>
    );
};
