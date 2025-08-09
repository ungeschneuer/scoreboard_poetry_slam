#!/usr/bin/env node
/**
 * 🗜️ Bundle Size Reduction Implementation Plan
 * 
 * Current State:
 * - Admin JS: 3,118KB (3.0MB)
 * - Presentation JS: 3,119KB (3.0MB)
 * - Admin CSS: 517KB
 * - Presentation CSS: 584KB
 * - Total: 7,338KB (7.2MB)
 * 
 * Target: Reduce by 60%+ (Target: <3MB total)
 */

const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

class BundleSizeReducer {
  constructor() {
    this.publicDir = path.join(__dirname, 'public');
    this.outputDir = path.join(__dirname, 'public', 'optimized-v2');
    this.analysisResults = {};
  }

  async run() {
    console.log('🗜️  Bundle Size Reduction Plan\n');
    
    await this.analyzeCurrentBundles();
    await this.identifyOptimizations();
    await this.implementReductions();
    await this.generateReport();
  }

  async analyzeCurrentBundles() {
    console.log('🔍 Step 1: Deep Bundle Analysis\n');
    
    const files = [
      'admin.min.js',
      'index.min.js', 
      'admin.min.css',
      'index.min.css'
    ];

    for (const file of files) {
      const filePath = path.join(this.publicDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const size = content.length;
      
      console.log(`📄 ${file}: ${(size / 1024).toFixed(0)}KB`);
      
      // Analyze dependencies
      const dependencies = this.analyzeDependencies(content, file);
      this.analysisResults[file] = { size, dependencies, content };
      
      // Show top dependencies
      const sorted = Object.entries(dependencies).sort((a, b) => b[1] - a[1]);
      console.log(`   Top dependencies:`);
      sorted.slice(0, 5).forEach(([dep, count]) => {
        console.log(`   - ${dep}: ${count} references`);
      });
      console.log();
    }
  }

  analyzeDependencies(content, filename) {
    const deps = {};
    
    // Count Angular Material components (huge savings potential)
    const materialComponents = [
      'mdDialog', 'mdToast', 'mdBottomSheet', 'mdSidenav', 'mdToolbar',
      'mdButton', 'mdCard', 'mdChips', 'mdContent', 'mdDatepicker',
      'mdFabSpeedDial', 'mdGridList', 'mdIcon', 'mdInput', 'mdList',
      'mdMenu', 'mdNavBar', 'mdPagination', 'mdProgress', 'mdRadio',
      'mdSelect', 'mdSlider', 'mdSwitch', 'mdTabs', 'mdVirtualRepeat',
      'mdWhiteframe', 'mdAutocomplete', 'mdColorPicker', 'mdDataTable'
    ];
    
    materialComponents.forEach(comp => {
      const regex = new RegExp(comp, 'gi');
      const matches = content.match(regex) || [];
      if (matches.length > 0) {
        deps[`Material:${comp}`] = matches.length;
      }
    });
    
    // Count jQuery usage
    const jqueryPatterns = ['jQuery', '\\$\\(', '\\.each\\(', '\\.ajax\\(', '\\.fadeIn\\(', '\\.slideDown\\('];
    jqueryPatterns.forEach(pattern => {
      const regex = new RegExp(pattern, 'g');
      const matches = content.match(regex) || [];
      if (matches.length > 0) {
        deps[`jQuery:${pattern}`] = matches.length;
      }
    });
    
    // Count Angular core usage
    const angularPatterns = [
      'angular\\.module', 'angular\\.forEach', 'angular\\.copy', 
      'angular\\.extend', 'angular\\.isArray', 'angular\\.isDefined'
    ];
    angularPatterns.forEach(pattern => {
      const regex = new RegExp(pattern, 'g');
      const matches = content.match(regex) || [];
      if (matches.length > 0) {
        deps[`Angular:${pattern}`] = matches.length;
      }
    });
    
    return deps;
  }

  async identifyOptimizations() {
    console.log('💡 Step 2: Optimization Opportunities\n');
    
    const optimizations = [
      {
        name: 'Material Design Tree Shaking',
        description: 'Remove unused Material Design components',
        potentialSavings: '800-1200KB',
        effort: 'Medium',
        impact: 'High',
        method: 'Custom build with only used components'
      },
      {
        name: 'jQuery Replacement',
        description: 'Replace jQuery with vanilla JS where possible',
        potentialSavings: '200-300KB',
        effort: 'High', 
        impact: 'Medium',
        method: 'Gradual replacement with modern JS'
      },
      {
        name: 'Angular Material Custom Build',
        description: 'Build custom Angular Material with only needed modules',
        potentialSavings: '500-800KB',
        effort: 'Medium',
        impact: 'High',
        method: 'Use angular-material source and build specific modules'
      },
      {
        name: 'Icon Font Optimization',
        description: 'Use only needed Material Icons',
        potentialSavings: '100-200KB',
        effort: 'Low',
        impact: 'Medium',
        method: 'Generate custom icon font with only used icons'
      },
      {
        name: 'Dead Code Elimination',
        description: 'Remove unused functions and modules',
        potentialSavings: '300-500KB',
        effort: 'Low',
        impact: 'Medium',
        method: 'Static analysis and manual removal'
      },
      {
        name: 'Modern Compression',
        description: 'Implement Brotli compression',
        potentialSavings: '2000-3000KB (runtime)',
        effort: 'Low',
        impact: 'Very High',
        method: 'Server-side compression'
      }
    ];
    
    console.log('🎯 Top Optimization Opportunities:');
    console.log('═══════════════════════════════════\n');
    
    optimizations.forEach((opt, i) => {
      console.log(`${i + 1}. **${opt.name}**`);
      console.log(`   💾 Savings: ${opt.potentialSavings}`);
      console.log(`   ⚡ Impact: ${opt.impact}`);
      console.log(`   🔧 Effort: ${opt.effort}`);
      console.log(`   📝 Method: ${opt.method}`);
      console.log();
    });
  }

  async implementReductions() {
    console.log('🚀 Step 3: Implementing Quick Wins\n');
    
    await fs.ensureDir(this.outputDir);
    
    // 1. Implement Brotli compression simulation
    await this.simulateBrotliCompression();
    
    // 2. Create minimal Material Design build simulation
    await this.createMinimalMaterialBuild();
    
    // 3. Generate icon font subset
    await this.optimizeIconFonts();
    
    // 4. Create dead code elimination report
    await this.identifyDeadCode();
  }

  async simulateBrotliCompression() {
    console.log('📦 Implementing Brotli Compression Simulation...');
    
    const files = ['admin.min.js', 'index.min.js', 'admin.min.css', 'index.min.css'];
    
    for (const file of files) {
      const originalPath = path.join(this.publicDir, file);
      const content = fs.readFileSync(originalPath, 'utf8');
      const originalSize = content.length;
      
      // Simulate Brotli compression (typically 70-80% reduction)
      const estimatedCompressed = Math.floor(originalSize * 0.25); // 75% reduction
      
      console.log(`   ${file}: ${(originalSize/1024).toFixed(0)}KB → ~${(estimatedCompressed/1024).toFixed(0)}KB (${Math.floor((1-estimatedCompressed/originalSize)*100)}% smaller)`);
    }
    console.log();
  }

  async createMinimalMaterialBuild() {
    console.log('🎨 Creating Minimal Material Design Build Plan...');
    
    // Analyze which Material components are actually used
    const usedComponents = new Set();
    
    ['admin.min.js', 'index.min.js'].forEach(file => {
      const content = this.analysisResults[file].content;
      
      // Check for actual usage patterns
      const componentPatterns = {
        'mdButton': /md-button|mdButton/g,
        'mdCard': /md-card|mdCard/g,
        'mdDialog': /mdDialog|\$mdDialog/g,
        'mdIcon': /md-icon|mdIcon/g,
        'mdInput': /md-input-container|mdInput/g,
        'mdList': /md-list|mdList/g,
        'mdMenu': /md-menu|mdMenu/g,
        'mdSelect': /md-select|mdSelect/g,
        'mdSidenav': /md-sidenav|mdSidenav/g,
        'mdTabs': /md-tabs|mdTabs/g,
        'mdToolbar': /md-toolbar|mdToolbar/g,
        'mdTooltip': /md-tooltip|mdTooltip/g
      };
      
      Object.entries(componentPatterns).forEach(([component, pattern]) => {
        if (pattern.test(content)) {
          usedComponents.add(component);
        }
      });
    });
    
    console.log('   Used Material Components:');
    Array.from(usedComponents).sort().forEach(comp => {
      console.log(`   ✅ ${comp}`);
    });
    
    const totalComponents = 25; // Approximate total in Angular Material
    const reductionPercentage = Math.floor((1 - usedComponents.size / totalComponents) * 100);
    console.log(`\n   Potential Material Design size reduction: ~${reductionPercentage}%`);
    console.log();
  }

  async optimizeIconFonts() {
    console.log('🎯 Icon Font Optimization Analysis...');
    
    // Check which icons are actually used
    const iconUsage = new Set();
    
    ['admin.min.js', 'index.min.js'].forEach(file => {
      const content = this.analysisResults[file].content;
      
      // Extract icon names from common patterns
      const iconPatterns = [
        /class="material-icons"[^>]*>([^<]+)</g,
        /<md-icon[^>]*>([^<]+)<\/md-icon>/g,
        /'([a-z_]+)'/g // Common icon names
      ];
      
      iconPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          if (match[1] && match[1].length < 20) { // Reasonable icon name length
            iconUsage.add(match[1].trim());
          }
        }
      });
    });
    
    console.log(`   Found ${iconUsage.size} potentially used icons`);
    console.log('   Top icons:');
    Array.from(iconUsage).slice(0, 10).forEach(icon => {
      console.log(`   - ${icon}`);
    });
    
    console.log(`\n   Potential icon font reduction: ~${Math.floor((1 - Math.min(iconUsage.size, 50) / 900) * 100)}%`);
    console.log();
  }

  async identifyDeadCode() {
    console.log('🗑️  Dead Code Analysis...');
    
    // Simple analysis for unused functions
    const adminContent = this.analysisResults['admin.min.js'].content;
    const presentationContent = this.analysisResults['index.min.js'].content;
    
    // Find functions that exist in both files (potential shared code)
    const adminFunctions = this.extractFunctionNames(adminContent);
    const presentationFunctions = this.extractFunctionNames(presentationContent);
    
    const sharedFunctions = adminFunctions.filter(f => presentationFunctions.includes(f));
    
    console.log(`   Admin unique functions: ${adminFunctions.length - sharedFunctions.length}`);
    console.log(`   Presentation unique functions: ${presentationFunctions.length - sharedFunctions.length}`);
    console.log(`   Shared functions: ${sharedFunctions.length}`);
    
    if (sharedFunctions.length > 10) {
      console.log('   Top shared functions (extract to vendor chunk):');
      sharedFunctions.slice(0, 5).forEach(func => {
        console.log(`   - ${func}`);
      });
    }
    console.log();
  }

  extractFunctionNames(content) {
    // Simple regex to find function definitions
    const functionPattern = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
    const functions = [];
    let match;
    
    while ((match = functionPattern.exec(content)) !== null) {
      functions.push(match[1]);
    }
    
    return [...new Set(functions)]; // Remove duplicates
  }

  async generateReport() {
    console.log('📊 Step 4: Optimization Summary Report\n');
    
    const report = {
      currentState: {
        totalSize: 7338,
        adminJs: 3118,
        presentationJs: 3119,
        adminCss: 517,
        presentationCss: 584
      },
      optimizations: {
        brotliCompression: {
          savings: Math.floor(7338 * 0.75),
          effort: 'Low',
          implementation: 'Server configuration'
        },
        materialTreeShaking: {
          savings: 1000,
          effort: 'Medium', 
          implementation: 'Custom build process'
        },
        iconOptimization: {
          savings: 150,
          effort: 'Low',
          implementation: 'Icon font subsetting'
        },
        deadCodeElimination: {
          savings: 400,
          effort: 'Medium',
          implementation: 'Static analysis and removal'
        }
      },
      projectedResults: {
        withCompression: Math.floor(7338 * 0.25), // ~1.8MB
        withTreeShaking: Math.floor((7338 - 1550) * 0.25), // ~1.4MB
        totalReduction: '81%'
      }
    };
    
    console.log('🎯 **IMMEDIATE ACTIONS** (High Impact, Low Effort):');
    console.log('══════════════════════════════════════════════════');
    console.log('1. ✅ Enable Brotli/Gzip compression → 75% size reduction');
    console.log('2. 🎨 Create minimal Material Design build → 15% additional reduction');
    console.log('3. 🎯 Optimize icon fonts → 2% additional reduction');
    console.log();
    
    console.log('📈 **PROJECTED RESULTS**:');
    console.log('════════════════════════');
    console.log(`Current size: 7,338KB (7.2MB)`);
    console.log(`With compression: ~${report.projectedResults.withCompression}KB (${(report.projectedResults.withCompression/1024).toFixed(1)}MB)`);
    console.log(`With tree shaking: ~${report.projectedResults.withTreeShaking}KB (${(report.projectedResults.withTreeShaking/1024).toFixed(1)}MB)`);
    console.log(`**Total reduction: ${report.projectedResults.totalReduction}** 🎉`);
    console.log();
    
    console.log('⚡ **QUICK IMPLEMENTATION STEPS**:');
    console.log('═════════════════════════════════');
    console.log('1. Add Brotli compression to Electron static server');
    console.log('2. Create webpack plugin for Material Design tree shaking');
    console.log('3. Implement icon font subsetting tool');
    console.log('4. Add bundle analysis to CI/CD pipeline');
    
    // Save detailed report
    await fs.writeJson(path.join(this.outputDir, 'size-reduction-plan.json'), report, { spaces: 2 });
    console.log(`\n📋 Detailed plan saved to: ${path.join(this.outputDir, 'size-reduction-plan.json')}`);
  }
}

// Run the bundle size reduction analysis
if (require.main === module) {
  const reducer = new BundleSizeReducer();
  reducer.run().catch(console.error);
}

module.exports = BundleSizeReducer;
