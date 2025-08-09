# 🎭 Poetry Slam Scoreboard

Eine moderne, plattformübergreifende Desktop-Anwendung zur Verwaltung und Präsentation von Poetry Slam-Wettbewerben mit Echtzeit-Bewertung, schönen Präsentationen und professionellen Funktionen.

Fork des nicht mehr verfügbaren Projekts von [Code for Heilbronn e.V.](https://codefor.de/projekte/hn-poetryslam/). Quick and Dirty Ansatz, um die Software wieder zum Laufen zu bringen.

![Poetry Slam Scoreboard](public/media-optimized/logo/logo_256.png)

## ✨ Funktionen

### 🎯 **Kernfunktionen**
- **Echtzeit-Bewertung**: Live-Bewertungsberechnung und -anzeige
- **Duale Benutzeroberfläche**: Separate Admin- und Präsentationsfenster
- **Wettbewerbsverwaltung**: Wettbewerbe erstellen, verwalten und verfolgen
- **Teilnehmerverwaltung**: Teilnehmer hinzufügen, bearbeiten und organisieren
- **Gruppenunterstützung**: Teilnehmer in Gruppen organisieren
- **Ergebnis-Export**: Wettbewerbsergebnisse als CSV exportieren

### 🎨 **Präsentationsfunktionen**
- **Schöne Displays**: Professionelle Präsentationsoberfläche
- **Benutzerdefinierte Hintergründe**: Eigene Hintergrundbilder hochladen und verwenden
- **Anzeigemodi**: Cover- und Contain-Modi für perfekte Bilddarstellung
- **Responsive Design**: Passt sich verschiedenen Bildschirmgrößen und Auflösungen an
- **Vollbild-Unterstützung**: Optimiert für Projektordisplays

### 🔧 **Technische Funktionen**
- **Plattformübergreifend**: Windows, macOS und Linux-Unterstützung
- **Optimierte Leistung**: Schneller Start und flüssiger Betrieb
- **Media-Optimierung**: WebP-Unterstützung und optimierte Assets
- **Kompression**: Brotli- und Gzip-Kompression für schnelleres Laden
- **Sicherheit**: Sichere IPC-Kommunikation und sandboxierte Ausführung

## 🚀 Schnellstart

### **Herunterladen & Installieren**

#### **Windows**
1. Laden Sie die neueste Version von [GitHub Releases](https://github.com/yourusername/scoreboard_poetry_slam/releases) herunter
2. Wählen Sie Ihr bevorzugtes Format:
   - **Installer**: `Poetry Slam Scoreboard Setup X.X.X.exe` (empfohlen)
   - **Portable**: `Poetry Slam Scoreboard X.X.X.exe` (keine Installation)
   - **ZIP**: `Poetry Slam Scoreboard-win32-x64.zip` (extrahieren und ausführen)

#### **macOS**
1. Laden Sie die neueste `.dmg`-Datei von [GitHub Releases](https://github.com/yourusername/scoreboard_poetry_slam/releases) herunter
2. Öffnen Sie die DMG und ziehen Sie die App in den Applications-Ordner
3. Starten Sie aus dem Applications-Ordner

#### **Linux**
1. Laden Sie die neueste `.AppImage` oder `.deb`-Datei herunter
2. Ausführbar machen: `chmod +x Poetry\ Slam\ Scoreboard-X.X.X.AppImage`
3. Ausführen: `./Poetry\ Slam\ Scoreboard-X.X.X.AppImage`

### **Erster Start**
1. **Admin-Fenster**: Öffnet sich automatisch für die Einrichtung
2. **Präsentationsfenster**: Öffnet sich im Vollbildmodus für Displays
3. **Wettbewerb erstellen**: Richten Sie Ihren ersten Poetry Slam-Event ein
4. **Teilnehmer hinzufügen**: Geben Sie Teilnehmerinformationen ein
5. **Bewertung starten**: Beginnen Sie den Wettbewerb!

## 📖 Benutzerhandbuch

### **Admin-Interface**

#### **Wettbewerbe-Tab**
- Neue Wettbewerbe erstellen
- Wettbewerbsparameter festlegen
- Aktive Wettbewerbe verwalten
- Wettbewerbshistorie anzeigen

#### **Teilnehmer-Tab**
- Neue Teilnehmer hinzufügen
- Teilnehmerinformationen bearbeiten
- In Gruppen organisieren
- Teilnehmerlisten importieren/exportieren

#### **Administration-Tab**
- **Präsentationseinstellungen**: Darstellungsaussehen anpassen
  - Hintergrundmodus: Cover oder Contain
  - Benutzerdefinierte Hintergrundbilder (PNG/JPEG/WebP, min. 1920×1080px)
- **Backup & Wiederherstellung**: Wettbewerbsdaten speichern und laden
- **Systemeinstellungen**: Anwendungsverhalten konfigurieren

### **Präsentations-Interface**

#### **Bewertungsanzeige**
- Echtzeit-Bewertungsaktualisierungen
- Teilnehmerinformationen
- Timer- und Rundenverwaltung
- Professionelles Präsentationslayout

#### **Anpassung**
- Eigene Hintergrundbilder hochladen
- Anzeigemodus wählen (Cover/Contain)
- Für verschiedene Bildschirmgrößen anpassen
- Vollbild-Optimierung

## 🛠️ Entwicklung

### **Voraussetzungen**
- Node.js 16+ 
- npm oder yarn
- Git

### **Einrichtung**
```bash
# Repository klonen
git clone https://github.com/yourusername/scoreboard_poetry_slam.git
cd scoreboard_poetry_slam

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm start
```

### **Build-Befehle**
```bash
# Für aktuelle Plattform bauen
npm run build

# Für spezifische Plattformen bauen
npm run build:mac      # macOS
npm run build:win      # Windows
npm run build:win:portable  # Windows portable
npm run build:win:installer # Windows installer

# Windows-Icons einrichten (benötigt ImageMagick)
npm run setup:win

# Build-Konfiguration verifizieren
npm run build:verify
```

### **Entwicklungs-Skripte**
```bash
# Entwicklungsmodus starten
npm run dev

# Bundle-Größe analysieren
npm run analyze

# Bundles optimieren
npm run optimize

# Tests ausführen
npm test
```

## 📁 Projektstruktur

```
scoreboard_poetry_slam/
├── src/                    # Quellcode
│   ├── electron.js         # Haupt-Electron-Prozess
│   ├── server.js           # Fastify-Webserver
│   └── preload.js          # Preload-Skripte
├── client/                 # Frontend-Quelle
│   ├── src/               # AngularJS-Quelle
│   ├── templates/         # HTML-Templates
│   └── webpack.config.js  # Build-Konfiguration
├── public/                # Gebaute Assets
│   ├── admin.html         # Admin-Interface
│   ├── index.html         # Präsentations-Interface
│   ├── admin.min.js       # Admin-Bundle
│   ├── index.min.js       # Präsentations-Bundle
│   └── media-optimized/   # Optimierte Media-Assets
├── tools/                 # Build- und Optimierungstools
```

## 🔧 Konfiguration

### **Umgebungsvariablen**
```bash
NODE_ENV=production        # Produktionsmodus
ELECTRON_IS_DEV=false      # Dev-Tools deaktivieren
```

### **Build-Konfiguration**
Siehe `package.json` für detaillierte Build-Konfiguration:
- **Windows**: NSIS-Installer, portable App, ZIP
- **macOS**: DMG, ZIP
- **Linux**: AppImage, DEB, RPM

## 🎨 Anpassung

### **Präsentationseinstellungen**
1. Admin-Interface öffnen
2. Zum Administration-Tab gehen
3. Präsentationseinstellungen konfigurieren:
   - **Hintergrundmodus**: Cover (füllt Bildschirm) oder Contain (Letterbox)
   - **Benutzerdefinierter Hintergrund**: Eigenes Bild hochladen (1920×1080px Minimum)
   - **Einstellungen bleiben**: Änderungen werden automatisch gespeichert

### **Theming**
- CSS in `client/src/` modifizieren
- Farben und Styling aktualisieren
- Animationen und Übergänge anpassen

## 🐛 Fehlerbehebung

### **Häufige Probleme**

#### **App startet nicht**
- Node.js-Version prüfen (benötigt 16+)
- npm-Cache löschen: `npm cache clean --force`
- Abhängigkeiten neu installieren: `rm -rf node_modules && npm install`

#### **Windows-Build schlägt fehl**
- ImageMagick installieren: `choco install imagemagick`
- Icon-Setup ausführen: `npm run setup:win`
- Windows SDK-Installation prüfen

#### **macOS-Build schlägt fehl**
- Xcode Command Line Tools installieren
- Code-Signing-Zertifikate prüfen
- macOS-Version-Kompatibilität verifizieren

#### **Leistungsprobleme**
- Verfügbaren Speicher prüfen
- Andere Anwendungen schließen
- Grafiktreiber aktualisieren




- Bestehenden Code-Stil befolgen
- Aussagekräftige Commit-Nachrichten verwenden
- Kommentare für komplexe Logik hinzufügen
- Dokumentation bei Bedarf aktualisieren

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](LICENSE)-Datei für Details.

#
