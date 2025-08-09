const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  closeApp: () => ipcRenderer.invoke('close-app'),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  
  // Presentation controls
  toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen'),
  exitFullscreen: () => ipcRenderer.invoke('exit-fullscreen'),
  
  // File operations (if needed for future features)
  openFile: () => ipcRenderer.invoke('open-file'),
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
  
  // Settings/preferences
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  
  // Event listeners for renderer
  onWindowStateChange: (callback) => ipcRenderer.on('window-state-changed', callback),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Development helpers (remove in production)
  openDevTools: () => ipcRenderer.invoke('open-dev-tools'),
  
  // Version info
  getVersion: () => ipcRenderer.invoke('get-app-version')
});

// Remove any global Node.js objects that might have been exposed
delete window.require;
delete window.exports;
delete window.module;

console.log('🔒 Preload script loaded - Secure context bridge established');
