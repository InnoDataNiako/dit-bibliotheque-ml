
const API = {
  auth: 'http://localhost:8084/api/auth',
  livres: 'http://localhost:8081/api/livres',
  categories: 'http://localhost:8081/api/categories',
  utilisateurs: 'http://localhost:8082/api/utilisateurs',
  emprunts: 'http://localhost:8083/api/emprunts',
  recommandations: 'http://localhost:8000',
};

const getToken = () => localStorage.getItem('token');

const headers = (withAuth = true) => {
  const h = { 'Content-Type': 'application/json' };
  if (withAuth) h['Authorization'] = `Bearer ${getToken()}`;
  return h;
};

export const api = {
  // ========== AUTH ==========
  login: async (email, password) => {
    const res = await fetch(`${API.auth}/login`, {
      method: 'POST', headers: headers(false), body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  register: async (data) => {
    const res = await fetch(`${API.auth}/register`, {
      method: 'POST', headers: headers(false), body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API.auth}/me`, { headers: headers() });
    if (!res.ok) throw new Error('Non authentifié');
    return res.json();
  },

  getUsers: async () => {
    const res = await fetch(`${API.auth}/users`, { headers: headers() });
    return res.json();
  },

  // ========== LIVRES ==========
  getLivres: () => fetch(API.livres).then(r => r.json()),
  getLivre: (id) => fetch(`${API.livres}/${id}`).then(r => r.json()),
  addLivre: (data) => fetch(API.livres, { method: 'POST', headers: headers(false), body: JSON.stringify(data) }).then(r => r.json()),
  updateLivre: (id, data) => fetch(`${API.livres}/${id}`, { method: 'PUT', headers: headers(false), body: JSON.stringify(data) }).then(r => r.json()),
  deleteLivre: (id) => fetch(`${API.livres}/${id}`, { method: 'DELETE' }).then(r => r.json()),

  // ========== CATEGORIES ==========
  getCategories: () => fetch(API.categories).then(r => r.json()),
  addCategorie: (data) => fetch(API.categories, { method: 'POST', headers: headers(false), body: JSON.stringify(data) }).then(r => r.json()),
  updateCategorie: (id, data) => fetch(`${API.categories}/${id}`, { method: 'PUT', headers: headers(false), body: JSON.stringify(data) }).then(r => r.json()),
  deleteCategorie: (id) => fetch(`${API.categories}/${id}`, { method: 'DELETE' }).then(r => r.json()),

  // ========== EMPRUNTS ==========
  getEmprunts: () => fetch(API.emprunts).then(r => r.json()),
  emprunter: (userId, livreId) => fetch(API.emprunts, {
    method: 'POST', headers: headers(false), body: JSON.stringify({ utilisateur_id: userId, livre_id: livreId })
  }).then(r => r.json()),
  retourner: (id) => fetch(`${API.emprunts}/${id}/retour`, { method: 'PUT' }).then(r => r.json()),

  // ========== RECOMMANDATIONS ==========
  getRecommandations: (userId) => fetch(`${API.recommandations}/recommandations/${userId}`).then(r => r.json()),
  entrainer: () => fetch(`${API.recommandations}/train`, { method: 'POST' }).then(r => r.json()),
  // Dans l'objet api :
  getWishlist: (userId) => fetch(`http://localhost:8081/api/wishlist/${userId}`).then(r => r.json()),
  toggleWishlist: (userId, livreId) => fetch('http://localhost:8081/api/wishlist/toggle', {
    method: 'POST', headers: headers(false), body: JSON.stringify({ utilisateur_id: userId, livre_id: livreId })
  }).then(r => r.json()),

};

export default API;