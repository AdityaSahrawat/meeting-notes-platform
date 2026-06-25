"use client";

import { useState } from "react";
import { SlidersHorizontal, Search, ChevronRight, MessageCircle } from "lucide-react";

interface Meeting {
    id: string;
    title: string;
    date: string;
    time: string;
    duration: number;
    host: string;
    avatarLetter: string;
    avatarColor: string;
}

interface MeetingGroup {
    dateLabel: string;
    meetings: Meeting[];
    showFeedback?: boolean;
}

const meetingGroups: MeetingGroup[] = [
    {
        dateLabel: "Thu, Jan 15",
        showFeedback: true,
        meetings: [
            {
                id: "1",
                title: "FSD2 Session",
                date: "Jan 15",
                time: "3:30 PM",
                duration: 121,
                host: "ALOK KUMAR DAS",
                avatarLetter: "A",
                avatarColor: "bg-red-500",
            },
        ],
    },
    {
        dateLabel: "Tue, Jan 6",
        meetings: [
            {
                id: "2",
                title: "FSD II Session",
                date: "Jan 6",
                time: "9:00 AM",
                duration: 115,
                host: "BHOOMIKA MAHESH MANNUR",
                avatarLetter: "B",
                avatarColor: "bg-gray-600",
            },
        ],
    },
];

export default function MeetingsList() {
    const [activeTab, setActiveTab] = useState<"hosted" | "shared">("hosted");
    const [checkedAll, setCheckedAll] = useState<Record<string, boolean>>({});

    return (
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {/* Tabs & Filters */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
                <button
                    onClick={() => setActiveTab("hosted")}
                    className={`text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors ${activeTab === "hosted"
                            ? "border border-gray-200 text-gray-800 bg-white shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Hosted by me
                </button>
                <button
                    onClick={() => setActiveTab("shared")}
                    className={`text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors ${activeTab === "shared"
                            ? "border border-gray-200 text-gray-800 bg-white shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Shared with me
                </button>

                {/* Divider */}
                <div className="w-px h-5 bg-gray-200 mx-1" />

                <button className="flex items-center gap-1.5 text-[13px] font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                    <SlidersHorizontal size={13} />
                    Filters
                </button>

                <div className="ml-auto">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                        <Search size={15} className="text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Meeting groups */}
            <div className="px-5 py-4 flex flex-col gap-0">
                {meetingGroups.map((group) => (
                    <div key={group.dateLabel} className="mb-4">
                        {/* Date row */}
                        <div className="flex items-center gap-3 mb-2">
                            <input
                                type="checkbox"
                                checked={!!checkedAll[group.dateLabel]}
                                onChange={(e) =>
                                    setCheckedAll((prev) => ({ ...prev, [group.dateLabel]: e.target.checked }))
                                }
                                className="w-3.5 h-3.5 rounded border-gray-300 accent-violet-600 cursor-pointer"
                            />
                            <span className="text-[13px] font-semibold text-gray-500">{group.dateLabel}</span>
                            {group.showFeedback && (
                                <div className="ml-auto flex items-center gap-1 text-[12.5px] text-gray-400 hover:text-gray-600 cursor-pointer">
                                    <MessageCircle size={13} />
                                    Feedback
                                </div>
                            )}
                        </div>

                        {/* Meetings in group */}
                        <div className="flex flex-col gap-0 border border-gray-100 rounded-xl overflow-hidden">
                            {group.meetings.map((meeting, idx) => (
                                <div
                                    key={meeting.id}
                                    className={`flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer ${idx > 0 ? "border-t border-gray-100" : ""
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        className="w-3.5 h-3.5 rounded border-gray-300 accent-violet-600 cursor-pointer shrink-0"
                                    />
                                    {/* Avatar */}
                                    <div
                                        className={`w-9 h-9 rounded-lg ${meeting.avatarColor} flex items-center justify-center text-white font-bold text-[15px] shrink-0`}
                                    >
                                        {meeting.avatarLetter}
                                    </div>
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1">
                                            <span className="text-[14px] font-semibold text-gray-800 truncate">
                                                {meeting.title}
                                            </span>
                                            <ChevronRight size={13} className="text-gray-400 shrink-0" />
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-0.5 text-[12.5px] text-gray-400">
                                            <span>{meeting.date}</span>
                                            <span className="text-gray-300">·</span>
                                            <span>{meeting.time}</span>
                                            <span className="text-gray-300">·</span>
                                            <span>{meeting.duration} min</span>
                                            <span className="text-gray-300">·</span>
                                            <span className="font-medium text-gray-500">{meeting.host}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* End of list */}
                <p className="text-center text-[13px] text-gray-400 py-6">
                    You&apos;ve reached the end of your meetings.
                </p>
            </div>
        </div>
    );
}
