/**
 * Script principal pour le générateur MT101
 * Gestion de l'interface utilisateur et des interactions
 */

// Variables globales
let generatedMT101FilesData = [];
let currentVirementType = 'INTERNE';

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function () {
    initializeMT101App();
});

/**
 * Initialisation de l'application MT101
 */
function initializeMT101App() {
    // Définir la date par défaut à aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('valueDate').value = today;

    // Gestionnaires d'événements
    setupMT101EventListeners();

    // Afficher la description du type par défaut
    updateTypeDescription('INTERNE');
}

/**
 * Configuration des écouteurs d'événements MT101
 */
function setupMT101EventListeners() {
    // Radio buttons pour le type de virement
    document.querySelectorAll('input[name="virementType"]').forEach(radio => {
        radio.addEventListener('change', handleVirementTypeChange);
    });

    // Changement de devise
    const currencySelect = document.getElementById('currency');
    currencySelect.addEventListener('change', handleCurrencyChange);

    // Soumission du formulaire
    const form = document.getElementById('mt101Form');
    form.addEventListener('submit', handleMT101FormSubmit);
}

/**
 * Gestion du changement de type de virement
 */
function handleVirementTypeChange(e) {
    const type = e.target.value;
    currentVirementType = type;
    updateTypeDescription(type);
    updateFormForType(type);
}

/**
 * Mise à jour de la description du type
 */
function updateTypeDescription(type) {
    const descriptions = {
        'INTERNE': 'Virements entre comptes de la même filiale CORIS. Traitement interne rapide. Devise: XOF uniquement.',
        'COMPENSE': 'Virements vers d\'autres banques UEMOA via le système de compensation. Montants inférieurs à 50 millions XOF. Traitement J+1.',
        'RTGS': 'Virements RTGS vers confrères via la BCEAO. Montants supérieurs ou égaux à 50 millions XOF ou avec mention 23E:RTGS. Traitement en temps réel.',
        'ETRANGER': 'Transferts internationaux vers l\'étranger ou en devises étrangères. Support multi-devises (EUR, USD, GBP, CHF, CAD). Frais variables selon option.',
        'MIXTE': 'Génération aléatoire de virements de tous types (Interne, Compensé, RTGS, Étranger) avec devises variées (XOF et devises étrangères) selon le type.'
    };

    document.getElementById('typeDescriptionText').textContent = descriptions[type];
}

/**
 * Mise à jour du formulaire selon le type
 */
function updateFormForType(type) {
    const currencySelector = document.getElementById('currencySelector');
    const currencySelect = document.getElementById('currency');
    const chargeOptionGroup = document.getElementById('chargeOptionGroup');
    const minAmountInput = document.getElementById('minAmount');
    const maxAmountInput = document.getElementById('maxAmount');

    switch (type) {
        case 'INTERNE':
            currencySelector.style.display = 'none';
            currencySelect.value = 'XOF';
            chargeOptionGroup.style.display = 'none';
            minAmountInput.value = 1000;
            maxAmountInput.value = 10000000;
            updateCurrencyLabels('XOF');
            break;

        case 'COMPENSE':
            currencySelector.style.display = 'none';
            currencySelect.value = 'XOF';
            chargeOptionGroup.style.display = 'none';
            minAmountInput.value = 1000;
            maxAmountInput.value = 49999999;
            updateCurrencyLabels('XOF');
            break;

        case 'RTGS':
            currencySelector.style.display = 'none';
            currencySelect.value = 'XOF';
            chargeOptionGroup.style.display = 'none';
            minAmountInput.value = 50000000;
            maxAmountInput.value = 1000000000;
            updateCurrencyLabels('XOF');
            break;

        case 'ETRANGER':
            currencySelector.style.display = 'block';
            chargeOptionGroup.style.display = 'block';
            currencySelect.value = 'EUR';
            minAmountInput.value = 100;
            maxAmountInput.value = 100000;
            updateCurrencyLabels('EUR');
            break;

        case 'MIXTE':
            currencySelector.style.display = 'none'; // On cache le sélecteur car devises multiples
            chargeOptionGroup.style.display = 'none'; // Pertinent pour les virements étrangers inclus
            currencySelect.value = 'Mixte';
            minAmountInput.value = 1000;
            maxAmountInput.value = 100000000;
            updateCurrencyLabels('Mixte');
            break;
    }
}

/**
 * Gestion du changement de devise
 */
function handleCurrencyChange(e) {
    const currency = e.target.value;
    updateCurrencyLabels(currency);

    // Ajuster les montants selon la devise
    const minAmountInput = document.getElementById('minAmount');
    const maxAmountInput = document.getElementById('maxAmount');

    if (currency === 'XOF') {
        minAmountInput.value = 10000;
        maxAmountInput.value = 50000000;
    } else {
        minAmountInput.value = 100;
        maxAmountInput.value = 100000;
    }
}

/**
 * Mise à jour des labels de devise
 */
function updateCurrencyLabels(currency) {
    document.getElementById('currencyLabel').textContent = currency;
    document.getElementById('currencyLabel2').textContent = currency;
}

/**
 * Configuration des plages de montants
 */
function setMT101AmountRange(size) {
    const minAmountInput = document.getElementById('minAmount');
    const maxAmountInput = document.getElementById('maxAmount');
    const currency = document.getElementById('currency').value;

    if (currency === 'XOF') {
        switch (size) {
            case 'small':
                minAmountInput.value = 1000;
                maxAmountInput.value = 100000;
                break;
            case 'medium':
                minAmountInput.value = 100000;
                maxAmountInput.value = 10000000;
                break;
            case 'large':
                minAmountInput.value = 10000000;
                maxAmountInput.value = 500000000;
                break;
        }
    } else {
        switch (size) {
            case 'small':
                minAmountInput.value = 10;
                maxAmountInput.value = 1000;
                break;
            case 'medium':
                minAmountInput.value = 1000;
                maxAmountInput.value = 50000;
                break;
            case 'large':
                minAmountInput.value = 50000;
                maxAmountInput.value = 500000;
                break;
        }
    }
}

/**
 * Gestion de la soumission du formulaire MT101
 */
function handleMT101FormSubmit(e) {
    e.preventDefault();

    // Récupération des données du formulaire
    const formData = {
        type: currentVirementType,
        filiale: FILIALES[document.getElementById('filiale').value],
        valueDate: new Date(document.getElementById('valueDate').value),
        fileCount: parseInt(document.getElementById('fileCount').value),
        transactionsPerFile: parseInt(document.getElementById('transactionsPerFile').value),
        currency: document.getElementById('currency').value,
        minAmount: parseFloat(document.getElementById('minAmount').value),
        maxAmount: parseFloat(document.getElementById('maxAmount').value),
        chargeOption: document.getElementById('chargeOption').value,
        purpose: document.getElementById('customPurpose').value,
        filePrefix: document.getElementById('filePrefix').value || 'MT101'
    };

    // Validations
    if (!formData.filiale) {
        showError('Veuillez sélectionner une filiale');
        return;
    }

    if (formData.minAmount >= formData.maxAmount) {
        showError('Le montant minimum doit être inférieur au montant maximum');
        return;
    }

    // Génération des fichiers
    generateMT101Files(formData);
}

/**
 * Génération des fichiers MT101
 */
function generateMT101Files(config) {
    try {
        // Affiche un indicateur de chargement
        showLoading();

        // Crée le générateur
        const generator = new MT101Generator(config);

        // Génère tous les fichiers
        const files = generator.generateAllFiles(config);

        // Stocke les fichiers générés
        generatedMT101FilesData = files;

        // Affiche les résultats
        displayMT101Results(files);

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
 * Affichage des résultats MT101
 */
function displayMT101Results(files) {
    const container = document.getElementById('generatedFiles');
    let html = '<div class="files-grid">';

    files.forEach((file, index) => {
        html += `
            <div class="file-card">
                <div class="file-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="file-info">
                    <h3>${file.name}</h3>
                    <p><strong>Type:</strong> ${file.type}</p>
                    <p><strong>Filiale:</strong> ${file.filiale}</p>
                    <p><strong>Transactions:</strong> ${file.messagesCount} MT101</p>
                    <p><strong>Taille:</strong> ${(file.content.length / 1024).toFixed(2)} KB</p>
                </div>
                <button class="btn-download" onclick="downloadSingleMT101File(${index})">
                    <i class="fas fa-download"></i> Télécharger
                </button>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

/**
 * Téléchargement d'un fichier MT101 individuel
 */
function downloadSingleMT101File(index) {
    const file = generatedMT101FilesData[index];
    DownloadHelper.downloadSingle(file.name, file.content);
}

/**
 * Téléchargement de tous les fichiers MT101
 */
function downloadAllMT101Files() {
    const zipName = `MT101_${new Date().getTime()}.zip`;
    DownloadHelper.zipAndDownload(generatedMT101FilesData, zipName);
}

/**
 * Nouvelle génération MT101
 */
function newMT101Generation() {
    document.querySelector('.form-container').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Réinitialisation du formulaire MT101
 */
function resetMT101Form() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ?')) {
        document.getElementById('mt101Form').reset();

        const today = new Date().toISOString().split('T')[0];
        document.getElementById('valueDate').value = today;

        currentVirementType = 'INTERNE';
        updateTypeDescription('INTERNE');
        updateFormForType('INTERNE');
    }
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
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Génération des fichiers MT101 en cours...</p>
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
window.resetMT101Form = resetMT101Form;
window.setMT101AmountRange = setMT101AmountRange;
window.toggleSection = toggleSection;
window.downloadSingleMT101File = downloadSingleMT101File;
window.downloadAllMT101Files = downloadAllMT101Files;
window.newMT101Generation = newMT101Generation;
