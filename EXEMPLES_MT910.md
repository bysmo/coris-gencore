# Exemples de Fichiers MT910 Générés
## Confirmations BCEAO pour MT103 RTGS

**Date :** 09/02/2026  
**Version :** 3.0.0

---

## 📋 Description

Les fichiers MT910 sont des confirmations d'avis de crédit émises par la BCEAO pour chaque virement MT103 RTGS traité. Ces confirmations permettent aux banques commerciales de comptabiliser automatiquement les crédits sur leurs comptes.

---

## 🔗 Lien MT910 ↔ MT103

### Mécanisme de liaison

```
MT103 RTGS (Virement RTGS)
    ↓
Champ :20: O01SIP1183205336
    ↓
    ├─→ MT910 Champ :21: O01SIP1183205336  (Référence transaction liée)
    └─→ MT910 Champ :108: O01SIP1183205336 (Bloc 3 - User Header)
```

### Données copiées du MT103 au MT910

| Champ MT103 | → | Champ MT910 | Description |
|-------------|---|-------------|-------------|
| :20 | → | :21 et :108 | Référence de transaction |
| :57A (Code RTGS) | → | :25 | Code participant RTGS banque créditée |
| :32A | → | :32A | Date de valeur, devise, montant |
| Filiale dest. | → | Bloc 1 BIC | BIC de la banque créditée |

---

## 📨 Exemple 1 : MT910 pour virement CORIS Mali

### MT103 source
```
{1:F21CORIMLBAAXXX4967194233}{4:{177:2601270938}{451:0}}{1:F01CORIMLBAAXXX4967194233}{2:O1030938260127BCAOSNDPAXXX31220255572601270938N}{3:{113:0030}{108:O01SIP1183205336}{121:c1464b96-16b8-4e9f-8b08-3da831f01005}}{4:
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

### MT910 généré (Confirmation BCEAO)
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

### Analyse des champs

| Champ | Valeur | Description |
|-------|--------|-------------|
| **Bloc 1** | F21CORIMLBAAXXX... | BIC de CORIS Mali (banque créditée) |
| **Bloc 2** | O910... | Type de message MT910 (confirmation) |
| **:20** | 981946836/910 | Référence unique de la confirmation |
| **:21** | O01SIP1183205336 | ⭐ Référence du MT103 lié |
| **:25** | D00030181 | Code RTGS de CORIS Mali |
| **:32A** | 260127XOF30000, | Date: 27/01/26, Montant: 30 000 XOF |
| **:52A** | BCAOSNDP | BIC de la BCEAO |
| **:72** | /CLRBRVM/0003 | Informations clearing BCEAO |
| **Bloc 3 :108** | O01SIP1183205336 | ⭐ Référence du MT103 lié |

---

## 📨 Exemple 2 : MT910 pour gros montant CORIS Burkina

### MT103 source
```
{1:F21CORIBFBFAXXX3421987654}{4:{177:2601271045}{451:0}}{1:F01CORIBFBFAXXX3421987654}{2:O1031045260127BCAOSNDPAXXX31220255572601271045N}{3:{113:0030}{108:O02SIP8765432109}{121:a7b3c5d9-8e2f-4a1b-9c3d-5e7f8a9b0c1d}}{4:
:20:O02SIP8765432109
:23B:CRED
:23E:SDVA
:26T:001
:32A:260127XOF75000000,
:50K:/0020876543210987
//SAWADOGO ENTERPRISES SARL
:53A:/D/K00031971
CORISNDA
:57A:/C/C00030148
CORIBFBF
:59:/BF1234567890123456789012
//SAWADOGO ENTERPRISES SARL
:70:REGLEMENT FACTURE IMPORT
:71A:SHA
:72:/CODTYPTR/001
-}{5:{MAC:00000000}{CHK:9A2B3C4D5E6F}}{S:{SAC:}{COP:S}}
```

### MT910 généré (Confirmation BCEAO)
```
{1:F21CORIBFBFAXXX3421987654}{4:{177:2601271045}{451:0}}{1:F01CORIBFBFAXXX3421987654}{2:O9101045260127BCAOSNDPAXXX31220255572601271045N}{3:{113:0003}{108:O02SIP8765432109}}{4:
:20:234567890/910
:21:O02SIP8765432109
:25:C00030148
:32A:260127XOF75000000,
:52A:BCAOSNDP
:72:/CLRBRVM/0003
/SGI/CORIBFBFAXXX
-}{5:{CHK:9A2B3C4D5E6F}}{S:{COP:S}}
```

### Points clés
- **Montant important** : 75 000 000 XOF (75 millions)
- **Lien :21/:108** : O02SIP8765432109 (référence MT103)
- **Code RTGS :25** : C00030148 (CORIS Burkina)
- **BCEAO :52A** : BCAOSNDP

---

## 📨 Exemple 3 : MT910 pour petit montant CORIS Sénégal

### MT103 source
```
{1:F21CORISNDAAXXX8765432109}{4:{177:2601271210}{451:0}}{1:F01CORISNDAAXXX8765432109}{2:O1031210260127BCAOSNDPAXXX31220255572601271210N}{3:{113:0030}{108:O03SIP3456789012}{121:f1e2d3c4-b5a6-9876-5432-1098f7e6d5c4}}{4:
:20:O03SIP3456789012
:23B:CRED
:23E:SDVA
:26T:001
:32A:260127XOF15000,
:50K:/0030123456789012
//DIOP AMADOU
:53A:/D/A00031661
CORICIAB
:57A:/C/K00031971
CORISNDA
:59:/SN1111222233334444555566
//DIOP AMADOU
:70:TRANSFERT FAMILIAL
:71A:SHA
:72:/CODTYPTR/001
-}{5:{MAC:00000000}{CHK:1A2B3C4D5E6F}}{S:{SAC:}{COP:S}}
```

### MT910 généré (Confirmation BCEAO)
```
{1:F21CORISNDAAXXX8765432109}{4:{177:2601271210}{451:0}}{1:F01CORISNDAAXXX8765432109}{2:O9101210260127BCAOSNDPAXXX31220255572601271210N}{3:{113:0003}{108:O03SIP3456789012}}{4:
:20:567890123/910
:21:O03SIP3456789012
:25:K00031971
:32A:260127XOF15000,
:52A:BCAOSNDP
:72:/CLRBRVM/0003
/SGI/CORISNDAAXXX
-}{5:{CHK:1A2B3C4D5E6F}}{S:{COP:S}}
```

### Points clés
- **Petit montant** : 15 000 XOF
- **Lien :21/:108** : O03SIP3456789012
- **Code RTGS :25** : K00031971 (CORIS Sénégal)
- **Motif** : Transfert familial

---

## 📄 Structure d'un fichier MT910 unique

Lorsque l'option "Générer les MT910" est activée, tous les MT910 sont regroupés dans un seul fichier :

### Nom du fichier
```
MT910_CONFIRMATIONS_CORIS_Mali_20260127_143055.txt
```

### Contenu exemple (3 confirmations)
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

{1:F21CORIMLBAAXXX4967194234}{4:{177:2601271045}{451:0}}{1:F01CORIMLBAAXXX4967194234}{2:O9101045260127BCAOSNDPAXXX31220255572601271045N}{3:{113:0003}{108:O02SIP8765432109}}{4:
:20:234567890/910
:21:O02SIP8765432109
:25:D00030181
:32A:260127XOF125000,
:52A:BCAOSNDP
:72:/CLRBRVM/0003
/SGI/CORIMLBAAXXX
-}{5:{CHK:9A2B3C4D5E6F}}{S:{COP:S}}

{1:F21CORIMLBAAXXX4967194235}{4:{177:2601271210}{451:0}}{1:F01CORIMLBAAXXX4967194235}{2:O9101210260127BCAOSNDPAXXX31220255572601271210N}{3:{113:0003}{108:O03SIP3456789012}}{4:
:20:567890123/910
:21:O03SIP3456789012
:25:D00030181
:32A:260127XOF87500,
:52A:BCAOSNDP
:72:/CLRBRVM/0003
/SGI/CORIMLBAAXXX
-}{5:{CHK:1A2B3C4D5E6F}}{S:{COP:S}}
```

---

## 🔍 Validation des MT910

### Vérifications automatiques

✅ **Lien avec MT103**
- Champ :21 du MT910 = Champ :20 du MT103
- Champ :108 du MT910 (Bloc 3) = Champ :20 du MT103

✅ **Données cohérentes**
- :25 = Code RTGS de la filiale destinataire
- :32A = Date/Devise/Montant identiques au MT103
- :52A = BCAOSNDP (BCEAO)

✅ **Format SWIFT**
- Tous les blocs obligatoires présents (1, 2, 3, 4, 5, S)
- Format des champs conforme SWIFT
- Checksums générés

---

## 📊 Statistiques MT910

### Pour un fichier de 10 MT103 RTGS

| Élément | Valeur |
|---------|--------|
| **Fichiers MT103** | 10 fichiers individuels |
| **Confirmations MT910** | 10 dans un seul fichier |
| **Liens MT910 ↔ MT103** | 10 (un par MT103) |
| **Taille fichier MT910** | ~8-10 Ko |
| **Temps de génération** | <1 seconde |

---

## 🎯 Utilisation dans CBS Amplitude

### Scénario de test complet

1. **Générer les MT103 + MT910**
   - Activer l'option "Générer les MT910" dans l'interface
   - Générer 10 fichiers MT103 avec 5 transactions chacun
   - Récupérer le fichier MT910 unique

2. **Importer dans CBS Amplitude**
   - Importer les 10 fichiers MT103 RTGS
   - Vérifier le traitement des virements
   - Importer le fichier MT910
   - Vérifier la comptabilisation automatique

3. **Validation**
   - Contrôler que chaque MT910 est lié au bon MT103
   - Vérifier que les montants sont correctement crédités
   - Valider les codes RTGS et dates de valeur

---

## 🚧 Limitations

⚠️ **Checksums simulés** : Les checksums MAC et CHK sont générés aléatoirement (non calculés réellement)

⚠️ **Données test** : Les références et numéros de séquence sont générés pour tests uniquement

⚠️ **Validation CBS** : Tous les fichiers doivent être validés dans CBS Amplitude avant utilisation

---

## 📞 Support

Pour toute question sur les fichiers MT910 :
- Consultez **README_MT910.md** pour la documentation complète
- Voir **test.html** pour les tests automatisés
- Équipe IT CORIS Bank UEMOA

---

**Version :** 3.0.0  
**Date :** 09/02/2026  
**© 2026 CORIS Bank UEMOA**
