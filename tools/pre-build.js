#!/usr/bin/env node
/**
 * 🚀 Pre-Build Script
 * 
 * Ensures all optimizations and necessary files are ready before building
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PreBuildProcessor {
  constructor() {
    this.startTime = Date.now();
  }

  log(message) {
    const elapsed = Date.now() - this.startTime;
    console.log(`[${elapsed.toString().padStart(4, '0')}ms] ${message}`);
  }

  async run() {
    console.log('🚀 Pre-Build Processing for Poetry Slam Scoreboard\n');
    
    this.verifyBuildEnvironment();
    this.cleanupTemporaryFiles();
    this.verifyOptimizations();
    this.generateBuildInfo();
    this.verifyAssets();
    
    console.log('\n✅ Pre-build processing complete!');
    console.log('Ready to build macOS application...\n');
  }

  verifyBuildEnvironment() {
    this.log('🔍 Verifying build environment...');
    
    // Check Node.js version
    const nodeVersion = process.version;
    this.log(`Node.js version: ${nodeVersion}`);
    
    // Check if electron-builder is available
    try {
      execSync('npx electron-builder --version', { stdio: 'pipe' });
      this.log('✅ electron-builder available');
    } catch (error) {
      this.log('❌ electron-builder not found, installing...');
      execSync('npm install electron-builder --save-dev', { stdio: 'inherit' });
    }
    
    // Check platform
    this.log(`Platform: ${process.platform} ${process.arch}`);
    
    if (process.platform !== 'darwin') {
      this.log('⚠️  Building macOS app on non-macOS platform - may need additional configuration');
    }
  }

  cleanupTemporaryFiles() {
    this.log('🧹 Cleaning up temporary files...');
    
    const tempPatterns = [
      'public/test-*.html',
      'public/admin-diagnostic.html',
      'public/admin-debug.html',
      'public/admin-no-csp.html',
      '*.log',
      'performance-report-*.json'
    ];
    
    tempPatterns.forEach(pattern => {
      try {
        if (pattern.includes('*')) {
          // For glob patterns, use ls and rm
          try {
            execSync(`ls ${pattern} 2>/dev/null && rm -f ${pattern} || true`, { stdio: 'pipe' });
          } catch (error) {
            // Ignore errors for cleanup
          }
        } else {
          if (fs.existsSync(pattern)) {
            fs.unlinkSync(pattern);
            this.log(`🗑️  Removed: ${pattern}`);
          }
        }
      } catch (error) {
        // Ignore cleanup errors
      }
    });
  }

  verifyOptimizations() {
    this.log('⚡ Verifying optimizations...');
    
    // Check if compression is enabled in electron.js
    const electronJs = fs.readFileSync('src/electron.js', 'utf8');
    if (electronJs.includes('@fastify/compress')) {
      this.log('✅ Compression optimization enabled');
    } else {
      this.log('⚠️  Compression optimization not found');
    }
    
    // Check if preloading is enabled in HTML files
    const adminHtml = fs.readFileSync('public/admin.html', 'utf8');
    if (adminHtml.includes('rel="preload"')) {
      this.log('✅ Resource preloading enabled');
    } else {
      this.log('⚠️  Resource preloading not found');
    }
    
    // Check bundle sizes
    const bundleFiles = [
      'public/admin.min.js',
      'public/index.min.js',
      'public/admin.min.css',
      'public/index.min.css'
    ];
    
    let totalSize = 0;
    bundleFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const size = fs.statSync(file).size;
        totalSize += size;
      }
    });
    
    this.log(`📦 Total bundle size: ${(totalSize / 1024 / 1024).toFixed(1)}MB`);
    
    if (totalSize > 50 * 1024 * 1024) { // 50MB
      this.log('⚠️  Large bundle size detected - consider optimization');
    }
  }

  generateBuildInfo() {
    this.log('📝 Generating build information...');
    
    const buildInfo = {
      buildTime: new Date().toISOString(),
      version: "2.0.0",
      optimizations: {
        compression: "Brotli + Gzip enabled",
        preloading: "Critical resources preloaded",
        caching: "HTTP caching with ETags",
        fonts: "Font-display: swap",
        electron: "v31.6.0 LTS",
        monitoring: "Performance tracking"
      },
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version
    };
    
    fs.writeFileSync('build-info.json', JSON.stringify(buildInfo, null, 2));
    this.log('✅ Build info generated');
  }

  verifyAssets() {
    this.log('🎨 Verifying application assets...');
    
    // Check icons
    const requiredIcons = [
      'public/media-optimized/logo/logo_256.png',
      'public/media-optimized/logo/logo_512.png',
      'public/media-optimized/logo/logo_64.png'
    ];
    
    requiredIcons.forEach(icon => {
      if (fs.existsSync(icon)) {
        const stats = fs.statSync(icon);
        this.log(`✅ Icon: ${icon} (${Math.round(stats.size / 1024)}KB)`);
      } else {
        this.log(`❌ Missing icon: ${icon}`);
      }
    });
    
    // Check media directory size
    if (fs.existsSync('public/media')) {
      const mediaSize = this.getDirectorySize('public/media');
      this.log(`📁 Media directory: ${(mediaSize / 1024 / 1024).toFixed(1)}MB`);
      
      if (mediaSize > 20 * 1024 * 1024) { // 20MB
        this.log('⚠️  Large media directory - consider optimization for smaller builds');
      }
    }
  }

  getDirectorySize(dirPath) {
    let totalSize = 0;
    
    function calculateSize(currentPath) {
      const stats = fs.statSync(currentPath);
      if (stats.isFile()) {
        totalSize += stats.size;
      } else if (stats.isDirectory()) {
        const files = fs.readdirSync(currentPath);
        files.forEach(file => {
          try {
            calculateSize(path.join(currentPath, file));
          } catch (error) {
            // Skip files that can't be read
          }
        });
      }
    }
    
    try {
      calculateSize(dirPath);
    } catch (error) {
      this.log(`⚠️  Error calculating size for ${dirPath}: ${error.message}`);
    }
    
    return totalSize;
  }
}

// Run pre-build processing
if (require.main === module) {
  const processor = new PreBuildProcessor();
  processor.run().catch(console.error);
}

module.exports = PreBuildProcessor;
