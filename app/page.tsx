// import Image from "next/image";
import HeaderSection from "@/components/headerpage/Headerpage";
import LatestNewsPage from "@/components/latest-news/LatestNews";
import BangladeshSection from "@/components/bangladesh/Bangladesh";

export default function Home() {
  return (
     <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <HeaderSection />
      <LatestNewsPage />
      <BangladeshSection />
    </div>
  );
}
