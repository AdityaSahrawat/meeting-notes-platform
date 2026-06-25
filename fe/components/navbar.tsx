"use client";

import { usePathname, useRouter } from "next/navigation";
import { Search, Mic, Bell, ChevronDown, Video, X, Clock, Smile } from "lucide-react";
import { useState, useEffect } from "react";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Navbar({ collapsed }: NavbarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const leftOffset = collapsed ? 68 : 228;
    const title = pageTitles[pathname] ?? "Home";

    // Global Search states
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [hostFilter, setHostFilter] = useState("");
    const [participantFilter, setParticipantFilter] = useState("");
    const [timeRangeFilter, setTimeRangeFilter] = useState("");
    const [titleOnlyFilter, setTitleOnlyFilter] = useState(false);
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    const [dropdownSearch, setDropdownSearch] = useState("");
    const [activeDropdown, setActiveDropdown] = useState<"host" | "participant" | null>(null);
    const [participantsList, setParticipantsList] = useState<any[]>([]);

    const fetchParticipants = async () => {
        try {
            const res = await fetch(`${API_URL}/participants`);
            if (res.ok) {
                const data = await res.json();
                setParticipantsList(data);
            }
        } catch (err) {
            console.error("Error fetching participants:", err);
        }
    };

    useEffect(() => {
        if (isSearchOpen) {
            fetchParticipants();
        }
    }, [isSearchOpen]);

    const filteredDropdownParticipants = participantsList.filter((p) =>
        p.name.toLowerCase().includes(dropdownSearch.toLowerCase())
    );

    const getInitials = (name: string) => {
        if (!name) return "P";
        const cleaned = name.trim();
        if (/^\d/.test(cleaned)) {
            return "BI";
        }
        const parts = cleaned.split(/\s+/);
        if (parts.length > 1) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return cleaned.slice(0, 2).toUpperCase();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        const handleOpenSearch = () => {
            setIsSearchOpen(true);
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("open-global-search", handleOpenSearch);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("open-global-search", handleOpenSearch);
        };
    }, []);

    useEffect(() => {
        if (!isSearchOpen) return;
        const cached = localStorage.getItem("recent_searches");
        if (cached) {
            try {
                setRecentSearches(JSON.parse(cached));
            } catch {
                setRecentSearches(["hello"]);
            }
        } else {
            setRecentSearches(["hello"]);
        }
    }, [isSearchOpen]);

    const saveRecentSearch = (term: string) => {
        if (!term.trim()) return;
        const cleaned = term.trim();
        const updated = [cleaned, ...recentSearches.filter((t) => t !== cleaned)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("recent_searches", JSON.stringify(updated));
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem("recent_searches");
    };

    const performSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        setSearchLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("q", searchQuery);
            if (titleOnlyFilter) params.append("title_only", "true");
            if (hostFilter) params.append("host", hostFilter);
            if (participantFilter) params.append("participant", participantFilter);
            if (timeRangeFilter) params.append("time_range", timeRangeFilter);
            params.append("sort", sortOrder);

            const res = await fetch(`${API_URL}/meetings/search_global?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data);
                saveRecentSearch(searchQuery);
            }
        } catch (err) {
            console.error("Error performing global search:", err);
        } finally {
            setSearchLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            performSearch();
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery, hostFilter, participantFilter, timeRangeFilter, titleOnlyFilter, sortOrder]);

    const highlightSnippetText = (text: string, search: string) => {
        if (!search.trim()) return text;
        const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, "gi");
        const parts = text.split(regex);
        return parts.map((part, index) =>
            regex.test(part) ? (
                <span key={index} className="text-blue-600 font-bold">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    return (
        <header
            className={`fixed top-0 right-0 h-14 bg-white border-b border-gray-100 flex items-center px-5 gap-4 transition-all duration-300 ${isSearchOpen ? "z-50" : "z-20"
                }`}
            style={{ left: leftOffset }}
        >
            <span className="text-[15px] font-semibold text-gray-800 min-w-[60px]">{title}</span>

            <div className="flex-1 max-w-[420px] mx-auto">
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="w-full flex items-center gap-2 bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-400 cursor-pointer text-left transition-all"
                >
                    <Search size={15} className="text-gray-400 shrink-0" />
                    <span className="flex-1 text-[13px]">Search by title or keyword</span>
                    <span className="text-[11px] border border-gray-200 rounded px-1.5 py-0.5 text-gray-400 font-mono bg-white">
                        ⌘K
                    </span>
                </button>
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
                        <ChevronDown size={20} />
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

            {/* Global Search Modal Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-50 flex justify-center pt-[80px] p-4 animate-in fade-in duration-200">
                    {/* Active dropdown click catcher */}
                    {activeDropdown && (
                        <div
                            className="fixed inset-0 z-40 bg-transparent"
                            onClick={() => {
                                setActiveDropdown(null);
                                setDropdownSearch("");
                            }}
                        />
                    )}

                    {/* Modal Box */}
                    <div className="bg-white border border-gray-150 rounded-2xl w-full max-w-[720px] h-[520px] shadow-2xl flex flex-col overflow-hidden relative z-50 animate-in slide-in-from-top-4 duration-200">
                        {/* Search Input Row (matches top of image 1 & 2) */}
                        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
                            <Search size={18} className="text-gray-400 shrink-0" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title or keyword.."
                                className="flex-1 text-[14px] text-gray-800 outline-none placeholder-gray-400 bg-transparent"
                                autoFocus
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="text-[12.5px] text-gray-400 hover:text-gray-600 font-semibold px-2 py-1 cursor-pointer transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Search Query Empty View (matches image 1) */}
                        {!searchQuery.trim() ? (
                            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 select-none">
                                {/* Suggestion Categories */}
                                <div className="flex flex-col gap-3.5 text-[13px] font-medium text-gray-700">
                                    <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                                        <span className="bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wide">Hosts:</span>
                                        <button
                                            onClick={() => setSearchQuery("Alok")}
                                            className="text-gray-400 hover:text-violet-600 font-semibold transition-colors"
                                        >
                                            By hosts
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                                        <span className="bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wide">Participants:</span>
                                        <button
                                            onClick={() => setSearchQuery("Chirag")}
                                            className="text-gray-400 hover:text-violet-600 font-semibold transition-colors"
                                        >
                                            By participants
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                                        <span className="bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wide">Channel:</span>
                                        <button
                                            onClick={() => setSearchQuery("General")}
                                            className="text-gray-400 hover:text-violet-600 font-semibold transition-colors"
                                        >
                                            By channel
                                        </button>
                                    </div>
                                </div>

                                {/* Recent Searches section */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[12.5px] font-bold text-gray-400 uppercase tracking-wider">Recent</h4>
                                        <button
                                            onClick={clearRecentSearches}
                                            className="text-[12px] text-gray-400 hover:text-gray-600 font-semibold cursor-pointer"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.length === 0 ? (
                                            <p className="text-[12.5px] text-gray-400 italic">No recent searches.</p>
                                        ) : (
                                            recentSearches.map((term) => (
                                                <button
                                                    key={term}
                                                    onClick={() => setSearchQuery(term)}
                                                    className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-250 text-gray-600 hover:text-gray-800 text-[12.5px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    <Clock size={12} className="text-gray-400" />
                                                    <span>{term}</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Search Query Active View (matches image 2) */
                            <>
                                {/* Filters Row */}
                                <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 bg-gray-50/50 border-b border-gray-100 text-[12px] font-bold text-gray-400 select-none relative z-50">
                                    <div className="flex items-center gap-4">
                                        {/* Host dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={() => {
                                                    setDropdownSearch("");
                                                    setActiveDropdown(activeDropdown === "host" ? null : "host");
                                                }}
                                                className={`flex items-center gap-1 hover:text-gray-600 cursor-pointer ${activeDropdown === "host" ? "text-violet-600 font-bold" : ""}`}
                                            >
                                                <span>{hostFilter ? `Host: ${hostFilter}` : "Host"}</span>
                                                <ChevronDown size={12} className={`transition-transform duration-150 ${activeDropdown === "host" ? "rotate-180 text-violet-600" : ""}`} />
                                            </button>
                                            {activeDropdown === "host" && (
                                                <div className="absolute top-full left-0 mt-2.5 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 w-[240px] flex flex-col p-3 gap-2.5 animate-in fade-in zoom-in-95 duration-100">
                                                    {/* Dropdown search bar */}
                                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-400">
                                                        <Search size={13} className="text-gray-400 shrink-0" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search"
                                                            value={dropdownSearch}
                                                            onChange={(e) => setDropdownSearch(e.target.value)}
                                                            className="w-full text-xs text-gray-700 bg-transparent outline-none font-medium"
                                                            autoFocus
                                                        />
                                                    </div>

                                                    {/* List of participants */}
                                                    <div className="max-h-48 overflow-y-auto flex flex-col gap-1 pr-0.5">
                                                        {filteredDropdownParticipants.length === 0 ? (
                                                            <span className="text-[11px] text-gray-400 italic text-center py-2">No hosts found</span>
                                                        ) : (
                                                            filteredDropdownParticipants.map((p) => {
                                                                const isChecked = hostFilter === p.name;
                                                                const initials = getInitials(p.name);
                                                                const colors = ["bg-orange-500", "bg-pink-400", "bg-violet-400", "bg-emerald-400", "bg-sky-400"];
                                                                const colorClass = colors[p.id % colors.length];

                                                                return (
                                                                    <label
                                                                        key={p.id}
                                                                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer text-[12.5px] font-semibold text-gray-700 select-none"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isChecked}
                                                                            onChange={() => setHostFilter(isChecked ? "" : p.name)}
                                                                            className="w-3.5 h-3.5 accent-violet-600 text-violet-600 rounded border-gray-300 cursor-pointer"
                                                                        />
                                                                        <div className={`w-6.5 h-6.5 rounded-lg ${colorClass} text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 shadow-sm`}>
                                                                            {initials}
                                                                        </div>
                                                                        <span className="truncate flex-1">{p.name}</span>
                                                                    </label>
                                                                );
                                                            })
                                                        )}
                                                    </div>

                                                    {/* Footer Clear */}
                                                    <div className="flex justify-end border-t border-gray-100 pt-2 mt-0.5">
                                                        <button
                                                            onClick={() => {
                                                                setHostFilter("");
                                                                setActiveDropdown(null);
                                                            }}
                                                            className="border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700 text-[11px] font-bold px-3 py-1 rounded-md transition-colors cursor-pointer"
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Participant dropdown */}
                                        <div className="relative">
                                            <button
                                                onClick={() => {
                                                    setDropdownSearch("");
                                                    setActiveDropdown(activeDropdown === "participant" ? null : "participant");
                                                }}
                                                className={`flex items-center gap-1 hover:text-gray-600 cursor-pointer ${activeDropdown === "participant" ? "text-violet-600 font-bold" : ""}`}
                                            >
                                                <span>{participantFilter ? `Participant: ${participantFilter}` : "Participant"}</span>
                                                <ChevronDown size={12} className={`transition-transform duration-150 ${activeDropdown === "participant" ? "rotate-180 text-violet-600" : ""}`} />
                                            </button>
                                            {activeDropdown === "participant" && (
                                                <div className="absolute top-full left-0 mt-2.5 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 w-[240px] flex flex-col p-3 gap-2.5 animate-in fade-in zoom-in-95 duration-100">
                                                    {/* Dropdown search bar */}
                                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-400">
                                                        <Search size={13} className="text-gray-400 shrink-0" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search"
                                                            value={dropdownSearch}
                                                            onChange={(e) => setDropdownSearch(e.target.value)}
                                                            className="w-full text-xs text-gray-700 bg-transparent outline-none font-medium"
                                                            autoFocus
                                                        />
                                                    </div>

                                                    {/* List of participants */}
                                                    <div className="max-h-48 overflow-y-auto flex flex-col gap-1 pr-0.5">
                                                        {filteredDropdownParticipants.length === 0 ? (
                                                            <span className="text-[11px] text-gray-400 italic text-center py-2">No participants found</span>
                                                        ) : (
                                                            filteredDropdownParticipants.map((p) => {
                                                                const isChecked = participantFilter === p.name;
                                                                const initials = getInitials(p.name);
                                                                const colors = ["bg-orange-500", "bg-pink-400", "bg-violet-400", "bg-emerald-400", "bg-sky-400"];
                                                                const colorClass = colors[p.id % colors.length];

                                                                return (
                                                                    <label
                                                                        key={p.id}
                                                                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer text-[12.5px] font-semibold text-gray-700 select-none"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={isChecked}
                                                                            onChange={() => setParticipantFilter(isChecked ? "" : p.name)}
                                                                            className="w-3.5 h-3.5 accent-violet-600 text-violet-600 rounded border-gray-300 cursor-pointer"
                                                                        />
                                                                        <div className={`w-6.5 h-6.5 rounded-lg ${colorClass} text-white flex items-center justify-center text-[10.5px] font-bold shrink-0 shadow-sm`}>
                                                                            {initials}
                                                                        </div>
                                                                        <span className="truncate flex-1">{p.name}</span>
                                                                    </label>
                                                                );
                                                            })
                                                        )}
                                                    </div>

                                                    {/* Footer Clear */}
                                                    <div className="flex justify-end border-t border-gray-100 pt-2 mt-0.5">
                                                        <button
                                                            onClick={() => {
                                                                setParticipantFilter("");
                                                                setActiveDropdown(null);
                                                            }}
                                                            className="border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700 text-[11px] font-bold px-3 py-1 rounded-md transition-colors cursor-pointer"
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* All Meetings dropdown */}
                                        <div className="relative group">
                                            <button className="flex items-center gap-1 hover:text-gray-600 cursor-pointer">
                                                <span># All Meetings</span>
                                                <ChevronDown size={12} />
                                            </button>
                                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-150 rounded-lg shadow-lg hidden group-hover:block z-50 w-36">
                                                <button className="w-full text-left px-3 py-1.5 hover:bg-gray-50 hover:text-violet-600 transition-colors">All Meetings</button>
                                                <button className="w-full text-left px-3 py-1.5 hover:bg-gray-50 hover:text-violet-600 transition-colors">Shared With Me</button>
                                            </div>
                                        </div>

                                        {/* Time dropdown */}
                                        <div className="relative group">
                                            <button className="flex items-center gap-1 hover:text-gray-600 cursor-pointer">
                                                <span>{timeRangeFilter === "today" ? "Today" : timeRangeFilter === "this_week" ? "This Week" : "Any Time"}</span>
                                                <ChevronDown size={12} />
                                            </button>
                                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-150 rounded-lg shadow-lg hidden group-hover:block z-50 w-36">
                                                <button onClick={() => setTimeRangeFilter("")} className="w-full text-left px-3 py-1.5 hover:bg-gray-50 hover:text-violet-600 transition-colors">Any Time</button>
                                                <button onClick={() => setTimeRangeFilter("today")} className="w-full text-left px-3 py-1.5 hover:bg-gray-50 hover:text-violet-600 transition-colors">Today</button>
                                                <button onClick={() => setTimeRangeFilter("this_week")} className="w-full text-left px-3 py-1.5 hover:bg-gray-50 hover:text-violet-600 transition-colors">This Week</button>
                                            </div>
                                        </div>

                                        {/* Title Only checkbox */}
                                        <label className="flex items-center gap-1.5 cursor-pointer hover:text-gray-600">
                                            <input
                                                type="checkbox"
                                                checked={titleOnlyFilter}
                                                onChange={(e) => setTitleOnlyFilter(e.target.checked)}
                                                className="w-3.5 h-3.5 accent-violet-600 text-violet-600 rounded border-gray-300 cursor-pointer"
                                            />
                                            <span>Meeting Title Only</span>
                                        </label>
                                    </div>

                                    {/* Sort Dropdown */}
                                    <div className="relative group">
                                        <button className="flex items-center gap-1 hover:text-gray-600 cursor-pointer">
                                            <span>{sortOrder === "newest" ? "Newest" : "Oldest"}</span>
                                            <ChevronDown size={12} />
                                        </button>
                                        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-150 rounded-lg shadow-lg hidden group-hover:block z-50 w-28">
                                            <button onClick={() => setSortOrder("newest")} className="w-full text-left px-3 py-1.5 hover:bg-gray-50 hover:text-violet-600 transition-colors">Newest</button>
                                            <button onClick={() => setSortOrder("oldest")} className="w-full text-left px-3 py-1.5 hover:bg-gray-50 hover:text-violet-600 transition-colors">Oldest</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Results area */}
                                <div className="flex-grow overflow-y-auto p-5 flex flex-col gap-4">
                                    {searchLoading ? (
                                        <div className="flex-grow flex items-center justify-center py-12 text-gray-400 select-none">
                                            <span className="text-[13px] font-medium animate-pulse">Searching meetings...</span>
                                        </div>
                                    ) : searchResults.length === 0 ? (
                                        <div className="flex-grow flex flex-col items-center justify-center py-12 text-center text-gray-400 select-none">
                                            <p className="text-[13px] font-medium">No matching meetings found. Try searching by another keyword.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Results Header Count (matches image 2 checkbox count indicator) */}
                                            <div className="flex items-center gap-2 text-[12.5px] font-bold text-gray-400 select-none">
                                                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-violet-600 text-violet-600 rounded border-gray-300 cursor-pointer" />
                                                <span>{searchResults.length} {searchResults.length === 1 ? "meeting" : "meetings"} found</span>
                                            </div>

                                            {/* Results Items List */}
                                            <div className="flex flex-col gap-5 mt-1">
                                                {searchResults.map((res) => {
                                                    const speakerName = res.participants[0] || "Host";
                                                    const initialLetter = speakerName[0].toUpperCase();
                                                    const colors = ["bg-pink-600", "bg-amber-700", "bg-emerald-600", "bg-violet-600", "bg-sky-600"];
                                                    const colorClass = colors[res.id % colors.length];

                                                    const mDate = new Date(res.meeting_date);
                                                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                                    const formattedDate = `${monthNames[mDate.getMonth()]} ${mDate.getDate().toString().padStart(2, "0")}`;
                                                    let hours = mDate.getHours();
                                                    const ampm = hours >= 12 ? 'pm' : 'am';
                                                    hours = hours % 12;
                                                    hours = hours ? hours : 12;
                                                    const formattedTime = `${hours.toString().padStart(2, "0")}:${mDate.getMinutes().toString().padStart(2, "0")} ${ampm}`;

                                                    return (
                                                        <div
                                                            key={res.id}
                                                            onClick={() => {
                                                                setIsSearchOpen(false);
                                                                router.push(`/meetings/${res.id}`);
                                                            }}
                                                            className="flex items-start gap-4 p-1 hover:bg-gray-50/50 rounded-xl transition-all cursor-pointer group/item"
                                                        >
                                                            {/* Host Circle Badge */}
                                                            <div className={`w-8 h-8 rounded-lg ${colorClass} text-white flex items-center justify-center text-[13px] font-bold shadow-sm shrink-0 mt-0.5`}>
                                                                {initialLetter}
                                                            </div>

                                                            {/* Meeting Details */}
                                                            <div className="flex-1 min-w-0 flex flex-col">
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="text-[14px] font-bold text-gray-800 group-hover/item:text-violet-600 transition-colors">
                                                                        {res.title}
                                                                    </h4>
                                                                    {res.instances_count > 0 && (
                                                                        <span className="bg-violet-50 text-violet-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-violet-100 shrink-0">
                                                                            {res.instances_count} {res.instances_count === 1 ? "INSTANCE" : "INSTANCES"}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* Subtitle Host & Date Details */}
                                                                <span className="text-[11.5px] text-gray-400 font-semibold mt-0.5 uppercase tracking-wide">
                                                                    {speakerName} · {formattedDate} · {formattedTime}
                                                                </span>

                                                                {/* Matching Snippets list */}
                                                                {res.matching_segments.length > 0 && (
                                                                    <div className="mt-2.5 pl-3.5 border-l-2 border-gray-150 flex flex-col gap-1.5">
                                                                        {res.matching_segments.slice(0, 2).map((seg: any) => (
                                                                            <p key={seg.id} className="text-[12.5px] leading-relaxed text-gray-600 italic">
                                                                                "...{highlightSnippetText(seg.content, searchQuery)}..."
                                                                            </p>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Feedback bottom bar */}
                                {!searchLoading && searchResults.length > 0 && (
                                    <div className="flex justify-end p-3 px-5 bg-gray-50/20 border-t border-gray-100 shrink-0 select-none">
                                        <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-[12px] font-bold transition-colors cursor-pointer">
                                            <Smile size={13} />
                                            <span>Share Feedback</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
