import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Catalogue from './pages/Catalogue';
import MesEmprunts from './pages/MesEmprunts';
import Recommandations from './pages/Recommandations';
import AdminLivres from './pages/admin/LivresCRUD';
import AdminEmprunts from './pages/admin/Emprunts';
import AdminUsers from './pages/admin/Users';
import AdminCategories from './pages/admin/Categories';
import AdminDashboard from './pages/admin/Dashboard';
import Favoris from './pages/Favoris';

// Dans les routes admin :
import './App.css';

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Chargement...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin' && user.role !== 'bibliothecaire') return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="App">
      {/* Affiche la Navbar pour TOUT le monde SAUF sur les pages admin */}
      {user && window.location.pathname.startsWith('/admin') ? null : user && <Navbar />}
      
      <Routes>
        {/* Pages publiques */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

        {/* Accueil - Même vue pour tout le monde */}
        <Route path="/" element={
          <PrivateRoute>
            <main className="container"><Dashboard /></main>
            <Footer />
          </PrivateRoute>
        } />

        {/* Pages utilisateur avec Navbar */}
        <Route path="/catalogue" element={
          <PrivateRoute>
            <main className="container"><Catalogue /></main>
            <Footer />
          </PrivateRoute>
        } />
        <Route path="/mes-emprunts" element={
          <PrivateRoute>
            <main className="container"><MesEmprunts /></main>
            <Footer />
          </PrivateRoute>
        } />
        <Route path="/recommandations" element={
          <PrivateRoute>
            <main className="container"><Recommandations /></main>
            <Footer />
          </PrivateRoute>
        } />
         {/* AJOUTE ICI */}
<Route path="/favoris" element={
  <PrivateRoute>
    <main className="container"><Favoris /></main>
    <Footer />
  </PrivateRoute>
} />

        {/* Pages Admin avec Sidebar (pas de Navbar normale) */}
        <Route path="/admin/*" element={
          <PrivateRoute adminOnly>
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="livres" element={<AdminLivres />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="emprunts" element={<AdminEmprunts />} />
                <Route path="users" element={<AdminUsers />} />
              </Routes>
            </AdminLayout>
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;