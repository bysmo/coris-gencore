/**
 * Générateur de messages MT910 (Confirmation d'avis de crédit RTGS)
 * Les MT910 sont envoyés par la BCEAO aux banques commerciales
 * pour confirmer les crédits RTGS sur leur compte
 */

class MT910Generator {
    constructor() {
        this.generatedMT910s = [];
    }

    /**
     * Génère un MT910 de confirmation pour un MT103 RTGS
     */
    generateMT910FromMT103(mt103Data) {
        const {
            mt103Reference,      // Référence du MT103 (:20:)
            filiale,            // Filiale créditée
            amount,             // Montant
            swiftDate,          // Date valeur (YYMMDD)
            swiftTime           // Heure (HHMM)
        } = mt103Data;

        const sequenceNumber = generateSequenceNumber();
        const mt910Reference = this.generateMT910Reference();
        const checksum = this.generateChecksum();

        // Construction du message MT910
        const mt910 = this.buildMT910Message({
            sequenceNumber,
            mt910Reference,
            mt103Reference,
            filiale,
            amount,
            swiftDate,
            swiftTime,
            checksum
        });

        return mt910;
    }

    /**
     * Construction du message MT910
     */
    buildMT910Message(params) {
        const {
            sequenceNumber,
            mt910Reference,
            mt103Reference,
            filiale,
            amount,
            swiftDate,
            swiftTime,
            checksum
        } = params;

        const filialeBIC = filiale.bic;
        const filialeRTGS = filiale.rtgsCode;
        const formattedAmount = formatSwiftAmount(amount);

        let message = '';

        // Block 1: Basic Header Block (banque destinataire)
        message += `{1:F21${filialeBIC}AXXX${sequenceNumber}}`;

        // Block 4: Tag 177 et 451
        message += `{4:{177:${swiftDate}${swiftTime}}{451:0}}`;

        // Block 1 répété: Application Header
        message += `{1:F01${filialeBIC}AXXX${sequenceNumber}}`;

        // Block 2: Application Header Block (MT910 output)
        // Format: O910 + time + date + BCEAO BIC + sequence + date + time + N
        message += `{2:O910${swiftTime}${swiftDate}${BCEAO_BIC}31210${String(Math.floor(Math.random() * 900000) + 100000)}${swiftDate}${swiftTime}N}`;

        // Block 3: User Header Block
        // Code service bancaire + référence du MT103
        const serviceCode = this.generateServiceCode();
        message += `{3:{113:${serviceCode}}{108:${mt103Reference}}}`;

        // Block 4: Text Block (corps du MT910)
        message += `{4:\n`;
        
        // :20: Référence MT910
        message += `:20:${mt910Reference}\n`;
        
        // :21: Référence liée (= référence du MT103)
        message += `:21:${mt103Reference}\n`;
        
        // :25: Compte à créditer (code RTGS de la filiale)
        message += `:25:${filialeRTGS}\n`;
        
        // :32A: Date valeur, devise, montant
        message += `:32A:${swiftDate}XOF${formattedAmount}\n`;
        
        // :52A: Institution débitrice (BCEAO)
        message += `:52A:${BCEAO_BIC}\n`;
        
        // :72: Informations supplémentaires (optionnel selon exemple)
        const clearingInfo = this.generateClearingInfo(serviceCode, filialeBIC);
        if (clearingInfo) {
            message += `:72:${clearingInfo}\n`;
        }
        
        message += `-}`;

        // Block 5: Trailer Block
        message += `{5:{CHK:${checksum}}}`;

        // Block S: System Block
        message += `{S:{COP:S}}`;

        // Padding pour alignement (environ 200 caractères)
        const padding = ' '.repeat(200);
        message += padding;

        return message;
    }

    /**
     * Génère une référence MT910
     */
    generateMT910Reference() {
        const randomNum = Math.floor(Math.random() * 900000000) + 100000000;
        return `${randomNum}/910`;
    }

    /**
     * Génère un code de service bancaire
     */
    generateServiceCode() {
        const codes = ['0003', '0020', '0030', '0040'];
        return getRandomItem(codes);
    }

    /**
     * Génère les informations de clearing
     */
    generateClearingInfo(serviceCode, filialeBIC) {
        // Selon l'exemple, format: /CLRBRVM/code /SGI/BIC
        // Pas toujours présent
        if (Math.random() > 0.5) {
            return `/CLRBRVM/${serviceCode}\n/SGI/${filialeBIC}XXXX`;
        }
        return null;
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
     * Génère un fichier MT910 consolidé pour tous les MT103
     */
    generateConsolidatedMT910File(mt103List, filiale) {
        let fileContent = '';
        let mt910Count = 0;

        mt103List.forEach(mt103Data => {
            const mt910 = this.generateMT910FromMT103(mt103Data);
            fileContent += mt910 + '\n';
            mt910Count++;
        });

        const timestamp = formatSwiftDate(new Date()) + '_' + formatSwiftTime(new Date());
        const fileName = `MT910_CONFIRMATION_${filiale.bic}_${timestamp}.txt`;

        return {
            name: fileName,
            content: fileContent,
            messagesCount: mt910Count,
            filiale: filiale.name
        };
    }

    /**
     * Télécharge le fichier MT910
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

// Export pour utilisation globale
window.MT910Generator = MT910Generator;
