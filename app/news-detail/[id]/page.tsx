"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

type ApiImage = { id: number; image: string };

type ApiNewsDetail = {
  id: number;
  title: string;
  content: string;
  category: number;
  image: ApiImage[];
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  url: string;
  published_at: string | null;
};

type ApiCategory = { id: number; name: string };

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

function formatBnDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function cleanText(text: string) {
  return (text || "").replace(/<[^>]*>/g, "").trim();
}

export default function NewsDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [news, setNews] = useState<ApiNewsDetail | null>(null);
  const [categoryName, setCategoryName] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!id) return;

      try {
        setLoading(true);
        setNotFound(false);

        const [newsRes, catRes] = await Promise.all([
          fetch(`/api/news/${id}`, { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        if (!newsRes.ok) {
          if (newsRes.status === 404) setNotFound(true);
          throw new Error(`News API Error: ${newsRes.status}`);
        }

        if (!catRes.ok) throw new Error(`Category API Error: ${catRes.status}`);

        const newsData: ApiNewsDetail = await newsRes.json();
        const categories: ApiCategory[] = await catRes.json();

        const map = new Map<number, string>();
        categories.forEach((c) => map.set(c.id, c.name));

        if (!ignore) {
          setNews(newsData);
          setCategoryName(map.get(newsData.category) || `Category ${newsData.category}`);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [id]);

  const coverImage = useMemo(() => {
    if (!news) return "/images/hero.jpg";
    return news.image?.[0]?.image || "/images/hero.jpg";
  }, [news]);

  const contentLines = useMemo(() => {
    const text = cleanText(news?.content || "");
    // API has \r\n — split into paragraphs
    return text.split(/\r?\n+/).filter(Boolean);
  }, [news]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-10 py-10">
        <div className="animate-pulse">
          <div className="h-7 w-40 bg-gray-200 rounded mb-4" />
          <div className="h-10 w-full bg-gray-200 rounded mb-6" />
          <div className="h-[260px] md:h-[420px] w-full bg-gray-200 rounded-2xl mb-8" />
          <div className="h-4 w-2/3 bg-gray-200 rounded mb-3" />
          <div className="h-4 w-5/6 bg-gray-200 rounded mb-3" />
          <div className="h-4 w-4/6 bg-gray-200 rounded mb-3" />
        </div>
      </div>
    );
  }

  if (notFound || !news) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-10 py-16">
        <div className="bg-white border rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">সংবাদটি পাওয়া যায়নি</h1>
          <p className="text-gray-600">দয়া করে আবার চেষ্টা করুন অথবা অন্য সংবাদ দেখুন।</p>
        </div>
      </div>
    );
  }

  const publishedISO = news.published_at || news.created_at;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-12">
      {/* Top meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="inline-flex items-center rounded-full bg-red-50 text-red-600 px-3 py-1 text-xs font-semibold">
          {categoryName}
        </span>

        {news.is_featured && (
          <span className="inline-flex items-center rounded-full bg-yellow-50 text-yellow-700 px-3 py-1 text-xs font-semibold">
            ফিচার্ড
          </span>
        )}

        <span className="text-xs text-gray-500">
          {timeAgoBn(publishedISO)} • {formatBnDate(publishedISO)}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-extrabold leading-tight text-gray-900 mb-6">
        {news.title}
      </h1>

      {/* Cover image */}
      <div className="relative w-full h-[240px] sm:h-[320px] md:h-[440px] rounded-2xl overflow-hidden shadow-sm mb-8">
        <Image src={coverImage} alt={news.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
      </div>

      {/* Content + Sidebar layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main content */}
        <article className="lg:col-span-8">
          <div className="bg-white border rounded-2xl p-5 md:p-7">
            <div className="prose prose-sm md:prose-base max-w-none prose-p:leading-8">
              {contentLines.map((p, i) => (
                <p key={i} className="text-gray-800">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Quick info card */}
          <div className="bg-white border rounded-2xl p-5">
            <h3 className="text-base font-semibold mb-3">সংবাদ তথ্য</h3>

            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">ক্যাটেগরি</span>
                <span className="font-medium">{categoryName}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-500">প্রকাশ</span>
                <span className="font-medium">{formatBnDate(publishedISO)}</span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-gray-500">আপডেট</span>
                <span className="font-medium">{formatBnDate(news.updated_at)}</span>
              </div>

              {/* <div className="pt-3 border-t">
                <a
                  href={news.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-600 hover:text-red-700 font-semibold text-sm"
                >
                  API লিংক দেখুন →
                </a>
              </div> */}
            </div>
          </div>

          {/* Sticky CTA */}
          <div className="bg-black text-white rounded-2xl p-5">
            <h3 className="text-lg font-bold mb-2">আরও আপডেট পেতে</h3>
            <p className="text-sm text-white/80 mb-4">
              সর্বশেষ সংবাদ নিয়মিত পেতে আমাদের সাথে থাকুন।
            </p>
            <button className="w-full bg-red-500 hover:bg-red-600 transition text-white font-semibold py-2.5 rounded-xl">
              সাবস্ক্রাইব
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
