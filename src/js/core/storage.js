import * as Project from './project.js';

/**
 * Sammelt aktuelle Projekt-Daten
 * @returns {Object} Projekt-Daten
 */
export function collectProjectData() {
    const data = Project.getData();

    // Aktualisiere Modified-Timestamp
    data.projectInfo.modified = new Date().toISOString();

    return data;
}

/**
 * Generiert HTML-Datei mit aktualisierten Projekt-Daten
 * @param {Object} projectData - Projekt-Daten
 * @returns {Promise<string>} HTML-Inhalt
 */
export async function generateHTMLFile(projectData) {
    try {
        // Lade Template (absoluter Pfad vom Webserver-Root)
        const response = await fetch('/template/photobook-template.html');
        let htmlContent = await response.text();

        // Ersetze Projekt-Daten
        const jsonString = JSON.stringify(projectData, null, 2);
        const scriptTag = '<script id="project-data" type="application/json">\n' + jsonString + '\n    </script>';

        // Finde und ersetze den <script id="project-data"> Block
        const regex = /<script id="project-data" type="application\/json">[\s\S]*?<\/script>/;
        htmlContent = htmlContent.replace(regex, scriptTag);

        return htmlContent;
    } catch (error) {
        console.error('Fehler beim Generieren der HTML-Datei:', error);
        throw error;
    }
}

/**
 * Lädt HTML-Datei herunter
 * @param {string} htmlContent - HTML-Inhalt
 * @param {string} filename - Dateiname (optional)
 */
export function downloadHTML(htmlContent, filename) {
    filename = filename || 'photobook.html';

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Speichert das Projekt (Hauptfunktion)
 * @returns {Promise<void>}
 */
export async function saveProject() {
    try {
        const projectData = collectProjectData();
        const htmlContent = await generateHTMLFile(projectData);
        const projectName = projectData.projectInfo.name || 'photobook';
        const filename = projectName.toLowerCase().replace(/\s+/g, '-') + '.html';
        downloadHTML(htmlContent, filename);
        console.log('Projekt erfolgreich gespeichert:', filename);
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        alert('Fehler beim Speichern des Projekts. Bitte versuchen Sie es erneut.');
    }
}

/**
 * Auto-Save in localStorage (optional für Phase 1)
 */
export function autoSave() {
    try {
        const projectData = collectProjectData();
        localStorage.setItem('photobook-autosave', JSON.stringify(projectData));
        console.log('Auto-Save erfolgreich');
    } catch (error) {
        console.error('Fehler beim Auto-Save:', error);
    }
}

/**
 * Lädt Auto-Save aus localStorage
 * @returns {Object|null} Projekt-Daten oder null
 */
export function loadAutoSave() {
    try {
        const data = localStorage.getItem('photobook-autosave');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Fehler beim Laden des Auto-Save:', error);
        return null;
    }
}

