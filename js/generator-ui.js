/**
 * Contrôleur d'Interface Utilisateur pour le Générateur Unifié
 */

// Configuration des formats supportés
// Configuration des formats supportés
const FORMATS_CONFIG = {
    // 1. Clientèle
    'pain.001': { name: 'pain.001 (Virement Client ISO)', type: 'MX', category: 'Clientèle', mode: 'payment', desc: 'Demande de virement client (Remplace le MT101)' },
    'mt101': { name: 'MT101 Corporate', type: 'MT', category: 'Clientèle', mode: 'payment', desc: 'Demande de virement multi-bénéficiaires' },

    // 2. HVPS+ (RTGS)
    'mt103-rtgs-emis': { name: 'MT103 RTGS Emis', type: 'MT', category: 'HVPS+', mode: 'payment', desc: 'Virement de clientèle RTGS émis' },
    'mt103-rtgs-recus': { name: 'MT103 RTGS Recu', type: 'MT', category: 'HVPS+', mode: 'payment', desc: 'Virement de clientèle RTGS reçu de la Banque Centrale' },
    'mt103-rtgs': { name: 'MT103 RTGS Recu (Alias)', type: 'MT', category: 'HVPS+', mode: 'payment', desc: 'Virement de clientèle RTGS reçu de la Banque Centrale' },
    'mt103-rtgs-emis-res': { name: 'MT103 RTGS Réservation émis', type: 'MT', category: 'HVPS+', mode: 'payment', desc: 'Réservation de fonds RTGS émise' },
    'mt103-rtgs-recus-b2b': { name: 'MT103 RTGS B2B reçu', type: 'MT', category: 'HVPS+', mode: 'payment', desc: 'Transfert RTGS de banque à banque reçu' },
    'mt202-rtgs-emis-b2b': { name: 'MT202 RTGS B2B émis', type: 'MT', category: 'HVPS+', mode: 'payment', desc: 'Transfert interbancaire B2B émis' },
    'mt202-rtgs-emis-res': { name: 'MT202 RTGS Réservation émis', type: 'MT', category: 'HVPS+', mode: 'payment', desc: 'Transfert interbancaire de réservation émis' },
    'mt202-rtgs-recus': { name: 'MT202 RTGS Recu', type: 'MT', category: 'HVPS+', mode: 'payment', desc: 'Transfert interbancaire RTGS reçu' },
    'mt202': { name: 'MT202 RTGS Recu (Alias)', type: 'MT', category: 'HVPS+', mode: 'payment', desc: 'Transfert interbancaire RTGS reçu' },
    'pacs.008-hvps-emis': { name: 'pacs.008 HVPS+ Emis', type: 'MX', category: 'HVPS+', mode: 'payment', desc: 'Virement de clientèle interbancaire RTGS émis' },
    'pacs.008-hvps-recus': { name: 'pacs.008 HVPS+ Recu', type: 'MX', category: 'HVPS+', mode: 'payment', desc: 'Virement de clientèle interbancaire RTGS reçu' },
    'pacs.008-hvps': { name: 'pacs.008 HVPS+ Recu (Alias)', type: 'MX', category: 'HVPS+', mode: 'payment', desc: 'Virement de clientèle interbancaire RTGS reçu' },
    'pacs.009-hvps-emis': { name: 'pacs.009 HVPS+ Emis', type: 'MX', category: 'HVPS+', mode: 'payment', desc: 'Transfert de fonds interbancaire RTGS émis' },
    'pacs.009-hvps-recus': { name: 'pacs.009 HVPS+ Recu', type: 'MX', category: 'HVPS+', mode: 'payment', desc: 'Transfert de fonds interbancaire RTGS reçu' },

    // 3. CBPR+ (ETRANGER)
    'mt103-transfert-international-emis': { name: 'MT103 International Emis', type: 'MT', category: 'CBPR+', mode: 'payment', desc: 'Virement international émis (Transfert)' },
    'mt103-intl': { name: 'MT103 International Emis (Alias)', type: 'MT', category: 'CBPR+', mode: 'payment', desc: 'Virement international émis (Transfert)' },
    'mt103-transfert-international-recus': { name: 'MT103 International Recu', type: 'MT', category: 'CBPR+', mode: 'payment', desc: 'Virement international reçu (Rapatriement)' },
    'pacs.008-cbpr-emis': { name: 'pacs.008 CBPR+ Emis', type: 'MX', category: 'CBPR+', mode: 'payment', desc: 'Virement de clientèle international émis (Transfert)' },
    'pacs.008-cbpr': { name: 'pacs.008 CBPR+ Emis (Alias)', type: 'MX', category: 'CBPR+', mode: 'payment', desc: 'Virement de clientèle international émis (Transfert)' },
    'pacs.008-cbpr-recus': { name: 'pacs.008 CBPR+ Recu', type: 'MX', category: 'CBPR+', mode: 'payment', desc: 'Virement de clientèle international reçu (Rapatriement)' },
    'pacs.009-cbpr-emis': { name: 'pacs.009 CBPR+ Emis', type: 'MX', category: 'CBPR+', mode: 'payment', desc: 'Transfert interbancaire international émis' },
    'pacs.009-cbpr-recus': { name: 'pacs.009 CBPR+ Recu', type: 'MX', category: 'CBPR+', mode: 'payment', desc: 'Transfert interbancaire international reçu' },
    'pacs.004': { name: 'pacs.004 Retour de Fonds', type: 'MX', category: 'CBPR+', mode: 'payment', desc: 'Message de retour de fonds (CBPR+)' },

    // 4. Reporting
    'mt900': { name: 'MT900 Debit RTGS', type: 'MT', category: 'Reporting', mode: 'report', desc: 'Avis de débit de la Banque Centrale' },
    'mt910': { name: 'MT910 Credit RTGS', type: 'MT', category: 'Reporting', mode: 'report', desc: 'Avis de crédit de la Banque Centrale' },
    'camt.054': { name: 'camt.054 (Avis Débit/Crédit)', type: 'MX', category: 'Reporting', mode: 'report', desc: 'Notification de débit ou crédit de compte' },
    'mt940': { name: 'MT940 Relevé', type: 'MT', category: 'Reporting', mode: 'report', desc: 'Relevé de compte de fin de journée' },
    'mt950': { name: 'MT950 Relevé BEAC/BCEAO', type: 'MT', category: 'Reporting', mode: 'report', desc: 'Relevé de compte institutionnel' },
    'pacs.053': { name: 'pacs.053 (Relevé Compte)', type: 'MX', category: 'Reporting', mode: 'report', desc: 'Relevé de compte client (Remplace le MT940 / MT950)' },
    'mt942': { name: 'MT942 Relevé Intérimaire', type: 'MT', category: 'Reporting', mode: 'report', desc: 'Relevé de compte en cours de journée' },
    'camt.052': { name: 'camt.052 (Relevé Intérimaire)', type: 'MX', category: 'Reporting', mode: 'report', desc: 'Rapport de compte en cours de journée (Remplace le MT942)' },

    // 5. Payment Status Report
    'mt199': { name: 'MT199 Message Libre', type: 'MT', category: 'Payment Status Report', mode: 'payment', desc: 'Message libre d\'information ou de requête' },
    'mt299': { name: 'MT299 Message Libre', type: 'MT', category: 'Payment Status Report', mode: 'payment', desc: 'Message libre d\'information ou de requête' },
    'pacs.002': { name: 'pacs.002 (Statut Paiement)', type: 'MX', category: 'Payment Status Report', mode: 'payment', desc: 'Rapport sur le statut du paiement (FIToFIPmtStsRpt)' },
    'pain.002': { name: 'pain.002 (Statut Virement Client)', type: 'MX', category: 'Payment Status Report', mode: 'payment', desc: 'Rapport sur le statut de l\'instruction client (CstmrPmtStsRpt)' }
};

// Variables d'état globales
let currentFormat = 'mt103-rtgs';
let loadedDataList = []; // Liste d'IBANs (mode payment) ou d'opérations (mode report)
let generatedFilesData = [];

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Lire le format depuis l'URL
    const params = new URLSearchParams(window.location.search);
    const formatParam = params.get('format');
    if (formatParam && FORMATS_CONFIG[formatParam]) {
        currentFormat = formatParam;
    }

    initUI();
    setupEventListeners();
});

/**
 * Configure les éléments de l'UI selon le format actif
 */
function initUI() {
    const config = FORMATS_CONFIG[currentFormat];
    
    // Titre et Description
    document.getElementById('generatorTitle').innerHTML = `
        Générateur de Message 
        <span class="badge-type ${config.type === 'MX' ? 'badge-mx' : 'badge-mt'}">${config.name.split(' ')[0]}</span>
    `;
    document.getElementById('generatorSubtitle').textContent = `${config.category} — ${config.desc}`;
    document.getElementById('filePrefix').value = config.name.split(' ')[0].replace('.', '_') + '_CORIS';

    // Ajustement des champs selon le mode (Payment vs Report)
    const isPayment = (config.mode === 'payment');
    
    if (isPayment) {
        // Mode paiement (IBANs bénéficiaires)
        document.getElementById('flowConfigGroup').style.display = 'block';
        document.getElementById('camtConfigGroup').style.display = 'none';
        document.getElementById('amountSection').style.display = 'block';
        document.getElementById('statementSection').style.display = 'none';
        document.getElementById('flowAdvancedOptions').style.display = 'block';
        
        // Import header labels
        document.getElementById('importTitle').innerHTML = '<i class="fas fa-users"></i> Chargement des IBAN Bénéficiaires';
        document.getElementById('uploadInstructions').textContent = "Glissez-déposez le fichier d'IBANs ici";
        document.getElementById('uploadAllowedFormats').textContent = "Formats acceptés: CSV, TXT (un IBAN par ligne)";
        document.getElementById('manualText').placeholder = "Entrez les IBAN, un par ligne\nExemple:\nBF14801001123456789012\nCM00100005000030123456789";
        document.getElementById('manualInstructions').textContent = "Un IBAN/compte valide par ligne.";
        document.getElementById('previewTitle').innerHTML = 'Bénéficiaires chargés: <span id="previewCount">0</span>';
        
        // Gérer le selecteur de devise (pour CBPR+)
        if (currentFormat.includes('cbpr') || currentFormat.includes('intl') || currentFormat.includes('international')) {
            document.getElementById('currencyGroup').style.display = 'block';
        } else {
            document.getElementById('currencyGroup').style.display = 'none';
        }

        // Gérer les champs spécifiques CBPR+ Recus vs Emis
        const isCbprRecus = (currentFormat.includes('cbpr') || currentFormat.includes('international')) && currentFormat.includes('recus');
        const isCbprEmis = (currentFormat.includes('cbpr') || currentFormat.includes('international')) && currentFormat.includes('emis');
        
        if (isCbprRecus) {
            document.getElementById('cbprRecusFields').style.display = 'block';
            document.getElementById('cbprEmisFields').style.display = 'none';
        } else if (isCbprEmis) {
            document.getElementById('cbprRecusFields').style.display = 'none';
            document.getElementById('cbprEmisFields').style.display = 'block';
        } else {
            document.getElementById('cbprRecusFields').style.display = 'none';
            document.getElementById('cbprEmisFields').style.display = 'none';
        }
    } else {
        // En mode report, toujours masquer les champs CBPR+
        document.getElementById('cbprRecusFields').style.display = 'none';
        document.getElementById('cbprEmisFields').style.display = 'none';
        // Mode reporting (Références d'opérations)
        document.getElementById('flowConfigGroup').style.display = 'none';
        document.getElementById('amountSection').style.display = 'none';
        document.getElementById('flowAdvancedOptions').style.display = 'none';
        
        // Config groups spéciaux
        if (currentFormat === 'camt.054') {
            document.getElementById('camtConfigGroup').style.display = 'block';
        } else {
            document.getElementById('camtConfigGroup').style.display = 'none';
        }
        
        if (['mt940', 'mt950', 'pacs.053', 'mt942', 'camt.052'].includes(currentFormat)) {
            document.getElementById('statementSection').style.display = 'block';
        } else {
            document.getElementById('statementSection').style.display = 'none';
        }

        // Import header labels
        document.getElementById('importTitle').innerHTML = '<i class="fas fa-file-invoice"></i> Chargement des Références Opérations';
        document.getElementById('uploadInstructions').textContent = "Glissez-déposez le fichier d'opérations ici";
        document.getElementById('uploadAllowedFormats').textContent = "Format attendu: CSV/TXT (identifiant;date;montant;devise)";
        document.getElementById('manualText').placeholder = "Entrez les opérations, une par ligne séparée par des points-virgules.\nFormat: identifiant;date;montant;devise\nExemple:\nREF001;2026-06-16;150000;XOF\nREF002;2026-06-16;-25000;EUR";
        document.getElementById('manualInstructions').innerHTML = "Chaque transaction doit respecter le format <span class='code-template'>identifiant;date;montant;devise</span>.<br>Astuce: pour les débits, utilisez un montant négatif.";
        document.getElementById('previewTitle').innerHTML = 'Opérations chargées: <span id="previewCount">0</span>';
    }

    // Définir la date du jour par défaut
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('valueDate').value = today;

    // Masquer l'aperçu et les résultats
    document.getElementById('dataPreview').style.display = 'none';
    document.getElementById('resultSection').style.display = 'none';
}

/**
 * Configure les écouteurs d'événements
 */
function setupEventListeners() {
    // Mode d'importation (fichier vs manuel)
    document.querySelectorAll('input[name="importMode"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const mode = e.target.value;
            if (mode === 'file') {
                document.getElementById('fileImportSection').style.display = 'block';
                document.getElementById('manualImportSection').style.display = 'none';
            } else {
                document.getElementById('fileImportSection').style.display = 'none';
                document.getElementById('manualImportSection').style.display = 'block';
            }
        });
    });

    // Upload de fichier
    const fileInput = document.getElementById('importFile');
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    });

    // Drag and Drop
    const uploadArea = document.getElementById('fileUploadArea');
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) handleFile(files[0]);
    });

    // Saisie manuelle
    document.getElementById('manualText').addEventListener('input', (e) => {
        parseManualData(e.target.value);
    });

    // Soumission du formulaire
    document.getElementById('unifiedForm').addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit();
    });

    // Devise et labels monétaires dynamiques
    document.getElementById('filiale').addEventListener('change', (e) => {
        const filialeKey = e.target.value;
        if (filialeKey && FILIALES[filialeKey]) {
            const currency = FILIALES[filialeKey].currency;
            document.querySelectorAll('.currency-label').forEach(el => el.textContent = currency);
        }
    });
}

/**
 * Gère le fichier chargé
 */
function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        const config = FORMATS_CONFIG[currentFormat];
        
        if (config.mode === 'payment') {
            // Mode IBAN
            const lines = content.split(/[\r\n,;]+/);
            const ibans = [];
            lines.forEach(l => {
                const clean = l.trim().replace(/[^A-Z0-9]/gi, '');
                if (clean && isValidIBAN(clean)) ibans.push(clean);
            });

            if (ibans.length === 0) {
                alert('Erreur: Aucun IBAN valide trouvé dans le fichier.');
                return;
            }
            loadedDataList = ibans;
            updateFileInfo(file.name, ibans.length, 'IBAN(s)');
        } else {
            // Mode Reporting (opérations)
            const ops = GeneratorCore.parseOperations(content);
            if (ops.length === 0) {
                alert('Erreur: Aucune opération valide détectée. Vérifiez le format (id;date;montant;devise).');
                return;
            }
            loadedDataList = ops;
            updateFileInfo(file.name, ops.length, 'Opération(s)');
        }

        displayPreview();
    };
    reader.readAsText(file);
}

/**
 * Gère la saisie manuelle
 */
function parseManualData(text) {
    const config = FORMATS_CONFIG[currentFormat];
    if (config.mode === 'payment') {
        const lines = text.split(/[\r\n]+/);
        const ibans = [];
        lines.forEach(l => {
            const clean = l.trim().replace(/[^A-Z0-9]/gi, '');
            if (clean && isValidIBAN(clean)) ibans.push(clean);
        });
        loadedDataList = ibans;
    } else {
        loadedDataList = GeneratorCore.parseOperations(text);
    }
    displayPreview();
}

/**
 * Met à jour le bloc info fichier
 */
function updateFileInfo(name, count, unit) {
    const fileCard = document.getElementById('fileInfo');
    document.getElementById('uploadedFileName').textContent = name;
    document.getElementById('uploadedFileInfo').textContent = `${count} ${unit} détecté(s)`;
    fileCard.style.display = 'flex';
}

/**
 * Affiche l'aperçu dans l'UI
 */
function displayPreview() {
    const preview = document.getElementById('dataPreview');
    const countSpan = document.getElementById('previewCount');
    const listDiv = document.getElementById('previewList');
    const config = FORMATS_CONFIG[currentFormat];

    if (loadedDataList.length === 0) {
        preview.style.display = 'none';
        return;
    }

    countSpan.textContent = loadedDataList.length;
    
    let html = '<ul>';
    const limit = Math.min(loadedDataList.length, 10);
    
    for (let i = 0; i < limit; i++) {
        if (config.mode === 'payment') {
            html += `<li><span class="code-template">${loadedDataList[i]}</span></li>`;
        } else {
            const op = loadedDataList[i];
            const dateStr = op.date.toISOString().split('T')[0];
            const sign = op.amount >= 0 ? '+' : '';
            html += `<li><strong>${op.id}</strong> | ${dateStr} | <span style="color: ${op.amount >= 0 ? '#27ae60' : '#e74c3c'}">${sign}${op.amount} ${op.currency}</span></li>`;
        }
    }
    
    if (loadedDataList.length > 10) {
        html += `<li class="more">... et ${loadedDataList.length - 10} autre(s)</li>`;
    }
    html += '</ul>';

    listDiv.innerHTML = html;
    preview.style.display = 'block';
}

/**
 * Soumission et lancement du moteur
 */
function handleFormSubmit() {
    if (loadedDataList.length === 0) {
        alert('Erreur: Veuillez charger des données (bénéficiaires ou opérations) avant de générer.');
        return;
    }

    const config = FORMATS_CONFIG[currentFormat];
    const filialeKey = document.getElementById('filiale').value;
    if (!filialeKey) {
        alert('Veuillez sélectionner une filiale.');
        return;
    }

    // Validation des champs CBPR+
    const isCbprRecus = (currentFormat.includes('cbpr') || currentFormat.includes('international')) && currentFormat.includes('recus');
    const isCbprEmis = (currentFormat.includes('cbpr') || currentFormat.includes('international')) && currentFormat.includes('emis');
    
    let cbprSenderBic = "";
    let cbprOrderingAccount = "";
    let cbprDestBic = "";
    let cbprCoverBic = "";
    let cbprBeneficiaryAccount = "";
    
    if (isCbprRecus) {
        cbprSenderBic = document.getElementById('cbprSenderBic').value.trim();
        cbprOrderingAccount = document.getElementById('cbprOrderingAccount').value.trim();
        if (!cbprSenderBic || !cbprOrderingAccount) {
            alert('Veuillez renseigner le BIC émetteur et le compte donneur d\'ordre pour les messages reçus.');
            return;
        }
    } else if (isCbprEmis) {
        cbprDestBic = document.getElementById('cbprDestBic').value.trim();
        cbprCoverBic = document.getElementById('cbprCoverBic').value.trim();
        cbprBeneficiaryAccount = document.getElementById('cbprBeneficiaryAccount').value.trim();
        if (!cbprDestBic || !cbprBeneficiaryAccount) {
            alert('Veuillez renseigner le BIC de destination et le compte bénéficiaire pour les messages émis.');
            return;
        }
    }

    // Récupérer les données du formulaire
    const formParams = {
        filiale: filialeKey,
        valueDate: new Date(document.getElementById('valueDate').value),
        fileCount: parseInt(document.getElementById('fileCount').value),
        transactionsPerFile: parseInt(document.getElementById('transactionsPerFile').value || 10),
        minAmount: parseFloat(document.getElementById('minAmount').value || 1000),
        maxAmount: parseFloat(document.getElementById('maxAmount').value || 100000),
        currency: document.getElementById('currency').value || FILIALES[filialeKey].currency,
        reportingType: document.getElementById('reportingType').value || 'credit',
        accountNumber: document.getElementById('accountNumber').value,
        initialBalance: parseFloat(document.getElementById('initialBalance').value || 0),
        orderingCustomer: document.getElementById('orderingCustomer').value,
        remittanceInfo: document.getElementById('remittanceInfo').value,
        chargeOption: document.getElementById('chargeOption').value || 'SHA',
        filePrefix: document.getElementById('filePrefix').value,
        cbprSenderBic,
        cbprOrderingAccount,
        cbprDestBic,
        cbprCoverBic,
        cbprBeneficiaryAccount,
        ultimateDebtor: document.getElementById('ultimateDebtor').value.trim(),
        initiatingParty: document.getElementById('initiatingParty').value.trim(),
        ultimateCreditor: document.getElementById('ultimateCreditor').value.trim()
    };

    // Lancer la génération
    showLoader();
    setTimeout(() => {
        try {
            const engine = new GeneratorCore({ filiale: filialeKey });
            let resultFiles = [];

            if (config.mode === 'payment') {
                resultFiles = engine.generatePaymentFiles(currentFormat, loadedDataList, formParams);
            } else {
                resultFiles = engine.generateReportingFiles(currentFormat, loadedDataList, formParams);
            }

            generatedFilesData = resultFiles;
            displayResults(resultFiles);
        } catch (err) {
            alert('Erreur génération: ' + err.message);
            console.error(err);
        } finally {
            hideLoader();
        }
    }, 300);
}

/**
 * Affiche les résultats de la génération
 */
function displayResults(files) {
    const resultSection = document.getElementById('resultSection');
    const container = document.getElementById('generatedFiles');
    document.querySelector('.form-container').style.display = 'none';

    let html = '<div class="files-grid">';
    files.forEach((file, index) => {
        const isXml = file.name.endsWith('.xml');
        const icon = isXml ? 'fa-file-code' : 'fa-file-alt';
        const iconColor = isXml ? '#27ae60' : 'var(--primary-color)';

        html += `
            <div class="file-card">
                <div class="file-icon" style="color: ${iconColor};">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="file-info">
                    <h3>${file.name}</h3>
                    <p><strong>Filiale:</strong> ${file.filiale}</p>
                    <p><strong>Transactions:</strong> ${file.messagesCount}</p>
                    <p><strong>Taille:</strong> ${(file.content.length / 1024).toFixed(2)} KB</p>
                </div>
                <button class="btn-download" onclick="downloadSingleFile(${index})">
                    <i class="fas fa-download"></i> Télécharger
                </button>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Actions de téléchargements
 */
function downloadSingleFile(index) {
    const file = generatedFilesData[index];
    DownloadHelper.downloadSingle(file.name, file.content);
}

function downloadAllFiles() {
    const formatName = FORMATS_CONFIG[currentFormat].name.split(' ')[0].replace('.', '_');
    DownloadHelper.zipAndDownload(generatedFilesData, `${formatName}_${Date.now()}.zip`);
}

function newGeneration() {
    document.querySelector('.form-container').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    if (confirm('Réinitialiser le formulaire ?')) {
        document.getElementById('unifiedForm').reset();
        loadedDataList = [];
        document.getElementById('dataPreview').style.display = 'none';
        document.getElementById('fileInfo').style.display = 'none';
        initUI();
    }
}

function setPresetAmounts(min, max) {
    document.getElementById('minAmount').value = min;
    document.getElementById('maxAmount').value = max;
}

// Collapsible helper
function toggleSection(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('i');
    if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        icon.className = 'fas fa-chevron-up';
    } else {
        content.style.display = 'none';
        icon.className = 'fas fa-chevron-down';
    }
}

// Loader helpers
function showLoader() {
    const overlay = document.createElement('div');
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Génération en cours...</p>
        </div>
    `;
    document.body.appendChild(overlay);
}

function hideLoader() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.remove();
}

// Exposer globalement les fonctions déclenchées par attributs HTML
window.downloadSingleFile = downloadSingleFile;
window.downloadAllFiles = downloadAllFiles;
window.newGeneration = newGeneration;
window.resetForm = resetForm;
window.setPresetAmounts = setPresetAmounts;
window.toggleSection = toggleSection;
