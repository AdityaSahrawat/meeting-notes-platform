import MeetingsSidebar from "@/components/meetings/MeetingsSidebar";
import MeetingsList from "@/components/meetings/MeetingsList";
import AskFredPanel from "@/components/meetings/AskFredPanel";

export default function MeetingsPage() {
    return (
        <div className="flex flex-1 overflow-hidden">
            <MeetingsSidebar />
            <MeetingsList />
            <AskFredPanel />
        </div>
    );
}
