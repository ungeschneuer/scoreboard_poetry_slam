# Poetry Slam Scoreboard

A standalone desktop application for managing Poetry Slam competitions built with AngularJS and Electron.

## Features

- **Standalone Desktop App**: No external dependencies or servers required
- **Admin Interface**: Manage competitions, participants, and scoring
- **Presentation View**: Display live scoreboard for audience
- **Dual Monitor Support**: Admin on primary display, presentation on secondary
- **Fullscreen Presentation**: Press F11 to toggle, ESC to exit fullscreen
- **Self-Contained**: Everything runs within the Electron application

## Quick Start

```bash
npm install
npm start
```

That's it! The application will:
1. Start an internal web server automatically
2. Launch two Electron windows (Admin + Presentation)
3. Everything is contained within the app - no external processes

## Available Scripts

- `npm start` - Start the standalone Electron application
- `npm run dev` - Same as start (for development)
- `npm run build` - Build desktop application for distribution

## Technology Stack

- **Frontend**: AngularJS (legacy)
- **Desktop**: Electron with embedded Fastify server
- **UI**: Material Design
- **Architecture**: Fully self-contained desktop application

## Project Structure

```
public/           # AngularJS application files
├── admin.html    # Admin interface
├── index.html    # Presentation view
├── *.min.js      # Compiled AngularJS application
└── modules/      # AngularJS components

src/
└── electron.js   # Electron main process with embedded server

assets/           # Application icons
```

## How It Works

1. **Single Process**: Everything runs in one Electron application
2. **Embedded Server**: Fastify server runs inside Electron main process
3. **Dual Windows**: Admin and presentation windows load from internal server
4. **No External Dependencies**: No need for separate web server processes

## Controls

- **ESC**: Exit fullscreen in presentation window
- **F11**: Toggle fullscreen in presentation window
- **Close Admin Window**: Exits entire application
