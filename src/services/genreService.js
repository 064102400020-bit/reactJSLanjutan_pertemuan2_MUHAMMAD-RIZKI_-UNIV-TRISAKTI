// src/services/genreService.js
// Semua fungsi pemanggilan API terkait Genre (CRUD Lengkap).

import apiClient from '../api/axios';

/**
 * Ambil semua genre dari server.
 * @returns {Promise<Array>} Array objek genre
 */
export const getGenres = async () => {
  const response = await apiClient.get('/genres');
  // Tangani kedua format: array langsung atau { data: [...] }
  return Array.isArray(response.data) ? response.data : response.data.data;
};

/**
 * Tambah genre baru.
 * @param {{ name: string }} genreData - Data genre yang akan dikirim
 * @returns {Promise<Object>} Objek genre yang baru dibuat
 */
export const createGenre = async (genreData) => {
  const response = await apiClient.post('/genres', genreData);
  return response.data;
};

/**
 * Perbarui data genre berdasarkan ID (Update).
 * @param {string|number} id - ID genre yang akan diperbarui
 * @param {{ name: string }} genreData - Data genre yang diperbarui
 * @returns {Promise<Object>} Respons data dari server
 */
export const updateGenre = async (id, genreData) => {
  const response = await apiClient.put(`/genres/${id}`, genreData);
  return response.data;
};

/**
 * Hapus data genre berdasarkan ID (Delete).
 * @param {string|number} id - ID genre yang akan dihapus
 * @returns {Promise<Object>} Respons dari server
 */
export const deleteGenre = async (id) => {
  const response = await apiClient.delete(`/genres/${id}`);
  return response.data;
};
