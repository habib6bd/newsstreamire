"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FaSearch, FaPlay } from "react-icons/fa";

type ApiCategory = {
  id: number;
  name: string;
  // news exists but we don't need it for navbar
  news?: unknown[];
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // FIXED: Prevent hydration mismatch by rendering date only on client
  const [currentDate, setCurrentDate] = useState<string>("");

  // ✅ categories state
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [catLoading, setCatLoading] = useState<boolean>(true);

  useEffect(() => {
    const formatted = new Date().toLocaleDateString("bn-BD", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDate(formatted);
  }, []);

  // ✅ fetch categories
  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        setCatLoading(true);

        const res = await fetch("/api/categories", { cache: "no-store" });
        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const data: ApiCategory[] = await res.json();

        // Keep order as API returns; remove empty names; optional: unique by id
        const cleaned = (data || []).filter((c) => c?.name?.trim());

        if (!ignore) setCategories(cleaned);
      } catch (e) {
        console.error(e);
        if (!ignore) setCategories([]);
      } finally {
        if (!ignore) setCatLoading(false);
      }
    }

    loadCategories();
    return () => {
      ignore = true;
    };
  }, []);

  // ✅ split categories: show first 7 as main, rest under "আরও"
  const MAIN_COUNT = 7;

  const mainCats = useMemo(
    () => categories.slice(0, MAIN_COUNT),
    [categories]
  );
  const moreCats = useMemo(
    () => categories.slice(MAIN_COUNT),
    [categories]
  );

  // Optional: click behavior placeholder (later you can route to /category/[id] or /category/[slug])
  const onCategoryClick = (cat: ApiCategory) => {
    // Example later:
    // router.push(`/category/${cat.id}`)
    console.log("Category clicked:", cat);
    setMenuOpen(false);
  };

  return (
    <div className="w-full shadow-sm bg-white">
      {/* -------- TOP BAR -------- */}
      <div className="flex justify-between items-center px-4 lg:px-10 py-3 flex-wrap gap-4">
        {/* Logo + Search */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <Image
            src="/images/newsstream_logo.jpeg"
            width={60}
            height={60}
            alt="Logo"
          />

          <div className="flex items-center w-full border rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="নিউজ খুঁজুন"
              className="px-4 py-2 w-full outline-none text-sm"
            />
            <button className="bg-black text-white px-4 py-2">
              <FaSearch size={16} />
            </button>
          </div>
        </div>

        {/* Date (client only) */}
        <div className="text-sm text-gray-700 w-full lg:w-auto text-right">
          {currentDate || "\u00A0"}
        </div>
      </div>

      {/* -------- MIDDLE BUTTONS -------- */}
      <div className="flex justify-between items-center px-4 lg:px-10 py-2">
        {/* Left Buttons */}
        <div className="flex items-center gap-3">
          <button className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            সর্বশেষ সংবাদ
          </button>

          <button className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold">
            <FaPlay />
            ভিডিও সংবাদ
          </button>
        </div>

        {/* Right Button */}
        <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
          <FaPlay />
          লাইভ টিভি
        </button>
      </div>

      {/* -------- NAVBAR MENU -------- */}
      <div className="w-full bg-black text-white">
        <div className="flex justify-between items-center px-4 lg:px-10 py-3">
          {/* MAIN MENU ITEMS */}
          <div className="hidden lg:flex gap-8 text-sm font-medium items-center">
            {/* Loading placeholders keep spacing stable */}
            {catLoading && (
              <>
                <span className="opacity-60">লোড হচ্ছে...</span>
              </>
            )}

            {!catLoading &&
              mainCats.map((cat) => (
                <span
                  key={cat.id}
                  className="cursor-pointer hover:text-red-400"
                  onClick={() => onCategoryClick(cat)}
                >
                  {cat.name}
                </span>
              ))}

            {/* Dropdown: show only if we have extra categories */}
            {!catLoading && moreCats.length > 0 && (
              <div className="relative group">
                <button className="bg-gray-700 px-3 py-1 rounded-md flex items-center gap-1">
                  আরও ▼
                </button>

                <div className="absolute left-0 top-full mt-2 bg-gray-900 text-white rounded-md shadow-lg p-3 hidden group-hover:block min-w-40">
                  {moreCats.map((cat) => (
                    <p
                      key={cat.id}
                      className="hover:text-red-400 cursor-pointer mb-2 last:mb-0"
                      onClick={() => onCategoryClick(cat)}
                    >
                      {cat.name}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* LANGUAGE */}
          <div className="flex items-center gap-2">
            <span className="text-sm">EN</span>
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="lg:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU LIST */}
        {menuOpen && (
          <div className="lg:hidden bg-gray-900 p-4 flex flex-col gap-3 text-sm">
            {catLoading && <span className="opacity-60">লোড হচ্ছে...</span>}

            {!catLoading &&
              categories.map((cat) => (
                <span
                  key={cat.id}
                  className="cursor-pointer hover:text-red-400"
                  onClick={() => onCategoryClick(cat)}
                >
                  {cat.name}
                </span>
              ))}

            {!catLoading && categories.length === 0 && (
              <span className="opacity-60">ক্যাটেগরি পাওয়া যায়নি</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
