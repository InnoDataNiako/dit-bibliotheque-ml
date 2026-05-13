import React, { useState } from 'react';
import { FiTrendingUp, FiStar, FiUser, FiZap, FiAward, FiBookOpen, FiPlay, FiSearch } from 'react-icons/fi';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Recommandations() {
  const { user, isAdmin } = useAuth();
  const [userId, setUserId] = useState(user?.id || 1);
  const [recommandations, setRecommandations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trainMsg, setTrainMsg] = useState(null);

  const fetchRecommandations = async () => {
    try {
      setLoading(true); setError(null);
      const data = await api.getRecommandations(userId);
      setRecommandations(data);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleTrain = async () => {
    try {
      setTrainMsg('Entrainement en cours...');
      const result = await api.entrainer();
      setTrainMsg(`Modele entraine ! RMSE: ${result.metriques.rmse}, MAE: ${result.metriques.mae}`);
    } catch (err) { setTrainMsg(`Erreur: ${err.message}`); }
  };

  return (
    <div>
      <div className="page-header">
        <h2><FiTrendingUp /> Recommandations IA</h2>
        <button className="btn btn-primary" onClick={handleTrain}><FiPlay /> Entrainer le modele</button>
      </div>
      <p className="subtitle">Recommandations personnalisees par Machine Learning</p>

      {trainMsg && <div className={trainMsg.startsWith('Modele') ? 'success' : 'error'}>{trainMsg}</div>}

      {isAdmin ? (
        <div className="reco-input">
          <div className="input-group">
            <FiUser size={18} />
            <input type="number" value={userId} onChange={(e) => setUserId(e.target.value)} min="1" placeholder="ID Utilisateur" />
          </div>
          <button className="btn btn-primary" onClick={fetchRecommandations}><FiSearch /> Recommander</button>
        </div>
      ) : (
        <div className="reco-input">
          <p style={{fontSize:16}}><FiUser size={20} /> Bonjour <strong>{user?.prenom} {user?.nom}</strong>, decouvrez les livres que notre IA a selectionnes specialement pour vous ! Cliquez sur me recommander</p>
          <button className="btn btn-primary" onClick={() => { setUserId(user?.id); fetchRecommandations(); }}>
            <FiTrendingUp /> Me recommander
          </button>
        </div>
      )}

      {loading && <div className="loading"><FiZap className="spinner" size={40} /><p>Analyse IA...</p></div>}
      {error && <div className="error">{error}</div>}

      {recommandations && (
        <div>
          <div className="reco-header">
            <div className="reco-user-info"><FiUser size={18} /> Utilisateur <strong>#{recommandations.user_id}</strong></div>
            <div className="reco-count"><FiBookOpen size={18} /> <strong>{recommandations.nombre_recommandations}</strong> livres</div>
          </div>
          <div className="reco-grid">
            {recommandations.recommandations.map((rec, i) => (
              <div className="card reco-card" key={i}>
                <div className="card-rank">{i === 0 ? <FiAward size={24} color="#f39c12" /> : `#${i+1}`}</div>
                <div className="card-content">
                  <h3>{rec.titre}</h3>
                  <p className="meta">{rec.auteur} - {rec.categorie}</p>
                  {rec.score !== undefined && <p className="score"><FiStar /> {typeof rec.score === 'number' ? rec.score.toFixed(4) : rec.score}</p>}
                  {rec.type && <span className="badge badge-cold-start"><FiZap size={10} /> {rec.type}</span>}
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
