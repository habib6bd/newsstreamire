"use client";

import { useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const contentClass = useMemo(
    () => "min-h-screen bg-gray-50",
    []
  );

  return (
    <div className={contentClass}>
      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[280px] bg-white shadow-xl">
              <Sidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        {/* Main */}
        <div className="flex-1">
          <Topbar onMenu={() => setOpen(true)} />

          <main className="px-4 md:px-6 lg:px-10 py-6">
            {children}
          </main>

          <div className="text-center text-xs text-gray-500 py-6">
            © 2026 News Stream Admin
          </div>
        </div>
      </div>
    </div>
  );
}
