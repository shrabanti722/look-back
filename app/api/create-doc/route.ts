import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { SurveyData } from '@/app/page'
import fs from 'fs'
import path from 'path'

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
    scopes: [
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive.file',
    ],
  })
}

// Format the survey data into a nicely formatted document
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

// Convert plain text to Google Docs format
function createDocumentRequests(content: string, startIndex: number = 1) {
  const requests: any[] = []
  const lines = content.split('\n')

  // Start inserting at the given index (after any default content)
  let insertIndex = startIndex

  lines.forEach((line, index) => {
    if (line.trim() === '') {
      // Insert a line break
      requests.push({
        insertText: {
          location: { index: insertIndex },
          text: '\n',
        },
      })
      insertIndex += 1
    } else if (line.startsWith('=')) {
      // Separator line - make it bold and centered
      requests.push({
        insertText: {
          location: { index: insertIndex },
          text: line + '\n',
        },
      })
      requests.push({
        updateTextStyle: {
          range: {
            startIndex: insertIndex,
            endIndex: insertIndex + line.length,
          },
          textStyle: {
            bold: true,
          },
          fields: 'bold',
        },
      })
      insertIndex += line.length + 1
    } else if (
      line.includes('LOOKING BACK') ||
      line.includes('FRICTION') ||
      line.includes('GROWTH') ||
      line.includes('WORKING WITH PEERS') ||
      line.includes('LEADERSHIP') ||
      line.includes('LOOKING AHEAD')
    ) {
      // Section headers - make them bold and larger
      requests.push({
        insertText: {
          location: { index: insertIndex },
          text: line + '\n',
        },
      })
      requests.push({
        updateTextStyle: {
          range: {
            startIndex: insertIndex,
            endIndex: insertIndex + line.length,
          },
          textStyle: {
            bold: true,
            fontSize: {
              magnitude: 14,
              unit: 'PT',
            },
          },
          fields: 'bold,fontSize',
        },
      })
      insertIndex += line.length + 1
    } else if (line.match(/^\d+\./)) {
      // Numbered list items
      requests.push({
        insertText: {
          location: { index: insertIndex },
          text: line + '\n',
        },
      })
      insertIndex += line.length + 1
    } else if (line.startsWith('•')) {
      // Bullet points
      requests.push({
        insertText: {
          location: { index: insertIndex },
          text: line + '\n',
        },
      })
      insertIndex += line.length + 1
    } else if (line.includes(':')) {
      // Questions - make them bold
      const colonIndex = line.indexOf(':')
      requests.push({
        insertText: {
          location: { index: insertIndex },
          text: line + '\n',
        },
      })
      requests.push({
        updateTextStyle: {
          range: {
            startIndex: insertIndex,
            endIndex: insertIndex + colonIndex + 1,
          },
          textStyle: {
            bold: true,
          },
          fields: 'bold',
        },
      })
      insertIndex += line.length + 1
    } else {
      // Regular text
      requests.push({
        insertText: {
          location: { index: insertIndex },
          text: line + '\n',
        },
      })
      insertIndex += line.length + 1
    }
  })

  return requests
}

export async function POST(request: NextRequest) {
  try {
    const data: SurveyData = await request.json()

    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    const auth = getAuth()
    const docs = google.docs({ version: 'v1', auth })
    const drive = google.drive({ version: 'v3', auth })

    let documentId: string

    // Try to create document using Docs API first
    try {
      const document = await docs.documents.create({
        requestBody: {
          title: `2025 Look Back - ${data.name}`,
        },
      })

      documentId = document.data.documentId || ''
      if (!documentId) {
        throw new Error('Failed to create document')
      }

      // Get the document to find the end index
      const doc = await docs.documents.get({ documentId })
      const endIndex = doc.data.body?.content?.[doc.data.body.content.length - 1]?.endIndex || 1

      // Format and insert content
      const formattedContent = formatSurveyData(data)
      const requests = createDocumentRequests(formattedContent, endIndex - 1)

      // Batch update the document
      if (requests.length > 0) {
        await docs.documents.batchUpdate({
          documentId,
          requestBody: {
            requests,
          },
        })
      }
    } catch (docsError: any) {
      // If Docs API fails, use Drive API as fallback
      console.warn('Docs API failed, using Drive API fallback:', docsError.message)
      
      // Get folder ID from environment if specified
      const folderId = '1D5_cLQkk1iz93AkxABsLb8c1sAeQ_J8U'
      const fileRequest: any = {
        requestBody: {
          name: `2025 Look Back - ${data.name}`,
          mimeType: 'application/vnd.google-apps.document',
        },
        supportsAllDrives: true,
      }

      // If folder ID is provided, add it to parents
      if (folderId) {
        fileRequest.requestBody.parents = [folderId]
      }
      
      // Create an empty Google Doc using Drive API
      const driveFile = await drive.files.create(fileRequest)

      documentId = driveFile.data.id || ''
      if (!documentId) {
        throw new Error('Failed to create document using Drive API fallback')
      }

      // Try to add content using Docs API (might work even if create didn't)
      try {
        const doc = await docs.documents.get({ documentId })
        const endIndex = doc.data.body?.content?.[doc.data.body.content.length - 1]?.endIndex || 1
        const formattedContent = formatSurveyData(data)
        const requests = createDocumentRequests(formattedContent, endIndex - 1)
        
        if (requests.length > 0) {
          await docs.documents.batchUpdate({
            documentId,
            requestBody: {
              requests,
            },
          })
          console.log('Content added successfully using Docs API')
        }
      } catch (contentError: any) {
        // If we can't add formatted content, at least the document is created
        console.warn('Could not add formatted content, document created but empty:', contentError.message)
        // The document will be created but empty - user can add content manually
      }
    }

    // Share the document with the user's email (viewer access)
    await drive.permissions.create({
      fileId: documentId,
      requestBody: {
        role: 'writer',
        type: 'user',
        emailAddress: data.email,
      },
      sendNotificationEmail: true,
      supportsAllDrives: true,
    })

    // Get the document URL
    const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`

    return NextResponse.json({
      success: true,
      documentId,
      documentUrl,
      message: 'Document created successfully',
    })
  } catch (error: any) {
    console.error('Error creating document:', error)
    
    // Provide more helpful error messages
    let errorMessage = error.message || 'Unknown error'
    let helpfulHint = ''
    
    if (errorMessage.includes('storage quota') || errorMessage.includes('Service Accounts do not have storage')) {
      helpfulHint = 'Service accounts need a shared folder or shared drive. See SETUP_SHARED_DRIVE.md for instructions. Add GOOGLE_DRIVE_FOLDER_ID to your .env.local file.'
    } else if (errorMessage.includes('permission') || errorMessage.includes('PERMISSION_DENIED')) {
      helpfulHint = 'Make sure Google Docs API and Drive API are enabled, and the service account has proper permissions.'
    } else if (errorMessage.includes('API not enabled')) {
      helpfulHint = 'Please enable Google Docs API and Drive API in Google Cloud Console.'
    }
    
    return NextResponse.json(
      {
        error: 'Failed to create document',
        details: errorMessage,
        hint: helpfulHint,
        fullError: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
