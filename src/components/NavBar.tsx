import Link from "next/link";
import Image from "next/image";
import MobileNav from "@/components/MobileNav";
import {SignIn, UserButton} from "@clerk/nextjs";

type Props = {};
export default function NavBar({}: Props) {
    return (
        <nav className={'flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10'}>
            <Link href={'/'} className={'flex items-center gap-1'}>
                <Image src={'/icons/logo.svg'} alt={'logo'} width={32} height={32} className={'max-sm:size-10'}/>
                <p className={'text-[26px] font-extrabold text-white max-sm:hidden'}>Loom</p>
            </Link>
            <div className={'flex-between gap-5 '}>
                <UserButton/>

                <MobileNav/>
            </div>
        </nav>
    );
};
