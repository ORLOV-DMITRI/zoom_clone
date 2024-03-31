import CallList from "@/components/CallList";

type Props = {

};
export default function Previous({}: Props) {
    return (
        <section className="flex size-full flex-col gap-10 text-white">
            <h1 className="text-3xl font-bold">Previous Calls</h1>

            <CallList type="ended"/>
        </section>
    );
};
