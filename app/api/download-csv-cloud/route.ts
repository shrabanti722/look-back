import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Option 1: Supabase Storage
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { createClient } = require('@supabase/supabase-js')
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
      )

      const { data, error } = await supabase.storage
        .from('survey-data')
        .download('survey-responses.csv')

        console.log(data, error)

      if (error) throw error

      const csvContent = await data.text()

      console.log(csvContent)

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="survey-responses-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    // Option 2: AWS S3
    if (process.env.AWS_ACCESS_KEY_ID) {
      const AWS = require('aws-sdk')
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1',
      })

      const result = await s3.getObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: 'survey-responses.csv',
      }).promise()

      return new NextResponse(result.Body.toString('utf8'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="survey-responses-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    throw new Error('No cloud storage configured')
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
