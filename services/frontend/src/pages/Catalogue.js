import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiSearch, FiFilter, FiBookmark } from 'react-icons/fi';
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
      setMessage('✅ Livre emprunté avec succès ! Vous avez 5 jours.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ ' + (err.message || 'Erreur'));
    }
  };

  return (
    <div className="container">
    <div>
      <h2><FiBookOpen /> Catalogue des Livres</h2>
      <p className="subtitle">{filtered.length} livres disponibles</p>
      {message && <div className={message.startsWith('✅') ? 'success' : 'error'}>{message}</div>}
      
      <div className="search-bar">
        <div className="input-group"><FiSearch size={18} /><input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <div className="input-group">
          <FiFilter size={18} />
          <select value={categorie} onChange={e => setCategorie(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'Toutes catégories' : c}</option>)}
          </select>
        </div>
      </div>

      <div className="books-grid">
        {filtered.map(livre => (
          <div key={livre.id} className="book-card-detail">
            <div className="book-cover-large">📖</div>
            <div className="book-info">
              <h3>{livre.titre}</h3>
              <p className="author">✍️ {livre.auteur}</p>
              <p className="isbn"><code>{livre.isbn}</code></p>
              <span className="badge-categorie">{livre.categorie || 'Général'}</span>
              <p className="exemplaires">{livre.nombre_exemplaires} exemplaire(s)</p>
              <button className="btn btn-primary btn-full" onClick={() => handleEmprunt(livre.id)}>
                <FiBookmark /> Emprunter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default Catalogue;