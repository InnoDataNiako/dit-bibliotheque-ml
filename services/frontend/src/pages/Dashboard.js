import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiUsers, FiClipboard, FiAlertCircle, FiTrendingUp, FiPlus, FiList, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({ livres: 0, users: 0, emprunts: 0, retards: 0 });
  const [mesEmprunts, setMesEmprunts] = useState([]);
  const [recentLivres, setRecentLivres] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [livres, emprunts] = await Promise.all([api.getLivres(), api.getEmprunts()]);
      setStats({
        livres: livres.length,
        emprunts: emprunts.length,
        retards: emprunts.filter(e => e.statut === 'En retard').length,
      });
      setRecentLivres(livres.slice(0, 6));
      
      if (!isAdmin) {
        const mesEmps = emprunts.filter(e => e.utilisateur_id === user?.id);
        setMesEmprunts(mesEmps);
      }
    } catch (err) { console.error(err); }
  };

  if (isAdmin) {
    return (
      <div>
        <h2><FiTrendingUp /> Tableau de Bord Admin</h2>
        <p className="subtitle">Gérez votre bibliothèque</p>
        <div className="stats-grid">
          <Link to="/admin/livres" className="stat-card-dash" style={{borderTopColor:'#667eea'}}>
            <div className="stat-icon" style={{color:'#667eea'}}><FiBookOpen size={28} /></div>
            <div className="stat-info"><strong>{stats.livres}</strong><span>Livres</span></div>
          </Link>
          <Link to="/admin/users" className="stat-card-dash" style={{borderTopColor:'#2ecc71'}}>
            <div className="stat-icon" style={{color:'#2ecc71'}}><FiUsers size={28} /></div>
            <div className="stat-info"><strong>{stats.users || '—'}</strong><span>Utilisateurs</span></div>
          </Link>
          <Link to="/admin/emprunts" className="stat-card-dash" style={{borderTopColor:'#f39c12'}}>
            <div className="stat-icon" style={{color:'#f39c12'}}><FiClipboard size={28} /></div>
            <div className="stat-info"><strong>{stats.emprunts}</strong><span>Emprunts</span></div>
          </Link>
          <div className="stat-card-dash" style={{borderTopColor:'#e74c3c'}}>
            <div className="stat-icon" style={{color:'#e74c3c'}}><FiAlertCircle size={28} /></div>
            <div className="stat-info"><strong>{stats.retards}</strong><span>Retards</span></div>
          </div>
        </div>
        <div className="quick-actions">
          <Link to="/admin/livres" className="btn btn-primary"><FiPlus /> Ajouter un livre</Link>
          <Link to="/admin/emprunts" className="btn btn-primary"><FiList /> Voir les emprunts</Link>
        </div>
      </div>
    );
  }

  // Dashboard Étudiant/Professeur
  return (
    <div>
      <h2><FiUser /> Bienvenue, {user?.prenom} !</h2>
      <p className="subtitle">Votre espace personnel</p>
      
      <div className="stats-grid">
        <Link to="/catalogue" className="stat-card-dash" style={{borderTopColor:'#667eea'}}>
          <div className="stat-icon"><FiBookOpen size={28} /></div>
          <div className="stat-info"><strong>{stats.livres}</strong><span>Livres disponibles</span></div>
        </Link>
        <Link to="/mes-emprunts" className="stat-card-dash" style={{borderTopColor:'#f39c12'}}>
          <div className="stat-icon"><FiClipboard size={28} /></div>
          <div className="stat-info"><strong>{mesEmprunts.length}</strong><span>Mes emprunts</span></div>
        </Link>
        <Link to="/recommandations" className="stat-card-dash" style={{borderTopColor:'#9b59b6'}}>
          <div className="stat-icon"><FiTrendingUp size={28} /></div>
          <div className="stat-info"><strong>IA</strong><span>Recommandations</span></div>
        </Link>
      </div>

      <h3>📚 Nouveautés</h3>
      <div className="books-grid">
        {recentLivres.map(livre => (
          <Link to={`/catalogue`} key={livre.id} className="book-card">
            <div className="book-cover">📖</div>
            <h4>{livre.titre}</h4>
            <p>{livre.auteur}</p>
            <span className="badge-categorie">{livre.categorie || 'Général'}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;