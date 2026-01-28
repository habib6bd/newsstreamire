"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ApiCategory = { id: number; name: string };

export default function CreateNewsPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<number | "">("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // simple image support (URL)
  const [imageUrl, setImageUrl] = useState("");

  const [cats, setCats] = useState<ApiCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCats() {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const data = await res.json();
        if (!ignore) setCats(Array.isArray(data) ? data : []);
      } catch {
        if (!ignore) setCats([]);
      }
    }

    loadCats();
    return () => {
      ignore = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required");
    if (!content.trim()) return setError("Content is required");
    if (category === "") return setError("Category is required");

    setSaving(true);

    try {
      const token = localStorage.getItem("access");

      // payload based on your API shape
      const payload: any = {
        title,
        content,
        category,
        is_featured: isFeatured,
        is_published: isPublished,
      };

      // If API accepts image array from URL (common in serializers)
      if (imageUrl.trim()) {
        payload.image = [{ image: imageUrl.trim() }];
      }

      const res = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.detail || data?.message || `API Error: ${res.status}`);
        return;
      }

      // success
      router.push("/admin/news");
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-center text-blue-700">
          নতুন নিউজ যোগ করুন
        </h2>

        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              নিউজের টাইটেল
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="এখানে টাইটেল লিখুন..."
              className="w-full border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              বিস্তারিত কনটেন্ট
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="নিউজের বিস্তারিত লিখুন..."
              rows={10}
              className="w-full border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ক্যাটাগরি
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(Number(e.target.value))}
              className="w-full border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">একটি ক্যাটাগরি নির্বাচন করুন</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image URL (optional)
            </label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              If your backend requires file upload instead, tell me the upload endpoint—then I’ll switch this to file upload.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-5 w-5"
            />
            <label htmlFor="featured" className="text-sm text-gray-700">
              ফিচারড নিউজ (হোম পেজে লিড হিসেবে দেখাবে)
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="published"
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-5 w-5"
            />
            <label htmlFor="published" className="text-sm text-gray-700">
              পাবলিশড
            </label>
          </div>

          <div className="pt-2">
            <button
              disabled={saving}
              className="w-full rounded-md bg-blue-700 text-white py-3 font-bold hover:bg-blue-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "নিউজ তৈরি করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
