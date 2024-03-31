'use client'
import ReactDatePicker from 'react-datepicker';
import HomeCard from "@/components/HomeCard";
import {useState} from "react";
import {useRouter} from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import {useUser} from "@clerk/nextjs";
import {Call, useStreamVideoClient} from "@stream-io/video-react-sdk";
import {useToast} from "@/components/ui/use-toast"
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";

type Props = {};
type MeetingType = 'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
export default function MeetingTypeList({}: Props) {

    const router = useRouter()
    const {toast} = useToast()
    const [meetingState, setMeetingState] = useState<MeetingType>()
    const [value, setValue] = useState({
        dateTime: new Date(),
        description: '',
        link: ''
    })
    const [callDetail, setCallDetail] = useState<Call>()
    const {user} = useUser()
    const client = useStreamVideoClient();

    const createMeeting = async () => {
        if (!client || !user) return

        try {
            if (!value.dateTime) {
                toast({title: "Please select a date and time",})
                return

            }

            const id = crypto.randomUUID()
            const call = client.call('default', id);
            if (!call) throw new Error('Failed create new call');

            const startsAt = value.dateTime.toISOString() || new Date(Date.now()).toISOString()
            const description = value.description || 'Instant meeting'

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description,
                    }
                }
            })
            setCallDetail(call)
            if (!value.description) {
                router.push(`/meeting/${call.id}`)
            }
            toast({title: "Meeting Created",})

        } catch (error) {
            console.error(error)
            toast({title: "Failed to create meeting",})
        }
    }
    const meetinLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`
    return (
        <section className={'grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'}>
            <HomeCard
                img={'/icons/add-meeting.svg'}
                title={'New Meeting'}
                description={'Start an instant meeting'}
                handleClick={() => setMeetingState('isInstantMeeting')}
                className={'bg-orange-1'}
            />
            <HomeCard
                img={'/icons/join-meeting.svg'}
                title={'Join Meeting'}
                description={'via invitation link'}
                handleClick={() => setMeetingState('isJoiningMeeting')}
                className={'bg-blue-1'}
            />
            <HomeCard
                img={'/icons/schedule.svg'}
                title={'Schedule Meeting'}
                description={'Plan your meeting'}
                handleClick={() => setMeetingState('isScheduleMeeting')}
                className={'bg-purple-1'}
            />
            <HomeCard
                img={'/icons/recordings.svg'}
                title={'View Recordings'}
                description={'Meeting recordings'}
                handleClick={() => router.push('/recordings')}
                className={'bg-yellow-1'}
            />

            {!callDetail ? (
                <MeetingModal
                    isOpen={meetingState === 'isScheduleMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title={'Create Meeting'}
                    handleClick={createMeeting}
                >
                    <div className={'flex flex-col gap-2.5'}>
                        <label className={'text-base font-normal leading-[22px] text-sky-2'}>
                            Add a description
                        </label>
                        <Textarea className={'border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'}
                                  onChange={(e) => {
                                      setValue({...value, description: e.target.value})
                                  }}/>
                    </div>
                    <div className={'flex w-full gap-2.5 flex-col'}>
                        <label className={'text-base font-normal leading-[22px] text-sky-2'}>
                            Select day and time
                        </label>
                        <ReactDatePicker
                            selected={value.dateTime}
                            onChange={(date) => setValue({...value, dateTime: date!})}
                            showTimeSelect
                            timeFormat={'HH.mm'}
                            timeCaption={'time'}
                            timeIntervals={15}
                            dateFormat={'MMMM d, yyyy h:mm aa'}
                            className={'w-full rounded bg-dark-3 p-2 focus:outline-none'}
                        />
                    </div>
                </MeetingModal>
            ) : (
                <MeetingModal
                    isOpen={meetingState === 'isScheduleMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title={'Meeting created'}
                    className={'text-center'}
                    buttonText={'Copy Meeting Link'}
                    handleClick={() => {
                        navigator.clipboard.writeText(meetinLink)
                        toast({title: 'Link copied'})
                    }}
                    image={'/icons/checked.svg'}
                    buttonIcon={'/icons/copy.svg'}

                />
            )}
            <MeetingModal
                isOpen={meetingState === 'isInstantMeeting'}
                onClose={() => setMeetingState(undefined)}
                title={'Start an instant meeting'}
                className={'text-center'}
                buttonText={'Start Meeting'}
                handleClick={createMeeting}
            />

            <MeetingModal
                isOpen={meetingState === 'isJoiningMeeting'}
                onClose={() => setMeetingState(undefined)}
                title={'Type the link here'}
                className={'text-center'}
                buttonText={'Join Meeting'}
                handleClick={() => router.push(value.link)}
            >
                <Input placeholder={'Meeting link'}
                       className={'border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'}
                onChange={(e) => setValue({...value, link: e.target.value})}/>
            </MeetingModal>
        </section>
    );
};
