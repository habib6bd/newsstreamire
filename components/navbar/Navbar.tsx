"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaSearch, FaPlay } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // FIXED: Prevent hydration mismatch by rendering date only on client
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const formatted = new Date().toLocaleDateString("bn-BD", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDate(formatted);
  }, []);

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
          {currentDate || "\u00A0" /* keeps layout stable */}
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
          <div className="hidden lg:flex gap-8 text-sm font-medium">
            <span className="cursor-pointer hover:text-red-400">বাংলাদেশ</span>
            <span className="cursor-pointer hover:text-red-400">রাজনীতি</span>
            <span className="cursor-pointer hover:text-red-400">আন্তর্জাতিক</span>
            <span className="cursor-pointer hover:text-red-400">খেলা</span>
            <span className="cursor-pointer hover:text-red-400">বিনোদন</span>
            <span className="cursor-pointer hover:text-red-400">স্বাস্থ্য</span>
            <span className="cursor-pointer hover:text-red-400">বাণিজ্য</span>

            {/* Dropdown */}
            <div className="relative group">
              <button className="bg-gray-700 px-3 py-1 rounded-md flex items-center gap-1">
                আরও ▼
              </button>

              <div className="absolute left-0 top-full mt-2 bg-gray-900 text-white rounded-md shadow-lg p-3 hidden group-hover:block">
                <p className="hover:text-red-400 cursor-pointer mb-2">টেক</p>
                <p className="hover:text-red-400 cursor-pointer mb-2">জীবনধারা</p>
                <p className="hover:text-red-400 cursor-pointer">ফিচার</p>
              </div>
            </div>
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
            <span>বাংলাদেশ</span>
            <span>রাজনীতি</span>
            <span>আন্তর্জাতিক</span>
            <span>খেলা</span>
            <span>বিনোদন</span>
            <span>স্বাস্থ্য</span>
            <span>বাণিজ্য</span>
            <span>আরও...</span>
          </div>
        )}
      </div>
    </div>
  );
}
