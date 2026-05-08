import React, { useState, useEffect } from 'react';

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

  const getBadgeClass = (statut) => {
    switch (statut) {
      case 'En cours': return 'badge badge-en-cours';
      case 'Retourné': return 'badge badge-retourne';
      case 'En retard': return 'badge badge-en-retard';
      default: return 'badge';
    }
  };

  if (loading) return <div className="loading">⏳ Chargement des emprunts...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div>
      <h2>📋 Historique des Emprunts</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Utilisateur</th>
            <th>Livre</th>
            <th>Date Emprunt</th>
            <th>Retour Prévu</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {emprunts.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.nom} {e.prenom}</td>
              <td><strong>{e.titre}</strong><br/><small style={{color:'#666'}}>{e.auteur}</small></td>
              <td>{new Date(e.date_emprunt).toLocaleDateString('fr-FR')}</td>
              <td>{new Date(e.date_retour_prevue).toLocaleDateString('fr-FR')}</td>
              <td><span className={getBadgeClass(e.statut)}>{e.statut}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Emprunts;