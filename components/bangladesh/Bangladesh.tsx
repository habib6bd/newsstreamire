"use client";

import Image from "next/image";

interface NewsItem {
    id: number;
    category: string;
    subcat?: string;
    time: string;
    title: string;
    description: string;
    image: string;
}

const truncate = (text: string, count: number) =>
    text.split(" ").slice(0, count).join(" ") + "...";

export default function BangladeshSection() {
    // LEFT BIG NEWS
    const bigNews: NewsItem = {
        id: 1,
        category: "বাংলাদেশ",
        subcat: "ঢাকা",
        time: "১৭ ঘন্টা ৪৩ মিনিট, ১৯ নভেম্বর ২০২৫",
        title: "ডেঙ্গু কেড়ে নিল আরও ৬ প্রাণ, একদিনে হাসপাতালে ৭৮৮",
        description:
            "ডেঙ্গু আক্রান্ত হয়ে গত ২৪ ঘণ্টায় ৭৮৮ জন হাসপাতালে ভর্তি হয়েছেন। এ সময়ে ডেঙ্গু আক্রান্ত হয়ে মারা গেছেন হায়রান।",
        image: "/images/card1.jpg",
    };

    // Right Top Row (3 cards)
    const rightTop: NewsItem[] = [
        {
            id: 2,
            category: "বাংলাদেশ",
            subcat: "ঢাকা",
            time: "৮ ঘন্টা আগে",
            title: "‘শুটার জনি’র সঙ্গে ৩০ হাজার টাকায় চুক্তি হয় কিবরিয়া...",
            description:
                "কেন ‘শুটার’ প্রসঙ্গে নীরব স্বজনদের নির্দেশেই রাজধনীর পল্লবী থানায় যুবলীগের সদস্যচিত...",
            image: "/images/card1.jpg",
        },
        {
            id: 3,
            category: "বাংলাদেশ",
            subcat: "ঢাকা",
            time: "২০ ঘন্টা আগে",
            title: "সাবেক এসআই আবজালুলের জবানবন্দি / ওসির নির্দেশে...",
            description:
                "আগারগাঁও থানার সামনে হত্যায় পর ৬ জনের লাশ পোঁতানোর মামলার আন্তর্জাতিক অপরাধ...",
            image: "/images/card1.jpg",
        }
        // {
        //   id: 4,
        //   category: "বাংলাদেশ / সংযুক্ত",
        //   time: "৪৯ মিনিট আগে",
        //   title: "প্রেমিকান সঙ্গে দেখা করতে গিয়ে মারধরের শিকার...",
        //   description:
        //     "গাজীরচর ফুটবল মাঠে রিয়াজ হোসেন (২৩)। নামের এক যুবকের ওপর মস্তব...",
        //   image: "/images/card1.jpg",
        // },
    ];

    // Right Bottom Row (2 split cards)
    const rightBottom: NewsItem[] = [
        {
            id: 5,
            category: "বাংলাদেশ / ঢাকা",
            time: "১০ মিনিট আগে",
            title: "মধ্যরাতে বিএনপির দুর্ঘটকে সংঘর্ষ, নিহতের ভয়াবহতা",
            description:
                "টিকাটুলির মধ্যরাতে দুর্ঘটনায় নিয়ে নির্ধারিত সংঘর্ষের ঘটনা ঘটে বলে জানিয়েছে হাসপাতাল...",
            image: "/images/card1.jpg",
        },
        {
            id: 6,
            category: "বাংলাদেশ / ঢাকা",
            time: "১২ মিনিট আগে",
            title: "প্রায়শই যে ভুল করেন ড্রাইভাররা...",
            description:
                "ঢাকার রাস্তায় সাধারণ ড্রাইভাররা যে ভুলগুলো করে তার কারণে বড় দুর্ঘটনা ঘটে...",
            image: "/images/card1.jpg",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">বাংলাদেশ</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* ------------------ LEFT COLUMN (BIG NEWS) ------------------ */}
                <div>
                    <div className="w-full h-72 md:h-96 relative rounded-lg overflow-hidden">
                        <Image src={bigNews.image} alt="" fill className="object-cover" />
                    </div>

                    <p className="text-red-500 text-sm mt-4 font-medium">
                        {bigNews.category} / {bigNews.subcat}
                    </p>

                    <h1 className="mt-2 text-2xl md:text-3xl font-bold leading-snug">
                        {bigNews.title}
                    </h1>

                    <p className="mt-2 text-gray-700">
                        {truncate(bigNews.description, 20)}
                    </p>

                    <p className="mt-3 text-gray-500 text-sm">{bigNews.time}</p>
                </div>

                {/* ------------------ RIGHT COLUMN ------------------ */}
                <div className="flex flex-col gap-6">
                    {/* ---------- TOP 3 CARD ROW ---------- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                        {rightTop.map((item) => (
                            <div key={item.id} className="rounded-md overflow-hidden shadow-sm hover:shadow-md transition">
                                <div className="w-full h-32 relative">
                                    <Image
                                        src={item.image}
                                        alt=""
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Tag + Time absolute */}
                                    <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-2 py-[1px] rounded">
                                        {item.category}
                                    </div>
                                    <div className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-2 py-[1px] rounded">
                                        {item.time}
                                    </div>
                                </div>

                                <div className="p-3">
                                    <h3 className="font-semibold text-sm leading-snug">
                                        {truncate(item.title, 12)}
                                    </h3>
                                    <p className="text-gray-600 text-xs mt-1 leading-snug">
                                        {truncate(item.description, 12)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ---------- BOTTOM 2 SPLIT ROW (STACK VERTICALLY) ---------- */}
                    <div className="grid grid-cols-1 gap-5 mt-4">
                        {rightBottom.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-3 items-start rounded-md p-3 shadow-sm hover:shadow-md transition"
                            >
                                {/* LEFT TEXT */}
                                <div className="flex-1">
                                    <p className="text-red-500 text-xs">{item.category}</p>

                                    <h3 className="font-semibold text-sm mt-1 leading-snug">
                                        {truncate(item.title, 12)}
                                    </h3>

                                    <p className="text-gray-600 text-xs mt-1 leading-snug">
                                        {truncate(item.description, 12)}
                                    </p>

                                    <p className="text-gray-500 text-[11px] mt-1">{item.time}</p>
                                </div>

                                {/* RIGHT IMAGE */}
                                <div className="w-24 h-20 relative rounded overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt=""
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
