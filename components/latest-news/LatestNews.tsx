"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type ApiImage = { id: number; image: string };

type ApiNews = {
  id: number;
  title: string;
  content: string;
  category: number;
  image: ApiImage[];
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
};

type NewsApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiNews[];
};

type ApiCategory = {
  id: number;
  name: string;
};

interface LatestNewsCard {
  id: number;
  category: string;
  time: string;
  title: string;
  description: string;
  image: string;
}

interface MostReadCard {
  id: number;
  category: string;
  time: string;
  title: string;
  image: string;
}

const sliceWords = (text: string, count: number) => {
  const clean = text.replace(/<[^>]*>/g, "").trim();
  const parts = clean.split(/\s+/);
  return parts.length > count ? parts.slice(0, count).join(" ") + "..." : clean;
};

function timeAgoBn(iso: string) {
  const t = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - t) / 1000));
  const mins = Math.floor(diffSec / 60);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (days > 0) return `${days} দিন আগে`;
  if (hrs > 0) return `${hrs} ঘণ্টা আগে`;
  if (mins > 0) return `${mins} মিনিট আগে`;
  return "এইমাত্র";
}

export default function LatestNewsPage() {
  const [latest, setLatest] = useState<LatestNewsCard[]>([]);
  const [mostRead, setMostRead] = useState<MostReadCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setLoading(true);

        const [newsRes, catRes] = await Promise.all([
          fetch("/api/news", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        if (!newsRes.ok) throw new Error(`News API Error: ${newsRes.status}`);
        if (!catRes.ok) throw new Error(`Category API Error: ${catRes.status}`);

        const newsData: NewsApiResponse = await newsRes.json();
        const categories: ApiCategory[] = await catRes.json();

        const categoryMap = new Map<number, string>();
        categories.forEach((c) => categoryMap.set(c.id, c.name));

        const published = newsData.results.filter((n) => n.is_published);
        const list = published.length ? published : newsData.results;

        const sorted = [...list].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // Latest 6
        const latestCards: LatestNewsCard[] = sorted.slice(0, 6).map((n) => ({
          id: n.id,
          category: categoryMap.get(n.category) || `Category ${n.category}`,
          time: timeAgoBn(n.created_at),
          title: n.title || "",
          description: n.content || "",
          image: n.image?.[0]?.image || "/images/newsstream_logo.jpeg",
        }));

        // Most read (featured first)
        const featured = sorted.filter((n) => n.is_featured);
        const filler = sorted.filter((n) => !n.is_featured);
        const mostReadSource = [...featured, ...filler].slice(0, 4);

        const mostReadCards: MostReadCard[] = mostReadSource.map((n) => ({
          id: n.id,
          category: categoryMap.get(n.category) || `Category ${n.category}`,
          time: timeAgoBn(n.created_at),
          title: n.title || "",
          image: n.image?.[0]?.image || "/images/newsstream_logo.jpeg",
        }));

        if (!ignore) {
          setLatest(latestCards);
          setMostRead(mostReadCards);
        }
      } catch (e) {
        console.error(e);
        if (!ignore) {
          setLatest([]);
          setMostRead([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const latestSkeleton = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);
  const mostReadSkeleton = useMemo(() => Array.from({ length: 4 }, (_, i) => i), []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ---------------- LEFT: সর্বশেষ সময় ---------------- */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-3 border-b pb-2 border-red-300">
            সর্বশেষ সময়
          </h2>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(loading ? latestSkeleton : latest).map((item: any, idx: number) => {
              const href = loading ? "#" : `/news-detail/${item.id}`;

              return (
                <Link
                  key={loading ? `sk-${idx}` : item.id}
                  href={href}
                  className="rounded-lg shadow-sm p-4 hover:shadow-md transition cursor-pointer block"
                >
                  <p className="text-red-500 text-xs font-medium">
                    {loading ? "\u00A0" : item.category}
                  </p>
                  <p className="text-gray-500 text-xs mb-2">
                    {loading ? "\u00A0" : item.time}
                  </p>

                  <div className="w-full h-40 relative rounded-md overflow-hidden mb-3 bg-gray-100">
                    <Image
                      src={loading ? "/images/newsstream_logo.jpeg" : item.image}
                      alt={loading ? "" : item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h3 className="font-semibold text-lg leading-snug mb-2">
                    {loading ? "\u00A0" : sliceWords(item.title, 10)}
                  </h3>

                  <p className="text-sm text-gray-700">
                    {loading ? "\u00A0" : sliceWords(item.description, 10)}
                  </p>
                </Link>
              );
            })}
          </div>

          {/* BUTTON */}
          <div className="flex justify-center mt-6">
            <button className="border border-red-400 text-red-500 px-6 py-2 rounded-md font-medium hover:bg-red-50 transition">
              আরও সর্বশেষ সময়
            </button>
          </div>
        </div>

        {/* ---------------- RIGHT: সর্বাধিক পঠিত সময় ---------------- */}
        <div>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2 border-red-300">
            সর্বাধিক পঠিত সময়
          </h2>

          <div className="flex flex-col gap-5">
            {(loading ? mostReadSkeleton : mostRead).map((item: any, idx: number) => {
              const href = loading ? "#" : `/news-detail/${item.id}`;

              return (
                <Link
                  key={loading ? `sk2-${idx}` : item.id}
                  href={href}
                  className="flex gap-4 rounded-lg p-3 shadow-sm hover:shadow-md transition cursor-pointer block"
                >
                  <div className="w-28 h-20 relative rounded overflow-hidden bg-gray-100">
                    <Image
                      src={loading ? "/images/newsstream_logo.jpeg" : item.image}
                      alt={loading ? "" : item.title}
                      fill
                      className="object-cover"
                    />

                    <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1 py-[1px] rounded">
                      {loading ? "\u00A0" : item.time}
                    </span>
                  </div>

                  <div className="flex-1">
                    <p className="text-red-500 text-xs font-medium">
                      {loading ? "\u00A0" : item.category}
                    </p>

                    <h3 className="font-semibold text-sm mt-1">
                      {loading ? "\u00A0" : sliceWords(item.title, 10)}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* BUTTON */}
          <div className="flex justify-center mt-6">
            <button className="border border-red-400 text-red-500 px-6 py-2 rounded-md font-medium hover:bg-red-50 transition">
              সর্বাধিক পঠিত সময়
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
