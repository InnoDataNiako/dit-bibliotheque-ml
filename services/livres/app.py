from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
import psycopg2
import psycopg2.extras
import os
from werkzeug.utils import secure_filename
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuration upload
UPLOAD_FOLDER = '/app/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_db():
    return Config.get_db_connection()

# ============================================
# UPLOAD IMAGE
# ============================================
@app.route('/api/livres/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'Aucun fichier'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Aucun fichier sélectionné'}), 400
    
    if file and allowed_file(file.filename):
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        filename = secure_filename(f"{timestamp}_{file.filename}")
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        return jsonify({'url': f'/uploads/{filename}'}), 200
    
    return jsonify({'error': 'Format non autorisé (png, jpg, jpeg, gif, webp)'}), 400

# Servir les images uploadées
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# ============================================
# 1. GET /api/livres - Liste tous les livres
# ============================================
@app.route('/api/livres', methods=['GET'])
def get_livres():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute('SELECT * FROM livres ORDER BY date_ajout DESC')
    livres = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(livres), 200

# ============================================
# 2. GET /api/livres/<id> - Détail
# ============================================
@app.route('/api/livres/<int:id>', methods=['GET'])
def get_livre(id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute('SELECT * FROM livres WHERE id = %s', (id,))
    livre = cur.fetchone()
    cur.close()
    conn.close()
    if livre is None:
        return jsonify({'error': 'Livre non trouvé'}), 404
    return jsonify(livre), 200

# ============================================
# 3. POST /api/livres - Ajouter
# ============================================
@app.route('/api/livres', methods=['POST'])
def add_livre():
    data = request.get_json()
    
    required_fields = ['titre', 'auteur', 'isbn']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Champ {field} requis'}), 400
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    try:
        cur.execute('''
            INSERT INTO livres (titre, auteur, isbn, categorie, annee_publication, nombre_exemplaires, image_url, description)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        ''', (
            data['titre'],
            data['auteur'],
            data['isbn'],
            data.get('categorie', None),
            data.get('annee_publication', None),
            data.get('nombre_exemplaires', 1),
            data.get('image_url', None),
            data.get('description', None)
        ))
        conn.commit()
        livre = cur.fetchone()
        cur.close()
        conn.close()
        return jsonify(livre), 201
        
    except psycopg2.IntegrityError:
        conn.rollback()
        cur.close()
        conn.close()
        return jsonify({'error': 'ISBN déjà existant'}), 409

# ============================================
# 4. PUT /api/livres/<id> - Modifier
# ============================================
@app.route('/api/livres/<int:id>', methods=['PUT'])
def update_livre(id):
    data = request.get_json()
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    cur.execute('SELECT * FROM livres WHERE id = %s', (id,))
    if cur.fetchone() is None:
        cur.close()
        conn.close()
        return jsonify({'error': 'Livre non trouvé'}), 404
    
    cur.execute('''
        UPDATE livres
        SET titre = COALESCE(%s, titre),
            auteur = COALESCE(%s, auteur),
            isbn = COALESCE(%s, isbn),
            categorie = COALESCE(%s, categorie),
            annee_publication = COALESCE(%s, annee_publication),
            nombre_exemplaires = COALESCE(%s, nombre_exemplaires),
            image_url = COALESCE(%s, image_url),
            description = COALESCE(%s, description)
        WHERE id = %s
        RETURNING *
    ''', (
        data.get('titre'),
        data.get('auteur'),
        data.get('isbn'),
        data.get('categorie'),
        data.get('annee_publication'),
        data.get('nombre_exemplaires'),
        data.get('image_url'),
        data.get('description'),
        id
    ))
    conn.commit()
    livre = cur.fetchone()
    cur.close()
    conn.close()
    return jsonify(livre), 200

# ============================================
# 5. DELETE /api/livres/<id>
# ============================================
@app.route('/api/livres/<int:id>', methods=['DELETE'])
def delete_livre(id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('DELETE FROM livres WHERE id = %s RETURNING id', (id,))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if deleted is None:
        return jsonify({'error': 'Livre non trouvé'}), 404
    return jsonify({'message': 'Livre supprimé avec succès'}), 200

# ============================================
# 6. GET /api/livres/search
# ============================================
@app.route('/api/livres/search', methods=['GET'])
def search_livres():
    query = request.args.get('q', '')
    search_type = request.args.get('type', 'titre')
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    if search_type == 'titre':
        cur.execute('SELECT * FROM livres WHERE titre ILIKE %s', (f'%{query}%',))
    elif search_type == 'auteur':
        cur.execute('SELECT * FROM livres WHERE auteur ILIKE %s', (f'%{query}%',))
    elif search_type == 'isbn':
        cur.execute('SELECT * FROM livres WHERE isbn ILIKE %s', (f'%{query}%',))
    else:
        cur.close()
        conn.close()
        return jsonify({'error': 'Type de recherche invalide'}), 400
    
    livres = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(livres), 200

# ============================================
# Healthcheck
# ============================================
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'livres'}), 200


# ============================================
# GESTION DES CATÉGORIES
# ============================================

# GET /api/categories - Liste
@app.route('/api/categories', methods=['GET'])
def get_categories():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute('SELECT * FROM categories ORDER BY nom')
    categories = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(categories), 200

# POST /api/categories - Ajouter
@app.route('/api/categories', methods=['POST'])
def add_categorie():
    data = request.get_json()
    if not data.get('nom'):
        return jsonify({'error': 'Nom requis'}), 400
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    try:
        cur.execute('''
            INSERT INTO categories (nom, description, couleur)
            VALUES (%s, %s, %s)
            RETURNING *
        ''', (data['nom'], data.get('description', ''), data.get('couleur', '#667eea')))
        conn.commit()
        cat = cur.fetchone()
        cur.close()
        conn.close()
        return jsonify(cat), 201
    except psycopg2.IntegrityError:
        conn.rollback()
        cur.close()
        conn.close()
        return jsonify({'error': 'Catégorie déjà existante'}), 409

# PUT /api/categories/<id> - Modifier
@app.route('/api/categories/<int:id>', methods=['PUT'])
def update_categorie(id):
    data = request.get_json()
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    cur.execute('''
        UPDATE categories
        SET nom = COALESCE(%s, nom),
            description = COALESCE(%s, description),
            couleur = COALESCE(%s, couleur)
        WHERE id = %s
        RETURNING *
    ''', (data.get('nom'), data.get('description'), data.get('couleur'), id))
    conn.commit()
    cat = cur.fetchone()
    cur.close()
    conn.close()
    
    if cat is None:
        return jsonify({'error': 'Catégorie non trouvée'}), 404
    return jsonify(cat), 200

# DELETE /api/categories/<id>
@app.route('/api/categories/<int:id>', methods=['DELETE'])
def delete_categorie(id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('DELETE FROM categories WHERE id = %s RETURNING id', (id,))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    if deleted is None:
        return jsonify({'error': 'Catégorie non trouvée'}), 404
    return jsonify({'message': 'Catégorie supprimée'}), 200
# ============================================
# WISHLIST / FAVORIS
# ============================================

@app.route('/api/wishlist/<int:user_id>', methods=['GET'])
def get_wishlist(user_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute('''
        SELECT w.*, l.titre, l.auteur, l.isbn, l.categorie 
        FROM wishlist w JOIN livres l ON w.livre_id = l.id 
        WHERE w.utilisateur_id = %s ORDER BY w.date_ajout DESC
    ''', (user_id,))
    favoris = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(favoris), 200

@app.route('/api/wishlist/toggle', methods=['POST'])
def toggle_wishlist():
    data = request.get_json()
    user_id = data.get('utilisateur_id')
    livre_id = data.get('livre_id')
    
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute('SELECT id FROM wishlist WHERE utilisateur_id = %s AND livre_id = %s', (user_id, livre_id))
    existe = cur.fetchone()
    
    if existe:
        cur.execute('DELETE FROM wishlist WHERE utilisateur_id = %s AND livre_id = %s', (user_id, livre_id))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'action': 'removed', 'message': 'Retiré des favoris'}), 200
    else:
        cur.execute('INSERT INTO wishlist (utilisateur_id, livre_id) VALUES (%s, %s) RETURNING id', (user_id, livre_id))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'action': 'added', 'message': 'Ajouté aux favoris'}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

