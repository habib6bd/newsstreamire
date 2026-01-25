"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="w-full bg-black text-white mt-16">
            {/* TOP AREA */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* BRAND / LOGO */}
                    <div>
                        <div className="flex items-center gap-3">
                            {/* ✅ If you have logo file, keep this. Otherwise remove it */}
                            <div className="w-12 h-12 relative rounded-md overflow-hidden bg-white">
                                <Image
                                    src="/images/newsstream_logo.jpeg"
                                    alt="NewsStream Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold tracking-wide">NewsStream</h3>
                                <p className="text-sm text-gray-300 mt-1">
                                    সর্বশেষ সংবাদ • বিশ্বস্ত আপডেট
                                </p>
                            </div>
                        </div>

                        <p className="text-gray-300 text-sm leading-relaxed mt-5">
                            বাংলা সংবাদ, ফিচার, ভিডিও এবং সর্বশেষ আপডেট এক জায়গায়। দ্রুত, পরিষ্কার
                            ও ব্যবহারবান্ধব অভিজ্ঞতা—মোবাইল এবং ডেস্কটপে।
                        </p>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">
                            Quick Links
                        </h4>

                        <ul className="space-y-3 text-sm text-gray-300">
                            <li>
                                <Link href="/" className="hover:text-red-400 transition">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/latest-news" className="hover:text-red-400 transition">
                                    Latest News
                                </Link>
                            </li>
                            <li>
                                <Link href="/videos" className="hover:text-red-400 transition">
                                    Video News
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-red-400 transition">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ADDRESS */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">
                            Address
                        </h4>

                        <div className="flex gap-3 text-sm text-gray-300">
                            <FaMapMarkerAlt className="mt-1 text-red-400" />
                            <div className="leading-relaxed">
                                <p className="font-medium text-white">Syed Shoaib Ahmed</p>
                                <p>145 Lios an Uisce</p>
                                <p>Murrough, Renmoe</p>
                                <p>Galway</p>
                                <p>Ireland</p>
                                <p className="mt-2">
                                    <span className="text-gray-400">Post Code:</span>{" "}
                                    <span className="text-white font-medium">H91 YV00</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SOCIAL */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">
                            Follow Us
                        </h4>

                        <p className="text-sm text-gray-300 mb-4">
                            আমাদের ফেসবুক পেজে যুক্ত থাকুন—নতুন আপডেট, রিলস ও ব্রেকিং নিউজ।
                        </p>

                        <div className="flex items-center gap-3">
                            <a
                                href="https://www.facebook.com/profile.php?id=61583798828080&sk=reels_tab"
                                target="_blank"
                                rel="noreferrer"
                                className="w-11 h-11 rounded-full bg-white/10 hover:bg-red-500 flex items-center justify-center transition"
                                aria-label="Facebook"
                            >
                                <FaFacebookF />
                            </a>
                        </div>

                        {/* Optional Contact Row (remove if you don't want) */}
                        <div className="mt-6 space-y-3 text-sm text-gray-300">
                            <div className="flex items-center gap-3">
                                <FaEnvelope className="text-red-400" />

                                <a
                                    href="mailto:newsstreamire@gmail.com"
                                    className="hover:text-red-400 transition"
                                >
                                    newsstreamire@gmail.com
                                </a>
                            </div>

                            <div className="flex items-center gap-3">
                                <FaPhoneAlt className="text-red-400" />

                                <a
                                    href="tel:+353899518051"
                                    className="hover:text-red-400 transition"
                                >
                                    +00353899518051
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-4 flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between">
                    <p className="text-xs md:text-sm text-gray-400 text-center md:text-left">
                        © {new Date().getFullYear()} NewsStream. All rights reserved.
                    </p>

                    <div className="text-xs md:text-sm text-gray-400 flex gap-4">
                        <Link href="/privacy" className="hover:text-red-400 transition">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:text-red-400 transition">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
