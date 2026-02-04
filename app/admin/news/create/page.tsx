"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ApiCategory = { id: number; name: string };

export default function CreateNewsPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<number | "">("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // ✅ File upload (single or multiple)
  const [files, setFiles] = useState<File[]>([]);

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

  const previews = useMemo(() => {
    return files.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
      size: f.size,
      type: f.type,
    }));
  }, [files]);

  useEffect(() => {
    // cleanup object urls
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files || []);
    if (!list.length) return;

    // ✅ Only images
    const onlyImages = list.filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...onlyImages]);

    // allow selecting same file again
    e.target.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required");
    if (!content.trim()) return setError("Content is required");
    if (category === "") return setError("Category is required");

    setSaving(true);

    try {
      const token = localStorage.getItem("access");

      // 1) ✅ Create news first
      const payload = {
        title: title.trim(),
        content: content.trim(),
        category,
        is_featured: isFeatured,
        is_published: isPublished,
      };

      const createRes = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const created = await createRes.json().catch(() => ({}));

      if (!createRes.ok) {
        setError(created?.detail || created?.message || `API Error: ${createRes.status}`);
        return;
      }

      const newsId = created?.id;
      if (!newsId) {
        setError("News created, but no ID returned from API.");
        return;
      }

      // 2) ✅ Upload selected images (if any)
      if (files.length) {
        for (const file of files) {
          const fd = new FormData();
          // Swagger shows field name: "image"
          fd.append("image", file, file.name);

          const upRes = await fetch(`/api/news/${newsId}/images`, {
            method: "POST",
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: fd,
          });

          const upText = await upRes.text();
          let upData: any = {};
          try {
            upData = upText ? JSON.parse(upText) : {};
          } catch {
            upData = { raw: upText };
          }

          if (!upRes.ok) {
            setError(
              upData?.detail ||
              upData?.message ||
              upData?.image?.[0] ||        // ✅ DRF often returns { image: ["..."] }
              upData?.non_field_errors?.[0] ||
              `Image upload failed (status ${upRes.status})`
            );
            return;
          }

        }
      }

      // ✅ Done
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
              onChange={(e) => setCategory(e.target.value ? Number(e.target.value) : "")}
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

          {/* ✅ IMAGE UPLOAD */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ছবি আপলোড করুন (এক বা একাধিক)
            </label>

            <div className="flex items-center gap-3 flex-wrap">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black">
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onPickFiles}
                  className="hidden"
                />
              </label>

              <p className="text-xs text-gray-500">
                PNG/JPG/WebP — multiple files supported
              </p>
            </div>

            {files.length ? (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {previews.map((p, i) => (
                  <div key={p.url} className="relative rounded-lg border overflow-hidden">
                    {/* preview */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={p.name} className="h-28 w-full object-cover" />

                    <div className="p-2">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-1">
                        {p.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="mt-2 w-full rounded-md bg-rose-500 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 rounded-md border border-dashed p-4 text-sm text-gray-500">
                কোনো ছবি সিলেক্ট করা হয়নি।
              </div>
            )}
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
              {saving ? "Saving..." : "নিউজ তৈরি করুন & ছবি আপলোড করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
