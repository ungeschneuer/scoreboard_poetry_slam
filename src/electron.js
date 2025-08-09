const { app, BrowserWindow, dialog, screen } = require('electron');
const { fastify } = require('fastify');
const static = require('@fastify/static');
const path = require('path');

let adminWindow;
let presentationWindow;

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
    title: 'Slam22 Admin',
    icon: path.join(__dirname, '../assets/angela_64.png'),
    webPreferences: {
      nodeIntegration: true,
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
      title: 'Quit Slam22 Scoreboard?',
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
    title: 'Slam22 Presentation',
    icon: path.join(__dirname, '../assets/angela_64.png'),
    webPreferences: {
      nodeIntegration: true,
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
  // Start embedded web server
  const server = fastify({ logger: false });
  server.register(static, { root: path.join(__dirname, '..', 'public') });

  try {
    await server.listen({ port: 4200, host: '127.0.0.1' });
    console.log('🚀 Poetry Slam Scoreboard - Electron App Started');
    console.log('📡 Internal server running on http://localhost:4200');

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
