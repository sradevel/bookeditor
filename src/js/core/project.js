
let projectData = null;

/**
 * Lädt Projekt-Daten aus dem JSON-Script-Tag
 * @returns {Object} Projekt-Daten
 */
export function loadProjectData() {
    const scriptElement = document.getElementById('project-data');
    if (scriptElement) {
        try {
            projectData = JSON.parse(scriptElement.textContent);
            return projectData;
        } catch (error) {
            console.error('Fehler beim Laden der Projekt-Daten:', error);
            return createDefaultProject();
        }
    } else {
        return createDefaultProject();
    }
}

/**
 * Erstellt ein Standard-Projekt
 * @returns {Object} Standard-Projekt-Daten
 */
export function createDefaultProject() {
    const now = new Date().toISOString();
    projectData = {
        projectInfo: {
            name: 'Mein Fotobuch',
            created: now,
            modified: now,
            version: '1.0'
        },
        pageFormat: {
            width: 297,
            height: 210,
            unit: 'mm',
            dpi: 300,
            margins: {
                top: 5,
                right: 5,
                bottom: 5,
                left: 5
            },
            bleed: 3
        },
        pages: []
    };
    return projectData;
}

/**
 * Gibt Projekt-Metadaten zurück
 * @returns {Object} Projekt-Info
 */
export function getProjectInfo() {
    return projectData ? projectData.projectInfo : null;
}

/**
 * Gibt Seitenformat zurück
 * @returns {Object} Seitenformat
 */
export function getPageFormat() {
    return projectData ? projectData.pageFormat : null;
}

/**
 * Gibt alle Seiten zurück
 * @returns {Array} Seiten
 */
export function getPages() {
    return projectData ? projectData.pages : [];
}

/**
 * Gibt komplette Projekt-Daten zurück
 * @returns {Object} Projekt-Daten
 */
export function getData() {
    return projectData;
}

/**
 * Aktualisiert Projekt-Informationen
 * @param {Object} info - Neue Projekt-Info
 */
export function updateProjectInfo(info) {
    if (projectData) {
        Object.assign(projectData.projectInfo, info);
        projectData.projectInfo.modified = new Date().toISOString();
    }
}

/**
 * Aktualisiert Seitenformat
 * @param {Object} format - Neues Seitenformat
 */
export function updatePageFormat(format) {
    if (projectData) {
        Object.assign(projectData.pageFormat, format);
        projectData.projectInfo.modified = new Date().toISOString();
    }
}

/**
 * Setzt komplette Projekt-Daten
 * @param {Object} data - Neue Projekt-Daten
 */
export function setData(data) {
    projectData = data;
}

