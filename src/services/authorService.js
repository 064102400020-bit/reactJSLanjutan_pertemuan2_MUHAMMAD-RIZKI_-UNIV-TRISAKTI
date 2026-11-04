// src/services/authorService.js
// Semua fungsi pemanggilan API terkait Author (CRUD Lengkap).

import apiClient from '../api/axios';

/**
 * Ambil semua author dari server.
 * @returns {Promise<Array>} Array objek author
 */
export const getAuthors = async () => {
  const response = await apiClient.get('/authors');
  // Tangani kedua format: array langsung atau { data: [...] }
  return Array.isArray(response.data) ? response.data : response.data.data;
};

/**
 * Tambah author baru.
 * @param {{ name: string, bio?: string }} authorData - Data author yang akan dikirim
 * @returns {Promise<Object>} Objek author yang baru dibuat
 */
export const createAuthor = async (authorData) => {
  const response = await apiClient.post('/authors', authorData);
  return response.data;
};

/**
 * Perbarui data author berdasarkan ID (Update).
 * @param {string|number} id - ID author yang akan diperbarui
 * @param {{ name: string, bio?: string }} authorData - Data author yang diperbarui
 * @returns {Promise<Object>} Respons data dari server
 */
export const updateAuthor = async (id, authorData) => {
  const response = await apiClient.put(`/authors/${id}`, authorData);
  return response.data;
};

/**
 * Hapus data author berdasarkan ID (Delete).
 * @param {string|number} id - ID author yang akan dihapus
 * @returns {Promise<Object>} Respons dari server
 */
export const deleteAuthor = async (id) => {
  const response = await apiClient.delete(`/authors/${id}`);
  return response.data;
};
