"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-emerald-950 flex items-center justify-center px-6">
      <div className="text-center max-w-3xl">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold text-white leading-tight"
        >
          Transform Your Body With{" "}
          <span className="bg-linear-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent">
            FitLife
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 text-zinc-400 text-lg md:text-xl"
        >
          Build strength, discipline, and a healthier lifestyle with
          personalized training programs and modern tracking tools.
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-full shadow-lg shadow-emerald-500/30 transition"
          >
            Get Startedd
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}
