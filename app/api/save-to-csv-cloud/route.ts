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
    escapeCSV(data.leadershipDifferent),
    escapeCSV(data.leadershipValue),
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
  'Leadership Different',
  'Leadership Value',
  'Great Year',
  'Anything Else',
].join(',')

// Send notification email with just name and email
async function sendNotificationEmail(data: SurveyData) {
  // Only send if email is configured
  if (!process.env.RESEND_API_KEY || !process.env.SURVEY_RECIPIENT_EMAIL) {
    return null // Email not configured, silently skip
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const recipientEmail = process.env.SURVEY_RECIPIENT_EMAIL
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Survey <onboarding@resend.dev>'

    const emailContent = `New Survey Submission

Name: ${data.name}
Email: ${data.email}

Submitted on: ${new Date().toLocaleString()}
`

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

    return result
  } catch (error: any) {
    // Log error but don't throw - we don't want email failures to break the submission
    console.error('Failed to send notification email:', error.message)
    return null
  }
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
          csvContent = await existingFile.text()
        }
      } catch (e: any) {
        // File doesn't exist yet, that's okay - we'll create it with headers
        console.log('No existing CSV file, creating new one:', e.message)
      }

      // Append new row
      csvContent += surveyDataToCSVRow(data) + '\n'

      // Upload updated CSV
      const { error: uploadError } = await supabase.storage
        .from('survey-data')
        .upload(fileName, csvContent, {
          contentType: 'text/csv',
          upsert: true, // Overwrite if exists
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error(`Failed to upload CSV: ${uploadError.message}`)
      }

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
