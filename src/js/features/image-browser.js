import { DOM } from '../utils/dom-helpers.js';
import * as CanvasWorkspace from '../ui/canvas-workspace.js';

let selectedImages = [];

/**
 * Initialisiert den Bild-Browser
 */
export function init() {
    setupEventListeners();
}

/**
 * Richtet Event-Listener ein
 */
function setupEventListeners() {
    // Add Image Button
    var btnAddImage = DOM.getById('btn-add-image');
    if (btnAddImage) {
        btnAddImage.addEventListener('click', open);
    }

    // Modal Close Button
    var modal = DOM.getById('modal-image-browser');
    if (modal) {
        var closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', close);
        }

        // Click außerhalb Modal schließt es
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                close();
            }
        });
    }

    // Cancel Button
    var btnCancel = DOM.getById('btn-image-browser-cancel');
    if (btnCancel) {
        btnCancel.addEventListener('click', close);
    }

    // Add Button
    var btnAdd = DOM.getById('btn-image-browser-add');
    if (btnAdd) {
        btnAdd.addEventListener('click', handleAddImages);
    }
}

/**
 * Öffnet den Bild-Browser
 */
export async function open() {
    selectedImages = [];
    DOM.showModal('modal-image-browser');
    await loadImages();
}

/**
 * Schließt den Bild-Browser
 */
export function close() {
    DOM.hideModal('modal-image-browser');
    selectedImages = [];
}

/**
 * Lädt Bilder aus dem images/ Ordner
 */
async function loadImages() {
    var imageGrid = DOM.getById('image-grid');
    if (!imageGrid) return;

    DOM.empty(imageGrid);

    // Zeige Loading
    var loading = DOM.create('div', { class: 'empty-placeholder' });
    loading.innerHTML = '<div class="loading"></div> Lade Bilder...';
    imageGrid.appendChild(loading);

    try {
        var images = await scanImagesFolder();

        DOM.empty(imageGrid);

        if (images.length === 0) {
            var placeholder = DOM.create('div', { class: 'empty-placeholder' },
                'Keine Bilder im images/ Ordner gefunden.\n\nStellen Sie sicher, dass:\n1. Ein lokaler Webserver läuft\n2. Bilder im images/ Ordner liegen\n3. Directory Listing aktiviert ist');
            imageGrid.appendChild(placeholder);
            return;
        }

        images.forEach(function (imagePath) {
            var item = createImageGridItem(imagePath);
            imageGrid.appendChild(item);
        });

    } catch (error) {
        DOM.empty(imageGrid);
        var errorMsg = DOM.create('div', { class: 'empty-placeholder' },
            'Fehler beim Laden der Bilder.\n\nBitte stellen Sie sicher, dass ein lokaler Webserver läuft:\n\npython3 -m http.server 8000\n\nFehler: ' + error.message);
        imageGrid.appendChild(errorMsg);
    }
}

/**
 * Scannt den images/ Ordner nach Bildern
 * @returns {Promise<Array<string>>} Array von Bild-Pfaden
 */
async function scanImagesFolder() {
    try {
        var response = await fetch('images/');
        var html = await response.text();
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var links = doc.querySelectorAll('a');
        var images = [];

        links.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href && /\.(jpg|jpeg|png|gif|webp)$/i.test(href)) {
                // Entferne ../ am Anfang falls vorhanden
                href = href.replace(/^\.\.\//, '');
                images.push('images/' + href);
            }
        });

        return images;
    } catch (error) {
        console.error('Fehler beim Scannen des images/ Ordners:', error);
        throw error;
    }
}

/**
 * Erstellt ein Bild-Grid-Item
 * @param {string} imagePath - Bild-Pfad
 * @returns {HTMLElement} Grid-Item
 */
function createImageGridItem(imagePath) {
    var item = DOM.create('div', { class: 'image-grid-item' });
    item.dataset.path = imagePath;

    var img = DOM.create('img');
    img.src = imagePath;
    img.alt = imagePath;

    var filename = imagePath.split('/').pop();
    var label = DOM.create('div', { class: 'image-name' }, filename);

    item.appendChild(img);
    item.appendChild(label);

    // Click-Handler
    item.addEventListener('click', function () {
        toggleImageSelection(item);
    });

    return item;
}

/**
 * Togglet Bild-Auswahl
 * @param {HTMLElement} item - Grid-Item
 */
function toggleImageSelection(item) {
    var path = item.dataset.path;

    if (DOM.hasClass(item, 'selected')) {
        DOM.removeClass(item, 'selected');
        selectedImages = selectedImages.filter(function (p) {
            return p !== path;
        });
    } else {
        DOM.addClass(item, 'selected');
        selectedImages.push(path);
    }
}

/**
 * Fügt ausgewählte Bilder hinzu
 */
function handleAddImages() {
    if (selectedImages.length === 0) {
        alert('Bitte wählen Sie mindestens ein Bild aus.');
        return;
    }

    // Füge Bilder zum Canvas hinzu
    selectedImages.forEach(function (imagePath) {
        CanvasWorkspace.addImage(imagePath);
    });

    close();
}

