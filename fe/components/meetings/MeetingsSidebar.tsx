"use client";

import { Search, Hash, Video, Bot, Plus } from "lucide-react";
import { useState } from "react";

const sections = [
    { id: "my-meetings", label: "My Meetings", icon: Hash },
    { id: "all-meetings", label: "All Meetings", icon: Hash },
    { id: "voice-agent", label: "Voice Agent Meetings", icon: Bot },
];

export default function MeetingsSidebar() {
    const [active, setActive] = useState("my-meetings");

    return (
        <aside className="w-[270px] shrink-0 border-r border-gray-100 bg-white flex flex-col h-full overflow-y-auto">
            {/* Search */}
            <div className="px-4 py-3">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <Search size={13} className="text-gray-400 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search channels"
                        className="flex-1 text-[13px] bg-transparent outline-none text-gray-600 placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Nav items */}
            <nav className="px-2 pb-2">
                {sections.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActive(item.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13.5px] font-medium transition-colors mb-[2px] ${isActive
                                    ? "bg-violet-50 text-violet-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                                }`}
                        >
                            <Icon
                                size={15}
                                strokeWidth={isActive ? 2.5 : 1.8}
                                className={isActive ? "text-violet-600 shrink-0" : "text-gray-400 shrink-0"}
                            />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* All channels */}
            <div className="px-4 pt-3">
                <p className="text-[12px] font-semibold text-gray-500 mb-3">All channels</p>
                <div className="flex flex-col items-center py-4 gap-3">
                    {/* Pink hashtag icon */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border-2 border-dashed border-pink-200">
                        <Hash size={18} className="text-pink-400" strokeWidth={2.5} />
                    </div>
                    <p className="text-[12.5px] text-gray-400 text-center leading-relaxed max-w-[160px]">
                        Create channels to organize your conversations
                    </p>
                    <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium">
                        <Plus size={13} />
                        Channel
                    </button>
                </div>
            </div>
        </aside>
    );
}
