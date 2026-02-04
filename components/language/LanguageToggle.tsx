"use client";

import { useState } from "react";

export default function LanguageToggle() {
  const [lang, setLang] = useState<"bn" | "en">("bn");

  const switchLang = (next: "bn" | "en") => {
    const select =
      document.querySelector<HTMLSelectElement>(".goog-te-combo");

    if (!select) return;

    select.value = next;
    select.dispatchEvent(new Event("change"));
    setLang(next);
  };

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-gray-300 p-1 bg-white notranslate"
      translate="no"
    >
      {/* 🇧🇩 Bangla */}
      <button
        type="button"
        onClick={() => switchLang("bn")}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold transition
          ${
            lang === "bn"
              ? "bg-red-500 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        🇧🇩 BN
      </button>

      {/* 🇬🇧 English */}
      <button
        type="button"
        onClick={() => switchLang("en")}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold transition
          ${
            lang === "en"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}
