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
        <div className="w-full max-w-[340px] mx-auto rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white text-[7px]">
            {/* Mock top bar */}
            <div className="bg-gray-800 px-2 py-1 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <div className="flex-1 bg-gray-600 rounded ml-2 h-1.5" />
            </div>
            {/* Mock content */}
            <div className="flex" style={{ height: "160px" }}>
                {/* Sidebar */}
                <div className="w-10 bg-white border-r border-gray-100 p-1 flex flex-col gap-1">
                    <div className="h-1.5 w-6 bg-violet-200 rounded" />
                    <div className="h-1 w-5 bg-gray-100 rounded" />
                    <div className="h-1 w-5 bg-gray-100 rounded" />
                    <div className="h-1 w-5 bg-gray-100 rounded" />
                    <div className="h-1 w-5 bg-gray-100 rounded" />
                    <div className="mt-1 h-[1px] bg-gray-100 w-full" />
                    <div className="h-1 w-5 bg-gray-100 rounded" />
                    <div className="h-1 w-5 bg-gray-100 rounded" />
                </div>
                {/* Main */}
                <div className="flex-1 p-2 bg-gray-50">
                    <div className="text-[8px] font-bold text-gray-700 mb-2">Good Morning, Janice</div>
                    <div className="grid grid-cols-3 gap-1 mb-2">
                        <div className="bg-white rounded p-1 shadow-sm">
                            <div className="h-1 w-4 bg-gray-200 rounded mb-0.5" />
                            <div className="text-[7px] font-bold text-gray-600">0 Tasks</div>
                        </div>
                        <div className="bg-white rounded p-1 shadow-sm">
                            <div className="h-1 w-4 bg-green-200 rounded mb-0.5" />
                            <div className="text-[7px] font-bold text-gray-600">AI Bite</div>
                        </div>
                        <div className="bg-white rounded p-1 shadow-sm">
                            <div className="h-1 w-4 bg-violet-200 rounded mb-0.5" />
                            <div className="text-[7px] font-bold text-gray-600">Analytics</div>
                        </div>
                    </div>
                    <div className="bg-white rounded p-1.5 shadow-sm">
                        <div className="h-1 w-10 bg-gray-200 rounded mb-1" />
                        <div className="h-1 w-16 bg-gray-100 rounded mb-0.5" />
                        <div className="h-1 w-14 bg-gray-100 rounded mb-0.5" />
                        <div className="h-1 w-12 bg-gray-100 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function WelcomeCard() {
    return (
        <div className="flex-1 flex items-center justify-center px-6 py-8">
            <div className="bg-[#fdf8f0] rounded-2xl shadow-sm w-full max-w-[820px] p-8 flex flex-col items-center gap-6 relative">
                {/* Dashboard preview with play button */}
                <div className="relative w-full max-w-[340px]">
                    <DashboardMockup />
                    <button className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-violet-500 bg-opacity-90 flex items-center justify-center shadow-lg hover:bg-violet-600 transition-colors">
                            <Play size={22} className="text-white ml-1" fill="white" />
                        </div>
                    </button>
                </div>

                {/* Welcome text */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Welcome Aboard, ADITYA KUMAR SAHRAWAT!
                    </h1>
                    <p className="text-gray-500 text-[15px]">
                        Fireflies is now ready to automate your meetings and streamline your workflows.
                    </p>
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
            <div
                className="relative flex items-center justify-center overflow-hidden"
                style={{ minHeight: "400px" }}
            >
                {/* Gradient background */}
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "radial-gradient(ellipse at 20% 50%, rgba(56,189,248,0.45) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(251,191,36,0.3) 0%, transparent 55%), radial-gradient(ellipse at 60% 80%, rgba(129,140,248,0.3) 0%, transparent 55%), radial-gradient(ellipse at 40% 30%, rgba(20,184,166,0.35) 0%, transparent 50%)",
                            backdropFilter: "blur(0px)",
                        }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(186,230,253,0.5) 0%, rgba(254,243,199,0.4) 40%, rgba(196,181,253,0.3) 100%)",
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
            <div className="flex-1 py-6">
                <ConnectBanner />
                <RecentMeetings />
                <QuickStart />
                <TryMore />
            </div>

            {/* Help button */}
            <button className="fixed bottom-5 right-5 w-11 h-11 rounded-full bg-violet-600 hover:bg-violet-700 flex items-center justify-center shadow-lg transition-colors z-50">
                <HelpCircle size={20} className="text-white" />
            </button>
        </div>
    );
}
