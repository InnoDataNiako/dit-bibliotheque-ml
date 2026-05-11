
# 📚 BiblioPro DIT - Bibliothèque Numérique Intelligente

![Version](https://img.shields.io/badge/version-1.0.0-red)
![Python](https://img.shields.io/badge/backend-python-blue)
![React](https://img.shields.io/badge/frontend-react-61DAFB)
![Docker](https://img.shields.io/badge/container-docker-2496ED)
![DVC](https://img.shields.io/badge/data-dvc-orange)
![IA](https://img.shields.io/badge/ML-scikit--learn-F7931E)

Plateforme de gestion de bibliothèque académique avec un **système de recommandation par Intelligence Artificielle**.

---

## 📖 Table des matières

- [Contexte et problématique](#contexte-et-problématique)
- [Notre solution](#notre-solution)
- [Architecture technique](#architecture-technique)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Branches Git Flow](#branches-git-flow)
- [Installation et lancement](#installation-et-lancement)
- [Services API](#services-api)
- [Système de recommandation IA](#système-de-recommandation-ia)
- [DVC - Data Version Control](#dvc---data-version-control)
- [Comptes de test](#comptes-de-test)
- [Auteur](#auteur)

---

## 🎯 Contexte et problématique

L’université **Dakar Institute of Technology (DIT)** gère actuellement sa bibliothèque de manière manuelle, ce qui entraîne :

- Difficulté de suivi des livres et des emprunts
- Absence de statistiques fiables sur l’utilisation des ressources
- Gestion inefficace des retours et des retards
- Manque d’accès numérique pour les étudiants et professeurs

La direction du DIT souhaite une **plateforme web moderne** capable de répondre à ces enjeux.

---

## 💡 Notre solution

**BiblioPro DIT** est une plateforme web complète offrant :

### 👑 Administrateur

L’administrateur dispose d’un **dashboard dédié** avec :

- **Vue d’ensemble** : statistiques en temps réel (livres, utilisateurs, emprunts, retards)
- **Gestion du catalogue** : ajout, modification, suppression de livres + upload d’image
- **Gestion des catégories** : création personnalisée avec code couleur
- **Gestion des emprunts** : consultation, enregistrement des retours, export CSV
- **Gestion des utilisateurs** : visualisation des comptes, rôles et statuts
- **Accès au site utilisateur** : navigation comme un utilisateur standard pour vérifier le rendu

### 👥 Autres rôles

| Rôle | Fonctionnalités |
|---|---|
| **Bibliothécaire** | Mêmes droits que l’administrateur pour la gestion quotidienne :<br>- Gérer le catalogue<br>- Enregistrer emprunts et retours<br>- Consulter l’historique<br>- Exporter les données CSV |
| **Étudiant** | - Catalogue avec filtres et recherche<br>- Emprunt en 1 clic (durée : **5 jours**)<br>- Suivi des emprunts (jours restants)<br>- Blocage si livre déjà emprunté<br>- Recommandations IA personnalisées<br>- Favoris (avec compteur dans la navbar) |
| **Professeur** | Mêmes fonctionnalités que l’étudiant, mais :<br>- **Durée de prêt étendue : 10 jours** |

---

## 🏗️ Architecture technique

L’application repose sur une **architecture microservices** conteneurisée avec Docker. Chaque service est indépendant et communique via des API REST.

| Service | Technologies | Responsabilités |
|---|---|---|
| **Auth** | Flask, JWT, Bcrypt | Authentification, tokens JWT, vérification des rôles, hashage mots de passe |
| **Livres** | Flask, PostgreSQL | CRUD livres/catégories, recherche multicritère, upload images |
| **Utilisateurs** | Flask, PostgreSQL | Gestion des profils (Étudiant, Professeur, Personnel) |
| **Emprunts** | Flask, PostgreSQL | Cycle emprunts/retours, détection retards, export CSV |
| **Recommandation IA** | FastAPI, Scikit-learn | Système de recommandation SVD, réentraînement via API |
| **Frontend SPA** | React 18, React Router | Interface utilisateur + dashboard admin |

Tous les services partagent une **base PostgreSQL unique**, conteneurisée avec volumes Docker.

###  Diagramme d’architecture

![Architecture du système](diagramme-architecture.png)

---

## 🧰 Technologies utilisées

| Composant | Technologie |
|-----------|-------------|
| **Frontend** | React 18 + React Router v6 + React Icons |
| **Backend Auth** | Flask + JWT + Bcrypt |
| **Backend Livres/Emprunts** | Flask + PostgreSQL |
| **Backend IA** | FastAPI + Scikit-learn (SVD) |
| **Base de données** | PostgreSQL 15 |
| **Conteneurisation** | Docker + Docker Compose |
| **Versioning Code** | Git + Git Flow |
| **Versioning Data/Modèle** | DVC |
| **Remote Storage** | Google Drive (configurable) |

---

## 📁 Structure du projet

```
bibliotheque-dit/
├── services/
│   ├── auth/                 # Authentification
│   ├── livres/               # Gestion livres
│   ├── utilisateurs/         # Profils utilisateurs
│   ├── emprunts/             # Gestion emprunts
│   ├── recommandation/       # Service IA (FastAPI + SVD)
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── model.py
│   │   │   └── database.py
│   │   └── model/            # Modèles sauvegardés
│   └── frontend/             # React SPA
│       ├── src/
│       │   ├── pages/
│       │   ├── admin/
│       │   ├── components/
│       │   ├── context/
│       │   └── services/
├── data/                     # Données versionnées DVC
├── dvc/                      # Scripts pipeline DVC
├── db/                       # Scripts SQL init
├── docker-compose.yml
├── dvc.yaml
├── dvc.lock
└── README.md
```

---

##  Branches Git Flow

| Branche | Contenu |
|---------|---------|
| `main` | Production (stable) |
| `develop` | Développement (fusion des features) |
| `feature/service-auth` | Authentification JWT + Frontend |
| `feature/service-livres` | CRUD Livres + Upload image |
| `feature/service-utilisateurs` | CRUD Utilisateurs |
| `feature/service-emprunts` | Emprunts, Retours, Export CSV |
| `feature/service-recommandation` | API FastAPI + SVD/KNN |
| `feature/dvc-pipeline` | Pipeline DVC |
| `feature/frontend` | Interface React |

![Branches GitHub](Branches.png)

---

##  Installation et lancement

### Prérequis

- Docker & Docker Compose
- Python 3.9+
- Git

### Lancement rapide

```bash
# 1. Cloner le projet
git clone https://github.com/InnoDataNiako/dit-bibliotheque-ml.git
cd dit-bibliotheque-ml

# 2. Lancer tous les services
docker compose --profile dev up -d

# 3. Initialiser la base de données
docker exec bibliotheque-db psql -U admin -d bibliotheque -f /docker-entrypoint-initdb.d/init.sql

# 4. Accéder au frontend
open http://localhost:3000
```

### Services exposés

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API Auth | http://localhost:8084 |
| API Livres | http://localhost:8081 |
| API Utilisateurs | http://localhost:8082 |
| API Emprunts | http://localhost:8083 |
| API Recommandation IA | http://localhost:8000 |
| PostgreSQL | localhost:5433 |

---

##  Services API

### 🔐 Auth (port 8084)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/login` | Connexion |
| POST | `/api/auth/register` | Inscription |
| GET | `/api/auth/me` | Profil connecté |
| GET | `/api/auth/users` | Liste utilisateurs (admin) |

### 📖 Livres (port 8081)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/livres` | Liste des livres |
| POST | `/api/livres` | Ajouter un livre |
| PUT | `/api/livres/{id}` | Modifier un livre |
| DELETE | `/api/livres/{id}` | Supprimer un livre |
| GET | `/api/livres/search?q=&type=` | Recherche |
| POST | `/api/livres/upload` | Upload image couverture |
| GET | `/api/categories` | Liste catégories |

### 📋 Emprunts (port 8083)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/emprunts` | Tous les emprunts |
| POST | `/api/emprunts` | Emprunter un livre |
| PUT | `/api/emprunts/{id}/retour` | Retourner un livre |
| GET | `/api/emprunts/utilisateur/{id}` | Historique utilisateur |
| GET | `/api/emprunts/retards` | Livres en retard |
| GET | `/api/emprunts/export` | Export CSV (ML) |

### 🤖 Recommandation IA (port 8000)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/recommandations/{user_id}` | Recommandations personnalisées |
| POST | `/train` | Ré-entraîner le modèle |

---

## 🤖 Système de recommandation IA

### Algorithme

- **SVD (Singular Value Decomposition)** pour la factorisation de matrice
- **KNN** pour les similarités entre livres
- **Cold Start** : recommandations populaires pour les nouveaux utilisateurs

### Métriques

| Version | RMSE | MAE | Utilisateurs | Livres |
|---------|------|-----|--------------|--------|
| v1.0 | 0.5 | 0.25 | 4 | 3 |

---

##  DVC - Data Version Control

### Pipeline (3 étapes)

| Étape | Script | Entrée | Sortie | Description |
|-------|--------|--------|--------|-------------|
| **Preprocessing** | `dvc/preprocess.py` | `data/loans.csv` | `data/loans_clean.csv` | Nettoyage (valeurs manquantes, doublons) |
| **Entraînement** | `dvc/train.py` | `data/loans_clean.csv` | `data/model.pkl` + `data/metrics.json` | Entraînement SVD + calcul RMSE/MAE |
| **Évaluation** | `dvc/evaluate.py` | `data/metrics.json` | Console | Affichage et validation des performances |

### Commandes utiles

```bash
# Exécuter le pipeline complet
dvc repro

# Afficher les métriques
dvc metrics show

# Comparer deux versions
dvc metrics diff

# Pousser les données vers le remote
dvc push
```

![DVC réussi](dvd-reusi.png)

### Métriques actuelles

```
Path               mae    rmse
data/metrics.json  0.25   0.5
```

![Métriques](metrique.png)

---

## 👨‍💻 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| **Admin** | `admin@dit.sn` | `admin123` |
| **Bibliothécaire** | `biblio@dit.sn` | `admin123` |
| **Étudiant** | `moussa@student.sn` | `pass123` |

---

## ✍️ Auteur

**Niako Kebe**

- Email : kebeniako17@gmail.com

---

*Projet académique - Master 2 Intelligence Artificielle - Dakar Institute of Technology (DIT) - Mai 2026*

