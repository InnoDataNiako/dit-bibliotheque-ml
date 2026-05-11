import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiCalendar, FiHash, FiUser, FiTag, FiBookmark } from 'react-icons/fi';

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

  if (loading) return (
    <div className="loading">
      <FiBookOpen className="spinner" size={40} />
      <p>Chargement du catalogue...</p>
    </div>
  );
  
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div>
      <h2><FiBookOpen style={{marginRight:'10px'}} />Catalogue des Livres</h2>
      <p className="subtitle">{livres.length} livres disponibles</p>
      
      <table>
        <thead>
          <tr>
            <th><FiHash size={14} /> ID</th>
            <th><FiBookOpen size={14} /> Titre</th>
            <th><FiUser size={14} /> Auteur</th>
            <th><FiBookmark size={14} /> ISBN</th>
            <th><FiTag size={14} /> Catégorie</th>
            <th><FiCalendar size={14} /> Année</th>
            <th>Ex.</th>
          </tr>
        </thead>
        <tbody>
          {livres.map(livre => (
            <tr key={livre.id}>
              <td>{livre.id}</td>
              <td><strong>{livre.titre}</strong></td>
              <td>{livre.auteur}</td>
              <td><code>{livre.isbn}</code></td>
              <td>
                <span className="badge-categorie">
                  {livre.categorie || 'N/A'}
                </span>
              </td>
              <td>{livre.annee_publication || 'N/A'}</td>
              <td className="text-center">{livre.nombre_exemplaires}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Livres;