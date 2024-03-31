import {useEffect, useState} from "react";
import {Call, useStreamVideoClient} from "@stream-io/video-react-sdk";
import {useUser} from "@clerk/nextjs";

export function useGetCalls() {
    const [calls, setCalls] = useState<Call[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const client = useStreamVideoClient()

    const {user} = useUser();

    useEffect(() => {
        const loadCall = async () => {
            if (!client || !user?.id) return
            setIsLoading(true)
            try {
                const { calls } = await client.queryCalls({
                    sort: [{ field: 'starts_at', direction: -1 }],
                    filter_conditions: {
                        starts_at: { $exists: true },
                        $or: [
                            { created_by_user_id: user.id },
                            { members: { $in: [user.id] } },
                        ],
                    },
                });
                console.log(calls)
                setCalls(calls)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        loadCall()
    }, [client, user?.id]);

    const now = new Date()

    const endedCals = calls.filter(({state: {startsAt, endedAt}}: Call) => {
        return (startsAt && new Date(startsAt) < now && !!endedAt )
    })
    const upcomingCals = calls.filter(({state: {startsAt, endedAt}}: Call) => {
        return startsAt && new Date(startsAt) > now
    })

    return {
        endedCals,
        upcomingCals,
        callRecordings: calls,
        isLoading
    }
}
