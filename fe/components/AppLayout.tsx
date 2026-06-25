"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 68 : 228;

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <Navbar collapsed={collapsed} />
        <main className="flex-1 overflow-hidden mt-14 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
