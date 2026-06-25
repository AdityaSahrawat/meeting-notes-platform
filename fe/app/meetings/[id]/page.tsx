"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getVideoFile } from "@/lib/db";
import {
    Menu,
    Search,
    MoreHorizontal,
    Share2,
    Plus,
    Bell,
    Maximize2,
    Copy,
    Video as VideoIcon,
    Star,
    ThumbsUp,
    ThumbsDown,
    Edit3,
    RotateCcw,
    RotateCw,
    Pause,
    Play,
    Upload,
    X,
    Loader2,
    AlertCircle,
    Bot,
    MessageSquare,
    Send,
    Trash2,
    Download
} from "lucide-react";
import { toast } from "sonner";

interface Participant {
    id: number;
    name: string;
}

interface TranscriptSegment {
    id: number;
    meeting_id: number;
    speaker: string;
    timestamp_seconds: number;
    content: string;
}

interface ActionItem {
    id: number;
    meeting_id: number;
    task: string;
    assignee: string;
    completed: boolean;
    created_at: string;
}

interface MeetingDetail {
    id: number;
    title: string;
    meeting_date: string;
    duration_seconds: number;
    summary: string | null;
    llm_summary: string | null;
    participants: Participant[];
    transcript: TranscriptSegment[];
    action_items: ActionItem[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function MeetingDetailPage() {
    const { id } = useParams();
    const router = useRouter();

    // API & Component States
    const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Edit Meeting Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editParticipantIds, setEditParticipantIds] = useState<number[]>([]);
    const [availableParticipants, setAvailableParticipants] = useState<Participant[]>([]);
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // Action Items Builders
    const [isAddingAction, setIsAddingAction] = useState(false);
    const [newActionTask, setNewActionTask] = useState("");
    const [newActionAssignee, setNewActionAssignee] = useState("");

    const [editingActionId, setEditingActionId] = useState<number | null>(null);
    const [editingActionTask, setEditingActionTask] = useState("");
    const [editingActionAssignee, setEditingActionAssignee] = useState("");

    // Auto-scroll scrollaway States
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
    const isProgrammaticScroll = useRef(false);

    const handleUserScroll = () => {
        if (isAutoScrollEnabled) {
            setIsAutoScrollEnabled(false);
        }
    };

    const handleContainerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.closest("button") || target.closest("input") || target.closest("a")) {
            return;
        }
        if (isAutoScrollEnabled) {
            setIsAutoScrollEnabled(false);
        }
    };

    // Download Modal States
    const [showDownloadModal, setShowDownloadModal] = useState(false);
    const [downloadTab, setDownloadTab] = useState<"transcript" | "summary" | "audio">("transcript");
    const [transcriptFormat, setTranscriptFormat] = useState<"PDF" | "DOCX" | "SRT" | "CSV" | "JSON" | "MD">("PDF");
    const [includeTimestamp, setIncludeTimestamp] = useState(true);
    const [showSpeakerName, setShowSpeakerName] = useState(true);
    const [removeBranding, setRemoveBranding] = useState(false);

    const handleDownload = () => {
        if (!meeting) return;

        let fileContent = "";
        let fileName = meeting.title.replace(/\s+/g, "_").toLowerCase();
        let mimeType = "text/plain";

        if (downloadTab === "transcript") {
            const formatSegments = () => {
                return meeting.transcript.map((seg) => {
                    let line = "";
                    if (includeTimestamp) {
                        line += `[${formatTime(seg.timestamp_seconds)}] `;
                    }
                    if (showSpeakerName) {
                        line += `${seg.speaker}: `;
                    }
                    line += seg.content;
                    return line;
                }).join("\n");
            };

            if (transcriptFormat === "JSON") {
                const dataStr = JSON.stringify(meeting.transcript, null, 2);
                fileContent = dataStr;
                fileName += "_transcript.json";
                mimeType = "application/json";
            } else if (transcriptFormat === "CSV") {
                let csv = "Timestamp,Speaker,Content\n";
                meeting.transcript.forEach((seg) => {
                    const contentEscaped = seg.content.replace(/"/g, '""');
                    csv += `"${formatTime(seg.timestamp_seconds)}","${seg.speaker}","${contentEscaped}"\n`;
                });
                fileContent = csv;
                fileName += "_transcript.csv";
                mimeType = "text/csv";
            } else if (transcriptFormat === "SRT") {
                let srt = "";
                meeting.transcript.forEach((seg, idx) => {
                    const formatSRTTime = (seconds: number) => {
                        const hrs = Math.floor(seconds / 3600);
                        const mins = Math.floor((seconds % 3600) / 60);
                        const secs = Math.floor(seconds % 60);
                        const ms = "000";
                        return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")},${ms}`;
                    };
                    const start = seg.timestamp_seconds;
                    const end = start + 4;
                    srt += `${idx + 1}\n${formatSRTTime(start)} --> ${formatSRTTime(end)}\n`;
                    if (showSpeakerName) srt += `${seg.speaker}: `;
                    srt += `${seg.content}\n\n`;
                });
                fileContent = srt;
                fileName += "_transcript.srt";
                mimeType = "text/srt";
            } else if (transcriptFormat === "MD") {
                fileContent = `# Transcript - ${meeting.title}\n\n`;
                if (!removeBranding) {
                    fileContent += `*Generated via fireflies.ai*\n\n`;
                }
                fileContent += formatSegments();
                fileName += "_transcript.md";
                mimeType = "text/markdown";
            } else {
                fileContent = `=== TRANSCRIPT: ${meeting.title} ===\n`;
                if (!removeBranding) {
                    fileContent += `Generated via fireflies.ai\n\n`;
                }
                fileContent += formatSegments();
                fileName += `_transcript.${transcriptFormat.toLowerCase()}`;
                mimeType = "application/octet-stream";
            }
        } else if (downloadTab === "summary") {
            const sumText = meeting.llm_summary || meeting.summary || "No summary available.";
            fileContent = `# Summary - ${meeting.title}\n\n${sumText}`;
            if (!removeBranding) {
                fileContent += `\n\n---\n*Generated via fireflies.ai*`;
            }
            fileName += "_summary.md";
            mimeType = "text/markdown";
        } else if (downloadTab === "audio") {
            if (videoSrc) {
                toast.success("Downloading cached audio/video file...");
                const a = document.createElement("a");
                a.href = videoSrc;
                a.download = videoFileName || `${fileName}.mp4`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                return;
            } else {
                toast.error("Audio recording file not loaded or cached locally.");
                return;
            }
        }

        const blob = new Blob([fileContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Download started successfully!");
    };

    // Fetch all participants for the edit modal
    const fetchAvailableParticipants = async () => {
        try {
            const res = await fetch(`${API_URL}/participants`);
            if (res.ok) {
                const data = await res.json();
                setAvailableParticipants(data);
            }
        } catch (err) {
            console.error("Failed to fetch participants:", err);
        }
    };

    // Open edit modal and load current values
    const openEditModal = () => {
        if (!meeting) return;
        setEditTitle(meeting.title);
        setEditParticipantIds(meeting.participants.map(p => p.id));
        fetchAvailableParticipants();
        setShowEditModal(true);
    };

    // Save edited meeting title and participants list
    const handleSaveMeetingEdit = async () => {
        if (!editTitle.trim()) {
            toast.error("Meeting title is required.");
            return;
        }
        setIsSavingEdit(true);
        try {
            const res = await fetch(`${API_URL}/meetings/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: editTitle.trim(),
                    participant_ids: editParticipantIds
                })
            });
            if (res.ok) {
                toast.success("Meeting updated successfully");
                setShowEditModal(false);
                fetchMeetingDetails(); // Refresh details
            } else {
                toast.error("Failed to update meeting");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred while updating meeting");
        } finally {
            setIsSavingEdit(false);
        }
    };

    // Delete meeting handler
    const handleDeleteMeeting = async () => {
        if (confirm(`Are you sure you want to delete this meeting: "${meeting?.title}"?`)) {
            try {
                const res = await fetch(`${API_URL}/meetings/${id}`, {
                    method: "DELETE"
                });
                if (res.ok) {
                    toast.success("Meeting deleted successfully");
                    router.push("/meetings");
                } else {
                    toast.error("Failed to delete meeting");
                }
            } catch (err) {
                console.error(err);
                toast.error("An error occurred while deleting meeting");
            }
        }
    };

    // Toggle action item completion status
    const handleToggleActionItem = async (actionId: number, completed: boolean) => {
        try {
            const res = await fetch(`${API_URL}/action-items/${actionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed })
            });
            if (res.ok) {
                toast.success(completed ? "Action item completed" : "Action item uncompleted");
                fetchMeetingDetails(); // refresh details
            } else {
                toast.error("Failed to update action item");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred updating action item");
        }
    };

    // Create a new action item
    const handleAddActionItem = async () => {
        if (!newActionTask.trim()) {
            toast.error("Task description is required");
            return;
        }
        try {
            const res = await fetch(`${API_URL}/meetings/${id}/action-items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    task: newActionTask.trim(),
                    assignee: newActionAssignee.trim() || "Unassigned",
                    completed: false
                })
            });
            if (res.ok) {
                toast.success("Action item added");
                setIsAddingAction(false);
                setNewActionTask("");
                setNewActionAssignee("");
                fetchMeetingDetails(); // refresh details
            } else {
                toast.error("Failed to create action item");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred creating action item");
        }
    };

    // Update action item details
    const handleUpdateActionItem = async (actionId: number) => {
        if (!editingActionTask.trim()) {
            toast.error("Task description is required");
            return;
        }
        try {
            const res = await fetch(`${API_URL}/action-items/${actionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    task: editingActionTask.trim(),
                    assignee: editingActionAssignee.trim() || "Unassigned"
                })
            });
            if (res.ok) {
                toast.success("Action item updated");
                setEditingActionId(null);
                fetchMeetingDetails(); // refresh details
            } else {
                toast.error("Failed to update action item");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred updating action item");
        }
    };

    // Delete action item
    const handleDeleteActionItem = async (actionId: number) => {
        if (confirm("Are you sure you want to delete this action item?")) {
            try {
                const res = await fetch(`${API_URL}/action-items/${actionId}`, {
                    method: "DELETE"
                });
                if (res.ok) {
                    toast.success("Action item deleted");
                    fetchMeetingDetails(); // refresh details
                } else {
                    toast.error("Failed to delete action item");
                }
            } catch (err) {
                console.error(err);
                toast.error("An error occurred deleting action item");
            }
        }
    };

    // Helper to highlight matching transcript text
    const highlightText = (text: string, search: string) => {
        if (!search.trim()) return text;
        const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, "gi");
        const parts = text.split(regex);
        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5 font-bold">
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    const isFallbackSummary = !meeting || !meeting.llm_summary ||
        meeting.llm_summary === "No summary provided." ||
        meeting.llm_summary.startsWith("Gemini Auto-Summary: (Error:") ||
        meeting.llm_summary === "Failed to parse summary content from Gemini response.";

    // Layout/tab States
    const [leftTab, setLeftTab] = useState<"notes" | "skills">("notes");
    const [rightTab, setRightTab] = useState<"fred" | "transcript">("transcript");
    const [transcriptSearch, setTranscriptSearch] = useState("");

    // Video Player & Time Synchronization State
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(1800); // fallback 30m
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);

    // MP4 File Sync state
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [videoFileName, setVideoFileName] = useState("");
    const [showVideo, setShowVideo] = useState(false);

    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const activeSegmentRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Ask Fred Query Panel State
    const [fredQuery, setFredQuery] = useState("");
    const [fredHistory, setFredHistory] = useState<Array<{ sender: "user" | "fred"; text: string; results?: TranscriptSegment[] }>>([
        { sender: "fred", text: "Hi! Ask me anything about this meeting, and I will search the transcript for you." }
    ]);
    const [fredLoading, setFredLoading] = useState(false);

    // Fetch full meeting details
    const fetchMeetingDetails = async () => {
        try {
            const res = await fetch(`${API_URL}/meetings/${id}`);
            if (!res.ok) throw new Error("Failed to load meeting details");
            const data = await res.json();
            setMeeting(data);
            if (data.duration_seconds) {
                setDuration(data.duration_seconds);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to load meeting.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchMeetingDetails();

            // Load video: try backend first, then fall back to IndexedDB
            const loadVideo = async () => {
                try {
                    // 1. Try backend endpoint
                    const backendUrl = `${API_URL}/meetings/${id}/video`;
                    const probe = await fetch(backendUrl, { method: "HEAD" }).catch(() => null);
                    if (probe && probe.ok) {
                        setVideoSrc(backendUrl);
                        setVideoFileName(`meeting_${id}.mp4`);
                        setShowVideo(true);
                        return;
                    }
                } catch {
                    // ignore — try IndexedDB
                }

                // 2. Fall back to IndexedDB cache
                try {
                    const cachedFile = await getVideoFile(Number(id));
                    if (cachedFile) {
                        setVideoFileName(cachedFile.name);
                        const url = URL.createObjectURL(cachedFile);
                        setVideoSrc(url);
                        setShowVideo(true);
                    }
                } catch (err) {
                    console.error("Error loading cached video from IndexedDB:", err);
                }
            };
            loadVideo();
        }
    }, [id]);

    // Handle play simulation when no real video file is loaded
    useEffect(() => {
        if (isPlaying && !videoSrc) {
            timerRef.current = setInterval(() => {
                setCurrentTime((prev) => {
                    if (prev >= duration) {
                        setIsPlaying(false);
                        return duration;
                    }
                    return prev + 1;
                });
            }, 1000 / playbackSpeed);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, playbackSpeed, videoSrc, duration]);

    // Handle dynamic scrolling of active transcript segment into view
    const activeSegmentId = (() => {
        if (!meeting || meeting.transcript.length === 0) return null;
        let activeId = meeting.transcript[0].id;
        let maxTime = -1;
        for (const seg of meeting.transcript) {
            if (seg.timestamp_seconds <= currentTime && seg.timestamp_seconds > maxTime) {
                maxTime = seg.timestamp_seconds;
                activeId = seg.id;
            }
        }
        return activeId;
    })();

    useEffect(() => {
        if (activeSegmentRef.current && isAutoScrollEnabled) {
            isProgrammaticScroll.current = true;
            activeSegmentRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            setTimeout(() => {
                isProgrammaticScroll.current = false;
            }, 1000);
        }
    }, [activeSegmentId, isAutoScrollEnabled]);

    // Format helpers
    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = Math.floor(totalSeconds % 60);
        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Playback control functions
    const togglePlay = () => {
        if (videoSrc && videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(e => console.error("Playback failed", e));
            }
        }
        setIsPlaying(!isPlaying);
    };

    const handleVideoPlay = () => setIsPlaying(true);
    const handleVideoPause = () => setIsPlaying(false);

    const togglePlaybackSpeed = () => {
        const speeds = [1, 1.25, 1.5, 2];
        const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
        const newSpeed = speeds[nextIdx];
        setPlaybackSpeed(newSpeed);
        if (videoRef.current) {
            videoRef.current.playbackRate = newSpeed;
        }
    };

    const skipBackward = () => {
        const newTime = Math.max(0, currentTime - 10);
        setCurrentTime(newTime);
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
    };

    const skipForward = () => {
        const newTime = Math.min(duration, currentTime + 10);
        setCurrentTime(newTime);
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
    };

    const seekTo = (seconds: number) => {
        setCurrentTime(seconds);
        if (videoRef.current) {
            videoRef.current.currentTime = seconds;
        }
    };

    // Progress bar click seeker
    const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        const newTime = Math.round(percentage * duration);
        seekTo(newTime);
    };

    // Handle local video selection
    const handleVideoFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFileName(file.name);
            const url = URL.createObjectURL(file);
            setVideoSrc(url);
            setShowVideo(true);
            setIsPlaying(false);
            setCurrentTime(0);
        }
    };

    // HTML5 Video Events
    const handleVideoTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleVideoLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    // Ask Fred Query Submission
    const handleAskFred = async (e: React.FormEvent) => {
        e.preventDefault();
        const query = fredQuery.trim();
        if (!query) return;

        setFredHistory((prev) => [...prev, { sender: "user", text: query }]);
        setFredQuery("");
        setFredLoading(true);

        try {
            const res = await fetch(`${API_URL}/meetings/${id}/transcript?search=${encodeURIComponent(query)}`);
            if (!res.ok) throw new Error("Fred query failed");

            const matches: TranscriptSegment[] = await res.json();

            if (matches.length > 0) {
                setFredHistory((prev) => [
                    ...prev,
                    {
                        sender: "fred",
                        text: `I found ${matches.length} matching segment(s) in this meeting transcript:`,
                        results: matches
                    }
                ]);
            } else {
                setFredHistory((prev) => [
                    ...prev,
                    {
                        sender: "fred",
                        text: `Sorry, I couldn't find any segments matching "${query}". Try searching for another keyword.`
                    }
                ]);
            }
        } catch (err) {
            setFredHistory((prev) => [
                ...prev,
                { sender: "fred", text: "Oops, something went wrong while searching the database. Please try again." }
            ]);
            console.error(err);
        } finally {
            setFredLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center bg-gray-50/50">
                <Loader2 className="h-8 w-8 text-violet-600 animate-spin mb-2" />
                <span className="text-[14px] font-medium text-gray-500">Loading meeting data...</span>
            </div>
        );
    }

    if (error || !meeting) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center bg-gray-50/50 px-4 text-center">
                <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                <h2 className="text-[16px] font-bold text-gray-800">Meeting Not Found</h2>
                <p className="text-[13.5px] text-gray-500 mt-1">
                    {error || "We couldn't retrieve the details for this meeting."}
                </p>
                <Link
                    href="/meetings"
                    className="mt-4 px-4.5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-[13.5px] font-semibold transition-colors shadow-sm"
                >
                    Back to Meetings
                </Link>
            </div>
        );
    }

    // Filter dynamic transcript text
    const filteredTranscript = meeting.transcript.filter(
        (seg) =>
            seg.content.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
            seg.speaker.toLowerCase().includes(transcriptSearch.toLowerCase())
    );

    return (
        <div className="z-30 relative mt-[-56px] flex-1 flex flex-col min-w-0 bg-white select-none overflow-hidden h-full">

            {/* Top Bar Header (Matches UI in Image) */}
            <header className="h-14 border-b border-gray-100 flex items-center justify-between px-5 shrink-0 bg-white">
                <div className="flex items-center gap-3">
                    <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
                        <Menu size={18} />
                    </button>
                    <button 
                        onClick={() => window.dispatchEvent(new Event("open-global-search"))}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        title="Search meetings"
                    >
                        <Search size={15} />
                    </button>
                    <div className="h-4 w-px bg-gray-200" />
                    <div className="flex items-center gap-1 text-[13.5px] font-medium text-gray-500">
                        <Link href="/meetings" className="hover:text-gray-800 transition-colors">#My Meetings</Link>
                        <span>/</span>
                        <span className="text-gray-800 font-semibold">{meeting.title}</span>
                        <button className="text-gray-400 hover:text-gray-600 ml-1">
                            <MoreHorizontal size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/upgrade"
                        className="text-[13px] font-semibold text-green-600 border border-green-200 rounded-lg px-3 py-1 hover:bg-green-50/50 transition-colors bg-white shadow-sm"
                    >
                        Upgrade
                    </Link>
                    <div className="h-4 w-px bg-gray-200" />

                    {/* Slack logo mock */}
                    <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-[13px]">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M3.6 10.4a1.2 1.2 0 1 1-1.2-1.2H3.6v1.2zm.6 0a1.2 1.2 0 0 1 2.4 0v3a1.2 1.2 0 0 1-2.4 0v-3z" fill="#E01E5A" />
                            <path d="M5.6 3.6a1.2 1.2 0 1 1 1.2-1.2V3.6H5.6zm0 .6a1.2 1.2 0 0 1 0 2.4H2.6a1.2 1.2 0 0 1 0-2.4h3z" fill="#36C5F0" />
                            <path d="M12.4 5.6a1.2 1.2 0 1 1 1.2 1.2H12.4V5.6zm-.6 0a1.2 1.2 0 0 1-2.4 0v-3a1.2 1.2 0 0 1 2.4 0v3z" fill="#2EB67D" />
                            <path d="M10.4 12.4a1.2 1.2 0 1 1-1.2 1.2V12.4h1.2zm0-.6a1.2 1.2 0 0 1 0-2.4h3a1.2 1.2 0 0 1 0 2.4h-3z" fill="#ECB22E" />
                        </svg>
                        <ChevronDownIcon />
                    </button>

                    <button
                        onClick={openEditModal}
                        className="flex items-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[13px] font-semibold px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
                    >
                        <Edit3 size={13} />
                        <span>Edit</span>
                    </button>

                    <button
                        onClick={handleDeleteMeeting}
                        className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-[13px] font-semibold px-3 py-1.5 rounded-lg border border-red-200 shadow-sm cursor-pointer"
                    >
                        <Trash2 size={13} />
                        <span>Delete</span>
                    </button>

                    <button className="flex items-center gap-1 bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold px-3 py-1.5 rounded-lg shadow-sm">
                        <Share2 size={13} />
                        <span>Share</span>
                    </button>

                    <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                        <Plus size={15} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600">
                        <Bell size={16} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-[13px] font-bold shadow-sm">
                        A
                    </div>
                </div>
            </header>

            {/* Main Content Workspace Layout (Split Panel) */}
            <div className="flex-1 flex min-h-0 overflow-hidden relative">

                {/* Left Panel: Hardcoded Notes & Summary exactly like the Image */}
                <section className="w-1/2 border-r border-gray-100 flex flex-col min-h-0 bg-white">
                    {/* Notes tab bar row */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                        <div className="flex bg-gray-100 rounded-lg p-0.5 text-[12.5px] font-semibold text-gray-500">
                            <button
                                onClick={() => setLeftTab("notes")}
                                className={`px-4.5 py-1 rounded-md transition-all ${leftTab === "notes" ? "bg-white text-gray-800 shadow-sm font-bold" : "hover:text-gray-800"
                                    }`}
                            >
                                Notes
                            </button>
                            <button
                                onClick={() => setLeftTab("skills")}
                                className={`px-4.5 py-1 rounded-md transition-all ${leftTab === "skills" ? "bg-white text-gray-800 shadow-sm font-bold" : "hover:text-gray-800"
                                    }`}
                            >
                                AI Skills · 0
                            </button>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                            <Maximize2 size={14} />
                        </button>
                    </div>

                    {/* Left Pane scroll content */}
                    <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-5">

                        {/* Title */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-[20px] font-bold text-gray-900 leading-tight">
                                {meeting.title}
                            </h2>

                            {/* Dynamic Attendees and Metadata Row */}
                            <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-gray-500 font-medium">
                                {meeting.participants.length > 0 && (
                                    <>
                                        <span className="font-bold text-gray-700">Attendees:</span>
                                        <span className="text-violet-600 font-semibold">
                                            {meeting.participants.map(p => p.name).join(", ")}
                                        </span>
                                        <span className="text-gray-300">·</span>
                                    </>
                                )}
                                <span>{new Date(meeting.meeting_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                <span className="text-gray-300">·</span>
                                <span>{formatTime(duration)} duration</span>
                            </div>
                        </div>

                        {/* General Summary toggle block */}
                        <div className="flex items-center gap-2.5 text-gray-500 text-[13px] border-b border-gray-100 pb-3 mt-1.5 font-medium">
                            <span className="flex items-center gap-1 text-[13.5px]">
                                ✦ General Summary
                            </span>
                            <button
                                onClick={() => {
                                    const summaryText = isFallbackSummary ?
                                        "The team decided to build a backend chat application focused on API development and modular code, targeting core messaging functionalities with future frontend integration." :
                                        meeting?.llm_summary;
                                    if (summaryText) {
                                        navigator.clipboard.writeText(summaryText);
                                    }
                                }}
                                className="text-gray-400 hover:text-gray-600 active:text-violet-600 transition-colors"
                                title="Copy summary"
                            >
                                <Copy size={13} />
                            </button>
                        </div>

                        {/* Summary & Notes Section (Render hardcoded matching image or dynamic summary) */}
                        <div className="prose prose-sm max-w-none text-gray-700 flex flex-col gap-4 leading-relaxed">
                            <div>
                                <h3 className="text-[15px] font-bold text-gray-900 mb-2">Notes</h3>
                                {isFallbackSummary ? (
                                    <>
                                        <h4 className="text-[13.5px] font-bold text-gray-800 mb-1">Project Scope and Core Features</h4>

                                        {/* Hardcoded 3-4 line summary with interactive timestamp link */}
                                        <p className="text-[13px] leading-relaxed text-gray-600 mb-3">
                                            The team decided to build a backend chat application focused on API development and modular code, targeting core messaging functionalities with future frontend integration (
                                            <button
                                                onClick={() => seekTo(222)} // 03:42 -> 3 * 60 + 42 = 222s
                                                className="text-violet-600 font-semibold underline hover:text-violet-800"
                                            >
                                                03:42
                                            </button>
                                            ).
                                        </p>

                                        {/* Bullet points */}
                                        <ul className="list-disc pl-4 text-[13px] text-gray-600 flex flex-col gap-2.5">
                                            <li>
                                                The project will cover essential backend topics including <strong className="text-gray-800">Express.js, Postgres database</strong> with indexing, transactions, and <strong className="text-gray-800">query optimizations</strong>, and AWS S3 operations simulated via a local stack container to avoid cloud costs during development.
                                            </li>
                                            <li>
                                                Key chat features include real-time messaging via sockets, attachments (documents/images/audio) leveraging blob storage, end-to-end encryption, rate limiting, pagination, caching, and queues, ensuring a full-stack backend experience.
                                            </li>
                                        </ul>
                                    </>
                                ) : (
                                    <>
                                        <h4 className="text-[13.5px] font-bold text-gray-800 mb-2 text-violet-600/90 flex items-center gap-1">
                                            ✦ AI Executive Summary
                                        </h4>
                                        <div className="text-[13px] leading-relaxed text-gray-600 mb-3 whitespace-pre-wrap bg-violet-50/40 border border-violet-100/50 rounded-xl p-4 shadow-sm">
                                            {meeting.llm_summary}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Action Items Checklist Section */}
                        <div className="mt-6 border-t border-gray-100 pt-5">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-[15px] font-bold text-gray-900 flex items-center gap-1.5">
                                    ✦ Action Items
                                </h3>
                                <button
                                    onClick={() => setIsAddingAction(true)}
                                    className="text-[12px] font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1 cursor-pointer"
                                >
                                    <Plus size={13} />
                                    <span>Add Action Item</span>
                                </button>
                            </div>

                            {/* Inline Add Action Item Form */}
                            {isAddingAction && (
                                <div className="bg-gray-50 border border-gray-150 rounded-xl p-3.5 mb-4 flex flex-col gap-3">
                                    <h4 className="text-[12.5px] font-bold text-gray-800">New Action Item</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Task description..."
                                            value={newActionTask}
                                            onChange={(e) => setNewActionTask(e.target.value)}
                                            className="text-[12.5px] border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-violet-300 bg-white"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Assignee (e.g. Rahul)..."
                                            value={newActionAssignee}
                                            onChange={(e) => setNewActionAssignee(e.target.value)}
                                            className="text-[12.5px] border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-violet-300 bg-white"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2.5">
                                        <button
                                            onClick={() => {
                                                setIsAddingAction(false);
                                                setNewActionTask("");
                                                setNewActionAssignee("");
                                            }}
                                            className="px-3 py-1.5 text-[12px] font-semibold border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddActionItem}
                                            className="px-3 py-1.5 text-[12px] font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-lg cursor-pointer"
                                        >
                                            Create
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Action items list */}
                            <div className="flex flex-col gap-2.5">
                                {meeting.action_items.length === 0 ? (
                                    <p className="text-[12.5px] text-gray-400 italic">No action items created yet.</p>
                                ) : (
                                    meeting.action_items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start justify-between gap-3 p-2.5 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition-all"
                                        >
                                            {editingActionId === item.id ? (
                                                /* Inline Edit Form */
                                                <div className="flex-1 flex flex-col gap-2.5">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        <input
                                                            type="text"
                                                            value={editingActionTask}
                                                            onChange={(e) => setEditingActionTask(e.target.value)}
                                                            className="text-[12.5px] border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-violet-300 bg-white"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={editingActionAssignee}
                                                            onChange={(e) => setEditingActionAssignee(e.target.value)}
                                                            className="text-[12.5px] border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-violet-300 bg-white"
                                                        />
                                                    </div>
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => setEditingActionId(null)}
                                                            className="px-2 py-1 text-[11.5px] font-semibold border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 cursor-pointer"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateActionItem(item.id)}
                                                            className="px-2 py-1 text-[11.5px] font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-md cursor-pointer"
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* Read view & checkbox toggle */
                                                <>
                                                    <div className="flex items-start gap-2.5">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.completed}
                                                            onChange={() => handleToggleActionItem(item.id, !item.completed)}
                                                            className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 accent-violet-600 cursor-pointer mt-0.5 shrink-0"
                                                        />
                                                        <div className="flex flex-col gap-0.5 text-[12.8px]">
                                                            <span className={`${item.completed ? "line-through text-gray-400 font-medium" : "text-gray-700 font-semibold"}`}>
                                                                {item.task}
                                                            </span>
                                                            <span className="text-[11.5px] text-gray-500 font-medium">
                                                                Assignee: <strong className="text-violet-600 font-semibold">{item.assignee}</strong>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-gray-400 shrink-0">
                                                        <button
                                                            onClick={() => {
                                                                setEditingActionId(item.id);
                                                                setEditingActionTask(item.task);
                                                                setEditingActionAssignee(item.assignee);
                                                            }}
                                                            className="hover:text-violet-600 transition-colors p-1 cursor-pointer"
                                                            title="Edit action item"
                                                        >
                                                            <Edit3 size={13} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteActionItem(item.id)}
                                                            className="hover:text-red-500 transition-colors p-1 cursor-pointer"
                                                            title="Delete action item"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </section>

                {/* Right Panel: AskFred & Transcript layouts */}
                <section className="w-1/2 flex flex-col min-h-0 bg-white">
                    {/* Tab Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                        <div className="flex gap-4.5 text-[14.5px] font-bold text-gray-400">
                            <button
                                onClick={() => setRightTab("fred")}
                                className={`pb-1 transition-all ${rightTab === "fred" ? "text-violet-600 border-b-2 border-violet-600" : "hover:text-gray-600"
                                    }`}
                            >
                                AskFred
                            </button>
                            <button
                                onClick={() => setRightTab("transcript")}
                                className={`pb-1 transition-all ${rightTab === "transcript" ? "text-violet-600 border-b-2 border-violet-600" : "hover:text-gray-600"
                                    }`}
                            >
                                Transcript
                            </button>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                            <Maximize2 size={14} />
                        </button>
                    </div>

                    {/* Tab Content Display */}
                    {rightTab === "transcript" ? (
                        /* Transcript Tab view */
                        <div className="flex-1 flex flex-col min-h-0 bg-white relative">
                            {/* Search Input bar */}
                            <div className="p-3 border-b border-gray-50 flex items-center shrink-0">
                                <div className="relative flex-1">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Find or Replace"
                                        value={transcriptSearch}
                                        onChange={(e) => setTranscriptSearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-1.5 text-[13px] border border-gray-200 rounded-lg outline-none focus:border-violet-300 transition-all bg-gray-50/20"
                                    />
                                </div>
                            </div>

                            {/* Transcript list */}
                            <div
                                onScroll={() => {
                                    if (!isProgrammaticScroll.current) {
                                        setIsAutoScrollEnabled(false);
                                    }
                                }}
                                onWheel={handleUserScroll}
                                onTouchMove={handleUserScroll}
                                onMouseDown={handleContainerMouseDown}
                                className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
                            >
                                {filteredTranscript.length === 0 ? (
                                    <div className="flex-grow flex flex-col items-center justify-center py-12 text-center text-gray-400">
                                        <AlertCircle size={22} className="text-gray-300 mb-1" />
                                        <p className="text-[13px] font-medium">No transcript dialogues found.</p>
                                    </div>
                                ) : (
                                    filteredTranscript.map((seg) => {
                                        const isActive = activeSegmentId === seg.id;
                                        return (
                                            <div
                                                key={seg.id}
                                                ref={isActive ? activeSegmentRef : null}
                                                className={`flex items-start gap-3.5 p-1 rounded-lg transition-all ${isActive ? "bg-violet-50/30" : ""
                                                    }`}
                                            >
                                                {/* Initial Circle Avatar */}
                                                <div className="w-7.5 h-7.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[12px] font-bold shadow-sm shrink-0">
                                                    {seg.speaker[0]?.toUpperCase() || "C"}
                                                </div>

                                                {/* Text block */}
                                                <div className="min-w-0 flex-1 text-[13px]">
                                                    <div className="flex items-center gap-1.5 font-medium text-gray-500">
                                                        <span className="font-bold text-gray-800">{seg.speaker}</span>
                                                        <span>·</span>
                                                        <button
                                                            onClick={() => seekTo(seg.timestamp_seconds)}
                                                            className="underline hover:text-violet-700 transition-colors hover:cursor-pointer"
                                                        >
                                                            {formatTime(seg.timestamp_seconds)}
                                                        </button>
                                                    </div>

                                                    {/* Dialogue text highlighted pink if active to match screenshot */}
                                                    <p className={`mt-0.5 leading-relaxed ${isActive
                                                        ? "text-pink-600 font-semibold"
                                                        : "text-gray-700"
                                                        }`}>
                                                        {highlightText(seg.content, transcriptSearch)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Sync with audio button */}
                            {!isAutoScrollEnabled && (
                                <button
                                    onClick={() => {
                                        setIsAutoScrollEnabled(true);
                                    }}
                                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-violet-600 hover:bg-violet-700 text-white text-[12px] font-bold px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer z-10 animate-bounce"
                                >
                                    <Bot size={13} />
                                    <span>Sync with audio</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        /* Ask Fred AI tab view */
                        <div className="flex-1 flex flex-col min-h-0 bg-white">
                            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
                                {fredHistory.map((h, i) => (
                                    <div key={i} className={`flex flex-col gap-1.5 ${h.sender === "user" ? "items-end" : "items-start"}`}>
                                        <div className={`max-w-[85%] rounded-xl px-3 py-2 text-[13px] ${h.sender === "user"
                                            ? "bg-violet-600 text-white font-medium shadow-sm"
                                            : "bg-gray-100 text-gray-700 leading-relaxed"
                                            }`}>
                                            {h.text}
                                        </div>

                                        {h.results && h.results.length > 0 && (
                                            <div className="w-full flex flex-col gap-2 mt-1 bg-gray-50 rounded-xl p-2.5 border border-gray-200/60 max-h-[220px] overflow-y-auto">
                                                {h.results.map((res) => (
                                                    <div
                                                        key={res.id}
                                                        className="bg-white border border-gray-150 p-2 rounded-lg text-[12px] hover:border-violet-200 transition-colors cursor-pointer"
                                                        onClick={() => seekTo(res.timestamp_seconds)}
                                                    >
                                                        <div className="flex items-center gap-1.5 mb-1 font-bold text-gray-800">
                                                            <span>{res.speaker}</span>
                                                            <span className="text-[10px] text-gray-400 font-semibold">
                                                                {formatTime(res.timestamp_seconds)}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 leading-relaxed">{res.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {fredLoading && (
                                    <div className="flex items-center gap-1.5 text-gray-400 text-[12.5px] px-1 animate-pulse">
                                        <Loader2 size={13} className="animate-spin" />
                                        <span>Fred is searching the transcript...</span>
                                    </div>
                                )}
                            </div>

                            {/* Ask Fred input */}
                            <form onSubmit={handleAskFred} className="border-t border-gray-100 p-3 bg-white">
                                <div className="flex items-center gap-2 border border-gray-200 focus-within:border-violet-400 rounded-xl px-3 py-2 bg-white">
                                    <input
                                        type="text"
                                        value={fredQuery}
                                        onChange={(e) => setFredQuery(e.target.value)}
                                        placeholder="Ask Fred anything..."
                                        className="flex-1 text-[13px] bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!fredQuery.trim() || fredLoading}
                                        className="p-1.5 rounded-lg bg-violet-600 text-white disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                                    >
                                        <Send size={13} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </section>
            </div>

            {/* Hidden video element for background audio playback and sync */}
            {videoSrc && (
                <video
                    ref={videoRef}
                    src={videoSrc}
                    className="hidden"
                    onTimeUpdate={handleVideoTimeUpdate}
                    onLoadedMetadata={handleVideoLoadedMetadata}
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                />
            )}

            {/* Bottom Playback Control bar (exactly matches UI in Image) */}
            <div className="bg-white border-t border-gray-100 py-3.5 px-6 shrink-0 relative flex flex-col z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">

                {/* Horizontal seeks/progress bar above controls */}
                <div
                    onClick={handleProgressBarClick}
                    className="absolute top-0 left-0 right-0 h-1 bg-gray-100 cursor-pointer group"
                >
                    <div
                        className="h-full bg-violet-600 transition-all duration-100 relative"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    >
                        {/* Circle scrubber node visible on hover */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-violet-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>

                {/* Sub controls details */}
                <div className="flex items-center justify-between mt-2">

                    {/* Time display: current / total */}
                    <div className="text-[12.5px] font-bold text-gray-500">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>

                    {/* Center actions with shortcut indicators */}
                    <div className="flex flex-col items-center relative">
                        {/* Play and Space keyboard badges */}
                        <div className="absolute -top-7.5 flex items-center gap-1.5 opacity-90 scale-90">
                            <span className="bg-gray-100 border border-gray-200 text-gray-500 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm">Play</span>
                            <span className="bg-gray-100 border border-gray-200 text-gray-500 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm">Space</span>
                        </div>

                        {/* Action buttons bar */}
                        <div className="flex items-center gap-5 mt-1.5">
                            <button
                                onClick={togglePlaybackSpeed}
                                className="text-[12.5px] font-bold text-gray-500 hover:text-gray-800 transition-colors w-8 text-center"
                                title="Playback Speed"
                            >
                                {playbackSpeed}x
                            </button>
                            <button
                                onClick={skipBackward}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                title="Rewind 10s"
                            >
                                <RotateCcw size={16} />
                            </button>
                            <button
                                onClick={togglePlay}
                                className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 shadow-md hover:scale-105 active:scale-95 transition-all"
                                title={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-0.5" />}
                            </button>

                            <button
                                onClick={skipForward}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                title="Fast forward 10s"
                            >
                                <RotateCw size={16} />
                            </button>

                            {/* Local Video selector icon */}
                            <button
                                onClick={() => setShowDownloadModal(true)}
                                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-violet-600 hover:border-violet-200 bg-white hover:bg-violet-50/30 transition-all cursor-pointer shrink-0 shadow-sm"
                                title="Download Meeting"
                            >
                                <Download size={15} />
                            </button>
                        </div>
                    </div>

                    {/* Right feedback actions */}
                    <div className="flex items-center gap-4 text-gray-400">
                        <button className="hover:text-gray-600"><Star size={16} /></button>
                        <button
                            onClick={openEditModal}
                            className="hover:text-violet-600 transition-colors cursor-pointer"
                            title="Edit meeting details"
                        >
                            <Edit3 size={16} />
                        </button>
                        <button className="hover:text-gray-600"><ThumbsUp size={16} /></button>
                        <button className="hover:text-gray-600"><ThumbsDown size={16} /></button>
                    </div>

                </div>

            </div>

            {/* Edit Meeting Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white border border-gray-150 rounded-2xl w-full max-w-[500px] p-6 shadow-xl flex flex-col gap-5 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowEditModal(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div>
                            <h2 className="text-[17px] font-bold text-gray-900">Edit Meeting Details</h2>
                            <p className="text-[12.5px] text-gray-500 mt-0.5">Update meeting title and manage attendees.</p>
                        </div>

                        {/* Title input */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-bold text-gray-700">Meeting Title</label>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="text-[13px] border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-violet-300 bg-white"
                                placeholder="Enter meeting title..."
                            />
                        </div>

                        {/* Participants selection */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-bold text-gray-700">Attendees</label>
                            <div className="border border-gray-150 rounded-xl max-h-[160px] overflow-y-auto p-3 flex flex-col gap-2.5 bg-gray-50/20">
                                {availableParticipants.map((p) => {
                                    const isChecked = editParticipantIds.includes(p.id);
                                    return (
                                        <label key={p.id} className="flex items-center gap-2.5 text-[13px] text-gray-700 font-medium cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => {
                                                    if (isChecked) {
                                                        setEditParticipantIds(prev => prev.filter(id => id !== p.id));
                                                    } else {
                                                        setEditParticipantIds(prev => [...prev, p.id]);
                                                    }
                                                }}
                                                className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 accent-violet-600 cursor-pointer"
                                            />
                                            <span>{p.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveMeetingEdit}
                                disabled={isSavingEdit}
                                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white rounded-xl text-[13px] font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                                {isSavingEdit && <Loader2 size={13} className="animate-spin" />}
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Download Meeting Modal */}
            {showDownloadModal && (
                <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white border border-gray-150 rounded-2xl w-full max-w-[480px] p-6 shadow-xl flex flex-col gap-5 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowDownloadModal(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div>
                            <h2 className="text-[17px] font-bold text-gray-900">Download Meeting</h2>
                        </div>

                        {/* Tabs Row */}
                        <div className="flex border-b border-gray-100 text-[13.5px] font-bold text-gray-400 gap-6">
                            <button
                                onClick={() => setDownloadTab("transcript")}
                                className={`pb-2.5 transition-all relative cursor-pointer ${downloadTab === "transcript" ? "text-violet-600 border-b-2 border-violet-600 font-bold" : "hover:text-gray-600"
                                    }`}
                            >
                                Transcript
                            </button>
                            <button
                                onClick={() => setDownloadTab("summary")}
                                className={`pb-2.5 transition-all relative cursor-pointer ${downloadTab === "summary" ? "text-violet-600 border-b-2 border-violet-600 font-bold" : "hover:text-gray-600"
                                    }`}
                            >
                                Summary
                            </button>
                            <button
                                onClick={() => setDownloadTab("audio")}
                                className={`pb-2.5 transition-all relative cursor-pointer ${downloadTab === "audio" ? "text-violet-600 border-b-2 border-violet-600 font-bold" : "hover:text-gray-600"
                                    }`}
                            >
                                Audio
                            </button>
                        </div>

                        {/* Content area based on tab */}
                        {downloadTab === "transcript" && (
                            <div className="flex flex-col gap-4">
                                {/* Format selection grid */}
                                <div className="grid grid-cols-6 gap-2">
                                    {(["PDF", "DOCX", "SRT", "CSV", "JSON", "MD"] as const).map((format) => (
                                        <button
                                            key={format}
                                            onClick={() => setTranscriptFormat(format)}
                                            className={`py-2 text-[12px] font-bold rounded-lg border transition-all cursor-pointer ${transcriptFormat === format
                                                ? "bg-violet-50/60 border-violet-600 text-violet-700 shadow-sm"
                                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            {format}
                                        </button>
                                    ))}
                                </div>

                                {/* Checkboxes options list */}
                                <div className="flex flex-col gap-3.5 mt-2">
                                    <label className="flex items-center gap-3 text-[13px] text-gray-700 font-medium cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={includeTimestamp}
                                            onChange={(e) => setIncludeTimestamp(e.target.checked)}
                                            className="w-4.5 h-4.5 rounded border-gray-300 text-violet-600 focus:ring-violet-500 accent-violet-600 cursor-pointer"
                                        />
                                        <span>Include timestamp</span>
                                    </label>
                                    <label className="flex items-center gap-3 text-[13px] text-gray-700 font-medium cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showSpeakerName}
                                            onChange={(e) => setShowSpeakerName(e.target.checked)}
                                            className="w-4.5 h-4.5 rounded border-gray-300 text-violet-600 focus:ring-violet-500 accent-violet-600 cursor-pointer"
                                        />
                                        <span>Show speaker name</span>
                                    </label>
                                    <label className="flex items-center gap-3 text-[13px] text-gray-700 font-medium cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={removeBranding}
                                            onChange={(e) => setRemoveBranding(e.target.checked)}
                                            className="w-4.5 h-4.5 rounded border-gray-300 text-violet-600 focus:ring-violet-500 accent-violet-600 cursor-pointer"
                                        />
                                        <span>Remove Fireflies Branding</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {downloadTab === "summary" && (
                            <div className="py-2 text-[13px] text-gray-500 flex flex-col gap-2.5">
                                <p>Download the dynamic meeting overview summary and outline notes as a markdown file.</p>
                                <label className="flex items-center gap-3 text-[13px] text-gray-700 font-medium cursor-pointer mt-1">
                                    <input
                                        type="checkbox"
                                        checked={removeBranding}
                                        onChange={(e) => setRemoveBranding(e.target.checked)}
                                        className="w-4.5 h-4.5 rounded border-gray-300 text-violet-600 focus:ring-violet-500 accent-violet-600 cursor-pointer"
                                    />
                                    <span>Remove Fireflies Branding</span>
                                </label>
                            </div>
                        )}

                        {downloadTab === "audio" && (
                            <div className="py-2 text-[13px] text-gray-500 flex flex-col gap-2">
                                <p>Download the local MP4 meeting audio/video recording file cached in your browser storage.</p>
                                {videoSrc ? (
                                    <span className="text-[12px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5 self-start mt-2">
                                        ✓ Recording cached and ready: {videoFileName}
                                    </span>
                                ) : (
                                    <span className="text-[12px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-1.5 self-start mt-2">
                                        ⚠ No recording cached for this meeting. Load an MP4 file in the playbar.
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end border-t border-gray-100 pt-4 mt-2">
                            <button
                                onClick={handleDownload}
                                className="px-5 py-2.5 bg-[#eae6ff] hover:bg-violet-600 text-violet-700 hover:text-white rounded-lg text-[13px] font-bold transition-all duration-150 cursor-pointer shadow-sm active:scale-95"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Inline helper for top bar dropdown arrow
function ChevronDownIcon() {
    return (
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-gray-400">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
