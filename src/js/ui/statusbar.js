import { DOM } from '../utils/dom-helpers.js';
import * as PageManager from '../core/page.js';
import * as Project from '../core/project.js';

/**
 * Initialisiert die Statusleiste
 */
export function init() {
    PageManager.onPageChange(render);
    render();
}

/**
 * Rendert die Statusleiste
 */
export function render() {
    updatePageInfo();
}

/**
 * Aktualisiert Seiteninformationen
 */
function updatePageInfo() {
    var pages = Project.getPages();
    var currentIndex = PageManager.getCurrentPageIndex();
    var totalPages = pages.length;

    var pageInfoElement = DOM.getById('status-page-info');
    if (pageInfoElement) {
        if (totalPages === 0) {
            pageInfoElement.textContent = 'Keine Seiten';
        } else {
            pageInfoElement.textContent = 'Seite ' + (currentIndex + 1) + ' von ' + totalPages;
        }
    }
}

/**
 * Setzt Status-Text
 * @param {string} text - Status-Text
 */
export function setStatusText(text) {
    var statusTextElement = DOM.getById('status-text');
    if (statusTextElement) {
        statusTextElement.textContent = text;
    }
}

