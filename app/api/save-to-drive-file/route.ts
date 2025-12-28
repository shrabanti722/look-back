import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { SurveyData } from '@/app/page'

// Initialize Google Auth
function getAuth() {
  const encoded = process.env.GOOGLE_SERVICE_ACCOUNT_KEY

  if (!encoded) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY not set')
  }

  const key = JSON.parse(
    Buffer.from(encoded, 'base64').toString('utf8')
  )

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: key.client_email,
      private_key: key.private_key,
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  })
}

// Format the survey data
function formatSurveyData(data: SurveyData): string {
  let content = `2025 - Look Back Survey\n\n`
  content += `Name: ${data.name}\n`
  content += `Email: ${data.email}\n`
  if (data.role) content += `Role: ${data.role}\n`
  if (data.product) content += `Product: ${data.product}\n`
  content += `\n${'='.repeat(50)}\n\n`

  // Looking Back
  content += `LOOKING BACK ON THE YEAR\n\n`
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
  content += `FRICTION, STRUGGLES, AND CONSTRAINTS\n\n`
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
  content += `GROWTH AND DEVELOPMENT\n\n`
  if (data.learned) {
    content += `What did you personally learn or get better at this year?\n`
    content += `${data.learned}\n\n`
  }
  if (data.growthUnsupported) {
    content += `Where do you want to grow next year, but feel under-supported today?\n`
    content += `${data.growthUnsupported}\n\n`
  }

  // Working with Peers
  content += `${'='.repeat(50)}\n\n`
  content += `WORKING WITH PEERS\n\n`
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
  content += `LEADERSHIP SUPPORT & FEEDBACK\n\n`
  if (data.leadershipDifferent) {
    content += `What are the few things I could do differently to help you do your best work?\n`
    content += `${data.leadershipDifferent}\n\n`
  }
  if (data.leadershipValue) {
    content += `What is the one thing I am doing that adds most value to you and your work, and I should continue doing?\n`
    content += `${data.leadershipValue}\n\n`
  }

  // Looking Ahead
  content += `${'='.repeat(50)}\n\n`
  content += `LOOKING AHEAD\n\n`
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

export async function POST(request: NextRequest) {
  try {
    const data: SurveyData = await request.json()

    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    const auth = getAuth()
    const drive = google.drive({ version: 'v3', auth })

    // Format the content
    const content = formatSurveyData(data)
    const fileName = `2025 Look Back - ${data.name} - ${new Date().toISOString().split('T')[0]}.txt`

    // Get folder ID from environment or use shared drive
    const folderId = '1D5_cLQkk1iz93AkxABsLb8c1sAeQ_J8U'
    const supportsAllDrives = true

    // Create text file in Google Drive
    const fileRequest: any = {
      requestBody: {
        name: fileName,
        mimeType: 'text/plain',
      },
      media: {
        mimeType: 'text/plain',
        body: content,
      },
      supportsAllDrives,
    }

    // If folder ID is provided, add it to parents
    if (folderId) {
      fileRequest.requestBody.parents = [folderId]
    }

    const file = await drive.files.create(fileRequest)

    const fileId = file.data.id
    if (!fileId) {
      throw new Error('Failed to create file')
    }

    // Share with the user
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'writer',
        type: 'user',
        emailAddress: data.email,
      },
      sendNotificationEmail: true,
      supportsAllDrives: true,
    })

    const fileUrl = `https://drive.google.com/file/d/${fileId}/view`

    return NextResponse.json({
      success: true,
      fileId,
      fileUrl,
      message: 'Response saved to Google Drive successfully',
    })
  } catch (error: any) {
    console.error('Error saving to Drive:', error)
    
    let errorMessage = error.message || 'Unknown error'
    let helpfulHint = ''
    
    if (errorMessage.includes('storage quota') || errorMessage.includes('Service Accounts do not have storage')) {
      helpfulHint = 'Service accounts need a shared folder or shared drive. See SETUP_SHARED_DRIVE.md for instructions. Add GOOGLE_DRIVE_FOLDER_ID to your .env.local file.'
    } else if (errorMessage.includes('permission') || errorMessage.includes('PERMISSION_DENIED')) {
      helpfulHint = 'Make sure the folder is shared with: survey-docs-creator@look-back-482609.iam.gserviceaccount.com with Editor access.'
    }
    
    return NextResponse.json(
      {
        error: 'Failed to save to Drive',
        details: errorMessage,
        hint: helpfulHint,
      },
      { status: 500 }
    )
  }
}
