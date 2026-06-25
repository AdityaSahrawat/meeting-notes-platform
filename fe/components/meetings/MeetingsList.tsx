"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SlidersHorizontal, Search, ChevronRight, MessageCircle, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Meeting {
    id: number;
    title: string;
    meeting_date: string;
    duration_seconds: number;
    participants: string[];
}

interface GroupedMeetings {
    dateLabel: string;
    meetings: Meeting[];
}

export default function MeetingsList() {
    const [activeTab, setActiveTab] = useState<"hosted" | "shared">("hosted");
    const [checkedAll, setCheckedAll] = useState<Record<string, boolean>>({});
    
    // API State
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters & Sorting State
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("date_desc");
    const [dateFilter, setDateFilter] = useState("");
    const [participantFilter, setParticipantFilter] = useState("");
    const [timeRangeFilter, setTimeRangeFilter] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Fetch meetings
    useEffect(() => {
        const fetchMeetings = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                if (searchQuery) params.append("search", searchQuery);
                if (sortOrder) params.append("sort", sortOrder);
                if (dateFilter) params.append("date", dateFilter);
                if (participantFilter) params.append("participant", participantFilter);
                if (timeRangeFilter) params.append("time_range", timeRangeFilter);

                const response = await fetch(`http://localhost:8000/meetings?${params.toString()}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch meetings");
                }
                const data = await response.json();
                setMeetings(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Something went wrong while fetching meetings.");
            } finally {
                setLoading(false);
            }
        };

        // Debounce search text changes
        const handler = setTimeout(() => {
            fetchMeetings();
        }, 300);

        return () => clearTimeout(handler);
    }, [searchQuery, sortOrder, dateFilter, participantFilter, timeRangeFilter]);

    // Format helpers
    const formatDateLabel = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    };

    const formatMeetingShortDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const formatMeetingTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    };

    const getAvatarColor = (id: number) => {
        const colors = [
            "bg-rose-500",
            "bg-violet-500",
            "bg-emerald-500",
            "bg-blue-500",
            "bg-amber-500",
            "bg-indigo-500"
        ];
        return colors[id % colors.length];
    };

    // Group meetings by date label
    const groups: Record<string, Meeting[]> = {};
    meetings.forEach((m) => {
        const label = formatDateLabel(m.meeting_date);
        if (!groups[label]) {
            groups[label] = [];
        }
        groups[label].push(m);
    });

    const groupedMeetings: GroupedMeetings[] = Object.keys(groups).map((label) => ({
        dateLabel: label,
        meetings: groups[label],
    }));

    return (
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-gray-50/30">
            {/* Tabs & Filters */}
            <div className="flex flex-wrap items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab("hosted")}
                        className={`text-[13px] font-semibold px-3.5 py-2 rounded-xl transition-all ${activeTab === "hosted"
                                ? "border border-gray-200 text-gray-800 bg-gray-50 shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        Hosted by me
                    </button>
                    <button
                        onClick={() => setActiveTab("shared")}
                        className={`text-[13px] font-semibold px-3.5 py-2 rounded-xl transition-all ${activeTab === "shared"
                                ? "border border-gray-200 text-gray-800 bg-gray-50 shadow-sm"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        Shared with me
                    </button>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px h-5 bg-gray-200 mx-1" />

                {/* Filter toggle button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-1.5 text-[13px] font-semibold border rounded-xl px-3.5 py-2 hover:bg-gray-50 transition-colors ${
                        showFilters ? "border-violet-300 bg-violet-50/50 text-violet-700" : "border-gray-200 text-gray-600 bg-white"
                    }`}
                >
                    <SlidersHorizontal size={14} />
                    <span>Filters</span>
                    {(dateFilter || participantFilter || timeRangeFilter) && (
                        <span className="w-2 h-2 rounded-full bg-violet-600" />
                    )}
                </button>

                {/* Search & Sort UI */}
                <div className="ml-auto flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title, host or date..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-56 pl-9 pr-3 py-2 text-[13px] border border-gray-200 rounded-xl outline-none focus:border-violet-300 focus:ring-1 focus:ring-violet-300 transition-all bg-white"
                        />
                    </div>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="text-[13px] border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 outline-none cursor-pointer focus:border-violet-300 transition-all font-medium"
                    >
                        <option value="date_desc">Newest first</option>
                        <option value="date_asc">Oldest first</option>
                    </select>
                </div>
            </div>

            {/* Collapsible Advanced Filters */}
            {showFilters && (
                <div className="flex flex-wrap items-center gap-4 px-5 py-3 bg-white border-b border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-2">
                        <span className="text-[12.5px] font-semibold text-gray-500">Date:</span>
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="text-[12.5px] border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-violet-300 bg-white text-gray-700"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[12.5px] font-semibold text-gray-500">Participant:</span>
                        <input
                            type="text"
                            placeholder="Name or ID"
                            value={participantFilter}
                            onChange={(e) => setParticipantFilter(e.target.value)}
                            className="text-[12.5px] border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-violet-300 bg-white text-gray-700 w-36"
                        />
                    </div>

                    <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
                        <button
                            onClick={() => setTimeRangeFilter(timeRangeFilter === "today" ? "" : "today")}
                            className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-all cursor-pointer ${
                                timeRangeFilter === "today"
                                    ? "bg-violet-600 border-violet-600 text-white shadow-sm"
                                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setTimeRangeFilter(timeRangeFilter === "this_week" ? "" : "this_week")}
                            className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-all cursor-pointer ${
                                timeRangeFilter === "this_week"
                                    ? "bg-violet-600 border-violet-600 text-white shadow-sm"
                                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            This Week
                        </button>
                    </div>

                    {(dateFilter || participantFilter || timeRangeFilter) && (
                        <button
                            onClick={() => {
                                setDateFilter("");
                                setParticipantFilter("");
                                setTimeRangeFilter("");
                            }}
                            className="text-[12.5px] font-semibold text-violet-600 hover:text-violet-700 cursor-pointer"
                        >
                            Reset filters
                        </button>
                    )}
                </div>
            )}

            {/* Main view container */}
            <div className="px-5 py-4 flex-1 flex flex-col min-h-0">
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 gap-2">
                        <Loader2 className="h-7 w-7 text-violet-600 animate-spin" />
                        <span className="text-[13px] font-medium text-gray-500">Fetching meetings...</span>
                    </div>
                ) : error ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
                        <AlertCircle className="h-9 w-9 text-red-500 mb-2" />
                        <p className="text-[14px] font-bold text-gray-800">Unable to load meetings</p>
                        <p className="text-[13px] text-gray-500 mt-1 max-w-md">{error}</p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setDateFilter("");
                                setParticipantFilter("");
                                setSortOrder("date_desc");
                            }}
                            className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-[13px] font-semibold shadow-sm transition-colors"
                        >
                            Retry & Clear Filters
                        </button>
                    </div>
                ) : groupedMeetings.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                            <SlidersHorizontal size={20} className="text-gray-400" />
                        </div>
                        <p className="text-[14px] font-bold text-gray-800">No meetings found</p>
                        <p className="text-[13px] text-gray-500 mt-1 max-w-sm">
                            Try adjusting your search criteria, clearing your filters, or upload a new meeting to get started.
                        </p>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setDateFilter("");
                                    setParticipantFilter("");
                                }}
                                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-[13px] font-semibold transition-colors"
                            >
                                Clear filters
                            </button>
                            <Link
                                href="/uploads"
                                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-[13px] font-semibold shadow-sm transition-colors"
                            >
                                Upload Meeting
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {groupedMeetings.map((group) => (
                            <div key={group.dateLabel}>
                                {/* Date row */}
                                <div className="flex items-center gap-3 mb-2 px-1">
                                    <input
                                        type="checkbox"
                                        checked={!!checkedAll[group.dateLabel]}
                                        onChange={(e) =>
                                            setCheckedAll((prev) => ({ ...prev, [group.dateLabel]: e.target.checked }))
                                        }
                                        className="w-4 h-4 rounded-md border-gray-300 text-violet-600 focus:ring-violet-500 accent-violet-600 cursor-pointer"
                                    />
                                    <span className="text-[13px] font-bold text-gray-600">{group.dateLabel}</span>
                                    <div className="ml-auto flex items-center gap-1 text-[12.5px] text-gray-400 hover:text-gray-600 cursor-pointer">
                                        <MessageCircle size={13} />
                                        <span>Feedback</span>
                                    </div>
                                </div>

                                {/* Meetings in group */}
                                <div className="flex flex-col gap-0 border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                                    {group.meetings.map((meeting, idx) => (
                                        <Link
                                            key={meeting.id}
                                            href={`/meetings/${meeting.id}`}
                                            className={`group flex items-center gap-4 px-4 py-4 hover:bg-violet-50/20 transition-all ${
                                                idx > 0 ? "border-t border-gray-100/80" : ""
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-4 h-4 rounded-md border-gray-300 text-violet-600 focus:ring-violet-500 accent-violet-600 cursor-pointer shrink-0"
                                            />
                                            {/* Avatar */}
                                            <div
                                                className={`w-9.5 h-9.5 rounded-xl ${getAvatarColor(
                                                    meeting.id
                                                )} flex items-center justify-center text-white font-bold text-[14px] shrink-0 shadow-sm`}
                                            >
                                                {meeting.title[0]?.toUpperCase() || "M"}
                                            </div>
                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[14.5px] font-semibold text-gray-800 truncate hover:text-violet-700 transition-colors">
                                                        {meeting.title}
                                                    </span>
                                                    <ChevronRight size={14} className="text-gray-400 shrink-0" />
                                                </div>
                                                <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[12.5px] text-gray-500">
                                                    <span>{formatMeetingShortDate(meeting.meeting_date)}</span>
                                                    <span className="text-gray-300">·</span>
                                                    <span>{formatMeetingTime(meeting.meeting_date)}</span>
                                                    <span className="text-gray-300">·</span>
                                                    <span>{Math.floor(meeting.duration_seconds / 60)} min</span>
                                                    {meeting.participants.length > 0 && (
                                                        <>
                                                            <span className="text-gray-300">·</span>
                                                            <span className="font-semibold text-violet-600/80 truncate max-w-[200px]">
                                                                {meeting.participants.slice(0, 2).join(", ")}
                                                                {meeting.participants.length > 2 ? ` +${meeting.participants.length - 2} others` : ""}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Delete meeting button */}
                                            <button
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    if (confirm(`Are you sure you want to delete "${meeting.title}"?`)) {
                                                        try {
                                                            const res = await fetch(`http://localhost:8000/meetings/${meeting.id}`, {
                                                                method: "DELETE"
                                                            });
                                                            if (res.ok) {
                                                                toast.success("Meeting deleted successfully");
                                                                setMeetings(prev => prev.filter(m => m.id !== meeting.id));
                                                            } else {
                                                                toast.error("Failed to delete meeting");
                                                            }
                                                        } catch (err) {
                                                            console.error(err);
                                                            toast.error("An error occurred while deleting meeting");
                                                        }
                                                    }
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50/50 transition-all cursor-pointer shrink-0"
                                                title="Delete meeting"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* End of list */}
                        <p className="text-center text-[13px] text-gray-400 py-6">
                            You&apos;ve reached the end of your meetings.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
