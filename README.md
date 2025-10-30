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
| **📚 Page d'historique** | ✅ Opérationnel | Visualisation des sessions, comparaison temporelle |
| **🔄 Barre de progression** | ✅ Interactive | Visuelle, mise à jour temps réel |
| **✅ Validation des champs** | ✅ Robuste | Client et serveur, messages d'erreur contextuels |

### 🚧 Problème Actuel - Page des Résultats

**Statut :** 🔴 **En Cours de Résolution**

**Description :** Le composant de graphiques des résultats ne s'affiche pas correctement. Les données sont collectées mais la visualisation graphique rencontre un problème d'affichage.

**Impact :** Les utilisateurs peuvent compléter le questionnaire mais ne voient pas les graphiques finaux.

**Solution en cours :** Debug du composant `ResultsChart` et vérification du flux de données.

### ⭐ Fonctionnalités Bonus

| Fonctionnalité | Statut | Notes |
|----------------|--------|-------|
| **📄 Export PDF** | 🔶 Partiel | Utilitaires créés dans `/utils`, non intégrés à l'UI |
| **⚡ Optimisations performances** | ✅ Excellent | Scores Lighthouse 95%+ |

## 🛠️ Stack Technique

### Frontend
- **Next.js 14** - Framework React avec App Router, SSR, optimisation automatique
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
