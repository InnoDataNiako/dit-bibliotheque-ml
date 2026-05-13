import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiSearch, FiFilter, FiBookmark, FiStar, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function Catalogue() {
  const { user } = useAuth();
  const [livres, setLivres] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [categorie, setCategorie] = useState('all');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getLivres().then(data => {
      setLivres(data);
      setFiltered(data);
    });
  }, []);

  useEffect(() => {
    let result = livres;
    if (search) result = result.filter(l => l.titre.toLowerCase().includes(search.toLowerCase()) || l.auteur.toLowerCase().includes(search.toLowerCase()));
    if (categorie !== 'all') result = result.filter(l => l.categorie === categorie);
    setFiltered(result);
  }, [search, categorie, livres]);

  const categories = ['all', ...new Set(livres.map(l => l.categorie).filter(Boolean))];

  const handleEmprunt = async (livreId) => {
    try {
      await api.emprunter(user.id, livreId);
      setMessage('Livre emprunte avec succes ! Vous avez 5 jours.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Erreur : ' + (err.message || 'Impossible demprunter'));
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2><FiBookOpen /> Catalogue des Livres</h2>
      </div>
      <p className="subtitle">{filtered.length} livres disponibles</p>
      
      {message && <div className={message.startsWith('Erreur') ? 'error' : 'success'}>{message}</div>}
      
      <div className="search-bar">
        <div className="input-group">
          <FiSearch size={18} />
          <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="input-group">
          <FiFilter size={18} />
          <select value={categorie} onChange={e => setCategorie(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'Toutes categories' : c}</option>)}
          </select>
        </div>
      </div>

      <div className="books-grid-pro">
        {filtered.map(livre => (
          <div key={livre.id} className="book-card-pro">
            {livre.is_new && (
              <span className="book-badge-new"><FiStar size={11} /> Nouveau</span>
            )}
            <div className="book-cover-pro">
              {livre.image_url ? (
                <img src={livre.image_url} alt={livre.titre} />
              ) : (
                <div className="book-cover-placeholder">
                  <FiBookOpen size={40} />
                </div>
              )}
              <span className="book-cat-badge">{livre.categorie || 'General'}</span>
            </div>
            <div className="book-body-pro">
              <h3 className="book-title-pro">{livre.titre}</h3>
              <p className="book-author-pro"><FiUser size={12} /> {livre.auteur}</p>
              <p className="book-isbn-pro">{livre.isbn}</p>
              <p className="book-stock-pro">{livre.nombre_exemplaires} exemplaire(s)</p>
              {user && (
                <button className="btn-emprunt-pro" onClick={() => handleEmprunt(livre.id)}>
                  <FiBookmark size={15} /> Emprunter
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalogue;
