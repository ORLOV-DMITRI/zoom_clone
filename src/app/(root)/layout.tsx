import {ReactNode} from "react";
import StreamClientProvider from "@/providers/StreamClientProvider";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: "LOOM",
    description: "Video calling app",
    icons: {
        icon: '/icons/logo.svg'
    }
};
export default function RootLayout({children,}: Readonly<{ children: ReactNode }>) {


    return (
        <main>
            <StreamClientProvider>
                {children}
            </StreamClientProvider>
        </main>
    );
}
