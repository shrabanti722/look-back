import { NextRequest, NextResponse } from 'next/server'
import { SurveyData } from '@/app/page'
import fs from 'fs'
import path from 'path'

// Convert survey data to CSV row
function surveyDataToCSVRow(data: SurveyData): string {
  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return ''
    const str = String(value)
    // If contains comma, quote, or newline, wrap in quotes and escape quotes
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

// CSV Headers
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

export async function POST(request: NextRequest) {
  try {
    const data: SurveyData = await request.json()

    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Create responses directory if it doesn't exist
    const responsesDir = path.join(process.cwd(), 'survey-responses')
    if (!fs.existsSync(responsesDir)) {
      fs.mkdirSync(responsesDir, { recursive: true })
    }

    const csvFilePath = path.join(responsesDir, 'survey-responses.csv')

    // Check if CSV file exists, if not create with headers
    const fileExists = fs.existsSync(csvFilePath)
    
    if (!fileExists) {
      // Create new CSV file with headers
      fs.writeFileSync(csvFilePath, CSV_HEADERS + '\n', 'utf8')
    }

    // Append new row to CSV
    const csvRow = surveyDataToCSVRow(data)
    fs.appendFileSync(csvFilePath, csvRow + '\n', 'utf8')

    // Get file stats
    const stats = fs.statSync(csvFilePath)
    const fileSize = stats.size

    return NextResponse.json({
      success: true,
      message: 'Response saved to CSV successfully',
      csvPath: csvFilePath,
      fileSize: fileSize,
      totalResponses: fileExists ? 'See CSV file' : 1,
    })
  } catch (error: any) {
    console.error('Error saving to CSV:', error)
    return NextResponse.json(
      {
        error: 'Failed to save to CSV',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
