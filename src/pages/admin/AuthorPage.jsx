// src/pages/admin/AuthorPage.jsx
// Halaman admin untuk CRUD Author: Read, Create, Update, dan Delete.

import { useState, useEffect, useCallback } from 'react';
import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from '../../services/authorService';

export default function AuthorPage() {
  // ===== STATE DATA & LOADING =====
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // ===== STATE NOTIFIKASI GLOBAL HALAMAN =====
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);

  // ===== STATE FORM TAMBAH (CREATE) =====
  const [formData, setFormData] = useState({ name: '', bio: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // ===== STATE MODAL EDIT (UPDATE) =====
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', bio: '' });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editFieldErrors, setEditFieldErrors] = useState({});

  // ===== STATE MODAL KONFIRMASI HAPUS (DELETE) =====
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingAuthor, setDeletingAuthor] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // ===== FETCH DATA (READ) =====
  const fetchAuthors = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await getAuthors();
      setAuthors(data ?? []);
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
    fetchAuthors();
  }, [fetchAuthors]);

  // ===== MODAL CLOSING CALLBACKS =====
  const handleCloseEdit = useCallback(() => {
    if (editSubmitting) return;
    setEditModalOpen(false);
    setEditingAuthor(null);
    setEditFormData({ name: '', bio: '' });
    setEditError(null);
    setEditFieldErrors({});
  }, [editSubmitting]);

  const handleCloseDelete = useCallback(() => {
    if (deleteSubmitting) return;
    setDeleteModalOpen(false);
    setDeletingAuthor(null);
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

  // ===== HANDLER TAMBAH AUTHOR (CREATE) =====
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
      errors.name = 'Nama author tidak boleh kosong.';
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
      await createAuthor({
        name: formData.name.trim(),
        bio: formData.bio.trim() || undefined,
      });
      setActionSuccess(`Author "${formData.name.trim()}" berhasil ditambahkan!`);
      setFormData({ name: '', bio: '' });
      await fetchAuthors();
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
    setFormData({ name: '', bio: '' });
    setFieldErrors({});
    setSubmitError(null);
  };

  // ===== HANDLER EDIT AUTHOR (UPDATE) =====
  const handleOpenEdit = (author) => {
    setEditingAuthor(author);
    setEditFormData({
      name: author.name || '',
      bio: author.bio || '',
    });
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
      setEditFieldErrors({ name: 'Nama author tidak boleh kosong.' });
      return;
    }

    setEditSubmitting(true);
    try {
      await updateAuthor(editingAuthor.id, {
        name: editFormData.name.trim(),
        bio: editFormData.bio.trim() || '',
      });
      const updatedName = editFormData.name.trim();
      handleCloseEdit();
      setActionSuccess(`Author "${updatedName}" berhasil diperbarui!`);
      await fetchAuthors();
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

  // ===== HANDLER HAPUS AUTHOR (DELETE) =====
  const handleOpenDelete = (author) => {
    setDeletingAuthor(author);
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAuthor) return;

    setDeleteSubmitting(true);
    setDeleteError(null);
    try {
      await deleteAuthor(deletingAuthor.id);
      const deletedName = deletingAuthor.name;
      handleCloseDelete();
      setActionSuccess(`Author "${deletedName}" berhasil dihapus.`);
      await fetchAuthors();
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
          <h1>Manajemen Author</h1>
          <p>Kelola data penulis buku: tambah, ubah biografi, dan hapus author</p>
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

      {/* ===== FORM TAMBAH AUTHOR (CREATE) ===== */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div className="card-icon">➕</div>
          <h2>Tambah Author Baru</h2>
        </div>
        <div className="card-body">
          {submitError && (
            <div className="alert alert-error">
              <span className="alert-icon">❌</span>
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleCreateSubmit} noValidate>
            <div className="form-grid two-col">
              <div className="form-group">
                <label htmlFor="author-name" className="form-label">
                  Nama Author <span className="required">*</span>
                </label>
                <input
                  id="author-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Contoh: Andrea Hirata, Tere Liye..."
                  className={`form-input ${fieldErrors.name ? 'error' : ''}`}
                  disabled={submitting}
                  maxLength={150}
                />
                {fieldErrors.name && (
                  <span className="field-error">
                    {Array.isArray(fieldErrors.name) ? fieldErrors.name[0] : fieldErrors.name}
                  </span>
                )}
              </div>

              <div />

              <div className="form-group full-width">
                <label htmlFor="author-bio" className="form-label">
                  Bio / Deskripsi
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 4 }}>
                    (opsional)
                  </span>
                </label>
                <textarea
                  id="author-bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tulis biografi singkat penulis..."
                  className={`form-textarea ${fieldErrors.bio ? 'error' : ''}`}
                  disabled={submitting}
                  rows={3}
                />
                {fieldErrors.bio && (
                  <span className="field-error">
                    {Array.isArray(fieldErrors.bio) ? fieldErrors.bio[0] : fieldErrors.bio}
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
                  <>➕ Tambah Author</>
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

      {/* ===== TABEL DAFTAR AUTHOR (READ, UPDATE, DELETE) ===== */}
      <div className="card">
        <div className="card-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="card-icon">✍️</div>
            <h2>Daftar Author</h2>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={fetchAuthors}
            disabled={loading}
            title="Muat ulang data author"
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
                  onClick={fetchAuthors}
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
            <span>Memuat data author...</span>
          </div>
        )}

        {!loading && !fetchError && (
          <div className="table-wrapper">
            {authors.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">✍️</div>
                <h3>Belum ada data author</h3>
                <p>Gunakan form di atas untuk menambahkan author pertama.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>#</th>
                    <th>Nama Author</th>
                    <th>Bio</th>
                    <th style={{ width: '100px' }}>ID</th>
                    <th style={{ width: '170px', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map((author, index) => (
                    <tr key={author.id}>
                      <td className="table-row-number">{index + 1}</td>
                      <td>
                        <strong>{author.name}</strong>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {author.bio ? (
                          author.bio.length > 80 ? (
                            `${author.bio.slice(0, 80)}...`
                          ) : (
                            author.bio
                          )
                        ) : (
                          <em>—</em>
                        )}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        #{author.id}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div className="action-group">
                          {/* Tombol Edit */}
                          <button
                            type="button"
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => handleOpenEdit(author)}
                            title={`Edit author ${author.name}`}
                          >
                            ✏️ Edit
                          </button>
                          {/* Tombol Delete */}
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleOpenDelete(author)}
                            title={`Hapus author ${author.name}`}
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

      {/* ===== MODAL EDIT AUTHOR (UPDATE) ===== */}
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
          aria-labelledby="edit-author-title"
        >
          <div className="modal-dialog">
            <div className="modal-header">
              <h2 id="edit-author-title" className="modal-title">
                <span>✏️</span> Edit Author
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

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label htmlFor="edit-author-name" className="form-label">
                    Nama Author <span className="required">*</span>
                  </label>
                  <input
                    id="edit-author-name"
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    placeholder="Masukkan nama author..."
                    className={`form-input ${editFieldErrors.name ? 'error' : ''}`}
                    disabled={editSubmitting}
                    maxLength={150}
                    autoFocus
                  />
                  {editFieldErrors.name && (
                    <span className="field-error">
                      {Array.isArray(editFieldErrors.name)
                        ? editFieldErrors.name[0]
                        : editFieldErrors.name}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="edit-author-bio" className="form-label">
                    Bio / Deskripsi
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 4 }}>
                      (opsional)
                    </span>
                  </label>
                  <textarea
                    id="edit-author-bio"
                    name="bio"
                    value={editFormData.bio}
                    onChange={handleEditChange}
                    placeholder="Tulis biografi singkat penulis..."
                    className={`form-textarea ${editFieldErrors.bio ? 'error' : ''}`}
                    disabled={editSubmitting}
                    rows={4}
                  />
                  {editFieldErrors.bio && (
                    <span className="field-error">
                      {Array.isArray(editFieldErrors.bio)
                        ? editFieldErrors.bio[0]
                        : editFieldErrors.bio}
                    </span>
                  )}
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4 }}>
                    ID: #{editingAuthor?.id}
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

      {/* ===== MODAL KONFIRMASI HAPUS AUTHOR (DELETE) ===== */}
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
          aria-labelledby="delete-author-title"
        >
          <div className="modal-dialog confirm-dialog">
            <div className="modal-header">
              <h2 id="delete-author-title" className="modal-title">
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
                <h3>Hapus Author Ini?</h3>
                <p>
                  Apakah Anda yakin ingin menghapus author{' '}
                  <span className="confirm-highlight">{deletingAuthor?.name}</span>? Tindakan ini tidak dapat
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
