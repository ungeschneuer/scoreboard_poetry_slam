# 🛠️ Optimization Tools

This directory contains development and optimization tools for the Poetry Slam Scoreboard.

## Available Tools

### Build & Verification
- `build-verification.js` - Verifies all build requirements
- `pre-build.js` - Pre-build processing and verification
- `cleanup-project.js` - Project cleanup tool

### Performance Analysis
- `performance-monitor.js` - Real-time performance monitoring
- `comprehensive-bundle-reduction-summary.js` - Complete bundle analysis
- `bundle-size-reduction-plan.js` - Detailed optimization planning

### Bundle Optimization
- `material-tree-shaker.js` - Material Design component analysis
- `icon-optimizer.js` - Icon usage analysis and optimization
- `optimize-bundles.js` - Legacy bundle optimizer

## Usage

```bash
# Run from project root
node tools/build-verification.js
node tools/performance-monitor.js
node tools/cleanup-project.js
```

## Scripts

These tools are also available via npm scripts:
- `npm run build:verify` - Build verification
- `npm run optimize` - Bundle analysis
- `npm run analyze` - Performance analysis
