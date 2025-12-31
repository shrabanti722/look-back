import { NextRequest, NextResponse } from 'next/server'
import { SurveyData } from '@/app/page'

// Format survey data for email (reuse from save-to-csv-cloud)
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

// Send email using SendGrid
export async function POST(request: NextRequest) {
  try {
    const data: SurveyData = await request.json()

    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    if (!process.env.SENDGRID_API_KEY || !process.env.SURVEY_RECIPIENT_EMAIL) {
      return NextResponse.json(
        { error: 'SendGrid API key and recipient email must be configured' },
        { status: 500 }
      )
    }

    const emailContent = formatSurveyDataForEmail(data)
    const recipientEmail = process.env.SURVEY_RECIPIENT_EMAIL
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.SURVEY_FROM_EMAIL || 'noreply@example.com'

    // Validate email format for replyTo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValidEmail = data.email && emailRegex.test(data.email)

    // Send email via SendGrid API
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

    if (!response.ok) {
      const errorText = await response.text()
      console.error('SendGrid error:', errorText)
      throw new Error(`SendGrid API error: ${response.status} - ${errorText}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully via SendGrid',
    })
  } catch (error: any) {
    console.error('Error sending email via SendGrid:', error)
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error.message,
      },
      { status: 500 }
    )
  }
}

