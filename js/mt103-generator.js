/**
 * Générateur de messages MT103 RTGS BCEAO
 * Conforme au format SWIFT et aux spécifications RTGS de la BCEAO
 */

class MT103Generator {
    constructor(config) {
        this.config = config;
        this.generatedFiles = [];
        this.mt103DataList = []; // Pour stocker les données MT103 pour les MT910
    }

    /**
     * Génère un message MT103 complet
     */
    generateMT103(beneficiaryIBAN, senderBank, receiverFiliale, valueDate, amount, orderingCustomer, remittanceInfo) {
        const sequenceNumber = generateSequenceNumber();
        const reference = generateSwiftReference();
        const uuid = generateUUID();
        const swiftDate = formatSwiftDate(valueDate);
        const swiftTime = formatSwiftTime(new Date());
        
        // Construction du message selon la structure BCEAO
        const mt103 = this.buildMT103Message({
            sequenceNumber,
            reference,
            uuid,
            swiftDate,
            swiftTime,
            senderBank,
            receiverFiliale,
            beneficiaryIBAN,
            amount,
            orderingCustomer,
            remittanceInfo
        });

        // Stocker les données pour génération MT910
        this.mt103DataList.push({
            mt103Reference: reference,
            filiale: receiverFiliale,
            amount: amount,
            swiftDate: swiftDate,
            swiftTime: swiftTime
        });

        return mt103;
    }

    /**
     * Construction du message MT103 selon le format BCEAO
     */
    buildMT103Message(params) {
        const {
            sequenceNumber,
            reference,
            uuid,
            swiftDate,
            swiftTime,
            senderBank,
            receiverFiliale,
            beneficiaryIBAN,
            amount,
            orderingCustomer,
            remittanceInfo
        } = params;

        const receiverBIC = receiverFiliale.bic;
        const receiverRTGS = receiverFiliale.rtgsCode;
        const senderBIC = senderBank.bic;
        const senderRTGS = senderBank.rtgsCode;
        const formattedAmount = formatSwiftAmount(amount);

        // Construction du message selon le format BCEAO analysé
        let message = '';

        // Block 1: Basic Header Block (envoi)
        message += `{1:F21${receiverBIC}AXXX${sequenceNumber}}`;

        // Block 4: Tag 177 et 451
        message += `{4:{177:${swiftDate}${swiftTime}}{451:0}}`;

        // Block 1 répété: Application Header
        message += `{1:F01${receiverBIC}AXXX${sequenceNumber}}`;

        // Block 2: Application Header Block (output)
        message += `{2:O103${swiftTime}${swiftDate}${BCEAO_BIC}31220255${Math.floor(Math.random() * 1000)}${swiftDate}${swiftTime}N}`;

        // Block 3: User Header Block
        message += `{3:{113:0030}{108:${reference}}{121:${uuid}}}`;

        // Block 4: Text Block (corps du message MT103)
        message += `{4:\n`;
        message += `:20:${reference}\n`;
        message += `:23B:CRED\n`;
        message += `:23E:SDVA\n`;
        message += `:26T:001\n`;
        message += `:32A:${swiftDate}XOF${formattedAmount}\n`;
        
        // Champ 50K: Ordering Customer (Client donneur d'ordre)
        const accountNumber = this.generateAccountNumber(senderBank);
        message += `:50K:/${accountNumber}\n`;
        message += `//${orderingCustomer}\n`;
        
        // Champ 53A: Sender's Correspondent (Banque émettrice)
        message += `:53A:/D/${senderRTGS}\n`;
        message += `${senderBIC}\n`;
        
        // Champ 57A: Account With Institution (Banque réceptrice)
        message += `:57A:/C/${receiverRTGS}\n`;
        message += `${receiverBIC}\n`;
        
        // Champ 59: Beneficiary Customer (Bénéficiaire)
        message += `:59:/${beneficiaryIBAN}\n`;
        const beneficiaryName = this.extractBeneficiaryName(orderingCustomer);
        message += `//${beneficiaryName}\n`;
        
        // Champ 70: Remittance Information
        message += `:70:${remittanceInfo}\n`;
        
        // Champ 71A: Details of Charges
        message += `:71A:SHA\n`;
        
        // Champ 72: Sender to Receiver Information
        message += `:72:/CODTYPTR/001\n`;
        
        message += `-}`;

        // Block 5: Trailer Block
        message += `{5:{MAC:00000000}{CHK:${this.generateChecksum()}}}`;

        // Block S: System Block
        message += `{S:{SAC:}{COP:S}}`;

        return message;
    }

    /**
     * Génère un numéro de compte bancaire aléatoire
     */
    generateAccountNumber(bank) {
        const prefix = Math.floor(Math.random() * 900000) + 100000;
        const suffix = Math.floor(Math.random() * 900000) + 100000;
        return `${prefix}${suffix}`;
    }

    /**
     * Extrait ou génère un nom de bénéficiaire
     */
    extractBeneficiaryName(orderingCustomer) {
        // Prend la première ligne du nom du client donneur d'ordre
        const lines = orderingCustomer.split('\n');
        return lines[0].trim() || getRandomItem(CLIENT_NAMES);
    }

    /**
     * Génère un checksum pour le champ CHK
     */
    generateChecksum() {
        const chars = '0123456789ABCDEF';
        let checksum = '';
        for (let i = 0; i < 12; i++) {
            checksum += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return checksum;
    }

    /**
     * Génère plusieurs messages MT103 et crée un fichier
     */
    generateFile(fileIndex, ibans, config) {
        const {
            filiale,
            valueDate,
            transactionsPerFile,
            minAmount,
            maxAmount,
            orderingCustomer,
            remittanceInfo
        } = config;

        const receiverFiliale = FILIALES[filiale];
        let fileContent = '';
        let messagesGenerated = 0;

        // Génère le nombre de transactions demandé
        for (let i = 0; i < transactionsPerFile; i++) {
            // Sélectionne un IBAN bénéficiaire (rotation circulaire)
            const ibanIndex = i % ibans.length;
            const beneficiaryIBAN = ibans[ibanIndex];

            // Sélectionne une banque émettrice aléatoire
            const senderBank = getRandomItem(SENDING_BANKS);

            // Génère un montant aléatoire
            const amount = generateRandomAmount(minAmount, maxAmount);

            // Détermine le client donneur d'ordre
            const customer = orderingCustomer || getRandomItem(CLIENT_NAMES);

            // Détermine le motif de paiement
            const purpose = remittanceInfo || getRandomItem(PAYMENT_PURPOSES);

            // Génère le message MT103
            const mt103 = this.generateMT103(
                beneficiaryIBAN,
                senderBank,
                receiverFiliale,
                valueDate,
                amount,
                customer,
                purpose
            );

            // Ajoute le message au contenu du fichier
            fileContent += mt103 + '\n\n';
            messagesGenerated++;
        }

        return {
            content: fileContent,
            messagesCount: messagesGenerated,
            filiale: receiverFiliale.name,
            fileIndex: fileIndex
        };
    }

    /**
     * Génère tous les fichiers demandés
     */
    generateAllFiles(ibans, config) {
        const { fileCount, filePrefix } = config;
        this.generatedFiles = [];

        for (let i = 0; i < fileCount; i++) {
            const fileData = this.generateFile(i + 1, ibans, config);
            
            // Nom du fichier avec timestamp
            const timestamp = formatSwiftDate(new Date()) + '_' + formatSwiftTime(new Date());
            const fileName = `${filePrefix}_${config.filiale}_${timestamp}_${String(i + 1).padStart(3, '0')}.txt`;

            this.generatedFiles.push({
                name: fileName,
                content: fileData.content,
                messagesCount: fileData.messagesCount,
                filiale: fileData.filiale
            });
        }

        return this.generatedFiles;
    }

    /**
     * Génère le fichier MT910 consolidé pour tous les MT103 générés
     */
    generateMT910ConfirmationFile(config) {
        if (this.mt103DataList.length === 0) {
            return null;
        }

        const mt910Generator = new MT910Generator();
        const filiale = FILIALES[config.filiale];
        
        const mt910File = mt910Generator.generateConsolidatedMT910File(
            this.mt103DataList,
            filiale
        );

        return mt910File;
    }

    /**
     * Réinitialise la liste des données MT103
     */
    resetMT103DataList() {
        this.mt103DataList = [];
    }

    /**
     * Télécharge un fichier individuel
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

    /**
     * Télécharge tous les fichiers dans un ZIP
     */
    static async downloadAllAsZip(files, zipName) {
        // Cette fonction nécessite une bibliothèque ZIP
        // Pour simplifier, on télécharge les fichiers individuellement
        files.forEach(file => {
            MT103Generator.downloadFile(file.name, file.content);
        });
        
        alert(`${files.length} fichier(s) téléchargé(s) avec succès!`);
    }
}

// Export pour utilisation globale
window.MT103Generator = MT103Generator;
