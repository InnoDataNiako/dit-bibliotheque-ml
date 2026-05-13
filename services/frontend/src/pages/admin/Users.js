import React, { useState, useEffect } from 'react';
import { FiUsers, FiUser, FiMail, FiShield, FiTrash2, FiEdit3, FiX, FiSave } from 'react-icons/fi';
import { api } from '../../services/api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', role: 'etudiant' });

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {}
    setLoading(false);
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({ nom: user.nom, prenom: user.prenom, email: user.email, role: user.role });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API pour modifier (à ajouter si besoin)
    setShowModal(false);
    loadUsers();
  };

  const getBadge = (role) => {
    const map = { admin: 'badge badge-en-retard', bibliothecaire: 'badge badge-en-cours', etudiant: 'badge badge-etudiant', professeur: 'badge badge-professeur' };
    return map[role] || 'badge';
  };

  if (loading) return <div className="loading"><FiUsers className="spinner" size={40} /><p>Chargement...</p></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2><FiUsers /> Gestion des Utilisateurs</h2>
          <p className="subtitle">{users.length} utilisateurs</p>
        </div>
      </div>
      <table>
        <thead><tr><th>#</th><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td><strong>{u.prenom} {u.nom}</strong></td>
              <td><FiMail size={12} /> {u.email}</td>
              <td><span className={getBadge(u.role)}><FiShield size={12} /> {u.role}</span></td>
              <td>{u.is_active ? 'Actif' : 'Inactif'}</td>
              <td>
                <button className="btn-icon edit" onClick={() => openEdit(u)}><FiEdit3 /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiEdit3 /> Modifier {editing?.prenom}</h3>
              <button onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <input placeholder="Nom" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} />
                <input placeholder="Prenom" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} />
                <input placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="etudiant">Etudiant</option>
                  <option value="professeur">Professeur</option>
                  <option value="bibliothecaire">Bibliothecaire</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-full"><FiSave /> Enregistrer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
