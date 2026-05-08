import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiBookOpen, FiClipboard, FiTrendingUp, FiSettings, FiLogOut, FiUser, FiUsers, FiList } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAdmin, logout } = useAuth();

  const userLinks = [
    { to: '/', icon: <FiHome size={16} />, label: 'Accueil' },
    { to: '/catalogue', icon: <FiBookOpen size={16} />, label: 'Catalogue' },
    { to: '/mes-emprunts', icon: <FiClipboard size={16} />, label: 'Mes Emprunts' },
    { to: '/recommandations', icon: <FiTrendingUp size={16} />, label: 'Recommandations' },
  ];

  const adminLinks = [
    { to: '/admin/livres', icon: <FiBookOpen size={16} />, label: 'Livres' },
    { to: '/admin/emprunts', icon: <FiList size={16} />, label: 'Emprunts' },
    { to: '/admin/users', icon: <FiUsers size={16} />, label: 'Utilisateurs' },
  ];

  return (
    <nav className="navbar">
      <h1>📚 BiblioPro</h1>
      <div className="nav-links">
        {userLinks.map(link => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'active' : ''}>
            {link.icon} {link.label}
          </NavLink>
        ))}
        {isAdmin && adminLinks.map(link => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'active' : ''}>
            <FiSettings size={16} /> {link.label}
          </NavLink>
        ))}
        <div className="nav-user">
          <FiUser size={14} /> {user?.prenom}
        </div>
        <button onClick={logout} className="btn-logout"><FiLogOut size={16} /></button>
      </div>
    </nav>
  );
}

export default Navbar;