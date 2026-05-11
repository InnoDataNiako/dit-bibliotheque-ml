import React, { useState } from 'react';
import { FiTrendingUp, FiStar, FiUser, FiSearch, FiBookOpen, FiZap, FiAward } from 'react-icons/fi';

const API_URL = 'http://localhost:8000/recommandations';

function Recommandations() {
  const [userId, setUserId] = useState(1);
  const [recommandations, setRecommandations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecommandations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/${userId}`);
      if (!res.ok) throw new Error('Erreur lors du chargement des recommandations');
      const data = await res.json();
      setRecommandations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchRecommandations();
  };

  return (
    <div>
      <h2><FiTrendingUp style={{marginRight:'10px'}} />Recommandations Personnalisées</h2>
      <p className="subtitle">Découvrez des livres basés sur votre historique d'emprunts</p>
      
      <div className="reco-input">
        <div className="input-group">
          <FiUser size={20} />
          <input 
            type="number" 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)}
            onKeyPress={handleKeyPress}
            min="1"
            placeholder="ID Utilisateur"
          />
        </div>
        <button className="btn btn-primary" onClick={fetchRecommandations}>
          <FiSearch size={16} /> Obtenir Recommandations
        </button>
      </div>

      {loading && (
        <div className="loading">
          <FiZap className="spinner" size={40} />
          <p>Analyse de vos emprunts...</p>
          <small>Notre IA sélectionne les meilleurs livres pour vous</small>
        </div>
      )}
      
      {error && (
        <div className="error">
          <FiTrendingUp size={18} /> {error}
        </div>
      )}

      {recommandations && (
        <div>
          <div className="reco-header">
            <div className="reco-user-info">
              <FiUser size={20} />
              <span>Utilisateur <strong>#{recommandations.user_id}</strong></span>
            </div>
            <div className="reco-count">
              <FiBookOpen size={20} />
              <span><strong>{recommandations.nombre_recommandations}</strong> livres recommandés</span>
            </div>
          </div>
          
          <div className="reco-grid">
            {recommandations.recommandations.map((rec, index) => (
              <div className="card reco-card" key={index}>
                <div className="card-rank">
                  {index === 0 ? <FiAward size={24} color="#ff6f00" /> : `#${index + 1}`}
                </div>
                <div className="card-content">
                  <h3><FiBookOpen size={16} /> {rec.titre}</h3>
                  <p className="meta">✍️ {rec.auteur}</p>
                  <p className="meta">📂 {rec.categorie}</p>
                  {rec.score !== undefined && (
                    <p className="score">
                      <FiStar size={16} /> Score : {typeof rec.score === 'number' ? rec.score.toFixed(4) : rec.score}
                    </p>
                  )}
                  {rec.type && (
                    <span className="badge badge-cold-start">
                      <FiZap size={12} /> {rec.type}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Recommandations;