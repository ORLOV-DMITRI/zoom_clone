import {SignUp} from "@clerk/nextjs";

type Props = {};
export default function SignUpPage({}: Props) {
    return (
        <main className={'flex w-full h-screen items-center justify-center'}>
            <SignUp/>
        </main>
    );
};
