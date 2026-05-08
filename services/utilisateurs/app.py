from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
import psycopg2
import psycopg2.extras

app = Flask(__name__)
CORS(app)

def get_db():
    return Config.get_db_connection()

# ============================================
# 1. GET /api/utilisateurs - Liste utilisateurs
# ============================================
@app.route('/api/utilisateurs', methods=['GET'])
def get_utilisateurs():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute('SELECT * FROM utilisateurs ORDER BY date_inscription DESC')
    utilisateurs = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(utilisateurs), 200

# ============================================
# 2. GET /api/utilisateurs/<id> - Profil
# ============================================
@app.route('/api/utilisateurs/<int:id>', methods=['GET'])
def get_utilisateur(id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute('SELECT * FROM utilisateurs WHERE id = %s', (id,))
    utilisateur = cur.fetchone()
    cur.close()
    conn.close()
    
    if utilisateur is None:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    return jsonify(utilisateur), 200

# ============================================
# 3. POST /api/utilisateurs - Création
# ============================================
@app.route('/api/utilisateurs', methods=['POST'])
def add_utilisateur():
    data = request.get_json()
    
    required_fields = ['nom', 'prenom', 'email', 'type_utilisateur']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Champ {field} requis'}), 400
    
    # Vérifier type valide
    types_valides = ['Etudiant', 'Professeur', 'Personnel']
    if data['type_utilisateur'] not in types_valides:
        return jsonify({'error': f'Type invalide. Types acceptés: {types_valides}'}), 400
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    try:
        cur.execute('''
            INSERT INTO utilisateurs (nom, prenom, email, type_utilisateur)
            VALUES (%s, %s, %s, %s)
            RETURNING *
        ''', (data['nom'], data['prenom'], data['email'], data['type_utilisateur']))
        conn.commit()
        utilisateur = cur.fetchone()
        cur.close()
        conn.close()
        return jsonify(utilisateur), 201
        
    except psycopg2.IntegrityError:
        conn.rollback()
        cur.close()
        conn.close()
        return jsonify({'error': 'Email déjà existant'}), 409

# ============================================
# 4. PUT /api/utilisateurs/<id> - Modification
# ============================================
@app.route('/api/utilisateurs/<int:id>', methods=['PUT'])
def update_utilisateur(id):
    data = request.get_json()
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    # Vérifier existence
    cur.execute('SELECT * FROM utilisateurs WHERE id = %s', (id,))
    if cur.fetchone() is None:
        cur.close()
        conn.close()
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    
    cur.execute('''
        UPDATE utilisateurs
        SET nom = COALESCE(%s, nom),
            prenom = COALESCE(%s, prenom),
            email = COALESCE(%s, email),
            type_utilisateur = COALESCE(%s, type_utilisateur)
        WHERE id = %s
        RETURNING *
    ''', (
        data.get('nom'),
        data.get('prenom'),
        data.get('email'),
        data.get('type_utilisateur'),
        id
    ))
    conn.commit()
    utilisateur = cur.fetchone()
    cur.close()
    conn.close()
    return jsonify(utilisateur), 200

# ============================================
# 5. DELETE /api/utilisateurs/<id> - Suppression
# ============================================
@app.route('/api/utilisateurs/<int:id>', methods=['DELETE'])
def delete_utilisateur(id):
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute('DELETE FROM utilisateurs WHERE id = %s RETURNING id', (id,))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    if deleted is None:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404
    return jsonify({'message': 'Utilisateur supprimé avec succès'}), 200

# ============================================
# 6. GET /api/utilisateurs/type/<type> - Filtrer par type
# ============================================
@app.route('/api/utilisateurs/type/<type>', methods=['GET'])
def get_by_type(type):
    types_valides = ['Etudiant', 'Professeur', 'Personnel']
    if type not in types_valides:
        return jsonify({'error': f'Type invalide. Types acceptés: {types_valides}'}), 400
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute('SELECT * FROM utilisateurs WHERE type_utilisateur = %s', (type,))
    utilisateurs = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(utilisateurs), 200

# ============================================
# Healthcheck
# ============================================
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'utilisateurs'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)