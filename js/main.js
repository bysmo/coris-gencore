/**
 * Script principal de l'application
 * Gestion de l'interface utilisateur et des interactions
 */

// Variables globales
let loadedIBANs = [];
let generatedFilesData = [];

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

/**
 * Initialisation de l'application
 */
function initializeApp() {
    // Définir la date par défaut à aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('valueDate').value = today;

    // Gestionnaires d'événements
    setupEventListeners();
}

/**
 * Configuration des écouteurs d'événements
 */
function setupEventListeners() {
    // Radio buttons pour le mode d'import IBAN
    document.querySelectorAll('input[name="ibanMode"]').forEach(radio => {
        radio.addEventListener('change', handleIBANModeChange);
    });

    // Upload de fichier IBAN
    const fileInput = document.getElementById('ibanFile');
    fileInput.addEventListener('change', handleFileUpload);

    // Drag & Drop
    const uploadArea = document.getElementById('fileUploadArea');
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleFileDrop);

    // Textarea pour saisie manuelle
    const manualTextarea = document.getElementById('ibanManual');
    manualTextarea.addEventListener('input', handleManualInput);

    // Soumission du formulaire
    const form = document.getElementById('mt103Form');
    form.addEventListener('submit', handleFormSubmit);
}

/**
 * Gestion du changement de mode d'import IBAN
 */
function handleIBANModeChange(e) {
    const mode = e.target.value;
    const fileSection = document.getElementById('fileImportSection');
    const manualSection = document.getElementById('manualImportSection');

    if (mode === 'file') {
        fileSection.style.display = 'block';
        manualSection.style.display = 'none';
    } else {
        fileSection.style.display = 'none';
        manualSection.style.display = 'block';
    }
}

/**
 * Gestion de l'upload de fichier
 */
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        readFileContent(file);
    }
}

/**
 * Gestion du drag over
 */
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

/**
 * Gestion du drag leave
 */
function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
}

/**
 * Gestion du drop de fichier
 */
function handleFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        readFileContent(files[0]);
    }
}

/**
 * Lecture du contenu du fichier
 */
function readFileContent(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const content = e.target.result;
        parseIBANsFromFile(content, file.name);
    };

    reader.onerror = function () {
        showError('Erreur lors de la lecture du fichier');
    };

    reader.readAsText(file);
}

/**
 * Analyse des IBANs depuis le contenu du fichier
 */
function parseIBANsFromFile(content, fileName) {
    // Sépare par lignes et virgules
    const lines = content.split(/[\r\n,;]+/);
    const ibans = [];

    lines.forEach(line => {
        line = line.trim();
        // Ignore les lignes vides et les en-têtes potentiels
        if (line && line.length > 10 && !line.toLowerCase().includes('iban')) {
            // Nettoie l'IBAN (supprime espaces et caractères spéciaux)
            const cleanIBAN = line.replace(/[^A-Z0-9]/gi, '');
            if (isValidIBAN(cleanIBAN)) {
                ibans.push(cleanIBAN);
            }
        }
    });

    if (ibans.length === 0) {
        showError('Aucun IBAN valide trouvé dans le fichier');
        return;
    }

    loadedIBANs = ibans;
    displayFileInfo(fileName, ibans.length);
    displayIBANPreview(ibans);
}

/**
 * Gestion de la saisie manuelle
 */
function handleManualInput(e) {
    const content = e.target.value;
    const lines = content.split(/[\r\n]+/);
    const ibans = [];

    lines.forEach(line => {
        line = line.trim();
        if (line) {
            const cleanIBAN = line.replace(/[^A-Z0-9]/gi, '');
            if (isValidIBAN(cleanIBAN)) {
                ibans.push(cleanIBAN);
            }
        }
    });

    loadedIBANs = ibans;

    if (ibans.length > 0) {
        displayIBANPreview(ibans);
    } else {
        document.getElementById('ibanPreview').style.display = 'none';
    }
}

/**
 * Affichage des informations du fichier chargé
 */
function displayFileInfo(fileName, ibanCount) {
    const fileInfo = document.getElementById('fileInfo');
    fileInfo.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <strong>${fileName}</strong> - ${ibanCount} IBAN(s) chargé(s)
    `;
    fileInfo.style.display = 'flex';
}

/**
 * Affichage de l'aperçu des IBANs
 */
function displayIBANPreview(ibans) {
    const preview = document.getElementById('ibanPreview');
    const count = document.getElementById('ibanCount');
    const list = document.getElementById('ibanList');

    count.textContent = ibans.length;

    // Affiche les 10 premiers IBANs
    const displayCount = Math.min(ibans.length, 10);
    let html = '<ul>';
    for (let i = 0; i < displayCount; i++) {
        html += `<li>${ibans[i]}</li>`;
    }
    if (ibans.length > 10) {
        html += `<li class="more">... et ${ibans.length - 10} autre(s)</li>`;
    }
    html += '</ul>';

    list.innerHTML = html;
    preview.style.display = 'block';
}

/**
 * Gestion de la soumission du formulaire
 */
function handleFormSubmit(e) {
    e.preventDefault();

    // Validation
    if (loadedIBANs.length === 0) {
        showError('Veuillez charger au moins un IBAN bénéficiaire');
        return;
    }

    // Récupération des données du formulaire
    const formData = {
        filiale: document.getElementById('filiale').value,
        valueDate: new Date(document.getElementById('valueDate').value),
        fileCount: parseInt(document.getElementById('fileCount').value),
        transactionsPerFile: parseInt(document.getElementById('transactionsPerFile').value),
        minAmount: parseInt(document.getElementById('minAmount').value),
        maxAmount: parseInt(document.getElementById('maxAmount').value),
        orderingCustomer: document.getElementById('orderingCustomer').value,
        remittanceInfo: document.getElementById('remittanceInfo').value,
        filePrefix: document.getElementById('filePrefix').value || 'MT103_RTGS',
        generateMT910: document.getElementById('generateMT910').checked
    };

    // Validation des montants
    if (formData.minAmount >= formData.maxAmount) {
        showError('Le montant minimum doit être inférieur au montant maximum');
        return;
    }

    // Génération des fichiers
    generateFiles(formData);
}

/**
 * Génération des fichiers MT103
 */
function generateFiles(config) {
    try {
        // Affiche un indicateur de chargement
        showLoading();

        // Crée le générateur
        const generator = new MT103Generator(config);

        // Génère tous les fichiers MT103
        const files = generator.generateAllFiles(loadedIBANs, config);

        // Génère le fichier MT910 si demandé
        let mt910File = null;
        if (config.generateMT910) {
            mt910File = generator.generateMT910ConfirmationFile(config);
            if (mt910File) {
                files.push(mt910File);
            }
        }

        // Stocke les fichiers générés
        generatedFilesData = files;

        // Affiche les résultats
        displayResults(files, mt910File);

        // Cache le formulaire et affiche les résultats
        document.querySelector('.form-container').style.display = 'none';
        document.getElementById('resultSection').style.display = 'block';

        // Scroll vers les résultats
        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Erreur lors de la génération:', error);
        showError('Erreur lors de la génération des fichiers: ' + error.message);
    } finally {
        hideLoading();
    }
}

/**
 * Affichage des résultats
 */
function displayResults(files, mt910File) {
    const container = document.getElementById('generatedFiles');
    let html = '<div class="files-grid">';

    files.forEach((file, index) => {
        const isMT910 = file.name.includes('MT910');
        const iconClass = isMT910 ? 'fa-check-circle' : 'fa-file-alt';
        const cardClass = isMT910 ? 'file-card mt910-card' : 'file-card';

        html += `
            <div class="${cardClass}">
                <div class="file-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="file-info">
                    <h3>${file.name}</h3>
                    ${isMT910 ? '<p><strong>Type:</strong> MT910 Confirmation BCEAO</p>' : ''}
                    <p><strong>Filiale:</strong> ${file.filiale}</p>
                    <p><strong>Transactions:</strong> ${file.messagesCount} ${isMT910 ? 'MT910' : 'MT103'}</p>
                    <p><strong>Taille:</strong> ${(file.content.length / 1024).toFixed(2)} KB</p>
                </div>
                <button class="btn-download" onclick="downloadSingleFile(${index})">
                    <i class="fas fa-download"></i> Télécharger
                </button>
            </div>
        `;
    });

    html += '</div>';

    // Ajouter un message informatif si MT910 généré
    if (mt910File) {
        html += `
            <div class="info-section" style="margin-top: 20px;">
                <h4><i class="fas fa-info-circle"></i> Fichier MT910 de Confirmation</h4>
                <p>Un fichier MT910 consolidé a été généré avec toutes les confirmations BCEAO pour les ${mt910File.messagesCount} virements MT103 RTGS.</p>
                <p><strong>Utilisation :</strong> Ce fichier simule les messages de confirmation MT910 envoyés par la BCEAO aux banques commerciales pour confirmer les crédits sur leur compte RTGS.</p>
            </div>
        `;
    }

    container.innerHTML = html;
}


/**
 * Téléchargement d'un fichier individuel
 */
function downloadSingleFile(index) {
    const file = generatedFilesData[index];
    DownloadHelper.downloadSingle(file.name, file.content);
}

/**
 * Téléchargement de tous les fichiers
 */
function downloadAllFiles() {
    const zipName = `MT103_RTGS_${new Date().getTime()}.zip`;
    DownloadHelper.zipAndDownload(generatedFilesData, zipName);
}

/**
 * Nouvelle génération
 */
function newGeneration() {
    document.querySelector('.form-container').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Réinitialisation du formulaire
 */
function resetForm() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ?')) {
        document.getElementById('mt103Form').reset();
        loadedIBANs = [];
        document.getElementById('ibanPreview').style.display = 'none';
        document.getElementById('fileInfo').style.display = 'none';

        const today = new Date().toISOString().split('T')[0];
        document.getElementById('valueDate').value = today;
    }
}

/**
 * Configuration des préréglages de montants
 */
function setAmountRange(min, max) {
    document.getElementById('minAmount').value = min;
    document.getElementById('maxAmount').value = max;
}

/**
 * Toggle des sections collapsibles
 */
function toggleSection(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('i');

    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    } else {
        content.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    }
}

/**
 * Affichage d'un message d'erreur
 */
function showError(message) {
    alert('❌ Erreur: ' + message);
}

/**
 * Affichage d'un message de succès
 */
function showSuccess(message) {
    alert('✅ ' + message);
}

/**
 * Affichage du chargement
 */
function showLoading() {
    // Crée un overlay de chargement
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Génération des fichiers MT103 en cours...</p>
        </div>
    `;
    document.body.appendChild(overlay);
}

/**
 * Masquage du chargement
 */
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Export des fonctions pour utilisation globale
window.resetForm = resetForm;
window.setAmountRange = setAmountRange;
window.toggleSection = toggleSection;
window.downloadSingleFile = downloadSingleFile;
window.downloadAllFiles = downloadAllFiles;
window.newGeneration = newGeneration;
