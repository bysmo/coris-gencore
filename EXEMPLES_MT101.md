# EXEMPLES MT101 - Fichiers générés par type

## 📋 TYPE 1: VIREMENT INTERNE

### Exemple 1: Virement Interne - 175 000 XOF
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
:32B:XOF175000,
:57A:CORIBFBFXXX
:59:/BF148010196921112410358
COLLEGE GIRA IMANA
BF/NA
:70:/ROC/TEST/BENEFICIAIRE01
:71A:SHA
-}
```

**Caractéristiques :**
- Même filiale (CORIBFBF)
- Devise XOF
- Montant < 50M XOF
- Pas de mention 23E:RTGS
- Frais partagés (SHA)

---

## 📋 TYPE 2: VIREMENT COMPENSÉ

### Exemple 2: Virement Compensé - 10 716 500 XOF
```
{1:F01CORIBFBFXXXX3748337494}{2:O1011825260106ENMNGB2LXXXX37483374942601061825N}{4:
:20:MT101AUTO002
:21R:MT101AUTO002
:28D:1/1
:30:241010
:50C:ENMNGB2LXXX
:50H:/BF148010014226082410147
HOUNDE GOLD OPERATION
Ouaga 2000 Zone A Secteur 53
BF/Ouagadougou
:21:MT101AUTO002
:32B:XOF175000,
:57A:CORIBFBFXXX
:59:/ML1810100900088632400137
YOUSSOUF TRAORE
MALI/BAMAKO
:70:/ROC/TEST/BENEFICIAIRE02
:71A:SHA
-}
```

**Caractéristiques :**
- Filiale émettrice: CORIBFBF
- Banque bénéficiaire: Autre banque UEMOA (pas CORIS)
- Devise XOF
- Montant < 50M XOF
- Traitement via compensation
- Frais partagés (SHA)

---

## 📋 TYPE 3: VIREMENT RTGS

### Exemple 3: Virement RTGS - 150 000 000 XOF
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

**Caractéristiques :**
- Montant ≥ 50M XOF (150M)
- Traitement RTGS via BCEAO
- Temps réel
- Banque bénéficiaire UEMOA
- Peut avoir champ 23E:RTGS (selon implémentation)

---

## 📋 TYPE 4: VIREMENT ÉTRANGER

### Exemple 4: Virement International - 2 GBP
```
{1:F01CORIBFBFXXXX3750437515}{2:O1011810260106ENMNGB2LXXXX37504375152601061810N}{4:
:20:TESTAUTO001
:21R:TESTAUTO001
:28D:1/1
:30:260106
:21:300INTCDEV003
:32B:GBP2,
:50C:ENMNGB2LXXX
:50H:/BF148010014226082410147
HOUNDE GOLD OPERATION
Ouaga 2000 Zone A Secteur 53
BF/Ouagadougou
:57A:CITIGB2L
:59:/GB19CITI18500814620682
Lafigue Holdings UK Limited
2nd Floor
GB/London,W85EH
:70:/ROC/300INTT000008///URI/Penny test
:71A:OUR
-}
```

**Caractéristiques :**
- Devise étrangère (GBP)
- Banque internationale (Citibank London)
- Compte IBAN international
- Frais à la charge du donneur d'ordre (OUR)
- Adresse complète bénéficiaire

---

## 📊 COMPARAISON DES TYPES

| Critère | Interne | Compensé | RTGS | Étranger |
|---------|---------|----------|------|----------|
| **Devise** | XOF | XOF | XOF | Multi |
| **Montant** | < 100M | < 50M | ≥ 50M | Variable |
| **Destination** | Même filiale | Autre banque UEMOA | Banque UEMOA | International |
| **Traitement** | Interne | J+1 Compensation | Temps réel BCEAO | SWIFT |
| **Frais** | SHA | SHA | SHA | OUR/SHA/BEN |
| **Champ 23E** | Non | Non | Possible | Non |
| **BIC :57A** | Non requis | Requis | Requis | Requis |

---

## 🔍 DÉTAILS DES CHAMPS

### Champs Obligatoires (tous types)
```
:20:  Référence transaction (unique)
:21R: Référence client
:28D: Index message (toujours 1/1)
:30:  Date d'exécution (YYMMDD)
:50H: Compte et nom donneur d'ordre
:32B: Devise et montant
:59:  Compte et nom bénéficiaire
:70:  Motif de paiement
:71A: Option de frais
```

### Champs Optionnels/Variables
```
:50C: BIC institution donneur d'ordre (corporates)
:57A: BIC banque bénéficiaire (sauf interne)
:23E: Code instruction (RTGS uniquement)
```

---

## 💡 NOTES IMPORTANTES

### Format des Montants
- **XOF:** `150000000,` (sans décimales, virgule finale)
- **Devises étrangères:** `1250,50` (2 décimales, virgule séparateur)

### Format des Dates
- **:30:** `YYMMDD` (ex: 260106 = 06/01/2026)

### Format des Comptes
- **UEMOA:** `/CCNNBBBBBBBBBBBBBBBBBB` (IBAN)
- **International:** `/GBNNCCCCNNNNNNNNNNNN` (IBAN pays)

### Padding de fin
Les messages se terminent avec un padding d'espaces (environ 82 caractères) pour alignement.

---

## 🧪 UTILISATION POUR TESTS

### Test Interne
```bash
Type: INTERNE
Fichiers: 1
Transactions: 10-50
Montants: 10K - 1M XOF
But: Tester virements internes, salaires
```

### Test Compensé
```bash
Type: COMPENSE
Fichiers: 3
Transactions: 20
Montants: 100K - 10M XOF
But: Tester compensation interbancaire
```

### Test RTGS
```bash
Type: RTGS
Fichiers: 1
Transactions: 5
Montants: 50M - 500M XOF
But: Tester RTGS temps réel
```

### Test Étranger
```bash
Type: ETRANGER
Fichiers: 1
Transactions: 10
Devises: EUR, USD, GBP
Montants: 100 - 50K
But: Tester transferts internationaux
```

---

## ✅ VALIDATION

### Points de contrôle
- [ ] Structure SWIFT correcte
- [ ] Tous les champs obligatoires présents
- [ ] Format montant correct selon devise
- [ ] BIC valides
- [ ] IBAN valides
- [ ] Date au bon format
- [ ] Padding de fin présent

---

**Fichiers fournis :**
- `CORIBFBFint001.txt` - Exemples virements internes
- `CORIBFBFcomp001.txt` - Exemples virements compensés
- `CORIBFBFrtgs001.txt` - Exemples virements RTGS
- `CORIBFBFFdev001.txt` - Exemples virements étrangers

**Générés par :** Générateur MT101 v2.0.0  
**Date :** Février 2026  
**Usage :** Tests CBS Amplitude CORIS Bank UEMOA
