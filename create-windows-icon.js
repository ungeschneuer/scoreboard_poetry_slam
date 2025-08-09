#!/usr/bin/env node

/**
 * Create Windows ICO files from existing PNG logos
 * This script uses ImageMagick to convert PNG to ICO format
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎨 Creating Windows ICO files...');

// Check if ImageMagick is available
try {
  execSync('convert --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ ImageMagick not found. Please install ImageMagick first:');
  console.error('   macOS: brew install imagemagick');
  console.error('   Windows: Download from https://imagemagick.org/');
  console.error('   Linux: sudo apt-get install imagemagick');
  process.exit(1);
}

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
  console.log('📁 Created assets directory');
}

// Source PNG files
const sourceFiles = [
  'public/media-optimized/logo/logo_64.png',
  'public/media-optimized/logo/logo_256.png',
  'public/media-optimized/logo/logo_512.png'
];

// Check if source files exist
for (const file of sourceFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Source file not found: ${file}`);
    process.exit(1);
  }
}

try {
  // Create ICO file with multiple sizes
  console.log('🔄 Converting PNG to ICO...');
  
  const command = `convert ${sourceFiles.join(' ')} -define icon:auto-resize=256,128,64,48,32,16 public/media-optimized/logo/logo.ico`;
  execSync(command, { stdio: 'inherit' });
  
  console.log('✅ Windows ICO file created: public/media-optimized/logo/logo.ico');
  
  // Update package.json to use the new ICO file
  const packageJsonPath = path.join(__dirname, 'package.json');
  let packageJson = fs.readFileSync(packageJsonPath, 'utf8');
  
  // Replace icon references for Windows builds
  packageJson = packageJson.replace(
    /"icon": "public\/media-optimized\/logo\/logo_512\.png"/g,
    '"icon": "public/media-optimized/logo/logo.ico"'
  );
  
  packageJson = packageJson.replace(
    /"installerIcon": "public\/media-optimized\/logo\/logo_512\.png"/g,
    '"installerIcon": "public/media-optimized/logo/logo.ico"'
  );
  
  packageJson = packageJson.replace(
    /"uninstallerIcon": "public\/media-optimized\/logo\/logo_512\.png"/g,
    '"uninstallerIcon": "public/media-optimized/logo/logo.ico"'
  );
  
  packageJson = packageJson.replace(
    /"installerHeaderIcon": "public\/media-optimized\/logo\/logo_512\.png"/g,
    '"installerHeaderIcon": "public/media-optimized/logo/logo.ico"'
  );
  
  fs.writeFileSync(packageJsonPath, packageJson);
  console.log('✅ Updated package.json with ICO file references');
  
} catch (error) {
  console.error('❌ Error creating ICO file:', error.message);
  process.exit(1);
}

console.log('🎉 Windows icon setup complete!');
console.log('📦 You can now build Windows apps with: npm run build:win');
