import React, { useState, useEffect } from 'react';
import { FiTag, FiPlus, FiEdit3, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import { api } from '../../services/api';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nom: '', description: '', couleur: '#667eea' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const data = await api.getCategories();
    setCategories(data);
    setLoading(false);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ nom: '', description: '', couleur: '#667eea' });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ nom: cat.nom, description: cat.description || '', couleur: cat.couleur || '#667eea' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) await api.updateCategorie(editing.id, form);
    else await api.addCategorie(form);
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id, nom) => {
    if (window.confirm(`Supprimer "${nom}" ?`)) {
      await api.deleteCategorie(id);
      loadData();
    }
  };

  const colors = ['#667eea', '#2196F3', '#FF9800', '#4CAF50', '#E91E63', '#E74C3C', '#9C27B0', '#00BCD4', '#607D8B'];

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2><FiTag /> Gestion des Catégories</h2>
          <p className="subtitle">{categories.length} catégories</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Ajouter une catégorie</button>
      </div>

      <div className="categories-grid">
        {categories.map(cat => (
          <div key={cat.id} className="category-card" style={{ borderLeftColor: cat.couleur }}>
            <div className="category-color" style={{ background: cat.couleur }}></div>
            <div className="category-info">
              <h3>{cat.nom}</h3>
              <p>{cat.description || 'Aucune description'}</p>
              <small>{new Date(cat.date_creation).toLocaleDateString('fr-FR')}</small>
            </div>
            <div className="category-actions">
              <button className="btn-icon edit" onClick={() => openEdit(cat)}><FiEdit3 /></button>
              <button className="btn-icon delete" onClick={() => handleDelete(cat.id, cat.nom)}><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Modifier' : 'Ajouter'} une catégorie</h3>
              <button onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <input placeholder="Nom *" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required style={{marginBottom:'12px', width:'100%'}} className="form-input" />
              <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{marginBottom:'12px', width:'100%'}} className="form-input" />
              <label style={{color:'#a0a0c0', fontSize:'13px', marginBottom:'8px', display:'block'}}>Couleur</label>
              <div className="color-picker">
                {colors.map(c => (
                  <div key={c} className={`color-dot ${form.couleur === c ? 'selected' : ''}`} style={{background:c}} onClick={() => setForm({...form, couleur: c})}></div>
                ))}
              </div>
              <button type="submit" className="btn btn-primary btn-full" style={{marginTop:'15px'}}><FiSave /> {editing ? 'Modifier' : 'Ajouter'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;
