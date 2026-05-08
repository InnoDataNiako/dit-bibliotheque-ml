import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Livres from './components/Livres';
import Utilisateurs from './components/Utilisateurs';
import Emprunts from './components/Emprunts';
import Recommandations from './components/Recommandations';

function App() {
  const [activeTab, setActiveTab] = useState('livres');

  const renderContent = () => {
    switch (activeTab) {
      case 'livres': return <Livres />;
      case 'utilisateurs': return <Utilisateurs />;
      case 'emprunts': return <Emprunts />;
      case 'recommandations': return <Recommandations />;
      default: return <Livres />;
    }
  };

  return (
    <div className="App">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;