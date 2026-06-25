"use client";

import { useState } from "react";
import {
    Home,
    Video,
    Activity,
    Upload,
    Layers,
    BarChart2,
    Mic,
    Sparkles,
    Users,
    Star,
    Settings,
    MoreHorizontal,
    Lock,
    Bot,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

interface NavItem {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    badge?: string;
    group: number;
}

const navItems: NavItem[] = [
    { icon: Home, label: "Home", active: true, group: 1 },
    { icon: Bot, label: "AskFred", group: 1 },
    { icon: Video, label: "Meetings", group: 1 },
    { icon: Activity, label: "Meeting Status", group: 1 },
    { icon: Upload, label: "Uploads", group: 1 },
    { icon: Layers, label: "Integrations", group: 2 },
    { icon: BarChart2, label: "Analytics", group: 2 },
    { icon: Mic, label: "Voice Agents", badge: "NEW", group: 3 },
    { icon: Sparkles, label: "AI Skills", group: 3 },
    { icon: Users, label: "Team", group: 4 },
    { icon: Star, label: "Upgrade", group: 4 },
    { icon: Settings, label: "Settings", group: 4 },
    { icon: MoreHorizontal, label: "More", group: 4 },
];

const groups = [1, 2, 3, 4];

const FirefliesLogo = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="28" rx="6" fill="#7C3AED" />
        <path d="M14 6C14 6 9 10 9 15C9 17.76 11.24 20 14 20C16.76 20 19 17.76 19 15C19 10 14 6 14 6Z" fill="white" />
        <circle cx="14" cy="15" r="3" fill="#7C3AED" />
    </svg>
);

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const [hovered, setHovered] = useState(false);
    const [logoHovered, setLogoHovered] = useState(false);

    return (
        <aside
            className="fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col z-30 select-none transition-all duration-300"
            style={{ width: collapsed ? 68 : 228 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setLogoHovered(false); }}
        >
            {/* ── Logo row ── */}
            <div className="flex items-center h-14 px-3 gap-2 relative">

                {/* Collapsed: logo icon with >> overlay on hover */}
                {collapsed ? (
                    <button
                        className="relative w-7 h-7 flex items-center justify-center mx-auto cursor-pointer"
                        onClick={onToggle}
                        onMouseEnter={() => setLogoHovered(true)}
                        onMouseLeave={() => setLogoHovered(false)}
                        title="Expand sidebar"
                    >
                        <FirefliesLogo />
                        {/* >> overlay */}
                        {logoHovered && (
                            <span className="absolute inset-0 flex items-center justify-center rounded-md bg-violet-700 bg-opacity-90">
                                <ChevronsRight size={16} className="text-white" />
                            </span>
                        )}
                    </button>
                ) : (
                    /* Expanded: logo + text + << toggle button on hover */
                    <>
                        {/* Logo icon */}
                        <div className="w-7 h-7 shrink-0">
                            <FirefliesLogo />
                        </div>

                        {/* Logo text */}
                        <span className="flex-1 text-[15px] font-semibold text-gray-900 tracking-tight whitespace-nowrap overflow-hidden">
                            fireflies.ai
                        </span>

                        {/* << toggle — shown when sidebar is hovered, same row as text */}
                        <button
                            onClick={onToggle}
                            className={`shrink-0 w-8 h-8 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-all duration-150 ${hovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                                }`}
                            title="Collapse sidebar"
                        >
                            <ChevronsLeft size={15} className="text-gray-500" />
                        </button>
                    </>
                )}
            </div>

            {/* Tooltip for collapsed >> — shown below logo on logo hover */}
            {collapsed && logoHovered && (
                <div className="absolute left-[76px] top-3 bg-gray-800 text-white text-[11px] font-medium rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg pointer-events-none z-50">
                    Expand sidebar
                </div>
            )}

            {/* Tooltip for expanded << — shown below toggle button on sidebar hover */}
            {!collapsed && hovered && (
                <div className="absolute right-2 top-[54px] bg-gray-800 text-white text-[11px] font-medium rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg pointer-events-none z-50">
                    Collapse sidebar
                </div>
            )}

            {/* ── Nav items ── */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-1">
                {groups.map((group, gi) => (
                    <div key={group}>
                        {gi > 0 && <div className="my-2 border-t border-gray-100" />}
                        {navItems
                            .filter((item) => item.group === group)
                            .map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.label}
                                        className={`w-full flex items-center rounded-lg mb-[2px] transition-colors ${collapsed ? "justify-center px-0 py-[9px]" : "gap-3 px-3 py-[7px]"
                                            } ${item.active
                                                ? "bg-violet-50 text-violet-700"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        <Icon
                                            size={18}
                                            className={item.active ? "text-violet-600 shrink-0" : "text-gray-400 shrink-0"}
                                            strokeWidth={item.active ? 2.2 : 1.8}
                                        />
                                        {!collapsed && (
                                            <span className="flex-1 text-left text-[13.5px] font-medium whitespace-nowrap">
                                                {item.label}
                                            </span>
                                        )}
                                        {!collapsed && item.badge && (
                                            <span className="text-[10px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-full leading-none">
                                                NEW
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                    </div>
                ))}
            </nav>

            {/* ── Bottom ── */}
            {!collapsed ? (
                <div className="px-2 py-3 border-t border-gray-100">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[12.5px] text-gray-400 hover:bg-gray-50 transition-colors">
                        <Lock size={14} className="text-gray-300 shrink-0" />
                        <span>Your Privacy Choices</span>
                    </button>
                </div>
            ) : (
                <div className="px-2 py-3 border-t border-gray-100 flex justify-center">
                    <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors" title="Your Privacy Choices">
                        <Lock size={14} className="text-gray-300" />
                    </button>
                </div>
            )}
        </aside>
    );
}
