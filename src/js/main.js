// Haupteinstiegspunkt
// Namespace: PhotobookEditor
var PhotobookEditor = PhotobookEditor || {};

PhotobookEditor.App = (function() {
    'use strict';

    /**
     * Initialisiert die Anwendung
     */
    function init() {
        console.log('Fotobuch-Editor wird initialisiert...');

        // Prüfe ob Fabric.js geladen ist
        if (typeof fabric === 'undefined') {
            console.error('Fabric.js ist nicht geladen!');
            alert('Fehler: Fabric.js konnte nicht geladen werden. Bitte prüfen Sie die Internetverbindung.');
            return;
        }

        // Lade Projekt-Daten
        var projectData = PhotobookEditor.Core.Project.loadProjectData();
        console.log('Projekt geladen:', projectData.projectInfo.name);

        // Initialisiere UI-Komponenten
        PhotobookEditor.UI.Toolbar.init();
        PhotobookEditor.UI.PageOverview.init();
        PhotobookEditor.UI.PropertiesPanel.init();
        PhotobookEditor.UI.Statusbar.init();
        PhotobookEditor.UI.CanvasWorkspace.init();

        // Initialisiere Features
        PhotobookEditor.Features.ImageBrowser.init();
        PhotobookEditor.Features.ProjectConfig.init();

        // Erstelle erste Seite wenn keine vorhanden
        var pages = PhotobookEditor.Core.Project.getPages();
        if (pages.length === 0) {
            console.log('Erstelle erste Seite...');
            PhotobookEditor.Core.PageManager.addPage();
        } else {
            // Setze erste Seite als aktiv
            PhotobookEditor.Core.PageManager.setCurrentPage(pages[0].id);
        }

        // Warnung bei ungespeicherten Änderungen
        setupUnloadWarning();

        // Optional: Auto-Save alle 5 Minuten
        // setInterval(PhotobookEditor.Core.Storage.autoSave, 5 * 60 * 1000);

        console.log('Fotobuch-Editor erfolgreich initialisiert!');
        PhotobookEditor.UI.Statusbar.setStatusText('Bereit');
    }

    /**
     * Richtet Warnung bei ungespeicherten Änderungen ein
     */
    function setupUnloadWarning() {
        window.addEventListener('beforeunload', function(e) {
            // In Phase 1: Zeige immer Warnung
            // In späteren Phasen: Prüfe ob Änderungen vorhanden
            var message = 'Möchten Sie die Seite wirklich verlassen? Nicht gespeicherte Änderungen gehen verloren.';
            e.returnValue = message;
            return message;
        });
    }

    // Public API
    return {
        init: init
    };
})();

// App beim Laden der Seite starten
document.addEventListener('DOMContentLoaded', function() {
    PhotobookEditor.App.init();
});
