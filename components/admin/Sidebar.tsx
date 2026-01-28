"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaNewspaper,
  FaPlusCircle,
  FaTags,
  FaCommentDots,
  FaUsers,
} from "react-icons/fa";

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const item = (href: string) => {
    const active = pathname === href;
    return `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;
  };

  return (
    <aside className="h-screen w-[280px] border-r bg-white">
      <div className="px-5 py-5 border-b">
        <h2 className="text-xl font-bold text-gray-900">অ্যাডমিন ড্যাশবোর্ড</h2>
      </div>

      <nav className="px-4 py-4 space-y-1">
        <Link onClick={onNavigate} href="/admin" className={item("/admin")}>
          <FaHome />
          <span>ড্যাশবোর্ড</span>
        </Link>

        <Link onClick={onNavigate} href="/admin/news" className={item("/admin/news")}>
          <FaNewspaper />
          <span>সব নিউজ</span>
        </Link>

        <Link
          onClick={onNavigate}
          href="/admin/news/create"
          className={item("/admin/news/create")}
        >
          <FaPlusCircle />
          <span>নিউজ যোগ করুন</span>
        </Link>

        {/* placeholders */}
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed w-full">
          <FaTags />
          <span>ক্যাটাগরি</span>
        </button>

        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed w-full">
          <FaCommentDots />
          <span>কমেন্ট</span>
        </button>

        <Link onClick={onNavigate} href="/admin/users" className={item("/admin/users")}>
          <FaUsers />
          <span>ইউজার</span>
        </Link>
      </nav>
    </aside>
  );
}
