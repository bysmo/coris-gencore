// mt101-main.js - Exemple d'intégration

// Soumission du formulaire
document.getElementById('mt101Form').addEventListener('submit', function (e) {
    e.preventDefault();
    generateMT101Files();
});

function generateMT101Files() {
    // Récupérer les valeurs du formulaire
    const formData = {
        virementType: document.querySelector('input[name="virementType"]:checked').value,
        filiale: document.getElementById('filiale').value,
        valueDate: document.getElementById('valueDate').value,
        fileCount: parseInt(document.getElementById('fileCount').value),
        transactionsPerFile: parseInt(document.getElementById('transactionsPerFile').value),
        currency: document.getElementById('currency').value,
        minAmount: parseInt(document.getElementById('minAmount').value),
        maxAmount: parseInt(document.getElementById('maxAmount').value),
        chargeOption: document.getElementById('chargeOption').value,
        customPurpose: document.getElementById('customPurpose').value,
        filePrefix: document.getElementById('filePrefix').value || 'MT101'
    };

    // Générer les fichiers
    generatedMT101Files = []; // Réinitialiser la liste
    const filesContainer = document.getElementById('generatedFiles');
    filesContainer.innerHTML = '';

    for (let i = 0; i < formData.fileCount; i++) {
        // Générer le contenu du fichier MT101
        const fileContent = generateMT101Content(formData, i);
        const fileName = `${formData.filePrefix}_${formData.filiale}_${Date.now()}_${i + 1}.txt`;

        // Stocker le fichier dans la variable globale
        generatedMT101Files.push({
            name: fileName,
            content: fileContent,
            type: 'text/plain'
        });

        // Créer la card pour ce fichier
        const fileCard = createFileCard(fileName, fileContent, i + 1);
        filesContainer.appendChild(fileCard);
    }

    // Afficher la section des résultats
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

function generateMT101Content(formData, index) {
    // Votre logique de génération de contenu MT101 ici
    // Retourne une chaîne de caractères représentant le fichier
    return `{1:F01${formData.filiale}0000000000}{2:I101${formData.filiale}}{4:
:20:REF${Date.now()}${index}
:23B:CRED
:32A:${formData.valueDate.replace(/-/g, '')}${formData.currency}${generateAmount(formData.minAmount, formData.maxAmount)}
:50K:/COMPTE${100000 + index}
ORDONNATEUR${index}
:59:/IBAN${index}
BENEFICIAIRE${index}
:70:${formData.customPurpose || '/ROC/TEST'}
:71A:${formData.chargeOption}
-}`;
}

function generateAmount(min, max) {
    const amount = Math.floor(Math.random() * (max - min + 1)) + min;
    return amount.toString();
}

function createFileCard(fileName, content, index) {
    const card = document.createElement('div');
    card.className = 'file-card';
    card.style.cssText = `
        background: white;
        border: 1px solid #dce4ec;
        border-radius: 8px;
        padding: 15px;
        margin: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    `;

    card.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-file-alt" style="color: #2c7cc1; font-size: 24px;"></i>
            <div>
                <div style="font-weight: 600; color: #333;">${fileName}</div>
                <div style="font-size: 12px; color: #666;">${content.length} caractères</div>
            </div>
        </div>
        <button onclick="downloadSingleFile(${index - 1})" class="btn-secondary" style="padding: 8px 16px;">
            <i class="fas fa-download"></i> Télécharger
        </button>
    `;

    return card;
}

function downloadSingleFile(index) {
    const file = generatedMT101Files[index];
    if (!file) return;

    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function resetMT101Form() {
    document.getElementById('mt101Form').reset();
    document.getElementById('resultSection').style.display = 'none';
    generatedMT101Files = [];
}

function newMT101Generation() {
    document.getElementById('resultSection').style.display = 'none';
    generatedMT101Files = [];
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Fonction utilitaire pour les sections repliables
function toggleSection(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('i');

    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-down');
    } else {
        content.style.display = 'none';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-right');
    }
}