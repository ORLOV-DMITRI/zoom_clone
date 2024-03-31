import {useState} from "react";
import {
    CallControls,
    CallingState,
    CallParticipantsList,
    CallStatsButton,
    PaginatedGridLayout,
    SpeakerLayout,
    useCallStateHooks
} from "@stream-io/video-react-sdk";
import {cn} from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {LayoutGridIcon, Users} from "lucide-react";
import {useSearchParams} from "next/navigation";
import EndCallButton from "@/components/EndCallButton";
import Loader from "@/components/Loader";

type Props = {};
type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

export default function MeetingRoom({}: Props) {
    const [layout, setLayout] = useState<CallLayoutType>('speaker-left')
    const [showUsers, setShowUsers] = useState(false)
    const searchParams = useSearchParams()
    const isPersonalRoom = !!searchParams.get('personal')

    const {useCallCallingState} = useCallStateHooks()

    const callingState = useCallCallingState();
    if (callingState !== CallingState.JOINED) return <Loader/>

    const CallLayout = () => {
        switch (layout) {
            case 'grid':
                return <PaginatedGridLayout/>
            case 'speaker-left':
                return <SpeakerLayout participantsBarPosition={'left'}/>
            case 'speaker-right':
                return <SpeakerLayout participantsBarPosition={'right'}/>
        }
    }
    return (
        <section className={'relative h-screen w-full overflow-hidden pt-4 text-white'}>
            <div className={'relative flex size-full items-center justify-center'}>
                <div className={'flex size-full max-w-[1000px] items-center'}>
                    <CallLayout/>
                </div>
                <div className={cn('h-[calc(100vh-86px)] hidden ml-2', showUsers && 'show-block')}>
                    <CallParticipantsList onClose={() => setShowUsers(false)}/>
                </div>
                <div className={'flex flex-wrap bottom-0 fixed w-full items-center justify-center gap-5'}>
                    <CallControls/>

                    <DropdownMenu>
                        <div className={'flex items-center'}>
                            <DropdownMenuTrigger
                                className={'cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'}>
                                <LayoutGridIcon size={20} className={'text-white'}/>
                            </DropdownMenuTrigger>
                        </div>
                        <DropdownMenuContent className={'border-dark-1 bg-dark-1 text-white'}>
                            {['Grid', 'Speaker-left', 'Speaker-right'].map(item => (
                                <div key={item}>
                                    <DropdownMenuItem className={'cursor-pointer '}
                                                      onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}>
                                        {item}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className={'border-dark-1'}/>
                                </div>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <CallStatsButton/>
                    <button onClick={() => setShowUsers((prevState) => !prevState)}>
                        <div className={'cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'}>
                            <Users size={20}/>
                        </div>
                    </button>
                    {!isPersonalRoom && <EndCallButton/>}
                </div>
            </div>
        </section>
    );
};
