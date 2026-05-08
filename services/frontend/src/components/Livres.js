import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8081/api/livres';

function Livres() {
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLivres();
  }, []);

  const fetchLivres = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Erreur lors du chargement');
      const data = await res.json();
      setLivres(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">⏳ Chargement des livres...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div>
      <h2>📖 Catalogue des Livres</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Auteur</th>
            <th>ISBN</th>
            <th>Catégorie</th>
            <th>Année</th>
            <th>Exemplaires</th>
          </tr>
        </thead>
        <tbody>
          {livres.map(livre => (
            <tr key={livre.id}>
              <td>{livre.id}</td>
              <td><strong>{livre.titre}</strong></td>
              <td>{livre.auteur}</td>
              <td>{livre.isbn}</td>
              <td>{livre.categorie || 'N/A'}</td>
              <td>{livre.annee_publication || 'N/A'}</td>
              <td>{livre.nombre_exemplaires}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Livres;