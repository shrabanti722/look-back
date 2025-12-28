'use client'

import { motion } from 'framer-motion'
import { SurveyData } from '@/app/page'

interface SuccessScreenProps {
  data: SurveyData | null
}

export default function SuccessScreen({ data }: SuccessScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-white"
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
        </motion.div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Thank You, {data?.name || 'there'}!
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Your responses have been saved successfully! Thank you for taking the time to share your thoughts.
        </p>
        <p className="text-sm text-gray-500">
          Your thoughtful reflection is appreciated. 🙏
        </p>
      </motion.div>
    </div>
  )
}
