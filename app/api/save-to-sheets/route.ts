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
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file',
    ],
  })
}

// Convert survey data to row format
function surveyDataToRow(data: SurveyData): any[] {
  return [
    new Date().toISOString(), // Timestamp
    data.name || '',
    data.email || '',
    data.role || '',
    data.product || '',
    // Looking Back
    (data.proudOf || []).join(' | '),
    data.meaningfulImpact || '',
    // Friction
    data.struggles || '',
    data.workHarder || '',
    // Growth
    data.learned || '',
    data.growthUnsupported || '',
    // Peer Feedback
    data.feedbackComfort || '',
    data.feedbackComfortReason || '',
    (data.feedbackStops || []).join(' | '),
    data.feedbackStopsOther || '',
    data.feedbackReceived || '',
    data.feedbackReceivedReason || '',
    data.feedbackEasier || '',
    // Leadership
    data.leadershipDifferent || '',
    data.leadershipValue || '',
    // Looking Ahead
    data.greatYear || '',
    data.anythingElse || '',
  ]
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
    const sheets = google.sheets({ version: 'v4', auth })
    const drive = google.drive({ version: 'v3', auth })

    // Check if spreadsheet exists, if not create it
    const SPREADSHEET_NAME = '2025 Look Back Survey Responses'
    let spreadsheetId: string

    try {
      // Try to find existing spreadsheet
      const files = await drive.files.list({
        q: `name='${SPREADSHEET_NAME}' and mimeType='application/vnd.google-apps.spreadsheet'`,
        fields: 'files(id, name)',
      })

      if (files.data.files && files.data.files.length > 0) {
        spreadsheetId = files.data.files[0].id || ''
      } else {
        // Create new spreadsheet in shared folder/drive if specified
        const folderId = '1D5_cLQkk1iz93AkxABsLb8c1sAeQ_J8U'
        const spreadsheetRequest: any = {
          requestBody: {
            properties: {
              title: SPREADSHEET_NAME,
            },
            sheets: [
              {
                properties: {
                  title: 'Responses',
                },
              },
            ],
          },
        }

        // If folder ID is provided, create in that folder
        if (folderId) {
          const fileMetadata = {
            name: SPREADSHEET_NAME,
            mimeType: 'application/vnd.google-apps.spreadsheet',
            parents: [folderId],
          }
          
          // Create spreadsheet file in Drive first
          const driveFile = await drive.files.create({
            requestBody: fileMetadata,
            supportsAllDrives: true,
          })
          
          spreadsheetId = driveFile.data.id || ''
          
          // Now initialize the spreadsheet content
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [
                {
                  updateSpreadsheetProperties: {
                    properties: {
                      title: SPREADSHEET_NAME,
                    },
                    fields: 'title',
                  },
                },
              ],
            },
          })
        } else {
          // Create normally (will fail if no shared drive/folder)
          const spreadsheet = await sheets.spreadsheets.create(spreadsheetRequest)
          spreadsheetId = spreadsheet.data.spreadsheetId || ''
        }

        // Add headers
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: 'Responses!A1:V1',
          valueInputOption: 'RAW',
          requestBody: {
            values: [[
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
            ]],
          },
        })

        // Format header row
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId: 0,
                    startRowIndex: 0,
                    endRowIndex: 1,
                  },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 0.2, green: 0.4, blue: 0.8 },
                      textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true },
                    },
                  },
                  fields: 'userEnteredFormat(backgroundColor,textFormat)',
                },
              },
            ],
          },
        })
      }

      // Append the new row
      const row = surveyDataToRow(data)
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Responses!A:V',
        valueInputOption: 'RAW',
        requestBody: {
          values: [row],
        },
      })

      // Share with the user
      await drive.permissions.create({
        fileId: spreadsheetId,
        requestBody: {
          role: 'reader',
          type: 'user',
          emailAddress: data.email,
        },
        sendNotificationEmail: true,
        supportsAllDrives: true,
      })

      const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`

      return NextResponse.json({
        success: true,
        spreadsheetId,
        spreadsheetUrl,
        message: 'Response saved to Google Sheet successfully',
      })
    } catch (error: any) {
      console.error('Error with Sheets API:', error)
      throw error
    }
  } catch (error: any) {
    console.error('Error saving to sheet:', error)
    
    let errorMessage = error.message || 'Unknown error'
    let helpfulHint = ''
    
    if (errorMessage.includes('storage quota') || errorMessage.includes('Service Accounts do not have storage')) {
      helpfulHint = 'Service accounts need a shared folder or shared drive. See SETUP_SHARED_DRIVE.md for instructions. Add GOOGLE_DRIVE_FOLDER_ID to your .env.local file.'
    } else if (errorMessage.includes('permission') || errorMessage.includes('PERMISSION_DENIED')) {
      helpfulHint = 'Make sure Google Sheets API is enabled and the folder is shared with: survey-docs-creator@look-back-482609.iam.gserviceaccount.com'
    }
    
    return NextResponse.json(
      {
        error: 'Failed to save to sheet',
        details: errorMessage,
        hint: helpfulHint,
      },
      { status: 500 }
    )
  }
}
