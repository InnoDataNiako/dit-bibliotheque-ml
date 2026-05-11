import React, { useState, useEffect } from 'react';
import { FiUsers, FiUser, FiMail, FiCalendar, FiHash, FiUserCheck, FiBriefcase, FiBook } from 'react-icons/fi';

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

  const getTypeInfo = (type) => {
    switch (type) {
      case 'Etudiant':
        return { icon: <FiBook size={14} />, className: 'badge badge-etudiant' };
      case 'Professeur':
        return { icon: <FiUserCheck size={14} />, className: 'badge badge-professeur' };
      case 'Personnel':
        return { icon: <FiBriefcase size={14} />, className: 'badge badge-personnel' };
      default:
        return { icon: <FiUser size={14} />, className: 'badge' };
    }
  };

  if (loading) return (
    <div className="loading">
      <FiUsers className="spinner" size={40} />
      <p>Chargement des utilisateurs...</p>
    </div>
  );

  if (error) return <div className="error">❌ {error}</div>;

  const stats = {
    total: utilisateurs.length,
    etudiants: utilisateurs.filter(u => u.type_utilisateur === 'Etudiant').length,
    professeurs: utilisateurs.filter(u => u.type_utilisateur === 'Professeur').length,
    personnel: utilisateurs.filter(u => u.type_utilisateur === 'Personnel').length,
  };

  return (
    <div>
      <h2><FiUsers style={{marginRight:'10px'}} />Utilisateurs</h2>
      <p className="subtitle">{stats.total} utilisateurs enregistrés</p>
      
      {/* Mini stats */}
      <div className="stats-row">
        <div className="stat-card student">
          <FiBook size={24} />
          <div>
            <strong>{stats.etudiants}</strong>
            <span>Étudiants</span>
          </div>
        </div>
        <div className="stat-card professor">
          <FiUserCheck size={24} />
          <div>
            <strong>{stats.professeurs}</strong>
            <span>Professeurs</span>
          </div>
        </div>
        <div className="stat-card staff">
          <FiBriefcase size={24} />
          <div>
            <strong>{stats.personnel}</strong>
            <span>Personnel</span>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th><FiHash size={14} /> ID</th>
            <th><FiUser size={14} /> Nom</th>
            <th><FiUser size={14} /> Prénom</th>
            <th><FiMail size={14} /> Email</th>
            <th>Type</th>
            <th><FiCalendar size={14} /> Inscription</th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map(user => {
            const typeInfo = getTypeInfo(user.type_utilisateur);
            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td><strong>{user.nom}</strong></td>
                <td>{user.prenom}</td>
                <td>
                  <a href={`mailto:${user.email}`} className="email-link">
                    <FiMail size={12} /> {user.email}
                  </a>
                </td>
                <td>
                  <span className={typeInfo.className}>
                    {typeInfo.icon} {user.type_utilisateur}
                  </span>
                </td>
                <td>{new Date(user.date_inscription).toLocaleDateString('fr-FR', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Utilisateurs;