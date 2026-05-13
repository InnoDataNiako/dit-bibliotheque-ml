# from flask import Flask, request, jsonify, Response
# from flask_cors import CORS
# from config import Config
# import psycopg2
# import psycopg2.extras
# from datetime import date, timedelta
# import csv
# import io

# app = Flask(__name__)
# CORS(app)

# def get_db():
#     return Config.get_db_connection()

# # ============================================
# # 1. POST /api/emprunts - Emprunter un livre
# # ============================================
# @app.route('/api/emprunts', methods=['POST'])
# def emprunter():
#     data = request.get_json()
    
#     if 'livre_id' not in data:
#         return jsonify({'error': 'Champ livre_id requis'}), 400
    
#     conn = get_db()
#     cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
#     try:
#         # Chercher utilisateur par email ou ID
#         email = data.get('email')
#         if email:
#             cur.execute('SELECT id FROM utilisateurs WHERE email = %s', (email,))
#         else:
#             cur.execute('SELECT id FROM utilisateurs WHERE id = %s', (data.get('utilisateur_id', 0),))
        
#         row = cur.fetchone()
#         if row is None:
#             # Creer l'utilisateur dans la table utilisateurs
#             email = data.get('email', '')
#             nom = email.split('@')[0] if email else 'Utilisateur'
#             cur.execute('INSERT INTO utilisateurs (nom, prenom, email, type_utilisateur) VALUES (%s, %s, %s, %s) ON CONFLICT (email) DO NOTHING RETURNING id', (nom, nom, email, 'Etudiant'))
#             row = cur.fetchone()
#             if row is None:
#                 cur.execute('SELECT id FROM utilisateurs WHERE email = %s', (email,))
#                 row = cur.fetchone()
#         utilisateur_id = row['id']
        
#         # Vérifier que le livre existe
#         cur.execute('SELECT id, nombre_exemplaires FROM livres WHERE id = %s', (data['livre_id'],))
#         livre = cur.fetchone()
#         if livre is None:
#             cur.close()
#             conn.close()
#             return jsonify({'error': 'Livre non trouve'}), 404
        
#         # Vérifier qu'il y a des exemplaires disponibles
#         cur.execute('''
#             SELECT COUNT(*) as empruntes FROM emprunts 
#             WHERE livre_id = %s AND statut = 'En cours'
#         ''', (data['livre_id'],))
#         empruntes = cur.fetchone()['empruntes']
        
#         if empruntes >= livre['nombre_exemplaires']:
#             cur.close()
#             conn.close()
#             return jsonify({'error': 'Aucun exemplaire disponible'}), 400
        
#         # Date de retour prévue : 14 jours
#         date_retour = date.today() + timedelta(days=14)
        
#         cur.execute('''
#             INSERT INTO emprunts (utilisateur_id, livre_id, date_emprunt, date_retour_prevue)
#             VALUES (%s, %s, %s, %s)
#             RETURNING *
#         ''', (utilisateur_id, data['livre_id'], date.today(), date_retour))
        
#         conn.commit()
#         emprunt = cur.fetchone()
#         cur.close()
#         conn.close()
#         return jsonify(emprunt), 201
        
#     except Exception as e:
#         conn.rollback()
#         cur.close()
#         conn.close()
#         return jsonify({'error': str(e)}), 500

# # ============================================
# # 2. PUT /api/emprunts/<id>/retour - Retourner
# # ============================================
# @app.route('/api/emprunts/<int:id>/retour', methods=['PUT'])
# def retourner(id):
#     conn = get_db()
#     cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
#     cur.execute('SELECT * FROM emprunts WHERE id = %s', (id,))
#     emprunt = cur.fetchone()
    
#     if emprunt is None:
#         cur.close()
#         conn.close()
#         return jsonify({'error': 'Emprunt non trouve'}), 404
    
#     if emprunt['statut'] == 'Retourne':
#         cur.close()
#         conn.close()
#         return jsonify({'error': 'Livre deja retourne'}), 400
    
#     today = date.today()
    
#     cur.execute('''
#         UPDATE emprunts
#         SET date_retour_effective = %s, statut = 'Retourné'
#         WHERE id = %s
#         RETURNING *
#     ''', (today, id))
    
#     conn.commit()
#     emprunt = cur.fetchone()
#     cur.close()
#     conn.close()
#     return jsonify(emprunt), 200

# # ============================================
# # 3. GET /api/emprunts/utilisateur/<id>
# # ============================================
# @app.route('/api/emprunts/utilisateur/<int:user_id>', methods=['GET'])
# def historique_utilisateur(user_id):
#     conn = get_db()
#     cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
#     cur.execute('''
#         SELECT e.*, l.titre, l.auteur, l.isbn, l.image_url
#         FROM emprunts e
#         JOIN livres l ON e.livre_id = l.id
#         WHERE e.utilisateur_id = %s
#         ORDER BY e.date_emprunt DESC
#     ''', (user_id,))
    
#     emprunts = cur.fetchall()
#     cur.close()
#     conn.close()
#     return jsonify(emprunts), 200

# # ============================================
# # 4. GET /api/emprunts/retards
# # ============================================
# @app.route('/api/emprunts/retards', methods=['GET'])
# def retards():
#     conn = get_db()
#     cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
#     today = date.today()
    
#     cur.execute('''
#         UPDATE emprunts
#         SET statut = 'En retard'
#         WHERE statut = 'En cours' AND date_retour_prevue < %s
#     ''', (today,))
#     conn.commit()
    
#     cur.execute('''
#         SELECT e.*, l.titre, l.image_url, u.nom, u.prenom, u.email
#         FROM emprunts e
#         JOIN livres l ON e.livre_id = l.id
#         JOIN utilisateurs u ON e.utilisateur_id = u.id
#         WHERE e.statut = 'En retard'
#         ORDER BY e.date_retour_prevue ASC
#     ''')
    
#     retards = cur.fetchall()
#     cur.close()
#     conn.close()
#     return jsonify(retards), 200

# # ============================================
# # 5. GET /api/emprunts/export
# # ============================================
# @app.route('/api/emprunts/export', methods=['GET'])
# def export_csv():
#     conn = get_db()
#     cur = conn.cursor()
    
#     cur.execute('''
#         SELECT 
#             e.id, e.utilisateur_id, e.livre_id,
#             e.date_emprunt, e.date_retour_prevue, e.date_retour_effective,
#             e.statut, l.titre, l.auteur, l.categorie, u.type_utilisateur
#         FROM emprunts e
#         JOIN livres l ON e.livre_id = l.id
#         JOIN utilisateurs u ON e.utilisateur_id = u.id
#         ORDER BY e.date_emprunt DESC
#     ''')
    
#     rows = cur.fetchall()
#     cur.close()
#     conn.close()
    
#     output = io.StringIO()
#     writer = csv.writer(output)
#     writer.writerow(['id','utilisateur_id','livre_id','date_emprunt','date_retour_prevue','date_retour_effective','statut','titre','auteur','categorie','type_utilisateur'])
#     writer.writerows(rows)
    
#     return Response(output.getvalue(), mimetype='text/csv', headers={'Content-Disposition': 'attachment;filename=loans.csv'})

# # ============================================
# # 6. GET /api/emprunts - Tous
# # ============================================
# @app.route('/api/emprunts', methods=['GET'])
# def get_all():
#     conn = get_db()
#     cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
#     cur.execute('''
#         SELECT e.*, l.titre, l.auteur, l.image_url, u.nom, u.prenom, u.email
#         FROM emprunts e
#         JOIN livres l ON e.livre_id = l.id
#         JOIN utilisateurs u ON e.utilisateur_id = u.id
#         ORDER BY e.date_emprunt DESC
#     ''')
    
#     emprunts = cur.fetchall()
#     cur.close()
#     conn.close()
#     return jsonify(emprunts), 200

# # ============================================
# # Healthcheck
# # ============================================
# @app.route('/health', methods=['GET'])
# def health():
#     return jsonify({'status': 'ok', 'service': 'emprunts'}), 200

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)



from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from config import Config
import psycopg2
import psycopg2.extras
from datetime import date, timedelta
import csv
import io

app = Flask(__name__)
CORS(app)

def get_db():
    return Config.get_db_connection()

@app.route('/api/emprunts', methods=['POST'])
def emprunter():
    data = request.get_json()
    
    if 'livre_id' not in data:
        return jsonify({'error': 'Champ livre_id requis'}), 400
    
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    try:
        email = data.get('email', '')
        utilisateur_id = data.get('utilisateur_id', 0)
        
        # Chercher ou creer l'utilisateur
        if email:
            cur.execute('SELECT id FROM utilisateurs WHERE email = %s', (email,))
            row = cur.fetchone()
            if row is None:
                nom = email.split('@')[0]
                cur.execute('INSERT INTO utilisateurs (nom, prenom, email, type_utilisateur) VALUES (%s, %s, %s, %s) RETURNING id', (nom, nom, email, 'Etudiant'))
                row = cur.fetchone()
            utilisateur_id = row['id']
        elif utilisateur_id:
            cur.execute('SELECT id FROM utilisateurs WHERE id = %s', (utilisateur_id,))
            row = cur.fetchone()
            if row is None:
                cur.close(); conn.close()
                return jsonify({'error': 'Utilisateur non trouve'}), 404
        
        cur.execute('SELECT id, nombre_exemplaires FROM livres WHERE id = %s', (data['livre_id'],))
        livre = cur.fetchone()
        if livre is None:
            cur.close(); conn.close()
            return jsonify({'error': 'Livre non trouve'}), 404
        
        cur.execute("SELECT COUNT(*) as empruntes FROM emprunts WHERE livre_id = %s AND statut = 'En cours'", (data['livre_id'],))
        empruntes = cur.fetchone()['empruntes']
        
        if empruntes >= livre['nombre_exemplaires']:
            cur.close(); conn.close()
            return jsonify({'error': 'Aucun exemplaire disponible'}), 400
        
        date_retour = date.today() + timedelta(days=14)
        
        cur.execute('INSERT INTO emprunts (utilisateur_id, livre_id, date_emprunt, date_retour_prevue) VALUES (%s, %s, %s, %s) RETURNING *', (utilisateur_id, data['livre_id'], date.today(), date_retour))
        conn.commit()
        emprunt = cur.fetchone()
        cur.close(); conn.close()
        return jsonify(emprunt), 201
        
    except Exception as e:
        conn.rollback(); cur.close(); conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/api/emprunts/<int:id>/retour', methods=['PUT'])
def retourner(id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute('SELECT * FROM emprunts WHERE id = %s', (id,))
    emprunt = cur.fetchone()
    if emprunt is None:
        cur.close(); conn.close()
        return jsonify({'error': 'Emprunt non trouve'}), 404
    if emprunt['statut'] == 'Retourne':
        cur.close(); conn.close()
        return jsonify({'error': 'Livre deja retourne'}), 400
    cur.execute("UPDATE emprunts SET date_retour_effective = %s, statut = 'Retourné' WHERE id = %s RETURNING *", (date.today(), id))
    conn.commit()
    emprunt = cur.fetchone()
    cur.close(); conn.close()
    return jsonify(emprunt), 200

@app.route('/api/emprunts/utilisateur/<int:user_id>', methods=['GET'])
def historique_utilisateur(user_id):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute('SELECT e.*, l.titre, l.auteur, l.isbn, l.image_url FROM emprunts e JOIN livres l ON e.livre_id = l.id WHERE e.utilisateur_id = %s ORDER BY e.date_emprunt DESC', (user_id,))
    emprunts = cur.fetchall()
    cur.close(); conn.close()
    return jsonify(emprunts), 200

@app.route('/api/emprunts/retards', methods=['GET'])
def retards():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("UPDATE emprunts SET statut = 'En retard' WHERE statut = 'En cours' AND date_retour_prevue < %s", (date.today(),))
    conn.commit()
    cur.execute("SELECT e.*, l.titre, l.image_url, u.nom, u.prenom, u.email FROM emprunts e JOIN livres l ON e.livre_id = l.id JOIN utilisateurs u ON e.utilisateur_id = u.id WHERE e.statut = 'En retard' ORDER BY e.date_retour_prevue ASC")
    retards = cur.fetchall()
    cur.close(); conn.close()
    return jsonify(retards), 200

@app.route('/api/emprunts/export', methods=['GET'])
def export_csv():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT e.id, e.utilisateur_id, e.livre_id, e.date_emprunt, e.date_retour_prevue, e.date_retour_effective, e.statut, l.titre, l.auteur, l.categorie, u.type_utilisateur FROM emprunts e JOIN livres l ON e.livre_id = l.id JOIN utilisateurs u ON e.utilisateur_id = u.id ORDER BY e.date_emprunt DESC')
    rows = cur.fetchall()
    cur.close(); conn.close()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['id','utilisateur_id','livre_id','date_emprunt','date_retour_prevue','date_retour_effective','statut','titre','auteur','categorie','type_utilisateur'])
    writer.writerows(rows)
    return Response(output.getvalue(), mimetype='text/csv', headers={'Content-Disposition': 'attachment;filename=loans.csv'})

@app.route('/api/emprunts', methods=['GET'])
def get_all():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute('SELECT e.*, l.titre, l.auteur, l.image_url, u.nom, u.prenom, u.email FROM emprunts e JOIN livres l ON e.livre_id = l.id JOIN utilisateurs u ON e.utilisateur_id = u.id ORDER BY e.date_emprunt DESC')
    emprunts = cur.fetchall()
    cur.close(); conn.close()
    return jsonify(emprunts), 200

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'emprunts'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
