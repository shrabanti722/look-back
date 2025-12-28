#!/usr/bin/env node

/**
 * Helper script to convert Google Service Account JSON to environment variable format
 * 
 * Usage:
 *   node scripts/setup-env.js path/to/service-account-key.json
 * 
 * Or place service-account-key.json in the project root and run:
 *   node scripts/setup-env.js
 */

const fs = require('fs');
const path = require('path');

// Get the JSON file path from command line or use default
const jsonPath = process.argv[2] || path.join(__dirname, '..', 'service-account-key.json');

if (!fs.existsSync(jsonPath)) {
  console.error('❌ Error: JSON file not found!');
  console.error(`   Looking for: ${jsonPath}`);
  console.error('\nUsage:');
  console.error('   node scripts/setup-env.js [path/to/service-account-key.json]');
  console.error('\nOr place service-account-key.json in the project root and run:');
  console.error('   node scripts/setup-env.js');
  process.exit(1);
}

try {
  // Read the JSON file
  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  const jsonData = JSON.parse(jsonContent);
  
  // Convert to single line
  const singleLine = JSON.stringify(jsonData);
  
  // Create the environment variable line
  const envLine = `GOOGLE_SERVICE_ACCOUNT_KEY='${singleLine}'`;
  
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
  
  console.log('\n📝 Environment variable set successfully!');
  console.log('\n⚠️  Important:');
  console.log('   - Make sure .env.local is in your .gitignore');
  console.log('   - Restart your dev server: npm run dev');
  console.log('   - Never commit this file to git!');
  
} catch (error) {
  console.error('❌ Error processing JSON file:');
  console.error(error.message);
  process.exit(1);
}
