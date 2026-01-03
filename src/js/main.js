import * as Project from './core/project.js';
import * as PageManager from './core/page.js';
import * as Toolbar from './ui/toolbar.js';
import * as PageOverview from './ui/page-overview.js';
import * as PropertiesPanel from './ui/properties-panel.js';
import * as Statusbar from './ui/statusbar.js';
import * as CanvasWorkspace from './ui/canvas-workspace.js';
import * as ImageBrowser from './features/image-browser.js';
import * as ProjectConfig from './features/project-config.js';
// Storage import is not explicitly used here but might be needed if auto-save is uncommented.
// import * as Storage from './core/storage.js';

/**
 * Initialisiert die Anwendung
 */
export function init() {
    console.log('Fotobuch-Editor wird initialisiert...');

    // Prüfe ob Fabric.js geladen ist
    if (typeof fabric === 'undefined') {
        console.error('Fabric.js ist nicht geladen!');
        alert('Fehler: Fabric.js konnte nicht geladen werden. Bitte prüfen Sie die Internetverbindung.');
        return;
    }

    // Lade Projekt-Daten
    var projectData = Project.loadProjectData();
    console.log('Projekt geladen:', projectData.projectInfo.name);

    // Initialisiere UI-Komponenten
    Toolbar.init();
    PageOverview.init();
    PropertiesPanel.init();
    Statusbar.init();
    CanvasWorkspace.init();

    // Initialisiere Features
    ImageBrowser.init();
    ProjectConfig.init();

    // Erstelle erste Seite wenn keine vorhanden
    var pages = Project.getPages();
    if (pages.length === 0) {
        console.log('Erstelle erste Seite...');
        PageManager.addPage();
    } else {
        // Setze erste Seite als aktiv
        PageManager.setCurrentPage(pages[0].id);
    }

    // Warnung bei ungespeicherten Änderungen
    setupUnloadWarning();

    // Optional: Auto-Save alle 5 Minuten
    // setInterval(Storage.autoSave, 5 * 60 * 1000);

    console.log('Fotobuch-Editor erfolgreich initialisiert!');
    Statusbar.setStatusText('Bereit');
}

/**
 * Richtet Warnung bei ungespeicherten Änderungen ein
 */
function setupUnloadWarning() {
    window.addEventListener('beforeunload', function (e) {
        // In Phase 1: Zeige immer Warnung
        // In späteren Phasen: Prüfe ob Änderungen vorhanden
        var message = 'Möchten Sie die Seite wirklich verlassen? Nicht gespeicherte Änderungen gehen verloren.';
        e.returnValue = message;
        return message;
    });
}

// App beim Laden der Seite starten
// Note: When using type="module", DOMContentLoaded might have already fired or the script executes deferred.
// It is safer to call init() directly if using <script type="module" src="..."> or wait for DOMContentLoaded if unsure.
// Since modules are deferred by default, we can just call it (or use the listener).
document.addEventListener('DOMContentLoaded', function () {
    init();
});
