#!/usr/bin/env node

/**
 * Helper script to encode service account key to base64
 * 
 * Usage:
 *   node scripts/encode-key.js [path/to/service-account-key.json]
 * 
 * Or place service-account-key.json in the project root and run:
 *   node scripts/encode-key.js
 */

const fs = require('fs');
const path = require('path');

// Get the JSON file path from command line or use default
const jsonPath = process.argv[2] || path.join(__dirname, '..', 'service-account-key.json');

if (!fs.existsSync(jsonPath)) {
  console.error('❌ Error: JSON file not found!');
  console.error(`   Looking for: ${jsonPath}`);
  console.error('\nUsage:');
  console.error('   node scripts/encode-key.js [path/to/service-account-key.json]');
  console.error('\nOr place service-account-key.json in the project root and run:');
  console.error('   node scripts/encode-key.js');
  process.exit(1);
}

try {
  // Read the JSON file
  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  
  // Validate it's valid JSON
  JSON.parse(jsonContent);
  
  // Encode to base64
  const encoded = Buffer.from(jsonContent, 'utf8').toString('base64');
  
  // Create the environment variable line
  const envLine = `GOOGLE_SERVICE_ACCOUNT_KEY=${encoded}`;
  
  // Check if .env.local exists
  const envPath = path.join(__dirname, '..', '.env.local');
  const envExists = fs.existsSync(envPath);
  
  if (envExists) {
    // Read existing .env.local
    const existingContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if GOOGLE_SERVICE_ACCOUNT_KEY already exists
    if (existingContent.includes('GOOGLE_SERVICE_ACCOUNT_KEY=')) {
      // Replace existing line
      const updatedContent = existingContent.replace(
        /GOOGLE_SERVICE_ACCOUNT_KEY=.*/,
        envLine
      );
      fs.writeFileSync(envPath, updatedContent);
      console.log('✅ Updated existing .env.local file');
    } else {
      // Append to existing file
      fs.appendFileSync(envPath, '\n' + envLine);
      console.log('✅ Added to existing .env.local file');
    }
  } else {
    // Create new .env.local file
    fs.writeFileSync(envPath, envLine + '\n');
    console.log('✅ Created new .env.local file');
  }
  
  console.log('\n📝 Base64-encoded service account key set successfully!');
  console.log('\n⚠️  Important:');
  console.log('   - Make sure .env.local is in your .gitignore');
  console.log('   - Restart your dev server: npm run dev');
  console.log('   - Never commit this file to git!');
  console.log('\n💡 The key is now base64-encoded in your .env.local file');
  
} catch (error) {
  console.error('❌ Error processing JSON file:');
  console.error(error.message);
  if (error.message.includes('JSON')) {
    console.error('\n💡 Make sure the file is valid JSON');
  }
  process.exit(1);
}
