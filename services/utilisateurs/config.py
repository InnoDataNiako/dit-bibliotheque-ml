import os

class Config:
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '5432')
    DB_USER = os.getenv('DB_USER', 'admin')
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'admin123')
    DB_NAME = os.getenv('DB_NAME', 'bibliotheque')
    
    @classmethod
    def get_db_connection(cls):
        import psycopg2
        return psycopg2.connect(
            host=cls.DB_HOST,
            port=cls.DB_PORT,
            user=cls.DB_USER,
            password=cls.DB_PASSWORD,
            database=cls.DB_NAME
        )