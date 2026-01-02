# Fotobuch-Editor Spezifikation

## Übersicht
Ein leichtgewichtiger, browserbasieter Fotobuch-Editor, der vollständig offline funktioniert und als einzelne HTML-Datei ausgeliefert wird.

## Technische Anforderungen

### Architektur
- **Hauptdatei**: Einzelne HTML-Datei pro Buch-Projekt
- **JavaScript**: Kann in separate Dateien ausgelagert werden
- **Offline-Fähigkeit**: Keine Internetverbindung erforderlich
- **Browser-Kompatibilität**: Primär für Chrome/Chromium-basierte Browser optimiert (Chrome, Edge, Brave, etc.)

### Dateistruktur
```
project-folder/
├── photobook.html        # Haupt-HTML-Datei (das Buch-Projekt)
├── js/                   # Optional: Separate JS-Dateien
│   ├── editor.js
│   └── ...
└── images/               # Foto-Verzeichnis (vom Benutzer verwaltet)
    ├── photo1.jpg
    ├── photo2.png
    └── ...
```

### Setup & Verwendung

#### Lokaler Webserver starten (empfohlen)
Für die optimale Nutzung sollte ein lokaler Webserver gestartet werden. Dies ermöglicht:
- Automatisches Laden von Bildern aus dem `images/` Ordner
- Kleine Projektdateien (nur Pfad-Referenzen)
- Einfache Bild-Verwaltung

**Setup-Schritte**:

1. **Projekt-Ordner erstellen**:
   ```
   mkdir mein-fotobuch
   cd mein-fotobuch
   mkdir images
   ```

2. **Bilder in den images/ Ordner kopieren**

3. **Webserver starten** (eine der folgenden Optionen):

   **Python** (meist vorinstalliert auf Mac/Linux):
   ```bash
   python -m http.server 8000
   # oder
   python3 -m http.server 8000
   ```

   **Node.js** (wenn installiert):
   ```bash
   npx serve
   # oder
   npx http-server
   ```

   **PHP** (wenn installiert):
   ```bash
   php -S localhost:8000
   ```

   **VS Code** (wenn installiert):
   - Live Server Extension installieren
   - Rechtsklick auf photobook.html → "Open with Live Server"

4. **Browser öffnen**:
   ```
   http://localhost:8000/photobook.html
   ```

#### Alternative: Ohne Webserver (mit Einschränkungen)
Falls kein Webserver verwendet wird:
- Bilder müssen per Drag & Drop oder File-Dialog hochgeladen werden
- Bilder werden als Base64 in die HTML-Datei eingebettet
- Projektdateien werden größer (können mehrere MB erreichen)

## Funktionale Anforderungen

### 1. Projekt-Konfiguration

#### 1.1 Seitenformat
- **Vordefinierte Formate**:
  - A4 Querformat (297 x 210 mm)
  - A4 Hochformat (210 x 297 mm)
  - Quadratisch 30x30 cm
  - Quadratisch 21x21 cm
  - US Letter Querformat (279 x 216 mm)
  - US Letter Hochformat (216 x 279 mm)
  
- **Benutzerdefiniertes Format**:
  - Eingabe von Breite und Höhe in mm
  - Validierung: Min. 100mm, Max. 500mm

#### 1.2 Druck-Einstellungen
- **Auflösung**: 300 DPI (fest)
- **Randeinstellungen**: Konfigurierbare Seitenränder (z.B. 5mm Standard)
- **Anschnitt**: Optional konfigurierbar (z.B. 3mm)

#### 1.3 Projekt-Metadaten
- Projekt-Name
- Erstellungsdatum
- Letzte Änderung
- Anzahl der Seiten

### 2. Seiten-Verwaltung

#### 2.1 Seiten-Operationen
- **Seite hinzufügen**: Neue leere Seite am Ende oder an bestimmter Position
- **Seite löschen**: Mit Bestätigungsdialog
- **Seiten umordnen**: Drag & Drop oder Pfeil-Buttons in Seitenübersicht
- **Seiten duplizieren**: Optional (Nice-to-have)

#### 2.2 Seitenübersicht
- Miniaturansicht aller Seiten
- Aktuelle Seite hervorgehoben
- Seitennummerierung
- Schnelle Navigation zwischen Seiten

### 3. Editor-Funktionen

#### 3.1 Bilder

##### Bilder Laden
**Primäre Methode (empfohlen)**:
- **Lokaler Webserver**: Die HTML-Datei wird über einen einfachen lokalen Webserver geöffnet
- Bilder können über relative Pfade referenziert werden: `images/photo.jpg`
- Vorteile:
  - Kleine Projektdateien (nur Pfad-Referenzen, keine eingebetteten Bilder)
  - Schnelles Laden und Bearbeiten
  - Einfacher Austausch von Bildern (Datei im Ordner ersetzen)
- **Webserver-Setup**: 
  - Python: `python -m http.server 8000` oder `python3 -m http.server 8000`
  - Node.js: `npx serve` oder `npx http-server`
  - PHP: `php -S localhost:8000`
  - Browser öffnen: `http://localhost:8000/photobook.html`

**Bilderverwaltung im Editor**:
- Automatisches Anzeigen verfügbarer Bilder aus `images/` Ordner
- Bild-Browser zum Durchsuchen und Hinzufügen von Bildern
- Thumbnails für bessere Übersicht

**Alternative Methode (ohne Webserver)**:
- **Drag & Drop**: Bilder direkt in den Editor ziehen
- **File-Input-Dialog**: Bilder über Dateiauswahl-Dialog hochladen
- **Hinweis**: In diesem Fall werden Bilder als Base64 Data-URLs im Projekt gespeichert
- **Verwendung**: Nützlich für schnelle Bearbeitung ohne Setup, aber größere Dateien

##### Bild-Manipulation
- **Positionieren**: Freie Positionierung auf der Seite (x, y Koordinaten)
- **Skalieren**: 
  - Freies Skalieren mit Maus/Touch
  - Proportionales Skalieren (Shift-Taste halten)
  - Numerische Eingabe (Breite/Höhe in mm oder %)
- **Drehen**: 
  - Freies Drehen mit Rotate-Handle
  - 90° Schritte per Button
  - Numerische Eingabe (Grad)
- **Zuschnitt/Masken**:
  - Rechteckiger Zuschnitt
  - Masken-Funktion für verschiedene Formen (Rechteck, Kreis, abgerundete Ecken)
- **Ebenen-Reihenfolge**: 
  - In den Vordergrund
  - In den Hintergrund
  - Eine Ebene nach vorne/hinten

#### 3.2 Textfelder

##### Text-Erstellung
- Textfeld durch Klick oder Ziehen erstellen
- Platzhaltertext initial

##### Text-Formatierung
- **Schriftart**: System-Schriften + Web-Safe Fonts
  - Arial, Times New Roman, Georgia, Verdana, etc.
- **Schriftgröße**: 6pt - 144pt
- **Schriftstil**: 
  - Fett
  - Kursiv
  - Unterstrichen
- **Ausrichtung**: Links, Zentriert, Rechts, Blocksatz
- **Textfarbe**: Farbwähler (Hex, RGB)
- **Zeilenhöhe**: Einstellbar

##### Text-Manipulation
- Gleiche Transformationen wie Bilder (Position, Skalierung, Drehung)
- Text editieren durch Doppelklick

#### 3.3 Hintergründe

- **Volltonfarbe**: Farbwähler für Seitenhintergrund
- **Bild als Hintergrund**: 
  - Bild laden (gleiche Methode wie normale Bilder)
  - Füll-Optionen: Ausfüllen, Einpassen, Kacheln, Strecken
- **Transparenz/Deckkraft**: Einstellbar

#### 3.4 Rahmen

- **Element-Rahmen**: 
  - Rahmen um Bilder und Textfelder
  - Rahmenfarbe
  - Rahmenstärke (0-20px)
  - Rahmenstil (durchgezogen, gestrichelt, gepunktet)
- **Schatten**: Optional
  - Schattenfarbe
  - Unschärfe
  - Versatz (x, y)

### 4. Benutzeroberfläche

#### 4.1 Layout
```
+--------------------------------------------------+
|  Toolbar (Datei, Bearbeiten, Seite, Hilfe)      |
+--------------------------------------------------+
|  Werkzeugleiste (Bild, Text, Hintergrund, etc.) |
+--------------------------------------------------+
|          |                              |        |
|  Seiten  |     Arbeitsfläche           | Eigen- |
|  Über-   |     (Canvas)                | schaf- |
|  sicht   |                              | ten    |
|   (L)    |                              |  (R)   |
|          |                              |        |
+--------------------------------------------------+
|  Statusleiste (Zoom, Seite X von Y)             |
+--------------------------------------------------+
```

#### 4.2 Werkzeugleiste
- Bild hinzufügen
- Text hinzufügen
- Hintergrund bearbeiten
- Seite hinzufügen/löschen
- Rückgängig/Wiederholen (Optional)
- Zoom-Steuerung
- Speichern
- Drucken/Exportieren

#### 4.3 Eigenschaften-Panel
- Zeigt Eigenschaften des ausgewählten Elements
- Kontextabhängige Optionen
- Numerische Eingaben für präzise Kontrolle

#### 4.4 Interaktion
- **Auswahl**: Klick auf Element
- **Mehrfachauswahl**: Strg/Cmd + Klick (Optional)
- **Verschieben**: Drag & Drop
- **Skalieren**: Anfasser an den Ecken/Kanten
- **Drehen**: Rotate-Handle am Element
- **Löschen**: Entf-Taste oder Kontextmenü

### 5. Speichern & Laden

#### 5.1 Speichermechanismus

**Primäre Methode (bevorzugt)**:
- **Selbstmodifizierende HTML**: 
  - Projekt-Daten werden in einem `<script type="application/json">` Tag in der HTML-Datei gespeichert
  - Beim Speichern wird die HTML-Datei mit aktualisierten Daten neu generiert und zum Download angeboten
  - Benutzer ersetzt die ursprüngliche Datei

**Alternative Methode (Fallback)**:
- **JSON-Export**:
  - Projekt wird als separate `.json` Datei exportiert
  - Import-Funktion zum Laden von `.json` Dateien
  - JSON-Struktur enthält alle Projekt-Daten

#### 5.2 Datenstruktur
```json
{
  "projectInfo": {
    "name": "Mein Fotobuch",
    "created": "2026-01-02T10:00:00Z",
    "modified": "2026-01-02T12:30:00Z",
    "version": "1.0"
  },
  "pageFormat": {
    "width": 297,
    "height": 210,
    "unit": "mm",
    "dpi": 300,
    "margins": {
      "top": 5,
      "right": 5,
      "bottom": 5,
      "left": 5
    },
    "bleed": 3
  },
  "pages": [
    {
      "id": "page-1",
      "background": {
        "type": "color",
        "value": "#ffffff"
      },
      "elements": [
        {
          "type": "image",
          "id": "img-1",
          "src": "images/photo1.jpg",
          "srcType": "path",
          "x": 50,
          "y": 50,
          "width": 100,
          "height": 100,
          "rotation": 0,
          "zIndex": 1,
          "crop": {
            "x": 0,
            "y": 0,
            "width": 100,
            "height": 100
          },
          "mask": "rectangle",
          "border": {
            "color": "#000000",
            "width": 1,
            "style": "solid"
          }
        },
        {
          "type": "text",
          "id": "text-1",
          "content": "Mein Text",
          "x": 150,
          "y": 150,
          "width": 200,
          "height": 50,
          "rotation": 0,
          "zIndex": 2,
          "style": {
            "fontFamily": "Arial",
            "fontSize": 16,
            "fontWeight": "normal",
            "fontStyle": "normal",
            "textDecoration": "none",
            "textAlign": "left",
            "color": "#000000",
            "lineHeight": 1.5
          },
          "border": {
            "color": "#000000",
            "width": 0,
            "style": "solid"
          }
        }
      ]
    }
  ]
}
```

**Hinweise zur Datenstruktur**:
- **srcType**: Definiert den Typ der Bild-Quelle
  - `"path"`: Relativer Pfad zu einer Bilddatei (empfohlen, z.B. `images/photo.jpg`)
  - `"dataurl"`: Base64-kodiertes Bild (z.B. `data:image/jpeg;base64,...`)
- **Empfehlung**: Verwende relative Pfade (`srcType: "path"`) für kleinere Projektdateien und einfachere Verwaltung
- **Fallback**: Base64 Data-URLs werden verwendet, wenn ohne Webserver gearbeitet wird

#### 5.3 Auto-Save
- Optional: Automatisches Speichern in localStorage alle X Minuten
- Warnung bei ungespeicherten Änderungen beim Verlassen der Seite

### 6. Export / Druck

#### 6.1 PDF-Export via Browser-Druckdialog

**Vorbereitung für Druck**:
- Spezielle Druckansicht wird generiert
- Alle Seiten werden in korrekter Größe und Auflösung dargestellt
- CSS @page Regeln für Seitenformat
- CSS @media print für Druckoptimierung

**Anforderungen**:
- **Pixelgenaue Ausgabe**: Elemente werden in der exakten Position und Größe gerendert
- **300 DPI Auflösung**: Bilder und Text in Druckqualität
- **Seitenumbrüche**: Jede Buchseite = eine PDF-Seite
- **Keine UI-Elemente**: Werkzeugleisten, Panels, etc. werden ausgeblendet
- **Randeinstellungen**: Gemäß Projekt-Konfiguration
- **Anschnitt**: Falls konfiguriert, wird berücksichtigt

**Workflow**:
1. Benutzer klickt auf "Drucken/Exportieren"
2. App wechselt in Druckansicht
3. Browser-Druckdialog öffnet sich
4. Benutzer wählt "Als PDF speichern" (Chrome) oder äquivalente Option
5. PDF wird heruntergeladen

**Technische Umsetzung**:
```css
@media print {
  /* Alle UI-Elemente ausblenden */
  .toolbar, .sidebar, .properties-panel {
    display: none !important;
  }
  
  /* Seitengröße festlegen */
  @page {
    size: 297mm 210mm; /* Beispiel: A4 Querformat */
    margin: 0;
  }
  
  /* Seiten-Container */
  .page {
    page-break-after: always;
    width: 297mm;
    height: 210mm;
    position: relative;
  }
  
  .page:last-child {
    page-break-after: auto;
  }
}
```

### 7. Zusatzfunktionen (Optional)

#### 7.1 Undo/Redo
- Befehlsmuster (Command Pattern) für alle Aktionen
- History-Stack (z.B. letzte 50 Aktionen)
- Keyboard-Shortcuts: Strg+Z, Strg+Y

#### 7.2 Raster & Hilfslinien
- Einblendbares Raster für präzise Positionierung
- Magnetisches Raster (Snap-to-Grid)
- Hilfslinien ziehen

#### 7.3 Tastatur-Shortcuts
- Strg+S: Speichern
- Strg+P: Drucken
- Strg+Z: Rückgängig
- Strg+Y: Wiederholen
- Entf: Element löschen
- Strg+D: Element duplizieren
- Pfeiltasten: Element verschieben (1px, +Shift: 10px)
- Strg+A: Alle Elemente auswählen

#### 7.4 Zoom
- Zoom-Stufen: 25%, 50%, 75%, 100%, 150%, 200%
- An Seitengröße anpassen
- Tastatur: Strg++ / Strg+-

## Nicht-Funktionale Anforderungen

### Performance
- Schnelles Laden und Reaktion auch bei 50+ Seiten
- Flüssiges Drag & Drop ohne Verzögerung
- Effizientes Rendering großer Bilder

### Usability
- Intuitive Bedienung
- Visuelles Feedback bei allen Aktionen
- Fehlertoleranz (Undo-Funktion)
- Hilfetext / Tooltips für wichtige Funktionen

### Datenintegrität
- Validierung von Benutzereingaben
- Fehlerbehandlung bei fehlerhaften Projekt-Dateien
- Warnung bei Datenverlust

### Browser-Kompatibilität
- **Primärer Fokus**: Chrome/Chromium 90+ (Chrome, Edge, Brave, Opera)
- **Sekundär**: Firefox 88+, Safari 14+ (nice-to-have, aber nicht kritisch)
- **Empfehlung**: Chrome verwenden für beste Ergebnisse beim PDF-Export

## Technologie-Stack (Empfehlung)

### HTML5
- Canvas API für Rendering (optional)
- File API für Datei-Upload
- LocalStorage API für Auto-Save

### CSS3
- Flexbox/Grid für Layout
- CSS Variables für Theming
- Print Media Queries für PDF-Export

### JavaScript (ES6+)
- Vanilla JS oder leichtgewichtige Libraries
- Keine schweren Frameworks (React, Vue, etc.) für bessere Performance
- Mögliche Libraries:
  - **Fabric.js**: Canvas-basierter Editor (empfohlen für Manipulation)
  - **html2canvas**: Für Screenshot/Rendering (falls benötigt)
  - Alternativ: Pure CSS/DOM-basiert mit Transform-Properties

### Datenspeicherung
- JSON für Projekt-Daten
- Relative Pfade für Bild-Referenzen (primäre Methode)
- Base64 Data-URLs für eingebettete Bilder (Fallback)

### Lokaler Webserver (erforderlich für optimale Nutzung)
- **Python**: `python -m http.server 8000` oder `python3 -m http.server 8000`
- **Node.js**: `npx serve` oder `npx http-server`
- **PHP**: `php -S localhost:8000`
- **Alternativ**: Visual Studio Code Live Server Extension

## Implementierungs-Phasen

### Phase 1: Grundgerüst (MVP)
- HTML-Struktur und UI-Layout
- Seitenverwaltung (Hinzufügen, Löschen, Navigation)
- Projekt-Konfiguration (Seitenformat)
- Grundlegendes Speichern/Laden
- Bild-Browser für images/ Ordner (mit Webserver)

### Phase 2: Editor-Funktionen
- Bilder hinzufügen, positionieren, skalieren
- Textfelder mit Basis-Formatierung
- Element-Auswahl und Manipulation
- Drag & Drop für Bilder

### Phase 3: Erweiterte Funktionen
- Drehen, Zuschnitt, Masken
- Erweiterte Text-Formatierung
- Hintergründe und Rahmen
- Ebenen-Verwaltung

### Phase 4: Export & Optimierung
- PDF-Export via Druckfunktion
- Performance-Optimierung
- Browser-Kompatibilität testen
- Bug-Fixes

### Phase 5: Polish (Optional)
- Undo/Redo
- Raster & Hilfslinien
- Keyboard-Shortcuts
- Seiten umordnen per Drag & Drop

## Offene Fragen / Risiken

### Bilder-Laden
- **Lösung**: Verwendung eines lokalen Webservers (Python, Node.js, PHP)
- **Vorteile**: 
  - Bilder können über relative Pfade referenziert werden
  - Kleine Projektdateien
  - Einfache Handhabung
- **Setup-Anleitung**: Dokumentation für verschiedene Webserver-Optionen bereitstellen
- **Fallback**: Drag & Drop / File-Input für Benutzer, die keinen Webserver verwenden möchten

### PDF-Qualität
- **Hinweis**: Exakte 300 DPI über Browser-Druckfunktion werden als nicht-kritisch betrachtet
- **Pragmatische Lösung**: Browser-Druckfunktion nutzen, moderne Browser liefern ausreichende Qualität
- **Best Practice**: Testdrucke empfehlen, um Ergebnis zu validieren

### Datei-Größe
- **Lösung**: Verwendung von relativen Bild-Pfaden statt Base64-Einbettung
- **Vorteil**: Projektdateien bleiben klein (typisch < 1 MB)
- **Hinweis**: Bei Verwendung von Drag & Drop (ohne Webserver) werden Bilder als Base64 eingebettet
  - In diesem Fall: Warnung anzeigen bei Projekten > 10 MB
  - Optional: Bildkompression anbieten

### Cross-Browser Kompatibilität
- **Hinweis**: Wird als nicht-kritisch betrachtet
- **Pragmatischer Ansatz**: Fokus auf einen primären Browser (z.B. Chrome/Chromium-basiert)
- **Vorteil**: Schnellere Entwicklung, weniger Komplexität
- **Empfehlung**: Dokumentieren, welcher Browser empfohlen wird

## Erfolgsmetriken

- Benutzer kann ein Fotobuch mit 20+ Seiten erstellen
- Export als PDF funktioniert mit ausreichender Qualität
- Speichern/Laden ohne Datenverlust
- Flüssige Bedienung (< 100ms Response-Zeit)
- Projekt-Datei < 1 MB (mit relativen Pfaden) bzw. < 50 MB (mit eingebetteten Bildern)

## Ausblick / Zukünftige Erweiterungen

- Vorlagen/Templates für Seiten-Layouts
- Foto-Effekte und Filter
- Mehrsprachigkeit
- Cloud-Synchronisation (optional)
- Kollaborative Bearbeitung
- Export in andere Formate (TIFF, JPG-Sequenz)
