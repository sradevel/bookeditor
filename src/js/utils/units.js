// Einheiten-Konvertierung
// Namespace: PhotobookEditor
var PhotobookEditor = PhotobookEditor || {};
PhotobookEditor.Utils = PhotobookEditor.Utils || {};

PhotobookEditor.Utils.Units = (function() {
    'use strict';

    /**
     * Konvertiert Millimeter zu Pixel bei gegebener DPI
     * Formel: px = (mm * dpi) / 25.4
     * @param {number} mm - Millimeter
     * @param {number} dpi - Dots per inch (Standard: 300)
     * @returns {number} Pixel
     */
    function mmToPx(mm, dpi) {
        dpi = dpi || 300;
        return Math.round((mm * dpi) / 25.4);
    }

    /**
     * Konvertiert Pixel zu Millimeter bei gegebener DPI
     * Formel: mm = (px * 25.4) / dpi
     * @param {number} px - Pixel
     * @param {number} dpi - Dots per inch (Standard: 300)
     * @returns {number} Millimeter
     */
    function pxToMm(px, dpi) {
        dpi = dpi || 300;
        return Math.round((px * 25.4) / dpi * 100) / 100;
    }

    /**
     * Konvertiert Zentimeter zu Millimeter
     * @param {number} cm - Zentimeter
     * @returns {number} Millimeter
     */
    function cmToMm(cm) {
        return cm * 10;
    }

    /**
     * Konvertiert Millimeter zu Zentimeter
     * @param {number} mm - Millimeter
     * @returns {number} Zentimeter
     */
    function mmToCm(mm) {
        return mm / 10;
    }

    // Public API
    return {
        mmToPx: mmToPx,
        pxToMm: pxToMm,
        cmToMm: cmToMm,
        mmToCm: mmToCm
    };
})();
