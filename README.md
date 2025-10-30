# 🚀 DevProfile - Plateforme d'Analyse de Profil Développeur

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

<div align="center">
  
**DevProfile** est une plateforme innovante permettant aux développeurs d'analyser leur profil technique à travers un questionnaire intelligent. L'application génère des insights visuels détaillés sur les compétences, l'expérience et les préférences professionnelles.

*"Révélez votre potentiel de développeur"*

</div>

## 📋 Table des Matières

- [🌟 Aperçu](#-aperçu)
- [⚡ Fonctionnalités](#-fonctionnalités)
- [🛠️ Stack Technique](#️-stack-technique)
- [📸 Capture d'écran](#-capture-décran)
- [🚀 Installation Rapide](#-installation-rapide)
- [📁 Structure du Projet](#-structure-du-projet)
- [🐛 État du Projet & Solutions](#-état-du-projet--solutions)
- [🔮 Roadmap](#-roadmap)

## 🌟 Aperçu

DevProfile transforme l'auto-évaluation des développeurs en une expérience engageante et visuelle. À travers un questionnaire intelligent en 5 étapes, les développeurs peuvent :

- 📊 **Analyser** leur stack technique et compétences actuelles
- 🎯 **Identifier** leurs forces et axes d'amélioration  
- 📈 **Suivre** leur évolution professionnelle dans le temps
- 🚀 **Recevoir des insights** personnalisés pour leur carrière
- 📱 **Profiter d'une interface** moderne et responsive

### 📊 Métriques de Performance
![Performances](https://img.shields.io/badge/Performances-95%25-brightgreen)
![Accessibilité](https://img.shields.io/badge/Accessibilité-88%25-green)
![Bonnes Pratiques](https://img.shields.io/badge/Bonnes_Pratiques-100%25-brightgreen)
![SEO](https://img.shields.io/badge/SEO-80%25-green)

## ⚡ Fonctionnalités

### ✅ Fonctionnalités Principales Implémentées

| Fonctionnalité | Statut | Détails |
|----------------|--------|---------|
| **🎯 Questionnaire en 5 étapes** | ✅ Complètement fonctionnel | Navigation fluide, validation en temps réel, étapes progressives |
| **📱 Interface responsive** | ✅ Excellent | Mobile-first avec Tailwind CSS, optimisé tous devices |
| **🎭 Animations fluides** | ✅ Implémenté | Framer Motion pour transitions entre pages et étapes |
| **💾 Sauvegarde automatique** | ✅ Fonctionnel | Persistance MongoDB, reprise de session possible |
| **📚 Page d'historique** | ✅ Opérationnel mais problème au niveau des résultats | Visualisation des sessions, comparaison temporelle |
| **🔄 Barre de progression** | ✅ Interactive | Visuelle, mise à jour temps réel |
| **✅ Validation des champs** | ✅ Robuste | Client et serveur, messages d'erreur contextuels |

### 🚧 Problème Actuel - Page des Résultats

**Statut :** 🔴 **En Cours de Résolution**

**Description :** Le composant de graphiques des résultats ne s'affiche pas correctement. Les données sont collectées mais la visualisation graphique rencontre un problème d'affichage.

**Impact :** Les utilisateurs peuvent compléter le questionnaire mais ne voient pas les graphiques finaux,ni la liste la page resutats car elle est introuvable.

**Solution en cours :** Modification du fichier Page.tsx dans le dossier results en cours.

### ⭐ Fonctionnalités Bonus

| Fonctionnalité | Statut | Notes |
|----------------|--------|-------|
| **📄 Export PDF** | 🔶 Partiel | Utilitaires créés dans `/utils`, non intégrés à l'UI |
| **⚡ Optimisations performances** | ✅ Excellent | Scores Lighthouse 95%+ |

## 🛠️ Stack Technique

### Frontend
- **Next.js 14** - Framework React avec App Router, SSR, optimisation automatique
- React 18 avec les hooks
- **TypeScript** - Typage statique avancé pour la maintenabilité
- **Tailwind CSS** - Framework CSS utilitaire, design system cohérent
- **Framer Motion** - Bibliothèque d'animations 60fps
- **Lucide React** - Icônes modernes et légères
- **Recharts** - Bibliothèque de graphiques (en cours de debug)

### Backend & Base de Données
- **Next.js API Routes** - Architecture fullstack intégrée
- **MongoDB** - Base de données NoSQL pour flexibilité des schémas
- **Mongoose** - ODM pour la modélisation des données

### Infrastructure & Déploiement
- **Docker** - Containerisation de l'application
- **Docker Compose** - Orchestration multi-services


## 📸 Capture d'écran

### Page d'Accueil

<img width="1880" height="1017" alt="HOMAGE" src="https://github.com/user-attachments/assets/b8ec67ea-1e9d-4b93-8e21-30c90a067a06" />

Déroulé des questionnaires et barre de progression

<img width="1867" height="1022" alt="IG" src="https://github.com/user-attachments/assets/5a060e98-6905-4ae1-9788-2a435e5413fb" />
<img width="1663" height="897" alt="DOS" src="https://github.com/user-attachments/assets/8eaa3453-75e2-43cf-af87-bd2ce23b79dd" />
<img width="1908" height="967" alt="FRONTENDDD" src="https://github.com/user-attachments/assets/fc4cdfb9-310b-4f4b-997b-34e47822f9b9" />
<img width="1895" height="943" alt="BACK" src="https://github.com/user-attachments/assets/b8830c72-debc-4f65-812e-392f608ffc34" />

<img width="1902" height="941" alt="OOOOO" src="https://github.com/user-attachments/assets/728e9958-98d6-4fb6-ae06-97c52162001c" />

<img width="1918" height="993" alt="Prefreee" src="https://github.com/user-attachments/assets/f123f061-4e8a-42b9-995f-478a8c6e4ab7" />

Page de resultat

Bug en cours de reglage

Historique des questionnaires

<img width="1901" height="947" alt="HISTORIA" src="https://github.com/user-attachments/assets/5983feb7-b3cd-4b89-80e1-25a4904ca9a7" />

Page de connexion

<img width="1902" height="973" alt="Connexion" src="https://github.com/user-attachments/assets/dfcd7588-aa14-4e82-9126-b55ef71cd968" />



## 🚀 Installation Rapide

### Prérequis
- Docker et Docker Compose

### 🐳 Installation avec Docker (Recommandé - 2 minutes)

```bash
# 1. Cloner le repository
git clone <votre-repo>
cd TEST_TECHNIQUE

# 2. Lancer l'application complète
docker-compose up -d

# 3. Accéder à l'application
# http://localhost:3000
````

###🔧 Développement Local
````
# Installation manuelle
npm install

# Lancer l'application en mode développement
npm run dev

# Accéder à http://localhost:3000
````

###🗄️ Configuration MongoDB
````
🐳 Configuration Docker Compose
Le projet utilise une configuration Docker Compose complète incluant :

MongoDB avec données de test automatiques

Script d'initialisation avec questions d'exemple

Volume persistant pour les données

Les données de test incluent 6 questions réparties sur 5 étapes avec différents types de questions (choix multiple, unique, échelle, texte).
````

📁 Structure du Projet


<img width="452" height="911" alt="Structure" src="https://github.com/user-attachments/assets/58410903-e84f-4d4c-99ff-46b1cb0a3e80" />
````
TEST_TECHNIQUE/
├── 🐳 docker-compose.yml          # Orchestration Docker
├── 🗄️ init-mongodb.js            # Peuplement données de test
├── 🔧 .env.local                  # Variables d'environnement
├── 🎨 globals.css                 # Styles Tailwind globaux
└── 💻 src/
    └── app/
        ├── 🏠 page.tsx            # Page d'accueil (Design moderne)
        ├── layout.tsx             # Layout racine
        ├── 📊 questionnaire/      # ✅ FONCTIONNEL - Pages du questionnaire
        ├── 📈 results/           # 🚧 EN DEBUG - Pages des résultats
        ├── 📚 history/           # ✅ FONCTIONNEL - Page historique
        ├── 🛠️ api/               # ✅ FONCTIONNEL - Routes API
        ├── 🧩 components/         # ✅ FONCTIONNEL - Composants React
        ├── 🎣 hooks/              # ✅ FONCTIONNEL - Hooks personnalisés
        ├── 📚 lib/                # ✅ FONCTIONNEL - Configurations
        ├── 🔌 services/           # ✅ FONCTIONNEL - Services API
        ├── 📝 types/              # ✅ FONCTIONNEL - Types TypeScript
        └── 🛠️ utils/              # 🔶 PARTIEL - Utilitaires

````

🐛 État du Projet & Solutions
````
🔴 Problème Critique : Affichage des Résultats
Localisation : /src/app/results/page.tsx et composant ResultsChart

Symptôme :

Les graphiques Recharts ne s'affichent pas

Les données sont collectées mais non visualisées

Cause Identifiée :

Flux de données interrompu entre le questionnaire et les résultats

Problème de sérialisation des props vers le composant graphique

Solution en Cours :


// Debug du flux de données et correction du fichier page dans result.
````

🟡 Autres Problèmes Mineurs à Résoudre
Dossiers dupliqués : resultats/ et results/

Export PDF non intégré : Utilitaires créés mais non connectés à l'UI

✅ Parties Complètement Fonctionnelles

Page d'accueil : Design moderne avec gradients et animations

Système de questionnaire : 5 étapes fluides avec validation

Base de données : MongoDB opérationnelle avec données de test

API Backend : Endpoints fonctionnels pour questions et sauvegarde

Responsive design : Optimisé mobile, tablette, desktop

Performance : Scores Lighthouse excellents

🔮 Roadmap
Version 1.1 (Imminent)
Résolution de l'affichage des résultats - Correction des graphiques

Nettoyage structure - Suppression des dossiers dupliqués

Intégration export PDF - Connexion des utilitaires existants

Version 2.0 (Prochainement)
Mode sombre - Toggle theme

Tests unitaires - Couverture de tests

Tableau de bord admin - Analytics avancés

Internationalisation - Support multi-langues



