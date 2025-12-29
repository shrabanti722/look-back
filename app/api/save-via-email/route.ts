import { NextRequest, NextResponse } from 'next/server'
import { SurveyData } from '@/app/page'
import { Resend } from 'resend'

// Format the survey data for email
function formatSurveyDataForEmail(data: SurveyData): string {
  let content = `2025 - Look Back Survey Response\n\n`
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
  content += `INNER GROWTH\n\n`
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

    // Get recipient email from environment (default to your email)
    const recipientEmail = process.env.SURVEY_RECIPIENT_EMAIL || process.env.EMAIL || 'your-email@example.com'
    
    // Format the email content
    const emailContent = formatSurveyDataForEmail(data)
    const subject = `2025 Look Back Survey - ${data.name}`

    // Use Resend to send email
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set. Please add it to your environment variables.')
    }
    
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    // Validate email format for replyTo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValidEmail = data.email && emailRegex.test(data.email)
    
    // Prepare email options
    const emailOptions: any = {
      from: process.env.RESEND_FROM_EMAIL || 'Survey <onboarding@resend.dev>',
      to: recipientEmail,
      subject: subject,
      text: emailContent,
    }
    
    // Only add replyTo if email is valid
    if (isValidEmail) {
      emailOptions.replyTo = data.email
    }
    
    // Send email with the survey response
    const emailResult = await resend.emails.send(emailOptions)

    if (emailResult.error) {
      throw new Error(`Failed to send email: ${emailResult.error.message}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Response sent via email successfully',
      recipient: recipientEmail,
      emailId: emailResult.data?.id,
    })
  } catch (error: any) {
    console.error('Error saving via email:', error)
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
