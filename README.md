# Générateur MT103 RTGS BCEAO - CORIS Bank UEMOA

**Version 3.0.0** ✅ | **Dernière mise à jour :** 09/02/2026  
**Statut :** Production-ready pour tests CBS Amplitude

> ✨ **Nouvelles fonctionnalités :**  
> - **MT103 RTGS** : Messages RTGS reçus de la BCEAO  
> - **MT101** : Demandes de virements clients (4 types)  
> - **MT910** : Confirmations BCEAO pour MT103 RTGS

## 🚀 Démarrage rapide

**Pour commencer immédiatement :**
1. Ouvrez `menu.html` dans votre navigateur pour voir le menu principal
2. Choisissez entre **MT103 RTGS**, **MT101**, ou consultez les guides
3. Importez vos IBAN et générez vos fichiers de test

**Fichiers principaux :**
- `menu.html` - Menu principal de navigation
- `mt103-generator.html` - Générateur MT103 RTGS + MT910
- `mt101-generator.html` - Générateur MT101 (4 types)
- `guide.html` - Guide d'utilisation MT103
- `test.html` - Tests unitaires MT103
- `test-mt101.html` - Tests unitaires MT101

---

## 📋 Description

Application web professionnelle pour générer des fichiers de messages SWIFT conformes aux standards SWIFT FIN et aux spécifications de la BCEAO (Banque Centrale des États de l'Afrique de l'Ouest).

**Types de messages supportés :**
- **MT103 RTGS** : Virements RTGS reçus de la BCEAO
- **MT910** : Confirmations de crédit BCEAO (liées aux MT103)
- **MT101** : Demandes de virements clients (4 cas d'usage)

Cette application permet aux équipes techniques de CORIS Bank de créer des fichiers de test pour le système CBS Amplitude.

## ✨ Fonctionnalités

### Fonctionnalités actuellement implémentées

✅ **Génération de messages MT103 RTGS**
- Conformité totale au format SWIFT MT103
- Respect de la structure RTGS BCEAO analysée depuis les fichiers réels
- Génération de tous les blocs SWIFT (Basic Header, Application Header, User Header, Text Block, Trailer)
- Génération automatique des références uniques, UUID, checksums

✅ **Génération de messages MT910 (NOUVEAU)**
- Confirmations BCEAO pour chaque MT103 RTGS généré
- Lien automatique MT910 ↔ MT103 via référence :21 et :108
- Fichier unique contenant toutes les confirmations MT910
- Champs :25 (Code RTGS), :32A (Date/Montant), :52A (BCEAO) automatiques

✅ **Génération de messages MT101 (NOUVEAU)**
- 4 types de virements : RTGS, Internes, Compensés, Étrangers/Devises
- Support de multiples transactions par fichier
- Configuration spécifique par type (devises, montants, bénéficiaires)
- Validation automatique selon le type de virement

✅ **Support multi-filiales**
- 8 filiales CORIS Bank UEMOA configurées
- Données complètes : BIC, codes pays, codes participants RTGS
- Filiales supportées :
  - Coris Burkina (CORIBFBF - BF148)
  - Coris Bénin (CORIBJBJ - BJ212)
  - Coris Côte d'Ivoire (CORICIAB - CI166)
  - Coris Guinée Bissau (CORIGWGW - GW243)
  - Coris Mali (CORIMLBA - ML181)
  - Coris Niger (CORINENI - NE210)
  - Coris Sénégal (CORISNDA - SN213)
  - Coris Togo (CORITGTG - TG182)

✅ **Import flexible d'IBAN bénéficiaires**
- Import depuis fichiers CSV/TXT
- Saisie manuelle dans l'interface
- Support drag & drop
- Validation automatique des IBAN UEMOA
- Prévisualisation des IBAN chargés

✅ **Configuration avancée**
- Nombre de fichiers à générer (1-100)
- Nombre de transactions par fichier (1-1000)
- Plage de montants aléatoires configurables en XOF et devises étrangères
- Préréglages rapides (petits, moyens, gros montants)
- Date de valeur personnalisable
- Options avancées (client donneur d'ordre, motif de paiement, préfixe fichier)
- **Option MT910** : Générer automatiquement les confirmations BCEAO

✅ **Génération intelligente**
- Montants aléatoires réalistes en XOF
- Rotation des IBAN bénéficiaires sur les transactions
- Banques émettrices UEMOA variées (10 banques configurées)
- Noms de clients et motifs de paiement réalistes
- Génération de numéros de compte bancaires

✅ **Téléchargement des fichiers**
- Téléchargement individuel par fichier (MT103, MT101, MT910)
- Téléchargement groupé de tous les fichiers
- Format TXT conforme SWIFT
- Nommage automatique avec timestamp
- Fichier MT910 unique regroupant toutes les confirmations

✅ **Interface utilisateur moderne**
- Design professionnel et responsive
- Interface intuitive en français
- Indicateurs visuels de progression
- Prévisualisation des résultats
- Compatible mobile et tablette

## 🚀 Utilisation

### 🎯 Sélection du type de message

1. **Ouvrir l'application** : Ouvrez `menu.html` dans votre navigateur
2. **Choisir le type de message :**
   - **MT103 RTGS + MT910** : Virements RTGS reçus de la BCEAO avec confirmations
   - **MT101** : Demandes de virements clients (4 types)

### 📨 Génération MT103 RTGS + MT910

#### 1. Ouvrir le générateur MT103

Ouvrez le fichier `mt103-generator.html` dans votre navigateur web moderne (Chrome, Firefox, Edge, Safari).

### 2. Configurer la génération MT103 RTGS

#### Étape 1 : Sélectionner la filiale destinataire
Choisissez la filiale CORIS qui recevra les fichiers MT103 RTGS.

#### Étape 2 : Configuration de base
- **Date de valeur** : Sélectionnez la date de valeur des transactions
- **Nombre de fichiers** : Indiquez combien de fichiers générer (1-100)
- **Transactions par fichier** : Définissez le nombre de MT103 par fichier (1-1000)

#### Étape 3 : Import des IBAN bénéficiaires
**Option A - Import depuis fichier :**
1. Cliquez sur "Parcourir" ou glissez-déposez votre fichier
2. Formats acceptés : CSV, TXT
3. Format du fichier : un IBAN par ligne

Exemple de fichier IBAN :
```
ML1810100200041802510100
BF1234567890123456789012
CI9876543210987654321098
SN1111222233334444555566
```

**Option B - Saisie manuelle :**
1. Sélectionnez "Saisie manuelle"
2. Entrez les IBAN, un par ligne
3. La prévisualisation s'affiche automatiquement

#### Étape 4 : Configuration des montants
- **Montant minimum** : Montant minimal des transactions en XOF
- **Montant maximum** : Montant maximal des transactions en XOF
- **Préréglages rapides** :
  - Petits montants : 5 000 - 100 000 XOF
  - Montants moyens : 50 000 - 1 000 000 XOF
  - Gros montants : 500 000 - 10 000 000 XOF

#### Étape 5 : Options avancées (optionnel)
- **Client donneur d'ordre** : Nom du client émetteur (généré aléatoirement si vide)
- **Information de paiement** : Motif de paiement (généré aléatoirement si vide)
- **Préfixe du nom de fichier** : Personnaliser le nom des fichiers générés
- **✨ Générer les MT910** : Cochez cette option pour générer automatiquement les confirmations BCEAO MT910 pour chaque MT103 généré

### 3. Générer les fichiers MT103 (et optionnellement MT910)

Cliquez sur "**Générer les fichiers MT103**"

L'application va :
1. Valider toutes les données saisies
2. Générer les messages MT103 conformes SWIFT/BCEAO
3. **Si l'option MT910 est activée** : Générer un fichier MT910 unique contenant toutes les confirmations BCEAO
4. Afficher les fichiers générés avec leurs détails

### 4. Télécharger les fichiers

- **Téléchargement individuel** : Cliquez sur le bouton de chaque fichier (MT103 ou MT910)
- **Téléchargement groupé** : Cliquez sur "Télécharger tous les fichiers (ZIP)"

**Note :** Si vous avez activé l'option MT910, vous trouverez un fichier supplémentaire contenant toutes les confirmations BCEAO.

### 5. Nouvelle génération

Cliquez sur "**Nouvelle génération**" pour créer d'autres fichiers.

---

### 📤 Génération MT101 (Demandes de virements clients)

Consultez le fichier **README_MT101.md** pour des instructions détaillées sur :
- Les 4 types de virements MT101 (RTGS, Internes, Compensés, Étrangers/Devises)
- La configuration spécifique de chaque type
- Les exemples de génération

Ouvrez `mt101-generator.html` pour accéder au générateur MT101.

## 📂 Structure du projet

```
generateur-swift-coris/
│
├── 🏠 menu.html                  # Menu principal de navigation
├── 🚀 mt103-generator.html     # Générateur MT103 RTGS + MT910
├── 📤 mt101-generator.html     # Générateur MT101 (4 types)
├── 📖 guide.html                # Guide d'utilisation MT103
├── 🧪 test.html                 # Tests unitaires MT103
├── 🧪 test-mt101.html           # Tests unitaires MT101
│
├── 📄 README.md                 # Documentation principale (ce fichier)
├── 📄 README_MT101.md           # Documentation MT101
├── 📄 README_MT910.md           # Documentation MT910
├── 📄 EXEMPLES_MT101.md         # Exemples de MT101 générés
├── ⚡ DEMARRAGE_RAPIDE.md       # Guide de démarrage en 3 étapes
├── 📋 DONNEES_TEST.md          # Scénarios et données de test
├── 📝 CHANGELOG.md             # Historique des versions
│
├── 💾 exemple_iban.txt         # 40 IBAN de test UEMOA
├── 📤 exemple_mt103_output.txt # Exemples de MT103 générés
│
├── css/
│   └── style.css               # Styles CSS de l'application
│
└── js/
    ├── config.js               # Configuration (filiales, banques, données)
    ├── mt103-generator.js      # Moteur de génération MT103
    ├── mt910-generator.js      # Moteur de génération MT910 (NOUVEAU)
    ├── mt101-config.js         # Configuration MT101
    ├── mt101-generator.js      # Moteur de génération MT101
    ├── main.js                 # Logique principale MT103 + UI
    └── mt101-main.js           # Logique principale MT101 + UI
```

## 🔧 Format des fichiers générés

### 📨 Exemple de message MT103 généré

```
{1:F21CORIMLBAAXXX 4967194233}{4:{177:2601270938}{451:0}}{1:F01CORIMLBAAXXX 4967194233}{2:O1030938260127BCAOSNDPAXXX31220255572601270938N}{3:{113:0030}{108:O01SIP1183205336}{121:c1464b96-16b8-4e9f-8b08-3da831f01005}}{4:
:20:O01SIP1183205336
:23B:CRED
:23E:SDVA
:26T:001
:32A:260127XOF30000,
:50K:/0010511500767201
//COULIBALY SEYDOU
:53A:/D/D00030901
ECOCMLBA
:57A:/C/D00030181
CORIMLBA
:59:/ML1810100200041802510100
//COULIBALY SEYDOU
:70:VIREMENT PERMANENT
:71A:SHA
:72:/CODTYPTR/001
-}{5:{MAC:00000000}{CHK:E4751B843A1F}}{S:{SAC:}{COP:S}}
```

### Structure détaillée des blocs SWIFT MT103

- **Block 1** : Basic Header Block (F21 pour envoi)
- **Block 4 (tags)** : {177} date/heure, {451} priorité
- **Block 1 (répété)** : F01 Application Header
- **Block 2** : Application Header Output (O103)
- **Block 3** : User Header ({113}, {108}, {121})
- **Block 4 (text)** : Corps du message MT103
  - :20: Transaction Reference
  - :23B: Bank Operation Code (CRED)
  - :23E: Instruction Code (SDVA)
  - :26T: Transaction Type Code
  - :32A: Value Date, Currency, Amount
  - :50K: Ordering Customer
  - :53A: Sender's Correspondent
  - :57A: Account With Institution
  - :59: Beneficiary Customer
  - :70: Remittance Information
  - :71A: Details of Charges
  - :72: Sender to Receiver Information
- **Block 5** : Trailer Block (MAC, CHK)
- **Block S** : System Block

---

### ✅ Exemple de message MT910 généré (Confirmation BCEAO)

```
{1:F21CORIMLBAAXXX4967194233}{4:{177:2601270938}{451:0}}{1:F01CORIMLBAAXXX4967194233}{2:O9100938260127BCAOSNDPAXXX31220255572601270938N}{3:{113:0003}{108:O01SIP1183205336}}{4:
:20:981946836/910
:21:O01SIP1183205336
:25:D00030181
:32A:260127XOF30000,
:52A:BCAOSNDP
:72:/CLRBRVM/0003
/SGI/CORIMLBAAXXX
-}{5:{CHK:E4751B843A1F}}{S:{COP:S}}
```

**Lien MT910 ↔ MT103 :**
- Champ **:21** du MT910 = Champ **:20** du MT103
- Champ **:108** (Bloc 3) du MT910 = Champ **:20** du MT103
- Champ **:25** du MT910 = Code RTGS de la filiale destinataire
- Champ **:32A** du MT910 = Date/Devise/Montant identiques au MT103
- Champ **:52A** du MT910 = BCAOSNDP (BCEAO)

---

### 📤 Exemples de messages MT101

Consultez le fichier **EXEMPLES_MT101.md** pour des exemples détaillés de :
- MT101 RTGS (virements confrères >50M ou avec 23E:RTGS)
- MT101 Internes (virements entre clients même filiale)
- MT101 Compensés (virements autres banques <50M)
- MT101 Étrangers/Devises (virements internationaux)

## 💻 Technologies utilisées

- **HTML5** : Structure sémantique de l'application
- **CSS3** : Design moderne et responsive
- **JavaScript ES6+** : Logique métier et génération MT103
- **Font Awesome** : Icônes professionnelles

## 🔒 Sécurité et conformité

✅ Génération conforme aux standards SWIFT MT103  
✅ Respect des spécifications RTGS BCEAO  
✅ Validation des IBAN UEMOA  
✅ Génération de références uniques (UUID v4)  
✅ Format de date et montant conforme SWIFT  
✅ Checksums et champs système automatiques  

## 📱 Compatibilité

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Responsive (Mobile, Tablette, Desktop)

## 🎯 Cas d'usage

### Test CBS Amplitude - MT103 RTGS + MT910
Générer des fichiers MT103 RTGS et leurs confirmations MT910 pour tester :
- Le traitement des virements RTGS entrants
- La comptabilisation automatique via MT910
- La validation des formats SWIFT
- Les flux de traitement bancaire
- Les systèmes de compensation BCEAO

### Test CBS Amplitude - MT101
Générer des fichiers MT101 pour tester :
- Les demandes de virements RTGS (>50M ou 23E:RTGS)
- Les virements internes entre clients
- Les virements compensés vers autres banques (<50M)
- Les virements internationaux en devises étrangères

### Formation et démonstration
- Formation des équipes techniques
- Démonstration des formats SWIFT (MT103, MT101, MT910)
- Tests de charge et performance
- Simulations de scénarios bancaires complexes

## 📊 Données configurées

### 10 banques émettrices UEMOA
- ECOBANK (Mali, Burkina, Sénégal, Côte d'Ivoire)
- SOCIÉTÉ GÉNÉRALE (Burkina, Mali)
- BANK OF AFRICA (Burkina, Mali)
- ATLANTIC BANK (Burkina, Mali)

### 25 noms de clients réalistes
Personnes physiques et morales d'Afrique de l'Ouest

### 10 motifs de paiement courants
- Virement permanent
- Salaire
- Paiement facture
- Transfert commercial
- Règlement fournisseur
- etc.

## 🚧 Limitations et considérations

⚠️ **Usage test uniquement** : Cette application génère des fichiers pour tests. Ne pas utiliser en production sans validation complète.

⚠️ **Validation CBS** : Les fichiers générés doivent être validés dans votre environnement CBS Amplitude de test avant utilisation.

⚠️ **Montants XOF** : Les montants sont générés en XOF (Franc CFA) sans décimales. Les devises étrangères sont supportées pour les MT101 étrangers.

⚠️ **Checksums** : Les checksums (MAC, CHK) sont générés aléatoirement pour simulation.

⚠️ **MT910** : Les confirmations MT910 sont générées automatiquement avec les MT103, avec lien par référence :21/:108.

## 📞 Support

Pour toute question ou problème :
- Équipe IT CORIS Bank UEMOA
- CBS Amplitude Support Team

## 📜 Licence

© 2026 CORIS Bank UEMOA - Usage interne uniquement

---

## 🎉 Prochaines étapes recommandées

### Améliorations potentielles

1. **Export ZIP natif**
   - Implémenter JSZip pour créer un fichier ZIP unique
   - Téléchargement groupé optimisé pour MT103+MT910+MT101

2. **Templates personnalisés**
   - Sauvegarde de configurations fréquentes
   - Profils de génération prédéfinis par type de message

3. **Validation avancée**
   - Vérification Luhn pour IBAN
   - Validation BIC étendue
   - Contrôles métier (montants, devises, etc.)

4. **Historique de génération**
   - Stockage local des générations précédentes
   - Réutilisation de configurations
   - Export de statistiques

5. **Mode batch avancé**
   - Import de scénarios de test complets
   - Génération programmée
   - Combinaison MT103+MT910+MT101

6. **Statistiques**
   - Dashboard de génération
   - Métriques d'utilisation par type de message
   - Rapports de test

---

**Version** : 3.0.0  
**Date** : Février 2026  
**Développé pour** : CORIS Bank UEMOA - Tests CBS Amplitude  
**Messages supportés** : MT103 RTGS, MT910, MT101
# coris-gencore
