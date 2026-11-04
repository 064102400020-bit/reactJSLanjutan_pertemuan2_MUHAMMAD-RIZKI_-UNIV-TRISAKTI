// src/pages/admin/Dashboard.jsx
// Halaman dashboard admin — ringkasan data dan tautan cepat manajemen.

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGenres } from '../../services/genreService';
import { getAuthors } from '../../services/authorService';

export default function Dashboard() {
  const [genreCount, setGenreCount] = useState(null);
  const [authorCount, setAuthorCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCounts = async () => {
      try {
        const [genres, authors] = await Promise.allSettled([
          getGenres(),
          getAuthors(),
        ]);

        if (!isMounted) return;

        if (genres.status === 'fulfilled' && Array.isArray(genres.value)) {
          setGenreCount(genres.value.length);
        } else {
          setGenreCount(0);
        }

        if (authors.status === 'fulfilled' && Array.isArray(authors.value)) {
          setAuthorCount(authors.value.length);
        } else {
          setAuthorCount(0);
        }
      } catch {
        if (isMounted) {
          setGenreCount(0);
          setAuthorCount(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard Admin</h1>
          <p>Selamat datang di panel administrasi BookAdmin - Kelola data buku dengan mudah</p>
        </div>
      </div>

      {/* Ringkasan Statistik */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon">🏷️</div>
          <div className="stat-card-label">Total Genre</div>
          <div className="stat-card-value">
            {loading ? <span className="spinner" style={{ width: 24, height: 24 }} /> : (genreCount ?? '—')}
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <Link
              to="/admin/genres"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
            >
              Kelola Genre →
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon">✍️</div>
          <div className="stat-card-label">Total Author</div>
          <div className="stat-card-value">
            {loading ? <span className="spinner" style={{ width: 24, height: 24 }} /> : (authorCount ?? '—')}
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <Link
              to="/admin/authors"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%' }}
            >
              Kelola Author →
            </Link>
          </div>
        </div>
      </div>

      {/* Info Card Fitur Tugas */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">⚡</div>
          <h2>Fitur CRUD Tersedia</h2>
        </div>
        <div className="card-body">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Panel ini mendukung operasi lengkap <strong>Create, Read, Update, Delete (CRUD)</strong> untuk:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🏷️</span> Manajemen Genre
              </h3>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                <li><strong>Read:</strong> Menampilkan seluruh kategori genre</li>
                <li><strong>Create:</strong> Menambahkan genre baru</li>
                <li><strong>Update:</strong> Mengedit nama genre via modal interaktif</li>
                <li><strong>Delete:</strong> Menghapus genre dengan konfirmasi dialog</li>
              </ul>
            </div>

            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>✍️</span> Manajemen Author
              </h3>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                <li><strong>Read:</strong> Menampilkan seluruh daftar penulis</li>
                <li><strong>Create:</strong> Menambahkan author baru (nama & bio)</li>
                <li><strong>Update:</strong> Mengedit author & bio via modal interaktif</li>
                <li><strong>Delete:</strong> Menghapus author dengan konfirmasi dialog</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
