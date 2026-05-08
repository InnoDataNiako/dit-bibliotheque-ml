import React from 'react';

function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'livres', icon: '📖', label: 'Livres' },
    { id: 'utilisateurs', icon: '👥', label: 'Utilisateurs' },
    { id: 'emprunts', icon: '📋', label: 'Emprunts' },
    { id: 'recommandations', icon: '🔮', label: 'Recommandations' },
  ];

  return (
    <nav className="navbar">
      <h1>📚 Bibliothèque DIT</h1>
      <div className="nav-links">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;