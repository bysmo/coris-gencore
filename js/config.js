// Configuration des filiales CORIS Bank UEMOA
const FILIALES = {
    'CORIBFBF': {
        name: 'Coris Burkina',
        bic: 'CORIBFBF',
        country: 'BF',
        countryCode: 'BF148',
        rtgsCode: 'C00030148',
        fullName: 'CORIS BANK BURKINA FASO'
    },
    'CORIBJBJ': {
        name: 'Coris Bénin',
        bic: 'CORIBJBJ',
        country: 'BJ',
        countryCode: 'BJ212',
        rtgsCode: 'B00032121',
        fullName: 'CORIS BANK BENIN'
    },
    'CORICIAB': {
        name: 'Coris Côte d\'Ivoire',
        bic: 'CORICIAB',
        country: 'CI',
        countryCode: 'CI166',
        rtgsCode: 'A00031661',
        fullName: 'CORIS BANK COTE D\'IVOIRE'
    },
    'CORIGWGW': {
        name: 'Coris Guinée Bissau',
        bic: 'CORIGWGW',
        country: 'GW',
        countryCode: 'GW243',
        rtgsCode: 'S00030967',
        fullName: 'CORIS BANK GUINEE BISSAU'
    },
    'CORIMLBA': {
        name: 'Coris Mali',
        bic: 'CORIMLBA',
        country: 'ML',
        countryCode: 'ML181',
        rtgsCode: 'D00030181',
        fullName: 'CORIS BANK MALI'
    },
    'CORINENI': {
        name: 'Coris Niger',
        bic: 'CORINENI',
        country: 'NE',
        countryCode: 'NE210',
        rtgsCode: 'H00032101',
        fullName: 'CORIS BANK NIGER'
    },
    'CORISNDA': {
        name: 'Coris Sénégal',
        bic: 'CORISNDA',
        country: 'SN',
        countryCode: 'SN213',
        rtgsCode: 'K00031971',
        fullName: 'CORIS BANK SENEGAL'
    },
    'CORITGTG': {
        name: 'Coris Togo',
        bic: 'CORITGTG',
        country: 'TG',
        countryCode: 'TG182',
        rtgsCode: 'T00031821',
        fullName: 'CORIS BANK TOGO',
        zone: 'UEMOA',
        city: 'Lomé',
        currency: 'XOF'
    },

    // ── Filiales CEMAC ──────────────────────────────────────────────────────
    'CORICMXA': {
        name: 'Coris Cameroun',
        bic: 'CORICMXA',
        country: 'CM',
        countryCode: 'CM001',
        rtgsCode: 'CM00001',
        fullName: 'CORIS BANK CAMEROUN',
        zone: 'CEMAC',
        city: 'Yaoundé',
        currency: 'XAF'
    },
    'CORICOXA': {
        name: 'Coris Congo',
        bic: 'CORICOXA',
        country: 'CG',
        countryCode: 'CG002',
        rtgsCode: 'CG00002',
        fullName: 'CORIS BANK CONGO',
        zone: 'CEMAC',
        city: 'Brazzaville',
        currency: 'XAF'
    },
    'CORIGAXA': {
        name: 'Coris Gabon',
        bic: 'CORIGAXA',
        country: 'GA',
        countryCode: 'GA003',
        rtgsCode: 'GA00003',
        fullName: 'CORIS BANK GABON',
        zone: 'CEMAC',
        city: 'Libreville',
        currency: 'XAF'
    },
    'CORITDXA': {
        name: 'Coris Tchad',
        bic: 'CORITDXA',
        country: 'TD',
        countryCode: 'TD004',
        rtgsCode: 'TD00004',
        fullName: 'CORIS BANK TCHAD',
        zone: 'CEMAC',
        city: 'N\'Djamena',
        currency: 'XAF'
    },
    'CORICFXA': {
        name: 'Coris Centrafrique',
        bic: 'CORICFXA',
        country: 'CF',
        countryCode: 'CF005',
        rtgsCode: 'CF00005',
        fullName: 'CORIS BANK CENTRAFRIQUE',
        zone: 'CEMAC',
        city: 'Bangui',
        currency: 'XAF'
    },
    'CORICMGQ': {
        name: 'Coris Guinée Éq.',
        bic: 'CORICMGQ',
        country: 'GQ',
        countryCode: 'GQ006',
        rtgsCode: 'GQ00006',
        fullName: 'CORIS BANK GUINEE EQUATORIALE',
        zone: 'CEMAC',
        city: 'Malabo',
        currency: 'XAF'
    }
};

// BIC de la BCEAO pour les messages RTGS
// BIC banques centrales
const BCEAO_BIC = 'BCAOSNDPAXXX'; // Banque Centrale — UEMOA
const BEAC_BIC = 'BEACCMCXXXX';  // Banque Centrale — CEMAC

// Banques émettrices possibles dans la zone UEMOA (pour simulation)
const SENDING_BANKS = [
    { bic: 'ECOCMLBA', name: 'ECOBANK MALI', rtgsCode: 'D00030901' },
    { bic: 'ECOCBFBF', name: 'ECOBANK BURKINA', rtgsCode: 'C00030831' },
    { bic: 'ECOCSNDA', name: 'ECOBANK SENEGAL', rtgsCode: 'K00030971' },
    { bic: 'ECOCCIAB', name: 'ECOBANK COTE D\'IVOIRE', rtgsCode: 'A00030661' },
    { bic: 'SGBFBFBF', name: 'SOCIETE GENERALE BURKINA', rtgsCode: 'C00030248' },
    { bic: 'SGMLMLBA', name: 'SOCIETE GENERALE MALI', rtgsCode: 'D00030281' },
    { bic: 'BBICBFBF', name: 'BANK OF AFRICA BURKINA', rtgsCode: 'C00030348' },
    { bic: 'BICIMLBA', name: 'BANK OF AFRICA MALI', rtgsCode: 'D00030381' },
    { bic: 'ATCOBFBF', name: 'ATLANTIC BANK BURKINA', rtgsCode: 'C00030448' },
    { bic: 'ATCOMLBA', name: 'ATLANTIC BANK MALI', rtgsCode: 'D00030481' }
];

// Noms de clients courants pour simulation
const CLIENT_NAMES = [
    'TRAORE SEYDOU',
    'COULIBALY MAMADOU',
    'DIARRA FATOUMATA',
    'KONE AMINATA',
    'OUEDRAOGO SOULEYMANE',
    'SAWADOGO RASMATA',
    'DIALLO BOUBACAR',
    'TOURE AISSATA',
    'SANGARE ABDOULAYE',
    'DIOP AWA',
    'FALL OMAR',
    'NDIAYE MARIAMA',
    'BAMBARA IBRAHIM',
    'SOW KADIATOU',
    'CISSE MOUSSA',
    'BAMBOO ROCK DRILLING SARL',
    'AFRIQUE TRADE COMPANY',
    'SAHEL DISTRIBUTION SA',
    'NIGER TELECOM',
    'OUEST AFRICAINE IMPORT EXPORT',
    'BURKINA CONSTRUCTION',
    'MALI LOGISTIQUE SARL',
    'SENEGAL SERVICES PLUS',
    'TOGO COMMERCE INTERNATIONAL',
    'BENIN AGRO BUSINESS'
];

// Motifs de paiement courants
const PAYMENT_PURPOSES = [
    'VIREMENT PERMANENT',
    'SALAIRE',
    'PAIEMENT FACTURE',
    'TRANSFERT COMMERCIAL',
    'REGLEMENT FOURNISSEUR',
    'PAIEMENT PRESTATION',
    'HONORAIRES',
    'LOYER',
    'REMBOURSEMENT',
    'AVANCE SUR COMMANDE'
];

// Formats de date SWIFT
function formatSwiftDate(date) {
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

function formatSwiftTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}${minutes}`;
}

// Générateur de référence unique SWIFT
function generateSwiftReference(prefix = 'O01SIP') {
    const timestamp = Date.now().toString().slice(-10);
    return `${prefix}${timestamp}`;
}

// Générateur de UUID pour le champ 121
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Générateur de numéro de séquence
function generateSequenceNumber() {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
}

// Validation d'IBAN
function isValidIBAN(iban) {
    // Suppression des espaces
    iban = iban.replace(/\s/g, '');

    // Vérification de la longueur (UEMOA: généralement 28 caractères)
    if (iban.length < 15 || iban.length > 34) {
        return false;
    }

    // Vérification du format (commence par 2 lettres pays)
    const countryCode = iban.substring(0, 2);
    const validCountries = ['BF', 'BJ', 'CI', 'GW', 'ML', 'NE', 'SN', 'TG'];

    return validCountries.includes(countryCode);
}

// Formatage du montant SWIFT (format: 123456789,00)
function formatSwiftAmount(amount) {
    // Arrondir à l'entier le plus proche (XOF n'a pas de décimales)
    const roundedAmount = Math.round(amount);
    return `${roundedAmount},`;
}

// Générateur de montant aléatoire
function generateRandomAmount(min, max) {
    // Génère un montant arrondi aux milliers
    const amount = Math.floor(Math.random() * (max - min + 1)) + min;
    return Math.round(amount / 1000) * 1000;
}

// Sélection aléatoire dans un tableau
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Export pour utilisation globale
window.FILIALES = FILIALES;
window.BCEAO_BIC = BCEAO_BIC;
window.BEAC_BIC = BEAC_BIC;
window.SENDING_BANKS = SENDING_BANKS;
window.CLIENT_NAMES = CLIENT_NAMES;
window.PAYMENT_PURPOSES = PAYMENT_PURPOSES;
window.formatSwiftDate = formatSwiftDate;
window.formatSwiftTime = formatSwiftTime;
window.generateSwiftReference = generateSwiftReference;
window.generateUUID = generateUUID;
window.generateSequenceNumber = generateSequenceNumber;
window.isValidIBAN = isValidIBAN;
window.formatSwiftAmount = formatSwiftAmount;
window.generateRandomAmount = generateRandomAmount;
window.getRandomItem = getRandomItem;
