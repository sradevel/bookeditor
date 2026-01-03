import { DOM } from '../utils/dom-helpers.js';
import * as Storage from '../core/storage.js';
import * as ProjectConfig from '../features/project-config.js';
import * as CanvasWorkspace from './canvas-workspace.js';

/**
 * Initialisiert die Toolbar
 */
export function init() {
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
    document.addEventListener('keydown', function (e) {
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
    Storage.saveProject();
}

/**
 * Projekt-Einstellungen-Handler
 */
function handleProjectConfig() {
    ProjectConfig.open();
}

/**
 * Text hinzufügen-Handler
 */
function handleAddText() {
    CanvasWorkspace.addText();
}

