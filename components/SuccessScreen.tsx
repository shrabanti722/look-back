'use client'

import { motion } from 'framer-motion'
import { SurveyData } from '@/app/page'
import { useState } from 'react'

interface SuccessScreenProps {
  data: SurveyData | null
}

export default function SuccessScreen({ data }: SuccessScreenProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-5xl w-full"
      >
        {/* Main Message Card - Professional Design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mb-8"
        >
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
          
          {/* Content */}
          <div className="relative p-12 md:p-16">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-14 h-14 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </motion.div>

            {/* Congratulations Message */}
            <div className="text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 leading-tight">
                  Congratulations {data?.name || 'there'}
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <p className="text-2xl md:text-3xl font-semibold text-gray-800 leading-relaxed">
                  for doing what you do.
                </p>
                <div className="flex items-center justify-center gap-3 my-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 max-w-xs"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 max-w-xs"></div>
                </div>
                <p className="text-2xl md:text-3xl font-semibold text-gray-800 leading-relaxed">
                  And for being who you are.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-10 pt-8 border-t border-gray-200"
              >
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Let&apos;s make 2026 amazing, together!
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* New Year Message Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden p-4 md:p-6"
        >
          {!imageError ? (
            <img
              src="/new-year-message.jpg"
              alt="Sadhguru New Year Message"
              className="w-full h-auto object-contain rounded-xl"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">Image not found</p>
              <p className="text-sm">
                Please add the image file as <code className="bg-gray-100 px-2 py-1 rounded">/public/new-year-message.jpg</code>
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
