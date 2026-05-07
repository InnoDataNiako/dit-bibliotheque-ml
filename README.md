# Bibliothèque Numérique - Dakar Institute of Technology (DIT)

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/backend-python-green)
![Docker](https://img.shields.io/badge/container-docker-blue)
![DVC](https://img.shields.io/badge/data-dvc-orange)

Plateforme complète de gestion de bibliothèque académique avec système de recommandation de livres par Machine Learning.

## Table des matières

- [Présentation](#présentation)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Services](#services)
- [Système de Recommandation](#système-de-recommandation)
- [DVC - Data Version Control](#dvc---data-version-control)
- [Endpoints API](#endpoints-api)
- [Métriques du Modèle](#métriques-du-modèle)
- [Workflow Git](#workflow-git)
- [Bonus CI/CD](#bonus-cicd)

## Présentation

Le DIT souhaite moderniser la gestion de sa bibliothèque. Actuellement manuelle, elle présente des difficultés de suivi, l'absence de statistiques fiables et un manque d'accès numérique pour les étudiants.

Cette application microservices propose :
- Gestion complète des livres, utilisateurs et emprunts
- Système de recommandation ML basé sur l'historique des emprunts
- Versioning avancé du code (Git), des données et du modèle (DVC)
- Conteneurisation Docker avec profils dev/prod

## Architecture

![Architecture du système](docs/architecture.png)

Architecture microservices (5 services) :
- **Service Livres** → CRUD + Recherche catalogue
- **Service Utilisateurs** → Gestion profils et types
- **Service Emprunts** → Emprunts, retours, historique
- **Service Recommandation** → API FastAPI + Modèle ML
- **Frontend** → Interface utilisateur React

Communication : API REST  
Base de données : PostgreSQL  
Orchestration : Docker Compose

## Technologies

| Composant       | Technologie                  |
|----------------|------------------------------|
| Backend Services | Flask / Express (au choix)  |
| API ML          | FastAPI + Scikit-learn       |
| Frontend        | React                        |
| Base de données | PostgreSQL                   |
| Conteneurisation | Docker + Docker Compose     |
| Versioning Code | Git + Git Flow               |
| Versioning Data/Model | DVC + Google Drive    |
| CI/CD (bonus)   | Jenkins / GitHub Actions     |

## Prérequis

- Docker & Docker Compose
- Python 3.9+
- Git
- DVC (`pip install dvc`)

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/[USERNAME]/bibliotheque-dit.git
cd bibliotheque-dit
```

### 2. Lancer l'application avec Docker Compose

**Mode développement (hot-reload) :**

```bash
docker compose --profile dev up -d
```

**Mode production :**

```bash
docker compose --profile prod up -d
```

### 3. Initialiser la base de données

```bash
docker compose exec postgres psql -U admin -d bibliotheque -f /docker-entrypoint-initdb.d/init.sql
```

### 4. Accès aux services

| Service           | URL                       |
|-------------------|---------------------------|
| Frontend          | http://localhost:3000     |
| API Livres        | http://localhost:8081     |
| API Utilisateurs  | http://localhost:8082     |
| API Emprunts      | http://localhost:8083     |
| API Recommandation | http://localhost:8000     |
| PostgreSQL        | localhost:5432            |

## Services

### Service Livres (port 8081)
- `GET /api/livres` - Liste des livres
- `POST /api/livres` - Ajouter un livre
- `PUT /api/livres/{id}` - Modifier un livre
- `DELETE /api/livres/{id}` - Supprimer un livre
- `GET /api/livres/search?q=&type=` - Recherche par titre/auteur/ISBN

### Service Utilisateurs (port 8082)
- `POST /api/utilisateurs` - Création
- `GET /api/utilisateurs` - Liste
- `GET /api/utilisateurs/{id}` - Profil
- `PUT /api/utilisateurs/{id}` - Modification
- `DELETE /api/utilisateurs/{id}` - Suppression

### Service Emprunts (port 8083)
- `POST /api/emprunts` - Emprunter un livre
- `PUT /api/emprunts/{id}/retour` - Retourner un livre
- `GET /api/emprunts/utilisateur/{id}` - Historique
- `GET /api/emprunts/retards` - Détection retards
- `GET /api/emprunts/export` - Export CSV pour ML

### Service Recommandation (port 8000)
- `GET /recommandations/{user_id}` - Recommandations personnalisées
- `POST /train` - Ré-entraînement du modèle

## Système de Recommandation

Le moteur de recommandation utilise un filtrage collaboratif basé sur l'algorithme **SVD** (Singular Value Decomposition) ou **KNN**.

- **Données :** Historique des emprunts (utilisateur, livre, interaction implicite)
- **Modèle :** SVD / KNN entraîné sur la matrice utilisateur-livre
- **Métriques :** RMSE, MAE

## DVC - Data Version Control

### Configuration

```bash
dvc remote add -d myremote gdrive://DRIVE_FOLDER_ID
```

### Pipeline

```bash
dvc repro   # Exécute le pipeline complet
```

Étapes du pipeline :
1. `preprocess.py` → Nettoie `loans.csv` → `loans_clean.csv`
2. `train.py` → Entraîne modèle SVD/KNN → `model.pkl`
3. `evaluate.py` → Calcule RMSE/MAE → `metrics.json`

### Métriques

```bash
dvc metrics show     # Affiche les métriques
dvc metrics diff     # Compare deux versions
```

### Versioning du Modèle

```bash
dvc push   # Pousser les données/ modèle vers le remote
dvc pull   # Récupérer une version spécifique
```

## Métriques du Modèle

| Version | RMSE   | MAE    |
|---------|--------|--------|
| v1.0    | 0.892  | 0.715  |
| v1.1    | 0.845  | 0.682  |

## Workflow Git

Git Flow avec branches :
- `main` - Production
- `develop` - Développement
- `feature/*` - Nouvelles fonctionnalités
- `release/*` - Préparation releases
- `hotfix/*` - Corrections urgentes

## Bonus CI/CD

Pipeline automatisé avec Jenkins / GitHub Actions :
- Build & Tests
- Build Docker images
- Déploiement
```

