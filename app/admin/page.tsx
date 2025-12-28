'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const response = await fetch('/api/download-csv')
      if (!response.ok) {
        throw new Error('Failed to download CSV')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `survey-responses-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert('Failed to download CSV. Make sure there are responses saved.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Survey Responses Admin
          </h1>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Download CSV
              </h2>
              <p className="text-blue-700 mb-4">
                Download all survey responses as a CSV file. You can open it in Excel, Google Sheets, or any spreadsheet application.
              </p>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {downloading ? 'Downloading...' : 'Download CSV'}
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Direct Link
              </h2>
              <p className="text-gray-600 mb-2">
                You can also access the CSV directly:
              </p>
              <code className="block bg-white p-3 rounded border text-sm break-all">
                /api/download-csv
              </code>
              <p className="text-sm text-gray-500 mt-2">
                Bookmark this link for easy access
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-yellow-900 mb-2">
                For Production
              </h2>
              <p className="text-yellow-700 mb-2">
                When deployed, use cloud storage (Supabase/AWS S3) to store the CSV.
              </p>
              <p className="text-sm text-yellow-600">
                See <code className="bg-yellow-100 px-2 py-1 rounded">CSV_STORAGE_SETUP.md</code> for instructions.
              </p>
            </div>

            <div className="pt-4 border-t">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Survey
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
