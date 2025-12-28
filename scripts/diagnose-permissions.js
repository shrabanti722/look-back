#!/usr/bin/env node

/**
 * Detailed diagnostic script for Google Docs API permissions
 * Run: node scripts/diagnose-permissions.js
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function diagnosePermissions() {
  console.log('🔍 Detailed Permission Diagnosis\n');
  console.log('='.repeat(60) + '\n');

  // Load service account key
  const keyPath = path.join(__dirname, '..', 'service-account-key.json');
  
  if (!fs.existsSync(keyPath)) {
    console.error('❌ service-account-key.json not found!');
    process.exit(1);
  }

  const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  console.log('📋 Service Account Info:');
  console.log(`   Email: ${key.client_email}`);
  console.log(`   Project: ${key.project_id}`);
  console.log(`   Key ID: ${key.private_key_id}\n`);

  // Create auth client with different scopes to test
  const scopes = [
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive',
  ];

  console.log('🔐 Testing Authentication...');
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: key.client_email,
      private_key: key.private_key,
    },
    scopes: scopes,
  });

  try {
    const client = await auth.getClient();
    console.log(`✅ Authentication successful\n`);

    // Get access token to see what permissions we actually have
    console.log('🎫 Getting Access Token...');
    const tokenResponse = await client.getAccessToken();
    console.log(`✅ Access token obtained`);
    console.log(`   Token (first 20 chars): ${tokenResponse.token?.substring(0, 20)}...\n`);

    // Test Google Docs API with detailed error handling
    console.log('📝 Testing Google Docs API...');
    console.log('   Attempting to create a test document...\n');
    
    const docs = google.docs({ version: 'v1', auth: client });
    
    try {
      const testDoc = await docs.documents.create({
        requestBody: {
          title: 'Permission Test - ' + Date.now(),
        },
      });
      
      if (testDoc.data.documentId) {
        console.log('✅ SUCCESS! Google Docs API is working!');
        console.log(`   Document ID: ${testDoc.data.documentId}`);
        console.log(`   Document URL: https://docs.google.com/document/d/${testDoc.data.documentId}/edit\n`);
        
        // Clean up
        const drive = google.drive({ version: 'v3', auth: client });
        try {
          await drive.files.delete({ fileId: testDoc.data.documentId });
          console.log('   ✅ Test document cleaned up\n');
        } catch (cleanupError) {
          console.log(`   ⚠️  Could not delete test document: ${cleanupError.message}`);
          console.log(`   You can delete it manually from Google Drive\n`);
        }
      }
    } catch (docsError) {
      console.error('❌ Google Docs API FAILED\n');
      console.error('📋 Error Details:');
      console.error(`   Message: ${docsError.message}`);
      console.error(`   Code: ${docsError.code || 'N/A'}`);
      
      if (docsError.response) {
        console.error(`   Status: ${docsError.response.status}`);
        console.error(`   Status Text: ${docsError.response.statusText}`);
        if (docsError.response.data) {
          console.error(`   Error Data:`, JSON.stringify(docsError.response.data, null, 2));
        }
      }
      
      console.error('\n🔍 Possible Causes:\n');
      
      if (docsError.message.includes('permission') || docsError.message.includes('PERMISSION_DENIED')) {
        console.error('   1. ⚠️  Service Account IAM Role Issue:');
        console.error(`      - Check IAM: https://console.cloud.google.com/iam-admin/iam?project=${key.project_id}`);
        console.error(`      - Service account: ${key.client_email}`);
        console.error(`      - Should have: Editor role (or Document Editor + Drive File Editor)\n`);
        
        console.error('   2. ⚠️  API Not Enabled (even if you think it is):');
        console.error(`      - Verify: https://console.cloud.google.com/apis/dashboard?project=${key.project_id}`);
        console.error(`      - Look for "Google Docs API" in enabled APIs list\n`);
        
        console.error('   3. ⚠️  Organization Policy Restriction:');
        console.error(`      - Check if your organization has policies blocking service accounts\n`);
        
        console.error('   4. ⚠️  Billing/Quota Issue:');
        console.error(`      - Verify billing is enabled: https://console.cloud.google.com/billing?project=${key.project_id}`);
        console.error(`      - Check quotas: https://console.cloud.google.com/apis/api/docs.googleapis.com/quotas?project=${key.project_id}\n`);
        
        console.error('   5. ⚠️  Service Account Key Issue:');
        console.error(`      - Verify the key belongs to the correct project`);
        console.error(`      - Try creating a new key: https://console.cloud.google.com/iam-admin/serviceaccounts?project=${key.project_id}\n`);
      }
      
      if (docsError.code === 403) {
        console.error('   💡 403 Forbidden usually means:');
        console.error('      - API is enabled but service account lacks permissions');
        console.error('      - OR organization policy is blocking access\n');
      }
    }

    // Test Drive API for comparison
    console.log('\n💾 Testing Google Drive API (for comparison)...');
    const drive = google.drive({ version: 'v3', auth: client });
    
    try {
      const driveResponse = await drive.files.list({
        pageSize: 1,
        fields: 'files(id, name)',
      });
      console.log('✅ Google Drive API: Working\n');
    } catch (driveError) {
      console.error(`❌ Google Drive API also failed: ${driveError.message}\n`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n📋 Summary:');
    console.log('   If Docs API failed but Drive API works, the issue is likely:');
    console.log('   1. Service account needs explicit IAM permissions');
    console.log('   2. API might not be fully enabled (check Enabled APIs page)');
    console.log('   3. Wait 2-5 minutes after making IAM changes\n');
    
    console.log('🔗 Quick Links:');
    console.log(`   IAM: https://console.cloud.google.com/iam-admin/iam?project=${key.project_id}`);
    console.log(`   APIs: https://console.cloud.google.com/apis/dashboard?project=${key.project_id}`);
    console.log(`   Service Accounts: https://console.cloud.google.com/iam-admin/serviceaccounts?project=${key.project_id}\n`);

  } catch (authError) {
    console.error('❌ Authentication failed!');
    console.error(`   Error: ${authError.message}`);
    console.error('\n💡 Check:');
    console.error('   - Service account key file is valid');
    console.error('   - Private key is correctly formatted');
    process.exit(1);
  }
}

diagnosePermissions().catch(console.error);
