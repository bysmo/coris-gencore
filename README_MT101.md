# 📋 README MT101 - Documentation Complète

## Vue d'ensemble

Le **Générateur MT101** permet de créer des messages SWIFT MT101 (Request for Transfer) conformes aux standards SWIFT. Ces messages sont envoyés par les clients corporates à leur banque pour initier des virements.

**Version :** 2.0.0  
**Date :** Février 2026  
**Format :** SWIFT MT101 standard  
**Usage :** Tests CBS Amplitude

---

## 🎯 Fonctionnalités

### 4 Types de Virements

1. **INTERNE** - Virements entre comptes même filiale
2. **COMPENSÉ** - Virements autres banques UEMOA < 50M XOF
3. **RTGS** - Virements RTGS ≥ 50M XOF ou mention 23E:RTGS
4. **ÉTRANGER** - Transferts internationaux multi-devises

### Capacités

- ✅ Génération conforme SWIFT MT101
- ✅ 8 filiales CORIS UEMOA émettrices
- ✅ 14 banques UEMOA (compensé/RTGS)
- ✅ 8 banques internationales
- ✅ 5 devises (XOF, EUR, USD, GBP, CHF, CAD)
- ✅ 8 clients corporates réalistes
- ✅ 13 bénéficiaires variés
- ✅ Options de frais (OUR, SHA, BEN)
- ✅ 1-100 fichiers, 1-500 transactions/fichier

---

## 📂 Fichiers

```
mt101-generator.html    - Interface utilisateur
js/mt101-config.js      - Configuration (types, banques, clients)
js/mt101-generator.js   - Moteur de génération
js/mt101-main.js        - Logique UI
test-mt101.html         - Tests automatisés (9 tests)
GUIDE_MT101.md          - Guide d'utilisation (ce fichier)
README_MT101.md         - Documentation technique
```

---

## 🚀 Utilisation Rapide

```
1. Ouvrez mt101-generator.html
2. Sélectionnez le type (Interne/Compensé/RTGS/Étranger)
3. Choisissez la filiale émettrice
4. Configurez montants et options
5. Générez et téléchargez
```

---

## 📊 Données Configurées

### Filiales émettrices (8)
- CORIBFBF (Burkina), CORIBJBJ (Bénin), CORICIAB (CI)
- CORIGWGW (GW), CORIMLBA (Mali), CORINENI (Niger)
- CORISNDA (Sénégal), CORITGTG (Togo)

### Banques UEMOA (14)
ECOBANK, Société Générale, Bank of Africa, Atlantic Bank, CORIS

### Banques internationales (8)
Citibank, BNP Paribas, Deutsche Bank, JP Morgan, UBS, HSBC

### Clients corporates (8)
- HOUNDE GOLD OPERATION
- EXAFI SARL
- SAHEL NEGOCE SA
- BURKINA MINING COMPANY
- MALI COTTON EXPORT
- SENEGAL AGRO BUSINESS
- IVOIRE TELECOM SERVICES
- NIGER TRANSPORT INTERNATIONAL

### Bénéficiaires (13)
Personnes physiques, entreprises, entités internationales

---

## 🔍 Structure MT101

### Blocs SWIFT

**Block 1:** Basic Header `{1:F01BICXXXXX SEQNUM}`
**Block 2:** Application Header `{2:O101HHMM YYMMDD...}`
**Block 4:** Text Block (champs MT101)

### Champs MT101

```
:20:  Référence transaction (MT101AUTOxxx)
:21R: Référence client
:28D: Message index (1/1)
:30:  Date d'exécution (YYMMDD)
:50C: Institution donneur d'ordre (BIC)
:50H: Compte donneur d'ordre + Nom + Adresse
:21:  Référence transaction individuelle
:32B: Devise + Montant (XOF150000000,)
:57A: Banque bénéficiaire (BIC)
:59:  Compte bénéficiaire + Nom + Adresse
:70:  Motif paiement (/ROC/...)
:71A: Option frais (SHA/OUR/BEN)
```

### Exemple Complet

```
{1:F01CORIBFBFXXXX3748337494}{2:O1011825260106ENMNGB2LXXXX37483374942601061825N}{4:
:20:MT101AUTO002
:21R:MT101AUTO002
:28D:1/1
:30:260106
:50C:ENMNGB2LXXX
:50H:/BF148010014226082410147
HOUNDE GOLD OPERATION
Ouaga 2000 Zone A Secteur 53
BF/Ouagadougou
:21:MT101AUTO002
:32B:XOF150000000,
:57A:CORIBFBFXXX
:59:/ML1810100100008602410105
EXAFI
ML/BAKAMO
:70:/ROC/TEST/BENEFICIAIRE03
:71A:SHA
-}
```

---

## 🧪 Tests

### Tests automatisés (test-mt101.html)
1. ✅ Chargement modules
2. ✅ Configuration types
3. ✅ Génération références
4. ✅ Formatage montants
5. ✅ Génération Interne
6. ✅ Génération Compensé
7. ✅ Génération RTGS
8. ✅ Génération Étranger
9. ✅ Génération multiple

### Scénarios de test recommandés

**Scénario 1: Salaires internes**
```
Type: INTERNE
Filiale: CORIBFBF
Fichiers: 1
Transactions: 50
Montants: 50K - 500K XOF
```

**Scénario 2: Paiements fournisseurs**
```
Type: COMPENSE
Filiale: CORIMLBA
Fichiers: 3
Transactions: 20
Montants: 500K - 10M XOF
```

**Scénario 3: Transferts RTGS**
```
Type: RTGS
Filiale: CORISNDA
Fichiers: 1
Transactions: 5
Montants: 50M - 200M XOF
```

**Scénario 4: Paiements internationaux**
```
Type: ETRANGER
Filiale: CORIBFBF
Fichiers: 1
Transactions: 10
Devise: EUR
Montants: 1K - 50K EUR
Frais: OUR
```

---

## ⚠️ Avertissements

### Usage test uniquement
- ❌ Ne jamais utiliser en production
- ❌ Ne pas utiliser de vrais comptes
- ❌ Ne pas utiliser de vraies données clients
- ✅ Toujours tester dans CBS Amplitude TEST

### Limites techniques
- Fichiers: 1-100 par génération
- Transactions: 1-500 par fichier
- Checksums: Générés aléatoirement
- Comptes: Générés aléatoirement

### Validation requise
- ✅ Valider structure SWIFT
- ✅ Valider champs obligatoires
- ✅ Tester dans CBS Amplitude
- ✅ Vérifier traitement correct

---

## 📖 Documentation

### Guides
- **GUIDE_MT101.md** - Guide utilisateur complet
- **README_MT101.md** - Ce fichier (documentation technique)
- **README_v2.md** - Documentation générale v2.0

### Tests
- **test-mt101.html** - Tests automatisés interactifs

### Code
- **js/mt101-config.js** - Configuration complète
- **js/mt101-generator.js** - Moteur de génération
- **js/mt101-main.js** - Interface utilisateur

---

## 🔧 API Interne

### Classes principales

**MT101Generator**
```javascript
const generator = new MT101Generator(config);
const files = generator.generateAllFiles(config);
```

**Méthodes**
- `generateMT101(transactionData)` - Génère un MT101
- `generateTransaction(type, filiale, config)` - Génère une transaction
- `generateFile(index, config)` - Génère un fichier
- `generateAllFiles(config)` - Génère tous les fichiers

### Fonctions utilitaires

```javascript
generateMT101Reference()        // MT101AUTOxxx
generateMT101SequenceNumber()   // 10 chiffres
generateMT101AccountNumber()    // Compte bancaire
formatMT101IBAN()              // Format IBAN
```

---

## 🌍 Support Multi-devises

### Devises supportées

| Code | Nom | Taux indicatif XOF |
|------|-----|-------------------|
| XOF | Franc CFA | 1 |
| EUR | Euro | 655.957 |
| USD | Dollar US | 580 |
| GBP | Livre Sterling | 750 |
| CHF | Franc Suisse | 620 |
| CAD | Dollar Canadien | 420 |

### Format montants

**XOF:** `150000000,` (sans décimales)
**EUR/USD/GBP:** `1250,50` (2 décimales)

---

## 🔐 Sécurité

- ✅ Génération locale (navigateur)
- ✅ Aucune donnée envoyée en ligne
- ✅ Comptes générés aléatoirement
- ✅ Pour environnement TEST uniquement

---

## 📞 Support

**Équipe IT CORIS Bank UEMOA**
- Support technique CBS Amplitude
- Documentation interne

**Documentation:**
- README_v2.md - Vue d'ensemble
- GUIDE_MT101.md - Guide utilisateur
- test-mt101.html - Tests

---

## 🎉 Prêt à utiliser !

👉 **Ouvrez mt101-generator.html pour commencer**

---

**Version:** 2.0.0  
**Date:** Février 2026  
**Statut:** ✅ Opérationnel  
**Type:** MT101 Request for Transfer  
**Usage:** Tests CBS Amplitude CORIS Bank UEMOA
