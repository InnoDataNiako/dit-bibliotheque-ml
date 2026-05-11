from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
import os
from .model import train_model, load_model, get_recommendations
from .database import get_loans_data

app = FastAPI(
    title="API Recommandation - Bibliothèque DIT",
    description="Système de recommandation de livres basé sur l'historique des emprunts",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.getenv("MODEL_PATH", "/app/model/model.pkl")
DATA_PATH = os.getenv("DATA_PATH", "/app/data/loans.csv")

# ============================================
# GET /recommandations/{user_id}
# ============================================
@app.get("/recommandations/{user_id}")
async def recommander(user_id: int, n: int = 5):
    """
    Retourne les n livres recommandés pour un utilisateur donné
    """
    try:
        # Charger le modèle
        if not os.path.exists(MODEL_PATH):
            raise HTTPException(
                status_code=404,
                detail="Modèle non trouvé. Veuillez d'abord entraîner le modèle via POST /train"
            )
        
        model_data = load_model(MODEL_PATH)
        
        if model_data is None:
            raise HTTPException(status_code=500, detail="Erreur lors du chargement du modèle")
        
        # Charger les données d'emprunts depuis la BD
        df = get_loans_data()
        
        if df.empty:
            raise HTTPException(status_code=404, detail="Aucune donnée d'emprunt trouvée")
        
        # Obtenir les recommandations
        recommendations = get_recommendations(model_data, df, user_id, n)
        
        return {
            "user_id": user_id,
            "nombre_recommandations": len(recommendations),
            "recommandations": recommendations
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# POST /train
# ============================================
@app.post("/train")
async def entrainer():
    """
    Ré-entraîne le modèle de recommandation
    """
    try:
        # Récupérer les données
        df = get_loans_data()
        
        if df.empty:
            raise HTTPException(status_code=404, detail="Aucune donnée d'emprunt trouvée")
        
        # Entraîner le modèle
        model_data, metrics = train_model(df)
        
        # Sauvegarder le modèle
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        joblib.dump(model_data, MODEL_PATH)
        
        return {
            "message": "Modèle entraîné avec succès",
            "metriques": metrics,
            "nombre_emprunts": len(df),
            "model_path": MODEL_PATH
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# GET /health
# ============================================
@app.get("/health")
async def health():
    model_exists = os.path.exists(MODEL_PATH)
    return {
        "status": "ok",
        "service": "recommandation",
        "modele_pret": model_exists
    }

# ============================================
# GET / - Racine
# ============================================
@app.get("/")
async def root():
    return {
        "service": "API Recommandation Bibliothèque DIT",
        "version": "1.0.0",
        "endpoints": {
            "GET /recommandations/{user_id}": "Obtenir les recommandations pour un utilisateur",
            "POST /train": "Ré-entraîner le modèle ML",
            "GET /health": "Vérifier l'état du service"
        }
    }