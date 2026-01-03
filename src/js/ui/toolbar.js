// Toolbar
// Namespace: PhotobookEditor
var PhotobookEditor = PhotobookEditor || {};
PhotobookEditor.UI = PhotobookEditor.UI || {};

PhotobookEditor.UI.Toolbar = (function() {
    'use strict';

    var DOM = PhotobookEditor.Utils.DOM;

    /**
     * Initialisiert die Toolbar
     */
    function init() {
        setupEventListeners();
    }

    /**
     * Richtet Event-Listener ein
     */
    function setupEventListeners() {
        // Speichern-Button
        var btnSave = DOM.getById('btn-save');
        if (btnSave) {
            btnSave.addEventListener('click', handleSave);
        }

        // Projekt-Einstellungen-Button
        var btnConfig = DOM.getById('btn-project-config');
        if (btnConfig) {
            btnConfig.addEventListener('click', handleProjectConfig);
        }

        // Text hinzufügen-Button
        var btnAddText = DOM.getById('btn-add-text');
        if (btnAddText) {
            btnAddText.addEventListener('click', handleAddText);
        }

        // Keyboard-Shortcut: Strg+S zum Speichern
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        });
    }

    /**
     * Speichern-Handler
     */
    function handleSave() {
        PhotobookEditor.Core.Storage.saveProject();
    }

    /**
     * Projekt-Einstellungen-Handler
     */
    function handleProjectConfig() {
        PhotobookEditor.Features.ProjectConfig.open();
    }

    /**
     * Text hinzufügen-Handler
     */
    function handleAddText() {
        PhotobookEditor.UI.CanvasWorkspace.addText();
    }

    // Public API
    return {
        init: init
    };
})();
