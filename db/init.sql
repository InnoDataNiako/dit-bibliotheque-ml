-- ============================================
-- Base de données : Bibliothèque DIT
-- ============================================

-- Création des types ENUM
CREATE TYPE type_utilisateur AS ENUM ('Etudiant', 'Professeur', 'Personnel');
CREATE TYPE statut_emprunt AS ENUM ('En cours', 'Retourné', 'En retard');

-- ============================================
-- Table : utilisateurs
-- ============================================
CREATE TABLE IF NOT EXISTS utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    type_utilisateur type_utilisateur NOT NULL,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table : livres
-- ============================================
CREATE TABLE IF NOT EXISTS livres (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    categorie VARCHAR(100),
    annee_publication INTEGER,
    nombre_exemplaires INTEGER DEFAULT 1,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- ============================================
-- Table : emprunts
-- ============================================
CREATE TABLE IF NOT EXISTS emprunts (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    livre_id INTEGER NOT NULL REFERENCES livres(id) ON DELETE CASCADE,
    date_emprunt DATE DEFAULT CURRENT_DATE,
    date_retour_prevue DATE NOT NULL,
    date_retour_effective DATE,
    statut statut_emprunt DEFAULT 'En cours'
);

-- Ajoute APRÈS les types ENUM existants :

-- Table users pour l'authentification
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'etudiant' CHECK (role IN ('admin', 'bibliothecaire', 'etudiant', 'professeur')),
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Ajout d'un admin par défaut (admin@dit.sn / admin123)
-- Le hash bcrypt de 'admin123' est pré-généré
INSERT INTO users (nom, prenom, email, password_hash, role) VALUES
('Admin', 'DIT', 'admin@dit.sn', '$2b$12$LJ3m4ys3GZfnYMz8kVsKaOTSxPxjWJzqZ1AX0RQTUxJWZKwPhwutu', 'admin'),
('Bibliothécaire', 'DIT', 'biblio@dit.sn', '$2b$12$LJ3m4ys3GZfnYMz8kVsKaOTSxPxjWJzqZ1AX0RQTUxJWZKwPhwutu', 'bibliothecaire');

-- ============================================
-- Index pour les recherches fréquentes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_livres_titre ON livres(titre);
CREATE INDEX IF NOT EXISTS idx_livres_auteur ON livres(auteur);
CREATE INDEX IF NOT EXISTS idx_livres_isbn ON livres(isbn);
CREATE INDEX IF NOT EXISTS idx_emprunts_utilisateur ON emprunts(utilisateur_id);
CREATE INDEX IF NOT EXISTS idx_emprunts_livre ON emprunts(livre_id);
CREATE INDEX IF NOT EXISTS idx_emprunts_statut ON emprunts(statut);

-- ============================================
-- Données de test
-- ============================================
INSERT INTO utilisateurs (nom, prenom, email, type_utilisateur) VALUES
('Diop', 'Moussa', 'moussa.diop@dit.sn', 'Etudiant'),
('Ndiaye', 'Aminata', 'aminata.ndiaye@dit.sn', 'Professeur'),
('Sow', 'Ibrahima', 'ibrahima.sow@dit.sn', 'Etudiant'),
('Fall', 'Fatou', 'fatou.fall@dit.sn', 'Personnel'),
('Ba', 'Oumar', 'oumar.ba@dit.sn', 'Etudiant');

INSERT INTO livres (titre, auteur, isbn, categorie, annee_publication, nombre_exemplaires) VALUES
('Python pour la Data Science', 'John Doe', '978-2-1234-5678-1', 'Informatique', 2023, 5),
('Introduction au Machine Learning', 'Jane Smith', '978-2-1234-5678-2', 'IA', 2022, 3),
('Big Data et Hadoop', 'Robert Martin', '978-2-1234-5678-3', 'Data Engineering', 2021, 2),
('Deep Learning avec TensorFlow', 'Sarah Connor', '978-2-1234-5678-4', 'IA', 2023, 4),
('Statistiques pour l''IA', 'Alan Turing', '978-2-1234-5678-5', 'Mathématiques', 2020, 3),
('Systèmes Distribués', 'Grace Hopper', '978-2-1234-5678-6', 'Informatique', 2021, 2),
('NLP avec Python', 'Ada Lovelace', '978-2-1234-5678-7', 'IA', 2023, 3),
('Bases de données avancées', 'Edgar Codd', '978-2-1234-5678-8', 'Informatique', 2019, 1);

INSERT INTO emprunts (utilisateur_id, livre_id, date_emprunt, date_retour_prevue, statut) VALUES
(1, 1, '2026-03-01', '2026-03-15', 'Retourné'),
(1, 3, '2026-03-20', '2026-04-03', 'Retourné'),
(2, 2, '2026-04-01', '2026-04-15', 'En cours'),
(3, 5, '2026-04-10', '2026-04-24', 'En retard'),
(4, 1, '2026-03-15', '2026-03-29', 'Retourné'),
(5, 4, '2026-04-05', '2026-04-19', 'En cours');
