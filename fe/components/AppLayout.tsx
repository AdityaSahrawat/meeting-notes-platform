"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ paddingLeft: collapsed ? 68 : 228 }}
      >
        {/* Navbar */}
        <Navbar collapsed={collapsed} />

        {/* Page Content */}
        <main className="flex-1 pt-14 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
