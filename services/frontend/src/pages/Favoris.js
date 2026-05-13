import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiBookOpen, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function Favoris() {
  const { user } = useAuth();
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadFavoris();
  }, [user]);

  const loadFavoris = async () => {
    try {
      const data = await api.getWishlist(user.id);
      setFavoris(data);
    } catch (err) {
      console.error('Favoris non disponibles');
    }
    setLoading(false);
  };

  const handleRemove = async (livreId) => {
    await api.toggleWishlist(user.id, livreId);
    loadFavoris();
  };

  if (loading) return <div className="loading"><FiHeart className="spinner" size={40} /><p>Chargement...</p></div>;

  return (
    <div className="container">
      <div className="page-header">
        <h2><FiHeart /> Mes Favoris</h2>
      </div>
      <p className="subtitle">{favoris.length} livre(s) en favoris</p>

      {favoris.length === 0 ? (
        <div className="empty-emprunts">
          <FiHeart size={50} />
          <h3>Aucun favori</h3>
          <p>Ajoutez des livres a vos favoris pour les retrouver facilement.</p>
          <Link to="/catalogue" className="btn btn-primary">
            <FiBookOpen /> Parcourir le catalogue
          </Link>
        </div>
      ) : (
        <div className="books-grid-pro">
          {favoris.map(fav => (
            <div key={fav.id} className="book-card-pro">
              <div className="book-cover-pro">
                {fav.image_url ? (
                  <img src={fav.image_url} alt={fav.titre} />
                ) : (
                  <div className="book-cover-placeholder">
                    <FiBookOpen size={40} />
                  </div>
                )}
              </div>
              <div className="book-body-pro">
                <h3 className="book-title-pro">{fav.titre}</h3>
                <p className="book-author-pro">{fav.auteur}</p>
                <p className="book-isbn-pro">{fav.isbn}</p>
                <span className="badge-categorie">{fav.categorie || 'General'}</span>
                <button className="btn-emprunt-pro" onClick={() => handleRemove(fav.livre_id)} style={{marginTop:'10px', background:'#666'}}>
                  <FiTrash2 size={14} /> Retirer des favoris
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favoris;
