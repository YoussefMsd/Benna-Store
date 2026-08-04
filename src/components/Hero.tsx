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
      
      {/* === هذا هو الكود الصحيح للفيديو === */}
      <video
        autoPlay     /* تشغيل تلقائي */
        loop         /* تكرار */
        muted        /* ضروري جداً لمنع الصوت وتشغيل الفيديو في Chrome */
        playsInline  /* ضروري لتشغيله على أجهزة الموبايل */
        className="absolute inset-0 w-full h-full object-cover"
      >
        {/* نستخدم المسار المباشر للفيديو داخل مجلد public */}
        <source src="/bg-video.mp4" type="video/mp4" />
        عذراً، متصفحك لا يدعم تشغيل الفيديو.
      </video>

      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-4 drop-shadow-lg">
          Experience <span className="text-[#FF9F1C]">Authentic</span> Flavors
        </h1>
        <p className="text-lg sm:text-2xl text-gray-100 mb-8 font-medium drop-shadow-md">
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