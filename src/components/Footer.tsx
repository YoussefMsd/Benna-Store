"use client";

import { Mail, Phone, MessageSquare, Globe } from "lucide-react";
import { playClickSound } from "@/lib/sound";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div>
            <div className="text-3xl font-extrabold tracking-tight mb-2">
              <span className="text-[#FF9F1C]">B</span>
              <span className="text-[#2EC4B6]">ENNA</span>
            </div>
            <p className="text-gray-400 text-sm">Authentic Moroccan Culinary Experience.</p>
          </div>

          {/* وسائل التواصل والتلفون */}
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://wa.me/212645447407"
              target="_blank"
              onClick={playClickSound}
              className="flex items-center gap-2 text-gray-600 hover:text-[#2EC4B6] transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm font-medium">WhatsApp</span>
            </a>

            <a
              href="https://www.instagram.com/youssef._.msd?igsh=MWtvbDFnZ256dW9xMg=="
              target="_blank"
              onClick={playClickSound}
              className="flex items-center gap-2 text-gray-600 hover:text-[#FF9F1C] transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">Instagram</span>
            </a>

            <a
              href="tel:+212645447407"
              onClick={playClickSound}
              className="flex items-center gap-2 text-gray-600 hover:text-[#2EC4B6] transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="text-sm font-medium">+212 645 447 407</span>
            </a>

            <a
              href="mailto:e.youssef.code@gmail.com"
              onClick={playClickSound}
              className="flex items-center gap-2 text-gray-600 hover:text-[#FF9F1C] transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm font-medium">e.youssef.code@gmail.com</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} BENNA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}