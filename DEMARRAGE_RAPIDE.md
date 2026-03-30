# 🚀 DÉMARRAGE RAPIDE - Générateur MT103 RTGS BCEAO

## 📦 Contenu du projet

Votre application est maintenant **100% fonctionnelle** ! Voici tous les fichiers créés :

### 📄 Fichiers principaux
- **index.html** - Application principale de génération MT103
- **guide.html** - Guide d'utilisation détaillé
- **test.html** - Page de tests automatisés
- **README.md** - Documentation complète du projet

### 📁 Dossiers
- **css/** - Styles de l'application
  - style.css - Design professionnel et responsive
- **js/** - Code JavaScript
  - config.js - Configuration des filiales, banques, données
  - mt103-generator.js - Moteur de génération MT103
  - main.js - Logique UI et interactions

### 📋 Fichiers de référence
- **exemple_iban.txt** - 40 IBAN de test (8 pays UEMOA)
- **exemple_mt103_output.txt** - Exemples de messages MT103 générés
- **DONNEES_TEST.md** - Scénarios de test et checklist
- **DEMARRAGE_RAPIDE.md** - Ce fichier

---

## ⚡ Démarrage en 3 étapes

### 1️⃣ Ouvrir l'application
Double-cliquez sur **index.html** pour lancer l'application dans votre navigateur.

### 2️⃣ Configuration minimale
1. Sélectionnez une **filiale** (ex: CORIMLBA)
2. Gardez la **date du jour** (pré-remplie)
3. Importez le fichier **exemple_iban.txt** (glisser-déposer)
4. Gardez les valeurs par défaut pour le reste

### 3️⃣ Générer
Cliquez sur **"Générer les fichiers MT103"** et téléchargez vos fichiers !

---

## 🎯 Premier test recommandé

### Configuration suggérée pour votre premier test :
```
✓ Filiale : CORIMLBA (Coris Mali)
✓ Date de valeur : Date du jour
✓ Nombre de fichiers : 1
✓ Transactions par fichier : 10
✓ Import IBAN : Utiliser exemple_iban.txt
✓ Montants : 50 000 - 1 000 000 XOF (préréglage "Montants moyens")
```

**Résultat attendu :** 
- 1 fichier .txt avec 10 messages MT103 RTGS
- Format conforme SWIFT et BCEAO
- Prêt pour import dans CBS Amplitude

---

## 📖 Documentation

### Pour les utilisateurs
👉 Ouvrez **guide.html** pour le guide d'utilisation illustré

### Pour les développeurs
👉 Consultez **README.md** pour la documentation technique complète

### Pour les testeurs
👉 Ouvrez **test.html** pour exécuter les tests automatisés
👉 Consultez **DONNEES_TEST.md** pour les scénarios de test

---

## 🔍 Format des fichiers générés

Chaque fichier contient des messages MT103 au format :

```
{1:F21CORIMLBAAXXX4967194233}{4:{177:2601270938}{451:0}}{1:F01CORIMLBAAXXX4967194233}{2:O1030938260127BCAOSNDPAXXX31220255572601270938N}{3:{113:0030}{108:O01SIP1183205336}{121:c1464b96-16b8-4e9f-8b08-3da831f01005}}{4:
:20:O01SIP1183205336
:23B:CRED
:23E:SDVA
:26T:001
:32A:260127XOF350000,
:50K:/7234561890234567
//TRAORE SEYDOU
:53A:/D/D00030901
ECOCMLBA
:57A:/C/D00030181
CORIMLBA
:59:/ML1810100200041802510100
//TRAORE SEYDOU
:70:VIREMENT PERMANENT
:71A:SHA
:72:/CODTYPTR/001
-}{5:{MAC:00000000}{CHK:A1B2C3D4E5F6}}{S:{SAC:}{COP:S}}
```

**Note importante :** Aucun espace entre le BIC et le numéro de séquence (format corrigé) ✅

---

## ✅ Checklist de validation

Avant d'utiliser les fichiers générés dans CBS Amplitude :

- [ ] Ouvrir le fichier dans un éditeur de texte
- [ ] Vérifier que chaque message commence par `{1:F21`
- [ ] Vérifier qu'il n'y a pas d'espace dans `{1:F21CORIMLBAAXXX4967194233}`
- [ ] Vérifier la présence de tous les blocs (1, 2, 3, 4, 5, S)
- [ ] Vérifier que les IBAN sont corrects
- [ ] Vérifier que les montants sont en XOF sans décimales
- [ ] Tester d'abord sur 1 fichier avec 5 transactions

---

## 🎓 Cas d'usage principaux

### Test de réception simple
```
Fichiers : 1
Transactions : 5-10
Montants : Moyens (50K - 1M XOF)
→ Pour valider le fonctionnement de base
```

### Test multi-filiales
```
Fichiers : 1 par filiale (8 au total)
Transactions : 10 par fichier
Montants : Variés
→ Pour tester toutes les filiales
```

### Test de charge
```
Fichiers : 20-50
Transactions : 100-500 par fichier
Montants : Large plage
→ Pour tester la performance CBS
```

---

## 🔧 Personnalisation

### Import d'IBAN personnalisés

Créez un fichier texte avec vos propres IBAN (un par ligne) :
```
ML1810100200041802510100
ML1810200300051903620200
BF1234567890123456789012
...
```

### Montants personnalisés

Utilisez les champs min/max ou les préréglages :
- **Petits** : 5 000 - 100 000 XOF
- **Moyens** : 50 000 - 1 000 000 XOF
- **Gros** : 500 000 - 10 000 000 XOF

### Options avancées

Cliquez sur "Options Avancées" pour personnaliser :
- Client donneur d'ordre
- Motif de paiement
- Préfixe du nom de fichier

---

## ⚠️ Points importants

### ✅ À FAIRE
- Toujours tester dans l'environnement de TEST CBS Amplitude d'abord
- Valider la structure des fichiers avant import massif
- Utiliser des IBAN de comptes de test
- Documenter vos scénarios de test

### ❌ À NE PAS FAIRE
- Ne jamais utiliser en production
- Ne pas importer dans l'environnement de production
- Ne pas utiliser d'IBAN de vrais clients
- Ne pas générer des milliers de transactions sans validation préalable

---

## 🆘 Besoin d'aide ?

### Problème technique
1. Ouvrez **test.html** et exécutez les tests
2. Vérifiez la console du navigateur (F12)
3. Consultez la section "Dépannage" dans **guide.html**

### Question sur l'utilisation
1. Consultez **guide.html** - Guide complet illustré
2. Consultez **README.md** - Documentation technique
3. Consultez **DONNEES_TEST.md** - Scénarios de test

### Support
- **Équipe IT CORIS Bank UEMOA**
- **CBS Amplitude Support Team**

---

## 📊 Données configurées

### 8 filiales CORIS Bank UEMOA
Burkina Faso • Bénin • Côte d'Ivoire • Guinée Bissau • Mali • Niger • Sénégal • Togo

### 10 banques émettrices
ECOBANK • SOCIÉTÉ GÉNÉRALE • BANK OF AFRICA • ATLANTIC BANK (Multi-pays)

### 25 noms de clients
Personnes physiques et morales représentatifs de l'Afrique de l'Ouest

### 10 motifs de paiement
Virement permanent • Salaire • Facture • Transfert commercial • etc.

---

## 🎉 Prêt à commencer !

Votre générateur MT103 RTGS BCEAO est **100% opérationnel** !

👉 **Lancez index.html** et commencez à générer vos fichiers de test

---

**Version :** 1.0.0  
**Date :** Février 2026  
**Développé pour :** CORIS Bank UEMOA - Tests CBS Amplitude  
**Format :** SWIFT MT103 RTGS conforme BCEAO

---

## 📌 Liens rapides

- 🚀 **[index.html](index.html)** - Lancer l'application
- 📖 **[guide.html](guide.html)** - Guide d'utilisation
- 🧪 **[test.html](test.html)** - Tests automatisés
- 📄 **[README.md](README.md)** - Documentation complète
- 📋 **[DONNEES_TEST.md](DONNEES_TEST.md)** - Scénarios de test

---

**Bonne génération ! 🎯**
