"use client";

import { Star, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UpgradePage() {
    return (
        <div className="flex-1 min-h-screen bg-gray-50/40 p-6 sm:p-12 flex flex-col justify-center items-center">
            <div className="w-full max-w-[520px] bg-white border border-gray-150 rounded-2xl shadow-sm p-8 text-center flex flex-col items-center gap-6 relative overflow-hidden">
                
                {/* Visual glassmorphic ambient glows */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-fuchsia-400/10 rounded-full blur-3xl pointer-events-none" />

                {/* Animated Logo Circle */}
                <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 relative shrink-0 shadow-sm animate-pulse">
                    <Star size={28} className="spin-slow" />
                    <Sparkles size={14} className="absolute -top-1 -right-1 text-fuchsia-500" />
                </div>

                {/* Heading & Subtext */}
                <div className="flex flex-col gap-2 relative z-10">
                    <h1 className="text-xl font-bold text-gray-900">Upgrade Plan</h1>
                    <span className="inline-block self-center bg-violet-100/60 text-violet-700 text-[11px] font-bold px-3 py-1 rounded-full border border-violet-200 mt-1 uppercase tracking-wider">
                        Coming Soon
                    </span>
                    <p className="text-[13.5px] text-gray-500 leading-relaxed max-w-sm mt-2">
                        Unlock unlimited transcription minutes, premium AI summary models, advanced team features, custom workflows, and full API integration keys. Stay tuned!
                    </p>
                </div>

                {/* Back button */}
                <div className="w-full border-t border-gray-100 pt-5 mt-2 flex justify-center">
                    <Link
                        href="/meetings"
                        className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 hover:text-violet-600 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        <span>Back to Dashboard</span>
                    </Link>
                </div>

            </div>
        </div>
    );
}
