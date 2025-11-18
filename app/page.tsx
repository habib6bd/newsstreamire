// import Image from "next/image";
import HeaderSection from "@/components/navbar/headerpage/Headerpage";
import LatestNewsPage from "@/components/latest-news/LatestNews";

export default function Home() {
  return (
     <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <HeaderSection />
      <LatestNewsPage />
    </div>
  );
}
