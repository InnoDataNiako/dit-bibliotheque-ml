import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiPlus, FiEdit3, FiTrash2, FiX, FiSave, FiUpload, FiStar } from 'react-icons/fi';
import { api } from '../../services/api';

function AdminLivres() {
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLivre, setEditingLivre] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    titre: '', auteur: '', isbn: '', categorie: '',
    annee_publication: '', nombre_exemplaires: 1,
    image_url: '', description: '', is_new: false
  });

  useEffect(() => { loadLivres(); }, []);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadLivres();
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  const loadLivres = async () => {
    const data = await api.getLivres();
    setLivres(data);
    setLoading(false);
  };

  const openAdd = () => {
    setEditingLivre(null);
    setImageFile(null);
    setImagePreview(null);
    setForm({ titre: '', auteur: '', isbn: '', categorie: '', annee_publication: '', nombre_exemplaires: 1, image_url: '', description: '', is_new: false });
    setShowModal(true);
  };

  const openEdit = (livre) => {
    setEditingLivre(livre);
    setImageFile(null);
    setImagePreview(livre.image_url || null);
    setForm({ ...livre, is_new: false });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await fetch('http://localhost:8081/api/livres/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setForm({...form, image_url: `http://localhost:8081${data.url}`});
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const livreData = {
      ...form,
      date_ajout: form.is_new ? new Date().toISOString() : undefined,
    };
    delete livreData.is_new;
    
    if (editingLivre) await api.updateLivre(editingLivre.id, livreData);
    else await api.addLivre(livreData);
    setShowModal(false);
    loadLivres();
  };

  const handleDelete = async (id, titre) => {
    if (window.confirm(`Supprimer "${titre}" ?`)) {
      await api.deleteLivre(id);
      loadLivres();
    }
  };

  const isNew = (dateAjout) => {
    if (!dateAjout) return false;
    const diff = (new Date() - new Date(dateAjout)) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  };

  const coverColors = {
    'IA': 'linear-gradient(135deg, #667eea, #764ba2)',
    'Informatique': 'linear-gradient(135deg, #2196F3, #1976D2)',
    'Data Engineering': 'linear-gradient(135deg, #FF9800, #F57C00)',
    'Mathématiques': 'linear-gradient(135deg, #4CAF50, #388E3C)',
    'DevOps': 'linear-gradient(135deg, #E91E63, #C2185B)',
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2><FiBookOpen /> Gestion des Livres</h2>
          <p className="subtitle">{livres.length} livres au catalogue</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Ajouter un livre</button>
      </div>

      <div className="books-grid-admin">
        {livres.map(livre => (
          <div key={livre.id} className="book-admin-card">
            {isNew(livre.date_ajout) && <span className="badge-new"><FiStar size={12} /> Nouveau</span>}
            <div 
              className="book-admin-cover" 
              style={{ 
                background: livre.image_url 
                  ? `url(${livre.image_url}) center/cover` 
                  : (coverColors[livre.categorie] || 'linear-gradient(135deg, #607D8B, #455A64)')
              }}
            >
              {!livre.image_url && <span className="cover-emoji">📖</span>}
            </div>
            <div className="book-admin-info">
              <h3>{livre.titre}</h3>
              <p className="author">✍️ {livre.auteur}</p>
              <p className="meta"><code>{livre.isbn}</code></p>
              <div className="book-meta-row">
                <span className="badge-categorie">{livre.categorie || 'Général'}</span>
                <span>{livre.nombre_exemplaires} ex.</span>
              </div>
              <div className="book-actions">
                <button className="btn-icon edit" onClick={() => openEdit(livre)}><FiEdit3 /></button>
                <button className="btn-icon delete" onClick={() => handleDelete(livre.id, livre.titre)}><FiTrash2 /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingLivre ? 'Modifier' : 'Ajouter'} un livre</h3>
              <button onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <input placeholder="Titre *" value={form.titre} onChange={e => setForm({...form, titre: e.target.value})} required />
                <input placeholder="Auteur *" value={form.auteur} onChange={e => setForm({...form, auteur: e.target.value})} required />
                <input placeholder="ISBN *" value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} required />
// Par :
<select value={form.categorie} onChange={e => setForm({...form, categorie: e.target.value})}>
  <option value="">Sélectionner une catégorie</option>
  {categories.map(cat => (
    <option key={cat.id} value={cat.nom}>{cat.nom}</option>
  ))}
</select>
                <input type="number" placeholder="Année" value={form.annee_publication} onChange={e => setForm({...form, annee_publication: e.target.value})} />
                <input type="number" placeholder="Exemplaires" value={form.nombre_exemplaires} onChange={e => setForm({...form, nombre_exemplaires: parseInt(e.target.value)})} min="1" />
              </div>

              {/* UPLOAD IMAGE */}
              <div className="upload-image-section">
                <label className="upload-label">
                  <FiUpload size={20} />
                  <span>Couverture du livre</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                <input 
                  placeholder="Ou URL de l'image" 
                  value={form.image_url} 
                  onChange={e => setForm({...form, image_url: e.target.value})} 
                  style={{ marginTop: '10px' }}
                />
              </div>

              {/* CHECKBOX NOUVEAU */}
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="isNew" 
                  checked={form.is_new || false}
                  onChange={(e) => setForm({...form, is_new: e.target.checked})}
                />
                <label htmlFor="isNew">
                  <FiStar size={16} /> Marquer comme "Nouveau"
                </label>
              </div>

              <textarea 
                placeholder="Description du livre" 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
                rows="3" 
                style={{ width: '100%', marginBottom: '15px' }}
              />

              <button type="submit" className="btn btn-primary btn-full">
                <FiSave /> {editingLivre ? 'Modifier' : 'Ajouter'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLivres;