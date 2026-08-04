"use client";

import { motion } from "framer-motion";
import { Utensils, Heart, Sparkles } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="py-20 bg-gray-50/50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#2EC4B6] font-bold text-sm tracking-widest uppercase mb-2 block">
            Our Story & Passion
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            The True Taste of Authentic Food
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-12">
            At BENNA, we bring you a carefully curated selection of delicious dishes, prepared with fresh ingredients, passion, and a touch of modern culinary art to satisfy every craving.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#FF9F1C]/10 text-[#FF9F1C] flex items-center justify-center mb-4">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Fresh Ingredients</h3>
            <p className="text-gray-500 text-sm">We source only the highest quality and freshest ingredients daily.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#2EC4B6]/10 text-[#2EC4B6] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Master Recipes</h3>
            <p className="text-gray-500 text-sm">Crafted with authentic techniques combined with modern flavors.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#FF9F1C]/10 text-[#FF9F1C] flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Made With Love</h3>
            <p className="text-gray-500 text-sm">Every plate is prepared to give you a memorable dining experience.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}