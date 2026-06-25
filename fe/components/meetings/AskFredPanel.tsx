"use client";

import { useState } from "react";
import { MessageSquare, Plus, Hash, Globe, ArrowUp } from "lucide-react";

const suggestions = [
    {
        icon: (
            <span className="w-5 h-5 flex items-center justify-center rounded bg-green-100">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>
        ),
        label: "My action items",
    },
    {
        icon: (
            <span className="w-5 h-5 flex items-center justify-center text-base leading-none">
                🎯
            </span>
        ),
        label: "Key decisions",
    },
    {
        icon: (
            <span className="w-5 h-5 flex items-center justify-center text-base leading-none">
                📌
            </span>
        ),
        label: "Key initiatives",
    },
];

export default function AskFredPanel() {
    const [message, setMessage] = useState("");

    return (
        <div className="w-[360px] shrink-0 border-l border-gray-100 bg-white flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3.5 border-b border-gray-100">
                <span className="flex-1 text-[14px] font-semibold text-gray-800">Ask Fred</span>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                    <MessageSquare size={15} />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
                    <Plus size={15} />
                </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col">
                {/* Welcome card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 mb-4">
                    {/* Sparkle icon */}
                    <div className="mb-3">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path d="M14 2L16.5 11.5L26 14L16.5 16.5L14 26L11.5 16.5L2 14L11.5 11.5L14 2Z" fill="url(#sparkle-grad)" />
                            <defs>
                                <linearGradient id="sparkle-grad" x1="2" y1="2" x2="26" y2="26">
                                    <stop offset="0%" stopColor="#34d399" />
                                    <stop offset="100%" stopColor="#7c3aed" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <p className="text-[14px] font-bold text-gray-900 mb-0.5">
                        Hi ADITYA KUMAR SAHRAWAT!
                    </p>
                    <p className="text-[13px] font-semibold text-gray-700">Get ready for your meeting</p>
                </div>

                {/* Suggestion chips */}
                <div className="flex flex-col gap-2">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 border border-gray-100 text-left transition-colors"
                        >
                            {s.icon}
                            <span className="text-[13px] font-medium text-gray-700">{s.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer / Chat input */}
            <div className="border-t border-gray-100 px-3 py-3">
                {/* Context label */}
                <div className="flex items-center gap-1.5 px-1 mb-2">
                    <Hash size={12} className="text-gray-400" />
                    <span className="text-[11.5px] text-gray-400 font-medium">My Meetings</span>
                </div>

                {/* Input row */}
                <div className="flex items-end gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus-within:border-violet-300 transition-colors">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask anything. Type / to run AI skills."
                        className="flex-1 text-[13px] bg-transparent outline-none text-gray-700 placeholder:text-gray-400 resize-none"
                    />
                </div>

                {/* Bottom icons */}
                <div className="flex items-center justify-between mt-2 px-1">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                        <Globe size={15} className="text-violet-500" />
                    </button>
                    <button
                        className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${message.trim()
                                ? "bg-violet-600 text-white hover:bg-violet-700"
                                : "bg-gray-100 text-gray-400"
                            }`}
                    >
                        <ArrowUp size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
