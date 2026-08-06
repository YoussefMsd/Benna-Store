"use client";

import { Mail, Phone, MessageSquare, Globe } from "lucide-react";
import { playClickSound } from "@/lib/sound";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 md:py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          
          {/* Logo & Subtitle */}
          <div className="flex flex-col items-center md:items-start">
            <div className="text-3xl font-extrabold tracking-tight mb-1">
              <span className="text-[#FF9F1C]">B</span>
              <span className="text-[#2EC4B6]">ENNA</span>
            </div>
            <p className="text-gray-400 text-sm">Authentic Moroccan Culinary Experience.</p>
          </div>

          {/* وسائل التواصل والتلفون */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
            <a
              href="https://wa.me/212645447407"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              className="flex items-center justify-center md:justify-start gap-2 p-3 md:p-0 rounded-xl bg-gray-50 md:bg-transparent text-gray-600 hover:text-[#2EC4B6] transition-all"
            >
              <MessageSquare className="w-5 h-5 text-[#2EC4B6]" />
              <span className="text-sm font-semibold">WhatsApp</span>
            </a>

            <a
              href="https://www.instagram.com/youssef._.msd?igsh=MWtvbDFnZ256dW9xMg=="
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              className="flex items-center justify-center md:justify-start gap-2 p-3 md:p-0 rounded-xl bg-gray-50 md:bg-transparent text-gray-600 hover:text-[#FF9F1C] transition-all"
            >
              <Globe className="w-5 h-5 text-[#FF9F1C]" />
              <span className="text-sm font-semibold">Instagram</span>
            </a>

            <a
              href="tel:+212645447407"
              onClick={playClickSound}
              className="flex items-center justify-center md:justify-start gap-2 p-3 md:p-0 rounded-xl bg-gray-50 md:bg-transparent text-gray-600 hover:text-[#2EC4B6] transition-all"
            >
              <Phone className="w-5 h-5 text-[#2EC4B6]" />
              <span className="text-sm font-semibold whitespace-nowrap">+212 645 447 407</span>
            </a>

            <a
              href="mailto:e.youssef.code@gmail.com"
              onClick={playClickSound}
              className="flex items-center justify-center md:justify-start gap-2 p-3 md:p-0 rounded-xl bg-gray-50 md:bg-transparent text-gray-600 hover:text-[#FF9F1C] transition-all"
            >
              <Mail className="w-5 h-5 text-[#FF9F1C]" />
              <span className="text-sm font-semibold whitespace-nowrap">
                e.youssef.code@gmail.com
              </span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400 font-medium">
          © {new Date().getFullYear()} BENNA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}