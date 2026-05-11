import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiBookOpen, FiUsers, FiClipboard, FiTrendingUp, 
  FiX, FiLogOut, FiEye, FiList, FiTag, FiActivity, FiSettings, 
  FiUser, FiTool, FiGlobe
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

function AdminSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const adminLinks = [
    { to: '/admin/dashboard', icon: <FiActivity size={18} />, label: 'Dashboard' },
    { to: '/admin/livres', icon: <FiBookOpen size={18} />, label: 'Gérer Livres' },
    { to: '/admin/categories', icon: <FiTag size={18} />, label: 'Catégories' },
    { to: '/admin/emprunts', icon: <FiClipboard size={18} />, label: 'Gérer Emprunts' },
    { to: '/admin/users', icon: <FiUsers size={18} />, label: 'Gérer Utilisateurs' },
    { to: '/recommandations', icon: <FiTrendingUp size={18} />, label: 'Recommandations IA' },
  ];

  const userLinks = [
    { to: '/', icon: <FiHome size={18} />, label: 'Accueil site' },
    { to: '/catalogue', icon: <FiBookOpen size={18} />, label: 'Catalogue' },
    { to: '/mes-emprunts', icon: <FiList size={18} />, label: 'Mes Emprunts' },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2><FiBookOpen size={20} /> BiblioPro</h2>
          <button className="sidebar-close" onClick={onClose}><FiX size={20} /></button>
        </div>
        
        <div className="sidebar-user">
          <div className="sidebar-avatar"><FiUser size={24} /></div>
          <div>
            <strong>{user?.prenom} {user?.nom}</strong>
            <span className="badge-admin">Administrateur</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* Section Admin */}
          <div className="sidebar-section">
            <span className="sidebar-section-title"><FiTool size={12} /> Administration</span>
            {adminLinks.map(link => (
              <NavLink 
                key={link.to} 
                to={link.to} 
                end={link.to === '/admin/dashboard'}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                {link.icon} {link.label}
              </NavLink>
            ))}
          </div>

          {/* Séparateur */}
          <div className="sidebar-divider"></div>

          {/* Section Voir le site */}
          <div className="sidebar-section">
            <span className="sidebar-section-title"><FiGlobe size={12} /> Voir le site (mode utilisateur)</span>
            {userLinks.map(link => (
              <NavLink 
                key={link.to} 
                to={link.to} 
                className={({ isActive }) => `sidebar-link user-view ${isActive ? 'active-user' : ''}`}
                onClick={onClose}
              >
                <FiEye size={18} /> {link.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="sidebar-link logout">
            <FiLogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;