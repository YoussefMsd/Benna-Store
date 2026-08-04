"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFBF69]" /* خلفية من الباليت */
        >
          <motion.div
            animate={{ scale: [0.8, 1.2, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="text-6xl sm:text-8xl font-black tracking-widest select-none drop-shadow-md"
          >
            {/* اللوغو ديال BENNA */}
            <span className="text-white">B</span>
            <span className="text-[#2EC4B6]">ENNA</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}