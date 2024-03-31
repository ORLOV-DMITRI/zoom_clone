import Image from "next/image";

type Props = {

};
export default function Loader({}: Props) {
    return (
        <div className={'flex-center h-screen w-full'}>
            <Image src={'/icons/loading-circle.svg'} alt={'icon'} width={50} height={50} priority />
        </div>
    );
};
