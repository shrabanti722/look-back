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
  'Leadership Value',
  'Leadership Different',
  'Tools Enhancing',
  'Sadhana Regularity',
  'Inner Growth Support',
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

    // Check if CSV file exists and read existing content
    let csvContent = CSV_HEADERS + '\n'
    const fileExists = fs.existsSync(csvFilePath)
    
    if (fileExists) {
      // Read existing CSV content
      const existingContent = fs.readFileSync(csvFilePath, 'utf8')
      if (existingContent && existingContent.trim().length > 0) {
        csvContent = existingContent.trim()
        // Ensure CSV ends with newline before appending
        if (!csvContent.endsWith('\n')) {
          csvContent += '\n'
        }
      }
    }

    // Append new row to CSV
    const csvRow = surveyDataToCSVRow(data)
    csvContent += csvRow + '\n'

    // Write the complete CSV content (this ensures data integrity)
    fs.writeFileSync(csvFilePath, csvContent, 'utf8')

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
