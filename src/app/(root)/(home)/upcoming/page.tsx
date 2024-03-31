import CallList from "@/components/CallList";

type Props = {

};
export default function Upcoming({}: Props) {
    return (
        <section className="flex size-full flex-col gap-10 text-white">
            <h1 className="text-3xl font-bold">Upcoming Meeting</h1>

            <CallList type="upcoming"/>
        </section>
    );
};
