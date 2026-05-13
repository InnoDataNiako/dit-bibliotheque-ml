from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
import psycopg2
import psycopg2.extras
import jwt
import bcrypt
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__)
CORS(app)

def get_db():
    return Config.get_db_connection()

# ============================================
# Middleware JWT
# ============================================
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Token manquant'}), 401
        try:
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
            request.current_user = payload
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expiré'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token invalide'}), 401
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.current_user.get('role') not in ['admin', 'bibliothecaire']:
            return jsonify({'error': 'Accès non autorisé'}), 403
        return f(*args, **kwargs)
    return decorated

# ============================================
# POST /api/auth/register
# ============================================
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    required = ['nom', 'prenom', 'email', 'password', 'role']
    for field in required:
        if field not in data:
            return jsonify({'error': f'Champ {field} requis'}), 400
    
    if data['role'] not in ['etudiant', 'professeur']:
        return jsonify({'error': 'Rôle invalide'}), 400
    
    conn = get_db()
    cur = conn.cursor()
    
    try:
        # Hasher le mot de passe
        password_hash = bcrypt.hashpw(
            data['password'].encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
        
        cur.execute('''
            INSERT INTO users (nom, prenom, email, password_hash, role)
        cur.execute('INSERT INTO utilisateurs (nom, prenom, email, type_utilisateur) VALUES (%s, %s, %s, %s) ON CONFLICT (email) DO NOTHING', (data['nom'], data['prenom'], data['email'], data['role'].capitalize()))
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, nom, prenom, email, role, date_inscription
        ''', (data['nom'], data['prenom'], data['email'], password_hash, data['role']))
        
        conn.commit()
        user = cur.fetchone()
        cur.close()
        conn.close()
        
        return jsonify({
            'message': 'Inscription réussie',
            'user': {
                'id': user[0], 'nom': user[1], 'prenom': user[2],
                'email': user[3], 'role': user[4]
            }
        }), 201
        
    except psycopg2.IntegrityError:
        conn.rollback()
        cur.close()
        conn.close()
        return jsonify({'error': 'Email déjà utilisé'}), 409

# ============================================
# POST /api/auth/login
# ============================================
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email et mot de passe requis'}), 400
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    cur.execute('SELECT * FROM users WHERE email = %s AND is_active = TRUE', (data['email'],))
    user = cur.fetchone()
    cur.close()
    conn.close()
    
    if not user:
        return jsonify({'error': 'Email ou mot de passe incorrect'}), 401
    
    if not bcrypt.checkpw(data['password'].encode('utf-8'), user['password_hash'].encode('utf-8')):
        return jsonify({'error': 'Email ou mot de passe incorrect'}), 401
    
    # Générer JWT
    token = jwt.encode({
        'user_id': user['id'],
        'email': user['email'],
        'role': user['role'],
        'nom': user['nom'],
        'prenom': user['prenom'],
        'exp': datetime.utcnow() + timedelta(hours=Config.JWT_EXPIRATION_HOURS)
    }, Config.JWT_SECRET, algorithm='HS256')
    
    return jsonify({
        'message': 'Connexion réussie',
        'token': token,
        'user': {
            'id': user['id'],
            'nom': user['nom'],
            'prenom': user['prenom'],
            'email': user['email'],
            'role': user['role']
        }
    }), 200

# ============================================
# GET /api/auth/me - Profil utilisateur connecté
# ============================================
@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_me():
    return jsonify({
        'user': request.current_user
    }), 200

# ============================================
# GET /api/auth/users - Liste utilisateurs (admin)
# ============================================
@app.route('/api/auth/users', methods=['GET'])
@token_required
@admin_required
def get_users():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute('SELECT id, nom, prenom, email, role, date_inscription, is_active FROM users ORDER BY date_inscription DESC')
    users = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(users), 200

# ============================================
# PUT /api/auth/users/<id>/role - Changer rôle
# ============================================
@app.route('/api/auth/users/<int:id>/role', methods=['PUT'])
@token_required
@admin_required
def change_role(id):
    data = request.get_json()
    if data.get('role') not in ['admin', 'bibliothecaire', 'etudiant', 'professeur']:
        return jsonify({'error': 'Rôle invalide'}), 400
    
    conn = get_db()
    cur = conn.cursor()
    cur.execute('UPDATE users SET role = %s WHERE id = %s', (data['role'], id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': 'Rôle mis à jour'}), 200

# ============================================
# Healthcheck
# ============================================
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'auth'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)