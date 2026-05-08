import React, { useState, useEffect } from 'react';
import { FiClipboard, FiDownload, FiRotateCcw, FiCheckCircle, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { api } from '../services/api';

function Emprunts() {
  const [emprunts, setEmprunts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadEmprunts(); }, []);

  const loadEmprunts = async () => {
    try {
      setLoading(true);
      const data = await api.getEmprunts();
      setEmprunts(data);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleRetour = async (id) => {
    if (window.confirm('Confirmer le retour de ce livre ?')) {
      await api.retournerLivre(id);
      loadEmprunts();
    }
  };

  const handleExport = async () => {
    const csv = await api.exportCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'loans.csv'; a.click();
  };

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'En cours': return <span className="badge badge-en-cours"><FiRefreshCw size={12} /> En cours</span>;
      case 'Retourné': return <span className="badge badge-retourne"><FiCheckCircle size={12} /> Retourné</span>;
      case 'En retard': return <span className="badge badge-en-retard"><FiAlertCircle size={12} /> En retard</span>;
      default: return <span className="badge">{statut}</span>;
    }
  };

  const actifs = emprunts.filter(e => e.statut !== 'Retourné').length;

  if (loading) return <div className="loading"><FiClipboard className="spinner" size={40} /><p>Chargement...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h2><FiClipboard /> Historique des Emprunts</h2>
        <button className="btn btn-primary" onClick={handleExport}><FiDownload /> Exporter CSV</button>
      </div>
      <p className="subtitle">{emprunts.length} emprunts • {actifs} actifs</p>
      {error && <div className="error">{error}</div>}

      <table>
        <thead>
          <tr><th>#</th><th>Utilisateur</th><th>Livre</th><th>Emprunt</th><th>Retour prévu</th><th>Statut</th><th>Action</th></tr>
        </thead>
        <tbody>
          {emprunts.map(e => (
            <tr key={e.id} className={e.statut === 'En retard' ? 'row-retard' : ''}>
              <td>{e.id}</td>
              <td>{e.prenom} {e.nom}</td>
              <td><strong>{e.titre}</strong><br/><small>{e.auteur}</small></td>
              <td>{new Date(e.date_emprunt).toLocaleDateString('fr-FR')}</td>
              <td>{new Date(e.date_retour_prevue).toLocaleDateString('fr-FR')}</td>
              <td>{getStatutBadge(e.statut)}</td>
              <td>
                {e.statut !== 'Retourné' && (
                  <button className="btn-icon success" onClick={() => handleRetour(e.id)} title="Retourner"><FiRotateCcw /></button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Emprunts;