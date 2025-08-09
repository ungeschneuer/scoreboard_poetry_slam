#!/usr/bin/env node
/**
 * 📊 Performance Monitor - Quick Win Implementation
 * 
 * Real-time monitoring of app performance metrics
 */

const { performance, PerformanceObserver } = require('perf_hooks');
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      startup: {},
      memory: {},
      network: {},
      timestamps: {}
    };
    this.startTime = Date.now();
    this.setupObservers();
  }

  setupObservers() {
    // Monitor function performance
    const perfObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric('performance', {
          name: entry.name,
          duration: entry.duration,
          startTime: entry.startTime,
          type: entry.entryType
        });
      }
    });

    perfObserver.observe({ entryTypes: ['function', 'measure'] });
  }

  // Mark startup milestones
  markStartupPhase(phase) {
    const timestamp = Date.now();
    const elapsed = timestamp - this.startTime;
    
    this.metrics.startup[phase] = {
      timestamp,
      elapsed,
      phase
    };

    performance.mark(`startup-${phase}`);
    console.log(`🚀 Startup Phase: ${phase} (${elapsed}ms)`);
  }

  // Monitor memory usage
  recordMemoryUsage(context = 'general') {
    if (process && process.memoryUsage) {
      const memory = process.memoryUsage();
      this.metrics.memory[context] = {
        ...memory,
        timestamp: Date.now(),
        context
      };

      // Log if memory usage is high
      if (memory.heapUsed > 100 * 1024 * 1024) { // 100MB
        console.warn(`⚠️ High memory usage in ${context}: ${Math.round(memory.heapUsed / 1024 / 1024)}MB`);
      }
    }
  }

  // Record network request timing
  recordNetworkRequest(url, startTime, endTime, size = 0) {
    const duration = endTime - startTime;
    const timestamp = Date.now();

    this.metrics.network[timestamp] = {
      url,
      duration,
      size,
      timestamp,
      speed: size > 0 ? (size / duration * 1000) : 0 // bytes/second
    };

    console.log(`🌐 Network: ${url} (${duration}ms, ${Math.round(size/1024)}KB)`);
  }

  // Record custom metric
  recordMetric(category, data) {
    const timestamp = Date.now();
    
    if (!this.metrics[category]) {
      this.metrics[category] = {};
    }
    
    this.metrics[category][timestamp] = {
      ...data,
      timestamp
    };
  }

  // Generate performance report
  generateReport() {
    const report = {
      summary: {
        totalRuntime: Date.now() - this.startTime,
        startupPhases: Object.keys(this.metrics.startup).length,
        memorySnapshots: Object.keys(this.metrics.memory).length,
        networkRequests: Object.keys(this.metrics.network).length
      },
      metrics: this.metrics,
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Analyze startup performance
    const startupPhases = Object.values(this.metrics.startup);
    if (startupPhases.length > 0) {
      const totalStartup = Math.max(...startupPhases.map(p => p.elapsed));
      if (totalStartup > 3000) {
        recommendations.push({
          type: 'startup',
          priority: 'high',
          message: `Startup time is ${totalStartup}ms. Consider lazy loading or code splitting.`
        });
      }
    }

    // Analyze memory usage
    const memorySnapshots = Object.values(this.metrics.memory);
    if (memorySnapshots.length > 0) {
      const avgMemory = memorySnapshots.reduce((sum, m) => sum + m.heapUsed, 0) / memorySnapshots.length;
      if (avgMemory > 200 * 1024 * 1024) { // 200MB
        recommendations.push({
          type: 'memory',
          priority: 'medium',
          message: `Average memory usage is ${Math.round(avgMemory / 1024 / 1024)}MB. Consider memory optimization.`
        });
      }
    }

    // Analyze network requests
    const networkRequests = Object.values(this.metrics.network);
    if (networkRequests.length > 0) {
      const slowRequests = networkRequests.filter(req => req.duration > 1000);
      if (slowRequests.length > 0) {
        recommendations.push({
          type: 'network',
          priority: 'medium',
          message: `${slowRequests.length} slow network requests detected. Consider caching or compression.`
        });
      }
    }

    return recommendations;
  }

  // Save report to file
  saveReport(filename = null) {
    const report = this.generateReport();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = filename || `performance-report-${timestamp}.json`;
    
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`📊 Performance report saved to: ${reportFile}`);
    
    // Also log summary to console
    this.logSummary(report);
    
    return reportFile;
  }

  logSummary(report) {
    console.log('\n📊 Performance Summary:');
    console.log('========================');
    console.log(`Total Runtime: ${report.summary.totalRuntime}ms`);
    console.log(`Startup Phases: ${report.summary.startupPhases}`);
    console.log(`Memory Snapshots: ${report.summary.memorySnapshots}`);
    console.log(`Network Requests: ${report.summary.networkRequests}`);
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`);
      });
    }
  }

  // Quick win monitoring for Electron app
  monitorElectronApp() {
    // Monitor startup phases
    this.markStartupPhase('init');
    
    // Take memory snapshots periodically
    setInterval(() => {
      this.recordMemoryUsage('periodic');
    }, 30000); // Every 30 seconds

    // Monitor app exit
    process.on('beforeExit', () => {
      this.markStartupPhase('exit');
      this.saveReport();
    });

    console.log('📊 Performance monitoring started');
  }
}

// Export for use in other modules
module.exports = PerformanceMonitor;

// If run directly, start monitoring
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  monitor.monitorElectronApp();
  
  // Demo usage
  setTimeout(() => {
    monitor.markStartupPhase('ready');
    monitor.recordMemoryUsage('demo');
    monitor.recordNetworkRequest('admin.min.js', Date.now() - 100, Date.now(), 3193172);
    monitor.saveReport();
  }, 5000);
}
