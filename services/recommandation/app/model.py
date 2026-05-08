import pandas as pd
import numpy as np
from sklearn.decomposition import TruncatedSVD
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics import mean_squared_error, mean_absolute_error
import joblib
import warnings
warnings.filterwarnings('ignore')

def create_user_item_matrix(df):
    """
    Crée une matrice utilisateur-livre à partir des emprunts
    """
    # Compter le nombre d'emprunts par utilisateur et par livre
    user_item = df.groupby(['utilisateur_id', 'livre_id']).size().unstack(fill_value=0)
    return user_item

def train_model(df, n_components=10):
    """
    Entraîne un modèle SVD pour la recommandation collaborative
    
    Args:
        df: DataFrame avec colonnes utilisateur_id, livre_id
        n_components: Nombre de composantes latentes
    
    Returns:
        model_data: dict contenant tout le nécessaire pour les prédictions
        metrics: dict avec RMSE et MAE
    """
    # Créer la matrice utilisateur-livre
    user_item_matrix = create_user_item_matrix(df)
    
    # Appliquer SVD
    svd = TruncatedSVD(n_components=min(n_components, min(user_item_matrix.shape)-1))
    user_factors = svd.fit_transform(user_item_matrix)
    item_factors = svd.components_.T
    
    # Reconstruire la matrice
    reconstructed = np.dot(user_factors, item_factors.T)
    
    # Calculer les métriques sur les valeurs non-nulles
    mask = user_item_matrix.values > 0
    if mask.sum() > 0:
        rmse = np.sqrt(mean_squared_error(
            user_item_matrix.values[mask], 
            reconstructed[mask]
        ))
        mae = mean_absolute_error(
            user_item_matrix.values[mask], 
            reconstructed[mask]
        )
    else:
        rmse, mae = 0.0, 0.0
    
    # Entraîner KNN sur les facteurs des livres pour trouver des similarités
    knn = NearestNeighbors(n_neighbors=10, metric='cosine')
    knn.fit(item_factors)
    
    model_data = {
        'svd': svd,
        'user_factors': user_factors,
        'item_factors': item_factors,
        'knn': knn,
        'user_item_matrix': user_item_matrix,
        'user_ids': user_item_matrix.index.tolist(),
        'item_ids': user_item_matrix.columns.tolist()
    }
    
    metrics = {
        'rmse': round(rmse, 4),
        'mae': round(mae, 4),
        'n_users': len(user_item_matrix),
        'n_items': len(user_item_matrix.columns)
    }
    
    return model_data, metrics

def load_model(path):
    """Charge le modèle sauvegardé"""
    try:
        return joblib.load(path)
    except Exception as e:
        print(f"Erreur chargement modèle: {e}")
        return None

def get_recommendations(model_data, df, user_id, n=5):
    """
    Génère des recommandations pour un utilisateur
    
    Args:
        model_data: dict retourné par train_model
        df: DataFrame des emprunts
        user_id: ID de l'utilisateur
        n: nombre de recommandations
    
    Returns:
        list de dicts avec id, titre, score
    """
    user_item_matrix = model_data['user_item_matrix']
    item_factors = model_data['item_factors']
    user_ids = model_data['user_ids']
    item_ids = model_data['item_ids']
    knn = model_data['knn']
    
    # Récupérer les informations des livres
    book_info = df[['livre_id', 'titre', 'auteur', 'categorie']].drop_duplicates('livre_id')
    
    # Si l'utilisateur existe dans la matrice
    if user_id in user_ids:
        user_idx = user_ids.index(user_id)
        user_vector = user_item_matrix.iloc[user_idx].values
        
        # Livres déjà empruntés
        borrowed = set(user_item_matrix.columns[user_vector > 0])
        
        # Prédictions SVD
        user_factors = model_data['svd'].transform(user_item_matrix)
        scores = np.dot(user_factors[user_idx], item_factors.T)
        
        # Créer liste (livre_id, score) pour livres non empruntés
        candidates = []
        for i, item_id in enumerate(item_ids):
            if item_id not in borrowed:
                candidates.append((item_id, scores[i]))
        
        # Trier par score décroissant
        candidates.sort(key=lambda x: x[1], reverse=True)
        
        # Top N
        recommendations = []
        for item_id, score in candidates[:n]:
            info = book_info[book_info['livre_id'] == item_id]
            if not info.empty:
                recommendations.append({
                    'livre_id': int(item_id),
                    'titre': info.iloc[0]['titre'],
                    'auteur': info.iloc[0]['auteur'],
                    'categorie': info.iloc[0]['categorie'] if 'categorie' in info.columns else 'N/A',
                    'score': round(float(score), 4)
                })
        
        return recommendations
    
    else:
        # Nouvel utilisateur : recommander les livres les plus populaires
        popular = df['livre_id'].value_counts().head(n)
        recommendations = []
        for item_id, count in popular.items():
            info = book_info[book_info['livre_id'] == item_id]
            if not info.empty:
                recommendations.append({
                    'livre_id': int(item_id),
                    'titre': info.iloc[0]['titre'],
                    'auteur': info.iloc[0]['auteur'],
                    'categorie': info.iloc[0]['categorie'] if 'categorie' in info.columns else 'N/A',
                    'score': round(float(count), 4),
                    'type': 'populaire (cold start)'
                })
        
        return recommendations