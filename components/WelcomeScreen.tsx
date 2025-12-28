'use client'

import { motion } from 'framer-motion'

interface WelcomeScreenProps {
  onStart: () => void
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            2025
          </h1>
          <h2 className="text-4xl font-semibold text-gray-800 mb-2">
            Look Back
          </h2>
          <p className="text-xl text-gray-600">
            Reflect on your year and share your thoughts
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8"
        >
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            This is a safe space. Your inputs will not be shared with your peers.
            Take your time—there&apos;s no rush. Feel free to skip questions that don&apos;t
            resonate with you.
          </p>
          <p className="text-sm text-gray-500">
            Expected time: ~30 minutes
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          onClick={onStart}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Begin Reflection →
        </motion.button>
      </motion.div>
    </div>
  )
}
