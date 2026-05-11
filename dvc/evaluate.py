import json

print("=== EVALUATION ===")
with open('data/metrics.json', 'r') as f:
    metrics = json.load(f)

print(f"📊 RMSE : {metrics['rmse']}")
print(f"📊 MAE  : {metrics['mae']}")

if metrics['rmse'] < 1.0:
    print("✅ Modèle performant (RMSE < 1.0)")
else:
    print("⚠️ Modèle à améliorer (RMSE >= 1.0)")
