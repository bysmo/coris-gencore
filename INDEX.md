# 📁 INDEX DES FICHIERS - GÉNÉRATEUR MT103 RTGS BCEAO

## 🎯 Fichiers principaux

### Pages web de l'application

| Fichier | Description | Usage |
|---------|-------------|-------|
| **welcome.html** | 🏠 Page d'accueil et présentation | Point d'entrée - Ouvrir en premier |
| **index.html** | 🚀 Application principale | Interface de génération MT103 |
| **guide.html** | 📖 Guide d'utilisation interactif | Instructions détaillées pas-à-pas |
| **test.html** | 🧪 Tests unitaires | Validation du fonctionnement |

### Documentation

| Fichier | Description | Contenu |
|---------|-------------|---------|
| **README.md** | 📄 Documentation complète | Guide complet du projet |
| **DONNEES_TEST.md** | 📋 Scénarios de test | Données et cas d'usage |
| **CHANGELOG.md** | 📝 Historique des versions | Versions et évolutions |
| **INDEX.md** | 📁 Ce fichier | Navigation dans le projet |

### Fichiers de données exemples

| Fichier | Description | Format |
|---------|-------------|--------|
| **exemple_iban.txt** | 💾 40 IBAN de test UEMOA | TXT (un IBAN/ligne) |
| **exemple_mt103_output.txt** | 📤 Exemples MT103 générés | TXT (format SWIFT) |

## 📂 Structure des dossiers

### css/
Contient les feuilles de style de l'application
- **style.css** - Styles principaux, design moderne et responsive

### js/
Contient les scripts JavaScript de l'application
- **config.js** - Configuration des filiales, banques, données
- **mt103-generator.js** - Moteur de génération des messages MT103
- **main.js** - Logique UI et gestion des interactions

## 🎓 Par où commencer ?

### Pour utiliser l'application immédiatement :
1. ✅ Ouvrez **welcome.html** dans votre navigateur
2. ✅ Cliquez sur "Lancer l'application" 
3. ✅ Suivez les instructions à l'écran

### Pour comprendre l'application :
1. ✅ Lisez **README.md** pour une vue d'ensemble
2. ✅ Consultez **guide.html** pour le mode d'emploi
3. ✅ Explorez **DONNEES_TEST.md** pour les scénarios

### Pour tester l'application :
1. ✅ Ouvrez **test.html** dans votre navigateur
2. ✅ Cliquez sur "Exécuter tous les tests"
3. ✅ Vérifiez que tous les tests sont au vert (✓ PASS)

### Pour développer/modifier :
1. ✅ Étudiez **js/config.js** pour comprendre les données
2. ✅ Analysez **js/mt103-generator.js** pour la logique métier
3. ✅ Consultez **js/main.js** pour l'interface utilisateur

## 📊 Arborescence complète du projet

```
generateur-mt103-rtgs/
│
├── 🏠 welcome.html                # Page d'accueil
├── 🚀 index.html                  # Application principale
├── 📖 guide.html                  # Guide interactif
├── 🧪 test.html                   # Tests unitaires
│
├── 📄 README.md                   # Documentation complète
├── 📋 DONNEES_TEST.md            # Scénarios de test
├── 📝 CHANGELOG.md               # Historique versions
├── 📁 INDEX.md                   # Ce fichier
│
├── 💾 exemple_iban.txt           # IBAN de test
├── 📤 exemple_mt103_output.txt   # Exemples MT103
│
├── css/
│   └── style.css                 # Styles CSS
│
└── js/
    ├── config.js                 # Configuration
    ├── mt103-generator.js        # Générateur MT103
    └── main.js                   # Interface UI
```

## 🔑 Fichiers clés par fonctionnalité

### Configuration des filiales CORIS Bank
📍 **js/config.js** - Lignes 3-66
- 8 filiales UEMOA avec BIC, codes pays, codes RTGS

### Génération des messages MT103
📍 **js/mt103-generator.js** - Classe MT103Generator
- Méthode `generateMT103()` - Génération d'un message
- Méthode `buildMT103Message()` - Construction du format SWIFT
- Méthode `generateAllFiles()` - Génération multiple

### Interface utilisateur
📍 **js/main.js** 
- Gestion des formulaires
- Import d'IBAN (fichier/manuel)
- Téléchargement des fichiers

### Styles et design
📍 **css/style.css**
- Design moderne et professionnel
- Responsive (mobile, tablette, desktop)
- Variables CSS pour personnalisation

## 📞 Support et aide

### Besoin d'aide ?

1. **Questions d'utilisation** → Consultez `guide.html`
2. **Problèmes techniques** → Vérifiez `test.html`
3. **Données de test** → Référez-vous à `DONNEES_TEST.md`
4. **Documentation** → Lisez `README.md`

### Contacts

- **Équipe IT CORIS Bank UEMOA**
- **CBS Amplitude Support Team**

## 📋 Checklist de démarrage

### Avant la première utilisation :

- [ ] Ouvrir `welcome.html` pour voir la présentation
- [ ] Lire `README.md` pour comprendre l'application
- [ ] Consulter `guide.html` pour le mode d'emploi
- [ ] Exécuter `test.html` pour valider le fonctionnement
- [ ] Préparer un fichier d'IBAN de test (ou utiliser `exemple_iban.txt`)
- [ ] Identifier la filiale destinataire
- [ ] Définir les paramètres de génération (dates, montants)

### Pour un premier test :

- [ ] Ouvrir `index.html`
- [ ] Sélectionner une filiale (ex: CORIMLBA)
- [ ] Importer `exemple_iban.txt`
- [ ] Configurer : 1 fichier, 5 transactions, montants moyens
- [ ] Cliquer sur "Générer les fichiers MT103"
- [ ] Télécharger le fichier généré
- [ ] Valider le format dans CBS Amplitude de test

## 🎯 Ressources rapides

| Besoin | Fichier à consulter |
|--------|---------------------|
| Démarrer rapidement | `welcome.html` → "Lancer l'application" |
| Comprendre l'usage | `guide.html` |
| Voir des exemples | `exemple_mt103_output.txt` |
| Tester IBAN | `exemple_iban.txt` |
| Scénarios de test | `DONNEES_TEST.md` |
| Historique du projet | `CHANGELOG.md` |
| Documentation complète | `README.md` |
| Valider le code | `test.html` |

## 🔧 Personnalisation

### Modifier les filiales
📍 Éditez `js/config.js` → Objet `FILIALES`

### Ajouter des banques émettrices
📍 Éditez `js/config.js` → Tableau `SENDING_BANKS`

### Modifier les noms de clients
📍 Éditez `js/config.js` → Tableau `CLIENT_NAMES`

### Personnaliser le design
📍 Éditez `css/style.css` → Variables CSS (`:root`)

## ⚡ Raccourcis navigateur

Lors de l'utilisation de l'application :

- **F12** : Ouvrir la console développeur (diagnostic)
- **Ctrl + Shift + R** : Rafraîchir avec cache vidé
- **Ctrl + S** : Sauvegarder la page (si modification)

## 📈 Statistiques du projet

- **Lignes de code JavaScript** : ~800 lignes
- **Lignes de code CSS** : ~500 lignes
- **Lignes de code HTML** : ~1200 lignes
- **Fichiers de documentation** : 6 fichiers
- **Pages web** : 4 pages
- **Filiales supportées** : 8 filiales UEMOA
- **Banques émettrices** : 10 banques
- **Noms de clients** : 25 noms
- **Motifs de paiement** : 10 motifs

---

**Version** : 1.0.0  
**Date** : Janvier 2026  
**Projet** : CORIS Bank UEMOA - Tests CBS Amplitude

---

© 2026 CORIS Bank UEMOA - Générateur MT103 RTGS BCEAO
