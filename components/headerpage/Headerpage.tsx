"use client";

import { useState } from "react";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface NewsCard {
  id: number;
  category: string;
  time: string;
  title: string;
  description: string;
  image: string;
}

export default function HeaderSection() {
  const hero = {
    image: "/images/hero.jpg",
    category: "বাংলাদেশ",
    title: "শেখ হাসিনাকে ফেরত চায় বাংলাদেশ, কী আছে প্রত্যর্পণ চুক্তিতে ksfs?",
    description:
      "জুলনা–গণ-অভ্যুত্থানের সময় সর্বচাপ মানবতাবিরোধী অপরাধের মামলার খসড়া..."
  };

  const cards: NewsCard[] = [
    {
      id: 1,
      category: "বাংলাদেশ",
      time: "৭ ঘণ্টা আগে",
      title: "ভারতে অবশ‍্যই চিঠি যাবে: পররাষ্ট্র উপদেষ্টা",
      description: "মৃত্যুদণ্ডপ্রাপ্ত শেখ হাসিনা ও আসাদুজ্জামানের মামলার খসড়া পাঠাতে...",
      image: "/images/card1.jpg"
    },
    {
      id: 2,
      category: "বাংলাদেশ",
      time: "৮ ঘণ্টা আগে",
      title: "আমার ছেলের হত্যাকারীদের ফাঁসি দেখতে চাই: আবু সাঈদের বাবা",
      description: "জনতার গণঅভ্যুত্থানে সময় মৃত্যুদণ্ডপ্রাপ্ত আসামিদের মামলার বিচার...",
      image: "/images/card2.jpg"
    },
    {
      id: 3,
      category: "আন্তর্জাতিক",
      time: "৮ ঘণ্টা আগে",
      title: "‘হাসিনাকে হস্তান্তর করবে না ভারত’",
      description: "জুলনা–গণ-অভ্যুত্থানের সময় সর্বচাপ মানবতাবিরোধী অপরাধের মামলার...",
      image: "/images/card3.jpg"
    }
  ];

  const [index, setIndex] = useState(0);
  const visibleCards = 3;

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? cards.length - visibleCards : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) =>
      prev >= cards.length - visibleCards ? 0 : prev + 1
    );
  };

  return (
    <div className="w-full">
      {/* ---------------- HERO SECTION ---------------- */}
      <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh]">
        <Image
          src={hero.image}
          alt="Hero"
          fill
          className="object-cover brightness-[0.25]"
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
              width: `${(cards.length / visibleCards) * 100}%`
            }}
          >
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white p-5 rounded-xl shadow-md flex-shrink-0 w-full md:w-1/2 lg:w-1/3"
              >
                {/* Category + Time */}
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-red-600 font-medium">{card.category}</span>
                  <span className="text-gray-500">{card.time}</span>
                </div>

                {/* Title */}
                <h2 className="font-semibold text-lg leading-snug mb-2">
                  {card.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-3">{card.description}</p>

                {/* Card Image */}
                <div className="w-full h-44 relative rounded-md overflow-hidden">
                  <Image
                    src={card.image}
                    alt="card image"
                    fill
                    className="object-cover"
                  />
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
