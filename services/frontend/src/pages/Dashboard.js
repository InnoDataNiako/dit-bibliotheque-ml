// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   FiBookOpen, FiSearch, FiFilter, FiBookmark, FiStar, 
//   FiUser, FiTrendingUp, FiClock, FiUsers, FiArrowRight,
//   FiShoppingCart, FiMinus, FiPlus
// } from 'react-icons/fi';
// import { useAuth } from '../context/AuthContext';
// import { api } from '../services/api';

// function Dashboard() {
//   const { user, isAdmin } = useAuth();
//   const [livres, setLivres] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [search, setSearch] = useState('');
//   const [categorie, setCategorie] = useState('all');
//   const [message, setMessage] = useState('');
//   const [stats, setStats] = useState({ total: 0, emprunts: 0, users: 0 });

//   useEffect(() => { loadAll(); }, []);

//   const loadAll = async () => {
//     try {
//       const [livresData, empruntsData] = await Promise.all([api.getLivres(), api.getEmprunts()]);
//       setLivres(livresData);
//       setFiltered(livresData);
//       setStats({
//         total: livresData.length,
//         emprunts: empruntsData.length,
//         users: new Set(empruntsData.map(e => e.utilisateur_id)).size,
//       });
//     } catch (err) { console.error(err); }
//   };

//   useEffect(() => {
//     let result = livres;
//     if (search) result = result.filter(l => l.titre.toLowerCase().includes(search.toLowerCase()) || l.auteur.toLowerCase().includes(search.toLowerCase()));
//     if (categorie !== 'all') result = result.filter(l => l.categorie === categorie);
//     setFiltered(result);
//   }, [search, categorie, livres]);

//   const categories = ['all', ...new Set(livres.map(l => l.categorie).filter(Boolean))];

//   const [wishlist, setWishlist] = useState({});

// const handleWishlist = async (livreId) => {
//   const result = await api.toggleWishlist(user.id, livreId);
//   setWishlist({...wishlist, [livreId]: result.action === 'added'});
//   setMessage(result.action === 'added' ? '❤️ Ajouté aux favoris' : '💔 Retiré des favoris');
//   setTimeout(() => setMessage(''), 2000);
// };

// // Dans le JSX de la carte livre, avant le bouton Emprunter :
// <button 
//   className={`btn-fav ${wishlist[livre.id] ? 'active' : ''}`}
//   onClick={() => handleWishlist(livre.id)}
// >
//   <FiHeart size={18} />
// </button>
//   const [mesEmprunts, setMesEmprunts] = useState([]);

// // Dans loadAll, ajoute :
// setMesEmprunts(empruntsData.filter(e => e.utilisateur_id === user?.id && e.statut !== 'Retourné'));

// // Dans handleEmprunt :
// const handleEmprunt = async (livreId, livreTitre) => {
//   // Vérifier si déjà emprunté
//   const dejaEmprunte = mesEmprunts.find(e => e.livre_id === livreId);
//   if (dejaEmprunte) {
//     const dateRetour = new Date(dejaEmprunte.date_retour_prevue).toLocaleDateString('fr-FR');
//     setMessage(`⚠️ Vous avez déjà emprunté "${livreTitre}". Rendez-le avant le ${dateRetour}.`);
//     setTimeout(() => setMessage(''), 5000);
//     return;
//   }
  
//   try {
//     await api.emprunter(user.id, livreId);
//     setMessage('✅ Livre emprunté avec succès !');
//     setTimeout(() => setMessage(''), 3000);
//     loadAll();
//   } catch (err) { setMessage('❌ Erreur lors de l\'emprunt'); }
// };

//   const isNew = (date) => {
//     if (!date) return false;
//     return (new Date() - new Date(date)) / (1000 * 60 * 60 * 24) <= 7;
//   };

//   return (
//     <div className="home-page">
//       {/* HERO SECTION */}
//       <section className="hero-pro">
//         <div className="hero-pro-inner">
//           <div className="hero-pro-left">
//             <div className="hero-pro-kicker">
//               <FiStar size={14} /> Bibliothèque Numérique DIT
//             </div>
//             <h1 className="hero-pro-title">
//               Votre bibliothèque<br />
//               <span className="hero-pro-highlight">intelligente</span>
//             </h1>
//             <p className="hero-pro-sub">
//               Découvrez, empruntez et recevez des recommandations personnalisées<br />
//               grâce à notre <strong>intelligence artificielle</strong>.
//             </p>
//             <div className="hero-pro-ctas">
//               <Link to="/catalogue" className="hero-btn-primary">
//                 <FiBookOpen size={18} /> Voir le catalogue
//               </Link>
//               {!user && (
//                 <Link to="/register" className="hero-btn-secondary">
//                   <FiUser size={18} /> S'inscrire
//                 </Link>
//               )}
//             </div>
//           </div>
//           <div className="hero-pro-stats">
//             <div className="hero-stat-card">
//               <div className="hero-stat-icon"><FiBookOpen size={22} /></div>
//               <div>
//                 <div className="hero-stat-num">{stats.total}+</div>
//                 <div className="hero-stat-lbl">Livres disponibles</div>
//               </div>
//             </div>
//             <div className="hero-stat-card">
//               <div className="hero-stat-icon"><FiUsers size={22} /></div>
//               <div>
//                 <div className="hero-stat-num">{stats.users}</div>
//                 <div className="hero-stat-lbl">Lecteurs actifs</div>
//               </div>
//             </div>
//             <div className="hero-stat-card">
//               <div className="hero-stat-icon"><FiTrendingUp size={22} /></div>
//               <div>
//                 <div className="hero-stat-num">IA</div>
//                 <div className="hero-stat-lbl">Recommandations</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CATEGORY PILLS */}
//       <div className="cat-pills-section">
//         <div className="cat-pills">
//           {categories.map(cat => (
//             <button
//               key={cat}
//               className={`cat-pill ${categorie === cat ? 'active' : ''}`}
//               onClick={() => setCategorie(cat)}
//             >
//               {cat === 'all' ? 'Tous les livres' : cat}
//               <span className="cat-pill-count">
//                 {cat === 'all' ? livres.length : livres.filter(l => l.categorie === cat).length}
//               </span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* SEARCH + CATALOGUE */}
//       <div className="catalogue-section">
//         <div className="catalogue-header">
//           <h2><FiBookOpen size={24} /> {categorie === 'all' ? 'Nos Livres' : categorie}</h2>
//           <div className="search-bar-pro">
//             <FiSearch size={18} />
//             <input type="text" placeholder="Rechercher un livre..." value={search} onChange={e => setSearch(e.target.value)} />
//           </div>
//         </div>

//         {message && <div className={message.startsWith('✅') ? 'success' : 'error'}>{message}</div>}

//         <div className="books-grid-pro">
//           {filtered.map(livre => (
//             <div key={livre.id} className="book-card-pro">
//               {isNew(livre.date_ajout) && <span className="book-badge-new"><FiStar size={11} /> Nouveau</span>}
//               <div className="book-cover-pro">
//                 {livre.image_url ? (
//                   <img src={livre.image_url} alt={livre.titre} />
//                 ) : (
//                   <div className="book-cover-placeholder">
//                     <FiBookOpen size={40} />
//                   </div>
//                 )}
//                 <span className="book-cat-badge">{livre.categorie || 'Général'}</span>
//               </div>
//               <div className="book-body-pro">
//                 <h3 className="book-title-pro">{livre.titre}</h3>
//                 <p className="book-author-pro">✍️ {livre.auteur}</p>
//                 <p className="book-isbn-pro">{livre.isbn}</p>
//                 <p className="book-stock-pro">{livre.nombre_exemplaires} exemplaire(s)</p>
//                 {user && (
//                   <button className="btn-emprunt-pro" onClick={() => handleEmprunt(livre.id, livre.titre)}>
//                 <FiBookmark /> Emprunter
//               </button>
//                )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* TRUST STRIP */}
//       <div className="trust-strip-pro">
//         <div className="trust-item-pro">
//           <FiClock size={22} />
//           <div><strong>Emprunt 5 jours</strong><span>Pour les étudiants</span></div>
//         </div>
//         <div className="trust-item-pro">
//           <FiBookOpen size={22} />
//           <div><strong>IA Recommandations</strong><span>Personnalisées</span></div>
//         </div>
//         <div className="trust-item-pro">
//           <FiSearch size={22} />
//           <div><strong>Catalogue complet</strong><span>Recherche avancée</span></div>
//         </div>
//         <div className="trust-item-pro">
//           <FiUsers size={22} />
//           <div><strong>Support dédié</strong><span>Équipe DIT</span></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiBookOpen, FiSearch, FiFilter, FiBookmark, FiStar, 
  FiUser, FiTrendingUp, FiClock, FiUsers, FiHeart
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function Dashboard() {
  const { user } = useAuth();
  const [livres, setLivres] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [categorie, setCategorie] = useState('all');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({ total: 0, emprunts: 0, users: 0 });
  const [mesEmprunts, setMesEmprunts] = useState([]);
  const [wishlist, setWishlist] = useState({});

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const [livresData, empruntsData] = await Promise.all([api.getLivres(), api.getEmprunts()]);
      setLivres(livresData);
      setFiltered(livresData);
      setMesEmprunts(empruntsData.filter(e => e.utilisateur_id === user?.id && e.statut !== 'Retourné'));
      setStats({
        total: livresData.length,
        emprunts: empruntsData.length,
        users: new Set(empruntsData.map(e => e.utilisateur_id)).size,
      });
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    let result = livres;
    if (search) result = result.filter(l => l.titre.toLowerCase().includes(search.toLowerCase()) || l.auteur.toLowerCase().includes(search.toLowerCase()));
    if (categorie !== 'all') result = result.filter(l => l.categorie === categorie);
    setFiltered(result);
  }, [search, categorie, livres]);

  const categories = ['all', ...new Set(livres.map(l => l.categorie).filter(Boolean))];

  const handleWishlist = async (livreId) => {
    try {
      const result = await api.toggleWishlist(user.id, livreId);
      setWishlist({...wishlist, [livreId]: result.action === 'added'});
      setMessage(result.action === 'added' ? '❤️ Ajouté aux favoris' : '💔 Retiré des favoris');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage('❌ Fonctionnalité à venir');
    }
  };

  const handleEmprunt = async (livreId, livreTitre) => {
    const dejaEmprunte = mesEmprunts.find(e => e.livre_id === livreId);
    if (dejaEmprunte) {
      const dateRetour = new Date(dejaEmprunte.date_retour_prevue).toLocaleDateString('fr-FR');
      setMessage(`⚠️ Vous avez déjà emprunté "${livreTitre}". Rendez-le avant le ${dateRetour}.`);
      setTimeout(() => setMessage(''), 5000);
      return;
    }
    
    try {
      await api.emprunter(user.id, livreId);
      setMessage('✅ Livre emprunté avec succès !');
      setTimeout(() => setMessage(''), 3000);
      loadAll();
    } catch (err) { setMessage('❌ Erreur lors de l\'emprunt'); }
  };

  const isNew = (date) => {
    if (!date) return false;
    return (new Date() - new Date(date)) / (1000 * 60 * 60 * 24) <= 7;
  };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-pro">
        <div className="hero-pro-inner">
          <div className="hero-pro-left">
            <div className="hero-pro-kicker">
              <FiStar size={14} /> Bibliothèque Numérique DIT
            </div>
            <h1 className="hero-pro-title">
              Votre bibliothèque<br />
              <span className="hero-pro-highlight">intelligente</span>
            </h1>
            <p className="hero-pro-sub">
              Découvrez, empruntez et recevez des recommandations personnalisées<br />
              grâce à notre <strong>intelligence artificielle</strong>.
            </p>
            <div className="hero-pro-ctas">
              <Link to="/catalogue" className="hero-btn-primary">
                <FiBookOpen size={18} /> Voir le catalogue
              </Link>
              {!user && (
                <Link to="/register" className="hero-btn-secondary">
                  <FiUser size={18} /> S'inscrire
                </Link>
              )}
            </div>
          </div>
          <div className="hero-pro-stats">
            <div className="hero-stat-card">
              <div className="hero-stat-icon"><FiBookOpen size={22} /></div>
              <div>
                <div className="hero-stat-num">{stats.total}+</div>
                <div className="hero-stat-lbl">Livres disponibles</div>
              </div>
            </div>
            <div className="hero-stat-card">
              <div className="hero-stat-icon"><FiUsers size={22} /></div>
              <div>
                <div className="hero-stat-num">{stats.users}</div>
                <div className="hero-stat-lbl">Lecteurs actifs</div>
              </div>
            </div>
            <div className="hero-stat-card">
              <div className="hero-stat-icon"><FiTrendingUp size={22} /></div>
              <div>
                <div className="hero-stat-num">IA</div>
                <div className="hero-stat-lbl">Recommandations</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY PILLS */}
      <div className="cat-pills-section">
        <div className="cat-pills">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-pill ${categorie === cat ? 'active' : ''}`}
              onClick={() => setCategorie(cat)}
            >
              {cat === 'all' ? 'Tous les livres' : cat}
              <span className="cat-pill-count">
                {cat === 'all' ? livres.length : livres.filter(l => l.categorie === cat).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH + CATALOGUE */}
      <div className="catalogue-section">
        <div className="catalogue-header">
          <h2><FiBookOpen size={24} /> {categorie === 'all' ? 'Nos Livres' : categorie}</h2>
          <div className="search-bar-pro">
            <FiSearch size={18} />
            <input type="text" placeholder="Rechercher un livre..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {message && <div className={message.startsWith('✅') || message.startsWith('❤️') ? 'success' : message.startsWith('⚠️') ? 'error' : 'error'}>{message}</div>}

        <div className="books-grid-pro">
          {filtered.map(livre => (
            <div key={livre.id} className="book-card-pro">
              {isNew(livre.date_ajout) && <span className="book-badge-new"><FiStar size={11} /> Nouveau</span>}
              <div className="book-cover-pro">
                {livre.image_url ? (
                  <img src={livre.image_url} alt={livre.titre} />
                ) : (
                  <div className="book-cover-placeholder">
                    <FiBookOpen size={40} />
                  </div>
                )}
                <span className="book-cat-badge">{livre.categorie || 'Général'}</span>
                {/* Bouton Favori */}
                <button 
                  className={`btn-fav-card ${wishlist[livre.id] ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); handleWishlist(livre.id); }}
                >
                  <FiHeart size={16} fill={wishlist[livre.id] ? '#dc2626' : 'none'} />
                </button>
              </div>
              <div className="book-body-pro">
                <h3 className="book-title-pro">{livre.titre}</h3>
                <p className="book-author-pro">✍️ {livre.auteur}</p>
                <p className="book-isbn-pro">{livre.isbn}</p>
                <p className="book-stock-pro">{livre.nombre_exemplaires} exemplaire(s)</p>
                {user && (
                  <button className="btn-emprunt-pro" onClick={() => handleEmprunt(livre.id, livre.titre)}>
                    <FiBookmark /> Emprunter
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRUST STRIP */}
      <div className="trust-strip-pro">
        <div className="trust-item-pro">
          <FiClock size={22} />
          <div><strong>Emprunt 5 jours</strong><span>Pour les étudiants</span></div>
        </div>
        <div className="trust-item-pro">
          <FiBookOpen size={22} />
          <div><strong>IA Recommandations</strong><span>Personnalisées</span></div>
        </div>
        <div className="trust-item-pro">
          <FiSearch size={22} />
          <div><strong>Catalogue complet</strong><span>Recherche avancée</span></div>
        </div>
        <div className="trust-item-pro">
          <FiUsers size={22} />
          <div><strong>Support dédié</strong><span>Équipe DIT</span></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;