"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type ApiImage = { id: number; image: string };

type ApiNewsDetail = {
  id: number;
  title: string;
  content: string;
  category: number;
  url: string;
  image: ApiImage[];
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

type ApiCategory = {
  id: number;
  name: string;
};

function stripHtml(html: string) {
  return (html || "").replace(/<[^>]*>/g, "").trim();
}

function getTokenFromStorage() {
  // ✅ adjust these keys if you store token differently
  return (
    localStorage.getItem("access") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    ""
  );
}

export default function AdminEditNewsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState<string>("");

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [original, setOriginal] = useState<ApiNewsDetail | null>(null);

  // form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<number | "">("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const categoryName = useMemo(() => {
    if (!original) return "";
    return categories.find((c) => c.id === original.category)?.name || "";
  }, [categories, original]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        // ✅ fetch both (news + categories)
        const [newsRes, catRes] = await Promise.all([
          fetch(`/api/news/${id}`, { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        if (!newsRes.ok) {
          throw new Error(`News API Error: ${newsRes.status}`);
        }
        if (!catRes.ok) {
          throw new Error(`Category API Error: ${catRes.status}`);
        }

        const newsData: ApiNewsDetail = await newsRes.json();
        const catData: ApiCategory[] = await catRes.json();

        if (ignore) return;

        setCategories(catData || []);
        setOriginal(newsData);

        // fill form
        setTitle(newsData.title || "");
        setContent(newsData.content || "");
        setCategory(newsData.category ?? "");
        setIsFeatured(!!newsData.is_featured);
        setIsPublished(!!newsData.is_published);
      } catch (e: any) {
        if (!ignore) setError(e?.message || "Failed to load");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [id]);

  async function onSave() {
    if (!id || !original) return;

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!content.trim()) {
      setError("Content is required.");
      return;
    }
    if (category === "") {
      setError("Please select a category.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // ✅ Keep fields that PUT might require
      const payload = {
        title: title.trim(),
        content,
        category: Number(category),
        url: original.url, // keep from existing
        image: original.image || [], // keep existing images
        is_featured: isFeatured,
        is_published: isPublished,
        published_at: original.published_at, // keep existing
      };

      const token = getTokenFromStorage();

      const res = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.detail || data?.message || `Update failed: ${res.status}`);
      }

      // ✅ go back to list
      router.push("/admin/news");
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!id) return;

    const ok = window.confirm("Are you sure you want to delete this news?");
    if (!ok) return;

    setDeleting(true);
    setError("");

    try {
      const token = getTokenFromStorage();

      const res = await fetch(`/api/news/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!(res.ok || res.status === 204)) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || data?.message || `Delete failed: ${res.status}`);
      }

      router.push("/admin/news");
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-4">
        <div className="h-8 w-56 bg-gray-100 rounded" />
        <div className="h-44 bg-gray-100 rounded-xl" />
        <div className="h-44 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!original) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="rounded-xl border bg-white p-6">
          <h1 className="text-xl font-bold text-gray-900">News not found</h1>
          <p className="text-gray-600 mt-2">This news item may have been deleted.</p>
          <Link
            href="/admin/news"
            className="inline-flex mt-4 px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Back to list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">নিউজ এডিট করুন</h1>
          <p className="text-sm text-gray-600 mt-1">
            বর্তমান ক্যাটাগরি:{" "}
            <span className="font-semibold text-gray-900">
              {categoryName || `#${original.category}`}
            </span>
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/news-detail/${original.id}`}
            className="px-4 py-2 rounded-md bg-yellow-400 text-black font-semibold hover:brightness-95"
          >
            ভিউ
          </Link>

          <Link
            href="/admin/news"
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200"
          >
            লিস্টে ফিরে যান
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
          {error}
        </div>
      ) : null}

      {/* Form Card */}
      <div className="mt-5 rounded-2xl border bg-white p-5 md:p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              নিউজের টাইটেল
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="এখানে টাইটেল লিখুন..."
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              বিস্তারিত কন্টেন্ট
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="নিউজের বিস্তারিত লিখুন..."
              rows={10}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              প্রিভিউ: {stripHtml(content).slice(0, 140) || "—"}
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              ক্যাটাগরি
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value ? Number(e.target.value) : "")}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">একটি ক্যাটাগরি নির্বাচন করুন</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Flags */}
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-5 w-5"
              />
              <div>
                <p className="font-semibold text-gray-900">ফিচার্ড নিউজ</p>
                <p className="text-xs text-gray-600">হোম পেজে হিরো হিসেবে দেখাবে</p>
              </div>
            </label>

            <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-5 w-5"
              />
              <div>
                <p className="font-semibold text-gray-900">পাবলিশড</p>
                <p className="text-xs text-gray-600">অফ থাকলে ড্রাফট থাকবে</p>
              </div>
            </label>
          </div>

          {/* Current Image preview */}
          <div className="rounded-xl border p-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              বর্তমান ছবি (Preview)
            </p>
            <div className="w-full overflow-hidden rounded-xl border bg-gray-100">
              {/* using normal img avoids next/image domain config issues */}
              <img
                src={original.image?.[0]?.image || "/images/card-fallback.jpg"}
                alt="preview"
                className="w-full h-[220px] object-cover"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              (ইমেজ আপডেট করতে চাইলে আলাদা image upload/URL field যোগ করতে হবে।)
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
            <button
              onClick={onDelete}
              disabled={deleting}
              className="px-5 py-3 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "ডিলিট"}
            </button>

            <div className="flex gap-2">
              <Link
                href="/admin/news"
                className="px-5 py-3 rounded-lg bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200"
              >
                Cancel
              </Link>

              <button
                onClick={onSave}
                disabled={saving}
                className="px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "আপডেট করুন"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
