

# Questionnaire Next.js – Bleu & Blanc

## 1. Instructions d'installation et de lancement

### Prérequis

* Node.js >= 18
* npm ou yarn
* Docker (pour MongoDB)

### Installation

1. Cloner le dépôt :

```bash
git clone <URL_DU_DEPOT>
cd my-next-questionnaire
```

2. Installer les dépendances :

```bash
npm install
# ou
yarn
```

3. Lancer MongoDB avec Docker :

```bash
docker-compose up -d
```

4. Lancer l’application en développement :

```bash
npm run dev
# ou
yarn dev
```

5. Accéder à l’application :

```
http://localhost:3000
```

---

## 2. Description des choix techniques

* **Next.js 14** (App Router) pour architecture moderne côté serveur et client.
* **React Hooks** pour la gestion des états et des réponses.
* **Framer Motion** pour animations fluides.
* **CSS pur (`globals.css`)** pour un design violet/blanc responsive.
* **MongoDB** pour stocker les réponses utilisateur.
* **LocalStorage** pour la sauvegarde automatique des réponses.
* **Lucide Icons** pour les icônes légères.

---

## 3. Fonctionnalités implémentées

* ✅ Récupération des questions depuis l’API
* ✅ Affichage des questions par étape
* ✅ Navigation “Précédent / Suivant” avec animations
* ✅ Barre de progression dynamique
* ✅ Validation des champs obligatoires
* ✅ Sauvegarde automatique des réponses
* ✅ Page de résultats avec graphiques (Radar, Bar)
* ✅ Design responsive violet/blanc
* ✅ Interface de connexion utilisateur (en cours)

---

## 4. Bugs rencontrés / erreurs

### Graphiques et affichage

* ⚠️ Graphiques parfois mal alignés sur mobile ou tablettes
* ⚠️ Texte des résultats dépasse certaines cartes
* ⚠️ Couleurs des graphiques parfois peu lisibles selon l’écran

### Sauvegarde et récupération

* ⚠️ Sauvegarde locale parfois ne se met pas à jour immédiatement
* ⚠️ Anciennes réponses peuvent persister après un nouvel envoi

### Interface et navigation

* ⚠️ Animation de transition entre étapes peut provoquer des “sauts” sur certaines résolutions
* ⚠️ Interface de connexion incomplète (authentification non implémentée)

### Déploiement et dépendances

* ⚠️ Tentative d’utilisation de classes Tailwind comme `max-w-7xl` provoque des erreurs si Tailwind n’est pas configuré
* ⚠️ Certains composants nécessitent encore un style CSS ajusté pour correspondre au thème violet/blanc

---

## 5. Captures d’écran de l’application

### Écran principal – Questionnaire

<img width="1917" height="1083" alt="h1" src="https://github.com/user-attachments/assets/4ab1dd8f-d227-4328-8a0b-2716e635c373" />

<img width="1712" height="972" alt="Etape1" src="https://github.com/user-attachments/assets/ca28361c-260f-434e-a549-48f1d8aaf6ee" />

<img width="1670" height="922" alt="H2" src="https://github.com/user-attachments/assets/91b12920-85de-484d-ad0c-d2debc38857d" />


<img width="1912" height="1066" alt="fRONTEND" src="https://github.com/user-attachments/assets/99c68d97-f15f-4026-9fca-78b0d25df53f" />

<img width="1915" height="988" alt="Serveur" src="https://github.com/user-attachments/assets/b78f018b-585d-4418-8920-0d350bc3bc3b" />



### Écran résultats


---

## 6. Checklist de développement

* [x] Récupérer les questions depuis l'API
* [x] Afficher les questions par étape
* [x] Navigation Précédent/Suivant
* [x] Barre de progression
* [x] Validation des champs requis
* [x] Sauvegarde automatique des réponses
* [x] Page de résultats avec graphique
* [x] Design responsive
* [ ] Correction des bugs graphiques
* [ ] Finaliser interface de connexion
* [ ] Export PDF des résultats

---

## 7. Structure du projet

```
my-next-questionnaire/
├─ app/
│  ├─ api/
│  ├─ components/
│  ├─ questionnaire/
│  └─ results/
├─ data/
│  └─ questions.json
├─ public/
│  └─ screenshots/
├─ styles/
│  └─ globals.css
├─ docker-compose.yml
├─ package.json
└─ README.md
```


