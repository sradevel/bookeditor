// Canvas-Workspace
// Namespace: PhotobookEditor
var PhotobookEditor = PhotobookEditor || {};
PhotobookEditor.UI = PhotobookEditor.UI || {};

PhotobookEditor.UI.CanvasWorkspace = (function() {
    'use strict';

    var Units = PhotobookEditor.Utils.Units;
    var PageManager = PhotobookEditor.Core.PageManager;
    var canvas = null;

    /**
     * Initialisiert den Canvas-Workspace
     */
    function init() {
        initCanvas();
        PageManager.onPageChange(renderCurrentPage);
        renderCurrentPage();
    }

    /**
     * Initialisiert Fabric.js Canvas
     */
    function initCanvas() {
        var canvasElement = document.getElementById('canvas');
        if (!canvasElement) {
            console.error('Canvas-Element nicht gefunden');
            return;
        }

        canvas = new fabric.Canvas('canvas', {
            backgroundColor: '#ffffff',
            selection: true,
            preserveObjectStacking: true
        });

        updateCanvasSize();
        setupCanvasEvents();
    }

    /**
     * Richtet Canvas-Event-Listener ein
     */
    function setupCanvasEvents() {
        if (!canvas) return;

        // Speichere Änderungen bei Object-Modifikationen
        canvas.on('object:modified', function() {
            saveCurrentPageElements();
        });

        canvas.on('object:added', function() {
            saveCurrentPageElements();
        });

        canvas.on('object:removed', function() {
            saveCurrentPageElements();
        });

        // Tastatur-Events
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                deleteSelectedObjects();
            }
        });
    }

    /**
     * Löscht ausgewählte Objekte
     */
    function deleteSelectedObjects() {
        if (!canvas) return;

        var activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
            activeObjects.forEach(function(obj) {
                canvas.remove(obj);
            });
            canvas.discardActiveObject();
            canvas.renderAll();
        }
    }

    /**
     * Aktualisiert Canvas-Größe basierend auf Seitenformat
     */
    function updateCanvasSize() {
        if (!canvas) return;

        var pageFormat = PhotobookEditor.Core.Project.getPageFormat();
        if (!pageFormat) return;

        var dpi = pageFormat.dpi;
        var widthPx = Units.mmToPx(pageFormat.width, dpi);
        var heightPx = Units.mmToPx(pageFormat.height, dpi);

        // Skaliere für Display (zu groß bei 300 DPI)
        var displayScale = 0.5; // 50% für bessere Ansicht
        var displayWidth = Math.round(widthPx * displayScale);
        var displayHeight = Math.round(heightPx * displayScale);

        canvas.setDimensions({
            width: displayWidth,
            height: displayHeight
        });

        // Speichere Original-Größe für Export
        canvas.originalWidth = widthPx;
        canvas.originalHeight = heightPx;
        canvas.displayScale = displayScale;
    }

    /**
     * Rendert die aktuelle Seite
     */
    function renderCurrentPage() {
        if (!canvas) return;

        var currentPage = PageManager.getCurrentPage();
        if (!currentPage) {
            clearCanvas();
            return;
        }

        renderPage(currentPage);
    }

    /**
     * Rendert eine Seite
     * @param {Object} page - Seite
     */
    function renderPage(page) {
        if (!canvas) return;

        // Canvas leeren
        canvas.clear();

        // Hintergrund setzen
        if (page.background) {
            if (page.background.type === 'color') {
                canvas.backgroundColor = page.background.value;
            }
            // Bild-Hintergrund wird in Phase 3 implementiert
        }

        // Elemente rendern
        if (page.elements && page.elements.length > 0) {
            page.elements.forEach(function(element) {
                renderElement(element);
            });
        }

        canvas.renderAll();
    }

    /**
     * Rendert ein einzelnes Element
     * @param {Object} elementData - Element-Daten
     */
    function renderElement(elementData) {
        if (!canvas) return;

        var displayScale = canvas.displayScale || 0.5;

        if (elementData.type === 'image') {
            fabric.Image.fromURL(elementData.src, function(img) {
                img.set({
                    left: elementData.x * displayScale,
                    top: elementData.y * displayScale,
                    scaleX: elementData.scaleX || (elementData.width / img.width * displayScale),
                    scaleY: elementData.scaleY || (elementData.height / img.height * displayScale),
                    angle: elementData.angle || 0,
                    imagePath: elementData.src,
                    elementType: 'image',
                    id: elementData.id
                });

                canvas.add(img);
                canvas.renderAll();
            });
        } else if (elementData.type === 'text') {
            var text = new fabric.IText(elementData.content, {
                left: elementData.x * displayScale,
                top: elementData.y * displayScale,
                fontSize: (elementData.style.fontSize || 16) * displayScale,
                fontFamily: elementData.style.fontFamily || 'Arial',
                fontWeight: elementData.style.fontWeight || 'normal',
                fontStyle: elementData.style.fontStyle || 'normal',
                textAlign: elementData.style.textAlign || 'left',
                fill: elementData.style.fill || '#000000',
                angle: elementData.angle || 0,
                elementType: 'text',
                id: elementData.id
            });

            canvas.add(text);
        }
    }

    /**
     * Löscht den Canvas
     */
    function clearCanvas() {
        if (canvas) {
            canvas.clear();
            canvas.backgroundColor = '#ffffff';
            canvas.renderAll();
        }
    }

    /**
     * Fügt ein Bild zum Canvas hinzu
     * @param {string} imagePath - Pfad zum Bild
     */
    function addImage(imagePath) {
        if (!canvas) return;

        fabric.Image.fromURL(imagePath, function(img) {
            // Skaliere Bild für Display
            var displayScale = canvas.displayScale || 0.5;

            // Setze Bild-Größe (max 300x300 px Display-Größe)
            var maxSize = 300;
            var scale = Math.min(maxSize / img.width, maxSize / img.height, 1) * displayScale;

            img.scale(scale);

            // Positioniere in der Mitte
            img.set({
                left: canvas.width / 2,
                top: canvas.height / 2,
                originX: 'center',
                originY: 'center'
            });

            // Speichere Original-Pfad als custom property
            img.set('imagePath', imagePath);
            img.set('elementType', 'image');

            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();

            // Speichere in Seiten-Daten
            saveCurrentPageElements();
        });
    }

    /**
     * Speichert aktuelle Canvas-Elemente in Seiten-Daten
     */
    function saveCurrentPageElements() {
        var currentPage = PageManager.getCurrentPage();
        if (!currentPage || !canvas) return;

        var elements = [];
        var displayScale = canvas.displayScale || 0.5;

        canvas.getObjects().forEach(function(obj) {
            if (obj.elementType === 'image') {
                elements.push({
                    type: 'image',
                    id: obj.id || 'img-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                    src: obj.imagePath,
                    srcType: 'path',
                    x: obj.left / displayScale,
                    y: obj.top / displayScale,
                    width: obj.getScaledWidth() / displayScale,
                    height: obj.getScaledHeight() / displayScale,
                    scaleX: obj.scaleX,
                    scaleY: obj.scaleY,
                    angle: obj.angle || 0,
                    zIndex: canvas.getObjects().indexOf(obj)
                });
            } else if (obj.elementType === 'text') {
                elements.push({
                    type: 'text',
                    id: obj.id || 'text-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                    content: obj.text,
                    x: obj.left / displayScale,
                    y: obj.top / displayScale,
                    width: obj.width / displayScale,
                    height: obj.height / displayScale,
                    angle: obj.angle || 0,
                    zIndex: canvas.getObjects().indexOf(obj),
                    style: {
                        fontFamily: obj.fontFamily,
                        fontSize: obj.fontSize / displayScale,
                        fontWeight: obj.fontWeight,
                        fontStyle: obj.fontStyle,
                        textAlign: obj.textAlign,
                        fill: obj.fill
                    }
                });
            }
        });

        currentPage.elements = elements;
    }

    /**
     * Gibt das Fabric.js Canvas-Objekt zurück
     * @returns {fabric.Canvas} Canvas
     */
    function getCanvas() {
        return canvas;
    }

    /**
     * Fügt ein Textfeld zum Canvas hinzu
     */
    function addText() {
        if (!canvas) return;

        var displayScale = canvas.displayScale || 0.5;

        var text = new fabric.IText('Text eingeben...', {
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center',
            fontSize: 24 * displayScale,
            fontFamily: 'Arial',
            fill: '#000000',
            elementType: 'text'
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        text.selectAll();
        canvas.renderAll();

        saveCurrentPageElements();
    }

    // Public API
    return {
        init: init,
        renderCurrentPage: renderCurrentPage,
        updateCanvasSize: updateCanvasSize,
        addImage: addImage,
        addText: addText,
        getCanvas: getCanvas
    };
})();
