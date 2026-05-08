// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import './App.css';
// import Navbar from './components/Navbar';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import Livres from './pages/Livres';
// import Utilisateurs from './pages/Utilisateurs';
// import Emprunts from './pages/Emprunts';
// import Recommandations from './pages/Recommandations';

// function App() {
//   const [user, setUser] = useState(() => {
//     const saved = localStorage.getItem('user');
//     return saved ? JSON.parse(saved) : null;
//   });

//   const handleLogin = (userData) => {
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem('user');
//   };

//   if (!user) {
//     return (
//       <Router>
//         <Routes>
//           <Route path="/login" element={<Login onLogin={handleLogin} />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="*" element={<Navigate to="/login" />} />
//         </Routes>
//       </Router>
//     );
//   }

//   return (
//     <Router>
//       <div className="App">
//         <Navbar user={user} onLogout={handleLogout} />
//         <main className="container">
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/livres" element={<Livres />} />
//             <Route path="/utilisateurs" element={<Utilisateurs />} />
//             <Route path="/emprunts" element={<Emprunts />} />
//             <Route path="/recommandations" element={<Recommandations />} />
//             <Route path="*" element={<Navigate to="/" />} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Catalogue from './pages/Catalogue';
import MesEmprunts from './pages/MesEmprunts';
import AdminLivres from './pages/admin/LivresCRUD';
import AdminEmprunts from './pages/admin/Emprunts';
import AdminUsers from './pages/admin/Users';
import Recommandations from './pages/Recommandations';
import './App.css';

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Chargement...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin' && user.role !== 'bibliothecaire') return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="App">
      {user && <Navbar />}
      <main className="container">
        <Routes>
          {/* Public */}
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

          {/* User */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/catalogue" element={<PrivateRoute><Catalogue /></PrivateRoute>} />
          <Route path="/mes-emprunts" element={<PrivateRoute><MesEmprunts /></PrivateRoute>} />
          <Route path="/recommandations" element={<PrivateRoute><Recommandations /></PrivateRoute>} />

          {/* Admin */}
          <Route path="/admin/livres" element={<PrivateRoute adminOnly><AdminLivres /></PrivateRoute>} />
          <Route path="/admin/emprunts" element={<PrivateRoute adminOnly><AdminEmprunts /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute adminOnly><AdminUsers /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
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