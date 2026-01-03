// Projekt-Konfiguration
// Namespace: PhotobookEditor
var PhotobookEditor = PhotobookEditor || {};
PhotobookEditor.Features = PhotobookEditor.Features || {};

PhotobookEditor.Features.ProjectConfig = (function() {
    'use strict';

    var DOM = PhotobookEditor.Utils.DOM;

    /**
     * Initialisiert die Projekt-Konfiguration
     */
    function init() {
        setupEventListeners();
    }

    /**
     * Richtet Event-Listener ein
     */
    function setupEventListeners() {
        // Modal Close Button
        var modal = DOM.getById('modal-project-config');
        if (modal) {
            var closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', close);
            }

            // Click außerhalb Modal schließt es
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    close();
                }
            });
        }

        // Cancel Button
        var btnCancel = DOM.getById('btn-config-cancel');
        if (btnCancel) {
            btnCancel.addEventListener('click', close);
        }

        // Save Button
        var btnSave = DOM.getById('btn-config-save');
        if (btnSave) {
            btnSave.addEventListener('click', handleSave);
        }

        // Format-Auswahl
        var selectFormat = DOM.getById('select-page-format');
        if (selectFormat) {
            selectFormat.addEventListener('change', handleFormatChange);
        }
    }

    /**
     * Öffnet den Konfigurations-Dialog
     */
    function open() {
        loadCurrentConfig();
        DOM.showModal('modal-project-config');
    }

    /**
     * Schließt den Konfigurations-Dialog
     */
    function close() {
        DOM.hideModal('modal-project-config');
    }

    /**
     * Lädt aktuelle Konfiguration in Formular
     */
    function loadCurrentConfig() {
        var projectInfo = PhotobookEditor.Core.Project.getProjectInfo();
        var pageFormat = PhotobookEditor.Core.Project.getPageFormat();

        if (!projectInfo || !pageFormat) return;

        // Projekt-Name
        var inputName = DOM.getById('input-project-name');
        if (inputName) {
            inputName.value = projectInfo.name;
        }

        // Seitenformat
        var selectFormat = DOM.getById('select-page-format');
        if (selectFormat) {
            selectFormat.value = getFormatValue(pageFormat);
        }

        // Custom Format Inputs
        var inputWidth = DOM.getById('input-page-width');
        var inputHeight = DOM.getById('input-page-height');
        if (inputWidth && inputHeight) {
            inputWidth.value = pageFormat.width;
            inputHeight.value = pageFormat.height;
        }

        // Seitenrand
        var inputMargin = DOM.getById('input-margin');
        if (inputMargin) {
            inputMargin.value = pageFormat.margins.top; // Alle Ränder gleich
        }

        // Anschnitt
        var inputBleed = DOM.getById('input-bleed');
        if (inputBleed) {
            inputBleed.value = pageFormat.bleed;
        }

        handleFormatChange();
    }

    /**
     * Gibt Format-Wert für Dropdown zurück
     * @param {Object} format - Seitenformat
     * @returns {string} Format-Wert
     */
    function getFormatValue(format) {
        var w = format.width;
        var h = format.height;

        if (w === 297 && h === 210) return 'a4-landscape';
        if (w === 210 && h === 297) return 'a4-portrait';
        if (w === 300 && h === 300) return 'square-30';
        if (w === 210 && h === 210) return 'square-21';
        if (w === 279 && h === 216) return 'letter-landscape';
        if (w === 216 && h === 279) return 'letter-portrait';

        return 'custom';
    }

    /**
     * Handler für Format-Änderung
     */
    function handleFormatChange() {
        var selectFormat = DOM.getById('select-page-format');
        var customInputs = DOM.getById('custom-format-inputs');

        if (!selectFormat || !customInputs) return;

        var format = selectFormat.value;

        if (format === 'custom') {
            customInputs.style.display = 'block';
        } else {
            customInputs.style.display = 'none';

            // Setze vordefinierte Werte
            var dimensions = getFormatDimensions(format);
            var inputWidth = DOM.getById('input-page-width');
            var inputHeight = DOM.getById('input-page-height');
            if (inputWidth && inputHeight && dimensions) {
                inputWidth.value = dimensions.width;
                inputHeight.value = dimensions.height;
            }
        }
    }

    /**
     * Gibt Dimensionen für vordefiniertes Format zurück
     * @param {string} format - Format-Wert
     * @returns {Object} {width, height}
     */
    function getFormatDimensions(format) {
        var formats = {
            'a4-landscape': { width: 297, height: 210 },
            'a4-portrait': { width: 210, height: 297 },
            'square-30': { width: 300, height: 300 },
            'square-21': { width: 210, height: 210 },
            'letter-landscape': { width: 279, height: 216 },
            'letter-portrait': { width: 216, height: 279 }
        };

        return formats[format] || null;
    }

    /**
     * Speichert Konfiguration
     */
    function handleSave() {
        var inputName = DOM.getById('input-project-name');
        var inputWidth = DOM.getById('input-page-width');
        var inputHeight = DOM.getById('input-page-height');
        var inputMargin = DOM.getById('input-margin');
        var inputBleed = DOM.getById('input-bleed');

        if (!inputName || !inputWidth || !inputHeight || !inputMargin || !inputBleed) {
            return;
        }

        // Validierung
        var width = parseInt(inputWidth.value);
        var height = parseInt(inputHeight.value);
        var margin = parseInt(inputMargin.value);
        var bleed = parseInt(inputBleed.value);

        if (width < 100 || width > 500) {
            alert('Breite muss zwischen 100mm und 500mm liegen.');
            return;
        }

        if (height < 100 || height > 500) {
            alert('Höhe muss zwischen 100mm und 500mm liegen.');
            return;
        }

        if (margin < 0 || margin > 50) {
            alert('Seitenrand muss zwischen 0mm und 50mm liegen.');
            return;
        }

        if (bleed < 0 || bleed > 10) {
            alert('Anschnitt muss zwischen 0mm und 10mm liegen.');
            return;
        }

        // Warnung wenn sich Format ändert
        var currentFormat = PhotobookEditor.Core.Project.getPageFormat();
        if (currentFormat.width !== width || currentFormat.height !== height) {
            if (!confirm('Seitenformat ändern? Bestehende Elemente könnten außerhalb der neuen Größe liegen.')) {
                return;
            }
        }

        // Speichere Änderungen
        PhotobookEditor.Core.Project.updateProjectInfo({
            name: inputName.value
        });

        PhotobookEditor.Core.Project.updatePageFormat({
            width: width,
            height: height,
            margins: {
                top: margin,
                right: margin,
                bottom: margin,
                left: margin
            },
            bleed: bleed
        });

        // Aktualisiere Canvas-Größe
        PhotobookEditor.UI.CanvasWorkspace.updateCanvasSize();

        // Aktualisiere UI
        PhotobookEditor.UI.PropertiesPanel.render();

        close();
    }

    // Public API
    return {
        init: init,
        open: open,
        close: close
    };
})();
