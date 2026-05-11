import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBookOpen, FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '', role: 'etudiant' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FiBookOpen size={45} className="auth-icon" />
          <h1>Créer un compte</h1>
          <p>Rejoignez BiblioPro DIT</p>
        </div>
        {success && <div className="success">✅ Compte créé ! Redirection...</div>}
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group-auth"><FiUser size={18} /><input placeholder="Nom *" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required /></div>
          <div className="input-group-auth"><FiUser size={18} /><input placeholder="Prénom *" value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} required /></div>
          <div className="input-group-auth"><FiMail size={18} /><input type="email" placeholder="Email *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
          <div className="input-group-auth"><FiLock size={18} /><input type="password" placeholder="Mot de passe *" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
          <div className="input-group-auth">
            <FiUser size={18} />
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="etudiant">Étudiant</option>
              <option value="professeur">Professeur</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-auth" disabled={loading}>
            <FiUserPlus size={18} /> {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>
        <p className="auth-link">Déjà un compte ? <Link to="/login">Se connecter</Link></p>
      </div>
    </div>
  );
}

export default Register;