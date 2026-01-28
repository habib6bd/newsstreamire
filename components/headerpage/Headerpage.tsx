"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

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

type NewsApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiNews[];
};

type ApiCategory = {
  id: number;
  name: string;
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
  const clean = (text || "").replace(/<[^>]*>/g, "").trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + "..." : clean;
}

type HeroState = {
  id: number;
  image: string;
  category: string;
  title: string;
  description: string;
};

export default function HeaderSection() {
  // ✅ hero starts as null so we don't show any default image
  const [hero, setHero] = useState<HeroState | null>(null);

  const [cards, setCards] = useState<NewsCard[]>([]);
  const [index, setIndex] = useState(0);

  const [loadingHero, setLoadingHero] = useState(true);

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

    async function loadNewsAndCategories() {
      try {
        setLoadingHero(true);

        const [newsRes, catRes] = await Promise.all([
          fetch("/api/news", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        if (!newsRes.ok) throw new Error(`News API Error: ${newsRes.status}`);
        if (!catRes.ok) throw new Error(`Category API Error: ${catRes.status}`);

        const newsData: NewsApiResponse = await newsRes.json();
        const categories: ApiCategory[] = await catRes.json();

        const categoryMap = new Map<number, string>();
        categories.forEach((c) => categoryMap.set(c.id, c.name));

        const published = newsData.results.filter((n) => n.is_published);
        const list = published.length ? published : newsData.results;

        const sorted = [...list].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        const featured = sorted.find((n) => n.is_featured) || sorted[0] || null;

        const mappedCards: NewsCard[] = sorted.map((n) => ({
          id: n.id,
          category: categoryMap.get(n.category) || `Category ${n.category}`,
          time: timeAgoBn(n.created_at),
          title: n.title,
          description: shorten(n.content, 120),
          image: n.image?.[0]?.image || "/images/newsstream_logo.jpeg",
        }));

        if (!ignore) {
          setCards(mappedCards);
          setIndex(0);

          if (featured) {
            const heroImage = featured.image?.[0]?.image;
            // ✅ only set hero if API actually has data
            setHero({
              id: featured.id,
              image: heroImage || "/images/hero.jpg", // (fallback only if API has no image)
              category:
                categoryMap.get(featured.category) || `Category ${featured.category}`,
              title: featured.title,
              description: shorten(featured.content, 160),
            });
          } else {
            setHero(null);
          }
        }
      } catch (e) {
        console.error(e);
        if (!ignore) setHero(null);
      } finally {
        if (!ignore) setLoadingHero(false);
      }
    }

    loadNewsAndCategories();
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

  const canSlide = cards.length > visibleCards;

  const prevSlide = () => {
    if (!canSlide) return;
    setIndex((prev) => (prev === 0 ? cards.length - visibleCards : prev - 1));
  };

  const nextSlide = () => {
    if (!canSlide) return;
    setIndex((prev) => (prev >= cards.length - visibleCards ? 0 : prev + 1));
  };

  // auto slide
  useEffect(() => {
    if (!canSlide) return;
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setIndex((prev) => (prev >= cards.length - visibleCards ? 0 : prev + 1));
    }, 3500);
    return () => window.clearInterval(id);
  }, [canSlide, cards.length, visibleCards]);

  const sliderTransform = useMemo(
    () => `translateX(-${index * (100 / visibleCards)}%)`,
    [index, visibleCards]
  );

  return (
    <div className="w-full">
      {/* ---------------- HERO SECTION ---------------- */}
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh]">
        {/* ✅ No default hero flash: show skeleton while loading */}
        {loadingHero || !hero ? (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        ) : (
          <Link href={`/news-detail/${hero.id}`} className="block absolute inset-0">
            <Image
              src={hero.image}
              alt={hero.title}
              fill
              className="object-cover brightness-[0.25]"
              priority
            />
          </Link>
        )}

        <div className="absolute inset-0 px-6 md:px-16 lg:px-28 flex flex-col justify-center">
          {loadingHero || !hero ? (
            <div className="space-y-4 max-w-3xl">
              <div className="h-4 w-28 bg-white/30 rounded animate-pulse" />
              <div className="h-10 w-full bg-white/20 rounded animate-pulse" />
              <div className="h-5 w-2/3 bg-white/20 rounded animate-pulse" />
            </div>
          ) : (
            <Link href={`/news-detail/${hero.id}`} className="block">
              <p className="text-red-400 text-sm md:text-base mb-2">
                {hero.category}
              </p>

              <h1 className="text-white font-bold text-2xl md:text-4xl lg:text-5xl leading-snug max-w-3xl">
                {hero.title}
              </h1>

              <p className="text-gray-200 text-base md:text-lg max-w-xl mt-4">
                {hero.description}
              </p>
            </Link>
          )}
        </div>
      </div>

      {/* ---------------- SLIDER SECTION ---------------- */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 -mt-20 pb-12">
        {/* CARDS WRAPPER */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 gap-6"
            style={{ transform: sliderTransform }}
          >
            {cards.map((card) => (
              <Link
                key={card.id}
                href={`/news-detail/${card.id}`}
                className="bg-white p-5 rounded-xl shadow-md flex-shrink-0 basis-full md:basis-1/2 lg:basis-1/3
                           hover:shadow-lg transition-shadow duration-200 cursor-pointer block"
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
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* NEXT/PREV BUTTONS */}
        <div className="flex justify-between items-center mt-8 px-4">
          <button
            onClick={prevSlide}
            disabled={!canSlide}
            className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 p-3 rounded-full shadow"
          >
            <FaArrowLeft />
          </button>

          <button
            onClick={nextSlide}
            disabled={!canSlide}
            className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 p-3 rounded-full shadow"
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
