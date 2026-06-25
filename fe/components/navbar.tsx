"use client";

import { usePathname } from "next/navigation";
import { Search, Mic, Bell, ChevronDown, Video } from "lucide-react";

const pageTitles: Record<string, string> = {
    "/": "Home",
    "/meetings": "Meetings",
    "/askfred": "AskFred",
    "/meeting-status": "Meeting Status",
    "/uploads": "Uploads",
    "/integrations": "Integrations",
    "/analytics": "Analytics",
    "/voice-agents": "Voice Agents",
    "/ai-skills": "AI Skills",
    "/team": "Team",
    "/upgrade": "Upgrade",
    "/settings": "Settings",
};

interface NavbarProps {
    collapsed: boolean;
}

export default function Navbar({ collapsed }: NavbarProps) {
    const pathname = usePathname();
    const leftOffset = collapsed ? 68 : 228;
    const title = pageTitles[pathname] ?? "Home";

    return (
        <header
            className="fixed top-0 right-0 h-14 bg-white border-b border-gray-100 flex items-center px-5 gap-4 z-20 transition-all duration-300"
            style={{ left: leftOffset }}
        >
            <span className="text-[15px] font-semibold text-gray-800 min-w-[60px]">{title}</span>

            <div className="flex-1 max-w-[420px] mx-auto">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400">
                    <Search size={15} className="text-gray-400 shrink-0" />
                    <span className="flex-1 text-[13px]">Search by title or keyword</span>
                    <span className="text-[11px] border border-gray-200 rounded px-1.5 py-0.5 text-gray-400 font-mono bg-white">
                        ⌘K
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
                <span className="text-[13px] text-gray-500 whitespace-nowrap">Unlimited Meetings</span>
                <button className="text-[13px] font-semibold text-green-600 border border-green-500 rounded-full px-3 py-1 hover:bg-green-50 transition-colors">
                    Upgrade
                </button>

                <div className="flex items-center">
                    <button className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-medium px-3 py-[6px] rounded-l-lg transition-colors">
                        <Video size={14} />
                        Capture
                    </button>
                    <button className="bg-violet-600 hover:bg-violet-700 text-white px-2 py-[6px] rounded-r-lg border-l border-violet-500 transition-colors">
                        <ChevronDown size={14} />
                    </button>
                </div>

                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                    <Mic size={17} className="text-gray-500" />
                </button>

                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                    <Bell size={17} className="text-gray-500" />
                </button>

                <button className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-[13px] font-bold">
                    A
                </button>
            </div>
        </header>
    );
}
