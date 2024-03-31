'use client'
import {usePathname} from "next/navigation";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {sidebarLinks} from "@/constants";
import Image from "next/image";

type Props = {};

export default function SideBar({}: Props) {
    const path = usePathname()
    return (
        <section
            className={'sticky left-0 top-0 w-fit flex flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]'}>
            <div className={'flex flex-col flex-1 gap-6'}>
                {sidebarLinks.map((link) => {
                    const isActive = path === link.route || path.startsWith(`${link.route}/`);
                    return (
                        <Link href={link.route}
                              key={link.label}
                              className={cn('flex gap-4 items-center p-4 rounded-lg justify-start', {
                                  'bg-blue-1': isActive,
                              })}>
                            <Image src={link.imgUrl} alt={'icon'} width={24} height={24}/>
                            <p className={'text-lg font-semibold max-lg:hidden'}>
                                {link.label}
                            </p>
                        </Link>
                    )
                })}
            </div>
        </section>
    );
};
