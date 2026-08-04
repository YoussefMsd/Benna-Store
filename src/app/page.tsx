"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import MenuGrid, { Dish } from "@/components/MenuGrid";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { ShoppingBag, LogIn, LogOut, CheckCircle2, Mail, Lock } from "lucide-react";
import { playClickSound } from "@/lib/sound";
import CustomerReviews from "@/components/CustomerReviews";
import { supabase } from "@/lib/supabase";
import AnnouncementBar from "@/components/AnnouncementBar";

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Auth States
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Announcement Bar State
  const [announcementText, setAnnouncementText] = useState("🔥 التوصيل مجاني للطلبات فوق 150 درهم!");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    fetchAnnouncement();

    return () => subscription.unsubscribe();
  }, []);

  const fetchAnnouncement = async () => {
    const { data } = await supabase.from("settings").select("value").eq("key", "announcement").maybeSingle();
    if (data && data.value) {
      setAnnouncementText(data.value);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else {
        alert("Account created successfully!");
        setShowAuthModal(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else setShowAuthModal(false);
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleAddToCart = (dish: Dish) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === dish.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...dish, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    playClickSound();
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="relative min-h-screen">
      
      {/* Permanent Floating Logo */}
      <div className="fixed top-11 left-4 z-50 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-gray-100 flex items-center gap-1">
        <span className="font-black text-lg tracking-wider text-gray-900">
          BENNA<span className="text-[#FF9F1C]">.</span>
        </span>
      </div>

      {/* Floating Header Group (Sign In / Status Badge + Cart) */}
      <div className="fixed top-11 right-4 z-50 flex items-center gap-2">
        {/* داكشي الآخر اللي كاين هنا خليه كيف ما هو */}

        {user ? (
          <div className="bg-emerald-500/10 backdrop-blur-md px-3.5 py-2 rounded-full shadow-md border border-emerald-500/30 flex items-center gap-2 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Account Active</span>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1 hover:text-red-500 transition-colors ml-1 text-gray-500"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-[#2EC4B6] hover:bg-[#259b90] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}

        <button
          onClick={() => {
            playClickSound();
            setIsCartOpen(true);
          }}
          className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-gray-100 flex items-center gap-2 hover:bg-gray-50 transition-all"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-gray-800" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF9F1C] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="font-bold text-sm text-gray-800 hidden sm:inline">Cart</span>
        </button>
      </div>

      {/* Announcement Bar top */}
      <AnnouncementBar text={announcementText} />

      <Hero />
      <AboutSection />
      <MenuGrid onAddToCart={handleAddToCart} />
      <CustomerReviews />
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={() => setCart([])}
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-gray-900">
            <h3 className="text-xl font-bold mb-2 text-center">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h3>
            <p className="text-xs text-gray-500 text-center mb-6">
              Sign in with your email to access full features and rate dishes securely.
            </p>

            <form onSubmit={handleEmailAuth} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#2EC4B6]"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#2EC4B6]"
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-[#2EC4B6] hover:bg-[#1fa699] text-white py-2.5 rounded-xl font-bold text-sm shadow-md transition-all"
              >
                {authLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
              </button>
            </form>

            <div className="text-center mt-4">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-[#2EC4B6] font-semibold hover:underline"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}