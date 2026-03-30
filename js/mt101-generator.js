/**
 * Générateur de messages MT101
 * Conforme au standard SWIFT MT101 (Request for Transfer)
 *
 * Structure correcte d'un fichier MT101 :
 *  - Un seul message SWIFT par fichier (blocs 1, 2, 4)
 *  - Bloc 4 : entête unique (:20: → :50H:)
 *             + N séquences transaction répétées (:21: → :71A:)
 */

class MT101Generator {
    constructor(config) {
        this.config = config;
        this.generatedFiles = [];
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GÉNÉRATION D'UN FICHIER MT101 COMPLET
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Génère un fichier MT101 contenant N transactions (bénéficiaires)
     * dans UN SEUL message SWIFT.
     *
     * Pour le mode MIXTE, chaque transaction peut être d'un type différent
     * (INTERNE, COMPENSE, RTGS, ETRANGER), mais elles sont toutes regroupées
     * dans le même bloc 4.
     */
    generateFile(fileIndex, config) {
        const { filiale, type, transactionsPerFile } = config;

        // 1. Générer toutes les transactions
        const transactions = [];
        for (let i = 0; i < transactionsPerFile; i++) {
            let currentType = type;
            let currentConfig = { ...config };

            if (type === 'MIXTE') {
                const types = ['INTERNE', 'COMPENSE', 'RTGS', 'ETRANGER'];
                currentType = getRandomItem(types);

                // Ajuster le montant minimum pour RTGS
                if (currentType === 'RTGS' && (!config.minAmount || config.minAmount < 50000000)) {
                    currentConfig.minAmount = 50000000;
                    currentConfig.maxAmount = Math.max(config.maxAmount || 1000000000, 100000000);
                }
            }

            const txData = this.generateTransactionData(currentType, filiale, currentConfig);
            transactions.push(txData);
        }

        // 2. Construire le message MT101 complet
        const messageContent = this.buildMT101Message(filiale, transactions, config);

        return {
            content: messageContent,
            messagesCount: transactions.length,
            type: MT101_TYPES[type].name,
            filiale: filiale.name
        };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CONSTRUCTION DU MESSAGE MT101
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Construit le message MT101 complet avec :
     *  - Bloc 1 et 2 (headers SWIFT)
     *  - Bloc 4 : entête une fois + séquences transaction répétées
     */
    buildMT101Message(filiale, transactions, config) {
        const sequenceNumber = generateMT101SequenceNumber();
        const fileReference = generateMT101Reference('MT101');
        const swiftDate = formatSwiftDate(config.valueDate || new Date());
        const swiftTime = formatSwiftTime(new Date());
        const filialeBIC = filiale.bic;
        const nbTransactions = transactions.length;

        // Prendre le premier client corporate comme donneur d'ordre
        const firstTx = transactions[0];
        const orderingCustomer = firstTx.orderingCustomer;

        let message = '';

        // ── Bloc 1 : Basic Header ──────────────────────────────────────────
        message += `{1:F01${filialeBIC}XXXX${sequenceNumber}}`;

        // ── Bloc 2 : Application Header (MT101 outgoing) ──────────────────
        message += `{2:I101${filialeBIC}XXXXN}`;

        // ── Bloc 4 : Text Block ────────────────────────────────────────────
        message += `{4:\n`;

        // --- Entête du fichier (une seule fois) ---
        // :20: Référence du fichier
        message += `:20:${fileReference}\n`;

        // :21R: Related Reference
        message += `:21R:${fileReference}\n`;

        // :28D: Message Index (séquence/total) — 1/N pour un fichier unique
        message += `:28D:1/${nbTransactions}\n`;

        // :30: Date de valeur
        message += `:30:${swiftDate}\n`;

        // :50H: Ordering Customer (donneur d'ordre) — une seule fois
        message += `:50H:/${orderingCustomer.account}\n`;
        message += `${orderingCustomer.name}\n`;
        message += `${orderingCustomer.address}\n`;
        message += `${orderingCustomer.country}/${orderingCustomer.city}\n`;

        // --- Séquences transaction (répétées N fois, une par bénéficiaire) ---
        transactions.forEach((tx, index) => {
            message += this.buildTransactionBlock(tx, index + 1);
        });

        message += `-}`;

        return message;
    }

    /**
     * Construit le bloc transaction pour UN bénéficiaire.
     * Ces champs sont répétés pour chaque bénéficiaire dans le bloc 4.
     *
     * Champs répétés (de :21: à :71A:) :
     *   :21:  Reference du virement
     *   :32B: Devise et montant
     *   :57A: Banque du bénéficiaire (si applicable)
     *   :59:  Compte et nom du bénéficiaire
     *   :70:  Motif de paiement
     *   :71A: Option de frais
     *   :23E: Instruction RTGS (si applicable)
     */
    buildTransactionBlock(tx, seqNum) {
        let block = '';
        const formattedAmount = this.formatMT101Amount(tx.amount, tx.currency);

        // :21: Référence unique de la transaction
        block += `:21:${tx.reference}\n`;

        // :32B: Devise + Montant
        block += `:32B:${tx.currency}${formattedAmount}\n`;

        // :57A: Banque du bénéficiaire (Account With Institution)
        if (tx.beneficiary.bic) {
            block += `:57A:${tx.beneficiary.bic}\n`;
        }

        // :59: Bénéficiaire (compte + nom + adresse)
        if (tx.beneficiary.account) {
            block += `:59:/${tx.beneficiary.account}\n`;
        } else {
            block += `:59:\n`;
        }
        block += `${tx.beneficiary.name}\n`;
        if (tx.beneficiary.address) {
            block += `${tx.beneficiary.address}\n`;
        }
        if (tx.beneficiary.country && tx.beneficiary.city) {
            block += `${tx.beneficiary.country}/${tx.beneficiary.city}\n`;
        }

        // :70: Motif de paiement (Remittance Information)
        block += `:70:${tx.purpose}\n`;

        // :71A: Option de frais
        block += `:71A:${tx.chargeOption || 'SHA'}\n`;

        // :23E: Instruction spéciale RTGS (si type RTGS)
        if (tx.type === 'RTGS') {
            block += `:23E:RTGS\n`;
        }

        return block;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GÉNÉRATION DES DONNÉES DE TRANSACTION
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Génère les données d'une transaction selon son type
     */
    generateTransactionData(type, filiale, config) {
        const mt101Type = MT101_TYPES[type];
        let currency, amount, beneficiary, chargeOption;

        // Sélection du donneur d'ordre
        const corporateClient = getRandomItem(CORPORATE_CLIENTS);
        const orderingCustomer = {
            name: corporateClient.name,
            address: corporateClient.address,
            city: corporateClient.city,
            country: corporateClient.country,
            account: generateMT101AccountNumber(corporateClient.accountPrefix, type),
            bic: filiale.bic
        };

        // Génération selon le type
        switch (type) {
            case 'INTERNE':
                currency = 'XOF';
                amount = generateRandomAmount(
                    config.minAmount || mt101Type.minAmount,
                    config.maxAmount || mt101Type.maxAmount
                );
                beneficiary = this.generateInternalBeneficiary(filiale);
                chargeOption = 'SHA';
                break;

            case 'COMPENSE':
                currency = 'XOF';
                amount = generateRandomAmount(
                    config.minAmount || mt101Type.minAmount,
                    Math.min(config.maxAmount || mt101Type.maxAmount, 49999000)
                );
                beneficiary = this.generateCompenseBeneficiary();
                chargeOption = 'SHA';
                break;

            case 'RTGS':
                currency = 'XOF';
                amount = generateRandomAmount(
                    Math.max(config.minAmount || mt101Type.minAmount, 50000000),
                    config.maxAmount || mt101Type.maxAmount
                );
                beneficiary = this.generateRTGSBeneficiary();
                chargeOption = 'SHA';
                break;

            case 'ETRANGER':
                const currencies = mt101Type.currencies;
                currency = (config.currency && config.currency !== 'XOF' && config.currency !== 'Mixte')
                    ? config.currency
                    : getRandomItem(currencies);
                amount = generateRandomAmount(
                    config.minAmount || mt101Type.minAmount,
                    config.maxAmount || mt101Type.maxAmount
                );
                beneficiary = this.generateInternationalBeneficiary();
                chargeOption = config.chargeOption || 'OUR';
                break;

            default:
                currency = 'XOF';
                amount = generateRandomAmount(1000, 1000000);
                beneficiary = this.generateInternalBeneficiary(filiale);
                chargeOption = 'SHA';
        }

        const purpose = config.purpose || getRandomItem(MT101_PAYMENT_PURPOSES);

        return {
            type,
            orderingCustomer,
            beneficiary,
            amount,
            currency,
            purpose,
            chargeOption,
            reference: generateMT101Reference('TXN')
        };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GÉNÉRATEURS DE BÉNÉFICIAIRES
    // ─────────────────────────────────────────────────────────────────────────

    generateInternalBeneficiary(filiale) {
        const benef = getRandomItem(BENEFICIARIES.filter(b => b.type !== 'INTERNATIONAL'));
        return {
            name: benef.name,
            account: formatMT101IBAN(filiale.country, filiale.bic,
                generateMT101AccountNumber('010', 'INTERNE')),
            bic: null,
            country: filiale.country,
            city: filiale.city || 'NA'
        };
    }

    generateCompenseBeneficiary() {
        const benef = getRandomItem(BENEFICIARIES.filter(b => b.type !== 'INTERNATIONAL'));
        const bank = getRandomItem(UEMOA_BANKS);
        return {
            name: benef.name,
            account: formatMT101IBAN(bank.country, bank.bic,
                generateMT101AccountNumber('020', 'COMPENSE')),
            bic: bank.bic,
            country: bank.country,
            city: bank.name.split(' ').pop() || 'NA'
        };
    }

    generateRTGSBeneficiary() {
        const benef = getRandomItem(BENEFICIARIES.filter(b => b.type !== 'INTERNATIONAL'));
        const bank = getRandomItem(UEMOA_BANKS);
        return {
            name: benef.name,
            account: formatMT101IBAN(bank.country, bank.bic,
                generateMT101AccountNumber('030', 'RTGS')),
            bic: bank.bic,
            country: bank.country,
            city: bank.name.split(' ').pop() || 'NA'
        };
    }

    generateInternationalBeneficiary() {
        const benef = getRandomItem(BENEFICIARIES.filter(b => b.type === 'INTERNATIONAL'));
        const bank = getRandomItem(INTERNATIONAL_BANKS);
        return {
            name: benef.name,
            account: `GB19CITI${Math.floor(Math.random() * 900000000000) + 100000000000}`,
            bic: bank.bic,
            address: '2nd Floor, International House',
            country: bank.country,
            city: bank.name.split(' ').pop() || 'London'
        };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GÉNÉRATION DE TOUS LES FICHIERS
    // ─────────────────────────────────────────────────────────────────────────

    generateAllFiles(config) {
        const { fileCount, filePrefix, filiale, type } = config;
        this.generatedFiles = [];

        for (let i = 0; i < fileCount; i++) {
            const fileData = this.generateFile(i + 1, config);

            const timestamp = formatSwiftDate(new Date()) + '_' + formatSwiftTime(new Date());
            const typeCode = type.toLowerCase();
            const fileName = `${filePrefix}_${filiale.bic}_${typeCode}_${timestamp}_${String(i + 1).padStart(3, '0')}.txt`;

            this.generatedFiles.push({
                name: fileName,
                content: fileData.content,
                messagesCount: fileData.messagesCount,
                type: fileData.type,
                filiale: fileData.filiale
            });
        }

        return this.generatedFiles;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UTILITAIRES
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Formate un montant selon la devise (XOF = sans décimales)
     */
    formatMT101Amount(amount, currency) {
        if (currency === 'XOF' || currency === 'XAF') {
            return `${Math.round(amount)},`;
        } else {
            return `${parseFloat(amount).toFixed(2).replace('.', ',')}`;
        }
    }

    /**
     * Télécharge un fichier
     */
    static downloadFile(fileName, content) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Export
window.MT101Generator = MT101Generator;
