import React, { useState, useEffect } from 'react';
import { FiClipboard, FiRotateCcw, FiDownload, FiCheckCircle, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { api } from '../../services/api';

function AdminEmprunts() {
  const [emprunts, setEmprunts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadEmprunts(); }, []);

  const loadEmprunts = async () => {
    const data = await api.getEmprunts();
    setEmprunts(data);
    setLoading(false);
  };

  const handleRetour = async (id) => {
    await api.retourner(id);
    loadEmprunts();
  };

  const handleExport = async () => {
    const res = await fetch('http://localhost:8083/api/emprunts/export');
    const csv = await res.text();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'loans.csv'; a.click();
  };

  const getBadge = (statut) => {
    switch (statut) {
      case 'En cours': return <span className="badge badge-en-cours"><FiRefreshCw size={12} /> En cours</span>;
      case 'Retourné': return <span className="badge badge-retourne"><FiCheckCircle size={12} /> Retourné</span>;
      case 'En retard': return <span className="badge badge-en-retard"><FiAlertCircle size={12} /> En retard</span>;
      default: return statut;
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2><FiClipboard /> Gestion des Emprunts</h2>
          <p className="subtitle">{emprunts.length} emprunts au total</p>
        </div>
        <button className="btn btn-primary" onClick={handleExport}><FiDownload /> Exporter CSV</button>
      </div>
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
              <td>{getBadge(e.statut)}</td>
              <td>
                {e.statut !== 'Retourné' && (
                  <button className="btn-icon success" onClick={() => handleRetour(e.id)}><FiRotateCcw /></button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminEmprunts;
