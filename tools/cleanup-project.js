#!/usr/bin/env node
/**
 * 🧹 Project Cleanup Tool
 * 
 * Cleans up temporary files, organizes structure, and prepares for production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProjectCleaner {
  constructor() {
    this.cleaned = [];
    this.moved = [];
    this.kept = [];
    this.errors = [];
  }

  log(message) {
    console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
  }

  async run() {
    console.log('🧹 Project Cleanup Tool\n');
    
    this.cleanTemporaryFiles();
    this.cleanBuildArtifacts();
    this.organizeOptimizationTools();
    this.cleanNodeModules();
    this.updateGitignore();
    this.generateCleanupReport();
    
    console.log('\n✅ Project cleanup complete!');
  }

  cleanTemporaryFiles() {
    this.log('🗑️  Cleaning temporary files...');
    
    const tempFiles = [
      // Performance reports
      'performance-report-*.json',
      'bundle-analysis.json',
      'build-info.json',
      
      // Temporary HTML files (already deleted)
      'public/test-*.html',
      'public/admin-debug*.html',
      'public/admin-diagnostic*.html',
      'public/admin-no-csp*.html',
      
      // Log files
      '*.log',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      
      // System files
      '.DS_Store',
      'Thumbs.db',
      
      // Editor files
      '.vscode/settings.json',
      '*.swp',
      '*.swo',
      '*~'
    ];
    
    tempFiles.forEach(pattern => {
      try {
        if (pattern.includes('*')) {
          // Use shell glob expansion
          try {
            const command = `ls ${pattern} 2>/dev/null || true`;
            const result = execSync(command, { encoding: 'utf8' }).trim();
            if (result) {
              execSync(`rm -f ${pattern}`, { stdio: 'pipe' });
              this.cleaned.push(`Removed glob: ${pattern}`);
            }
          } catch (error) {
            // Ignore glob errors
          }
        } else {
          if (fs.existsSync(pattern)) {
            fs.unlinkSync(pattern);
            this.cleaned.push(`Removed file: ${pattern}`);
          }
        }
      } catch (error) {
        this.errors.push(`Error removing ${pattern}: ${error.message}`);
      }
    });
  }

  cleanBuildArtifacts() {
    this.log('🏗️  Cleaning build artifacts...');
    
    const buildDirs = [
      'dist',
      'public/optimized',
      'public/optimized-v2', 
      'public/optimized-icons',
      'public/tree-shaken',
      'public/vendor-split',
      '.tmp'
    ];
    
    buildDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        try {
          execSync(`rm -rf "${dir}"`, { stdio: 'pipe' });
          this.cleaned.push(`Removed directory: ${dir}`);
        } catch (error) {
          this.errors.push(`Error removing ${dir}: ${error.message}`);
        }
      }
    });
    
    // Keep release directory but note it
    if (fs.existsSync('release')) {
      this.kept.push('release/ (build output - keeping for distribution)');
    }
  }

  organizeOptimizationTools() {
    this.log('📁 Organizing optimization tools...');
    
    // Create tools directory if it doesn't exist
    const toolsDir = 'tools';
    if (!fs.existsSync(toolsDir)) {
      fs.mkdirSync(toolsDir);
    }
    
    const optimizationFiles = [
      'build-verification.js',
      'pre-build.js',
      'cleanup-project.js',
      'comprehensive-bundle-reduction-summary.js',
      'bundle-size-reduction-plan.js',
      'material-tree-shaker.js',
      'icon-optimizer.js',
      'optimize-bundles.js',
      'performance-monitor.js'
    ];
    
    optimizationFiles.forEach(file => {
      if (fs.existsSync(file)) {
        try {
          const targetPath = path.join(toolsDir, file);
          fs.renameSync(file, targetPath);
          this.moved.push(`${file} → tools/${file}`);
        } catch (error) {
          this.errors.push(`Error moving ${file}: ${error.message}`);
        }
      }
    });
    
    // Create tools README
    const toolsReadme = `# 🛠️ Optimization Tools

This directory contains development and optimization tools for the Poetry Slam Scoreboard.

## Available Tools

### Build & Verification
- \`build-verification.js\` - Verifies all build requirements
- \`pre-build.js\` - Pre-build processing and verification
- \`cleanup-project.js\` - Project cleanup tool

### Performance Analysis
- \`performance-monitor.js\` - Real-time performance monitoring
- \`comprehensive-bundle-reduction-summary.js\` - Complete bundle analysis
- \`bundle-size-reduction-plan.js\` - Detailed optimization planning

### Bundle Optimization
- \`material-tree-shaker.js\` - Material Design component analysis
- \`icon-optimizer.js\` - Icon usage analysis and optimization
- \`optimize-bundles.js\` - Legacy bundle optimizer

## Usage

\`\`\`bash
# Run from project root
node tools/build-verification.js
node tools/performance-monitor.js
node tools/cleanup-project.js
\`\`\`

## Scripts

These tools are also available via npm scripts:
- \`npm run build:verify\` - Build verification
- \`npm run optimize\` - Bundle analysis
- \`npm run analyze\` - Performance analysis
`;
    
    fs.writeFileSync(path.join(toolsDir, 'README.md'), toolsReadme);
    this.moved.push('Created tools/README.md');
  }

  cleanNodeModules() {
    this.log('📦 Checking node_modules...');
    
    if (fs.existsSync('node_modules')) {
      try {
        // Get node_modules size
        const result = execSync('du -sh node_modules 2>/dev/null || echo "0B"', { encoding: 'utf8' }).trim();
        this.kept.push(`node_modules/ (${result.split('\t')[0]} - keeping for development)`);
      } catch (error) {
        this.kept.push('node_modules/ (keeping for development)');
      }
    }
  }

  updateGitignore() {
    this.log('📝 Updating .gitignore...');
    
    const additionalIgnores = [
      '',
      '# Build artifacts and optimization outputs',
      'dist/',
      'release/',
      'public/optimized*/',
      'public/tree-shaken/',
      'public/vendor-split/',
      '',
      '# Performance and analysis reports',
      'performance-report-*.json',
      'bundle-analysis.json',
      'build-info.json',
      '*-report.json',
      '',
      '# Temporary files',
      '*.tmp',
      '.tmp/',
      'public/test-*.html',
      'public/admin-debug*.html',
      'public/admin-diagnostic*.html',
      '',
      '# System files',
      '.DS_Store',
      'Thumbs.db',
      '',
      '# Editor files',
      '*.swp',
      '*.swo',
      '*~',
      '.vscode/settings.json'
    ];
    
    try {
      let gitignore = '';
      if (fs.existsSync('.gitignore')) {
        gitignore = fs.readFileSync('.gitignore', 'utf8');
      }
      
      // Check if our additions are already there
      if (!gitignore.includes('# Build artifacts and optimization outputs')) {
        gitignore += '\n' + additionalIgnores.join('\n') + '\n';
        fs.writeFileSync('.gitignore', gitignore);
        this.moved.push('Updated .gitignore with optimization patterns');
      } else {
        this.kept.push('.gitignore (already up to date)');
      }
    } catch (error) {
      this.errors.push(`Error updating .gitignore: ${error.message}`);
    }
  }

  generateCleanupReport() {
    this.log('📊 Generating cleanup report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        cleaned: this.cleaned.length,
        moved: this.moved.length,
        kept: this.kept.length,
        errors: this.errors.length
      },
      actions: {
        cleaned: this.cleaned,
        moved: this.moved,
        kept: this.kept,
        errors: this.errors
      }
    };
    
    // Don't save the report file itself to avoid clutter
    console.log('\n📊 Cleanup Summary:');
    console.log('===================');
    console.log(`🗑️  Cleaned: ${this.cleaned.length} items`);
    console.log(`📁 Moved: ${this.moved.length} items`);
    console.log(`✅ Kept: ${this.kept.length} items`);
    console.log(`❌ Errors: ${this.errors.length} items`);
    
    if (this.cleaned.length > 0) {
      console.log('\n🗑️  Cleaned Files:');
      this.cleaned.forEach(item => console.log(`   - ${item}`));
    }
    
    if (this.moved.length > 0) {
      console.log('\n📁 Moved Files:');
      this.moved.forEach(item => console.log(`   - ${item}`));
    }
    
    if (this.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.errors.forEach(item => console.log(`   - ${item}`));
    }
  }
}

// Run cleanup
if (require.main === module) {
  const cleaner = new ProjectCleaner();
  cleaner.run().catch(console.error);
}

module.exports = ProjectCleaner;
