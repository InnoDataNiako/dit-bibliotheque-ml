import bcrypt
import psycopg2
import os

# Connexion DB
conn = psycopg2.connect(
    host='localhost',
    port=5433,
    user='admin',
    password='admin123',
    database='bibliotheque'
)
cur = conn.cursor()

# Vérifier si la table users existe, sinon la créer
cur.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'etudiant' CHECK (role IN ('admin', 'bibliothecaire', 'etudiant', 'professeur')),
        date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE
    )
''')

# Supprimer l'ancien admin si existe
cur.execute("DELETE FROM users WHERE email = 'admin@dit.sn'")

# Créer le hash
password = 'admin123'
password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
print(f"Hash généré: {password_hash}")

# Insérer admin et bibliothécaire
cur.execute('''
    INSERT INTO users (nom, prenom, email, password_hash, role)
    VALUES (%s, %s, %s, %s, %s)
''', ('Admin', 'DIT', 'admin@dit.sn', password_hash, 'admin'))

cur.execute('''
    INSERT INTO users (nom, prenom, email, password_hash, role)
    VALUES (%s, %s, %s, %s, %s)
''', ('Bibliothécaire', 'DIT', 'biblio@dit.sn', password_hash, 'bibliothecaire'))

conn.commit()
cur.close()
conn.close()

print("✅ Admin créé avec succès!")
print("   Email: admin@dit.sn")
print("   Password: admin123")
