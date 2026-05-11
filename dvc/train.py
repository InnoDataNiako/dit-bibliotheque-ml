import pandas as pd
import numpy as np
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics import mean_squared_error, mean_absolute_error
import joblib
import json

print("=== TRAINING ===")
df = pd.read_csv('data/loans_clean.csv')

# Créer matrice utilisateur-livre
user_item = df.groupby(['utilisateur_id', 'livre_id']).size().unstack(fill_value=0)

# SVD
svd = TruncatedSVD(n_components=min(5, min(user_item.shape)-1))
user_factors = svd.fit_transform(user_item)

# Reconstruire
reconstructed = np.dot(user_factors, svd.components_)

# Métriques
mask = user_item.values > 0
rmse = np.sqrt(mean_squared_error(user_item.values[mask], reconstructed[mask]))
mae = mean_absolute_error(user_item.values[mask], reconstructed[mask])

# Sauvegarder modèle
joblib.dump({'svd': svd, 'user_factors': user_factors, 'item_ids': list(user_item.columns), 'user_ids': list(user_item.index)}, 'data/model.pkl')

# Sauvegarder métriques
metrics = {'rmse': round(rmse, 4), 'mae': round(mae, 4)}
with open('data/metrics.json', 'w') as f:
    json.dump(metrics, f)

print(f"✅ Modèle entraîné - RMSE: {metrics['rmse']}, MAE: {metrics['mae']}")
print(f"✅ model.pkl et metrics.json sauvegardés")
