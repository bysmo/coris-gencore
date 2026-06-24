# 🏦 Portail Client PME/PMI - Générateur de Flux de Masse CORIS Bank UEMOA
## 📄 Spécifications & Guide d'Utilisation

Bienvenue dans la documentation du **Portail Client PME/PMI**, une interface web moderne et autonome conçue pour les clients entreprises (PME/PMI) de CORIS Bank. Ce portail permet de convertir des fichiers comptables (Excel) en fichiers de virements et prélèvements de masse structurés, prêts pour une intégration directe et rapide dans le Core Banking System (**Amplitude**) de la banque, éliminant ainsi les saisies manuelles sources d'erreurs et de lenteurs.

---

## 🌟 Proposition de Valeur

### 🚫 Problème Historique :
Les PME/PMI transmettent souvent des fichiers Excel non structurés ou des ordres de virement papier. Les agents de la banque doivent ressaisir manuellement chaque transaction (parfois des centaines de lignes pour les salaires ou règlements fournisseurs), ce qui entraîne :
- Risques élevés d'erreurs de saisie (RIB incorrect, montant mal tapé).
- Délais de traitement importants.
- Surcharge opérationnelle pour les équipes Middle/Back-Office.

###  Solution Apportée :
Ce portail offre une autonomie totale aux PME/PMI :
1. **Auto-génération :** Le client charge son tableau Excel de virements.
2. **Validation instantanée :** L'application vérifie la cohérence du fichier (équilibrage débit/crédit, validité des RIB, formatage).
3. **Intégration rapide :** L'application génère un fichier normalisé (Amplitude, AFB160, MT101 ou ISO 20022 pain.001) téléchargeable immédiatement pour transmission sécurisée à la banque pour intégration automatique sans ressaisie.

---

## 🚀 Fonctionnalités Clés

### 1. Module Virement de Masse (`virement-masse-generator.html`)
Permet de regrouper plusieurs virements en un seul fichier de traitement.
* **Formats d'export supportés :**
  - **Amplitude TXT (Format 255 caractères) :** Structure classique stricte requise par le CBS Amplitude (En-tête type `1` et Détails type `2`).
  - **AFB160 :** Standard interbancaire français de virements de masse.
  - **MT101 (Request for Transfer) :** Standard SWIFT FIN pour les virements initiés par la clientèle.
  - **pain.001.001.03 (ISO 20022 XML) :** Standard moderne international au format XML.
* **Modes de débit :**
  - **Débit global :** Un seul débit sur le compte du donneur d'ordre pour le montant total, et plusieurs crédits.
  - **Débits multiples :** Un débit individuel associé à chaque crédit bénéficiaire.
* **Contrôles de sécurité embarqués :**
  - **Équilibre strict :** Validation que le total des crédits bénéficiaires est rigoureusement égal au montant de débit déclaré par le donneur d'ordre.
  - **Vérification IBAN/RIB :** Validation du format des comptes bancaires de la zone UEMOA, CEMAC et BCRG.

### 2. Module Prélèvement de Masse (`prelevements-generator.html`)
*(En cours de développement)*
Permet aux PME/PMI de générer des fichiers de prélèvements automatiques (Direct Debits) pour le recouvrement de leurs factures clients, sur la base de mandats signés.

---

## 📊 Structure Requise du Fichier Excel

Pour être traité correctement, le fichier Excel importé par la PME/PMI doit respecter la structure suivante :

### 🔹 Lignes 1 & 2 : Informations du Donneur d'ordre
* **Ligne 1 (En-têtes) :** `REFERENCE_VIREMENT` | `DATE_EXECUTION` | `RAISON_SOCIALE` | `CODE_ETABLISSEMENT` | `CODE_GUICHET` | `NUMERO_COMPTE` | `CLE_RIB` | `NBRE_VIREMENT` | `DEVISE` | `MONTANT` | `MOTIF_VIREMENT` | `DEVISE_NUMERIQUE`
* **Ligne 2 (Données) :** Saisie des coordonnées bancaires et du montant total à débiter de l'entreprise.

### 🔹 Lignes 3 & 4+ : Informations des Bénéficiaires
* **Ligne 3 (En-têtes) :** `N` | `NOM_BENEFICIAIRE` | `CODE_ETABLISSEMENT` | `CODE_GUICHET` | `NUMERO_COMPTE` | `CLE_RIB` | `MONTANT` | `MOTIF_VIREMENT`
* **Lignes 4 et suivantes (Données) :** Liste de tous les bénéficiaires avec leurs coordonnées bancaires individuelles et leurs montants.

> 💡 **Exemple de fichier d'import :** Un fichier exemple est disponible à la racine sous le nom `exemple_iban.txt` pour tester la conformité des structures de comptes.

---

## 📂 Formats de Fichiers de Sortie

### 1. Format Amplitude TXT (255 caractères)
Ce format génère un fichier texte plat où chaque ligne fait exactement 255 caractères de long.

* **Ligne 1 (Type 1 - En-tête Donneur d'Ordre) :**
  - Position 1 : Code enregistrement `1`
  - Position 2-9 : Référence virement
  - Position 10-15 : Date d'exécution (AAMMJJ)
  - Position 16-51 : Raison sociale du donneur d'ordre
  - Position 52-61 : Code Banque + Code Guichet
  - Position 62-77 : Numéro de compte
  - Position 78-79 : Clé RIB
  - Position 80-85 : Nombre total de lignes de détail
  - Position 86-105 : Montant total cumulé (remplissage à gauche par des `0`)
  - Position 106-134 : Motif global
  - Position 135-144 : Remplissage (espaces)
  - Position 145-147 : Code devise numérique (Ex: `952` pour le XOF)
  - Position 148-255 : Remplissage / Informations système

* **Lignes suivantes (Type 2 - Détails Bénéficiaires) :**
  - Position 1 : Code enregistrement `2`
  - Position 2-13 : Référence transaction individuelle
  - Position 14-49 : Nom du bénéficiaire
  - Position 50-73 : Remplissage domiciliation
  - Position 74-78 : Code établissement bancaire bénéficiaire
  - Position 79-83 : Code guichet bénéficiaire
  - Position 84-99 : Numéro de compte bénéficiaire
  - Position 100-101 : Clé RIB bénéficiaire
  - Position 102-121 : Montant du virement (remplissage à gauche par des `0`)
  - Position 122-151 : Motif du virement individuel
  - Position 152-255 : Remplissage (espaces)

### 2. Format pain.001.001.03 (ISO 20022 XML)
Génère un fichier XML conforme aux normes SEPA et de la BCEAO pour les virements transfrontaliers et nationaux modernes.
* Balise principale : `<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">`
* Regroupement des transactions sous un bloc `<PmtInf>` (Payment Information).
* Détails individuels dans les balises `<CdtTrfTxInf>`.

---

## 🔒 Sécurité des Données & Confidentialité

* **Exécution 100% Locale :** L'intégralité du traitement et de la conversion des fichiers Excel s'effectue dans le navigateur Web du client.
* **Aucune transmission réseau :** Aucun fichier comptable n'est téléversé ou stocké sur un serveur externe. Les données financières restent confinées dans la mémoire locale de la machine de l'utilisateur.
* **Zéro base de données :** L'application est statique (HTML/CSS/JS) et n'enregistre aucune information nominative ou bancaire.

---

## 🛠️ Utilisation Pas à Pas pour la PME/PMI

1. **Ouvrir le portail :** Double-cliquez sur `index.html` ou naviguez vers le menu.
2. **Accéder au Virement de Masse :** Dans la barre latérale ou le menu principal, sélectionnez **Virement de Masse**.
3. **Charger le fichier comptable :**
   - Glissez-déposez le fichier Excel (`.xlsx` ou `.xls`) dans la zone d'importation dédiée.
   - L'application lit et parse instantanément le tableau.
4. **Vérifier les données à l'écran :**
   - **Onglet Donneur d'ordre :** Validez les informations de votre entreprise et le compte à débiter.
   - **Onglet Bénéficiaires :** Vérifiez le nombre de bénéficiaires, le montant total cumulé, et la liste des virements.
   - Si un écart existe entre le montant total déclaré et la somme des lignes de détail, l'application bloque la génération et affiche une alerte descriptive.
5. **Choisir le format d'export :**
   - Sélectionnez le format requis par votre agence CORIS Bank (généralement **Amplitude Txt** ou **pain.001**).
   - Choisissez si vous souhaitez un débit global (recommandé pour les salaires) ou des débits multiples.
6. **Générer et Télécharger :**
   - Cliquez sur **Générer le fichier**.
   - Allez sur l'onglet **Fichier généré** pour inspecter visuellement le résultat.
   - Cliquez sur **Télécharger le fichier** pour enregistrer le fichier prêt à l'intégration sur votre ordinateur.

---

## 💻 Stack Technique
* **Frontend :** HTML5, CSS3 (Vanilla), JavaScript (ES6+).
* **Librairie de Parsing :** `xlsx.full.min.js` (SheetJS) pour la lecture instantanée des classeurs Excel sans backend.
* **Icônes :** Font Awesome v6.

---
**Version :** 3.0.0 (Production-Ready)  
**Éditeur :** CORIS Bank International  
*(Usage réservé aux clients PME/PMI et équipes d'intégration CORIS Bank UEMOA)*
