"use client";

import {
    Calendar,
    Link2,
    MoreHorizontal,
    Plus,
    Upload,
    CalendarDays,
    Smartphone,
    ArrowRight,
    HelpCircle,
    Play,
} from "lucide-react";

function DashboardMockup() {
    return (
        <div className="w-full max-w-[480px] mx-auto rounded-xl overflow-hidden shadow-2xl border border-gray-150 bg-white text-[9px] font-sans flex flex-col select-none">
            {/* Window control header */}
            <div className="bg-gray-50 border-b border-gray-100 px-3 py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <div className="bg-gray-100/60 rounded px-6 py-0.5 text-[7px] text-gray-400 font-semibold font-mono">fireflies.ai</div>
                <div className="w-6" />
            </div>

            <div className="flex" style={{ height: "240px" }}>
                {/* Sidebar */}
                <div className="w-[105px] bg-white border-r border-gray-100 p-2 flex flex-col gap-1 shrink-0">
                    <div className="flex items-center gap-1 mb-2.5 px-1 mt-0.5">
                        <div className="w-4 h-4 rounded-md bg-violet-600 flex items-center justify-center text-white text-[9.5px] font-bold">f</div>
                        <span className="font-bold text-gray-800 text-[10px] tracking-tight">fireflies.ai</span>
                    </div>
                    <div className="h-5 bg-violet-50 text-violet-700 rounded-lg px-2 flex items-center gap-1.5 font-semibold text-[8px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                        <span>Home</span>
                    </div>
                    <div className="h-5 text-gray-500 rounded px-2 flex items-center gap-1.5 hover:bg-gray-50 text-[8px]">
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>Meetings</span>
                    </div>
                    <div className="h-5 text-gray-500 rounded px-2 flex items-center gap-1.5 hover:bg-gray-50 text-[8px]">
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>Uploads</span>
                    </div>
                    <div className="h-5 text-gray-500 rounded px-2 flex items-center gap-1.5 hover:bg-gray-50 text-[8px]">
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>Integrations</span>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-gray-100 flex flex-col gap-0.5">
                        <span className="text-[7px] font-bold text-gray-400 uppercase tracking-wider px-2">Views</span>
                        <div className="h-5 text-gray-500 rounded px-2 flex items-center gap-1.5 hover:bg-gray-50 text-[8px]">
                            <span>Analytics</span>
                        </div>
                        <div className="h-5 text-gray-500 rounded px-2 flex items-center gap-1.5 hover:bg-gray-50 text-[8px]">
                            <span>Action Items</span>
                        </div>
                    </div>
                </div>

                {/* Main panel */}
                <div className="flex-1 bg-gray-50/60 p-2.5 flex flex-col gap-2.5 overflow-hidden">
                    {/* Header bar */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-800 text-[10px]">Good Morning, Janice</span>
                            <span className="text-[7px] text-gray-400">Here is your daily overview</span>
                        </div>
                        <div className="bg-violet-600 text-white rounded px-2 py-0.5 text-[8px] font-semibold">
                            + Capture
                        </div>
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-3 gap-1.5">
                        <div className="bg-white border border-gray-100 rounded-lg p-1.5 shadow-sm flex flex-col">
                            <span className="text-gray-400 text-[6.5px] uppercase font-bold">Tasks</span>
                            <span className="text-gray-800 font-bold text-[9px] mt-0.5">12 Tasks</span>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-lg p-1.5 shadow-sm flex flex-col">
                            <span className="text-gray-400 text-[6.5px] uppercase font-bold">AI Bite</span>
                            <span className="text-green-600 font-bold text-[9px] mt-0.5">All Skills</span>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-lg p-1.5 shadow-sm flex flex-col">
                            <span className="text-gray-400 text-[6.5px] uppercase font-bold">Contacts</span>
                            <span className="text-violet-600 font-bold text-[9px] mt-0.5">374 Contacts</span>
                        </div>
                    </div>

                    {/* Personal Assistant Card */}
                    <div className="bg-white border border-gray-100 rounded-lg p-2 shadow-sm flex-1 flex flex-col gap-1.5 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-1">
                            <div className="flex items-center gap-1">
                                <span className="text-xs">🤖</span>
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-800 text-[8.5px]">Personal Assistant</span>
                                    <span className="text-[6.5px] text-gray-400">Daily Digest · 12 meetings</span>
                                </div>
                            </div>
                            <span className="text-[6.5px] bg-violet-50 text-violet-600 px-1 py-0.5 rounded font-bold">Active</span>
                        </div>

                        {/* List items */}
                        <div className="flex flex-col gap-1 overflow-hidden">
                            <div className="flex items-start gap-1.5">
                                <input type="checkbox" checked readOnly className="w-2 h-2 accent-violet-600 text-violet-600 rounded border-gray-300 shrink-0 mt-0.5 cursor-default" />
                                <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-gray-700 text-[8px] leading-none">Homepage Feedback Cleanup</span>
                                    <span className="text-gray-400 text-[6.5px] truncate">Fixed bugs and improved first-time user experience like autoplaying video.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-1.5">
                                <input type="checkbox" checked readOnly className="w-2 h-2 accent-violet-600 text-violet-600 rounded border-gray-300 shrink-0 mt-0.5 cursor-default" />
                                <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-gray-700 text-[8px] leading-none">Unifying Search & AskFred</span>
                                    <span className="text-gray-400 text-[6.5px] truncate">Plan to merge global search and askfred into a single floating input.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-1.5">
                                <input type="checkbox" readOnly className="w-2 h-2 accent-violet-600 text-violet-600 rounded border-gray-300 shrink-0 mt-0.5 cursor-default" />
                                <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-gray-700 text-[8px] leading-none">Meeting Feed Optimization</span>
                                    <span className="text-gray-400 text-[6.5px] truncate">Exploring ways to keep summaries visible but cleaner...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function WelcomeCard() {
    return (
        <div className="flex-1 flex items-center justify-center px-6 py-4">
            <div className="bg-[#fdf8f0] rounded-[32px] shadow-sm w-full max-w-[800px] p-10 sm:p-12 flex flex-col items-center gap-8 relative border border-orange-100/10">
                {/* Dashboard preview with play button */}
                <div className="relative w-full max-w-[440px] shadow-lg rounded-xl overflow-hidden hover:scale-[1.01] transition-transform duration-200">
                    <DashboardMockup />
                    <button className="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors group cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-violet-600 hover:bg-violet-750 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all">
                            <Play size={24} className="text-white ml-1.5" fill="white" />
                        </div>
                    </button>
                </div>

                {/* Welcome text */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Welcome Aboard, ADITYA KUMAR SAHRAWAT!
                    </h1>
                    <p className="text-gray-500 text-[14.5px]">
                        Fireflies is now ready to automate your meetings and streamline your workflows.
                    </p>
                    {process.env.NEXT_PUBLIC_INSTANCE === "prod" && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 max-w-md mx-auto text-center flex items-center justify-center gap-2 text-[12.5px] text-red-700 font-semibold shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                            <span>Before testing, please make sure the backend server is running on: <a href="http://fireflies-backend-7auw.onrender.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-900 transition-colors">http://fireflies-backend-7auw.onrender.com/</a></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ConnectBanner() {
    return (
        <div className="mx-6 mb-5">
            <div className="bg-violet-50 border border-violet-100 rounded-xl px-5 py-4 flex items-center gap-3">
                {/* Slack + Gmail icons */}
                <div className="flex items-center gap-1">
                    {/* Slack icon */}
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white shadow-sm">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.6 10.4a1.2 1.2 0 1 1-1.2-1.2H3.6v1.2zm.6 0a1.2 1.2 0 0 1 2.4 0v3a1.2 1.2 0 0 1-2.4 0v-3z" fill="#E01E5A" />
                            <path d="M5.6 3.6a1.2 1.2 0 1 1 1.2-1.2V3.6H5.6zm0 .6a1.2 1.2 0 0 1 0 2.4H2.6a1.2 1.2 0 0 1 0-2.4h3z" fill="#36C5F0" />
                            <path d="M12.4 5.6a1.2 1.2 0 1 1 1.2 1.2H12.4V5.6zm-.6 0a1.2 1.2 0 0 1-2.4 0v-3a1.2 1.2 0 0 1 2.4 0v3z" fill="#2EB67D" />
                            <path d="M10.4 12.4a1.2 1.2 0 1 1-1.2 1.2V12.4h1.2zm0-.6a1.2 1.2 0 0 1 0-2.4h3a1.2 1.2 0 0 1 0 2.4h-3z" fill="#ECB22E" />
                        </svg>
                    </div>
                    {/* Gmail icon */}
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white shadow-sm">
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 1.5L8 7L16 1.5V11a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1.5z" fill="#EA4335" />
                            <path d="M0 1.5A1 1 0 0 1 1 0h14a1 1 0 0 1 1 1.5L8 7 0 1.5z" fill="#FBBC05" />
                            <path d="M0 1.5V11a1 1 0 0 0 1 1h2V5L0 1.5z" fill="#34A853" />
                            <path d="M16 1.5V11a1 1 0 0 1-1 1h-2V5L16 1.5z" fill="#4285F4" />
                        </svg>
                    </div>
                </div>
                <p className="text-[13.5px] text-gray-700 flex-1">
                    <span className="font-semibold">Connect Slack and Email</span>
                    {" — "}get richer insights with full context.{" "}
                    <button className="text-violet-600 font-semibold hover:underline inline-flex items-center gap-0.5">
                        Connect <ArrowRight size={13} />
                    </button>
                </p>
            </div>
        </div>
    );
}

function RecentMeetings() {
    return (
        <div className="px-6 mb-6">
            <div className="flex items-center gap-2 text-gray-500 text-[13px] mb-3">
                <Calendar size={14} />
                <span className="font-medium">Recent Meetings</span>
            </div>
            <div className="border border-gray-100 rounded-xl bg-white">
                <div className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors rounded-xl">
                    {/* Meeting icon */}
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shrink-0"
                        style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)" }}>
                        <div className="w-3 h-3 bg-white rounded-sm opacity-90" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13.5px] font-semibold text-gray-800 truncate">
                            Fireflies AI Platform Quick Overview
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[12px] text-gray-400">Aug 08 2024, 3:52 PM</span>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M5 1L6.5 3.5L9 4L7 6L7.5 9L5 7.5L2.5 9L3 6L1 4L3.5 3.5L5 1Z" fill="#FCD34D" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                        <button className="text-gray-300 hover:text-gray-500 transition-colors">
                            <Link2 size={15} />
                        </button>
                        <button className="text-gray-300 hover:text-gray-500 transition-colors">
                            <MoreHorizontal size={15} />
                        </button>
                        <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <circle cx="7" cy="7" r="7" fill="#7C3AED" />
                                <circle cx="5" cy="6" r="1" fill="white" />
                                <circle cx="9" cy="6" r="1" fill="white" />
                                <path d="M4.5 9C5 10 9 10 9.5 9" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuickStart() {
    const actions = [
        { icon: Plus, label: "Capture Meeting", color: "bg-violet-100 text-violet-600" },
        { icon: Upload, label: "Upload File", color: "bg-orange-100 text-orange-500" },
        { icon: CalendarDays, label: "Schedule", color: "bg-pink-100 text-pink-500" },
    ];

    return (
        <div className="px-6 mb-8">
            <h2 className="text-[18px] font-bold text-gray-900 mb-1">Quick Start</h2>
            <p className="text-[13.5px] text-gray-500 mb-4">See Fireflies in action with your first meeting.</p>
            <div className="flex items-center gap-4">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={action.label}
                            className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl px-4 py-3 transition-colors flex-1"
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color}`}>
                                <Icon size={16} />
                            </div>
                            <span className="text-[13.5px] font-medium text-gray-700">{action.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function TryMore() {
    const apps = [
        {
            name: "HubSpot",
            icon: (
                <div className="w-6 h-6 rounded flex items-center justify-center bg-orange-500">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                        <circle cx="10" cy="4" r="2" />
                        <path d="M10 6v3M4 7a3 3 0 1 0 6 0" stroke="white" strokeWidth="1.2" fill="none" />
                    </svg>
                </div>
            ),
        },
        {
            name: "Notion",
            icon: (
                <div className="w-6 h-6 rounded flex items-center justify-center bg-black">
                    <span className="text-white text-[11px] font-bold">N</span>
                </div>
            ),
        },
        {
            name: "Salesforce",
            icon: (
                <div className="w-6 h-6 rounded flex items-center justify-center bg-blue-500">
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="white">
                        <path d="M6 2a2.5 2.5 0 0 1 4.8.8A2 2 0 0 1 13 5a2 2 0 0 1-2 2H3a2 2 0 0 1-.5-3.9A2.5 2.5 0 0 1 6 2z" />
                    </svg>
                </div>
            ),
        },
        {
            name: "Slack",
            icon: (
                <div className="w-6 h-6 rounded flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                        <path d="M3.6 10.4a1.2 1.2 0 1 1-1.2-1.2H3.6v1.2zm.6 0a1.2 1.2 0 0 1 2.4 0v3a1.2 1.2 0 0 1-2.4 0v-3z" fill="#E01E5A" />
                        <path d="M5.6 3.6a1.2 1.2 0 1 1 1.2-1.2V3.6H5.6zm0 .6a1.2 1.2 0 0 1 0 2.4H2.6a1.2 1.2 0 0 1 0-2.4h3z" fill="#36C5F0" />
                        <path d="M12.4 5.6a1.2 1.2 0 1 1 1.2 1.2H12.4V5.6zm-.6 0a1.2 1.2 0 0 1-2.4 0v-3a1.2 1.2 0 0 1 2.4 0v3z" fill="#2EB67D" />
                        <path d="M10.4 12.4a1.2 1.2 0 1 1-1.2 1.2V12.4h1.2zm0-.6a1.2 1.2 0 0 1 0-2.4h3a1.2 1.2 0 0 1 0 2.4h-3z" fill="#ECB22E" />
                    </svg>
                </div>
            ),
        },
    ];

    return (
        <div className="px-6 mb-8">
            <h2 className="text-[18px] font-bold text-gray-900 mb-4">Try More</h2>
            <div className="grid grid-cols-2 gap-4">
                {/* Left: Connect work apps */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <p className="text-[14px] font-semibold text-gray-800 mb-1">Connect your work apps</p>
                    <p className="text-[12.5px] text-gray-400 mb-4">
                        Auto-log meetings notes and action items to your work apps.
                    </p>
                    <div className="flex flex-col gap-2">
                        {apps.map((app) => (
                            <button
                                key={app.name}
                                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-left"
                            >
                                {app.icon}
                                <span className="text-[13px] font-medium text-gray-700">{app.name}</span>
                            </button>
                        ))}
                        <button className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                            <span className="text-[13px] text-gray-500">50+ more apps</span>
                        </button>
                    </div>
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-4">
                    {/* Mobile app */}
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center mb-3">
                            <Smartphone size={18} className="text-pink-400" />
                        </div>
                        <p className="text-[14px] font-semibold text-gray-800 mb-1">Get Fireflies Mobile App</p>
                        <p className="text-[12.5px] text-gray-400 mb-3">
                            Transcribe and summarize in-person conversations with mobile app.
                        </p>
                        <div className="flex gap-2">
                            {/* Play Store */}
                            <button className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center hover:shadow-sm transition-all">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 20.5v-17c0-.83 1-.83 1.3-.5l14 8.5c.3.2.3.8 0 1L4.3 21c-.3.33-1.3.33-1.3-.5z" fill="#34A853" />
                                    <path d="M3 3.5L12.5 13 3 20.5V3.5z" fill="#4285F4" />
                                    <path d="M3 20.5L12.5 13 17 17.5 4.3 21C4 21.33 3 21 3 20.5z" fill="#EA4335" />
                                    <path d="M3 3.5L12.5 13 17 8.5 4.3 3C4 2.67 3 3 3 3.5z" fill="#FBBC05" />
                                </svg>
                            </button>
                            {/* App Store */}
                            <button className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center hover:shadow-sm transition-all">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="#000" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Chrome Extension */}
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center mb-3 shadow-sm">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" fill="#4285F4" />
                                <circle cx="12" cy="12" r="4" fill="white" />
                                <path d="M12 8h8.5M7.5 20L11 14M16.5 20L13 14" stroke="white" strokeWidth="0" fill="none" />
                                <path d="M12 8a4 4 0 0 1 3.46 2H20a8 8 0 1 0-7.38 10.88L15 15A4 4 0 0 1 12 8z" fill="#34A853" />
                                <path d="M12 8H4.54A8 8 0 0 0 8.62 18.88L12 13a4 4 0 0 1 0-5z" fill="#FBBC05" />
                                <path d="M12 8a4 4 0 0 1 3.46 2H20A8 8 0 0 0 12 4V8z" fill="#EA4335" />
                            </svg>
                        </div>
                        <p className="text-[14px] font-semibold text-gray-800 mb-1">Install Fireflies Chrome Extension</p>
                        <p className="text-[12.5px] text-gray-400 mb-3">
                            Record and transcribe Google Meet calls without Fireflies notetaker bot.
                        </p>
                        <button className="text-[13px] font-medium border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-colors text-gray-700">
                            Install
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function HomeContent() {
    return (
        <div className="flex flex-col flex-1 overflow-y-auto bg-white relative">
            {/* Hero section */}
            <div className="relative flex flex-col items-center justify-center overflow-hidden min-h-[580px] py-20 px-6">
                {/* Sky blue cloud gradient background */}
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(180deg, #38bdf8 0%, #7dd3fc 35%, #bae6fd 60%, #f0f9ff 85%, #ffffff 100%)",
                        }}
                    />
                </div>

                <WelcomeCard />

                {/* 0 Upcoming */}
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 px-3 py-2.5 flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-50 rounded flex items-center justify-center">
                            <CalendarDays size={12} className="text-blue-400" />
                        </div>
                        <span className="text-[12.5px] font-semibold text-gray-700 whitespace-nowrap">0 Upcoming</span>
                    </div>
                </div>
            </div>

            {/* Main scrollable content */}
            <div className="flex-1 py-10">
                <ConnectBanner />
                <RecentMeetings />
                <QuickStart />
                <TryMore />
            </div>

            {/* Help button */}
            <button className="fixed bottom-5 right-5 w-11 h-11 rounded-full bg-violet-600 hover:bg-violet-750 flex items-center justify-center shadow-lg transition-colors z-50">
                <HelpCircle size={20} className="text-white" />
            </button>
        </div>
    );
}
