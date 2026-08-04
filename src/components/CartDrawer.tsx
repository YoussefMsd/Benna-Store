"use client";

import { useState } from "react";
import { X, ShoppingBag, Trash2, CheckCircle2 } from "lucide-react";
import { Dish } from "./MenuGrid";
import { supabase } from "@/lib/supabase";
import { playClickSound } from "@/lib/sound";

export interface CartItem extends Dish {
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
}

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, onClearCart }: CartDrawerProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: name,
        customer_phone: phone, // تم التصحيح هنا باش تطابق قاعدة البيانات
        customer_address: address, // تم التصحيح هنا باش تطابق قاعدة البيانات
        items: cart,
        total_price: totalPrice,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error saving order:", error);
      alert("Something went wrong. Please try again.");
    } else {
      setSuccess(true);
      onClearCart();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#FF9F1C]" />
            <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <CheckCircle2 className="w-16 h-16 text-[#2EC4B6] mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h3>
            <p className="text-gray-500 mb-6">Thank you for your order. We will contact you shortly to confirm delivery.</p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="bg-[#2EC4B6] text-white px-8 py-3 rounded-full font-bold hover:bg-[#259b90]"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-gray-400">Your cart is empty</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1 mx-3">
                      <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                      <span className="text-[#FF9F1C] font-extrabold text-sm"> {Number(item.price).toFixed(2)} MAD </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-7 h-7 bg-white border rounded-full font-bold shadow-sm">-</button>
                      <span className="text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-7 h-7 bg-white border rounded-full font-bold shadow-sm">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Checkout Form */}
            {cart.length > 0 && (
              <form onSubmit={handleCheckout} className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-lg font-black text-gray-900 mb-2">
                  <span>Total:</span>
                  <span className="text-[#FF9F1C]">{totalPrice.toFixed(2)} MAD </span>
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6]"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6]"
                />
                <textarea
                  placeholder="Delivery Address"
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF9F1C] hover:bg-[#e88e10] text-white py-3 rounded-xl font-bold shadow-md transition-all mt-2"
                >
                  {loading ? "Submitting Order..." : "Place Order Now"}
                </button>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  );
}