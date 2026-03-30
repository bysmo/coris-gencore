# 📖 GUIDE MT101 - Générateur Messages SWIFT

## 🎯 Introduction

Le générateur MT101 permet de créer des messages de demande de virement envoyés par les clients corporates vers leur banque (CORIS). Ces messages sont utilisés pour initier différents types de transferts.

---

## 📋 Types de Virements MT101

### 1️⃣ INTERNE
**Description :** Virements entre comptes de la même filiale CORIS

**Caractéristiques :**
- ✅ Même filiale émettrice et réceptrice
- ✅ Devise : XOF uniquement
- ✅ Montants : 1 000 - 100 000 000 XOF
- ✅ Traitement rapide interne
- ✅ Frais : SHA (partagés)

**Exemple d'utilisation :**
- Virements de salaires internes
- Transferts entre comptes client
- Opérations comptables internes

---

### 2️⃣ COMPENSÉ
**Description :** Virements vers autres banques UEMOA via compensation

**Caractéristiques :**
- ✅ Banques bénéficiaires UEMOA (non-CORIS)
- ✅ Devise : XOF uniquement
- ✅ Montants : < 50 000 000 XOF
- ✅ Pas de mention 23E:RTGS
- ✅ Traitement J+1 via compensation
- ✅ Frais : SHA (partagés)

**Banques supportées :**
- ECOBANK (Mali, Burkina, Sénégal, Côte d'Ivoire)
- Société Générale (Burkina, Mali)
- Bank of Africa (Burkina, Mali)
- Atlantic Bank (Burkina, Mali)
- Autres banques UEMOA

**Exemple d'utilisation :**
- Paiements fournisseurs autres banques
- Virements clients vers autres banques
- Règlements commerciaux

---

### 3️⃣ RTGS
**Description :** Virements RTGS vers confrères via BCEAO

**Caractéristiques :**
- ✅ Montants ≥ 50 000 000 XOF OU mention 23E:RTGS
- ✅ Devise : XOF uniquement
- ✅ Traitement temps réel via BCEAO
- ✅ Banques bénéficiaires UEMOA
- ✅ Frais : SHA (partagés)

**Critères RTGS :**
1. Montant ≥ 50 millions XOF, OU
2. Présence du champ 23E:RTGS

**Exemple d'utilisation :**
- Gros transferts urgents
- Paiements importants fournisseurs
- Opérations significatives

---

### 4️⃣ ÉTRANGER
**Description :** Transferts internationaux en devises

**Caractéristiques :**
- ✅ Devises : EUR, USD, GBP, CHF, CAD
- ✅ Banques internationales
- ✅ Montants variés selon devise
- ✅ Options de frais : OUR, SHA, BEN

**Devises supportées :**
| Devise | Nom | Taux indicatif |
|--------|-----|----------------|
| EUR | Euro | 1 EUR = 655.957 XOF |
| USD | Dollar US | 1 USD ≈ 580 XOF |
| GBP | Livre Sterling | 1 GBP ≈ 750 XOF |
| CHF | Franc Suisse | 1 CHF ≈ 620 XOF |
| CAD | Dollar Canadien | 1 CAD ≈ 420 XOF |

**Options de frais :**
- **OUR** : Tous les frais à la charge du donneur d'ordre
- **SHA** : Frais partagés (défaut)
- **BEN** : Tous les frais à la charge du bénéficiaire

**Banques internationales :**
- Citibank London (CITIGB2L)
- BNP Paribas Paris (BNPAFRPP)
- Deutsche Bank Frankfurt (DEUTDEFF)
- JP Morgan Chase New York (CHASUS33)
- UBS Switzerland (UBSWCHZH)
- HSBC London (HSBCGB2L)

**Exemple d'utilisation :**
- Paiements internationaux
- Importations/Exportations
- Transferts en devises

---

## 🚀 UTILISATION ÉTAPE PAR ÉTAPE

### Étape 1 : Ouvrir le générateur
```
Ouvrez mt101-generator.html dans votre navigateur
```

### Étape 2 : Sélectionner le type de virement
Choisissez parmi les 4 types :
- **Interne** : Même filiale
- **Compensé** : Autres banques < 50M
- **RTGS** : ≥ 50M ou RTGS
- **Étranger** : International

### Étape 3 : Sélectionner la filiale émettrice
Choisissez la filiale CORIS qui émet les MT101 :
- Coris Burkina (CORIBFBF)
- Coris Bénin (CORIBJBJ)
- Coris Côte d'Ivoire (CORICIAB)
- Coris Guinée Bissau (CORIGWGW)
- Coris Mali (CORIMLBA)
- Coris Niger (CORINENI)
- Coris Sénégal (CORISNDA)
- Coris Togo (CORITGTG)

### Étape 4 : Configurer la génération
- **Date de valeur** : Date d'exécution des virements
- **Nombre de fichiers** : 1-100 fichiers
- **Transactions par fichier** : 1-500 MT101 par fichier

### Étape 5 : Configurer les montants
**Pour virements XOF (Interne, Compensé, RTGS) :**
- Petits montants : 1K - 100K XOF
- Montants moyens : 100K - 10M XOF
- Gros montants : 10M - 500M XOF

**Pour virements étrangers :**
- Sélectionnez la devise (EUR, USD, GBP, CHF, CAD)
- Définissez la plage de montants
- Choisissez l'option de frais (OUR, SHA, BEN)

### Étape 6 : Options avancées (optionnel)
- **Option de frais** : OUR / SHA / BEN
- **Motif personnalisé** : /ROC/VOTRE/MOTIF
- **Préfixe fichier** : Personnaliser le nom

### Étape 7 : Générer
Cliquez sur **"Générer les fichiers MT101"**

### Étape 8 : Télécharger
- Téléchargement individuel par fichier
- Téléchargement groupé de tous les fichiers

---

## 📊 FORMAT DES FICHIERS GÉNÉRÉS

### Structure MT101

```
{1:F01CORIBFBFXXXX3748337494}
{2:O1011825260106ENMNGB2LXXXX37483374942601061825N}
{4:
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

### Champs principaux

| Champ | Description | Obligatoire |
|-------|-------------|-------------|
| :20: | Référence transaction | ✅ |
| :21R: | Référence client | ✅ |
| :28D: | Message index | ✅ |
| :30: | Date demandée | ✅ |
| :50C: | Institution donneur d'ordre | ❌ |
| :50H: | Compte et nom donneur d'ordre | ✅ |
| :21: | Référence transaction | ✅ |
| :32B: | Devise et montant | ✅ |
| :57A: | Banque bénéficiaire | ❌ |
| :59: | Compte et nom bénéficiaire | ✅ |
| :70: | Motif de paiement | ✅ |
| :71A: | Option de frais | ✅ |

---

## 🧪 TESTS

### Tests automatisés
Ouvrez `test-mt101.html` pour exécuter :
1. Test chargement modules
2. Test configuration types
3. Test génération références
4. Test formatage montants
5. Test génération Interne
6. Test génération Compensé
7. Test génération RTGS
8. Test génération Étranger
9. Test génération multiple

### Tests manuels recommandés

**Test 1 : Virement Interne**
```
Type : INTERNE
Filiale : CORIBFBF
Transactions : 5
Montants : 10K - 500K XOF
```

**Test 2 : Virement Compensé**
```
Type : COMPENSE
Filiale : CORIMLBA
Transactions : 10
Montants : 100K - 10M XOF
```

**Test 3 : Virement RTGS**
```
Type : RTGS
Filiale : CORISNDA
Transactions : 5
Montants : 50M - 200M XOF
```

**Test 4 : Virement Étranger**
```
Type : ETRANGER
Filiale : CORIBFBF
Devise : EUR
Transactions : 5
Montants : 100 - 10000 EUR
Option frais : OUR
```

---

## ⚠️ POINTS IMPORTANTS

### ✅ À FAIRE
- Toujours tester dans CBS Amplitude TEST
- Valider les fichiers avant import
- Utiliser des comptes de test
- Vérifier les montants selon le type

### ❌ À NE PAS FAIRE
- Ne jamais utiliser en production
- Ne pas mélanger les types dans un fichier
- Ne pas dépasser les limites de montants
- Ne pas utiliser de vrais comptes clients

### 🔒 Sécurité
- Fichiers générés localement
- Aucune donnée envoyée en ligne
- Pour tests uniquement
- Validation CBS requise

---

## 📞 SUPPORT

**Documentation :**
- README_MT101.md - Documentation complète
- test-mt101.html - Tests automatisés
- Ce guide - Guide d'utilisation

**Support technique :**
- Équipe IT CORIS Bank UEMOA
- CBS Amplitude Support Team

---

## 🎉 PRÊT À GÉNÉRER !

👉 **Ouvrez mt101-generator.html et commencez !**

---

**Version :** 2.0.0  
**Date :** Février 2026  
**Type :** MT101 - Messages de demande de virement  
**Usage :** Tests CBS Amplitude uniquement
