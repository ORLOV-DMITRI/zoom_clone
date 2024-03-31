'use client'
import {useGetCalls} from "@/hooks/useGetCalls";
import {usePathname, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {CallRecording} from "@stream-io/video-client";
import {Call} from "@stream-io/video-react-sdk";
import MeetingCard from "@/components/MeetingCard";
import Loader from "@/components/Loader";

type Props = {
    type: 'ended' | 'upcoming' | 'recordings'
};
export default function CallList({type}: Props) {
    const path = usePathname()
    const router = useRouter()
    const {endedCals, callRecordings, upcomingCals, isLoading} = useGetCalls()
    const [recordings, setRecordings] = useState<CallRecording[]>([])

    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedCals
            case 'recordings':
                return callRecordings
            case 'upcoming':
                return upcomingCals
            default:
                return []
        }
    }
    const getNoCallMessage = () => {
        switch (type) {
            case 'ended':
                return 'No Previous Calls'
            case 'recordings':
                return 'No recordings Calls'
            case 'upcoming':
                return 'No upcoming Calls'
            default:
                return ''
        }
    }
    useEffect(() => {
        const fetchRecordings = async () => {
            const callData = await Promise.all(
                callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
            );

            const recordings = callData
                .filter((call) => call.recordings.length > 0)
                .flatMap((call) => call.recordings);

            setRecordings(recordings);
        };

        if (type === 'recordings') {
            fetchRecordings();
        }
    }, [type, callRecordings]);

    const calls = getCalls()
    const noCallsMessage = getNoCallMessage()


    if(isLoading) return <Loader/>
    return (
        <div className={'grid grid-cols-1 gap-5 xl:grid-cols-2'}>
            {calls && calls.length > 0 ? calls.map((meeting: Call | CallRecording) => (
                <MeetingCard
                    key={(meeting as Call).id}
                    icon={
                        type === 'ended'
                            ? '/icons/previous.svg'
                            : type === 'upcoming'
                                ? '/icons/upcoming.svg'
                                : '/icons/recordings.svg'
                    }
                    title={
                        (meeting as Call).state?.custom?.description ||
                        (meeting as CallRecording).filename?.substring(0, 20) ||
                        'No Description'
                    }
                    date={
                        (meeting as Call).state?.startsAt?.toLocaleString() ||
                        (meeting as CallRecording).start_time?.toLocaleString()
                    }
                    isPreviousMeeting={type === 'ended'}
                    link={
                        type === 'recordings'
                            ? (meeting as CallRecording).url
                            : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
                    }
                    buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
                    buttonText={type === 'recordings' ? 'Play' : 'Start'}
                    handleClick={
                        type === 'recordings'
                            ? () => router.push(`${(meeting as CallRecording).url}`)
                            : () => router.push(`/meeting/${(meeting as Call).id}`)
                    }
                />
            )) : (
                <h1>{noCallsMessage}</h1>
            )}
        </div>
    );
};
