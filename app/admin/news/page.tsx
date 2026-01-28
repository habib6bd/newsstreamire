"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ApiNews = {
  id: number;
  title: string;
  category: number;
  is_published: boolean;
  created_at: string;
};

type NewsApiResponse = {
  results: ApiNews[];
};

function formatBnDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("bn-BD");
  } catch {
    return iso;
  }
}

export default function AdminNewsList() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<ApiNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/news", { cache: "no-store" });
        const data: NewsApiResponse = await res.json();
        if (!ignore) setRows(data?.results || []);
      } catch {
        if (!ignore) setRows([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((n) => (n.title || "").toLowerCase().includes(s));
  }, [q, rows]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-bold text-gray-900">সব নিউজ ম্যানেজ করুন</h2>

        <Link
          href="/admin/news/create"
          className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          নিউজ যোগ করুন
        </Link>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="নিউজের টাইটেল দিয়ে সার্চ করুন..."
          className="w-full max-w-xl border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-[900px] w-full">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="text-left px-4 py-3">টাইটেল</th>
              <th className="text-left px-4 py-3">ক্যাটাগরি</th>
              <th className="text-left px-4 py-3">স্ট্যাটাস</th>
              <th className="text-left px-4 py-3">তারিখ</th>
              <th className="text-left px-4 py-3">অ্যাকশন</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : filtered.length ? (
              filtered.map((n) => (
                <tr key={n.id} className="border-t">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {n.title}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    #{n.category}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        n.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {n.is_published ? "পাবলিশড" : "ড্রাফট"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatBnDate(n.created_at)}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link
                      href={`/news-detail/${n.id}`}
                      className="px-3 py-1 rounded-md bg-yellow-400 text-black text-sm font-semibold"
                    >
                      ভিউ
                    </Link>
                    <button className="px-3 py-1 rounded-md bg-sky-500 text-white text-sm font-semibold">
                      এডিট
                    </button>
                    <button className="px-3 py-1 rounded-md bg-rose-500 text-white text-sm font-semibold">
                      ডিলিট
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={5}>
                  No news found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
