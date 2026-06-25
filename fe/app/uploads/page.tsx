"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { saveVideoFile } from "@/lib/db";
import {
    Upload,
    Video,
    Calendar,
    FileText,
    Users,
    Plus,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Check,
    ArrowRight
} from "lucide-react";

interface Participant {
    id: number;
    name: string;
    email: string | null;
}

interface NewActionItem {
    task: string;
    assignee: string;
}

export default function UploadPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form inputs
    const [title, setTitle] = useState("");
    const [meetingDate, setMeetingDate] = useState("");
    const [summary, setSummary] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoDuration, setVideoDuration] = useState<number>(0);
    const [transcriptText, setTranscriptText] = useState("");
    
    // Action Items Builder
    const [actionItems, setActionItems] = useState<NewActionItem[]>([]);
    const [newActionTask, setNewActionTask] = useState("");
    const [newActionAssignee, setNewActionAssignee] = useState("");

    // Upload process states
    const [uploading, setUploading] = useState(false);
    const [uploadStep, setUploadStep] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [validated, setValidated] = useState(false);

    // Default meeting date to current local date/time
    useEffect(() => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);
        setMeetingDate(localISOTime);
    }, []);

    // Handle MP4 File Selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            // Default title to filename if not set
            if (!title) {
                const cleanName = file.name.replace(/\.[^/.]+$/, ""); // remove extension
                setTitle(cleanName);
            }

            // Calculate duration in background
            const videoElement = document.createElement("video");
            videoElement.preload = "metadata";
            videoElement.src = URL.createObjectURL(file);
            videoElement.onloadedmetadata = () => {
                setVideoDuration(Math.round(videoElement.duration));
                URL.revokeObjectURL(videoElement.src);
            };
        }
    };



    // Add action item to checklist builder
    const handleAddAction = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!newActionTask.trim()) return;

        setActionItems((prev) => [
            ...prev,
            {
                task: newActionTask.trim(),
                assignee: newActionAssignee.trim() || "Unassigned"
            }
        ]);
        setNewActionTask("");
        setNewActionAssignee("");
    };

    // Remove action item from builder list
    const handleRemoveAction = (index: number) => {
        setActionItems((prev) => prev.filter((_, i) => i !== index));
    };

    // Parse pasted transcript
    const parseTranscript = (text: string) => {
        const lines = text.split("\n").map((l) => l.trim()).filter((l) => l !== "");
        const segments = [];

        // Groups of 3 lines: Timestamp (MM:SS), Speaker Name, Dialogue Content
        for (let i = 0; i < lines.length; i += 3) {
            if (i + 2 >= lines.length) break; // incomplete chunk

            const rawTimestamp = lines[i];
            const speaker = lines[i + 1];
            const content = lines[i + 2];

            // Clean brackets from timestamp (e.g. [00:00:03] -> 00:00:03)
            const cleanTimestamp = rawTimestamp.replace(/[\[\]]/g, "").trim();

            // Convert MM:SS or HH:MM:SS to seconds
            let seconds = 0;
            const tsParts = cleanTimestamp.split(":");
            if (tsParts.length === 2) {
                const mins = parseInt(tsParts[0], 10) || 0;
                const secs = parseInt(tsParts[1], 10) || 0;
                seconds = mins * 60 + secs;
            } else if (tsParts.length === 3) {
                const hrs = parseInt(tsParts[0], 10) || 0;
                const mins = parseInt(tsParts[1], 10) || 0;
                const secs = parseInt(tsParts[2], 10) || 0;
                seconds = hrs * 3600 + mins * 60 + secs;
            } else {
                seconds = parseInt(cleanTimestamp, 10) || 0;
            }

            segments.push({
                speaker,
                timestamp_seconds: seconds,
                content
            });
        }
        return segments;
    };

    // Submit form handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setValidated(true);

        // Validation
        if (!title.trim() || !meetingDate || !transcriptText.trim()) {
            setError("Please fill out all required fields marked in red.");
            return;
        }

        const segments = parseTranscript(transcriptText);
        if (segments.length === 0) {
            setError("Transcript could not be parsed. Please verify the speaker and text formats.");
            return;
        }

        setUploading(true);
        setUploadStep("Extracting attendees from transcript speakers...");

        try {
            // Extract unique speakers from transcript
            const uniqueSpeakerNames = Array.from(new Set(segments.map(s => s.speaker.trim()))).filter(Boolean);

            // Fetch existing participants list
            const participantsRes = await fetch("http://localhost:8000/participants");
            let existingParticipants: Participant[] = [];
            if (participantsRes.ok) {
                existingParticipants = await participantsRes.json();
            }

            const participantIds: number[] = [];

            // Find or create participant IDs
            for (const speakerName of uniqueSpeakerNames) {
                const existing = existingParticipants.find(
                    (p) => p.name.toLowerCase() === speakerName.toLowerCase()
                );

                if (existing) {
                    participantIds.push(existing.id);
                } else {
                    setUploadStep(`Registering new attendee: ${speakerName}...`);
                    const createRes = await fetch("http://localhost:8000/participants", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: speakerName })
                    });
                    if (!createRes.ok) {
                        throw new Error(`Failed to register participant: ${speakerName}`);
                    }
                    const created = await createRes.json();
                    participantIds.push(created.id);
                }
            }

            setUploadStep("Creating meeting metadata...");
            // If no video was uploaded, try to calculate duration based on the last segment timestamp + 10s
            const duration = videoDuration || (segments[segments.length - 1]?.timestamp_seconds + 10) || 1800;
            
            const meetingPayload = {
                title: title.trim(),
                meeting_date: new Date(meetingDate).toISOString(),
                duration_seconds: duration,
                summary: summary.trim() || "No summary provided.",
                participant_ids: participantIds
            };

            const meetingRes = await fetch("http://localhost:8000/meetings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(meetingPayload)
            });

            if (!meetingRes.ok) {
                const errData = await meetingRes.json();
                throw new Error(errData.detail || "Failed to create meeting metadata.");
            }

            const createdMeeting = await meetingRes.json();
            const meetingId = createdMeeting.id;

            if (videoFile) {
                setUploadStep("Caching video/audio recording locally in browser...");
                await saveVideoFile(meetingId, videoFile);
            }

            // Step 2: Upload transcript segments
            setUploadStep("Processing and uploading transcript segments...");
            const transcriptRes = await fetch(`http://localhost:8000/meetings/${meetingId}/transcript`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(segments)
            });

            if (!transcriptRes.ok) {
                throw new Error("Failed to upload parsed transcript segments.");
            }

            // Step 3: Create action items if any exist
            if (actionItems.length > 0) {
                setUploadStep(`Creating ${actionItems.length} action items...`);
                for (const item of actionItems) {
                    await fetch(`http://localhost:8000/meetings/${meetingId}/action-items`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            task: item.task,
                            assignee: item.assignee,
                            completed: false
                        })
                    });
                }
            }

            setUploadStep("Success! Redirecting to meeting details page...");
            setTimeout(() => {
                router.push(`/meetings/${meetingId}`);
            }, 1000);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to upload and process meeting.");
            setUploading(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50/40 p-6 flex justify-center">
            <div className="w-full max-w-[800px] bg-white border border-gray-150 rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col gap-6">
                
                {/* Header */}
                <div>
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Upload className="text-violet-600 h-5 w-5" />
                        <span>Upload & Process Meeting</span>
                    </h1>
                    <p className="text-[13.5px] text-gray-500 mt-1">
                        Select an MP4 file, add details, attendees, and parse a meeting transcript to load it into the dashboard database.
                    </p>
                </div>

                {/* Status message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 flex items-start gap-2.5 text-[13px] animate-in fade-in duration-150">
                        <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    
                    {/* Step 1: MP4 Upload */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-bold text-gray-700 flex items-center gap-1.5">
                            <Video className="text-gray-400 h-4 w-4" />
                            <span>1. Select MP4 File (Optional)</span>
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                                videoFile
                                    ? "border-emerald-300 bg-emerald-50/10"
                                    : "border-gray-200 hover:border-violet-300 bg-gray-50/30 hover:bg-gray-50/50"
                            }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="video/mp4"
                                className="hidden"
                            />
                            {videoFile ? (
                                <div className="flex flex-col items-center gap-1">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-1" />
                                    <span className="text-[13.5px] font-semibold text-gray-800">
                                        {videoFile.name}
                                    </span>
                                    <span className="text-[12px] text-gray-500">
                                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB · {videoDuration ? `${Math.floor(videoDuration / 60)}m ${videoDuration % 60}s duration` : "Loading duration..."}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-1.5 py-2">
                                    <Upload className="h-7 w-7 text-gray-400" />
                                    <span className="text-[13.5px] font-semibold text-gray-700">
                                        Click to choose an MP4 recording
                                    </span>
                                    <span className="text-[12px] text-gray-400">
                                        Accepts .mp4 up to 100MB
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 2: Metadata Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-gray-700">
                                Meeting Title
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Project Sync Session"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={`w-full text-[13px] border rounded-xl p-2.5 outline-none transition-all bg-white ${
                                    validated && !title.trim()
                                        ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-150"
                                        : "border-gray-200 focus:border-violet-300"
                                }`}
                            />
                            {validated && !title.trim() && (
                                <span className="text-[11.5px] text-red-600 font-bold mt-1 flex items-center gap-1 select-none animate-in fade-in duration-100">
                                    <AlertCircle size={12} className="shrink-0" />
                                    <span>Meeting title is required</span>
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-bold text-gray-700 flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                <span>Meeting Date & Time</span>
                            </label>
                            <input
                                type="datetime-local"
                                value={meetingDate}
                                onChange={(e) => setMeetingDate(e.target.value)}
                                className={`w-full text-[13px] border rounded-xl p-2.5 outline-none transition-all bg-white ${
                                    validated && !meetingDate
                                        ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-150"
                                        : "border-gray-200 focus:border-violet-300"
                                }`}
                            />
                            {validated && !meetingDate && (
                                <span className="text-[11.5px] text-red-600 font-bold mt-1 flex items-center gap-1 select-none animate-in fade-in duration-100">
                                    <AlertCircle size={12} className="shrink-0" />
                                    <span>Meeting date and time is required</span>
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-bold text-gray-700">
                            Summary & Key Overview
                        </label>
                        <textarea
                            placeholder="Write a brief overview summary of this meeting..."
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={3}
                            className="w-full text-[13px] border border-gray-200 rounded-xl p-2.5 outline-none focus:border-violet-300 transition-all bg-white resize-y"
                        />
                    </div>



                    {/* Step 4: Paste custom transcript format */}
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                            <label className="text-[13px] font-bold text-gray-700 flex items-center gap-1.5">
                                <FileText className="text-gray-400 h-4 w-4" />
                                <span>Paste Transcript Content</span>
                            </label>
                            <span className="text-[11.5px] text-gray-400 font-bold bg-gray-100/70 border border-gray-200/50 px-2 py-0.5 rounded-md">
                                Format: 3 lines per dialog block
                            </span>
                        </div>

                        {/* Format guide box */}
                        <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-3 text-[12px] text-gray-600 leading-relaxed">
                            <p className="font-bold text-amber-800/80 mb-1">Accepted Format Guidelines:</p>
                            <pre className="font-mono bg-white p-2 rounded border border-amber-100/50 text-[11px] text-gray-700">
                                00:05{"\n"}
                                Alok Kumar Das{"\n"}
                                Hello, welcome to this meeting session. We will discuss FSD2.{"\n"}
                                00:20{"\n"}
                                Bhoomika{"\n"}
                                Yes, let's start with the database schema details.
                            </pre>
                        </div>

                        <textarea
                            placeholder="Paste formatted transcript dialog chunks here..."
                            value={transcriptText}
                            onChange={(e) => setTranscriptText(e.target.value)}
                            rows={8}
                            className={`w-full text-[13px] font-mono border rounded-xl p-3 outline-none transition-all bg-white resize-y leading-relaxed ${
                                validated && (!transcriptText.trim() || parseTranscript(transcriptText).length === 0)
                                    ? "border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-150"
                                    : "border-gray-200 focus:border-violet-300"
                            }`}
                        />
                        {validated && !transcriptText.trim() && (
                            <span className="text-[11.5px] text-red-600 font-bold mt-1 flex items-center gap-1 select-none animate-in fade-in duration-100">
                                <AlertCircle size={12} className="shrink-0" />
                                <span>Transcript text is required</span>
                            </span>
                        )}
                        {validated && transcriptText.trim() && parseTranscript(transcriptText).length === 0 && (
                            <span className="text-[11.5px] text-red-600 font-bold mt-1 flex items-center gap-1 select-none animate-in fade-in duration-100">
                                <AlertCircle size={12} className="shrink-0" />
                                <span>Transcript could not be parsed. Please check speaker and text formatting.</span>
                            </span>
                        )}
                    </div>

                    {/* Step 5: Action Items Checklist Builder */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-bold text-gray-700 flex items-center gap-1.5">
                            <CheckCircle2 className="text-gray-400 h-4 w-4" />
                            <span>Create Action Items (Optional)</span>
                        </label>
                        
                        {/* Builder inputs */}
                        <div className="flex flex-col sm:flex-row gap-2 border border-gray-150 rounded-xl p-3 bg-gray-50/10">
                            <input
                                type="text"
                                placeholder="Task description..."
                                value={newActionTask}
                                onChange={(e) => setNewActionTask(e.target.value)}
                                className="flex-1 text-[13px] bg-white border border-gray-250 rounded-lg px-2.5 py-1.5 outline-none focus:border-violet-300"
                            />
                            <input
                                type="text"
                                placeholder="Assignee (e.g. Alok)"
                                value={newActionAssignee}
                                onChange={(e) => setNewActionAssignee(e.target.value)}
                                className="sm:w-44 text-[13px] bg-white border border-gray-250 rounded-lg px-2.5 py-1.5 outline-none focus:border-violet-300"
                            />
                            <button
                                type="button"
                                onClick={handleAddAction}
                                className="bg-violet-50 text-violet-700 border border-violet-100 hover:bg-violet-100/50 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition-colors flex items-center justify-center gap-1 shrink-0"
                            >
                                <Plus size={14} />
                                Add
                            </button>
                        </div>

                        {/* List of items built */}
                        {actionItems.length > 0 && (
                            <div className="flex flex-col gap-1.5 mt-1 border border-gray-100 rounded-xl p-2.5 bg-white">
                                {actionItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between gap-3 px-2 py-1.5 bg-gray-50/50 rounded-lg border border-gray-100 text-[12.5px]">
                                        <div className="min-w-0">
                                            <span className="font-semibold text-gray-700">{item.task}</span>
                                            <span className="text-gray-400 font-bold mx-1.5">·</span>
                                            <span className="text-[11px] font-semibold bg-violet-50 border border-violet-100 text-violet-600 px-1.5 py-0.5 rounded">
                                                {item.assignee}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAction(idx)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            title="Delete item"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button & Overlay Loader */}
                    <div className="border-t border-gray-100 pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl px-5 py-2.5 text-[13.5px] shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 disabled:bg-violet-400"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Upload & Process Meeting</span>
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </div>

                </form>

                {/* Steps Loader Overlay */}
                {uploading && (
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white border border-gray-200 max-w-sm w-full rounded-2xl shadow-2xl p-6 text-center flex flex-col items-center gap-4 animate-in zoom-in duration-200">
                            <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
                            <div>
                                <h3 className="font-bold text-gray-900 text-[15px]">Processing Meeting</h3>
                                <p className="text-[13px] text-gray-500 mt-1">{uploadStep}</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
