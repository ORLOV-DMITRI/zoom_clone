import {SignIn} from "@clerk/nextjs";

type Props = {};
export default function SignInPage({}: Props) {
    return (
        <main className={'flex w-full h-screen items-center justify-center'}>
            <SignIn/>
        </main>
    );
};
