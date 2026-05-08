import React, { useState, useEffect } from 'react';
import { FiClipboard, FiRotateCcw, FiCheckCircle, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function MesEmprunts() {
  const { user } = useAuth();
  const [emprunts, setEmprunts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadEmprunts(); }, []);

  const loadEmprunts = async () => {
    const all = await api.getEmprunts();
    setEmprunts(all.filter(e => e.utilisateur_id === user.id));
    setLoading(false);
  };

  const handleRetour = async (id) => {
    await api.retourner(id);
    loadEmprunts();
  };

  const getBadge = (statut) => {
    switch (statut) {
      case 'En cours': return <span className="badge badge-en-cours"><FiRefreshCw size={12} /> En cours</span>;
      case 'Retourné': return <span className="badge badge-retourne"><FiCheckCircle size={12} /> Retourné</span>;
      case 'En retard': return <span className="badge badge-en-retard"><FiAlertCircle size={12} /> En retard</span>;
      default: return statut;
    }
  };

  const getDelai = (dateRetour) => {
    const diff = Math.ceil((new Date(dateRetour) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return <span className="text-danger">En retard de {Math.abs(diff)} jours</span>;
    if (diff <= 2) return <span className="text-warning">À rendre dans {diff} jour(s) !</span>;
    return <span className="text-success">À rendre dans {diff} jours</span>;
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div>
      <h2><FiClipboard /> Mes Emprunts</h2>
      <p className="subtitle">{emprunts.length} emprunt(s)</p>
      {emprunts.length === 0 && <p>Aucun emprunt. <a href="/catalogue">Parcourir le catalogue</a></p>}
      
      <div className="emprunts-list">
        {emprunts.map(e => (
          <div key={e.id} className="card emprunt-card">
            <div className="emprunt-header">
              <h3>📖 {e.titre}</h3>
              {getBadge(e.statut)}
            </div>
            <p>✍️ {e.auteur}</p>
            <p>📅 Emprunté le {new Date(e.date_emprunt).toLocaleDateString('fr-FR')}</p>
            <p>⏳ Retour prévu le {new Date(e.date_retour_prevue).toLocaleDateString('fr-FR')}</p>
            <p>{getDelai(e.date_retour_prevue)}</p>
            {e.statut !== 'Retourné' && (
              <button className="btn btn-success" onClick={() => handleRetour(e.id)}>
                <FiRotateCcw /> Retourner ce livre
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MesEmprunts;