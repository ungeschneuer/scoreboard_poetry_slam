const { app, BrowserWindow, protocol, screen } = require('electron');
const { fastify } = require('fastify');
const static = require('@fastify/static');
const url = require('url');
const path = require('path');

let adminWindow;
let presentationWindow;

const createAdminWindow = (display) => {
  const config = {
    width: 800,
    height: 600,
    x: display !== undefined ? display.bounds.x : 0,
    y: display !== undefined ? display.bounds.y : 0,
    frame: true,
    autoHideMenuBar: true,
    title: 'Slamware Admin',
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
  // adminWindow.webContents.openDevTools();
  adminWindow.loadURL(`http://localhost:4200/admin.html`);

  adminWindow.on('closed', () => {
    adminWindow = null;
  });
};

const createPresentationWindow = (display) => {
  const config = {
    width: 800,
    height: 600,
    frame: true,
    autoHideMenuBar: true,
    title: 'Slamware Presentation',
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
  // presentationWindow.webContents.openDevTools();
  presentationWindow.loadURL(`http://localhost:4200/index.html`);

  presentationWindow.on('closed', () => {
    presentationWindow = null;
  });
};

const onAppReady = async () => {
  const server = fastify({ logger: false });
  server.register(static, { root: path.join(__dirname, '..', 'public') });

  try {
    await server.listen({ port: 4200, host: '0.0.0.0' });

    let primaryDisplay = screen.getPrimaryDisplay();
    let displays = screen.getAllDisplays();

    // console.log('primary display', primaryDisplay);
    createAdminWindow(primaryDisplay);

    let secondDisplay;

    if (displays.length > 1) {
      secondDisplay = displays.find((display) => {
        return display.id != primaryDisplay.id;
      });
    }

    // console.log('presentation display', secondDisplay ?? primaryDisplay);
    createPresentationWindow(secondDisplay ?? primaryDisplay);
  } catch (error) {
    // console.log(error);
  }
};

app.on('ready', onAppReady);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (adminWindow === null) onAppReady();
});
