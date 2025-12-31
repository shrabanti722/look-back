'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SurveyData } from '@/app/page'

interface SurveyFormProps {
  onSubmit: (data: SurveyData) => void
  initialData?: Partial<SurveyData> | null
}

const SECTIONS = [
  { name: 'Basic Info', emoji: '👤', isIntro: false },
  { name: 'Welcome', emoji: '✨', isIntro: true },
  { name: '🔍 Looking Back on the Year', emoji: '🔍', isIntro: false },
  { name: '🧱 Friction, Struggles, and Constraints', emoji: '🧱', isIntro: false },
  { name: '🚀 Growth and Development', emoji: '🚀', isIntro: false },
  { name: '🤝 Working with Peers', emoji: '🤝', isIntro: false },
  { name: '🧭 Leadership Support & Feedback', emoji: '🧭', isIntro: false },
  { name: '🌟 Inner Growth', emoji: '🌟', isIntro: false },
  { name: '🌟 Looking Ahead', emoji: '🌟', isIntro: false },
  { name: 'Final', emoji: '✅', isIntro: false },
]

const FEEDBACK_COMFORT_OPTIONS = [
  'Very comfortable',
  'Somewhat comfortable',
  'Neutral / unsure',
  'Somewhat uncomfortable',
  'Very uncomfortable',
]

const FEEDBACK_STOPS_OPTIONS = [
  'Unclear expectations',
  'Fear of conflict',
  'Concern about relationships',
  'Lack of skill or language',
  'Power dynamics',
  'Time or context',
  'Nothing—this isn\'t an issue for me',
  'Other',
]

const FEEDBACK_RECEIVED_OPTIONS = [
  'In the moment',
  'In 1:1s',
  'Through managers',
  'Retrospectives',
  'Rarely or never',
]

const TOOLS_ENHANCING_OPTIONS = [
  'Yes',
  'No',
  'Not Really',
]

const SADHANA_REGULARITY_OPTIONS = [
  'Happens almost everyday',
  'Happens sometimes - on and off',
  'Not really happening',
  'Not applicable to me',
]

export default function SurveyForm({ onSubmit, initialData }: SurveyFormProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState<SurveyData>({
    name: initialData?.name || '',
    email: '',
    role: initialData?.role || '',
    product: initialData?.product || '',
    proudOf: [''],
    meaningfulImpact: '',
    struggles: '',
    workHarder: '',
    learned: '',
    growthUnsupported: '',
    feedbackComfort: '',
    feedbackComfortReason: '',
    feedbackStops: [],
    feedbackStopsOther: '',
    feedbackReceived: '',
    feedbackReceivedReason: '',
    feedbackEasier: '',
    leadershipValue: '',
    leadershipDifferent: '',
    toolsEnhancing: '',
    sadhanaRegularity: '',
    innerGrowthSupport: '',
    greatYear: '',
    anythingElse: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const isInitialLoadRef = useRef(true)
  const hasLoadedRef = useRef(false)

  const STORAGE_KEY = 'survey-form-draft'

  // Load saved data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !hasLoadedRef.current) {
      hasLoadedRef.current = true
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.formData) {
            // Merge with initialData, prioritizing saved data but filling in gaps
            setFormData((prev) => ({
              ...prev,
              ...parsed.formData,
              // Only use initialData if saved data doesn't have these fields
              name: parsed.formData.name || prev.name,
              role: parsed.formData.role || prev.role,
              product: parsed.formData.product || prev.product,
            }))
          }
          if (parsed.currentSection !== undefined) {
            setCurrentSection(parsed.currentSection)
          }
          if (parsed.lastSaved) {
            setLastSaved(new Date(parsed.lastSaved))
          }
        } else if (initialData) {
          // If no saved data, use initialData to update form
          setFormData((prev) => ({
            ...prev,
            name: initialData.name || prev.name,
            role: initialData.role || prev.role,
            product: initialData.product || prev.product,
          }))
        }
        // Mark initial load as complete after state updates have time to propagate
        setTimeout(() => {
          isInitialLoadRef.current = false
        }, 500)
      } catch (error) {
        console.error('Failed to load saved form data:', error)
        isInitialLoadRef.current = false
      }
    }
  }, [initialData])

  // Helper function to save data to localStorage
  const saveToLocalStorage = useCallback(() => {
    if (typeof window !== 'undefined' && !isInitialLoadRef.current) {
      try {
        const dataToSave = {
          formData,
          currentSection,
          lastSaved: new Date().toISOString(),
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
        setLastSaved(new Date())
      } catch (error) {
        console.error('Failed to save form data:', error)
      }
    }
  }, [formData, currentSection])

  // Save immediately when section changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialLoadRef.current) {
      saveToLocalStorage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSection])

  // Debounced save for formData changes (fallback - saves after 2 seconds of inactivity)
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialLoadRef.current) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage()
      }, 2000)

      return () => clearTimeout(timeoutId)
    }
  }, [formData, saveToLocalStorage])

  // Save on page unload to ensure data is saved even if user closes browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleBeforeUnload = () => {
        if (!isInitialLoadRef.current) {
          saveToLocalStorage()
        }
      }
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    }
  }, [saveToLocalStorage])

  // Clear saved data after successful submission
  const clearSavedData = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY)
        setLastSaved(null)
      } catch (error) {
        console.error('Failed to clear saved form data:', error)
      }
    }
  }, [])

  const updateField = (field: keyof SurveyData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Save when user leaves an input field
  const handleFieldBlur = () => {
    saveToLocalStorage()
  }

  const addProudOf = () => {
    setFormData((prev) => ({
      ...prev,
      proudOf: [...prev.proudOf, ''],
    }))
  }

  const updateProudOf = (index: number, value: string) => {
    setFormData((prev) => {
      const newProudOf = [...prev.proudOf]
      newProudOf[index] = value
      return { ...prev, proudOf: newProudOf }
    })
  }

  const removeProudOf = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      proudOf: prev.proudOf.filter((_, i) => i !== index),
    }))
  }

  const toggleFeedbackStop = (option: string) => {
    setFormData((prev) => {
      const stops = prev.feedbackStops || []
      if (stops.includes(option)) {
        return { ...prev, feedbackStops: stops.filter((s) => s !== option) }
      } else {
        return { ...prev, feedbackStops: [...stops, option] }
      }
    })
  }

  const handleNext = () => {
    // Validate Basic Info before proceeding to intro
    if (currentSection === 0 && (!formData.name.trim() || !formData.email.trim())) {
      alert('Please fill in your name and email before continuing.')
      return
    }
    
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1)
      // Scroll to form content instead of top
      setTimeout(() => {
        const formContent = document.getElementById('form-content')
        if (formContent) {
          formContent.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      // Scroll to form content instead of top
      setTimeout(() => {
        const formContent = document.getElementById('form-content')
        if (formContent) {
          formContent.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Clean up empty proudOf entries
    const cleanedData = {
      ...formData,
      proudOf: formData.proudOf.filter((item) => item.trim() !== ''),
    }
    try {
      // Call onSubmit and wait for it to complete
      await Promise.resolve(onSubmit(cleanedData))
      // Only clear saved data after successful submission
      clearSavedData()
    } catch (error) {
      // If submission fails, don't clear localStorage so user can retry
      console.error('Submission failed, keeping saved data:', error)
      setIsSubmitting(false)
    }
  }

  const renderSection = () => {
    switch (currentSection) {
      case 0: // Basic Info
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                onBlur={handleFieldBlur}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                onBlur={handleFieldBlur}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => updateField('role', e.target.value)}
                onBlur={handleFieldBlur}
                placeholder="e.g., Engineer"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                Product Area / Team
              </label>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => updateField('product', e.target.value)}
                onBlur={handleFieldBlur}
                placeholder="e.g., Miracle of Mind"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all"
              />
            </div>
          </div>
        )

      case 1: // Personalized Intro
        const displayName = formData.name || 'there'
        const displayRole = formData.role ? ` as a ${formData.role}` : ''
        const displayProduct = formData.product ? ` in the ${formData.product} team` : ''
        
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Dear {displayName}, this is your Space to Reflect
              </h3>
              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                Think of this as a quiet pause to acknowledge your year — the work you did{displayRole}{displayProduct} — the effort you put in, the wins you had, and the struggles along the way ❤️
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 border border-blue-100 shadow-lg">
              <h4 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                A few notes before you start
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                  <span className="text-3xl flex-shrink-0">⏱️</span>
                  <p className="text-gray-700 text-lg flex-1 pt-1">
                    <span className="font-bold">Expected time:</span> ~30 minutes
                  </p>
                </div>
                <div className="flex items-start gap-4 bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                  <span className="text-3xl flex-shrink-0">✨</span>
                  <p className="text-gray-700 text-lg flex-1 pt-1">
                    Please feel free to <span className="font-bold">skip any questions</span> that don&apos;t resonate with you
                  </p>
                </div>
                <div className="flex items-start gap-4 bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                  <span className="text-3xl flex-shrink-0">🔒</span>
                  <p className="text-gray-700 text-lg flex-1 pt-1">
                    This is a <span className="font-bold">safe space</span> — your inputs will not be shared with peers
                  </p>
                </div>
                <div className="flex items-start gap-4 bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                  <span className="text-3xl flex-shrink-0">🎯</span>
                  <p className="text-gray-700 text-lg flex-1 pt-1">
                    The intent is <span className="font-bold">reflection and learning</span>, not evaluation
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t-2 border-gray-300 bg-white/80 rounded-xl p-5">
                  <p className="text-base text-gray-700 italic text-center font-medium">
                    There are no &ldquo;right&rdquo; answers. Specific and honest is more valuable than polished.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 2: // Looking Back
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                What are you most proud of from this year?
              </label>
              <p className="text-xs text-gray-500 mb-3 italic">
                <span className="font-semibold">Prompt:</span> Think in terms of outcomes, impact, quality, or ownership—not just tasks.
              </p>
              {formData.proudOf.map((item, index) => (
                <div key={index} className="mb-3 flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateProudOf(index, e.target.value)}
                    onBlur={handleFieldBlur}
                    placeholder={`Achievement ${index + 1}`}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all"
                  />
                  {formData.proudOf.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProudOf(index)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addProudOf}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add another achievement
              </button>
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                What work of yours had a meaningful impact but may not be very visible?
              </label>
              <p className="text-xs text-gray-500 mb-3 italic">
                <span className="font-semibold">Prompt:</span> This could include behind-the-scenes work, unblocking others, raising the bar, or holding things together.
              </p>
              <textarea
                value={formData.meaningfulImpact}
                onChange={(e) => updateField('meaningfulImpact', e.target.value)}
                onBlur={handleFieldBlur}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white resize-y transition-all"
                placeholder="Share your thoughts..."
              />
            </div>
          </div>
        )

      case 3: // Friction & Struggles
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                What did you struggle with?
              </label>
              <textarea
                value={formData.struggles}
                onChange={(e) => updateField('struggles', e.target.value)}
                onBlur={handleFieldBlur}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white resize-y transition-all"
                placeholder="Share your thoughts..."
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                What made your work harder than it needed to be this year?
              </label>
              <p className="text-xs text-gray-500 mb-3 italic">
                <span className="font-semibold">Prompt:</span> Process, unclear priorities, dependencies, tooling, decision delays, structure, communication—anything that consistently slowed you down.
              </p>
              <textarea
                value={formData.workHarder}
                onChange={(e) => updateField('workHarder', e.target.value)}
                onBlur={handleFieldBlur}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white resize-y transition-all"
                placeholder="Share your thoughts..."
              />
            </div>
          </div>
        )

      case 4: // Growth & Development
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                What did you personally learn or get better at this year?
              </label>
              <textarea
                value={formData.learned}
                onChange={(e) => updateField('learned', e.target.value)}
                onBlur={handleFieldBlur}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white resize-y transition-all"
                placeholder="Share your thoughts..."
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                In which area(s) do you aspire to grow next year, and feel under-supported today?
              </label>
              <textarea
                value={formData.growthUnsupported}
                onChange={(e) => updateField('growthUnsupported', e.target.value)}
                onBlur={handleFieldBlur}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white resize-y transition-all"
                placeholder="Share your thoughts..."
              />
            </div>
          </div>
        )

      case 5: // Working with Peers
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                How comfortable do you feel giving direct, constructive feedback to peers when something isn&apos;t working?
              </label>
              <div className="space-y-2 mt-3">
                {FEEDBACK_COMFORT_OPTIONS.map((option) => (
                  <label key={option} className={`flex items-center p-3 border rounded-lg hover:bg-gray-50 hover:border-blue-300 cursor-pointer transition-colors ${
                    formData.feedbackComfort === option ? 'bg-yellow-100 border-yellow-400' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="feedbackComfort"
                      value={option}
                      checked={formData.feedbackComfort === option}
                      onChange={(e) => updateField('feedbackComfort', e.target.value)}
                      className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-900 text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                What makes it easier or harder? (Optional)
              </label>
              <textarea
                value={formData.feedbackComfortReason}
                onChange={(e) => updateField('feedbackComfortReason', e.target.value)}
                onBlur={handleFieldBlur}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white resize-y transition-all"
                placeholder="Share your thoughts..."
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                What typically stops you from giving feedback to a peer when you feel it&apos;s needed?
              </label>
              <div className="space-y-2 mt-3">
                {FEEDBACK_STOPS_OPTIONS.map((option) => (
                  <label key={option} className={`flex items-center p-3 border rounded-lg hover:bg-gray-50 hover:border-blue-300 cursor-pointer transition-colors ${
                    formData.feedbackStops?.includes(option) ? 'bg-yellow-100 border-yellow-400' : 'border-gray-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formData.feedbackStops?.includes(option) || false}
                      onChange={() => toggleFeedbackStop(option)}
                      className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-gray-900 text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
              {formData.feedbackStops?.includes('Other') && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={formData.feedbackStopsOther}
                    onChange={(e) => updateField('feedbackStopsOther', e.target.value)}
                    onBlur={handleFieldBlur}
                    placeholder="Please specify..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                When peers give you feedback, how does it usually happen today?
              </label>
              <div className="space-y-2 mt-3">
                {FEEDBACK_RECEIVED_OPTIONS.map((option) => (
                  <label key={option} className={`flex items-center p-3 border rounded-lg hover:bg-gray-50 hover:border-blue-300 cursor-pointer transition-colors ${
                    formData.feedbackReceived === option ? 'bg-yellow-100 border-yellow-400' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="feedbackReceived"
                      value={option}
                      checked={formData.feedbackReceived === option}
                      onChange={(e) => updateField('feedbackReceived', e.target.value)}
                      className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-900 text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                What would make it easier or safer for you to give and receive peer feedback next year?
              </label>
              <textarea
                value={formData.feedbackEasier}
                onChange={(e) => updateField('feedbackEasier', e.target.value)}
                onBlur={handleFieldBlur}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white resize-y transition-all"
                placeholder="Share your thoughts..."
              />
            </div>
          </div>
        )

      case 6: // Leadership Support
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                What is the one thing I / your immediate lead are doing that adds most value to you and your work, and should continue doing?
              </label>
              <textarea
                value={formData.leadershipValue}
                onChange={(e) => updateField('leadershipValue', e.target.value)}
                onBlur={handleFieldBlur}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white resize-y transition-all"
                placeholder="Share your thoughts..."
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                What are the few things I / your immediate lead could do differently to help you do your best work?
              </label>
              <textarea
                value={formData.leadershipDifferent}
                onChange={(e) => updateField('leadershipDifferent', e.target.value)}
                onBlur={handleFieldBlur}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white resize-y transition-all"
                placeholder="Share your thoughts..."
              />
            </div>
          </div>
        )

      case 7: // Inner Growth
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                Are aspects of this space and the tools that Sadhguru offers enhancing your life?
              </label>
              <div className="space-y-2 mt-3">
                {TOOLS_ENHANCING_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="toolsEnhancing"
                      value={option}
                      checked={formData.toolsEnhancing === option}
                      onChange={(e) => updateField('toolsEnhancing', e.target.value)}
                      className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-900 text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                How regular are you with your Sadhana?
              </label>
              <div className="space-y-2 mt-3">
                {SADHANA_REGULARITY_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="sadhanaRegularity"
                      value={option}
                      checked={formData.sadhanaRegularity === option}
                      onChange={(e) => updateField('sadhanaRegularity', e.target.value)}
                      className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-900 text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                Any support you would like on this aspect?
              </label>
              <textarea
                value={formData.innerGrowthSupport}
                onChange={(e) => updateField('innerGrowthSupport', e.target.value)}
                onBlur={handleFieldBlur}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white resize-y transition-all"
                placeholder="Share your thoughts..."
              />
            </div>
          </div>
        )

      case 8: // Looking Ahead
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                If next year were a great year for you, what would be meaningfully different?
              </label>
              <textarea
                value={formData.greatYear}
                onChange={(e) => updateField('greatYear', e.target.value)}
                onBlur={handleFieldBlur}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white resize-y transition-all"
                placeholder="Share your thoughts..."
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-2">
                Anything else?
              </label>
              <textarea
                value={formData.anythingElse}
                onChange={(e) => updateField('anythingElse', e.target.value)}
                onBlur={handleFieldBlur}
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white resize-y transition-all"
                placeholder="Share any additional thoughts..."
              />
            </div>
          </div>
        )

      case 9: // Final/Review
        return (
          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Ready to submit?
              </h3>
              <p className="text-blue-700">
                Your responses will be saved to a Google Doc. Make sure you&apos;ve filled in all the sections you want to complete.
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                You can go back to any section to make changes before submitting.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const isIntroSection = SECTIONS[currentSection]?.isIntro

  return (
    <div className="min-h-screen py-8 px-4 pb-24">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar - Hidden for intro section */}
        {!isIntroSection && (() => {
          const actualSection = currentSection > 1 ? currentSection - 1 : currentSection
          const totalSections = SECTIONS.length - 1 // Exclude intro from count
          const progressPercent = Math.round((actualSection / totalSections) * 100)
          
          return (
            <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">
                    Section {actualSection + 1} of {totalSections}
                  </span>
                  <span className="text-sm text-gray-600 ml-2">
                    {SECTIONS[currentSection].name}
                  </span>
                  {lastSaved && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-3 rounded-full shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          )
        })()}

        {/* Section Title - Hidden for intro section */}
        {!isIntroSection && (
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {currentSection > 1 ? currentSection - 1 : currentSection + 1}
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                {SECTIONS[currentSection].name}
              </h2>
            </div>
            <p className="text-gray-600 text-lg ml-12">
              {currentSection === 0 && 'Let\'s start with some basic information'}
              {currentSection === 2 && (
                <>
                  <div className="italic text-gray-500 mb-2">
                    &ldquo;It&apos;s not the amount of action but the depth of experience that makes life rich and fulfilling.&rdquo; - Sadhguru
                  </div>
                  Reflect on your achievements and impact
                </>
              )}
              {currentSection === 3 && (
                <>
                  <div className="italic text-gray-500 mb-2">
                    &ldquo;If you turn inward, you will find a space where there is a solution for everything.&rdquo; - Sadhguru
                  </div>
                  Share what challenged you
                </>
              )}
              {currentSection === 4 && (
                <>
                  <div className="italic text-gray-500 mb-2">
                    &ldquo;Anything you do willingly will become a great pleasure and a process of growth for you.&rdquo; - Sadhguru
                  </div>
                  Think about your growth journey
                </>
              )}
              {currentSection === 5 && (
                <>
                  <div className="italic text-gray-500 mb-2">
                    &ldquo;If you think everyone is out to get you, you will become small. Trust is important.&rdquo; - Sadhguru
                  </div>
                  Reflect on peer relationships
                </>
              )}
              {currentSection === 6 && 'Share feedback for leadership'}
              {currentSection === 7 && (
                <>
                  <div className="italic text-gray-500 mb-2">
                    &ldquo;Success will come easy once you function at your full potential.&rdquo; - Sadhguru
                  </div>
                  Reflect on your inner growth journey
                </>
              )}
              {currentSection === 8 && (
                <>
                  <div className="italic text-gray-500 mb-2">
                    &ldquo;It is good to have a plan, but it is more important to have a purpose. If you have a purpose, plan will evolve and manifest.&rdquo; - Sadhguru
                  </div>
                  Envision your future
                </>
              )}
              {currentSection === 9 && 'Review and submit'}
            </p>
          </motion.div>
        )}

        {/* Form Content */}
        <motion.div
          id="form-content"
          key={currentSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-4 fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md p-4 shadow-2xl border-t border-gray-200 z-10">
          <div className="max-w-3xl mx-auto w-full flex justify-between items-center gap-4">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {!isIntroSection && (() => {
              const actualSection = currentSection > 1 ? currentSection - 1 : currentSection
              const totalSections = SECTIONS.length - 1
              return (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                  <span className="font-semibold">{actualSection + 1}</span>
                  <span className="text-gray-400">/</span>
                  <span>{totalSections}</span>
                </div>
              )
            })()}

            {currentSection < SECTIONS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 active:scale-100 transition-all duration-200 flex items-center gap-2"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name || !formData.email}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Survey
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
