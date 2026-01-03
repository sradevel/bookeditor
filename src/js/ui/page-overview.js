import { DOM } from '../utils/dom-helpers.js';
import * as PageManager from '../core/page.js';
import * as Project from '../core/project.js';

/**
 * Initialisiert die Seitenübersicht
 */
export function init() {
    setupEventListeners();
    PageManager.onPageChange(render);
    render();
}

/**
 * Richtet Event-Listener ein
 */
function setupEventListeners() {
    // Add Page Button in Tool Panel
    var btnAddPage = DOM.getById('btn-add-page');
    if (btnAddPage) {
        btnAddPage.addEventListener('click', handleAddPage);
    }

    // Delete Page Button
    var btnDeletePage = DOM.getById('btn-delete-page');
    if (btnDeletePage) {
        btnDeletePage.addEventListener('click', handleDeletePage);
    }
}

/**
 * Rendert die Seitenübersicht
 */
export function render() {
    var pageList = DOM.getById('page-list');
    if (!pageList) return;

    DOM.empty(pageList);

    var pages = Project.getPages();
    var currentPageId = PageManager.getCurrentPageId();

    if (pages.length === 0) {
        var placeholder = DOM.create('div', { class: 'empty-placeholder' }, 'Keine Seiten vorhanden. Klicken Sie auf "Neue Seite" um zu beginnen.');
        pageList.appendChild(placeholder);
        return;
    }

    pages.forEach(function (page, index) {
        var pageItem = createPageItem(page, index, page.id === currentPageId);
        pageList.appendChild(pageItem);
    });
}

/**
 * Erstellt ein Seiten-Item
 * @param {Object} page - Seite
 * @param {number} index - Index
 * @param {boolean} isActive - Ist aktive Seite
 * @returns {HTMLElement} Seiten-Element
 */
function createPageItem(page, index, isActive) {
    var pageItem = DOM.create('div', { class: 'page-item' });
    if (isActive) {
        DOM.addClass(pageItem, 'active');
    }

    // Thumbnail
    var thumbnail = DOM.create('div', { class: 'page-thumbnail' }, 'Seite ' + (index + 1));
    pageItem.appendChild(thumbnail);

    // Seitennummer
    var pageNumber = DOM.create('div', { class: 'page-number' }, 'Seite ' + (index + 1));
    pageItem.appendChild(pageNumber);

    // Click-Handler
    pageItem.addEventListener('click', function () {
        PageManager.setCurrentPage(page.id);
    });

    return pageItem;
}

/**
 * Neue Seite hinzufügen
 */
function handleAddPage() {
    PageManager.addPage();
}

/**
 * Aktuelle Seite löschen
 */
function handleDeletePage() {
    var currentPageId = PageManager.getCurrentPageId();
    if (currentPageId) {
        PageManager.deletePage(currentPageId);
    } else {
        alert('Keine Seite ausgewählt.');
    }
}

