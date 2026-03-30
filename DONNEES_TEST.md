# DONNÉES DE TEST - GÉNÉRATEUR MT103 RTGS BCEAO

## Liste d'IBAN de test (exemple_iban.txt)

### Mali (ML)
ML1810100200041802510100
ML1810200300051903620200
ML1810300400061804730300
ML1810400500071905840400
ML1810500600082006950500

### Burkina Faso (BF)
BF1234567890123456789012
BF9876543210987654321098
BF1122334455667788990011
BF5566778899001122334455
BF9900112233445566778899

### Côte d'Ivoire (CI)
CI1234567890123456789012
CI9876543210987654321098
CI2233445566778899001122
CI6677889900112233445566
CI0011223344556677889900

### Sénégal (SN)
SN1111222233334444555566
SN6666555544443333222211
SN3344556677889900112233
SN7788990011223344556677
SN1122334455667788990011

### Niger (NE)
NE1234567890123456789012
NE9876543210987654321098
NE5566778899001122334455
NE4455667788990011223344
NE3344556677889900112233

### Togo (TG)
TG1234567890123456789012
TG9876543210987654321098
TG2233445566778899001122
TG6677889900112233445566
TG5566778899001122334455

### Bénin (BJ)
BJ1234567890123456789012
BJ9876543210987654321098
BJ3344556677889900112233
BJ7788990011223344556677
BJ1122334455667788990011

### Guinée Bissau (GW)
GW1234567890123456789012
GW9876543210987654321098
GW5566778899001122334455
GW4455667788990011223344
GW3344556677889900112233

---

## Scénarios de test recommandés

### Scénario 1 : Test basique de réception
**Objectif :** Tester la réception de quelques virements RTGS

**Configuration :**
- Filiale : CORIMLBA (Mali)
- Date de valeur : Date du jour
- Nombre de fichiers : 1
- Transactions par fichier : 5
- Montants : 50 000 - 500 000 XOF
- IBAN : Les 5 premiers IBAN du Mali

**Résultat attendu :**
- 1 fichier avec 5 messages MT103
- Chaque message doit être traitable par CBS Amplitude
- Comptes bénéficiaires crédités correctement

---

### Scénario 2 : Test multi-filiales
**Objectif :** Tester la réception sur plusieurs filiales

**Configuration par filiale :**
- Filiales : CORIMLBA, CORIBFBF, CORISNDA
- Date de valeur : Date du jour
- Nombre de fichiers : 1 par filiale
- Transactions par fichier : 10
- Montants : 100 000 - 2 000 000 XOF
- IBAN : IBAN correspondant à chaque pays

**Résultat attendu :**
- 3 fichiers (1 par filiale)
- Chaque fichier traité par la filiale correspondante
- Vérification de l'isolation des transactions

---

### Scénario 3 : Test de charge
**Objectif :** Tester la capacité de traitement en volume

**Configuration :**
- Filiale : CORIMLBA (Mali)
- Date de valeur : Date du jour
- Nombre de fichiers : 10
- Transactions par fichier : 100
- Montants : 10 000 - 10 000 000 XOF
- IBAN : Tous les IBAN de test (40 IBAN)

**Résultat attendu :**
- 10 fichiers avec 100 MT103 chacun (1000 transactions total)
- Temps de traitement acceptable
- Aucune perte de transaction
- Intégrité des données maintenue

---

### Scénario 4 : Test de montants variés
**Objectif :** Tester différentes gammes de montants

**Sous-tests :**

**4.1 Petits montants**
- Montants : 1 000 - 50 000 XOF
- Transactions : 20
- Focus : Vérifier les montants faibles

**4.2 Montants moyens**
- Montants : 50 000 - 1 000 000 XOF
- Transactions : 20
- Focus : Transactions courantes

**4.3 Gros montants**
- Montants : 1 000 000 - 50 000 000 XOF
- Transactions : 20
- Focus : Vérifier les plafonds et alertes

---

### Scénario 5 : Test de rotation d'IBAN
**Objectif :** Vérifier la répartition des transactions sur les IBAN

**Configuration :**
- Filiale : CORIMLBA
- Date de valeur : Date du jour
- Nombre de fichiers : 1
- Transactions par fichier : 30
- IBAN : 3 IBAN seulement
- Montants : 100 000 - 500 000 XOF

**Résultat attendu :**
- Chaque IBAN reçoit 10 transactions
- Répartition équitable des montants
- Pas de duplication de références

---

### Scénario 6 : Test de dates de valeur
**Objectif :** Tester différentes dates de valeur

**Sous-tests :**
- Date du jour (J)
- Date future (J+1, J+5)
- Date passée (J-1) - pour rejets attendus

**Configuration commune :**
- Filiale : CORIMLBA
- Transactions : 10 par date
- Montants : 100 000 - 1 000 000 XOF

---

## Exemples de clients donneurs d'ordre

### Personnes physiques
```
TRAORE SEYDOU
COULIBALY MAMADOU
DIARRA FATOUMATA
KONE AMINATA
OUEDRAOGO SOULEYMANE
SAWADOGO RASMATA
DIALLO BOUBACAR
TOURE AISSATA
SANGARE ABDOULAYE
DIOP AWA
```

### Personnes morales
```
BAMBOO ROCK DRILLING SARL
01 BP 2914 OUAGADOUGOU 01 BURKINA FASO

AFRIQUE TRADE COMPANY
ZONE INDUSTRIELLE BAMAKO MALI

SAHEL DISTRIBUTION SA
AVENUE KWAME NKRUMAH NIAMEY NIGER

OUEST AFRICAINE IMPORT EXPORT
RUE 15 TREICHVILLE ABIDJAN COTE D'IVOIRE

SENEGAL SERVICES PLUS
BOULEVARD DU GENERAL DE GAULLE DAKAR SENEGAL
```

---

## Motifs de paiement variés

```
VIREMENT PERMANENT
SALAIRE MENSUEL JANVIER 2026
PAIEMENT FACTURE N°2024/156
TRANSFERT COMMERCIAL
REGLEMENT FOURNISSEUR
PAIEMENT PRESTATION DE SERVICE
HONORAIRES CONSULTANT
LOYER COMMERCIAL TRIMESTRE 1
REMBOURSEMENT AVANCE
AVANCE SUR COMMANDE N°45678
PAIEMENT DIVIDENDES
VERSEMENT CAPITAL SOCIAL
REGLEMENT IMPORT MARCHANDISES
PAIEMENT ASSURANCE
COTISATION SOCIALE
```

---

## Checklist de validation des fichiers générés

### Structure SWIFT
- [ ] Bloc 1 (Basic Header) présent et correct
- [ ] Bloc 2 (Application Header) avec O103
- [ ] Bloc 3 (User Header) avec tags 113, 108, 121
- [ ] Bloc 4 (Text Block) avec tous les champs obligatoires
- [ ] Bloc 5 (Trailer) avec MAC et CHK
- [ ] Bloc S (System) présent

### Champs obligatoires MT103
- [ ] :20: (Transaction Reference) - unique
- [ ] :23B: (Bank Operation Code) - CRED
- [ ] :23E: (Instruction Code) - SDVA
- [ ] :32A: (Value Date, Currency, Amount)
- [ ] :50K: (Ordering Customer)
- [ ] :53A: (Sender's Correspondent)
- [ ] :57A: (Account With Institution)
- [ ] :59: (Beneficiary Customer)
- [ ] :71A: (Details of Charges)

### Données métier
- [ ] BIC filiale destinataire correct
- [ ] Code RTGS filiale correct
- [ ] IBAN bénéficiaire valide (format UEMOA)
- [ ] Montant en XOF sans décimales
- [ ] Date de valeur au format YYMMDD
- [ ] Référence unique par message
- [ ] UUID v4 valide

### Format fichier
- [ ] Encodage UTF-8
- [ ] Extension .txt
- [ ] Nom de fichier avec timestamp
- [ ] Séparation entre messages (double saut de ligne)
- [ ] Pas de caractères parasites

---

## Contacts support

**Équipe IT CORIS Bank UEMOA**
- Email : it.support@corisbank.uemoa
- Tél : +223 XX XX XX XX

**CBS Amplitude Support**
- Email : amplitude.support@corisbank.uemoa
- Plateforme : [URL interne]

**Documentation CBS Amplitude**
- Manuel utilisateur : [Lien interne]
- API Documentation : [Lien interne]
- Base de connaissances : [Lien interne]

---

**Document version :** 1.0  
**Date :** Janvier 2026  
**Usage :** Tests CBS Amplitude uniquement
