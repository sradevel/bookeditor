// Statusleiste
// Namespace: PhotobookEditor
var PhotobookEditor = PhotobookEditor || {};
PhotobookEditor.UI = PhotobookEditor.UI || {};

PhotobookEditor.UI.Statusbar = (function() {
    'use strict';

    var DOM = PhotobookEditor.Utils.DOM;
    var PageManager = PhotobookEditor.Core.PageManager;

    /**
     * Initialisiert die Statusleiste
     */
    function init() {
        PageManager.onPageChange(render);
        render();
    }

    /**
     * Rendert die Statusleiste
     */
    function render() {
        updatePageInfo();
    }

    /**
     * Aktualisiert Seiteninformationen
     */
    function updatePageInfo() {
        var pages = PhotobookEditor.Core.Project.getPages();
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
    function setStatusText(text) {
        var statusTextElement = DOM.getById('status-text');
        if (statusTextElement) {
            statusTextElement.textContent = text;
        }
    }

    // Public API
    return {
        init: init,
        render: render,
        setStatusText: setStatusText
    };
})();
