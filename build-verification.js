#!/usr/bin/env node
/**
 * 🔍 Build Verification Tool
 * 
 * Verifies all necessary elements are included in the build process
 */

const fs = require('fs');
const path = require('path');

class BuildVerifier {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.passed = [];
  }

  log(type, message) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${type} ${message}`);
  }

  checkFile(filePath, description, critical = true) {
    if (fs.existsSync(filePath)) {
      this.passed.push(`✅ ${description}: ${filePath}`);
      this.log('✅', `${description} found`);
      return true;
    } else {
      const issue = `❌ ${description}: ${filePath} not found`;
      if (critical) {
        this.issues.push(issue);
        this.log('❌', issue);
      } else {
        this.warnings.push(issue);
        this.log('⚠️', issue);
      }
      return false;
    }
  }

  checkDirectory(dirPath, description, critical = true) {
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      const files = fs.readdirSync(dirPath);
      this.passed.push(`✅ ${description}: ${dirPath} (${files.length} files)`);
      this.log('✅', `${description} found with ${files.length} files`);
      return true;
    } else {
      const issue = `❌ ${description}: ${dirPath} not found or not a directory`;
      if (critical) {
        this.issues.push(issue);
        this.log('❌', issue);
      } else {
        this.warnings.push(issue);
        this.log('⚠️', issue);
      }
      return false;
    }
  }

  checkPackageJson() {
    this.log('🔍', 'Checking package.json configuration...');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // Check build configuration
      if (packageJson.build) {
        this.passed.push('✅ Build configuration exists');
        
        // Check required build fields
        const required = ['appId', 'icon', 'files'];
        required.forEach(field => {
          if (packageJson.build[field]) {
            this.passed.push(`✅ Build field '${field}' configured`);
          } else {
            this.issues.push(`❌ Missing build field '${field}'`);
          }
        });
        
        // Check if icon file exists
        if (packageJson.build.icon) {
          this.checkFile(packageJson.build.icon, 'App icon file');
        }
        
        // Check file patterns
        if (packageJson.build.files && Array.isArray(packageJson.build.files)) {
          this.passed.push(`✅ File patterns configured (${packageJson.build.files.length} patterns)`);
          packageJson.build.files.forEach(pattern => {
            this.log('📁', `File pattern: ${pattern}`);
          });
        }
        
      } else {
        this.issues.push('❌ No build configuration found in package.json');
      }
      
      // Check scripts
      const requiredScripts = ['start', 'build'];
      requiredScripts.forEach(script => {
        if (packageJson.scripts && packageJson.scripts[script]) {
          this.passed.push(`✅ Script '${script}' configured`);
        } else {
          this.issues.push(`❌ Missing script '${script}'`);
        }
      });
      
      // Check electron-builder dependency
      if (packageJson.devDependencies && packageJson.devDependencies['electron-builder']) {
        this.passed.push(`✅ electron-builder dependency found (${packageJson.devDependencies['electron-builder']})`);
      } else {
        this.issues.push('❌ electron-builder not found in devDependencies');
      }
      
    } catch (error) {
      this.issues.push(`❌ Error reading package.json: ${error.message}`);
    }
  }

  checkAssets() {
    this.log('🔍', 'Checking application assets...');
    
    // Check icon files
    const iconSizes = [64, 256, 512];
    iconSizes.forEach(size => {
      this.checkFile(`assets/angela_${size}.png`, `App icon ${size}x${size}`, size === 256);
    });
    
    // Check if we have proper icon sizes for macOS
    this.checkFile('assets/angela_512.png', 'macOS icon (512x512)', false);
    this.checkFile('assets/angela_256.png', 'macOS icon (256x256)', true);
  }

  checkSourceFiles() {
    this.log('🔍', 'Checking source files...');
    
    // Check main electron file
    this.checkFile('src/electron.js', 'Main Electron process file');
    
    // Check public directory
    this.checkDirectory('public', 'Public web assets directory');
    
    // Check critical public files
    const criticalFiles = [
      'public/admin.html',
      'public/index.html',
      'public/admin.min.js',
      'public/index.min.js',
      'public/admin.min.css',
      'public/index.min.css'
    ];
    
    criticalFiles.forEach(file => {
      this.checkFile(file, `Critical asset: ${path.basename(file)}`);
    });
    
    // Check modules directory
    this.checkDirectory('public/modules', 'AngularJS modules directory');
    
    // Check fonts
    this.checkDirectory('public/fonts', 'Fonts directory', false);
    
    // Check media
    this.checkDirectory('public/media', 'Media assets directory', false);
  }

  checkOptimizations() {
    this.log('🔍', 'Checking optimization assets...');
    
    // Check if performance monitor is included
    this.checkFile('performance-monitor.js', 'Performance monitor module', false);
    
    // Check optimization tools
    const optimizationFiles = [
      'comprehensive-bundle-reduction-summary.js',
      'bundle-size-reduction-plan.js',
      'material-tree-shaker.js',
      'icon-optimizer.js'
    ];
    
    optimizationFiles.forEach(file => {
      this.checkFile(file, `Optimization tool: ${file}`, false);
    });
    
    // Check webpack configs
    const webpackConfigs = [
      'webpack.vendor-split.config.js',
      'webpack.config.js'
    ];
    
    webpackConfigs.forEach(config => {
      this.checkFile(config, `Webpack config: ${config}`, false);
    });
  }

  checkDependencies() {
    this.log('🔍', 'Checking dependencies...');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // Check critical runtime dependencies
      const criticalDeps = ['@fastify/static', '@fastify/compress', 'fastify'];
      criticalDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          this.passed.push(`✅ Runtime dependency: ${dep}`);
        } else {
          this.issues.push(`❌ Missing runtime dependency: ${dep}`);
        }
      });
      
      // Check if node_modules exists
      this.checkDirectory('node_modules', 'Node modules directory');
      
    } catch (error) {
      this.issues.push(`❌ Error checking dependencies: ${error.message}`);
    }
  }

  generateBuildReport() {
    this.log('🔍', 'Checking file sizes...');
    
    const files = [
      'public/admin.min.js',
      'public/index.min.js',
      'public/admin.min.css',
      'public/index.min.css'
    ];
    
    let totalSize = 0;
    files.forEach(file => {
      if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        const sizeKB = Math.round(stats.size / 1024);
        totalSize += sizeKB;
        this.log('📊', `${file}: ${sizeKB}KB`);
      }
    });
    
    this.log('📊', `Total bundle size: ${totalSize}KB (${(totalSize/1024).toFixed(1)}MB)`);
    
    // Check media directory size
    if (fs.existsSync('public/media')) {
      const mediaFiles = this.getDirectorySize('public/media');
      this.log('📊', `Media directory: ${Math.round(mediaFiles/1024)}KB`);
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
          calculateSize(path.join(currentPath, file));
        });
      }
    }
    
    try {
      calculateSize(dirPath);
    } catch (error) {
      this.log('⚠️', `Error calculating size for ${dirPath}: ${error.message}`);
    }
    
    return totalSize;
  }

  async run() {
    console.log('🔍 Build Verification Tool\n');
    console.log('🔄 Checking Poetry Slam Scoreboard build configuration...\n');
    
    this.checkPackageJson();
    this.checkAssets();
    this.checkSourceFiles();
    this.checkOptimizations();
    this.checkDependencies();
    this.generateBuildReport();
    
    console.log('\n📊 Verification Summary:');
    console.log('========================');
    console.log(`✅ Passed: ${this.passed.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);
    console.log(`❌ Issues: ${this.issues.length}`);
    
    if (this.issues.length === 0) {
      console.log('\n🎉 BUILD READY! All critical components verified.');
      console.log('You can safely run: npm run build');
    } else {
      console.log('\n⚠️  BUILD ISSUES FOUND:');
      this.issues.forEach(issue => console.log(`   ${issue}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n📋 Warnings (non-critical):');
      this.warnings.forEach(warning => console.log(`   ${warning}`));
    }
    
    return this.issues.length === 0;
  }
}

// Run verification
if (require.main === module) {
  const verifier = new BuildVerifier();
  verifier.run().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = BuildVerifier;
