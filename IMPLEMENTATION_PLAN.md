# Implementierungsplan: Fotobuch-Editor

## Technische Entscheidungen

### JavaScript-Library
- **Fabric.js** für Canvas-Manipulation
- Version: Latest stable (ca. 5.3+)
- Einbindung: Via CDN in der HTML-Datei

### Bild-Verwaltung
- **Nur Webserver-Methode** (Phase 1)
- Bilder werden über relative Pfade referenziert (`images/photo.jpg`)
- Automatisches Scannen des `images/` Ordners
- Fallback (Drag & Drop mit Base64) wird in einer späteren Phase ergänzt

### Ziel: Phase 1 - MVP

Fokus auf ein minimal funktionsfähiges Produkt mit:
- HTML-Struktur und UI-Layout
- Seitenverwaltung (Hinzufügen, Löschen, Navigation)
- Projekt-Konfiguration (Seitenformat)
- Grundlegendes Speichern/Laden
- Bild-Browser für `images/` Ordner

---

## Dateistruktur

```
bookeditor/
├── spec.md                          # Spezifikation (bereits vorhanden)
├── CLAUDE.md                        # Claude Code Dokumentation
├── IMPLEMENTATION_PLAN.md           # Dieser Plan
├── template/                        # Template-Dateien
│   └── photobook-template.html      # Basis-Template für neue Projekte
├── src/                             # Source-Dateien (während Entwicklung)
│   ├── js/
│   │   ├── core/
│   │   │   ├── project.js           # Projekt-Datenmodell & Verwaltung
│   │   │   ├── page.js              # Seiten-Verwaltung
│   │   │   └── storage.js           # Speichern/Laden Funktionalität
│   │   ├── ui/
│   │   │   ├── toolbar.js           # Hauptmenü/Toolbar
│   │   │   ├── page-overview.js     # Seitenübersicht (Sidebar links)
│   │   │   ├── properties-panel.js  # Eigenschaften-Panel (Sidebar rechts)
│   │   │   ├── statusbar.js         # Status-Leiste unten
│   │   │   └── canvas-workspace.js  # Hauptarbeitsfläche mit Fabric.js Canvas
│   │   ├── features/
│   │   │   ├── image-browser.js     # Bild-Browser für images/ Ordner
│   │   │   └── project-config.js    # Projekt-Konfigurationsdialog
│   │   ├── utils/
│   │   │   ├── units.js             # Einheiten-Konvertierung (mm, px, DPI)
│   │   │   └── dom-helpers.js       # DOM-Hilfsfunktionen
│   │   └── main.js                  # Haupt-Einstiegspunkt, initialisiert App
│   └── css/
│       ├── reset.css                # CSS Reset
│       ├── layout.css               # Haupt-Layout (Grid, Flexbox)
│       ├── components.css           # UI-Komponenten (Buttons, Inputs, etc.)
│       └── print.css                # Print-Styles (für Phase 4)
└── example/                         # Beispiel-Projekt zum Testen
    ├── photobook.html               # Beispiel-Fotobuch
    └── images/
        └── (Beispielbilder)
```

---

## Phase 1: MVP - Detaillierte Aufgaben

### 1. Projekt-Setup ✓ Basis erstellen

**Aufgabe 1.1**: HTML-Template erstellen
- Datei: `template/photobook-template.html`
- Struktur:
  ```html
  <!DOCTYPE html>
  <html lang="de">
  <head>
    <meta charset="UTF-8">
    <title>Mein Fotobuch</title>
    <!-- Fabric.js von CDN -->
    <link rel="stylesheet" href="src/css/reset.css">
    <link rel="stylesheet" href="src/css/layout.css">
    <link rel="stylesheet" href="src/css/components.css">
  </head>
  <body>
    <div id="app">
      <!-- UI-Struktur hier -->
    </div>

    <!-- Projekt-Daten als JSON -->
    <script id="project-data" type="application/json">
    {
      "projectInfo": {
        "name": "Neues Fotobuch",
        "created": "2026-01-02T10:00:00Z",
        "modified": "2026-01-02T10:00:00Z",
        "version": "1.0"
      },
      "pageFormat": {
        "width": 297,
        "height": 210,
        "unit": "mm",
        "dpi": 300,
        "margins": { "top": 5, "right": 5, "bottom": 5, "left": 5 },
        "bleed": 3
      },
      "pages": []
    }
    </script>

    <!-- JavaScript-Module -->
    <script src="src/js/utils/units.js"></script>
    <script src="src/js/utils/dom-helpers.js"></script>
    <script src="src/js/core/project.js"></script>
    <script src="src/js/core/page.js"></script>
    <script src="src/js/core/storage.js"></script>
    <script src="src/js/ui/toolbar.js"></script>
    <script src="src/js/ui/page-overview.js"></script>
    <script src="src/js/ui/properties-panel.js"></script>
    <script src="src/js/ui/statusbar.js"></script>
    <script src="src/js/ui/canvas-workspace.js"></script>
    <script src="src/js/features/image-browser.js"></script>
    <script src="src/js/features/project-config.js"></script>
    <script src="src/js/main.js"></script>
  </body>
  </html>
  ```

**Aufgabe 1.2**: CSS Layout-Grundgerüst
- Datei: `src/css/layout.css`
- UI-Grid wie in Spec definiert:
  ```
  +--------------------------------------------------+
  |  Toolbar                                         |
  +--------------------------------------------------+
  |  Werkzeugleiste                                  |
  +--------+---------------------------------+--------+
  | Pages  |     Canvas                      | Props  |
  | (L)    |                                 | (R)    |
  +--------+---------------------------------+--------+
  |  Statusleiste                                    |
  +--------------------------------------------------+
  ```
- CSS Grid oder Flexbox verwenden
- Responsive für verschiedene Bildschirmgrößen

**Aufgabe 1.3**: CSS Reset und Komponenten
- `src/css/reset.css`: Standard CSS Reset
- `src/css/components.css`: Buttons, Inputs, Panels, etc.

---

### 2. Core: Projekt-Datenmodell

**Aufgabe 2.1**: Projekt-Klasse implementieren
- Datei: `src/js/core/project.js`
- Funktionen:
  - `loadProjectData()`: JSON aus `<script id="project-data">` laden
  - `getProjectInfo()`: Projekt-Metadaten abrufen
  - `getPageFormat()`: Seitenformat abrufen
  - `getPages()`: Alle Seiten abrufen
  - `updateProjectInfo(info)`: Metadaten aktualisieren
  - `updatePageFormat(format)`: Seitenformat ändern

**Aufgabe 2.2**: Einheiten-Konvertierung
- Datei: `src/js/utils/units.js`
- Funktionen:
  - `mmToPx(mm, dpi)`: mm zu Pixel konvertieren (bei 300 DPI)
  - `pxToMm(px, dpi)`: Pixel zu mm konvertieren
  - Formel: `px = (mm * dpi) / 25.4`

---

### 3. Seitenverwaltung

**Aufgabe 3.1**: Page-Klasse implementieren
- Datei: `src/js/core/page.js`
- Funktionen:
  - `createPage(id)`: Neue leere Seite erstellen
  - `deletePage(id)`: Seite löschen (mit Bestätigung)
  - `getPageById(id)`: Seite abrufen
  - `addPage(index)`: Seite an Position einfügen
  - Seite hat: `id`, `background`, `elements[]`

**Aufgabe 3.2**: Seitenübersicht UI
- Datei: `src/js/ui/page-overview.js`
- Features:
  - Vertikale Liste aller Seiten (Sidebar links)
  - Miniaturansicht (Thumbnail) jeder Seite
  - Aktuelle Seite hervorgehoben
  - Klick zum Wechseln der Seite
  - Buttons: "Seite hinzufügen", "Seite löschen"
  - Seitennummer anzeigen

**Aufgabe 3.3**: Seiten-Navigation
- Datei: `src/js/core/page.js` erweitern
- Funktionen:
  - `setCurrentPage(id)`: Aktuelle Seite setzen
  - `getCurrentPage()`: Aktuelle Seite abrufen
  - `nextPage()`: Zur nächsten Seite
  - `previousPage()`: Zur vorherigen Seite
  - Event: Benachrichtigung bei Seitenwechsel

---

### 4. Canvas-Workspace (Fabric.js)

**Aufgabe 4.1**: Canvas initialisieren
- Datei: `src/js/ui/canvas-workspace.js`
- Fabric.js Canvas erstellen:
  ```javascript
  const canvas = new fabric.Canvas('canvas-element');
  ```
- Canvas-Größe basierend auf Seitenformat berechnen
  - Seitenformat aus Projekt-Daten lesen
  - Mit `mmToPx()` in Pixel konvertieren
  - Canvas auf diese Größe setzen

**Aufgabe 4.2**: Canvas-Hintergrund
- Weißer Hintergrund standardmäßig
- Rand/Rahmen um Canvas für visuelle Abgrenzung
- Arbeitsbereich scrollbar falls Canvas größer als Viewport

**Aufgabe 4.3**: Canvas-Rendering
- Leere Seite rendern (weißer Bereich)
- Funktion: `renderPage(pageData)` um Seiteninhalt zu laden
- Initial: Nur leerer Canvas (Elemente kommen in Phase 2)

---

### 5. UI-Komponenten

**Aufgabe 5.1**: Toolbar implementieren
- Datei: `src/js/ui/toolbar.js`
- Menüpunkte:
  - **Datei**: "Speichern" (vorerst nur Alert/Placeholder)
  - **Seite**: "Neue Seite", "Seite löschen"
  - **Hilfe**: "Über" (zeigt Info zum Projekt)
- Buttons/Menü mit Icons (optional: SVG Icons oder Unicode)

**Aufgabe 5.2**: Werkzeugleiste (unterhalb Toolbar)
- Buttons für:
  - "Bild hinzufügen" (öffnet Bild-Browser)
  - "Seite hinzufügen"
  - "Seite löschen"
  - "Speichern"
- Vorerst Platzhalter - volle Funktionalität in Phase 2

**Aufgabe 5.3**: Eigenschaften-Panel (Sidebar rechts)
- Datei: `src/js/ui/properties-panel.js`
- Zeigt Projekt-Eigenschaften:
  - Projekt-Name
  - Seitenformat (Breite x Höhe mm)
  - DPI-Anzeige (300 DPI, fest)
  - Aktuelle Seitennummer
- Button: "Projekt-Einstellungen" (öffnet Konfigurations-Dialog)

**Aufgabe 5.4**: Statusleiste
- Datei: `src/js/ui/statusbar.js`
- Anzeige:
  - "Seite X von Y"
  - Zoom-Level (initial: 100%) - Zoom-Funktionalität optional/Phase 5

---

### 6. Projekt-Konfiguration

**Aufgabe 6.1**: Konfigurations-Dialog
- Datei: `src/js/features/project-config.js`
- Modal-Dialog zum Bearbeiten von:
  - **Projekt-Name**
  - **Seitenformat**:
    - Dropdown mit vordefinierten Formaten:
      - A4 Querformat (297 x 210 mm)
      - A4 Hochformat (210 x 297 mm)
      - Quadratisch 30x30 cm
      - Quadratisch 21x21 cm
      - Benutzerdefiniert
    - Bei "Benutzerdefiniert": Eingabefelder für Breite/Höhe
    - Validierung: Min. 100mm, Max. 500mm
  - **Seitenränder**: Eingabe in mm (Standard: 5mm)
  - **Anschnitt**: Eingabe in mm (Standard: 3mm)
- Buttons: "Speichern", "Abbrechen"
- Nach Speichern: Canvas-Größe aktualisieren

**Aufgabe 6.2**: Format-Änderung
- Bei Änderung des Seitenformats:
  - Canvas neu berechnen und skalieren
  - Warnung anzeigen: "Bestehende Elemente könnten außerhalb liegen"
  - Projekt-Daten aktualisieren

---

### 7. Bild-Browser für images/ Ordner

**Aufgabe 7.1**: images/ Ordner scannen
- Datei: `src/js/features/image-browser.js`
- **Implementierung**: Fetch + Directory Listing parsen
  - Fetch Request an `images/` (z.B. `fetch('images/')`)
  - Response HTML parsen um Links zu Bilddateien zu finden
  - Filter auf Bild-Endungen: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
  - Beispiel-Code:
    ```javascript
    async function scanImagesFolder() {
      try {
        const response = await fetch('images/');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a');
        const images = [];
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href && /\.(jpg|jpeg|png|gif|webp)$/i.test(href)) {
            images.push(href);
          }
        });
        return images;
      } catch (error) {
        console.error('Fehler beim Scannen des images/ Ordners:', error);
        return [];
      }
    }
    ```
  - **Fehlerbehandlung**: Bei Fehler → Fehlermeldung anzeigen mit Hinweis auf Webserver-Setup
  - **Dokumentation**: In README/Anleitung erwähnen, dass Webserver Directory Listing aktiviert haben muss

**Aufgabe 7.2**: Bild-Browser UI
- Modal-Dialog oder Side-Panel
- Zeigt Liste/Grid der verfügbaren Bilder
- Thumbnails anzeigen (via `<img src="images/photo.jpg">`)
- Klick auf Bild: "Zum Canvas hinzufügen" markieren
- Button: "Ausgewählte Bilder hinzufügen"
- Vorerst Platzhalter - tatsächliches Hinzufügen in Phase 2

---

### 8. Speichern & Laden

**Aufgabe 8.1**: Projekt-Daten sammeln
- Datei: `src/js/core/storage.js`
- Funktion: `collectProjectData()`
  - Liest aktuelle Projekt-Metadaten
  - Sammelt alle Seiten mit Elementen
  - Aktualisiert `modified` Timestamp
  - Gibt JSON-Objekt zurück

**Aufgabe 8.2**: HTML-Datei neu generieren
- Funktion: `generateHTMLFile(projectData)`
  - Template `photobook-template.html` laden
  - `<script id="project-data">` Inhalt ersetzen mit aktualisierten Daten
  - Vollständige HTML-Datei als String zurückgeben

**Aufgabe 8.3**: Download-Funktion
- Funktion: `downloadHTML(htmlContent, filename)`
  - Erstellt Blob mit HTML-Inhalt
  - Erstellt temporären Download-Link
  - Klick simulieren zum Download
  - Beispiel:
    ```javascript
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'photobook.html';
    a.click();
    ```

**Aufgabe 8.4**: Speichern-Button implementieren
- In Toolbar/Werkzeugleiste
- Klick → `collectProjectData()` → `generateHTMLFile()` → `downloadHTML()`
- Benutzer ersetzt dann manuell die Datei

**Aufgabe 8.5**: Laden beim Start
- In `src/js/main.js`:
  - Beim Laden der Seite: `loadProjectData()` aufrufen
  - Projekt initialisieren
  - Erste Seite anzeigen (oder neue Seite erstellen falls keine vorhanden)

---

### 9. Initialisierung & Main

**Aufgabe 9.1**: App-Initialisierung
- Datei: `src/js/main.js`
- `init()` Funktion:
  - Projekt-Daten laden
  - UI-Komponenten initialisieren (Toolbar, Sidebars, Canvas, etc.)
  - Event-Listener registrieren
  - Erste Seite laden oder erstellen
  - Canvas rendern

**Aufgabe 9.2**: Event-System (optional/einfach)
- Einfaches Event-System für Komponenten-Kommunikation
- Oder direkte Funktionsaufrufe für MVP
- Beispiel-Events:
  - `pageChanged`: Wenn Seite gewechselt wird
  - `projectUpdated`: Wenn Projekt-Daten geändert werden

---

### 10. Testing & Beispiel-Projekt

**Aufgabe 10.1**: Beispiel-Projekt erstellen
- Ordner: `example/`
- Datei: `example/photobook.html` (Kopie des Templates)
- Ordner: `example/images/` mit ein paar Test-Bildern
- Webserver starten: `python3 -m http.server 8000`
- Öffnen: `http://localhost:8000/example/photobook.html`

**Aufgabe 10.2**: Manuelles Testing
- Neues Projekt erstellen
- Seiten hinzufügen/löschen
- Zwischen Seiten navigieren
- Projekt-Einstellungen ändern (Format, Größe)
- Speichern und erneut laden
- Bild-Browser öffnen (falls implementiert)

---

## Implementierungs-Reihenfolge (Empfohlen)

1. **Setup**: HTML-Template, CSS-Layout, Dateistruktur
2. **Core**: Projekt-Datenmodell, Einheiten-Konvertierung
3. **Pages**: Seiten-Verwaltung, Seitenübersicht UI
4. **Canvas**: Fabric.js Canvas initialisieren, rendern
5. **UI**: Toolbar, Werkzeugleiste, Properties Panel, Statusleiste
6. **Config**: Projekt-Konfigurationsdialog
7. **Images**: Bild-Browser (Strategie klären!)
8. **Storage**: Speichern/Laden implementieren
9. **Init**: App-Initialisierung, Event-System
10. **Test**: Beispiel-Projekt, Testing

---

## Technische Entscheidungen (geklärt)

### 1. Bild-Browser: Ordner-Scanning Strategie
**✓ Entscheidung: Option B - Automatisches Scanning via Fetch**
- Fetch Request an `images/` Ordner
- Directory Listing HTML parsen um Dateiliste zu extrahieren
- Eleganter und benutzerfreundlicher
- Abhängig von Webserver-Konfiguration (dokumentieren!)
- Fallback: Fehlermeldung mit Hinweis auf Webserver-Setup

### 2. Template-Generierung
**✓ Entscheidung: Option A - Separate Template-Datei**
- `template/photobook-template.html` existiert als separate Datei
- Beim Speichern wird diese via Fetch geladen und modifiziert
- `<script id="project-data">` Inhalt wird ersetzt
- Saubere Trennung zwischen Template und Code

### 3. Modul-System
**✓ Entscheidung: Option B - Klassische Script-Tags**
- Keine Build-Tools erforderlich
- Globale Variablen/Namespaces verwenden
- Namespace: `PhotobookEditor` als globales Objekt
- Einfach, funktioniert überall
- Scripts in korrekter Reihenfolge laden

---

## Nächste Schritte

Nachdem diese Fragen geklärt sind, können wir mit der Implementierung beginnen:

1. Projekt-Setup und Dateistruktur anlegen
2. HTML-Template erstellen
3. CSS-Layout implementieren
4. JavaScript-Module nacheinander umsetzen
5. Testen und iterieren

---

## Abgrenzung: Was ist NICHT in Phase 1

- ❌ Bilder zum Canvas hinzufügen (Phase 2)
- ❌ Textfelder erstellen (Phase 2)
- ❌ Elemente manipulieren (positionieren, skalieren) (Phase 2)
- ❌ Drehen, Zuschnitt, Masken (Phase 3)
- ❌ Hintergründe, Rahmen (Phase 3)
- ❌ PDF-Export / Drucken (Phase 4)
- ❌ Undo/Redo, Shortcuts (Phase 5)

Phase 1 ist bewusst schlank gehalten, um schnell ein funktionierendes Grundgerüst zu haben, auf dem wir aufbauen können.
