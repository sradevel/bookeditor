// Eigenschaften-Panel (Sidebar rechts)
// Namespace: PhotobookEditor
var PhotobookEditor = PhotobookEditor || {};
PhotobookEditor.UI = PhotobookEditor.UI || {};

PhotobookEditor.UI.PropertiesPanel = (function() {
    'use strict';

    var DOM = PhotobookEditor.Utils.DOM;
    var PageManager = PhotobookEditor.Core.PageManager;
    var currentSelectedObject = null;

    /**
     * Initialisiert das Eigenschaften-Panel
     */
    function init() {
        PageManager.onPageChange(render);
        setupCanvasListeners();
        setupFormListeners();
        render();
    }

    /**
     * Richtet Canvas-Listener ein
     */
    function setupCanvasListeners() {
        // Warte bis Canvas initialisiert ist
        setTimeout(function() {
            var canvas = PhotobookEditor.UI.CanvasWorkspace.getCanvas();
            if (canvas) {
                canvas.on('selection:created', handleSelectionChange);
                canvas.on('selection:updated', handleSelectionChange);
                canvas.on('selection:cleared', handleSelectionClear);
            }
        }, 100);
    }

    /**
     * Richtet Form-Listener ein
     */
    function setupFormListeners() {
        // Font Family
        var fontFamily = DOM.getById('prop-font-family');
        if (fontFamily) {
            fontFamily.addEventListener('change', function() {
                if (currentSelectedObject && currentSelectedObject.elementType === 'text') {
                    currentSelectedObject.set('fontFamily', this.value);
                    currentSelectedObject.canvas.renderAll();
                }
            });
        }

        // Font Size
        var fontSize = DOM.getById('prop-font-size');
        if (fontSize) {
            fontSize.addEventListener('input', function() {
                if (currentSelectedObject && currentSelectedObject.elementType === 'text') {
                    var displayScale = currentSelectedObject.canvas.displayScale || 0.5;
                    currentSelectedObject.set('fontSize', parseInt(this.value) * displayScale);
                    currentSelectedObject.canvas.renderAll();
                }
            });
        }

        // Text Color
        var textColor = DOM.getById('prop-text-color');
        if (textColor) {
            textColor.addEventListener('input', function() {
                if (currentSelectedObject && currentSelectedObject.elementType === 'text') {
                    currentSelectedObject.set('fill', this.value);
                    currentSelectedObject.canvas.renderAll();
                }
            });
        }

        // Bold
        var btnBold = DOM.getById('prop-text-bold');
        if (btnBold) {
            btnBold.addEventListener('click', function() {
                if (currentSelectedObject && currentSelectedObject.elementType === 'text') {
                    var currentWeight = currentSelectedObject.fontWeight;
                    var newWeight = currentWeight === 'bold' ? 'normal' : 'bold';
                    currentSelectedObject.set('fontWeight', newWeight);
                    currentSelectedObject.canvas.renderAll();
                    updateTextFormatting();
                }
            });
        }

        // Italic
        var btnItalic = DOM.getById('prop-text-italic');
        if (btnItalic) {
            btnItalic.addEventListener('click', function() {
                if (currentSelectedObject && currentSelectedObject.elementType === 'text') {
                    var currentStyle = currentSelectedObject.fontStyle;
                    var newStyle = currentStyle === 'italic' ? 'normal' : 'italic';
                    currentSelectedObject.set('fontStyle', newStyle);
                    currentSelectedObject.canvas.renderAll();
                    updateTextFormatting();
                }
            });
        }

        // Underline
        var btnUnderline = DOM.getById('prop-text-underline');
        if (btnUnderline) {
            btnUnderline.addEventListener('click', function() {
                if (currentSelectedObject && currentSelectedObject.elementType === 'text') {
                    var currentUnderline = currentSelectedObject.underline;
                    currentSelectedObject.set('underline', !currentUnderline);
                    currentSelectedObject.canvas.renderAll();
                    updateTextFormatting();
                }
            });
        }
    }

    /**
     * Handler für Selektion-Änderung
     */
    function handleSelectionChange(e) {
        var activeObject = e.selected && e.selected[0];
        if (activeObject) {
            currentSelectedObject = activeObject;
            showElementProperties(activeObject);
        }
    }

    /**
     * Handler für Selektion-Clear
     */
    function handleSelectionClear() {
        currentSelectedObject = null;
        hideElementProperties();
    }

    /**
     * Zeigt Element-Eigenschaften
     */
    function showElementProperties(obj) {
        var elementProps = DOM.getById('element-properties');
        var textFormatting = DOM.getById('text-formatting');

        if (!elementProps || !textFormatting) return;

        elementProps.style.display = 'block';

        // Element-Typ
        var typeElement = DOM.getById('prop-element-type');
        if (typeElement) {
            typeElement.textContent = obj.elementType === 'image' ? 'Bild' : 'Text';
        }

        // Text-Formatierung anzeigen wenn Textfeld
        if (obj.elementType === 'text') {
            textFormatting.style.display = 'block';
            updateTextFormatting();
        } else {
            textFormatting.style.display = 'none';
        }
    }

    /**
     * Versteckt Element-Eigenschaften
     */
    function hideElementProperties() {
        var elementProps = DOM.getById('element-properties');
        if (elementProps) {
            elementProps.style.display = 'none';
        }
    }

    /**
     * Aktualisiert Text-Formatierungs-Controls
     */
    function updateTextFormatting() {
        if (!currentSelectedObject || currentSelectedObject.elementType !== 'text') return;

        var displayScale = currentSelectedObject.canvas.displayScale || 0.5;

        // Font Family
        var fontFamily = DOM.getById('prop-font-family');
        if (fontFamily) {
            fontFamily.value = currentSelectedObject.fontFamily || 'Arial';
        }

        // Font Size
        var fontSize = DOM.getById('prop-font-size');
        if (fontSize) {
            fontSize.value = Math.round((currentSelectedObject.fontSize || 16) / displayScale);
        }

        // Text Color
        var textColor = DOM.getById('prop-text-color');
        if (textColor) {
            textColor.value = currentSelectedObject.fill || '#000000';
        }

        // Button-Styles
        var btnBold = DOM.getById('prop-text-bold');
        var btnItalic = DOM.getById('prop-text-italic');
        var btnUnderline = DOM.getById('prop-text-underline');

        if (btnBold) {
            btnBold.style.opacity = currentSelectedObject.fontWeight === 'bold' ? '1' : '0.5';
        }
        if (btnItalic) {
            btnItalic.style.opacity = currentSelectedObject.fontStyle === 'italic' ? '1' : '0.5';
        }
        if (btnUnderline) {
            btnUnderline.style.opacity = currentSelectedObject.underline ? '1' : '0.5';
        }
    }

    /**
     * Rendert das Eigenschaften-Panel
     */
    function render() {
        updateProjectProperties();
        hideElementProperties();
    }

    /**
     * Aktualisiert Projekt-Eigenschaften
     */
    function updateProjectProperties() {
        var projectInfo = PhotobookEditor.Core.Project.getProjectInfo();
        var pageFormat = PhotobookEditor.Core.Project.getPageFormat();

        if (!projectInfo || !pageFormat) return;

        // Projekt-Name
        var nameElement = DOM.getById('prop-project-name');
        if (nameElement) {
            nameElement.textContent = projectInfo.name;
        }

        // Seitenformat-Name
        var formatElement = DOM.getById('prop-page-format');
        if (formatElement) {
            formatElement.textContent = getFormatName(pageFormat);
        }

        // Seitengröße
        var sizeElement = DOM.getById('prop-page-size');
        if (sizeElement) {
            sizeElement.textContent = pageFormat.width + ' x ' + pageFormat.height + ' mm';
        }

        // DPI
        var dpiElement = DOM.getById('prop-dpi');
        if (dpiElement) {
            dpiElement.textContent = pageFormat.dpi + ' DPI';
        }
    }

    /**
     * Gibt einen lesbaren Format-Namen zurück
     * @param {Object} format - Seitenformat
     * @returns {string} Format-Name
     */
    function getFormatName(format) {
        var w = format.width;
        var h = format.height;

        if (w === 297 && h === 210) return 'A4 Querformat';
        if (w === 210 && h === 297) return 'A4 Hochformat';
        if (w === 300 && h === 300) return 'Quadratisch 30x30 cm';
        if (w === 210 && h === 210) return 'Quadratisch 21x21 cm';
        if (w === 279 && h === 216) return 'US Letter Querformat';
        if (w === 216 && h === 279) return 'US Letter Hochformat';

        return 'Benutzerdefiniert';
    }

    // Public API
    return {
        init: init,
        render: render
    };
})();
