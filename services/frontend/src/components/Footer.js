import React from 'react';
import { FiHeart, FiBookOpen, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <h3><FiBookOpen size={20} /> BiblioPro</h3>
          <p>La bibliothèque numérique intelligente du Dakar Institute of Technology.</p>
          <p className="footer-tagline">Propulsé par l'IA pour des recommandations personnalisées.</p>
        </div>
        <div className="footer-col">
          <h4>Liens rapides</h4>
          <a href="/catalogue">Catalogue</a>
          <a href="/recommandations">Recommandations IA</a>
          <a href="/mes-emprunts">Mes emprunts</a>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <p><FiMail size={14} /> bibliotheque@dit.sn</p>
          <p><FiPhone size={14} /> +221 33 123 45 67</p>
          <p><FiMapPin size={14} /> Dakar, Sénégal</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 BiblioPro DIT • Fait avec <FiHeart size={14} style={{color:'#e74c3c', verticalAlign:'middle'}} /> par l'équipe DIT</p>
      </div>
    </footer>
  );
}

export default Footer;