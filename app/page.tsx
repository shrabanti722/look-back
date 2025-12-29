'use client'

import { useState } from 'react'
import SurveyForm from '@/components/SurveyForm'
import WelcomeScreen from '@/components/WelcomeScreen'
import SuccessScreen from '@/components/SuccessScreen'

export type SurveyData = {
  name: string
  email: string
  role: string
  product: string
  // Looking Back
  proudOf: string[]
  meaningfulImpact: string
  // Friction
  struggles: string
  workHarder: string
  // Growth
  learned: string
  growthUnsupported: string
  // Peer Feedback
  feedbackComfort: string
  feedbackComfortReason: string
  feedbackStops: string[]
  feedbackStopsOther: string
  feedbackReceived: string
  feedbackReceivedReason: string
  feedbackEasier: string
  // Leadership (reordered: value first, then different)
  leadershipValue: string
  leadershipDifferent: string
  // Inner Growth
  toolsEnhancing: string
  sadhanaRegularity: string
  innerGrowthSupport: string
  // Looking Ahead
  greatYear: string
  anythingElse: string
}

export default function Home() {
  const [step, setStep] = useState<'welcome' | 'form' | 'success'>('welcome')
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null)
  const [initialFormData, setInitialFormData] = useState<Partial<SurveyData> | null>(null)

  const handleStart = () => {
    setStep('form')
  }

  const handleSubmit = async (data: SurveyData) => {
    try {
      // Save to CSV in cloud
      const response = await fetch('/api/save-to-csv-cloud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Failed to save response')
      }

      const result = await response.json()
      setSurveyData(data)
      setStep('success')
    } catch (error: any) {
      console.error('Error submitting survey:', error)
      alert(`There was an error saving your response: ${error.message || 'Please try again.'}`)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {step === 'welcome' && <WelcomeScreen onStart={handleStart} />}
      {step === 'form' && <SurveyForm onSubmit={handleSubmit} initialData={initialFormData} />}
      {step === 'success' && <SuccessScreen data={surveyData} />}
    </main>
  )
}
