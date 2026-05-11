import React, { useState, useEffect } from 'react';
import { FiUsers, FiPlus, FiTrash2, FiMail, FiUserCheck, FiX, FiSave } from 'react-icons/fi';
import { api } from '../services/api';

function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', type_utilisateur: 'Etudiant' });

  useEffect(() => { loadUtilisateurs(); }, []);

  const loadUtilisateurs = async () => {
    try {
      setLoading(true);
      const data = await api.getUtilisateurs();
      setUtilisateurs(data);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addUtilisateur(form);
      setShowModal(false);
      setForm({ nom: '', prenom: '', email: '', type_utilisateur: 'Etudiant' });
      loadUtilisateurs();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id, nom) => {
    if (window.confirm(`Supprimer l'utilisateur "${nom}" ?`)) {
      await api.deleteUtilisateur(id);
      loadUtilisateurs();
    }
  };

  const getBadge = (type) => {
    const map = { Etudiant: 'badge-etudiant', Professeur: 'badge-professeur', Personnel: 'badge-personnel' };
    return `badge ${map[type] || ''}`;
  };

  const stats = {
    total: utilisateurs.length,
    etudiants: utilisateurs.filter(u => u.type_utilisateur === 'Etudiant').length,
    professeurs: utilisateurs.filter(u => u.type_utilisateur === 'Professeur').length,
    personnel: utilisateurs.filter(u => u.type_utilisateur === 'Personnel').length,
  };

  if (loading) return <div className="loading"><FiUsers className="spinner" size={40} /><p>Chargement...</p></div>;

  return (
    <div>
      <div className="page-header">
        <h2><FiUsers /> Utilisateurs</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><FiPlus /> Ajouter un utilisateur</button>
      </div>
      <p className="subtitle">{stats.total} utilisateurs enregistrés</p>

      <div className="stats-row">
        <div className="stat-card student"><FiUsers size={24} /><div><strong>{stats.etudiants}</strong><span>Étudiants</span></div></div>
        <div className="stat-card professor"><FiUserCheck size={24} /><div><strong>{stats.professeurs}</strong><span>Professeurs</span></div></div>
        <div className="stat-card staff"><FiUserCheck size={24} /><div><strong>{stats.personnel}</strong><span>Personnel</span></div></div>
      </div>

      {error && <div className="error">{error}</div>}

      <table>
        <thead>
          <tr><th>#</th><th>Nom</th><th>Prénom</th><th>Email</th><th>Type</th><th>Inscription</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {utilisateurs.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td><strong>{user.nom}</strong></td>
              <td>{user.prenom}</td>
              <td><a href={`mailto:${user.email}`} className="email-link"><FiMail size={12} /> {user.email}</a></td>
              <td><span className={getBadge(user.type_utilisateur)}>{user.type_utilisateur}</span></td>
              <td>{new Date(user.date_inscription).toLocaleDateString('fr-FR')}</td>
              <td><button className="btn-icon delete" onClick={() => handleDelete(user.id, user.nom)}><FiTrash2 /></button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiPlus /> Ajouter un utilisateur</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <input type="text" placeholder="Nom *" value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} required />
                <input type="text" placeholder="Prénom *" value={form.prenom} onChange={(e) => setForm({...form, prenom: e.target.value})} required />
                <input type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
                <select value={form.type_utilisateur} onChange={(e) => setForm({...form, type_utilisateur: e.target.value})}>
                  <option value="Etudiant">Étudiant</option>
                  <option value="Professeur">Professeur</option>
                  <option value="Personnel">Personnel</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-full"><FiSave /> Ajouter</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Utilisateurs;