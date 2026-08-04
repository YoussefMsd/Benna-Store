"use client";

import { useState, useEffect } from "react";
import { playClickSound } from "@/lib/sound";
import { Search, ShoppingBag, Star, PackageX, Package, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export interface Dish {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  rating: number;
  stock: number;
  category?: string | null;
}

// قائمة التصنيفات الأساسية (يمكنك تعديلها حسب ما هو مخزن عندك في قاعدة البيانات)
const categories = ["All", "Tajine", "Grills", "Appetizers", "Drinks", "Others"];

export default function MenuGrid({ onAddToCart }: { onAddToCart: (dish: Dish) => void }) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  
  // حالات خاصة بتقييم الطبق داخل الـ Modal
  const [userRating, setUserRating] = useState(5);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);

  useEffect(() => {
    async function fetchDishes() {
      const { data, error } = await supabase.from("dishes").select("*");
      if (error) console.error("Error fetching dishes:", error);
      else setDishes(data || []);
      setLoading(false);
    }
    fetchDishes();
  }, []);

  const handleRateDish = async () => {
    if (!selectedDish) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("Please sign in first to rate dishes!");
      return;
    }

    const userId = session.user.id;
    setIsRatingSubmitting(true);

    const { data: existingRating } = await supabase
      .from("dish_ratings")
      .select("*")
      .eq("dish_id", selectedDish.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (existingRating) {
      alert("You have already rated this dish! You can only rate each dish once.");
      setIsRatingSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("dish_ratings")
      .insert([
        { dish_id: selectedDish.id, user_id: userId, rating: userRating }
      ]);

    if (insertError) {
      alert("Error submitting rating.");
      setIsRatingSubmitting(false);
      return;
    }

    const currentRating = Number(selectedDish.rating) || userRating;
    const newAverageRating = Number(((currentRating + userRating) / 2).toFixed(1));

    const { error: updateError } = await supabase
      .from("dishes")
      .update({ rating: newAverageRating })
      .eq("id", selectedDish.id);

    setIsRatingSubmitting(false);

    if (!updateError) {
      setDishes(dishes.map(d => d.id === selectedDish.id ? { ...d, rating: newAverageRating } : d));
      setSelectedDish({ ...selectedDish, rating: newAverageRating });
      alert("Thank you for your rating! Your vote has been recorded securely.");
    } else {
      alert("Error updating dish average rating.");
    }
  };

  // فلترة دقيقة للأطباق:
  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch = dish.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === "All") {
      return matchesSearch;
    } 
    
    // فئة Others تجمع فقط الأطباق التي ليس لها تصنيف (null، undefined أو نص فارغ)
    if (selectedCategory === "Others") {
      const isNullOrEmpty = !dish.category || dish.category.trim() === "";
      return matchesSearch && isNullOrEmpty;
    } 
    
    // باقي التصنيفات تقارن بشكل دقيق مع تجاهل حالة الأحرف (Case-insensitive)
    const dishCat = dish.category ? dish.category.trim().toLowerCase() : "";
    return matchesSearch && dishCat === selectedCategory.toLowerCase();
  });

  return (
    <section id="menu-section" className="max-w-7xl mx-auto px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Our Special Dishes</h2>
        <p className="text-gray-500">Explore our delicious menu items and choose your favorite</p>
      </motion.div>

      {/* Search Input */}
      <div className="max-w-md mx-auto mb-8 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-full bg-white border-2 border-gray-100 focus:border-[#2EC4B6] focus:outline-none shadow-sm transition-all"
        />
      </div>

      {/* Categories Filter Buttons */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 mb-12 no-scrollbar px-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              playClickSound();
              setSelectedCategory(cat);
            }}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm ${
              selectedCategory === cat
                ? "bg-[#2EC4B6] text-white shadow-md shadow-[#2EC4B6]/20 scale-105"
                : "bg-white text-gray-600 border border-gray-100 hover:border-[#2EC4B6]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading dishes...</div>
      ) : filteredDishes.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl border border-gray-100 max-w-lg mx-auto shadow-sm"
        >
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <PackageX className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No dishes found</h3>
          <p className="text-gray-500 text-sm mb-6">We couldn't find anything matching your filter.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="bg-[#2EC4B6] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#259b90] transition-colors"
          >
            Reset Filters
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDishes.map((dish, index) => {
            const isOutOfStock = dish.stock === 0;

            return (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => {
                  playClickSound();
                  setSelectedDish(dish);
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-50 flex flex-col group cursor-pointer"
              >
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img
                    src={dish.image_url}
                    alt={dish.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Rating Badge */}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm text-gray-800">
                    <Star className="w-4 h-4 fill-[#FF9F1C] text-[#FF9F1C]" />
                    {dish.rating ? Number(dish.rating).toFixed(1) : "New"}
                  </span>

                  {/* Stock Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm text-gray-700">
                    <Package className="w-3.5 h-3.5 text-[#2EC4B6]" />
                    {isOutOfStock ? (
                      <span className="text-red-500">Out of Stock</span>
                    ) : (
                      <span>{dish.stock} left</span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{dish.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{dish.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-2xl font-black text-[#FF9F1C]">{Number(dish.price).toFixed(2)} MAD</span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isOutOfStock) {
                          playClickSound();
                          onAddToCart(dish);
                        }
                      }}
                      disabled={isOutOfStock}
                      className={`p-3 rounded-full shadow-md transition-all ${
                        isOutOfStock
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-[#2EC4B6] hover:bg-[#1fa699] text-white active:scale-95"
                      }`}
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Dish Quick View Modal with Rating Feature */}
      <AnimatePresence>
        {selectedDish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedDish(null)}
                className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-600 hover:text-gray-900 shadow-md transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 w-full bg-gray-100">
                <img
                  src={selectedDish.image_url}
                  alt={selectedDish.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm text-gray-700">
                  <Package className="w-3.5 h-3.5 text-[#2EC4B6]" />
                  {selectedDish.stock === 0 ? (
                    <span className="text-red-500">Out of Stock</span>
                  ) : (
                    <span>{selectedDish.stock} left in stock</span>
                  )}
                </div>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-black text-gray-900">{selectedDish.title}</h3>
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{selectedDish.rating ? Number(selectedDish.rating).toFixed(1) : "New"}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-base leading-relaxed">
                  {selectedDish.description}
                </p>

                {/* قسم تقييم الطبق من طرف الزبون */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">Rate this dish:</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={userRating}
                      onChange={(e) => setUserRating(Number(e.target.value))}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-bold text-amber-500 bg-white focus:outline-none"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                      <option value="4">⭐⭐⭐⭐ (4)</option>
                      <option value="3">⭐⭐⭐ (3)</option>
                      <option value="2">⭐⭐ (2)</option>
                      <option value="1">⭐ (1)</option>
                    </select>
                    <button
                      onClick={handleRateDish}
                      disabled={isRatingSubmitting}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
                    >
                      {isRatingSubmitting ? "..." : "Rate"}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block">Price</span>
                    <span className="text-3xl font-black text-[#FF9F1C]">
                      {Number(selectedDish.price).toFixed(2)} MAD
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (selectedDish.stock > 0) {
                        playClickSound();
                        onAddToCart(selectedDish);
                        setSelectedDish(null);
                      }
                    }}
                    disabled={selectedDish.stock === 0}
                    className={`px-6 py-3.5 rounded-2xl font-bold shadow-md flex items-center gap-2 transition-all ${
                      selectedDish.stock === 0
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#FF9F1C] hover:bg-[#e88e10] text-white active:scale-95"
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>{selectedDish.stock === 0 ? "Sold Out" : "Add to Cart"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}