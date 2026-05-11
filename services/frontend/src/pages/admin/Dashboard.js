import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiUsers, FiClipboard, FiAlertCircle, FiTrendingUp, FiPlus, FiActivity, FiClock, FiCheckCircle } from 'react-icons/fi';
import { api } from '../../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState({ livres: 0, users: 0, emprunts: 0, retards: 0, actifs: 0 });
  const [recentEmprunts, setRecentEmprunts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [livres, emprunts, users] = await Promise.all([
        api.getLivres(), api.getEmprunts(), api.getUsers().catch(() => [])
      ]);
      setStats({
        livres: livres.length,
        users: users.length || 0,
        emprunts: emprunts.length,
        retards: emprunts.filter(e => e.statut === 'En retard').length,
        actifs: emprunts.filter(e => e.statut === 'En cours').length,
      });
      setRecentEmprunts(emprunts.slice(0, 8));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div className="loading"><FiActivity className="spinner" size={40} /><p>Chargement...</p></div>;

  return (
    <div>
      <div className="dashboard-hero">
        <div>
          <h2><FiActivity /> Tableau de Bord Admin</h2>
          <p className="subtitle">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Link to="/admin/livres" className="btn btn-primary"><FiPlus /> Nouveau livre</Link>
      </div>

      <div className="stats-grid">
        <Link to="/admin/livres" className="stat-card-dash books">
          <div className="stat-icon-wrapper"><FiBookOpen size={30} /></div>
          <div className="stat-info"><strong>{stats.livres}</strong><span>Livres</span></div>
        </Link>
        <Link to="/admin/users" className="stat-card-dash users">
          <div className="stat-icon-wrapper"><FiUsers size={30} /></div>
          <div className="stat-info"><strong>{stats.users}</strong><span>Utilisateurs</span></div>
        </Link>
        <Link to="/admin/emprunts" className="stat-card-dash emprunts">
          <div className="stat-icon-wrapper"><FiClipboard size={30} /></div>
          <div className="stat-info"><strong>{stats.emprunts}</strong><span>Emprunts</span></div>
        </Link>
        <div className="stat-card-dash retards">
          <div className="stat-icon-wrapper"><FiAlertCircle size={30} /></div>
          <div className="stat-info"><strong>{stats.retards}</strong><span>En retard</span></div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3><FiClock /> Derniers emprunts</h3>
          <table className="mini-table">
            <thead><tr><th>Livre</th><th>Utilisateur</th><th>Statut</th></tr></thead>
            <tbody>
              {recentEmprunts.map(e => (
                <tr key={e.id} className={e.statut === 'En retard' ? 'row-retard' : ''}>
                  <td>{e.titre?.substring(0, 30)}</td>
                  <td>{e.prenom} {e.nom}</td>
                  <td>
                    {e.statut === 'En cours' && <span className="badge badge-en-cours"><FiClock size={10} /> En cours</span>}
                    {e.statut === 'Retourné' && <span className="badge badge-retourne"><FiCheckCircle size={10} /> Retourné</span>}
                    {e.statut === 'En retard' && <span className="badge badge-en-retard"><FiAlertCircle size={10} /> En retard</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="dashboard-card">
          <h3><FiTrendingUp /> Actions rapides</h3>
          <div className="quick-actions-vertical">
            <Link to="/admin/livres" className="btn btn-primary"><FiPlus /> Ajouter un livre</Link>
            <Link to="/admin/categories" className="btn btn-primary"><FiBookOpen /> Gérer catégories</Link>
            <Link to="/admin/users" className="btn btn-primary"><FiUsers /> Gérer utilisateurs</Link>
            <Link to="/catalogue" className="btn btn-primary"><FiBookOpen /> Voir le catalogue</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
