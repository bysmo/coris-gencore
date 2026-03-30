// Configuration spécifique pour MT101

// Types de virements MT101
const MT101_TYPES = {
    'INTERNE': {
        name: 'Virement Interne',
        description: 'Virements entre comptes de la même filiale',
        currency: 'XOF',
        minAmount: 1000,
        maxAmount: 100000000,
        requiresRTGS: false,
        field23E: null
    },
    'COMPENSE': {
        name: 'Virement Compensé',
        description: 'Virements vers autres banques UEMOA (< 50M XOF, sans RTGS)',
        currency: 'XOF',
        minAmount: 1000,
        maxAmount: 49999999,
        requiresRTGS: false,
        field23E: null
    },
    'RTGS': {
        name: 'Virement RTGS',
        description: 'Virements RTGS vers confrères (> 50M XOF ou mention 23E:RTGS)',
        currency: 'XOF',
        minAmount: 50000000,
        maxAmount: 1000000000,
        requiresRTGS: true,
        field23E: 'RTGS'
    },
    'ETRANGER': {
        name: 'Transfert International',
        description: 'Virements vers l\'étranger ou en devises',
        currencies: ['EUR', 'USD', 'GBP', 'CHF', 'CAD'],
        minAmount: 100,
        maxAmount: 10000000,
        requiresRTGS: false,
        field23E: null,
        chargeOption: 'OUR' // OUR, SHA, BEN
    },
    'MIXTE': {
        name: 'Virement Mixte',
        description: 'Mélange de types (Interne, Compensé, RTGS, Étranger) et devises',
        currencies: ['XOF', 'EUR', 'USD', 'GBP', 'CHF', 'CAD'], // All currencies
        minAmount: 1000,
        maxAmount: 1000000000,
        requiresRTGS: false, // Variable per transaction
        field23E: null // Variable per transaction
    }
};

// Banques internationales pour virements étrangers
const INTERNATIONAL_BANKS = [
    { bic: 'CITIGB2L', name: 'CITIBANK LONDON', country: 'GB' },
    { bic: 'BNPAFRPP', name: 'BNP PARIBAS PARIS', country: 'FR' },
    { bic: 'DEUTDEFF', name: 'DEUTSCHE BANK FRANKFURT', country: 'DE' },
    { bic: 'CHASUS33', name: 'JP MORGAN CHASE NEW YORK', country: 'US' },
    { bic: 'UBSWCHZH', name: 'UBS SWITZERLAND ZURICH', country: 'CH' },
    { bic: 'HSBCGB2L', name: 'HSBC LONDON', country: 'GB' },
    { bic: 'CRLYFRPP', name: 'CREDIT LYONNAIS PARIS', country: 'FR' },
    { bic: 'RABONL2U', name: 'RABOBANK UTRECHT', country: 'NL' }
];

// Banques UEMOA pour virements compensés et RTGS
const UEMOA_BANKS = [
    { bic: 'ECOCMLBA', name: 'ECOBANK MALI', country: 'ML', rtgsCode: 'D00030901' },
    { bic: 'ECOCBFBF', name: 'ECOBANK BURKINA', country: 'BF', rtgsCode: 'C00030831' },
    { bic: 'ECOCSNDA', name: 'ECOBANK SENEGAL', country: 'SN', rtgsCode: 'K00030971' },
    { bic: 'ECOCCIAB', name: 'ECOBANK COTE D\'IVOIRE', country: 'CI', rtgsCode: 'A00030661' },
    { bic: 'SGBFBFBF', name: 'SOCIETE GENERALE BURKINA', country: 'BF', rtgsCode: 'C00030248' },
    { bic: 'SGMLMLBA', name: 'SOCIETE GENERALE MALI', country: 'ML', rtgsCode: 'D00030281' },
    { bic: 'BBICBFBF', name: 'BANK OF AFRICA BURKINA', country: 'BF', rtgsCode: 'C00030348' },
    { bic: 'BICIMLBA', name: 'BANK OF AFRICA MALI', country: 'ML', rtgsCode: 'D00030381' },
    { bic: 'ATCOBFBF', name: 'ATLANTIC BANK BURKINA', country: 'BF', rtgsCode: 'C00030448' },
    { bic: 'ATCOMLBA', name: 'ATLANTIC BANK MALI', country: 'ML', rtgsCode: 'D00030481' },
    { bic: 'CORIMLBA', name: 'CORIS BANK MALI', country: 'ML', rtgsCode: 'D00030181' },
    { bic: 'CORIBFBF', name: 'CORIS BANK BURKINA', country: 'BF', rtgsCode: 'C00030148' },
    { bic: 'CORISNDA', name: 'CORIS BANK SENEGAL', country: 'SN', rtgsCode: 'K00031971' },
    { bic: 'CORICIAB', name: 'CORIS BANK COTE D\'IVOIRE', country: 'CI', rtgsCode: 'A00031661' }
];

// Clients corporates typiques (donneurs d'ordre)
const CORPORATE_CLIENTS = [
    {
        name: 'HOUNDE GOLD OPERATION',
        address: 'Ouaga 2000 Zone A Secteur 53',
        city: 'Ouagadougou',
        country: 'BF',
        accountPrefix: '148010014'
    },
    {
        name: 'EXAFI SARL',
        address: 'Avenue de l\'Independence',
        city: 'Bamako',
        country: 'ML',
        accountPrefix: '181010010'
    },
    {
        name: 'SAHEL NEGOCE SA',
        address: 'Boulevard du 13 Janvier',
        city: 'Lome',
        country: 'TG',
        accountPrefix: '182010015'
    },
    {
        name: 'BURKINA MINING COMPANY',
        address: 'Zone Industrielle',
        city: 'Bobo-Dioulasso',
        country: 'BF',
        accountPrefix: '148010025'
    },
    {
        name: 'MALI COTTON EXPORT',
        address: 'Rue Kasse Keita',
        city: 'Bamako',
        country: 'ML',
        accountPrefix: '181010020'
    },
    {
        name: 'SENEGAL AGRO BUSINESS',
        address: 'Route de Rufisque',
        city: 'Dakar',
        country: 'SN',
        accountPrefix: '213010030'
    },
    {
        name: 'IVOIRE TELECOM SERVICES',
        address: 'Plateau Rue des Jardins',
        city: 'Abidjan',
        country: 'CI',
        accountPrefix: '166010040'
    },
    {
        name: 'NIGER TRANSPORT INTERNATIONAL',
        address: 'Avenue Kwame Nkrumah',
        city: 'Niamey',
        country: 'NE',
        accountPrefix: '210010050'
    }
];

// Bénéficiaires typiques
const BENEFICIARIES = [
    { name: 'TRAORE SEYDOU', type: 'INDIVIDUAL' },
    { name: 'COULIBALY MAMADOU', type: 'INDIVIDUAL' },
    { name: 'DIARRA FATOUMATA', type: 'INDIVIDUAL' },
    { name: 'KONE AMINATA', type: 'INDIVIDUAL' },
    { name: 'SAWADOGO IBRAHIM', type: 'INDIVIDUAL' },
    { name: 'COLLEGE GIRA IMANA', type: 'CORPORATE' },
    { name: 'EXAFI', type: 'CORPORATE' },
    { name: 'PHARMACIE CENTRALE', type: 'CORPORATE' },
    { name: 'EPICERIE DU MARCHE', type: 'CORPORATE' },
    { name: 'GARAGE AUTO SERVICE', type: 'CORPORATE' },
    { name: 'Lafigue Holdings UK Limited', type: 'INTERNATIONAL' },
    { name: 'Global Trade Partners SA', type: 'INTERNATIONAL' },
    { name: 'European Investment Group', type: 'INTERNATIONAL' }
];

// Motifs de paiement MT101
const MT101_PAYMENT_PURPOSES = [
    '/ROC/SALAIRE/JANVIER2026',
    '/ROC/FACTURE/INV-2024-001',
    '/ROC/PAIEMENT/FOURNISSEUR',
    '/ROC/TRANSFERT/COMMERCIAL',
    '/ROC/REGLEMENT/PRESTATION',
    '/ROC/TEST/BENEFICIAIRE01',
    '/ROC/TEST/BENEFICIAIRE02',
    '/ROC/HONORAIRES/CONSULTANT',
    '/ROC/LOYER/BUREAU',
    '/ROC/ACHAT/MARCHANDISES'
];

// Taux de change indicatifs (pour devises étrangères)
const EXCHANGE_RATES = {
    'EUR': 655.957, // 1 EUR = 655.957 XOF (taux fixe)
    'USD': 580.0,   // 1 USD ≈ 580 XOF
    'GBP': 750.0,   // 1 GBP ≈ 750 XOF
    'CHF': 620.0,   // 1 CHF ≈ 620 XOF
    'CAD': 420.0    // 1 CAD ≈ 420 XOF
};

// Génère un numéro de compte pour MT101
function generateMT101AccountNumber(prefix, type) {
    const suffix = Math.floor(Math.random() * 900000000) + 100000000;
    return `${prefix}${suffix}`;
}

// Génère une référence MT101
function generateMT101Reference(prefix = 'MT101AUTO') {
    const num = Math.floor(Math.random() * 9000) + 1000;
    return `${prefix}${String(num).padStart(3, '0')}`;
}

// Génère un numéro de séquence MT101
function generateMT101SequenceNumber() {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
}

// Format IBAN selon le pays
function formatMT101IBAN(country, filialeBIC, accountNumber) {
    // Format: CC + CheckDigits + BankCode + AccountNumber
    const countryCode = country;
    const checkDigits = '00'; // Simplifié pour tests
    const bankCode = filialeBIC.substring(0, 3) + filialeBIC.substring(6, 8);

    // Tronquer ou compléter le numéro de compte
    const formattedAccount = accountNumber.padEnd(20, '0').substring(0, 20);

    return `${countryCode}${checkDigits}${bankCode}${formattedAccount}`;
}

// Export des constantes
window.MT101_TYPES = MT101_TYPES;
window.INTERNATIONAL_BANKS = INTERNATIONAL_BANKS;
window.UEMOA_BANKS = UEMOA_BANKS;
window.CORPORATE_CLIENTS = CORPORATE_CLIENTS;
window.BENEFICIARIES = BENEFICIARIES;
window.MT101_PAYMENT_PURPOSES = MT101_PAYMENT_PURPOSES;
window.EXCHANGE_RATES = EXCHANGE_RATES;
window.generateMT101AccountNumber = generateMT101AccountNumber;
window.generateMT101Reference = generateMT101Reference;
window.generateMT101SequenceNumber = generateMT101SequenceNumber;
window.formatMT101IBAN = formatMT101IBAN;
