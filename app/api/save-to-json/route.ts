import { NextRequest, NextResponse } from 'next/server'
import { SurveyData } from '@/app/page'
import fs from 'fs'
import path from 'path'

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

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `${timestamp}-${data.name.replace(/[^a-z0-9]/gi, '_')}.json`
    const filepath = path.join(responsesDir, filename)

    // Save the response
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8')

    // Also append to a master file for easy viewing
    const masterFile = path.join(responsesDir, 'all-responses.json')
    let allResponses: SurveyData[] = []
    
    if (fs.existsSync(masterFile)) {
      const existing = fs.readFileSync(masterFile, 'utf8')
      allResponses = JSON.parse(existing)
    }
    
    allResponses.push({
      ...data,
      submittedAt: new Date().toISOString(),
    })
    
    fs.writeFileSync(masterFile, JSON.stringify(allResponses, null, 2), 'utf8')

    return NextResponse.json({
      success: true,
      message: 'Response saved successfully',
      filename: filename,
      filepath: filepath,
      totalResponses: allResponses.length,
    })
  } catch (error: any) {
    console.error('Error saving to JSON:', error)
    return NextResponse.json(
      {
        error: 'Failed to save response',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
