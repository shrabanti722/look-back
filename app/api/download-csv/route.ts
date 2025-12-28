import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const csvFilePath = path.join(process.cwd(), 'survey-responses', 'survey-responses.csv')

    if (!fs.existsSync(csvFilePath)) {
      return NextResponse.json(
        { error: 'CSV file not found. No responses yet.' },
        { status: 404 }
      )
    }

    // Read the CSV file
    const csvContent = fs.readFileSync(csvFilePath, 'utf8')

    // Return as downloadable file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="survey-responses-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error: any) {
    console.error('Error downloading CSV:', error)
    return NextResponse.json(
      {
        error: 'Failed to download CSV',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
