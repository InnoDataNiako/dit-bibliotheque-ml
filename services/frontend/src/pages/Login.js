import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FiBookOpen size={45} className="auth-icon" />
          <h1>BiblioPro DIT</h1>
          <p>Connectez-vous à votre bibliothèque numérique</p>
        </div>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group-auth">
            <FiMail size={18} /><input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group-auth">
            <FiLock size={18} /><input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-auth" disabled={loading}>
            <FiLogIn size={18} /> {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="auth-link">Pas encore de compte ? <Link to="/register">S'inscrire</Link></p>
        <p className="auth-hint">Admin : admin@dit.sn / admin123</p>
      </div>
    </div>
  );
}

export default Login;