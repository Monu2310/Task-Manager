#!/usr/bin/env node

// Simple startup script for Render deployment debugging
console.log("🚀 Starting Task Manager Backend...");
console.log("📊 Environment Info:");
console.log("  NODE_ENV:", process.env.NODE_ENV);
console.log("  PORT:", process.env.PORT);
console.log("  PWD:", process.cwd());
console.log("  NODE_VERSION:", process.version);

// Check if dist directory exists
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  console.log("✅ dist directory found");
  const indexPath = path.join(distPath, 'index.js');
  if (fs.existsSync(indexPath)) {
    console.log("✅ dist/index.js found");
    console.log("🔄 Starting application...");
    require('./dist/index.js');
  } else {
    console.log("❌ dist/index.js not found");
    process.exit(1);
  }
} else {
  console.log("❌ dist directory not found");
  process.exit(1);
}
