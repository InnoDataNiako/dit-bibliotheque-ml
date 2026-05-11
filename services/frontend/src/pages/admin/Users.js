import React, { useState, useEffect } from 'react';
import { FiUsers, FiUser, FiMail, FiShield, FiTrash2 } from 'react-icons/fi';
import { api } from '../../services/api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const getBadge = (role) => {
    const map = { admin: 'badge badge-en-retard', bibliothecaire: 'badge badge-en-cours', etudiant: 'badge badge-etudiant', professeur: 'badge badge-professeur' };
    return map[role] || 'badge';
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2><FiUsers /> Utilisateurs</h2>
          <p className="subtitle">{users.length} utilisateurs enregistrés</p>
        </div>
      </div>
      <table>
        <thead>
          <tr><th>#</th><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td><strong>{u.prenom} {u.nom}</strong></td>
              <td><FiMail size={12} /> {u.email}</td>
              <td><span className={getBadge(u.role)}><FiShield size={12} /> {u.role}</span></td>
              <td>{u.is_active ? '✅ Actif' : '❌ Inactif'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
