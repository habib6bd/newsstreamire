"use client";

import { FaBars } from "react-icons/fa";

export default function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-10 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenu}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Open menu"
          >
            <FaBars />
          </button>
          <h1 className="font-semibold text-gray-900">Admin Panel</h1>
        </div>

        <div className="text-sm text-gray-500">
          News Stream        
          </div>
      </div>
    </header>
  );
}
