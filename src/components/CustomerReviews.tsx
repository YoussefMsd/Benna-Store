"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Star, Quote, MessageSquarePlus } from "lucide-react";
import { motion } from "framer-motion";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("rating", { ascending: false })
      .limit(3);

    if (!error && data) {
      setReviews(data);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();

    // التأكد واش المستخدم مسجل الدخول قبل إرسال الـ Feedback
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("Please sign in first to share your feedback!");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert([
      { 
        user_id: session.user.id,
        customer_name: name, 
        rating: Number(rating), 
        comment 
      }
    ]);
    setSubmitting(false);

    if (!error) {
      setName("");
      setComment("");
      setShowForm(false);
      fetchReviews();
      alert("Thank you for your feedback!");
    } else {
      alert("Error adding review, please check Supabase table and columns.");
    }
  };

  return (
    <section className="py-20 bg-gray-50/80 border-t border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-[#2EC4B6] font-bold text-sm tracking-widest uppercase mb-2 block">
            Testimonials & Feedback
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-6">
            Here are the top reviews from our beloved customers regarding their experience with BENNA.
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 px-5 py-2.5 rounded-full text-sm font-bold text-gray-700 shadow-sm hover:border-[#2EC4B6] transition-all"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#FF9F1C]" />
            {showForm ? "Close Form" : "Add Your Feedback"}
          </button>
        </div>

        {/* نموذج إضافة Feedback */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAddReview}
            className="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-lg border border-gray-100 mb-12 space-y-4"
          >
            <h3 className="font-bold text-gray-900 text-center text-lg">Share Your Experience</h3>
            <input
              type="text"
              placeholder="Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6]"
            />
            <div className="flex items-center justify-between px-1">
              <span className="text-sm text-gray-600 font-medium">Rating:</span>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-bold text-amber-500 bg-white focus:outline-none"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐ (4)</option>
                <option value="3">⭐⭐⭐ (3)</option>
                <option value="2">⭐⭐ (2)</option>
                <option value="1">⭐ (1)</option>
              </select>
            </div>
            <textarea
              placeholder="Your Feedback / Comment..."
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6]"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#2EC4B6] hover:bg-[#1fa699] text-white py-2.5 rounded-xl font-bold shadow-md transition-all"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </motion.form>
        )}

        {/* عرض أفضل 3 تعليقات إذا كانت موجودة */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, index) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between relative group hover:shadow-md transition-all"
              >
                <Quote className="absolute top-6 right-6 w-10 h-10 text-gray-100 group-hover:text-[#FF9F1C]/10 transition-colors" />
                
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed italic mb-6">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-[#FF9F1C]/10 text-[#FF9F1C] font-bold flex items-center justify-center text-sm">
                    {rev.customer_name ? rev.customer_name.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{rev.customer_name}</h4>
                    <span className="text-xs text-gray-400">Verified Customer</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 text-sm">
            No reviews yet. Be the first to add your feedback!
          </div>
        )}
      </div>
    </section>
  );
}