// src/pages/admin/GenrePage.jsx
// Halaman admin untuk CRUD Genre: Read, Create, Update, dan Delete.

import { useState, useEffect, useCallback } from 'react';
import { getGenres, createGenre, updateGenre, deleteGenre } from '../../services/genreService';

export default function GenrePage() {
  // ===== STATE DATA & LOADING =====
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // ===== STATE NOTIFIKASI GLOBAL HALAMAN =====
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);

  // ===== STATE FORM TAMBAH (CREATE) =====
  const [formData, setFormData] = useState({ name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // ===== STATE MODAL EDIT (UPDATE) =====
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '' });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editFieldErrors, setEditFieldErrors] = useState({});

  // ===== STATE MODAL KONFIRMASI HAPUS (DELETE) =====
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingGenre, setDeletingGenre] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // ===== FETCH DATA (READ) =====
  const fetchGenres = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await getGenres();
      setGenres(data ?? []);
    } catch (err) {
      if (err.response) {
        setFetchError(
          `Server error ${err.response.status}: ${
            err.response.data?.message || 'Terjadi kesalahan pada server.'
          }`
        );
      } else if (err.request) {
        setFetchError('Tidak dapat terhubung ke server. Periksa koneksi internet atau coba lagi nanti.');
      } else {
        setFetchError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  // ===== MODAL CLOSING CALLBACKS =====
  const handleCloseEdit = useCallback(() => {
    if (editSubmitting) return;
    setEditModalOpen(false);
    setEditingGenre(null);
    setEditFormData({ name: '' });
    setEditError(null);
    setEditFieldErrors({});
  }, [editSubmitting]);

  const handleCloseDelete = useCallback(() => {
    if (deleteSubmitting) return;
    setDeleteModalOpen(false);
    setDeletingGenre(null);
    setDeleteError(null);
  }, [deleteSubmitting]);

  // Tutup modal jika tombol ESC ditekan
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (editModalOpen) handleCloseEdit();
        if (deleteModalOpen) handleCloseDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editModalOpen, handleCloseEdit, deleteModalOpen, handleCloseDelete]);

  // ===== HANDLER TAMBAH GENRE (CREATE) =====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateCreateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Nama genre tidak boleh kosong.';
    }
    return errors;
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setActionSuccess(null);
    setActionError(null);
    setSubmitError(null);
    setFieldErrors({});

    const clientErrors = validateCreateForm();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    try {
      await createGenre({ name: formData.name.trim() });
      setActionSuccess(`Genre "${formData.name.trim()}" berhasil ditambahkan!`);
      setFormData({ name: '' });
      await fetchGenres();
    } catch (err) {
      if (err.response?.status === 422) {
        const serverErrors = err.response.data?.errors || {};
        setFieldErrors(serverErrors);
        setSubmitError('Periksa kembali data yang Anda masukkan.');
      } else if (err.response) {
        setSubmitError(`Gagal menambahkan: ${err.response.data?.message || 'Terjadi kesalahan server.'}`);
      } else if (err.request) {
        setSubmitError('Tidak dapat terhubung ke server. Periksa koneksi internet.');
      } else {
        setSubmitError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetCreate = () => {
    setFormData({ name: '' });
    setFieldErrors({});
    setSubmitError(null);
  };

  // ===== HANDLER EDIT GENRE (UPDATE) =====
  const handleOpenEdit = (genre) => {
    setEditingGenre(genre);
    setEditFormData({ name: genre.name || '' });
    setEditError(null);
    setEditFieldErrors({});
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    if (editFieldErrors[name]) {
      setEditFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setEditError(null);
    setEditFieldErrors({});

    if (!editFormData.name.trim()) {
      setEditFieldErrors({ name: 'Nama genre tidak boleh kosong.' });
      return;
    }

    setEditSubmitting(true);
    try {
      await updateGenre(editingGenre.id, { name: editFormData.name.trim() });
      const updatedName = editFormData.name.trim();
      handleCloseEdit();
      setActionSuccess(`Genre "${updatedName}" berhasil diperbarui!`);
      await fetchGenres();
    } catch (err) {
      if (err.response?.status === 422) {
        const serverErrors = err.response.data?.errors || {};
        setEditFieldErrors(serverErrors);
        setEditError('Periksa kembali data yang Anda masukkan.');
      } else if (err.response) {
        setEditError(`Gagal memperbarui: ${err.response.data?.message || 'Terjadi kesalahan server.'}`);
      } else if (err.request) {
        setEditError('Tidak dapat terhubung ke server. Periksa koneksi internet.');
      } else {
        setEditError(err.message);
      }
    } finally {
      setEditSubmitting(false);
    }
  };

  // ===== HANDLER HAPUS GENRE (DELETE) =====
  const handleOpenDelete = (genre) => {
    setDeletingGenre(genre);
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingGenre) return;

    setDeleteSubmitting(true);
    setDeleteError(null);
    try {
      await deleteGenre(deletingGenre.id);
      const deletedName = deletingGenre.name;
      handleCloseDelete();
      setActionSuccess(`Genre "${deletedName}" berhasil dihapus.`);
      await fetchGenres();
    } catch (err) {
      if (err.response) {
        setDeleteError(`Gagal menghapus: ${err.response.data?.message || 'Terjadi kesalahan server.'}`);
      } else if (err.request) {
        setDeleteError('Tidak dapat terhubung ke server. Periksa koneksi internet.');
      } else {
        setDeleteError(err.message);
      }
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // ===== RENDER =====
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manajemen Genre</h1>
          <p>Kelola data kategori buku: tambah, ubah, dan hapus genre</p>
        </div>
      </div>

      {/* Notifikasi Global Hasil Aksi (Create / Update / Delete) */}
      {actionSuccess && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          <span style={{ flex: 1 }}>{actionSuccess}</span>
          <button
            type="button"
            className="modal-close-btn"
            style={{ width: 24, height: 24, fontSize: '1rem' }}
            onClick={() => setActionSuccess(null)}
            aria-label="Tutup notifikasi"
          >
            ✕
          </button>
        </div>
      )}

      {actionError && (
        <div className="alert alert-error">
          <span className="alert-icon">❌</span>
          <span style={{ flex: 1 }}>{actionError}</span>
          <button
            type="button"
            className="modal-close-btn"
            style={{ width: 24, height: 24, fontSize: '1rem' }}
            onClick={() => setActionError(null)}
            aria-label="Tutup notifikasi"
          >
            ✕
          </button>
        </div>
      )}

      {/* ===== FORM TAMBAH GENRE (CREATE) ===== */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div className="card-icon">➕</div>
          <h2>Tambah Genre Baru</h2>
        </div>
        <div className="card-body">
          {submitError && (
            <div className="alert alert-error">
              <span className="alert-icon">❌</span>
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleCreateSubmit} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="genre-name" className="form-label">
                  Nama Genre <span className="required">*</span>
                </label>
                <input
                  id="genre-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Contoh: Fiksi Ilmiah, Komedi, Misteri..."
                  className={`form-input ${fieldErrors.name ? 'error' : ''}`}
                  disabled={submitting}
                  maxLength={100}
                />
                {fieldErrors.name && (
                  <span className="field-error">
                    {Array.isArray(fieldErrors.name) ? fieldErrors.name[0] : fieldErrors.name}
                  </span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    Menyimpan...
                  </>
                ) : (
                  <>➕ Tambah Genre</>
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleResetCreate}
                disabled={submitting}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ===== TABEL DAFTAR GENRE (READ, UPDATE, DELETE) ===== */}
      <div className="card">
        <div className="card-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="card-icon">🏷️</div>
            <h2>Daftar Genre</h2>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={fetchGenres}
            disabled={loading}
            title="Muat ulang data genre"
          >
            🔄 Refresh
          </button>
        </div>

        {fetchError && (
          <div style={{ padding: '0 1.5rem' }}>
            <div className="alert alert-error" style={{ margin: '1rem 0' }}>
              <span className="alert-icon">⚠️</span>
              <div>
                <strong>Gagal memuat data</strong>
                <p style={{ marginTop: '0.25rem' }}>{fetchError}</p>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '0.75rem' }}
                  onClick={fetchGenres}
                >
                  🔄 Coba Lagi
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-spinner">
            <div className="spinner" />
            <span>Memuat data genre...</span>
          </div>
        )}

        {!loading && !fetchError && (
          <div className="table-wrapper">
            {genres.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏷️</div>
                <h3>Belum ada data genre</h3>
                <p>Gunakan form di atas untuk menambahkan genre pertama.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th>Nama Genre</th>
                    <th style={{ width: '100px' }}>ID</th>
                    <th style={{ width: '170px', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {genres.map((genre, index) => (
                    <tr key={genre.id}>
                      <td className="table-row-number">{index + 1}</td>
                      <td>
                        <span className="badge badge-primary">{genre.name}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        #{genre.id}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div className="action-group">
                          {/* Tombol Edit */}
                          <button
                            type="button"
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => handleOpenEdit(genre)}
                            title={`Edit genre ${genre.name}`}
                          >
                            ✏️ Edit
                          </button>
                          {/* Tombol Delete */}
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleOpenDelete(genre)}
                            title={`Hapus genre ${genre.name}`}
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* ===== MODAL EDIT GENRE (UPDATE) ===== */}
      {editModalOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget && !editSubmitting) {
              handleCloseEdit();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-genre-title"
        >
          <div className="modal-dialog">
            <div className="modal-header">
              <h2 id="edit-genre-title" className="modal-title">
                <span>✏️</span> Edit Genre
              </h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseEdit}
                disabled={editSubmitting}
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} noValidate>
              <div className="modal-body">
                {editError && (
                  <div className="alert alert-error">
                    <span className="alert-icon">❌</span>
                    <span>{editError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="edit-genre-name" className="form-label">
                    Nama Genre <span className="required">*</span>
                  </label>
                  <input
                    id="edit-genre-name"
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    placeholder="Masukkan nama genre..."
                    className={`form-input ${editFieldErrors.name ? 'error' : ''}`}
                    disabled={editSubmitting}
                    maxLength={100}
                    autoFocus
                  />
                  {editFieldErrors.name && (
                    <span className="field-error">
                      {Array.isArray(editFieldErrors.name)
                        ? editFieldErrors.name[0]
                        : editFieldErrors.name}
                    </span>
                  )}
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4 }}>
                    ID: #{editingGenre?.id}
                  </small>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseEdit}
                  disabled={editSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={editSubmitting}
                >
                  {editSubmitting ? (
                    <>
                      <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                      Menyimpan...
                    </>
                  ) : (
                    '💾 Simpan Perubahan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL KONFIRMASI HAPUS GENRE (DELETE) ===== */}
      {deleteModalOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget && !deleteSubmitting) {
              handleCloseDelete();
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-genre-title"
        >
          <div className="modal-dialog confirm-dialog">
            <div className="modal-header">
              <h2 id="delete-genre-title" className="modal-title">
                <span>⚠️</span> Konfirmasi Hapus
              </h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseDelete}
                disabled={deleteSubmitting}
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            <div className="confirm-body">
              <div className="confirm-icon-box">🗑️</div>
              <div className="confirm-text">
                <h3>Hapus Genre Ini?</h3>
                <p>
                  Apakah Anda yakin ingin menghapus genre{' '}
                  <span className="confirm-highlight">{deletingGenre?.name}</span>? Tindakan ini tidak dapat
                  dibatalkan dan data akan dihapus permanen dari sistem.
                </p>
                {deleteError && (
                  <div className="alert alert-error" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                    <span className="alert-icon">❌</span>
                    <span>{deleteError}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseDelete}
                disabled={deleteSubmitting}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
                disabled={deleteSubmitting}
              >
                {deleteSubmitting ? (
                  <>
                    <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
                    Menghapus...
                  </>
                ) : (
                  '🗑️ Ya, Hapus'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
