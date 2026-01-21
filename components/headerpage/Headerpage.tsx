"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

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

type ApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiNews[];
};

interface NewsCard {
  id: number;
  category: string;
  time: string;
  title: string;
  description: string;
  image: string;
}

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

function shorten(text: string, max = 120) {
  const clean = text.replace(/<[^>]*>/g, "").trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + "..." : clean;
}

export default function HeaderSection() {
  const [hero, setHero] = useState({
    image: "/images/hero.jpg",
    category: "বাংলাদেশ",
    title: "Loading...",
    description: "",
  });

  const [cards, setCards] = useState<NewsCard[]>([]);
  const [index, setIndex] = useState(0);

  // Keep your screenshot layout: 3 on lg, 2 on md, 1 on mobile
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 768) setVisibleCards(1);
      else if (w < 1024) setVisibleCards(2);
      else setVisibleCards(3);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadNews() {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        const data: ApiResponse = await res.json();

        const published = data.results.filter((n) => n.is_published);
        const list = published.length ? published : data.results;

        const mapped: NewsCard[] = list.map((n) => ({
          id: n.id,
          category: `Category ${n.category}`,
          time: timeAgoBn(n.created_at),
          title: n.title,
          description: shorten(n.content, 120),
          image: n.image?.[0]?.image || "/images/card-fallback.jpg",
        }));

        const featured = list.find((n) => n.is_featured) || list[0];

        if (!ignore) {
          setCards(mapped);
          setIndex(0);

          if (featured) {
            setHero({
              image: featured.image?.[0]?.image || "/images/hero.jpg",
              category: `Category ${featured.category}`,
              title: featured.title,
              description: shorten(featured.content, 160),
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    loadNews();
    return () => {
      ignore = true;
    };
  }, []);

  // keep index valid when screen changes
  useEffect(() => {
    if (!cards.length) return;
    const maxIndex = Math.max(0, cards.length - visibleCards);
    setIndex((i) => Math.min(i, maxIndex));
  }, [visibleCards, cards.length]);

  const prevSlide = () => {
    if (cards.length <= visibleCards) return;
    setIndex((prev) => (prev === 0 ? cards.length - visibleCards : prev - 1));
  };

  const nextSlide = () => {
    if (cards.length <= visibleCards) return;
    setIndex((prev) => (prev >= cards.length - visibleCards ? 0 : prev + 1));
  };

  // auto slide
  useEffect(() => {
    if (cards.length <= visibleCards) return;
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setIndex((prev) => (prev >= cards.length - visibleCards ? 0 : prev + 1));
    }, 3500);
    return () => window.clearInterval(id);
  }, [cards.length, visibleCards]);

  return (
    <div className="w-full">
      {/* ---------------- HERO SECTION ---------------- */}
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh]">
        <Image
          src={hero.image}
          alt="Hero"
          fill
          className="object-cover brightness-[0.25]"
          priority
        />

        <div className="absolute inset-0 px-6 md:px-16 lg:px-28 flex flex-col justify-center">
          <p className="text-red-400 text-sm md:text-base mb-2">{hero.category}</p>

          <h1 className="text-white font-bold text-2xl md:text-4xl lg:text-5xl leading-snug max-w-3xl">
            {hero.title}
          </h1>

          <p className="text-gray-200 text-base md:text-lg max-w-xl mt-4">
            {hero.description}
          </p>
        </div>
      </div>

      {/* ---------------- SLIDER SECTION ---------------- */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 -mt-20 pb-12">
        {/* CARDS WRAPPER */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 gap-6"
            style={{
              transform: `translateX(-${index * (100 / visibleCards)}%)`,
            }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                // ✅ THIS is the fix: all cards equal size
                className="bg-white p-5 rounded-xl shadow-md flex-shrink-0 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-red-600 font-medium">{card.category}</span>
                  <span className="text-gray-500">{card.time}</span>
                </div>

                <h2 className="font-semibold text-lg leading-snug mb-2">
                  {card.title}
                </h2>

                <p className="text-sm text-gray-700 mb-3">{card.description}</p>

                <div className="w-full h-44 relative rounded-md overflow-hidden">
                  <Image src={card.image} alt="card image" fill className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NEXT/PREV BUTTONS */}
        <div className="flex justify-between items-center mt-8 px-4">
          <button
            onClick={prevSlide}
            className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full shadow"
          >
            <FaArrowLeft />
          </button>

          <button
            onClick={nextSlide}
            className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full shadow"
          >
            <FaArrowRight />
          </button>
        </div>

        {/* RED LINE */}
        <div className="mt-6 mx-auto w-1/2 h-[3px] bg-red-500 rounded-full"></div>
      </div>
    </div>
  );
}
