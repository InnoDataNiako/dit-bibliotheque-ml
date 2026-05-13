import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiBookOpen, FiSearch, FiUser, FiLogOut, FiHeart, FiList, 
  FiMenu, FiX, FiChevronDown, FiTag, FiHome, FiTrendingUp
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [empruntCount, setEmpruntCount] = useState(0);
  const catRef = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    if (user) {
      loadFavCount();
      loadEmpruntCount();
    }
    const handleFavUpdate = () => loadFavCount();
    const handleEmpruntUpdate = () => loadEmpruntCount();
    window.addEventListener('favUpdated', handleFavUpdate);
    window.addEventListener('empruntUpdated', handleEmpruntUpdate);
    return () => {
      window.removeEventListener('favUpdated', handleFavUpdate);
      window.removeEventListener('empruntUpdated', handleEmpruntUpdate);
    };
  }, [user]);

  const loadFavCount = async () => {
    try {
      const favs = await api.getWishlist(user.id);
      setFavCount(favs.length);
    } catch (err) {}
  };

  const loadEmpruntCount = async () => {
    try {
      const all = await api.getEmprunts();
      const mes = all.filter(e => e.email === user.email && e.statut !== 'Retourne');
      setEmpruntCount(mes.length);
    } catch(err) {}
  };

  const categories = [
    { name: 'Informatique', slug: 'Informatique' },
    { name: 'IA & Machine Learning', slug: 'IA' },
    { name: 'Data Engineering', slug: 'Data Engineering' },
    { name: 'Mathematiques', slug: 'Mathematiques' },
    { name: 'DevOps', slug: 'DevOps' },
  ];

  return (
    <header className="nav-pro">
      <div className="nav-top">
        <div className="nav-top-inner">
          <span><FiBookOpen size={14} /> Bibliotheque numerique DIT</span>
          <span>+221 33 123 45 67</span>
        </div>
      </div>

      <div className="nav-main">
        <div className="nav-main-inner">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <FiBookOpen size={20} color="white" />
            </div>
            <div className="nav-logo-text">
              <span className="nav-logo-name">BiblioPro</span>
              <span className="nav-logo-sub">DIT Library</span>
            </div>
          </Link>

          <div className="nav-cat-wrap" ref={catRef}>
            <button className="nav-cat-btn" onClick={() => setCatOpen(!catOpen)}>
              <FiMenu size={16} /> Categories <FiChevronDown size={14} />
            </button>
            {catOpen && (
              <div className="nav-cat-drop">
                <Link to="/catalogue" className="nav-cat-item" onClick={() => setCatOpen(false)}>
                  <FiList size={14} /> Tous les livres
                </Link>
                {categories.map(cat => (
                  <Link key={cat.slug} to={`/catalogue?categorie=${cat.slug}`} className="nav-cat-item" onClick={() => setCatOpen(false)}>
                    <FiTag size={14} /> {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="nav-search">
            <FiSearch size={16} className="nav-search-icon" />
            <input type="text" placeholder="Rechercher un livre, auteur, ISBN..." />
          </div>

          <div className="nav-icons">
            <Link to="/favoris" className="nav-icon-btn" style={{position:'relative'}}>
              <FiHeart size={20} />
              <span>Favoris</span>
              {favCount > 0 && (
                <span className="nav-icon-badge">{favCount > 99 ? '99+' : favCount}</span>
              )}
            </Link>

            <Link to="/recommandations" className="nav-icon-btn">
              <FiTrendingUp size={20} />
              <span>Recommandations</span>
            </Link>
            <Link to="/mes-emprunts" className="nav-icon-btn" style={{position:'relative'}}>
              <FiList size={20} />
              <span>Mes Emprunts</span>
              {empruntCount > 0 && (
                <span className="nav-icon-badge">{empruntCount}</span>
              )}
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="nav-admin-btn">
                    Admin
                  </Link>
                )}
                <div className="nav-user-pill">
                  <div className="nav-avatar"><FiUser size={14} /></div>
                  <Link to="/profil" style={{color:'inherit',textDecoration:'none'}}><span>{user.prenom}</span></Link>
                </div>
                <button onClick={logout} className="nav-icon-btn" title="Deconnexion">
                  <FiLogOut size={18} />
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-icon-btn">
                <FiUser size={20} />
                <span>Connexion</span>
              </Link>
            )}

            <button className="nav-burger" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="nav-mobile">
          <Link to="/" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>
            <FiHome size={16} /> Accueil
          </Link>
          <Link to="/favoris" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>
            <FiHeart size={16} /> Favoris ({favCount})
          </Link>
          <Link to="/catalogue" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>
            <FiBookOpen size={16} /> Catalogue
          </Link>
            <Link to="/recommandations" className="nav-icon-btn">
              <FiTrendingUp size={20} />
              <span>Recommandations</span>
            </Link>
          <Link to="/mes-emprunts" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>
            <FiList size={16} /> Mes Emprunts
          </Link>
          <Link to="/recommandations" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>
            <FiHeart size={16} /> Recommandations
          </Link>
          {isAdmin && (
            <Link to="/admin/dashboard" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>
              <FiUser size={16} /> Administration
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
