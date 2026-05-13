
import React from 'react';
import { FiUser, FiMail, FiShield, FiHash } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

  .profil-page {
    font-family: 'IBM Plex Sans', sans-serif;
    max-width: 480px;
  }

  .profil-header-bar {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1.35rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 0.2rem;
    letter-spacing: -0.02em;
  }
  .profil-header-bar svg { color: #E24B4A; }

  .profil-subtitle {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-text-tertiary);
    margin: 0 0 1.5rem;
  }

  .profil-card {
    background: #fff;
    border: 0.5px solid rgba(226, 75, 74, 0.18);
    border-radius: 12px;
    overflow: hidden;
  }

  .profil-card-top {
    background: #fff8f8;
    border-bottom: 0.5px solid rgba(226, 75, 74, 0.12);
    padding: 1.4rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .profil-avatar {
    width: 52px;
    height: 52px;
    border-radius: 10px;
    background: #E24B4A;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }

  .profil-name {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 0.3rem;
    letter-spacing: -0.01em;
  }

  .profil-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: #FCEBEB;
    color: #A32D2D;
    border: 0.5px solid rgba(226, 75, 74, 0.25);
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
  }

  .profil-card-body {
    padding: 0.25rem 0;
  }

  .profil-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    border-bottom: 0.5px solid rgba(226, 75, 74, 0.07);
    transition: background 0.1s;
  }
  .profil-row:last-child { border-bottom: none; }
  .profil-row:hover { background: #fff8f8; }

  .profil-row-icon {
    width: 30px;
    height: 30px;
    border-radius: 6px;
    background: #FCEBEB;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #E24B4A;
    flex-shrink: 0;
  }

  .profil-row-label {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-text-tertiary);
    margin: 0 0 0.1rem;
  }

  .profil-row-value {
    font-size: 0.85rem;
    color: var(--color-text-primary);
    font-family: 'IBM Plex Mono', monospace;
    margin: 0;
    font-weight: 400;
  }

  .profil-loading {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.82rem;
    color: var(--color-text-tertiary);
    letter-spacing: 0.03em;
  }
`;

function Profil() {
  const { user } = useAuth();

  if (!user) return <p className="profil-loading">chargement...</p>;

  return (
    <div className="profil-page">
      <style>{STYLES}</style>

      <h2 className="profil-header-bar">
        <FiUser size={20} />
        Mon Profil
      </h2>
      <p className="profil-subtitle">Informations du compte</p>

      <div className="profil-card">
        <div className="profil-card-top">
          <div className="profil-avatar">
            <FiUser size={22} />
          </div>
          <div>
            <p className="profil-name">{user.prenom} {user.nom}</p>
            <span className="profil-role-badge">
              <FiShield size={9} /> {user.role}
            </span>
          </div>
        </div>

        <div className="profil-card-body">
          {/* <div className="profil-row">
            <div className="profil-row-icon"><FiHash size={13} /></div>
            <div>
              <p className="profil-row-label">Identifiant</p>
              <p className="profil-row-value">{user.id ?? '—'}</p>
            </div>
          </div> */}

          <div className="profil-row">
            <div className="profil-row-icon"><FiMail size={13} /></div>
            <div>
              <p className="profil-row-label">Email</p>
              <p className="profil-row-value">{user.email}</p>
            </div>
          </div>

          <div className="profil-row">
            <div className="profil-row-icon"><FiShield size={13} /></div>
            <div>
              <p className="profil-row-label">Role</p>
              <p className="profil-row-value">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profil;