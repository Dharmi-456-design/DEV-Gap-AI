/**
 * Env Variable Security Validator
 * Ensures all required secrets are present before deployment.
 * Does NOT log the values, only checks existence.
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_VARS = [
  'MONGO_URI',
  'JWT_SECRET',
  'YOUTUBE_API_KEY',
  'GITHUB_TOKEN'
];

function validate() {
  console.log('🚀 [DevOps] Starting deployment security validation...');
  
  const missing = [];
  
  REQUIRED_VARS.forEach(v => {
    if (!process.env[v]) {
      missing.push(v);
    }
  });

  if (missing.length > 0) {
    console.error('❌ [DEPLOYMENT BLOCKER] Missing mandatory environment variables:');
    missing.forEach(m => console.error(`   - ${m}`));
    console.error('\nEnsure these are added in Render Dashboard -> Service -> Environment Variables.');
    process.exit(1);
  }

  console.log('✅ [DevOps] All environment variables found. Security check passed.');
  
  // Extra Check: Ensure .env is NOT in the staged files (if this were run in a pre-commit hook)
  // For Render build time, we just check process.env.
}

validate();
