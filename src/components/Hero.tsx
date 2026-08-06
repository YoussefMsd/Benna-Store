"use client";

import { playClickSound } from "@/lib/sound";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  const scrollToMenu = () => {
    playClickSound();
    document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
      
      {/* فيديو الخلفية */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
        عذراً، متصفحك لا يدعم تشغيل الفيديو.
      </video>

      {/* طبقة الظلام فوق الفيديو */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* المحتوى - تم توسيع الحاوية لتملأ المساحة بشكل أنيق على البيسي والهاتف */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 w-full max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-4 drop-shadow-lg">
          Experience <span className="text-[#FF9F1C]">Authentic</span> Flavors
        </h1>
        <p className="text-base sm:text-xl lg:text-2xl text-gray-100 mb-8 font-medium drop-shadow-md">
          Authentic flavors straight to your table.
        </p>

        <button
          onClick={scrollToMenu}
          className="inline-flex items-center gap-3 bg-[#FF9F1C] hover:bg-[#FFBF69] text-white font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
        >
          Explore Menu
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>
    </section>
  );
}