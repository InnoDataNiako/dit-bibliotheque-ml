import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiClock, FiCalendar, FiRotateCcw, FiInbox } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

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

  const getJoursRestants = (dateRetour) => {
    const diff = Math.ceil((new Date(dateRetour) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getStatutClass = (statut, dateRetour) => {
    if (statut === 'Retourné') return 'retourne';
    if (statut === 'En retard') return 'retard';
    const jours = getJoursRestants(dateRetour);
    if (jours < 0) return 'retard';
    return 'en-cours';
  };

  const enCours = emprunts.filter(e => e.statut !== 'Retourné').length;
  const enRetard = emprunts.filter(e => e.statut === 'En retard' || (e.statut === 'En cours' && getJoursRestants(e.date_retour_prevue) < 0)).length;

  if (loading) return <div className="loading"><FiBookOpen className="spinner" size={40} /><p>Chargement...</p></div>;

  return (
    <div className="emprunts-container">
      <div className="emprunts-header">
        <h2><FiBookOpen /> Mes Emprunts</h2>
      </div>

      <div className="emprunts-stats">
        <div className="emprunt-stat-mini">
          <strong>{emprunts.length}</strong>
          <span>Total</span>
        </div>
        <div className="emprunt-stat-mini">
          <strong>{enCours}</strong>
          <span>En cours</span>
        </div>
        <div className="emprunt-stat-mini">
          <strong style={{color:'#dc2626'}}>{enRetard}</strong>
          <span>En retard</span>
        </div>
      </div>

      {emprunts.length === 0 ? (
        <div className="empty-emprunts">
          <FiInbox size={50} />
          <h3>Aucun emprunt</h3>
          <p>Vous n'avez pas encore emprunté de livre.</p>
          <Link to="/catalogue" className="btn btn-primary">
            <FiBookOpen /> Parcourir le catalogue
          </Link>
        </div>
      ) : (
        emprunts.map(e => {
          const statutClass = getStatutClass(e.statut, e.date_retour_prevue);
          const jours = getJoursRestants(e.date_retour_prevue);
          
          return (
            <div key={e.id} className={`emprunt-card ${statutClass}`}>
              <div className="emprunt-book-info">
                <div className="emprunt-book-cover">
                  <FiBookOpen size={28} />
                </div>
                <div className="emprunt-book-details">
                  <h3>{e.titre}</h3>
                  <p className="author">✍️ {e.auteur}</p>
                  <span className={`emprunt-statut-badge ${statutClass === 'retard' ? 'retard' : statutClass === 'retourne' ? 'retourne' : 'en-cours'}`}>
                    {statutClass === 'retard' ? '🔴 En retard' : statutClass === 'retourne' ? '✅ Retourné' : '🟡 En cours'}
                  </span>
                </div>
              </div>

              <div className="emprunt-dates">
                <div className="emprunt-date">
                  <span className="emprunt-date-label"><FiCalendar size={12} /> Emprunté le</span>
                  <span className="emprunt-date-value">{new Date(e.date_emprunt).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="emprunt-date">
                  <span className="emprunt-date-label"><FiClock size={12} /> Retour prévu</span>
                  <span className="emprunt-date-value">{new Date(e.date_retour_prevue).toLocaleDateString('fr-FR')}</span>
                  {e.statut !== 'Retourné' && (
                    <span className={`jours-restants ${jours < 0 ? 'urgent' : jours <= 2 ? 'warning' : 'ok'}`}>
                      {jours < 0 ? `⚠️ ${Math.abs(jours)}j de retard` : jours === 0 ? "Aujourd'hui !" : `${jours}j restants`}
                    </span>
                  )}
                </div>
              </div>

              {e.statut !== 'Retourné' && (
                <div className="emprunt-action">
                  <button className="btn-retour" onClick={() => handleRetour(e.id)}>
                    <FiRotateCcw /> Retourner
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default MesEmprunts;
