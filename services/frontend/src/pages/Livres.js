import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiPlus, FiEdit3, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import { api } from '../services/api';

function Livres() {
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingLivre, setEditingLivre] = useState(null);
  const [form, setForm] = useState({ titre: '', auteur: '', isbn: '', categorie: '', annee_publication: '', nombre_exemplaires: 1 });

  useEffect(() => { loadLivres(); }, []);

  const loadLivres = async () => {
    try {
      setLoading(true);
      const data = await api.getLivres();
      setLivres(data);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const openAddModal = () => {
    setEditingLivre(null);
    setForm({ titre: '', auteur: '', isbn: '', categorie: '', annee_publication: '', nombre_exemplaires: 1 });
    setShowModal(true);
  };

  const openEditModal = (livre) => {
    setEditingLivre(livre);
    setForm({ titre: livre.titre, auteur: livre.auteur, isbn: livre.isbn, categorie: livre.categorie || '', annee_publication: livre.annee_publication || '', nombre_exemplaires: livre.nombre_exemplaires });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLivre) {
        await api.updateLivre(editingLivre.id, form);
      } else {
        await api.addLivre(form);
      }
      setShowModal(false);
      loadLivres();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id, titre) => {
    if (window.confirm(`Supprimer "${titre}" ?`)) {
      await api.deleteLivre(id);
      loadLivres();
    }
  };

  if (loading) return <div className="loading"><FiBookOpen className="spinner" size={40} /><p>Chargement...</p></div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2><FiBookOpen /> Catalogue des Livres</h2>
        <button className="btn btn-primary" onClick={openAddModal}><FiPlus /> Ajouter un livre</button>
      </div>
      <p className="subtitle">{livres.length} livres dans le catalogue</p>

      <table>
        <thead>
          <tr>
            <th>#</th><th>Titre</th><th>Auteur</th><th>ISBN</th><th>Catégorie</th><th>Ex.</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {livres.map(livre => (
            <tr key={livre.id}>
              <td>{livre.id}</td>
              <td><strong>{livre.titre}</strong></td>
              <td>{livre.auteur}</td>
              <td><code>{livre.isbn}</code></td>
              <td><span className="badge-categorie">{livre.categorie || 'N/A'}</span></td>
              <td className="text-center">{livre.nombre_exemplaires}</td>
              <td>
                <div className="actions">
                  <button className="btn-icon edit" onClick={() => openEditModal(livre)} title="Modifier"><FiEdit3 /></button>
                  <button className="btn-icon delete" onClick={() => handleDelete(livre.id, livre.titre)} title="Supprimer"><FiTrash2 /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingLivre ? <><FiEdit3 /> Modifier</> : <><FiPlus /> Ajouter</>} un livre</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <input type="text" placeholder="Titre *" value={form.titre} onChange={(e) => setForm({...form, titre: e.target.value})} required />
                <input type="text" placeholder="Auteur *" value={form.auteur} onChange={(e) => setForm({...form, auteur: e.target.value})} required />
                <input type="text" placeholder="ISBN *" value={form.isbn} onChange={(e) => setForm({...form, isbn: e.target.value})} required />
                <input type="text" placeholder="Catégorie" value={form.categorie} onChange={(e) => setForm({...form, categorie: e.target.value})} />
                <input type="number" placeholder="Année" value={form.annee_publication} onChange={(e) => setForm({...form, annee_publication: e.target.value})} />
                <input type="number" placeholder="Exemplaires" value={form.nombre_exemplaires} onChange={(e) => setForm({...form, nombre_exemplaires: parseInt(e.target.value)})} min="1" />
              </div>
              <button type="submit" className="btn btn-primary btn-full"><FiSave /> {editingLivre ? 'Modifier' : 'Ajouter'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Livres;