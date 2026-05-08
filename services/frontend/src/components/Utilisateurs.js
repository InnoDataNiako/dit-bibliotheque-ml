import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8082/api/utilisateurs';

function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Erreur lors du chargement');
      const data = await res.json();
      setUtilisateurs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case 'Etudiant': return 'badge badge-etudiant';
      case 'Professeur': return 'badge badge-professeur';
      case 'Personnel': return 'badge badge-personnel';
      default: return 'badge';
    }
  };

  if (loading) return <div className="loading">⏳ Chargement des utilisateurs...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div>
      <h2>👥 Utilisateurs</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Type</th>
            <th>Inscription</th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td><strong>{user.nom}</strong></td>
              <td>{user.prenom}</td>
              <td>{user.email}</td>
              <td><span className={getBadgeClass(user.type_utilisateur)}>{user.type_utilisateur}</span></td>
              <td>{new Date(user.date_inscription).toLocaleDateString('fr-FR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Utilisateurs;