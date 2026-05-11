import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import Footer from './Footer';
import { FiMenu } from 'react-icons/fi';

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={22} />
          </button>
          <div>
            <span className="date-display">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>
        
        <div className="admin-content">
          {children}
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

export default AdminLayout;