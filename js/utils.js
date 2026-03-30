/**
 * Utilitaires pour la gestion des téléchargements
 * Inclut le support pour la génération de fichiers ZIP
 */

const DownloadHelper = {
    /**
     * Télécharge un fichier individuel
     * @param {string} fileName - Nom du fichier
     * @param {string} content - Contenu du fichier
     */
    downloadSingle: function (fileName, content) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        // Délai pour s'assurer que le navigateur a initié le téléchargement
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    },

    /**
     * Compresse plusieurs fichiers dans un ZIP et le télécharge
     * @param {Array} files - Liste d'objets {name, content}
     * @param {string} zipName - Nom du fichier ZIP final
     */
    zipAndDownload: async function (files, zipName) {
        if (typeof JSZip === 'undefined') {
            console.error('JSZip is not loaded. Falling back to individual downloads.');
            files.forEach(file => this.downloadSingle(file.name, file.content));
            return;
        }

        const zip = new JSZip();

        files.forEach(file => {
            zip.file(file.name, file.content);
        });

        try {
            const content = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = zipName.endsWith('.zip') ? zipName : `${zipName}.zip`;
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('Error creating ZIP:', error);
            // Fallback en cas d'erreur
            files.forEach(file => this.downloadSingle(file.name, file.content));
        }
    }
};

// Export pour utilisation globale
window.DownloadHelper = DownloadHelper;
