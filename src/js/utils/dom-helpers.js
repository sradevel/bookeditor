/**
 * Element per ID abrufen
 * @param {string} id - Element-ID
 * @returns {HTMLElement|null}
 */
function getById(id) {
    return document.getElementById(id);
}

/**
 * Element per Selektor abrufen
 * @param {string} selector - CSS-Selektor
 * @returns {HTMLElement|null}
 */
function getOne(selector) {
    return document.querySelector(selector);
}

/**
 * Alle Elemente per Selektor abrufen
 * @param {string} selector - CSS-Selektor
 * @returns {NodeList}
 */
function getAll(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Element erstellen
 * @param {string} tag - HTML-Tag
 * @param {Object} attrs - Attribute (optional)
 * @param {string} content - Inhalt (optional)
 * @returns {HTMLElement}
 */
function create(tag, attrs, content) {
    const element = document.createElement(tag);

    if (attrs) {
        Object.keys(attrs).forEach(function (key) {
            if (key === 'class' || key === 'className') {
                element.className = attrs[key];
            } else {
                element.setAttribute(key, attrs[key]);
            }
        });
    }

    if (content) {
        element.textContent = content;
    }

    return element;
}

/**
 * Klasse hinzufügen
 * @param {HTMLElement} element
 * @param {string} className
 */
function addClass(element, className) {
    if (element) {
        element.classList.add(className);
    }
}

/**
 * Klasse entfernen
 * @param {HTMLElement} element
 * @param {string} className
 */
function removeClass(element, className) {
    if (element) {
        element.classList.remove(className);
    }
}

/**
 * Klasse togglen
 * @param {HTMLElement} element
 * @param {string} className
 */
function toggleClass(element, className) {
    if (element) {
        element.classList.toggle(className);
    }
}

/**
 * Prüft ob Element eine Klasse hat
 * @param {HTMLElement} element
 * @param {string} className
 * @returns {boolean}
 */
function hasClass(element, className) {
    return element ? element.classList.contains(className) : false;
}

/**
 * Element leeren
 * @param {HTMLElement} element
 */
function empty(element) {
    if (element) {
        element.innerHTML = '';
    }
}

/**
 * Modal anzeigen
 * @param {string} modalId - ID des Modal-Elements
 */
function showModal(modalId) {
    const modal = getById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Modal verstecken
 * @param {string} modalId - ID des Modal-Elements
 */
function hideModal(modalId) {
    const modal = getById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

export const DOM = {
    getById,
    getOne,
    getAll,
    create,
    addClass,
    removeClass,
    toggleClass,
    hasClass,
    empty,
    showModal,
    hideModal
};

