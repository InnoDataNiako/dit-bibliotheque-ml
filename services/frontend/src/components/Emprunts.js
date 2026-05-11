import React, { useState, useEffect } from 'react';
import { FiClipboard, FiUser, FiBookOpen, FiCalendar, FiClock, FiCheckCircle, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

const API_URL = 'http://localhost:8083/api/emprunts';

function Emprunts() {
  const [emprunts, setEmprunts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmprunts();
  }, []);

  const fetchEmprunts = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Erreur lors du chargement');
      const data = await res.json();
      setEmprunts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatutInfo = (statut) => {
    switch (statut) {
      case 'En cours':
        return { icon: <FiRefreshCw size={14} />, className: 'badge badge-en-cours' };
      case 'Retourné':
        return { icon: <FiCheckCircle size={14} />, className: 'badge badge-retourne' };
      case 'En retard':
        return { icon: <FiAlertCircle size={14} />, className: 'badge badge-en-retard' };
      default:
        return { icon: <FiClock size={14} />, className: 'badge' };
    }
  };

  if (loading) return (
    <div className="loading">
      <FiClipboard className="spinner" size={40} />
      <p>Chargement de l'historique...</p>
    </div>
  );

  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div>
      <h2><FiClipboard style={{marginRight:'10px'}} />Historique des Emprunts</h2>
      <p className="subtitle">{emprunts.length} emprunts enregistrés</p>
      
      <table>
        <thead>
          <tr>
            <th><strong>#</strong></th>
            <th><FiUser size={14} /> Utilisateur</th>
            <th><FiBookOpen size={14} /> Livre</th>
            <th><FiCalendar size={14} /> Date Emprunt</th>
            <th><FiCalendar size={14} /> Retour Prévu</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {emprunts.map(e => {
            const statutInfo = getStatutInfo(e.statut);
            const estRetard = e.statut === 'En retard';
            
            return (
              <tr key={e.id} className={estRetard ? 'row-retard' : ''}>
                <td>{e.id}</td>
                <td>
                  <div className="user-cell">
                    <FiUser size={16} />
                    <span><strong>{e.prenom} {e.nom}</strong></span>
                  </div>
                </td>
                <td>
                  <div>
                    <strong>{e.titre}</strong>
                    <br/>
                    <small style={{color:'#888'}}>✍️ {e.auteur}</small>
                  </div>
                </td>
                <td>{new Date(e.date_emprunt).toLocaleDateString('fr-FR')}</td>
                <td>{new Date(e.date_retour_prevue).toLocaleDateString('fr-FR')}</td>
                <td>
                  <span className={statutInfo.className}>
                    {statutInfo.icon} {e.statut}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Emprunts;