import * as Project from './project.js';

let currentPageId = null;
let pageChangeListeners = [];

/**
 * Generiert eine eindeutige Seiten-ID
 * @returns {string} Seiten-ID
 */
function generatePageId() {
    return 'page-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Erstellt eine neue leere Seite
 * @param {string} id - Optionale Seiten-ID
 * @returns {Object} Neue Seite
 */
export function createPage(id) {
    return {
        id: id || generatePageId(),
        background: {
            type: 'color',
            value: '#ffffff'
        },
        elements: []
    };
}

/**
 * Fügt eine neue Seite hinzu
 * @param {number} index - Position (optional, default: am Ende)
 * @returns {Object} Neue Seite
 */
export function addPage(index) {
    const pages = Project.getPages();
    const newPage = createPage();

    if (typeof index === 'number' && index >= 0 && index <= pages.length) {
        pages.splice(index, 0, newPage);
    } else {
        pages.push(newPage);
    }

    // Wenn erste Seite, setze als aktuelle Seite
    if (pages.length === 1) {
        currentPageId = newPage.id;
    }

    notifyPageChange();
    return newPage;
}

/**
 * Löscht eine Seite
 * @param {string} pageId - Seiten-ID
 * @returns {boolean} Erfolgreich gelöscht
 */
export function deletePage(pageId) {
    const pages = Project.getPages();
    const index = pages.findIndex(function (page) {
        return page.id === pageId;
    });

    if (index === -1) {
        return false;
    }

    // Bestätigung
    if (!confirm('Seite wirklich löschen?')) {
        return false;
    }

    pages.splice(index, 1);

    // Wenn aktuelle Seite gelöscht wurde, setze neue aktuelle Seite
    if (currentPageId === pageId) {
        if (pages.length > 0) {
            // Wähle vorherige oder erste Seite
            const newIndex = Math.max(0, index - 1);
            currentPageId = pages[newIndex].id;
        } else {
            currentPageId = null;
        }
    }

    notifyPageChange();
    return true;
}

/**
 * Gibt Seite per ID zurück
 * @param {string} pageId - Seiten-ID
 * @returns {Object|null} Seite
 */
export function getPageById(pageId) {
    const pages = Project.getPages();
    return pages.find(function (page) {
        return page.id === pageId;
    }) || null;
}

/**
 * Setzt die aktuelle Seite
 * @param {string} pageId - Seiten-ID
 */
export function setCurrentPage(pageId) {
    const page = getPageById(pageId);
    if (page) {
        currentPageId = pageId;
        notifyPageChange();
    }
}

/**
 * Gibt die aktuelle Seite zurück
 * @returns {Object|null} Aktuelle Seite
 */
export function getCurrentPage() {
    return currentPageId ? getPageById(currentPageId) : null;
}

/**
 * Gibt die aktuelle Seiten-ID zurück
 * @returns {string|null} Aktuelle Seiten-ID
 */
export function getCurrentPageId() {
    return currentPageId;
}

/**
 * Gibt den Index der aktuellen Seite zurück
 * @returns {number} Index (-1 wenn keine)
 */
export function getCurrentPageIndex() {
    if (!currentPageId) return -1;
    const pages = Project.getPages();
    return pages.findIndex(function (page) {
        return page.id === currentPageId;
    });
}

/**
 * Wechselt zur nächsten Seite
 */
export function nextPage() {
    const pages = Project.getPages();
    const currentIndex = getCurrentPageIndex();
    if (currentIndex < pages.length - 1) {
        setCurrentPage(pages[currentIndex + 1].id);
    }
}

/**
 * Wechselt zur vorherigen Seite
 */
export function previousPage() {
    const pages = Project.getPages();
    const currentIndex = getCurrentPageIndex();
    if (currentIndex > 0) {
        setCurrentPage(pages[currentIndex - 1].id);
    }
}

/**
 * Registriert einen Listener für Seitenänderungen
 * @param {Function} callback - Callback-Funktion
 */
export function onPageChange(callback) {
    pageChangeListeners.push(callback);
}

/**
 * Benachrichtigt alle Listener über Seitenänderungen
 */
function notifyPageChange() {
    pageChangeListeners.forEach(function (callback) {
        callback();
    });
}

