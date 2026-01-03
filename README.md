# Fotobuch-Editor

Ein leichtgewichtiger, browserbasierter Fotobuch-Editor, der vollständig offline funktioniert.

## Schnellstart

### 1. Lokalen Webserver starten

**Wichtig:** Der Webserver muss im Projekt-Root-Verzeichnis gestartet werden!

```bash
# Ins Projekt-Verzeichnis wechseln
cd /Users/sraabe/Projekte/bookeditor

# Python (empfohlen)
python3 -m http.server 8000

# Oder Node.js
npx serve

# Oder PHP
php -S localhost:8000
```

### 2. Editor im Browser öffnen

```
http://localhost:8000/example/photobook.html
```

### 3. Bilder hinzufügen

Kopieren Sie Ihre Bilder in den `example/images/` Ordner und klicken Sie im Editor auf "Bild hinzufügen".

## Projekt-Struktur

```
bookeditor/
├── template/              # HTML-Template für neue Projekte
├── src/                   # Source-Code
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript-Module
│   │   ├── core/        # Kern-Funktionalität
│   │   ├── ui/          # UI-Komponenten
│   │   ├── features/    # Features (Bild-Browser, Config)
│   │   └── utils/       # Hilfsfunktionen
├── example/              # Beispiel-Projekt zum Testen
│   ├── photobook.html   # Beispiel-Fotobuch
│   └── images/          # Beispielbilder
├── spec.md              # Vollständige Spezifikation
├── CLAUDE.md            # Dokumentation für Claude Code
└── IMPLEMENTATION_PLAN.md  # Implementierungsplan
```

## Features (Phase 1 - MVP)

✅ **Implementiert:**
- HTML-Struktur und UI-Layout
- Seitenverwaltung (Hinzufügen, Löschen, Navigation)
- Projekt-Konfiguration (Seitenformat, Name, Größe)
- Speichern/Laden (selbstmodifizierende HTML-Datei)
- Bild-Browser für `images/` Ordner
- Canvas mit Fabric.js

⏳ **Geplant (Phase 2+):**
- Bilder zum Canvas hinzufügen und manipulieren
- Textfelder erstellen und formatieren
- Drehen, Zuschnitt, Masken
- PDF-Export via Browser-Druckfunktion

## Entwicklung

### Voraussetzungen

- Moderner Browser (Chrome, Edge, Brave empfohlen)
- Lokaler Webserver für Entwicklung

### Technologie-Stack

- **HTML5** + **CSS3** (Grid, Flexbox)
- **JavaScript** (Vanilla JS, ES5+)
- **Fabric.js** für Canvas-Manipulation
- Keine Build-Tools erforderlich

### Namenskonvention

Alle JavaScript-Module verwenden den globalen Namespace `PhotobookEditor`:

```javascript
PhotobookEditor.Core.Project
PhotobookEditor.Core.PageManager
PhotobookEditor.UI.Toolbar
PhotobookEditor.Features.ImageBrowser
// etc.
```

## Wichtige Hinweise

### Webserver-Anforderung

Der Editor benötigt einen lokalen Webserver, um:
- Bilder aus dem `images/` Ordner zu laden
- Das Template beim Speichern zu laden
- CORS-Probleme zu vermeiden

**Ohne Webserver** können Sie die HTML-Datei nicht direkt im Browser öffnen!

### Directory Listing

Der Webserver muss Directory Listing für den `images/` Ordner aktiviert haben. Python's `http.server` hat dies standardmäßig aktiviert.

## Speichern & Laden

Das Projekt verwendet eine selbstmodifizierende HTML-Datei:

1. Klicken Sie auf "Speichern"
2. Eine neue `photobook.html` Datei wird heruntergeladen
3. Ersetzen Sie die alte Datei mit der neuen
4. Laden Sie die Seite neu

Projekt-Daten werden im `<script id="project-data">` Tag als JSON gespeichert.

## Dokumentation

- **spec.md** - Vollständige Spezifikation des Projekts
- **IMPLEMENTATION_PLAN.md** - Detaillierter Implementierungsplan
- **CLAUDE.md** - Dokumentation für Claude Code

## Lizenz

Dieses Projekt ist ein persönliches Projekt.
