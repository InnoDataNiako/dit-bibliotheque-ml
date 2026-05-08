import React, { useState } from 'react';

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

  return (
    <div>
      <h2>🔮 Recommandations Personnalisées</h2>
      
      <div className="reco-input">
        <label>ID Utilisateur :</label>
        <input 
          type="number" 
          value={userId} 
          onChange={(e) => setUserId(e.target.value)}
          min="1"
        />
        <button className="btn btn-primary" onClick={fetchRecommandations}>
          🔍 Obtenir Recommandations
        </button>
      </div>

      {loading && <div className="loading">⏳ Analyse des emprunts...</div>}
      {error && <div className="error">❌ {error}</div>}

      {recommandations && (
        <div>
          <p style={{marginBottom: '15px', color: '#666'}}>
            <strong>{recommandations.nombre_recommandations}</strong> livres recommandés 
            pour l'utilisateur <strong>#{recommandations.user_id}</strong>
          </p>
          
          <div className="reco-grid">
            {recommandations.recommandations.map((rec, index) => (
              <div className="card" key={index}>
                <h3>{rec.titre}</h3>
                <p className="meta">✍️ {rec.auteur}</p>
                <p className="meta">📂 {rec.categorie}</p>
                {rec.score !== undefined && (
                  <p className="score">⭐ Score : {typeof rec.score === 'number' ? rec.score.toFixed(4) : rec.score}</p>
                )}
                {rec.type && <span className="badge badge-etudiant">{rec.type}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Recommandations;