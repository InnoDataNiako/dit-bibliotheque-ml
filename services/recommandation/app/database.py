import pandas as pd
import os

def get_loans_data():
    """
    Récupère les données d'emprunts depuis PostgreSQL
    """
    try:
        import psycopg2
        
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            port=os.getenv('DB_PORT', '5432'),
            user=os.getenv('DB_USER', 'admin'),
            password=os.getenv('DB_PASSWORD', 'admin123'),
            database=os.getenv('DB_NAME', 'bibliotheque')
        )
        
        query = '''
            SELECT 
                e.id,
                e.utilisateur_id,
                e.livre_id,
                e.date_emprunt,
                e.date_retour_prevue,
                e.statut,
                l.titre,
                l.auteur,
                l.categorie,
                u.type_utilisateur
            FROM emprunts e
            JOIN livres l ON e.livre_id = l.id
            JOIN utilisateurs u ON e.utilisateur_id = u.id
        '''
        
        df = pd.read_sql_query(query, conn)
        conn.close()
        
        return df
    
    except Exception as e:
        print(f"Erreur connexion DB: {e}")
        # Fallback : utiliser le CSV local si dispo
        csv_path = os.getenv('DATA_PATH', '/app/data/loans.csv')
        if os.path.exists(csv_path):
            return pd.read_csv(csv_path)
        return pd.DataFrame()