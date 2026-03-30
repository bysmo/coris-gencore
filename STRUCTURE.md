# 🗂️ STRUCTURE VISUELLE DU PROJET

```
📦 GÉNÉRATEUR MT103 RTGS BCEAO - CORIS Bank UEMOA
│
├── 🏠 PAGES WEB (4 fichiers HTML)
│   ├── welcome.html .................... Page d'accueil professionnelle
│   ├── index.html ...................... Application principale ⭐
│   ├── guide.html ...................... Guide d'utilisation interactif
│   └── test.html ....................... Tests unitaires et validation
│
├── 📚 DOCUMENTATION (6 fichiers)
│   ├── README.md ....................... Documentation complète 📖
│   ├── DEMARRAGE_RAPIDE.md ............. Guide en 3 étapes ⚡
│   ├── INDEX.md ........................ Navigation dans le projet 📁
│   ├── RECAPITULATIF.md ................ Statut et livrables ✅
│   ├── DONNEES_TEST.md ................. Scénarios de test 📋
│   └── CHANGELOG.md .................... Versions et roadmap 📝
│
├── 💾 DONNÉES EXEMPLES (2 fichiers)
│   ├── exemple_iban.txt ................ 40 IBAN de test UEMOA
│   └── exemple_mt103_output.txt ........ Exemples MT103 générés
│
├── 🎨 STYLES (dossier css/)
│   └── style.css ....................... Design moderne + responsive
│       ├── Variables CSS (couleurs, espacements)
│       ├── Layout responsive (mobile, tablette, desktop)
│       ├── Composants UI (boutons, formulaires, cartes)
│       └── Animations et transitions
│
└── 💻 CODE JAVASCRIPT (dossier js/)
    ├── config.js ....................... Configuration et données
    │   ├── 8 filiales CORIS Bank UEMOA
    │   ├── 10 banques émettrices
    │   ├── 25 noms de clients
    │   ├── 10 motifs de paiement
    │   └── Fonctions utilitaires (dates, montants, IBAN)
    │
    ├── mt103-generator.js .............. Moteur de génération MT103 ⚙️
    │   ├── Classe MT103Generator
    │   ├── generateMT103() - Génération d'un message
    │   ├── buildMT103Message() - Construction format SWIFT
    │   ├── generateFile() - Génération d'un fichier
    │   ├── generateAllFiles() - Génération multiple
    │   └── Méthodes utilitaires (checksums, comptes, etc.)
    │
    └── main.js ......................... Interface utilisateur et logique
        ├── Gestion des événements formulaire
        ├── Import IBAN (fichier + manuel)
        ├── Drag & Drop
        ├── Validation des données
        ├── Génération et affichage résultats
        └── Téléchargement des fichiers
```

---

## 📊 TAILLE DES FICHIERS

### Pages web
```
welcome.html    9.9 KB   █████████░   Page d'accueil
index.html     11.2 KB   ███████████  Application principale
guide.html     10.2 KB   ██████████   Guide interactif
test.html      11.8 KB   ███████████░ Tests unitaires
```

### Documentation
```
README.md              11.1 KB   ███████████  Documentation complète
DEMARRAGE_RAPIDE.md     3.3 KB   ███░░░░░░░░  Guide rapide
INDEX.md                6.9 KB   ██████░░░░░  Navigation
RECAPITULATIF.md        8.4 KB   ████████░░░  Statut projet
DONNEES_TEST.md         6.7 KB   ██████░░░░░  Scénarios test
CHANGELOG.md            7.2 KB   ███████░░░░  Historique
```

### Code source
```
js/config.js            6.5 KB   ██████░░░░   Configuration
js/mt103-generator.js   8.8 KB   ████████░░   Générateur MT103
js/main.js             12.2 KB   ████████████ Interface UI
css/style.css          10.3 KB   ██████████░  Styles CSS
```

### Données
```
exemple_iban.txt        0.5 KB   ░░░░░░░░░░   40 IBAN test
exemple_mt103_output.txt 3.2 KB  ███░░░░░░░   3 MT103 exemples
```

---

## 🎯 FLUX D'UTILISATION

```
┌─────────────────┐
│  welcome.html   │  ← Point d'entrée
│  (Accueil)      │
└────────┬────────┘
         │
         ├──→ Lancer l'application ──→ index.html
         │                                   │
         │                                   ├──→ Formulaire
         │                                   ├──→ Import IBAN
         │                                   ├──→ Configuration
         │                                   ├──→ Génération
         │                                   └──→ Téléchargement
         │
         ├──→ Guide d'utilisation ──→ guide.html
         │                                   │
         │                                   └──→ Instructions détaillées
         │
         └──→ Tests ──────────────→ test.html
                                          │
                                          └──→ Validation fonctionnement
```

---

## 🔄 FLUX DE GÉNÉRATION MT103

```
1️⃣ SAISIE UTILISATEUR
   ├── Sélection filiale (CORIS Bank)
   ├── Import IBAN (CSV/TXT ou manuel)
   ├── Configuration (dates, montants, nombre)
   └── Options avancées (optionnel)
          ↓
2️⃣ VALIDATION
   ├── Vérification IBAN (format UEMOA)
   ├── Validation montants (min < max)
   ├── Contrôle dates
   └── Présence d'au moins 1 IBAN
          ↓
3️⃣ GÉNÉRATION (js/mt103-generator.js)
   ├── Boucle sur nombre de fichiers
   │   └── Boucle sur nombre de transactions
   │       ├── Sélection IBAN bénéficiaire (rotation)
   │       ├── Génération montant aléatoire
   │       ├── Sélection banque émettrice
   │       ├── Génération références uniques
   │       └── Construction message MT103
   │           ├── Block 1 (Basic Header)
   │           ├── Block 2 (Application Header)
   │           ├── Block 3 (User Header)
   │           ├── Block 4 (Text Block - Corps MT103)
   │           ├── Block 5 (Trailer)
   │           └── Block S (System)
   └── Création fichiers en mémoire
          ↓
4️⃣ AFFICHAGE RÉSULTATS
   ├── Cartes fichiers générés
   ├── Détails (nom, taille, transactions)
   └── Boutons de téléchargement
          ↓
5️⃣ TÉLÉCHARGEMENT
   ├── Individuel (1 fichier)
   └── Groupé (tous les fichiers)
```

---

## 🔧 ARCHITECTURE TECHNIQUE

```
┌─────────────────────────────────────────────┐
│              INTERFACE UTILISATEUR           │
│                  (HTML/CSS)                  │
│  ┌───────────┐  ┌───────────┐  ┌─────────┐ │
│  │Formulaires│  │ Boutons   │  │ Aperçu  │ │
│  └─────┬─────┘  └─────┬─────┘  └────┬────┘ │
└────────┼──────────────┼─────────────┼──────┘
         │              │             │
         └──────────────┴─────────────┘
                        │
         ┌──────────────▼──────────────┐
         │      COUCHE LOGIQUE         │
         │        (main.js)            │
         │  ┌──────────────────────┐   │
         │  │  Gestion événements  │   │
         │  │  Validation données  │   │
         │  │  Import/Export       │   │
         │  └──────────┬───────────┘   │
         └─────────────┼───────────────┘
                       │
         ┌─────────────▼───────────────┐
         │    MOTEUR GÉNÉRATION        │
         │   (mt103-generator.js)      │
         │  ┌──────────────────────┐   │
         │  │ Construction MT103   │   │
         │  │ Format SWIFT         │   │
         │  │ Génération fichiers  │   │
         │  └──────────┬───────────┘   │
         └─────────────┼───────────────┘
                       │
         ┌─────────────▼───────────────┐
         │      CONFIGURATION          │
         │        (config.js)          │
         │  ┌──────────────────────┐   │
         │  │ Filiales CORIS       │   │
         │  │ Banques émettrices   │   │
         │  │ Données métier       │   │
         │  │ Fonctions utils      │   │
         │  └──────────────────────┘   │
         └─────────────────────────────┘
```

---

## 📱 DESIGN RESPONSIVE

```
🖥️ DESKTOP (1024px+)
┌─────────────────────────────────────────────┐
│  Header (Logo + Titre)                      │
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐          │
│  │  Section 1  │  │  Section 2  │  (Grille)│
│  └─────────────┘  └─────────────┘          │
│  ┌─────────────┐  ┌─────────────┐          │
│  │  Section 3  │  │  Section 4  │          │
│  └─────────────┘  └─────────────┘          │
├─────────────────────────────────────────────┤
│  Footer                                     │
└─────────────────────────────────────────────┘

📱 MOBILE (< 768px)
┌───────────────┐
│    Header     │
├───────────────┤
│  Section 1    │
│               │
├───────────────┤
│  Section 2    │
│               │
├───────────────┤
│  Section 3    │
│               │
├───────────────┤
│  Section 4    │
│               │
├───────────────┤
│    Footer     │
└───────────────┘
```

---

## 🎨 PALETTE DE COULEURS

```
Primaire     #1a5490  ████  Bleu foncé (headers, titres)
Secondaire   #2c7cc1  ████  Bleu clair (boutons, liens)
Accent       #f39c12  ████  Orange (alertes, warnings)
Succès       #27ae60  ████  Vert (confirmations)
Erreur       #e74c3c  ████  Rouge (erreurs)
Texte foncé  #2c3e50  ████  Gris foncé (texte principal)
Texte clair  #7f8c8d  ████  Gris clair (texte secondaire)
Fond clair   #f8f9fa  ████  Gris très clair (backgrounds)
Bordures     #dce4ec  ████  Gris bordure (séparateurs)
```

---

## 🗝️ FICHIERS CLÉS

| Priorité | Fichier | Rôle |
|----------|---------|------|
| ⭐⭐⭐ | **index.html** | Application principale - cœur du projet |
| ⭐⭐⭐ | **js/mt103-generator.js** | Moteur de génération MT103 |
| ⭐⭐⭐ | **js/config.js** | Toutes les configurations |
| ⭐⭐ | **js/main.js** | Interface utilisateur |
| ⭐⭐ | **css/style.css** | Design et responsive |
| ⭐⭐ | **README.md** | Documentation complète |
| ⭐ | **guide.html** | Guide utilisateur |
| ⭐ | **test.html** | Tests et validation |

---

**Structure créée le** : 09 février 2026  
**Version** : 1.0.0  
**Statut** : ✅ Production Ready
