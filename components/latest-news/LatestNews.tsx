"use client";

import Image from "next/image";

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
  return text.split(" ").slice(0, count).join(" ") + "...";
};

export default function LatestNewsPage() {
  const latest: LatestNewsCard[] = [
    {
      id: 1,
      category: "বাংলাদেশ",
      time: "৩৬ মিনিট আগে",
      title: "ভারতকে হারানোর ২ কোটি টাকা পুরস্কার ঘোষণা",
      description: "ভারতের বিপক্ষে ঐতিহাসিক জয়ের পর বাংলাদেশ দলের জন্য বড় পুরস্কারের ঘোষণা দেওয়া হয়েছিল...",
      image: "/images/card1.jpg"
    },
    {
      id: 2,
      category: "বাংলাদেশ",
      time: "৩০ মিনিট আগে",
      title: "মধ্যরাতে গুলিস্তানে মার্কেটে আগুন",
      description: "রাজধানীর গুলিস্তান এলাকায় দোকান ভর্তি মার্কেটে বড় ধরনের আগুন লাগে...",
      image: "/images/card2.jpg"
    },
    {
      id: 3,
      category: "বাংলাদেশ",
      time: "৫৬ মিনিট আগে",
      title: "আগারগাঁওয়ে দাঁড়িয়ে থাকা গাড়িতে আগুন",
      description: "রাজধানীর আগারগাঁও এলাকায় একটি গাড়িতে সন্ধ্যাবেলায় অগ্নিকাণ্ডের ঘটনা ঘটে...",
      image: "/images/card3.jpg"
    },
    {
      id: 4,
      category: "খেলা",
      time: "১ ঘণ্টা আগে",
      title: "এফএ কাপ জয়ের চেয়েও বেশি আনন্দিত ভারত",
      description: "ফুটবলে বড় জয়ের পর ভারতীয় সমর্থকদের মধ্যে ব্যাপক উৎসব পালিত হচ্ছে...",
     image: "/images/card1.jpg"
    },
    {
      id: 5,
      category: "রাজনীতি",
      time: "২ ঘণ্টা আগে",
      title: "ভারতের বিপক্ষে জয়ের পর ফুটবলাদের প্রশংসায় মেতে",
      description: "ভারতের বিপক্ষে জয়ের পর রাজনীতিবিদরাও অভিনন্দন জানিয়েছেন...",
      image: "/images/card1.jpg"
    },
    {
      id: 6,
      category: "শিক্ষা",
      time: "২ ঘণ্টা আগে",
      title: "ব্রাক নির্বাচন নিয়ে তফসিল ঘোষণা",
      description: "বাংলাদেশ শিক্ষা বোর্ড জাতীয় নির্বাচনের নতুন তফসিল ঘোষণা দিয়েছে...",
      image: "/images/card1.jpg"
    }
  ];

  const mostRead: MostReadCard[] = [
    {
      id: 1,
      category: "বাংলাদেশ",
      time: "১ দিন আগে",
      title: "শেখ হাসিনার মৃত্যুদণ্ড নিয়ে যা বলল জাতিসংঘ",
      image: "/images/card1.jpg"
    },
    {
      id: 2,
      category: "আন্তর্জাতিক",
      time: "১ দিন আগে",
      title: "বিশ্ব রাজনীতিতে নতুন পরিবর্তন আসছে",
      image: "/images/card1.jpg"
    },
    {
      id: 3,
      category: "আন্তর্জাতিক",
      time: "১ দিন আগে",
      title: "নতুন সিদ্ধান্ত নিয়ে উদ্বেগ বাড়ছে",
     image: "/images/card1.jpg"
    },
    {
      id: 4,
      category: "আন্তর্জাতিক",
      time: "১ দিন আগে",
      title: "হাসিনাকে হস্তান্তর করবে না ভারত",
      image: "/images/card1.jpg"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-10">

      {/* ---------- SECTION HEAD ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* ---------------- LEFT: সর্বশেষ সময় ---------------- */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-3 border-b pb-2 border-red-300">
            সর্বশেষ সময়
          </h2>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((item) => (
              <div key={item.id} className="rounded-lg shadow-sm p-4 hover:shadow-md transition">
                
                <p className="text-red-500 text-xs font-medium">{item.category}</p>
                <p className="text-gray-500 text-xs mb-2">{item.time}</p>

                <div className="w-full h-40 relative rounded-md overflow-hidden mb-3">
                  <Image src={item.image} alt="" fill className="object-cover" />
                </div>

                <h3 className="font-semibold text-lg leading-snug mb-2">
                  {sliceWords(item.title, 10)}
                </h3>

                <p className="text-sm text-gray-700">
                  {sliceWords(item.description, 10)}
                </p>
              </div>
            ))}
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
            {mostRead.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-lg p-3 shadow-sm hover:shadow-md transition">
                
                <div className="w-28 h-20 relative rounded overflow-hidden">
                  <Image src={item.image} alt="" fill className="object-cover" />

                  <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1 py-[1px] rounded">
                    {item.time}
                  </span>
                </div>

                {/* TEXT AREA */}
                <div className="flex-1">
                  <p className="text-red-500 text-xs font-medium">{item.category}</p>

                  <h3 className="font-semibold text-sm mt-1">
                    {sliceWords(item.title, 10)}
                  </h3>
                </div>
              </div>
            ))}
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
