import pandas as pd

print("=== PREPROCESSING ===")
df = pd.read_csv('data/loans.csv')
print(f"Données brutes : {len(df)} lignes")

# Nettoyage
df = df.dropna(subset=['utilisateur_id', 'livre_id'])
df = df.drop_duplicates()

print(f"Données nettoyées : {len(df)} lignes")
df.to_csv('data/loans_clean.csv', index=False)
print("✅ loans_clean.csv créé")
