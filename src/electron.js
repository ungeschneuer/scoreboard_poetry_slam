const { app, BrowserWindow, dialog, screen, ipcMain } = require('electron');
const { fastify } = require('fastify');
const static = require('@fastify/static');
const path = require('path');
const PerformanceMonitor = require('../performance-monitor');

let adminWindow;
let presentationWindow;

// Secure IPC handlers
const setupIpcHandlers = () => {
  // Window controls
  ipcMain.handle('close-app', () => {
    app.quit();
  });

  ipcMain.handle('minimize-window', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) focusedWindow.minimize();
  });

  ipcMain.handle('maximize-window', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) {
      if (focusedWindow.isMaximized()) {
        focusedWindow.unmaximize();
      } else {
        focusedWindow.maximize();
      }
    }
  });

  // Presentation controls
  ipcMain.handle('toggle-fullscreen', () => {
    if (presentationWindow) {
      const isFullScreen = presentationWindow.isFullScreen();
      presentationWindow.setFullScreen(!isFullScreen);
      presentationWindow.setMovable(!isFullScreen);
    }
  });

  ipcMain.handle('exit-fullscreen', () => {
    if (presentationWindow) {
      presentationWindow.setFullScreen(false);
      presentationWindow.setMovable(true);
    }
  });

  // Development tools (remove in production)
  ipcMain.handle('open-dev-tools', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow();
    if (focusedWindow) focusedWindow.webContents.openDevTools();
  });

  // App info
  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

  console.log('🔒 Secure IPC handlers registered');
};

const createAdminWindow = (display) => {
  const config = {
    x: display !== undefined ? display.bounds.x : 0,
    y: display !== undefined ? display.bounds.y : 0,
    width: 800,
    height: 600,
    frame: true,
    closable: true,
    fullscreen: false,
    autoHideMenuBar: true,
    backgroundColor: '#000000',
    title: 'SLAM25 Admin',
    icon: path.join(__dirname, '../assets/angela_64.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
  };

  adminWindow = new BrowserWindow(config);

  // mainWindow.setTitle
  adminWindow.on('page-title-updated', (event) => {
    event.preventDefault();
  });

  adminWindow.maximize();
  adminWindow.webContents.setAudioMuted(false);
  // adminWindow.webContents.openDevTools();
  adminWindow.loadURL(`http://localhost:4200/admin.html`);

  adminWindow.on('close', (event) => {
    const choice = dialog.showMessageBoxSync(adminWindow, {
      type: 'question',
      buttons: ['Cancel', 'Close'],
      title: 'Quit SLAM25 Scoreboard?',
      message: 'This will close Admin and Presentation windows.',
      defaultId: 0,
      cancelId: 0,
    });

    if (choice === 0) {
      event.preventDefault();
    }
  });

  adminWindow.on('closed', () => {
    adminWindow = null;
    app.exit();
  });
};

const createPresentationWindow = (display) => {
  const config = {
    x: display !== undefined ? display.bounds.x : 0,
    y: display !== undefined ? display.bounds.y : 0,
    width: display !== undefined ? display.bounds.width : 1920,
    height: display !== undefined ? display.bounds.height : 1080,
    frame: true, // Rahmen für Beweglichkeit im Fenstermodus
    closable: true, // Erlaubt Schließen im Fenstermodus
    fullscreen: true, // Startet im Vollbild
    autoHideMenuBar: true,
    backgroundColor: '#000000',
    title: 'SLAM25 Presentation',
    icon: path.join(__dirname, '../assets/angela_64.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
  };

  presentationWindow = new BrowserWindow(config);

  presentationWindow.on('page-title-updated', (event) => {
    event.preventDefault();
  });

  presentationWindow.maximize();
  presentationWindow.webContents.setAudioMuted(false);
  // presentationWindow.webContents.openDevTools();
  
  // Simple ESC key handler for presentation window
  presentationWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'Escape' && input.type === 'keyDown') {
      console.log('ESC pressed - exiting fullscreen');
      presentationWindow.setFullScreen(false);
      // Make window movable when not in fullscreen
      presentationWindow.setMovable(true);
    }
    if (input.key === 'F11' && input.type === 'keyDown') {
      console.log('F11 pressed - toggling fullscreen');
      const isFullScreen = presentationWindow.isFullScreen();
      presentationWindow.setFullScreen(!isFullScreen);
      // Control movability based on fullscreen state
      presentationWindow.setMovable(!isFullScreen);
    }
  });
  
  presentationWindow.loadURL(`http://localhost:4200/index.html`);

  presentationWindow.on('closed', () => {
    presentationWindow = null;
  });
};

const onAppReady = async () => {
  // Initialize performance monitoring
  const monitor = new PerformanceMonitor();
  monitor.markStartupPhase('app-ready');
  monitor.recordMemoryUsage('startup');

  // Setup secure IPC handlers
  setupIpcHandlers();

  // Start embedded web server with optimized compression
  const server = fastify({ logger: false });
  
  // Register compression with safe configuration for AngularJS
  await server.register(require('@fastify/compress'), {
    global: false, // Don't compress everything automatically
    threshold: 10240, // Only compress files larger than 10KB
    encodings: ['br', 'gzip'], // Brotli preferred, gzip fallback
    customTypes: /text\/|application\/javascript|application\/json/, // Only compress text files
    onInvalidRequestPayload: () => {}, // Handle invalid payloads gracefully
    zlibOptions: {
      level: 6, // Balanced compression level
      chunkSize: 1024,
    }
  });
  
  server.register(static, { 
    root: path.join(__dirname, '..', 'public'),
    preCompressed: false, // Don't look for .gz files yet
    decorateReply: false,
    cacheControl: true,
    maxAge: '1h', // Cache static assets for 1 hour
    etag: true,
    lastModified: true
  });

  try {
    await server.listen({ port: 4200, host: '127.0.0.1' });
    console.log('🚀 Poetry Slam Scoreboard - Electron App Started');
    console.log('📡 Internal server running on http://localhost:4200');
    console.log('🗜️  Compression: Brotli + Gzip enabled');
    console.log('⚡ Quick wins: Resource preloading, optimized fonts, HTTP caching');
    
    monitor.markStartupPhase('server-ready');
    monitor.recordMemoryUsage('server-started');

    const allDisplays = screen.getAllDisplays();
    const primaryDisplay = screen.getPrimaryDisplay();

    createAdminWindow(primaryDisplay);

    let secondaryDisplay;
    if (allDisplays.length > 1) {
      secondaryDisplay = allDisplays.find((display) => {
        return display.id !== primaryDisplay.id;
      });
    }

    createPresentationWindow(secondaryDisplay);
  } catch (error) {
    console.error('❌ Failed to start internal server:', error);
    app.quit();
  }
};

app.on('ready', onAppReady);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (adminWindow === null) onAppReady();
});
