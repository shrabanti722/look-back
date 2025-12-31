import { NextRequest, NextResponse } from 'next/server'
import { SurveyData } from '@/app/page'
import { Resend } from 'resend'

// Convert survey data to CSV row
function surveyDataToCSVRow(data: SurveyData): string {
  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return ''
    const str = String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const row = [
    new Date().toISOString(),
    escapeCSV(data.name),
    escapeCSV(data.email),
    escapeCSV(data.role),
    escapeCSV(data.product),
    escapeCSV((data.proudOf || []).join(' | ')),
    escapeCSV(data.meaningfulImpact),
    escapeCSV(data.struggles),
    escapeCSV(data.workHarder),
    escapeCSV(data.learned),
    escapeCSV(data.growthUnsupported),
    escapeCSV(data.feedbackComfort),
    escapeCSV(data.feedbackComfortReason),
    escapeCSV((data.feedbackStops || []).join(' | ')),
    escapeCSV(data.feedbackStopsOther),
    escapeCSV(data.feedbackReceived),
    escapeCSV(data.feedbackReceivedReason),
    escapeCSV(data.feedbackEasier),
    escapeCSV(data.leadershipValue),
    escapeCSV(data.leadershipDifferent),
    escapeCSV(data.toolsEnhancing),
    escapeCSV(data.sadhanaRegularity),
    escapeCSV(data.innerGrowthSupport),
    escapeCSV(data.greatYear),
    escapeCSV(data.anythingElse),
  ]

  return row.join(',')
}

const CSV_HEADERS = [
  'Timestamp',
  'Name',
  'Email',
  'Role',
  'Product',
  'Proud Of',
  'Meaningful Impact',
  'Struggles',
  'Work Harder',
  'Learned',
  'Growth Unsupported',
  'Feedback Comfort',
  'Feedback Comfort Reason',
  'Feedback Stops',
  'Feedback Stops Other',
  'Feedback Received',
  'Feedback Received Reason',
  'Feedback Easier',
  'Leadership Value',
  'Leadership Different',
  'Tools Enhancing',
  'Sadhana Regularity',
  'Inner Growth Support',
  'Great Year',
  'Anything Else',
].join(',')

// Format survey data for email notification
function formatSurveyDataForEmail(data: SurveyData): string {
  let content = `2025 - Look Back Survey Response\n\n`
  content += `Name: ${data.name}\n`
  content += `Email: ${data.email}\n`
  if (data.role) content += `Role: ${data.role}\n`
  if (data.product) content += `Product Area: ${data.product}\n`
  content += `\n${'='.repeat(50)}\n\n`

  // Looking Back
  content += `🔍 LOOKING BACK ON THE YEAR\n\n`
  if (data.proudOf && data.proudOf.length > 0) {
    content += `What are you most proud of from this year? (1–3 things)\n`
    data.proudOf.forEach((item, index) => {
      if (item.trim()) {
        content += `${index + 1}. ${item}\n`
      }
    })
    content += `\n`
  }
  if (data.meaningfulImpact) {
    content += `What work of yours had a meaningful impact but may not be very visible?\n`
    content += `${data.meaningfulImpact}\n\n`
  }

  // Friction, Struggles, and Constraints
  content += `${'='.repeat(50)}\n\n`
  content += `🧱 FRICTION, STRUGGLES, AND CONSTRAINTS\n\n`
  if (data.struggles) {
    content += `What did you struggle with?\n`
    content += `${data.struggles}\n\n`
  }
  if (data.workHarder) {
    content += `What made your work harder than it needed to be this year?\n`
    content += `${data.workHarder}\n\n`
  }

  // Growth and Development
  content += `${'='.repeat(50)}\n\n`
  content += `🚀 GROWTH AND DEVELOPMENT\n\n`
  if (data.learned) {
    content += `What did you personally learn or get better at this year?\n`
    content += `${data.learned}\n\n`
  }
  if (data.growthUnsupported) {
    content += `In which area(s) do you aspire to grow next year, and feel under-supported today?\n`
    content += `${data.growthUnsupported}\n\n`
  }

  // Working with Peers
  content += `${'='.repeat(50)}\n\n`
  content += `🤝 WORKING WITH PEERS\n\n`
  if (data.feedbackComfort) {
    content += `How comfortable do you feel giving direct, constructive feedback to peers when something isn't working?\n`
    content += `${data.feedbackComfort}\n\n`
  }
  if (data.feedbackComfortReason) {
    content += `What makes it easier or harder?\n`
    content += `${data.feedbackComfortReason}\n\n`
  }
  if (data.feedbackStops && data.feedbackStops.length > 0) {
    content += `What typically stops you from giving feedback to a peer when you feel it's needed?\n`
    data.feedbackStops.forEach((stop) => {
      content += `• ${stop}\n`
    })
    if (data.feedbackStopsOther) {
      content += `  - ${data.feedbackStopsOther}\n`
    }
    content += `\n`
  }
  if (data.feedbackReceived) {
    content += `When peers give you feedback, how does it usually happen today?\n`
    content += `${data.feedbackReceived}\n\n`
  }
  if (data.feedbackEasier) {
    content += `What would make it easier or safer for you to give and receive peer feedback next year?\n`
    content += `${data.feedbackEasier}\n\n`
  }

  // Leadership Support & Feedback
  content += `${'='.repeat(50)}\n\n`
  content += `🧭 LEADERSHIP SUPPORT & FEEDBACK\n\n`
  if (data.leadershipValue) {
    content += `What is the one thing I / your immediate lead are doing that adds most value to you and your work, and should continue doing?\n`
    content += `${data.leadershipValue}\n\n`
  }
  if (data.leadershipDifferent) {
    content += `What are the few things I / your immediate lead could do differently to help you do your best work?\n`
    content += `${data.leadershipDifferent}\n\n`
  }

  // Inner Growth
  content += `${'='.repeat(50)}\n\n`
  content += `🌟 INNER GROWTH\n\n`
  if (data.toolsEnhancing) {
    content += `Are aspects of this space and the tools that Sadhguru offers enhancing your life?\n`
    content += `${data.toolsEnhancing}\n\n`
  }
  if (data.sadhanaRegularity) {
    content += `How regular are you with your Sadhana?\n`
    content += `${data.sadhanaRegularity}\n\n`
  }
  if (data.innerGrowthSupport) {
    content += `Any support you would like on this aspect?\n`
    content += `${data.innerGrowthSupport}\n\n`
  }

  // Looking Ahead
  content += `${'='.repeat(50)}\n\n`
  content += `🌟 LOOKING AHEAD\n\n`
  if (data.greatYear) {
    content += `If next year were a great year for you, what would be meaningfully different?\n`
    content += `${data.greatYear}\n\n`
  }
  if (data.anythingElse) {
    content += `Anything else?\n`
    content += `${data.anythingElse}\n\n`
  }

  content += `\n${'='.repeat(50)}\n`
  content += `\nSubmitted on: ${new Date().toLocaleString()}\n`

  return content
}

// Send notification email with all survey responses
async function sendNotificationEmail(data: SurveyData) {
  const recipientEmail = process.env.SURVEY_RECIPIENT_EMAIL
  
  // Only send if email is configured
  if (!recipientEmail) {
    return null // Email not configured, silently skip
  }

  // Try SendGrid first (if configured)
  if (process.env.SENDGRID_API_KEY) {
    try {
      const fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.SURVEY_FROM_EMAIL || 'noreply@example.com'
      const emailContent = formatSurveyDataForEmail(data)
      
      // Validate email format for replyTo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const isValidEmail = data.email && emailRegex.test(data.email)

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: recipientEmail }],
              subject: `New Survey Submission - ${data.name}`,
              ...(isValidEmail && {
                reply_to: { email: data.email },
              }),
            },
          ],
          from: { email: fromEmail },
          content: [
            {
              type: 'text/plain',
              value: emailContent,
            },
          ],
        }),
      })

      if (response.ok) {
        console.log('Email sent successfully via SendGrid')
        return { success: true, provider: 'SendGrid' }
      } else {
        const errorText = await response.text()
        console.error('SendGrid error:', errorText)
        throw new Error(`SendGrid API error: ${response.status}`)
      }
    } catch (error: any) {
      console.error('SendGrid email failed, trying Resend:', error.message)
      // Fall through to try Resend
    }
  }

  // Try Resend (if configured)
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Survey <onboarding@resend.dev>'
      const emailContent = formatSurveyDataForEmail(data)

      // Validate email format for replyTo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const isValidEmail = data.email && emailRegex.test(data.email)
      
      // Prepare email options
      const emailOptions: any = {
        from: fromEmail,
        to: recipientEmail,
        subject: `New Survey Submission - ${data.name}`,
        text: emailContent,
        // Only add replyTo if email is valid (Resend requires valid email format)
        ...(isValidEmail && { replyTo: data.email }),
      }

      const result = await resend.emails.send(emailOptions)
      console.log('Email sent successfully via Resend')
      return result
    } catch (error: any) {
      console.error('Resend email failed:', error.message)
      return null
    }
  }

  // No email service configured
  console.log('No email service configured (SendGrid or Resend)')
  return null
}

export async function POST(request: NextRequest) {
  try {
    const data: SurveyData = await request.json()

    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Option 1: Supabase Storage (Recommended - Free)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { createClient } = require('@supabase/supabase-js')
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
      )

      // Read existing CSV or create new
      const fileName = 'survey-responses.csv'
      let csvContent = CSV_HEADERS + '\n'

      try {
        const { data: existingFile, error: downloadError } = await supabase.storage
          .from('survey-data')
          .download(fileName)

        if (existingFile && !downloadError) {
          const existingContent = await existingFile.text()
          // Ensure we have valid CSV content
          if (existingContent && existingContent.trim().length > 0) {
            csvContent = existingContent.trim()
            // Ensure CSV ends with newline before appending
            if (!csvContent.endsWith('\n')) {
              csvContent += '\n'
            }
            // Log for debugging
            const existingRowCount = csvContent.split('\n').filter(line => line.trim().length > 0).length - 1 // -1 for header
            console.log(`Found existing CSV with ${existingRowCount} rows`)
          } else {
            console.log('Existing file is empty, starting fresh')
          }
        } else if (downloadError) {
          console.log('Error downloading existing file (will create new):', downloadError.message)
        }
      } catch (e: any) {
        // File doesn't exist yet, that's okay - we'll create it with headers
        console.log('No existing CSV file, creating new one:', e.message)
      }

      // Append new row
      const newRow = surveyDataToCSVRow(data)
      csvContent += newRow + '\n'

      // Log final content length for debugging
      const finalRowCount = csvContent.split('\n').filter(line => line.trim().length > 0).length - 1 // -1 for header
      console.log(`Uploading CSV with ${finalRowCount} total rows (including new entry)`)

      // Convert to Blob for upload
      const csvBlob = new Blob([csvContent], { type: 'text/csv' })

      // Upload updated CSV with explicit cache control
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('survey-data')
        .upload(fileName, csvBlob, {
          contentType: 'text/csv',
          upsert: true, // Overwrite if exists
          cacheControl: 'no-cache', // Prevent caching issues
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error(`Failed to upload CSV: ${uploadError.message}`)
      }

      console.log('CSV uploaded successfully:', uploadData?.path)

      // Send notification email (non-blocking - won't fail if email fails)
      sendNotificationEmail(data).catch((err) => {
        console.error('Email notification error (non-critical):', err)
      })

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('survey-data')
        .getPublicUrl(fileName)

      return NextResponse.json({
        success: true,
        message: 'Response saved to CSV in cloud storage',
        csvUrl: urlData.publicUrl,
        downloadUrl: `/api/download-csv-cloud`,
      })
    }

    // Option 2: AWS S3 (if configured)
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      const AWS = require('aws-sdk')
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1',
      })

      const bucketName = process.env.AWS_S3_BUCKET
      const fileName = 'survey-responses.csv'

      // Get existing CSV
      let csvContent = CSV_HEADERS + '\n'
      try {
        const existing = await s3.getObject({
          Bucket: bucketName,
          Key: fileName,
        }).promise()
        csvContent = existing.Body?.toString('utf8') || csvContent
      } catch (e) {
        // File doesn't exist, use headers
      }

      // Append new row
      csvContent += surveyDataToCSVRow(data) + '\n'

      // Upload to S3
      await s3.putObject({
        Bucket: bucketName,
        Key: fileName,
        Body: csvContent,
        ContentType: 'text/csv',
      }).promise()

      // Send notification email (non-blocking - won't fail if email fails)
      sendNotificationEmail(data).catch((err) => {
        console.error('Email notification error (non-critical):', err)
      })

      return NextResponse.json({
        success: true,
        message: 'Response saved to CSV in S3',
        bucket: bucketName,
        fileName: fileName,
      })
    }

    // Fallback: Return error if no cloud storage configured
    throw new Error(
      'No cloud storage configured. Please set up Supabase Storage or AWS S3. ' +
      'See CSV_STORAGE_SETUP.md for instructions.'
    )
  } catch (error: any) {
    console.error('Error saving to CSV cloud:', error)
    return NextResponse.json(
      {
        error: 'Failed to save to CSV',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
