#!/usr/bin/env node

/**
 * Test script to verify Google Cloud permissions
 * Run: node scripts/test-permissions.js
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function testPermissions() {
  console.log('🔍 Testing Google Cloud Permissions...\n');

  // Load service account key
  const keyPath = path.join(__dirname, '..', 'service-account-key.json');
  
  if (!fs.existsSync(keyPath)) {
    console.error('❌ service-account-key.json not found!');
    console.error('   Make sure the file is in the project root.');
    process.exit(1);
  }

  const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  console.log('✅ Service account key loaded');
  console.log(`   Email: ${key.client_email}`);
  console.log(`   Project: ${key.project_id}\n`);

  // Create auth client
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: key.client_email,
      private_key: key.private_key,
    },
    scopes: [
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive',
    ],
  });

  try {
    // Test 1: Authentication
    console.log('📝 Test 1: Authenticating...');
    const client = await auth.getClient();
    console.log('✅ Authentication successful!\n');

    // Test 2: Check if we can access Google Docs API
    console.log('📝 Test 2: Testing Google Docs API access...');
    const docs = google.docs({ version: 'v1', auth: client });
    
    try {
      // Try to create a test document
      const testDoc = await docs.documents.create({
        requestBody: {
          title: 'Permission Test Document',
        },
      });
      
      if (testDoc.data.documentId) {
        console.log('✅ Google Docs API: SUCCESS');
        console.log(`   Created test document: ${testDoc.data.documentId}`);
        
        // Clean up - delete the test document
        const drive = google.drive({ version: 'v3', auth: client });
        await drive.files.delete({ fileId: testDoc.data.documentId });
        console.log('   (Test document deleted)\n');
      }
    } catch (error) {
      console.error('❌ Google Docs API: FAILED');
      console.error(`   Error: ${error.message}\n`);
      
      if (error.message.includes('permission') || error.message.includes('PERMISSION_DENIED')) {
        console.log('💡 SOLUTION:');
        console.log('   1. Enable Google Docs API:');
        console.log(`      https://console.cloud.google.com/apis/library/docs.googleapis.com?project=${key.project_id}`);
        console.log('   2. Grant your service account the "Editor" role:');
        console.log(`      https://console.cloud.google.com/iam-admin/iam?project=${key.project_id}`);
        console.log(`      Find: ${key.client_email}`);
        console.log('      Add role: Editor\n');
      }
    }

    // Test 3: Check if we can access Google Drive API
    console.log('📝 Test 3: Testing Google Drive API access...');
    const drive = google.drive({ version: 'v3', auth: client });
    
    try {
      // Try to list files (minimal permission test)
      await drive.files.list({
        pageSize: 1,
        fields: 'files(id, name)',
      });
      console.log('✅ Google Drive API: SUCCESS\n');
    } catch (error) {
      console.error('❌ Google Drive API: FAILED');
      console.error(`   Error: ${error.message}\n`);
      
      if (error.message.includes('permission') || error.message.includes('PERMISSION_DENIED')) {
        console.log('💡 SOLUTION:');
        console.log('   1. Enable Google Drive API:');
        console.log(`      https://console.cloud.google.com/apis/library/drive.googleapis.com?project=${key.project_id}`);
        console.log('   2. Grant your service account the "Editor" role:');
        console.log(`      https://console.cloud.google.com/iam-admin/iam?project=${key.project_id}`);
        console.log(`      Find: ${key.client_email}`);
        console.log('      Add role: Editor\n');
      }
    }

    console.log('✨ Test complete!');
    console.log('\n📋 Next steps if tests failed:');
    console.log('   1. Enable both APIs in Google Cloud Console');
    console.log('   2. Grant "Editor" role to your service account');
    console.log('   3. Wait 1-2 minutes for changes to propagate');
    console.log('   4. Run this test again');

  } catch (error) {
    console.error('❌ Authentication failed!');
    console.error(`   Error: ${error.message}`);
    console.error('\n💡 Check:');
    console.error('   - Service account key file is valid');
    console.error('   - Private key is correctly formatted');
    process.exit(1);
  }
}

testPermissions().catch(console.error);
