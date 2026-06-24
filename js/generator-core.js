/**
 * Moteur de Génération Unifié - CORIS Bank International
 * Gère la génération de 15 formats MT (SWIFT classique) et MX (ISO 20022 XML)
 */

class GeneratorCore {
    constructor(config) {
        this.config = config;
        this.filiale = FILIALES[config.filiale] || FILIALES['CORIBFBF'];
    }

    // =========================================================================
    // 1. GÉNÉRATION DES FLUX DE VIREMENTS / PAIEMENTS (Non-Reporting)
    // =========================================================================

    /**
     * Génère les fichiers de paiement à partir d'une liste de bénéficiaires
     */
    generatePaymentFiles(format, ibans, config) {
        const { fileCount, transactionsPerFile, filePrefix } = config;
        const generatedFiles = [];
        const timestamp = formatSwiftDate(new Date()) + '_' + formatSwiftTime(new Date());

        for (let f = 0; f < fileCount; f++) {
            // Regrouper les bénéficiaires pour ce fichier
            const fileIbans = [];
            for (let t = 0; t < transactionsPerFile; t++) {
                const idx = (f * transactionsPerFile + t) % ibans.length;
                fileIbans.push(ibans[idx]);
            }

            // Générer le contenu selon le format
            const content = this.buildPaymentFileContent(format, fileIbans, config, f + 1);
            const ext = this.isXmlFormat(format) ? 'xml' : 'txt';
            const fileName = `${filePrefix || format.replace('.', '_')}_${this.filiale.bic}_${timestamp}_${String(f + 1).padStart(3, '0')}.${ext}`;

            generatedFiles.push({
                name: fileName,
                content: content,
                messagesCount: fileIbans.length,
                filiale: this.filiale.name,
                format: format
            });
        }

        return generatedFiles;
    }

    /**
     * Construit le contenu du fichier de paiement
     */
    buildPaymentFileContent(format, ibans, config, fileIndex) {
        // Préparer les données communes
        const txs = ibans.map((iban, i) => {
            const amount = generateRandomAmount(config.minAmount, config.maxAmount);
            const orderingName = config.orderingCustomer || getRandomItem(CLIENT_NAMES);
            const purpose = config.remittanceInfo || getRandomItem(PAYMENT_PURPOSES);
            const ref = generateSwiftReference('TXN');
            const uetr = generateUUID();
            const date = config.valueDate || new Date();
            
            // Déterminer la banque du bénéficiaire
            let destBank = getRandomItem(SENDING_BANKS);
            if (this.filiale.zone === 'CEMAC') {
                destBank = { bic: 'ECOCCMCX', name: 'ECOBANK CAMEROUN', rtgsCode: 'CM00030901' };
            } else if (this.filiale.zone === 'BCRG') {
                destBank = { bic: 'ECOCGNCON', name: 'ECOBANK GUINEE', rtgsCode: 'GN00030901' };
            }

            return {
                iban,
                amount,
                orderingName,
                purpose,
                ref,
                uetr,
                date,
                destBank
            };
        });

        // Appeler le constructeur spécifique
        // Appeler le constructeur spécifique
        switch (format) {
            case 'mt101':
                return this.buildMT101(txs, config, fileIndex);
            case 'pain.001':
                return this.buildPain001(txs, config);
            
            // MT103 RTGS
            case 'mt103-rtgs-emis':
                return this.buildMT103(txs, config, { isRtgs: true, isEmis: true });
            case 'mt103-rtgs-recus':
            case 'mt103-rtgs': // Keep fallback
                return this.buildMT103(txs, config, { isRtgs: true, isEmis: false });
            case 'mt103-rtgs-emis-res':
                return this.buildMT103(txs, config, { isRtgs: true, isEmis: true, isRes: true });
            case 'mt103-rtgs-recus-b2b':
                return this.buildMT103(txs, config, { isRtgs: true, isEmis: false, isB2b: true });
            
            // MT103 International / CBPR+
            case 'mt103-transfert-international-emis':
            case 'mt103-intl': // Keep fallback
                return this.buildMT103(txs, config, { isRtgs: false, isEmis: true });
            case 'mt103-transfert-international-recus':
                return this.buildMT103(txs, config, { isRtgs: false, isEmis: false });
            
            // MT202
            case 'mt202-rtgs-emis-b2b':
                return this.buildMT202(txs, config, { isEmis: true, variant: 'b2b' });
            case 'mt202-rtgs-emis-res':
                return this.buildMT202(txs, config, { isEmis: true, variant: 'res' });
            case 'mt202-rtgs-recus':
            case 'mt202': // Keep fallback
                return this.buildMT202(txs, config, { isEmis: false });
            
            // PACS.008 HVPS+
            case 'pacs.008-hvps-emis':
                return this.buildPacs008(txs, config, 'HVPS+', { isEmis: true });
            case 'pacs.008-hvps-recus':
            case 'pacs.008-hvps': // Keep fallback
                return this.buildPacs008(txs, config, 'HVPS+', { isEmis: false });
            
            // PACS.009 HVPS+
            case 'pacs.009-hvps-emis':
                return this.buildPacs009(txs, config, 'HVPS+', { isEmis: true });
            case 'pacs.009-hvps-recus':
                return this.buildPacs009(txs, config, 'HVPS+', { isEmis: false });
            
            // PACS.008 CBPR+
            case 'pacs.008-cbpr-emis':
            case 'pacs.008-cbpr': // Keep fallback
                return this.buildPacs008(txs, config, 'CBPR+', { isEmis: true });
            case 'pacs.008-cbpr-recus':
                return this.buildPacs008(txs, config, 'CBPR+', { isEmis: false });
            
            // PACS.009 CBPR+
            case 'pacs.009-cbpr-emis':
                return this.buildPacs009(txs, config, 'CBPR+', { isEmis: true });
            case 'pacs.009-cbpr-recus':
                return this.buildPacs009(txs, config, 'CBPR+', { isEmis: false });
            
            // PACS.004
            case 'pacs.004':
                return this.buildPacs004(txs, config);
            
            // MT199 / MT299
            case 'mt199':
                return this.buildMT199(txs, config);
            case 'mt299':
                return this.buildMT299(txs, config);
            
            // Status Reports
            case 'pacs.002':
                return this.buildPacs002(txs, config);
            case 'pain.002':
                return this.buildPain002(txs, config);

            default:
                return `Format non supporté : ${format}`;
        }
    }

    // =========================================================================
    // 2. GÉNÉRATION DES FLUX DE REPORTING (Relevés / Avis)
    // =========================================================================

    /**
     * Génère les fichiers de reporting à partir des références d'opérations
     */
    generateReportingFiles(format, operations, config) {
        const { fileCount, filePrefix } = config;
        const generatedFiles = [];
        const timestamp = formatSwiftDate(new Date()) + '_' + formatSwiftTime(new Date());

        for (let f = 0; f < fileCount; f++) {
            // Générer le contenu pour ce fichier
            const content = this.buildReportingFileContent(format, operations, config);
            const ext = this.isXmlFormat(format) ? 'xml' : 'txt';
            const fileName = `${filePrefix || format.replace('.', '_')}_${this.filiale.bic}_${timestamp}_${String(f + 1).padStart(3, '0')}.${ext}`;

            generatedFiles.push({
                name: fileName,
                content: content,
                messagesCount: operations.length,
                filiale: this.filiale.name,
                format: format
            });
        }

        return generatedFiles;
    }

    /**
     * Construit le contenu du fichier de reporting
     */
    buildReportingFileContent(format, operations, config) {
        switch (format) {
            case 'mt900':
                return this.buildMT900Or910(operations, config, 'MT900');
            case 'mt910':
                return this.buildMT900Or910(operations, config, 'MT910');
            case 'camt.054':
                return this.buildCamt054(operations, config);
            case 'mt940':
                return this.buildMT940Or950(operations, config, 'MT940');
            case 'mt950':
                return this.buildMT940Or950(operations, config, 'MT950');
            case 'pacs.053':
                return this.buildPacs053(operations, config);
            case 'mt942':
                return this.buildMT942(operations, config);
            case 'camt.052':
                return this.buildCamt052(operations, config);
            default:
                return `Format de reporting non supporté : ${format}`;
        }
    }

    // =========================================================================
    // 3. CONSTRUCTEURS DE MESSAGES FORMAT MT (TEXT SWIFT)
    // =========================================================================

    buildMT101(txs, config, fileIndex) {
        const sequence = generateSequenceNumber();
        const fileRef = generateSwiftReference('M101');
        const swiftDate = formatSwiftDate(config.valueDate || new Date());
        
        let msg = `{1:F01${this.filiale.bic}XXXX${sequence}}{2:I101${this.filiale.bic}XXXXN}{4:\n`;
        msg += `:20:${fileRef}\n`;
        msg += `:21R:${fileRef}\n`;
        msg += `:28D:${fileIndex}/${config.fileCount}\n`;
        msg += `:30:${swiftDate}\n`;
        
        // Ordre corporate unique (emprunté de la liste)
        const client = getRandomItem(CORPORATE_CLIENTS) || { name: 'CORIS GROUP CLIENT', accountPrefix: '1480100' };
        msg += `:50H:/${client.accountPrefix}00123456\n`;
        msg += `${client.name}\n`;
        msg += `ZONE INDUSTRIELLE\n`;
        msg += `${this.filiale.country}/${this.filiale.city}\n`;

        txs.forEach((tx, idx) => {
            msg += `:21:TXN${idx + 1}_${tx.ref}\n`;
            msg += `:32B:${config.currency || 'XOF'}${this.formatMTAmount(tx.amount)}\n`;
            if (tx.destBank.bic) {
                msg += `:57A:${tx.destBank.bic}\n`;
            }
            msg += `:59:/${tx.iban}\n`;
            msg += `//${getRandomItem(CLIENT_NAMES)}\n`;
            msg += `:70:${tx.purpose}\n`;
            msg += `:71A:${config.chargeOption || 'SHA'}\n`;
            if (tx.amount >= 50000000) {
                msg += `:23E:RTGS\n`;
            }
        });
        msg += `-}`;
        return msg;
    }

    buildMT103(txs, config, options = {}) {
        // support backward compatibility if options is boolean (isRtgs)
        let isRtgs = true;
        let isEmis = true;
        let isRes = false;
        let isB2b = false;
        if (typeof options === 'boolean') {
            isRtgs = options;
        } else {
            isRtgs = options.isRtgs !== false;
            isEmis = options.isEmis !== false;
            isRes = !!options.isRes;
            isB2b = !!options.isB2b;
        }

        let msg = '';
        txs.forEach(tx => {
            const sequence = generateSequenceNumber();
            const swiftDate = formatSwiftDate(tx.date);
            const time = formatSwiftTime(new Date());
            const formattedAmt = this.formatMTAmount(tx.amount);
            
            // Émetteur / Récepteur
            let senderBIC = this.filiale.bic;
            let receiverBIC = this.getCentralBankBic();
            let senderRtgs = this.filiale.rtgsCode || 'CORIXXXX';
            let destRtgs = tx.destBank.rtgsCode || 'DESTXXXX';
            
            if (isRtgs) {
                if (!isEmis) {
                    // Reçu RTGS: l'émetteur est la Banque Centrale, le récepteur est Coris
                    senderBIC = this.getCentralBankBic();
                    receiverBIC = this.filiale.bic;
                    senderRtgs = 'BCEAO_RTGS';
                    destRtgs = this.filiale.rtgsCode || 'CORIXXXX';
                }
            } else {
                // CBPR+ / International
                if (isEmis) {
                    // Émis: Coris vers Étranger (BIC saisi)
                    senderBIC = this.filiale.bic;
                    receiverBIC = config.cbprDestBic || tx.destBank.bic;
                    senderRtgs = this.filiale.rtgsCode || 'CORIXXXX';
                    destRtgs = 'FOREIGN_RTGS';
                } else {
                    // Reçu (Rapatriement): Étranger (BIC saisi) vers Coris
                    senderBIC = config.cbprSenderBic || 'FOREIGN_BIC';
                    receiverBIC = this.filiale.bic;
                    senderRtgs = 'FOREIGN_RTGS';
                    destRtgs = this.filiale.rtgsCode || 'CORIXXXX';
                }
            }

            msg += `{1:F21${receiverBIC}AXXX${sequence}}`;
            msg += `{4:{177:${swiftDate}${time}}{451:0}}`;
            msg += `{1:F01${receiverBIC}AXXX${sequence}}`;
            msg += `{2:O103${time}${swiftDate}${senderBIC}31220255123${swiftDate}${time}N}`;
            msg += `{3:{113:0030}{108:${tx.ref}}{121:${tx.uetr}}}`;
            msg += `{4:\n`;
            msg += `:20:${tx.ref}\n`;
            msg += `:23B:CRED\n`;
            
            // Tag 23E
            if (isRes) {
                msg += `:23E:RESF\n`;
            } else if (isRtgs) {
                msg += `:23E:SDVA\n`;
            } else {
                msg += `:23E:CHQB\n`;
            }
            
            if (isRtgs) {
                msg += `:26T:001\n`;
            }
            
            msg += `:32A:${swiftDate}${config.currency || this.filiale.currency}${formattedAmt}\n`;
            
            // Donneur d'ordre (Tag 50)
            if (!isRtgs && !isEmis) {
                // CBPR+ reçu: compte donneur d'ordre à l'étranger
                msg += `:50K:/${config.cbprOrderingAccount || '50_ORDERING_ACCT'}\n//${tx.orderingName}\n`;
            } else {
                msg += `:50K:/148010012345\n//${tx.orderingName}\n`;
            }
            
            // Banque émettrice / Correspondant (Tag 53A)
            msg += `:53A:/D/${senderRtgs}\n${senderBIC}\n`;
            
            // Banque de couverture (Tag 56A - Optionnel pour CBPR+ émis)
            if (!isRtgs && isEmis && config.cbprCoverBic) {
                msg += `:56A:${config.cbprCoverBic}\n`;
            }
            
            // Banque réceptrice (Tag 57A)
            msg += `:57A:/C/${destRtgs}\n${receiverBIC}\n`;
            
            // Bénéficiaire (Tag 59)
            if (!isRtgs && isEmis) {
                // CBPR+ émis: compte bénéficiaire à l'étranger
                msg += `:59:/${config.cbprBeneficiaryAccount || '59_BENEF_ACCT'}\n//${getRandomItem(CLIENT_NAMES)}\n`;
            } else {
                msg += `:59:/${tx.iban}\n//${getRandomItem(CLIENT_NAMES)}\n`;
            }
            
            msg += `:70:${tx.purpose}\n`;
            msg += `:71A:${config.chargeOption || 'SHA'}\n`;
            if (isRtgs) {
                msg += `:72:/CODTYPTR/001\n`;
            }
            msg += `-}{5:{MAC:00000000}{CHK:123456789ABC}}{S:{SAC:}{COP:S}}\n\n`;
        });
        return msg;
    }

    buildMT202(txs, config, options = {}) {
        let isEmis = options.isEmis !== false;
        let variant = options.variant || 'b2b';
        let msg = '';
        txs.forEach(tx => {
            const sequence = generateSequenceNumber();
            const swiftDate = formatSwiftDate(tx.date);
            const formattedAmt = this.formatMTAmount(tx.amount);
            const targetCentralBankBic = this.getCentralBankBic();

            let senderBIC = this.filiale.bic;
            let receiverBIC = tx.destBank.bic;
            if (!isEmis) {
                senderBIC = targetCentralBankBic;
                receiverBIC = this.filiale.bic;
            }

            msg += `{1:F01${senderBIC}XXXX${sequence}}{2:I202${receiverBIC}N}{3:{108:${tx.ref}}}`;
            msg += `{4:\n`;
            msg += `:20:${tx.ref}\n`;
            msg += `:21:${generateSwiftReference('REL')}\n`;
            msg += `:32A:${swiftDate}${config.currency || this.filiale.currency}${formattedAmt}\n`;
            
            // Tag 52A (Sender)
            msg += `:52A:${senderBIC}\n`;
            
            // Tag 58A (Beneficiary Institution)
            const rtgsCode = isEmis ? (tx.destBank.rtgsCode || 'RTGS') : (this.filiale.rtgsCode || 'CORIRTGS');
            msg += `:58A:/${rtgsCode}\n${receiverBIC}\n`;
            
            if (variant === 'res') {
                msg += `:72:/CODTYPTR/RESF\n`;
            }
            
            msg += `-}\n\n`;
        });
        return msg;
    }

    buildMT900Or910(operations, config, type) {
        let msg = '';
        const targetCentralBankBic = this.getCentralBankBic();
        
        operations.forEach(op => {
            const sequence = generateSequenceNumber();
            const date = formatSwiftDate(op.date);
            const time = formatSwiftTime(new Date());
            const formattedAmt = this.formatMTAmount(op.amount);
            const ref = generateSwiftReference(type);

            msg += `{1:F21${this.filiale.bic}AXXX${sequence}}`;
            msg += `{4:{177:${date}${time}}{451:0}}`;
            msg += `{1:F01${this.filiale.bic}AXXX${sequence}}`;
            msg += `{2:O${type.substring(2)}${time}${date}${targetCentralBankBic}0000000000${date}${time}N}`;
            msg += `{3:{108:${op.id}}}`;
            msg += `{4:\n`;
            msg += `:20:${ref}\n`;
            msg += `:21:${op.id}\n`;
            msg += `:25:${this.filiale.rtgsCode || '123456789'}\n`;
            msg += `:32A:${date}${op.currency || this.filiale.currency}${formattedAmt}\n`;
            msg += `:52A:${targetCentralBankBic}\n`;
            msg += `-}{5:{CHK:ABC123XYZ789}}\n\n`;
        });
        return msg;
    }

    buildMT940Or950(operations, config, type) {
        const date = formatSwiftDate(config.valueDate || new Date());
        const sequence = generateSequenceNumber();
        const ref = generateSwiftReference(type);
        const currency = config.currency || this.filiale.currency;
        
        // Calculer les soldes fictifs
        let currentBalance = parseFloat(config.initialBalance || 150000000);
        const initialBalanceStr = this.formatBalance(currentBalance, currency);
        
        let entries = '';
        operations.forEach(op => {
            const opDate = formatSwiftDate(op.date).substring(4); // MMDD
            const sign = (op.amount > 0) ? 'C' : 'D';
            const cleanAmt = Math.abs(op.amount);
            currentBalance += parseFloat(op.amount);
            
            entries += `:61:${date.substring(2)}${opDate}${sign}${this.formatMTAmount(cleanAmt)}NTRF//${op.id}\n`;
            entries += `:86:REFERENCE TRANSACTION ${op.id}\n`;
        });
        
        const finalBalanceStr = this.formatBalance(currentBalance, currency);

        let msg = `{1:F01${this.filiale.bic}XXXX${sequence}}{2:I${type.substring(2)}${this.filiale.bic}N}{4:\n`;
        msg += `:20:${ref}\n`;
        msg += `:25:${config.accountNumber || this.filiale.rtgsCode || '123456789'}\n`;
        msg += `:28C:00101/001\n`;
        msg += `:60F:${initialBalanceStr}\n`;
        msg += entries;
        msg += `:62F:${finalBalanceStr}\n`;
        msg += `-}`;
        return msg;
    }

    buildMT942(operations, config) {
        const date = formatSwiftDate(config.valueDate || new Date());
        const time = formatSwiftTime(new Date());
        const sequence = generateSequenceNumber();
        const ref = generateSwiftReference('M942');
        const currency = config.currency || this.filiale.currency;

        let entries = '';
        let totalDebit = 0;
        let totalCredit = 0;

        operations.forEach(op => {
            const opDate = formatSwiftDate(op.date).substring(4); // MMDD
            const sign = (op.amount > 0) ? 'RC' : 'RD';
            const cleanAmt = Math.abs(op.amount);
            if (op.amount > 0) totalCredit += cleanAmt;
            else totalDebit += cleanAmt;

            entries += `:61:${date.substring(2)}${opDate}${sign}${this.formatMTAmount(cleanAmt)}NTRF//${op.id}\n`;
            entries += `:86:NOTIFICATION INTERIM ${op.id}\n`;
        });

        let msg = `{1:F01${this.filiale.bic}XXXX${sequence}}{2:I942${this.filiale.bic}N}{4:\n`;
        msg += `:20:${ref}\n`;
        msg += `:25:${config.accountNumber || this.filiale.rtgsCode || '123456789'}\n`;
        msg += `:28C:00001/001\n`;
        msg += `:34F:${currency}0,\n`;
        msg += `:13D:${date}${time}+0000\n`;
        msg += entries;
        msg += `:90D:00001${currency}${this.formatMTAmount(totalDebit)}\n`;
        msg += `:90C:00001${currency}${this.formatMTAmount(totalCredit)}\n`;
        msg += `-}`;
        return msg;
    }

    // =========================================================================
    // 4. CONSTRUCTEURS DE MESSAGES FORMAT MX (ISO 20022 XML)
    // =========================================================================

    buildPain001(txs, config) {
        const msgId = generateSwiftReference('PAIN');
        const creationDt = new Date().toISOString();
        const ctrlSum = txs.reduce((sum, tx) => sum + tx.amount, 0);
        const currency = config.currency || 'XOF';
        const formattedExecDt = config.valueDate ? config.valueDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.08">\n`;
        xml += `  <CstmrCdtTrfInitn>\n`;
        xml += `    <GrpHdr>\n`;
        xml += `      <MsgId>${msgId}</MsgId>\n`;
        xml += `      <CreDtTm>${creationDt}</CreDtTm>\n`;
        xml += `      <NbOfTxs>${txs.length}</NbOfTxs>\n`;
        xml += `      <CtrlSum>${ctrlSum.toFixed(2)}</CtrlSum>\n`;
        
        // Initiating Party
        const initgPtyName = config.initiatingParty || config.orderingCustomer || 'CORIS GROUP CORPORATE';
        xml += `      <InitgPty>\n`;
        xml += `        <Nm>${initgPtyName}</Nm>\n`;
        xml += `${this.buildStructuredAddress(initgPtyName, this.filiale.country)}\n`;
        xml += `      </InitgPty>\n`;
        xml += `    </GrpHdr>\n`;
        xml += `    <PmtInf>\n`;
        xml += `      <PmtInfId>PMT-${msgId}</PmtInfId>\n`;
        xml += `      <PmtMtd>TRF</PmtMtd>\n`;
        xml += `      <ReqdExctnDt>\n`;
        xml += `        <Dt>${formattedExecDt}</Dt>\n`;
        xml += `      </ReqdExctnDt>\n`;
        
        // Debtor
        const dbtrName = config.orderingCustomer || 'CORIS GROUP CORPORATE';
        xml += `      <Dbtr>\n`;
        xml += `        <Nm>${dbtrName}</Nm>\n`;
        xml += `${this.buildStructuredAddress(dbtrName, this.filiale.country)}\n`;
        xml += `      </Dbtr>\n`;
        
        xml += `      <DbtrAcct>\n`;
        xml += `        <Id>\n`;
        xml += `          <Othr>\n`;
        xml += `            <Id>${this.filiale.rtgsCode || 'CORIACCOUNT'}</Id>\n`;
        xml += `          </Othr>\n`;
        xml += `        </Id>\n`;
        xml += `      </DbtrAcct>\n`;
        xml += `      <DbtrAgt>\n`;
        xml += `        <FinInstnId>\n`;
        xml += `          <BICFI>${this.filiale.bic}</BICFI>\n`;
        xml += `        </FinInstnId>\n`;
        xml += `      </DbtrAgt>\n`;

        txs.forEach(tx => {
            xml += `      <CdtTrfTxInf>\n`;
            xml += `        <PmtId>\n`;
            xml += `          <EndToEndId>${tx.ref}</EndToEndId>\n`;
            xml += `          <UETR>${tx.uetr}</UETR>\n`;
            xml += `        </PmtId>\n`;
            xml += `        <Amt>\n`;
            xml += `          <InstdAmt Ccy="${currency}">${tx.amount.toFixed(2)}</InstdAmt>\n`;
            xml += `        </Amt>\n`;
            if (tx.destBank.bic) {
                xml += `        <CdtrAgt>\n`;
                xml += `          <FinInstnId>\n`;
                xml += `            <BICFI>${tx.destBank.bic}</BICFI>\n`;
                xml += `          </FinInstnId>\n`;
                xml += `        </CdtrAgt>\n`;
            }
            
            // Creditor
            const cdtrName = getRandomItem(CLIENT_NAMES);
            xml += `        <Cdtr>\n`;
            xml += `          <Nm>${cdtrName}</Nm>\n`;
            const cdtrCtry = tx.iban.substring(0, 2).toUpperCase();
            xml += `${this.buildStructuredAddress(cdtrName, isValidIBAN(tx.iban) ? cdtrCtry : 'BF')}\n`;
            xml += `        </Cdtr>\n`;
            
            xml += `        <CdtrAcct>\n`;
            xml += `          <Id>\n`;
            xml += `            <IBAN>${tx.iban}</IBAN>\n`;
            xml += `          </Id>\n`;
            xml += `        </CdtrAcct>\n`;
            
            // Ultimate Debtor (Optionnel)
            if (config.ultimateDebtor) {
                xml += `        <UltmtDbtr>\n`;
                xml += `          <Nm>${config.ultimateDebtor}</Nm>\n`;
                xml += `${this.buildStructuredAddress(config.ultimateDebtor, this.filiale.country)}\n`;
                xml += `        </UltmtDbtr>\n`;
            }
            
            // Ultimate Creditor (Optionnel)
            if (config.ultimateCreditor) {
                xml += `        <UltmtCdtr>\n`;
                xml += `          <Nm>${config.ultimateCreditor}</Nm>\n`;
                const cdtrCtry = tx.iban.substring(0, 2).toUpperCase();
                xml += `${this.buildStructuredAddress(config.ultimateCreditor, isValidIBAN(tx.iban) ? cdtrCtry : 'BF')}\n`;
                xml += `        </UltmtCdtr>\n`;
            }
            
            xml += `        <RmtInf>\n`;
            xml += `          <Ustrd>${tx.purpose}</Ustrd>\n`;
            xml += `        </RmtInf>\n`;
            xml += `      </CdtTrfTxInf>\n`;
        });

        xml += `    </PmtInf>\n`;
        xml += `  </CstmrCdtTrfInitn>\n`;
        xml += `</Document>\n`;
        return xml;
    }

    buildPacs008(txs, config, style, options = {}) {
        const isEmis = options.isEmis !== false;
        const msgId = generateSwiftReference('PACS8');
        const creationDt = new Date().toISOString();
        const ctrlSum = txs.reduce((sum, tx) => sum + tx.amount, 0);
        const currency = config.currency || this.filiale.currency;

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08">\n`;
        xml += `  <FIToFICstmrCdtTrf>\n`;
        xml += `    <GrpHdr>\n`;
        xml += `      <MsgId>${msgId}</MsgId>\n`;
        xml += `      <CreDtTm>${creationDt}</CreDtTm>\n`;
        xml += `      <NbOfTxs>${txs.length}</NbOfTxs>\n`;
        xml += `      <CtrlSum>${ctrlSum.toFixed(2)}</CtrlSum>\n`;
        xml += `      <SttlmInf>\n`;
        xml += `        <SttlmMtd>CLRG</SttlmMtd>\n`;
        xml += `        <ClrSys>\n`;
        xml += `          <Prtry>${style}</Prtry>\n`;
        xml += `        </ClrSys>\n`;
        xml += `      </SttlmInf>\n`;
        if (config.initiatingParty) {
            xml += `      <InitgPty>\n`;
            xml += `        <Nm>${config.initiatingParty}</Nm>\n`;
            xml += `${this.buildStructuredAddress(config.initiatingParty, this.filiale.country)}\n`;
            xml += `      </InitgPty>\n`;
        }
        xml += `    </GrpHdr>\n`;

        txs.forEach(tx => {
            const formattedDate = tx.date.toISOString().split('T')[0];
            
            // Émetteur / Récepteur BICs
            let senderBIC = this.filiale.bic;
            let receiverBIC = tx.destBank.bic;
            let dbtrAcct = config.accountNumber || this.filiale.rtgsCode || 'CORISACCOUNT';
            let cdtrAcct = tx.iban;
            let dbtrName = tx.orderingName;
            let cdtrName = getRandomItem(CLIENT_NAMES);

            if (style === 'HVPS+') {
                if (!isEmis) {
                    // Reçu HVPS+ (RTGS): Émetteur = Banque Centrale, Récepteur = Coris
                    senderBIC = this.getCentralBankBic();
                    receiverBIC = this.filiale.bic;
                    dbtrAcct = 'BCEAO_ACCOUNT';
                    cdtrAcct = tx.iban;
                }
            } else {
                // CBPR+
                if (isEmis) {
                    // Émis: Coris vers Étranger
                    senderBIC = this.filiale.bic;
                    receiverBIC = config.cbprDestBic || tx.destBank.bic;
                    dbtrAcct = this.filiale.rtgsCode || 'CORISACCOUNT';
                    cdtrAcct = config.cbprBeneficiaryAccount || 'FOREIGN_BENEF_ACCT';
                } else {
                    // Reçu: Étranger vers Coris
                    senderBIC = config.cbprSenderBic || 'FOREIGN_BIC';
                    receiverBIC = this.filiale.bic;
                    dbtrAcct = config.cbprOrderingAccount || 'FOREIGN_ORDERING_ACCT';
                    cdtrAcct = tx.iban;
                }
            }

            xml += `    <CdtTrfTxInf>\n`;
            xml += `      <PmtId>\n`;
            xml += `        <EndToEndId>${tx.ref}</EndToEndId>\n`;
            xml += `        <TxId>TX-${tx.ref}</TxId>\n`;
            xml += `        <UETR>${tx.uetr}</UETR>\n`;
            xml += `      </PmtId>\n`;
            xml += `      <IntrBkSttlmAmt Ccy="${currency}">${tx.amount.toFixed(2)}</IntrBkSttlmAmt>\n`;
            xml += `      <IntrBkSttlmDt>${formattedDate}</IntrBkSttlmDt>\n`;
            
            // Debtor
            xml += `      <Dbtr>\n`;
            xml += `        <Nm>${dbtrName}</Nm>\n`;
            xml += `${this.buildStructuredAddress(dbtrName, this.filiale.country)}\n`;
            xml += `      </Dbtr>\n`;
            
            xml += `      <DbtrAcct>\n`;
            xml += `        <Id>\n`;
            xml += `          <Othr>\n`;
            xml += `            <Id>${dbtrAcct}</Id>\n`;
            xml += `          </Othr>\n`;
            xml += `        </Id>\n`;
            xml += `      </DbtrAcct>\n`;
            
            // Debtor Agent (Sender FI)
            xml += `      <DbtrAgt>\n`;
            xml += `        <FinInstnId>\n`;
            xml += `          <BICFI>${senderBIC}</BICFI>\n`;
            xml += `        </FinInstnId>\n`;
            xml += `      </DbtrAgt>\n`;
            
            // Intermediary Agent (Cover bank) for CBPR+ Emis
            if (style === 'CBPR+' && isEmis && config.cbprCoverBic) {
                xml += `      <IntrmyAgt1>\n`;
                xml += `        <FinInstnId>\n`;
                xml += `          <BICFI>${config.cbprCoverBic}</BICFI>\n`;
                xml += `        </FinInstnId>\n`;
                xml += `      </IntrmyAgt1>\n`;
            }
            
            // Creditor Agent (Receiver FI)
            xml += `      <CdtrAgt>\n`;
            xml += `        <FinInstnId>\n`;
            xml += `          <BICFI>${receiverBIC}</BICFI>\n`;
            xml += `        </FinInstnId>\n`;
            xml += `      </CdtrAgt>\n`;
            
            // Creditor
            xml += `      <Cdtr>\n`;
            xml += `        <Nm>${cdtrName}</Nm>\n`;
            const cdtrCtry = cdtrAcct.substring(0, 2).toUpperCase();
            xml += `${this.buildStructuredAddress(cdtrName, isValidIBAN(cdtrAcct) ? cdtrCtry : 'US')}\n`;
            xml += `      </Cdtr>\n`;
            
            xml += `      <CdtrAcct>\n`;
            xml += `        <Id>\n`;
            if (isValidIBAN(cdtrAcct)) {
                xml += `          <IBAN>${cdtrAcct}</IBAN>\n`;
            } else {
                xml += `          <Othr>\n`;
                xml += `            <Id>${cdtrAcct}</Id>\n`;
                xml += `          </Othr>\n`;
            }
            xml += `        </Id>\n`;
            xml += `      </CdtrAcct>\n`;
            
            // Ultimate Debtor (Optionnel)
            if (config.ultimateDebtor) {
                xml += `      <UltmtDbtr>\n`;
                xml += `        <Nm>${config.ultimateDebtor}</Nm>\n`;
                xml += `${this.buildStructuredAddress(config.ultimateDebtor, this.filiale.country)}\n`;
                xml += `      </UltmtDbtr>\n`;
            }
            
            // Ultimate Creditor (Optionnel)
            if (config.ultimateCreditor) {
                xml += `      <UltmtCdtr>\n`;
                xml += `        <Nm>${config.ultimateCreditor}</Nm>\n`;
                const cdtrCtry = cdtrAcct.substring(0, 2).toUpperCase();
                xml += `${this.buildStructuredAddress(config.ultimateCreditor, isValidIBAN(cdtrAcct) ? cdtrCtry : 'US')}\n`;
                xml += `      </UltmtCdtr>\n`;
            }

            xml += `      <RmtInf>\n`;
            xml += `        <Ustrd>${tx.purpose}</Ustrd>\n`;
            xml += `      </RmtInf>\n`;
            xml += `    </CdtTrfTxInf>\n`;
        });

        xml += `  </FIToFICstmrCdtTrf>\n`;
        xml += `</Document>\n`;
        return xml;
    }

    buildPacs002(txs, config) {
        const msgId = generateSwiftReference('PACS2');
        const creationDt = new Date().toISOString();

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.002.001.10">\n`;
        xml += `  <FIToFIPmtStsRpt>\n`;
        xml += `    <GrpHdr>\n`;
        xml += `      <MsgId>${msgId}</MsgId>\n`;
        xml += `      <CreDtTm>${creationDt}</CreDtTm>\n`;
        xml += `      <InstgAgt>\n`;
        xml += `        <FinInstnId>\n`;
        xml += `          <BICFI>${this.filiale.bic}</BICFI>\n`;
        xml += `        </FinInstnId>\n`;
        xml += `      </InstgAgt>\n`;
        xml += `      <InstdAgt>\n`;
        xml += `        <FinInstnId>\n`;
        xml += `          <BICFI>${this.getCentralBankBic()}</BICFI>\n`;
        xml += `        </FinInstnId>\n`;
        xml += `      </InstdAgt>\n`;
        xml += `    </GrpHdr>\n`;
        xml += `    <OrgnlGrpInfAndSts>\n`;
        xml += `      <OrgnlMsgId>${generateSwiftReference('PACS8')}</OrgnlMsgId>\n`;
        xml += `      <OrgnlMsgNmId>pacs.008.001.08</OrgnlMsgNmId>\n`;
        xml += `      <GrpSts>ACTC</GrpSts>\n`;
        xml += `    </OrgnlGrpInfAndSts>\n`;

        txs.forEach(tx => {
            xml += `    <TxInfAndSts>\n`;
            xml += `      <StatusRptId>RPT-${tx.ref}</StatusRptId>\n`;
            xml += `      <OrgnlEndToEndId>${tx.ref}</OrgnlEndToEndId>\n`;
            xml += `      <OrgnlUETR>${tx.uetr}</OrgnlUETR>\n`;
            xml += `      <TxSts>ACSP</TxSts>\n`;
            xml += `      <CdtrAgt>\n`;
            xml += `        <FinInstnId>\n`;
            xml += `          <BICFI>${tx.destBank.bic}</BICFI>\n`;
            xml += `        </FinInstnId>\n`;
            xml += `      </CdtrAgt>\n`;
            xml += `    </TxInfAndSts>\n`;
        });

        xml += `  </FIToFIPmtStsRpt>\n`;
        xml += `</Document>\n`;
        return xml;
    }

    buildCamt054(operations, config) {
        const msgId = generateSwiftReference('CAMT54');
        const creationDt = new Date().toISOString();
        const isDebit = config.reportingType === 'debit';
        const indicator = isDebit ? 'DBIT' : 'CRDT';

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.054.001.08">\n`;
        xml += `  <BkToCstmrDbtCdtNtfctn>\n`;
        xml += `    <GrpHdr>\n`;
        xml += `      <MsgId>${msgId}</MsgId>\n`;
        xml += `      <CreDtTm>${creationDt}</CreDtTm>\n`;
        xml += `    </GrpHdr>\n`;
        xml += `    <Ntfctn>\n`;
        xml += `      <Id>NTF-${msgId}</Id>\n`;
        xml += `      <CreDtTm>${creationDt}</CreDtTm>\n`;
        xml += `      <Acct>\n`;
        xml += `        <Id>\n`;
        xml += `          <Othr>\n`;
        xml += `            <Id>${config.accountNumber || this.filiale.rtgsCode || '123456789'}</Id>\n`;
        xml += `          </Othr>\n`;
        xml += `        </Id>\n`;
        xml += `      </Acct>\n`;

        operations.forEach(op => {
            const formattedDate = op.date.toISOString().split('T')[0];
            xml += `      <Ntry>\n`;
            xml += `        <Amt Ccy="${op.currency || this.filiale.currency}">${Math.abs(op.amount).toFixed(2)}</Amt>\n`;
            xml += `        <CdtDbtInd>${indicator}</CdtDbtInd>\n`;
            xml += `        <Status>BOOK</Status>\n`;
            xml += `        <BookgDt>\n`;
            xml += `          <Dt>${formattedDate}</Dt>\n`;
            xml += `        </BookgDt>\n`;
            xml += `        <ValDt>\n`;
            xml += `          <Dt>${formattedDate}</Dt>\n`;
            xml += `        </ValDt>\n`;
            xml += `        <NtryDtls>\n`;
            xml += `          <TxDtls>\n`;
            xml += `            <Refs>\n`;
            xml += `              <EndToEndId>${op.id}</EndToEndId>\n`;
            xml += `            </Refs>\n`;
            xml += `          </TxDtls>\n`;
            xml += `        </NtryDtls>\n`;
            xml += `      </Ntry>\n`;
        });

        xml += `    </Ntfctn>\n`;
        xml += `  </BkToCstmrDbtCdtNtfctn>\n`;
        xml += `</Document>\n`;
        return xml;
    }

    buildPacs053(operations, config) {
        // NOTE: pacs.053 XML root tag avec Document, structuré de la même façon que camt.053
        // pour correspondre fidèlement à la demande (pacs.053 en remplacement des relevés MT940/MT950)
        const msgId = generateSwiftReference('PACS53');
        const creationDt = new Date().toISOString();
        const currency = config.currency || this.filiale.currency;

        let initialBal = parseFloat(config.initialBalance || 150000000);
        let finalBal = initialBal;
        operations.forEach(op => finalBal += parseFloat(op.amount));

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.053.001.08">\n`;
        xml += `  <BkToCstmrStmt>\n`;
        xml += `    <GrpHdr>\n`;
        xml += `      <MsgId>${msgId}</MsgId>\n`;
        xml += `      <CreDtTm>${creationDt}</CreDtTm>\n`;
        xml += `    </GrpHdr>\n`;
        xml += `    <Stmt>\n`;
        xml += `      <Id>STMT-${msgId}</Id>\n`;
        xml += `      <CreDtTm>${creationDt}</CreDtTm>\n`;
        xml += `      <Acct>\n`;
        xml += `        <Id>\n`;
        xml += `          <Othr>\n`;
        xml += `            <Id>${config.accountNumber || this.filiale.rtgsCode || '123456789'}</Id>\n`;
        xml += `          </Othr>\n`;
        xml += `        </Id>\n`;
        xml += `      </Acct>\n`;
        xml += `      <Bal>\n`;
        xml += `        <Type><CdOrPrtry><Cd>OPBD</Cd></CdOrPrtry></Type>\n`;
        xml += `        <Amt Ccy="${currency}">${initialBal.toFixed(2)}</Amt>\n`;
        xml += `        <CdtDbtInd>CRDT</CdtDbtInd>\n`;
        xml += `        <Dt><Dt>${creationDt.split('T')[0]}</Dt></Dt>\n`;
        xml += `      </Bal>\n`;

        operations.forEach(op => {
            const formattedDate = op.date.toISOString().split('T')[0];
            const indicator = (op.amount >= 0) ? 'CRDT' : 'DBIT';
            xml += `      <Ntry>\n`;
            xml += `        <Amt Ccy="${op.currency || currency}">${Math.abs(op.amount).toFixed(2)}</Amt>\n`;
            xml += `        <CdtDbtInd>${indicator}</CdtDbtInd>\n`;
            xml += `        <Status>BOOK</Status>\n`;
            xml += `        <BookgDt>\n`;
            xml += `          <Dt>${formattedDate}</Dt>\n`;
            xml += `        </BookgDt>\n`;
            xml += `        <ValDt>\n`;
            xml += `          <Dt>${formattedDate}</Dt>\n`;
            xml += `        </ValDt>\n`;
            xml += `        <NtryDtls>\n`;
            xml += `          <TxDtls>\n`;
            xml += `            <Refs>\n`;
            xml += `              <EndToEndId>${op.id}</EndToEndId>\n`;
            xml += `            </Refs>\n`;
            xml += `          </TxDtls>\n`;
            xml += `        </NtryDtls>\n`;
            xml += `      </Ntry>\n`;
        });

        xml += `      <Bal>\n`;
        xml += `        <Type><CdOrPrtry><Cd>CLBD</Cd></CdOrPrtry></Type>\n`;
        xml += `        <Amt Ccy="${currency}">${finalBal.toFixed(2)}</Amt>\n`;
        xml += `        <CdtDbtInd>CRDT</CdtDbtInd>\n`;
        xml += `        <Dt><Dt>${creationDt.split('T')[0]}</Dt></Dt>\n`;
        xml += `      </Bal>\n`;
        xml += `    </Stmt>\n`;
        xml += `  </BkToCstmrStmt>\n`;
        xml += `</Document>\n`;
        return xml;
    }

    buildCamt052(operations, config) {
        const msgId = generateSwiftReference('CAMT52');
        const creationDt = new Date().toISOString();
        const currency = config.currency || this.filiale.currency;

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.052.001.08">\n`;
        xml += `  <BkToCstmrAcctRpt>\n`;
        xml += `    <GrpHdr>\n`;
        xml += `      <MsgId>${msgId}</MsgId>\n`;
        xml += `      <CreDtTm>${creationDt}</CreDtTm>\n`;
        xml += `    </GrpHdr>\n`;
        xml += `    <Rpt>\n`;
        xml += `      <Id>RPT-${msgId}</Id>\n`;
        xml += `      <CreDtTm>${creationDt}</CreDtTm>\n`;
        xml += `      <Acct>\n`;
        xml += `        <Id>\n`;
        xml += `          <Othr>\n`;
        xml += `            <Id>${config.accountNumber || this.filiale.rtgsCode || '123456789'}</Id>\n`;
        xml += `          </Othr>\n`;
        xml += `        </Id>\n`;
        xml += `      </Acct>\n`;

        operations.forEach(op => {
            const formattedDate = op.date.toISOString().split('T')[0];
            const indicator = (op.amount >= 0) ? 'CRDT' : 'DBIT';
            xml += `      <Ntry>\n`;
            xml += `        <Amt Ccy="${op.currency || currency}">${Math.abs(op.amount).toFixed(2)}</Amt>\n`;
            xml += `        <CdtDbtInd>${indicator}</CdtDbtInd>\n`;
            xml += `        <Status>BOOK</Status>\n`;
            xml += `        <BookgDt>\n`;
            xml += `          <Dt>${formattedDate}</Dt>\n`;
            xml += `        </BookgDt>\n`;
            xml += `        <ValDt>\n`;
            xml += `          <Dt>${formattedDate}</Dt>\n`;
            xml += `        </ValDt>\n`;
            xml += `        <NtryDtls>\n`;
            xml += `          <TxDtls>\n`;
            xml += `            <Refs>\n`;
            xml += `              <EndToEndId>${op.id}</EndToEndId>\n`;
            xml += `            </Refs>\n`;
            xml += `          </TxDtls>\n`;
            xml += `        </NtryDtls>\n`;
            xml += `      </Ntry>\n`;
        });

        xml += `    </Rpt>\n`;
        xml += `  </BkToCstmrAcctRpt>\n`;
        xml += `</Document>\n`;
        return xml;
    }

    buildPacs009(txs, config, style, options = {}) {
        const isEmis = options.isEmis !== false;
        const msgId = generateSwiftReference('PACS9');
        const creationDt = new Date().toISOString();
        const ctrlSum = txs.reduce((sum, tx) => sum + tx.amount, 0);
        const currency = config.currency || this.filiale.currency;

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.009.001.08">\n`;
        xml += `  <FICdtTrf>\n`;
        xml += `    <GrpHdr>\n`;
        xml += `      <MsgId>${msgId}</MsgId>\n`;
        xml += `      <CreDtTm>${creationDt}</CreDtTm>\n`;
        xml += `      <NbOfTxs>${txs.length}</NbOfTxs>\n`;
        xml += `      <CtrlSum>${ctrlSum.toFixed(2)}</CtrlSum>\n`;
        xml += `      <SttlmInf>\n`;
        xml += `        <SttlmMtd>CLRG</SttlmMtd>\n`;
        xml += `        <ClrSys>\n`;
        xml += `          <Prtry>${style}</Prtry>\n`;
        xml += `        </ClrSys>\n`;
        xml += `      </SttlmInf>\n`;
        xml += `    </GrpHdr>\n`;

        txs.forEach(tx => {
            const formattedDate = tx.date.toISOString().split('T')[0];
            
            let senderBIC = this.filiale.bic;
            let receiverBIC = tx.destBank.bic;

            if (style === 'HVPS+') {
                if (!isEmis) {
                    senderBIC = this.getCentralBankBic();
                    receiverBIC = this.filiale.bic;
                }
            } else {
                // CBPR+
                if (isEmis) {
                    senderBIC = this.filiale.bic;
                    receiverBIC = config.cbprDestBic || tx.destBank.bic;
                } else {
                    senderBIC = config.cbprSenderBic || 'FOREIGN_BIC';
                    receiverBIC = this.filiale.bic;
                }
            }

            xml += `    <CdtTrfTxInf>\n`;
            xml += `      <PmtId>\n`;
            xml += `        <EndToEndId>${tx.ref}</EndToEndId>\n`;
            xml += `        <TxId>TX-${tx.ref}</TxId>\n`;
            xml += `        <UETR>${tx.uetr}</UETR>\n`;
            xml += `      </PmtId>\n`;
            xml += `      <IntrBkSttlmAmt Ccy="${currency}">${tx.amount.toFixed(2)}</IntrBkSttlmAmt>\n`;
            xml += `      <IntrBkSttlmDt>${formattedDate}</IntrBkSttlmDt>\n`;
            
            // Dbtr (FI)
            xml += `      <Dbtr>\n`;
            xml += `        <FinInstnId>\n`;
            xml += `          <BICFI>${senderBIC}</BICFI>\n`;
            xml += `        </FinInstnId>\n`;
            xml += `      </Dbtr>\n`;
            
            // Cdtr (FI)
            xml += `      <Cdtr>\n`;
            xml += `        <FinInstnId>\n`;
            xml += `          <BICFI>${receiverBIC}</BICFI>\n`;
            xml += `        </FinInstnId>\n`;
            xml += `      </Cdtr>\n`;
            
            xml += `    </CdtTrfTxInf>\n`;
        });

        xml += `  </FICdtTrf>\n`;
        xml += `</Document>\n`;
        return xml;
    }

    buildPacs004(txs, config) {
        const msgId = generateSwiftReference('PACS4');
        const creationDt = new Date().toISOString();
        const currency = config.currency || this.filiale.currency;

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.004.001.09">\n`;
        xml += `  <PmtRtr>\n`;
        xml += `    <GrpHdr>\n`;
        xml += `      <MsgId>${msgId}</MsgId>\n`;
        xml += `      <CreDtTm>${creationDt}</CreDtTm>\n`;
        xml += `      <NbOfTxs>${txs.length}</NbOfTxs>\n`;
        xml += `    </GrpHdr>\n`;
        xml += `    <OrgnlGrpInf>\n`;
        xml += `      <OrgnlMsgId>${generateSwiftReference('PACS8')}</OrgnlMsgId>\n`;
        xml += `      <OrgnlMsgNmId>pacs.008.001.08</OrgnlMsgNmId>\n`;
        xml += `    </OrgnlGrpInf>\n`;

        txs.forEach(tx => {
            xml += `    <TxInf>\n`;
            xml += `      <RtrId>RTR-${tx.ref}</RtrId>\n`;
            xml += `      <OrgnlEndToEndId>${tx.ref}</OrgnlEndToEndId>\n`;
            xml += `      <OrgnlUETR>${tx.uetr}</OrgnlUETR>\n`;
            xml += `      <RtrdIntrBkSttlmAmt Ccy="${currency}">${tx.amount.toFixed(2)}</RtrdIntrBkSttlmAmt>\n`;
            xml += `      <RtrRsnInf>\n`;
            xml += `        <Rsn>\n`;
            xml += `          <Cd>AC04</Cd>\n`; // Closed Account Number
            xml += `        </Rsn>\n`;
            xml += `      </RtrRsnInf>\n`;
            
            xml += `      <Dbtr>\n`;
            xml += `        <Nm>${this.filiale.fullName}</Nm>\n`;
            xml += `${this.buildStructuredAddress(this.filiale.fullName, this.filiale.country)}\n`;
            xml += `      </Dbtr>\n`;
            
            xml += `      <Cdtr>\n`;
            xml += `        <Nm>${tx.orderingName}</Nm>\n`;
            xml += `${this.buildStructuredAddress(tx.orderingName, this.filiale.country)}\n`;
            xml += `      </Cdtr>\n`;
            
            xml += `    </TxInf>\n`;
        });

        xml += `  </PmtRtr>\n`;
        xml += `</Document>\n`;
        return xml;
    }

    buildPain002(txs, config) {
        const msgId = generateSwiftReference('PAIN2');
        const creationDt = new Date().toISOString();

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.002.001.10">\n`;
        xml += `  <CstmrPmtStsRpt>\n`;
        xml += `    <GrpHdr>\n`;
        xml += `      <MsgId>${msgId}</MsgId>\n`;
        xml += `      <CreDtTm>${creationDt}</CreDtTm>\n`;
        xml += `      <InitgPty>\n`;
        xml += `        <Nm>${config.orderingCustomer || 'CORIS GROUP CORPORATE'}</Nm>\n`;
        xml += `${this.buildStructuredAddress(config.orderingCustomer || 'CORIS GROUP CORPORATE', this.filiale.country)}\n`;
        xml += `      </InitgPty>\n`;
        xml += `    </GrpHdr>\n`;
        xml += `    <OrgnlGrpInfAndSts>\n`;
        xml += `      <OrgnlMsgId>${generateSwiftReference('PAIN1')}</OrgnlMsgId>\n`;
        xml += `      <OrgnlMsgNmId>pain.001.001.08</OrgnlMsgNmId>\n`;
        xml += `      <GrpSts>ACTC</GrpSts>\n`;
        xml += `    </OrgnlGrpInfAndSts>\n`;

        txs.forEach(tx => {
            xml += `    <TxInfAndSts>\n`;
            xml += `      <OrgnlEndToEndId>${tx.ref}</OrgnlEndToEndId>\n`;
            xml += `      <OrgnlUETR>${tx.uetr}</OrgnlUETR>\n`;
            xml += `      <TxSts>ACSP</TxSts>\n`;
            xml += `    </TxInfAndSts>\n`;
        });

        xml += `  </CstmrPmtStsRpt>\n`;
        xml += `</Document>\n`;
        return xml;
    }

    buildMT199(txs, config) {
        let msg = '';
        txs.forEach(tx => {
            const sequence = generateSequenceNumber();
            const swiftDate = formatSwiftDate(tx.date);
            const time = formatSwiftTime(new Date());

            msg += `{1:F01${this.filiale.bic}XXXX${sequence}}{2:I199${tx.destBank.bic}N}`;
            msg += `{4:\n`;
            msg += `:20:${tx.ref}\n`;
            msg += `:21:${generateSwiftReference('REL')}\n`;
            msg += `:79:INFORMATIONAL INQUIRY REGARDING PAYMENT TRANSACTION ${tx.ref}\n`;
            msg += `VALUE DATE: ${swiftDate} ${time}\n`;
            msg += `AMOUNT: ${tx.amount} ${config.currency || this.filiale.currency}\n`;
            msg += `PLEASE CONFIRM PROCESSING.\n`;
            msg += `-}\n\n`;
        });
        return msg;
    }

    buildMT299(txs, config) {
        let msg = '';
        txs.forEach(tx => {
            const sequence = generateSequenceNumber();
            const swiftDate = formatSwiftDate(tx.date);
            const time = formatSwiftTime(new Date());

            msg += `{1:F01${this.filiale.bic}XXXX${sequence}}{2:I299${tx.destBank.bic}N}`;
            msg += `{4:\n`;
            msg += `:20:${tx.ref}\n`;
            msg += `:21:${generateSwiftReference('REL')}\n`;
            msg += `:79:FINANCIAL INSTITUTION FREE FORMAT QUERY.\n`;
            msg += `REFERENCE DEBTOR AGENT: ${this.filiale.bic}\n`;
            msg += `VALUE DATE: ${swiftDate} ${time}\n`;
            msg += `AMOUNT: ${tx.amount} ${config.currency || this.filiale.currency}\n`;
            msg += `-}\n\n`;
        });
        return msg;
    }

    buildStructuredAddress(name, countryCode) {
        if (!name) return '';
        const streetName = "Rue des Jardins";
        const bldgNb = "45";
        const postCode = "BP 2026";
        let townNm = "Ouagadougou";
        
        const countryTowns = {
            'BF': 'Ouagadougou', 'BJ': 'Cotonou', 'CI': 'Abidjan',
            'GW': 'Bissau', 'ML': 'Bamako', 'NE': 'Niamey',
            'SN': 'Dakar', 'TG': 'Lomé', 'CM': 'Yaoundé',
            'CG': 'Brazzaville', 'GA': 'Libreville', 'TD': 'NDjamena',
            'CF': 'Bangui', 'GQ': 'Malabo', 'GN': 'Conakry',
            'US': 'New York', 'GB': 'London', 'FR': 'Paris', 'DE': 'Frankfurt'
        };
        if (countryCode && countryTowns[countryCode.toUpperCase()]) {
            townNm = countryTowns[countryCode.toUpperCase()];
        }
        
        return `        <PstlAdr>\n` +
               `          <StrtNm>${streetName}</StrtNm>\n` +
               `          <BldgNb>${bldgNb}</BldgNb>\n` +
               `          <PstCd>${postCode}</PstCd>\n` +
               `          <TwnNm>${townNm}</TwnNm>\n` +
               `          <Ctry>${countryCode || 'BF'}</Ctry>\n` +
               `        </PstlAdr>`;
    }

    // =========================================================================
    // 5. FONCTIONS UTILITAIRES ET AIDES
    // =========================================================================

    isXmlFormat(format) {
        const mxFormats = [
            'pain.001', 'pacs.008-hvps-emis', 'pacs.008-hvps-recus', 'pacs.008-hvps',
            'pacs.009-hvps-emis', 'pacs.009-hvps-recus',
            'pacs.008-cbpr-emis', 'pacs.008-cbpr-recus', 'pacs.008-cbpr',
            'pacs.009-cbpr-emis', 'pacs.009-cbpr-recus', 'pacs.004',
            'camt.054', 'pacs.053', 'camt.052', 'pacs.002', 'pain.002'
        ];
        return mxFormats.includes(format);
    }

    getCentralBankBic() {
        if (this.filiale.zone === 'CEMAC') return BEAC_BIC;
        if (this.filiale.zone === 'BCRG') return BCRG_BIC;
        return BCEAO_BIC;
    }

    formatMTAmount(amount) {
        // Format SWIFT pour les nombres décimaux avec virgule (ex: 500000, ou 100,50)
        if (Number.isInteger(amount)) {
            return `${amount},`;
        }
        return amount.toFixed(2).replace('.', ',');
    }

    formatBalance(balance, currency) {
        // Format type F: C / D + date + devise + montant
        const sign = (balance >= 0) ? 'C' : 'D';
        const absBal = Math.abs(balance);
        const swiftDate = formatSwiftDate(new Date());
        return `${sign}${swiftDate}${currency}${this.formatMTAmount(absBal)}`;
    }

    /**
     * Analyse les opérations à partir de lignes textuelles séparées par des points-virgules
     * Format attendu: identifiant;date;montant;devise
     */
    static parseOperations(content) {
        // Nettoyer et séparer par lignes, points-virgules ou virgules selon le cas
        // Si le user a mis tout sur une seule ligne séparée par des points-virgules, on le gère.
        let lines = [];
        
        // Gérer le cas où tout est saisi séparé par des ; (ex: OP1;2026-06-16;1000;XOF;OP2;2026-06-16;2000;EUR)
        if (content.includes(';') && content.split(';').length > 4 && !content.includes('\n')) {
            const tokens = content.split(';').map(t => t.trim());
            for (let i = 0; i < tokens.length; i += 4) {
                if (tokens[i]) {
                    lines.push(tokens.slice(i, i + 4).join(';'));
                }
            }
        } else {
            lines = content.split(/[\r\n]+/);
        }

        const operations = [];

        lines.forEach(line => {
            line = line.trim();
            if (line) {
                const parts = line.split(';');
                if (parts.length >= 3) {
                    const id = parts[0].trim();
                    const dateStr = parts[1].trim();
                    const amount = parseFloat(parts[2].trim().replace(',', '.'));
                    const currency = parts[3] ? parts[3].trim().toUpperCase() : 'XOF';

                    let parsedDate = new Date();
                    if (dateStr) {
                        const d = new Date(dateStr);
                        if (!isNaN(d.getTime())) {
                            parsedDate = d;
                        }
                    }

                    if (id && !isNaN(amount)) {
                        operations.push({
                            id,
                            date: parsedDate,
                            amount,
                            currency
                        });
                    }
                }
            }
        });

        return operations;
    }
}

window.GeneratorCore = GeneratorCore;
