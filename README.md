# Tugas React JS Lanjutan #2 - Implementasi CRUD (Update & Delete) Genre & Author

**Nama:** Muhammad Rizki  
**Instansi:** Universitas Trisakti  
**Repository:** [https://github.com/064102400020-bit/reactJSLanjutan_pertemuan2_MUHAMMAD-RIZKI_-UNIV-TRISAKTI.git](https://github.com/064102400020-bit/reactJSLanjutan_pertemuan2_MUHAMMAD-RIZKI_-UNIV-TRISAKTI.git)

---

## 📌 Deskripsi Proyek
Proyek frontend React JS ini mengimplementasikan fitur lengkap **CRUD (Create, Read, Update, Delete)** untuk entitas **Genre** dan **Author** pada panel administrasi (**Admin**). Proyek ini merupakan kelanjutan dari Tugas 1 dengan penambahan fitur utama **Update** dan **Delete** menggunakan modal interaktif, validasi data, umpan balik (feedback) visual, dan penanganan asynchronous menggunakan Axios.

Dibangun menggunakan teknologi modern:
- **Vite 8** (Build tool super cepat)
- **React 19**
- **React Router v7**
- **Axios** (HTTP client terpusat)

---

## ⚡ Fitur Utama

### 1. Manajemen Genre
- **READ (GET /genres):** Menampilkan daftar genre buku lengkap dengan ID dan badge label.
- **CREATE (POST /genres):** Form tambah genre dengan validasi client & server, pencegahan double submit, reset form, dan auto-refresh.
- **UPDATE (PUT /genres/:id):**
  - Tombol **Edit** di setiap baris data tabel.
  - Modal interaktif yang otomatis memuat nama genre sebelumnya.
  - Validasi field real-time dan feedback error server.
  - Tombol Simpan Perubahan dan Batal.
  - Loading spinner pada tombol saat request berlangsung.
- **DELETE (DELETE /genres/:id):**
  - Tombol **Hapus** di setiap baris data tabel.
  - Dialog konfirmasi penghapusan dengan peringatan bahaya sebelum eksekusi.
  - Tombol konfirmasi ("Ya, Hapus") dan Batal.
  - Refresh daftar otomatis setelah data berhasil dihapus dari database.

### 2. Manajemen Author
- **READ (GET /authors):** Menampilkan nama lengkap penulis, biografi singkat, dan ID.
- **CREATE (POST /authors):** Form input nama author (wajib) dan biografi (opsional).
- **UPDATE (PUT /authors/:id):**
  - Tombol **Edit** di setiap baris tabel.
  - Modal edit dengan form 2 field (`name` dan `bio`).
  - Data sebelumnya otomatis terisi pada field form.
  - Pengiriman data via HTTP PUT menggunakan Axios.
- **DELETE (DELETE /authors/:id):**
  - Tombol **Hapus** pada setiap baris.
  - Dialog konfirmasi interaktif untuk mencegah ketidaksengajaan.
  - Request DELETE ke endpoint API dan pembaruan tabel seketika.

### 3. Tampilan & UI/UX Admin Modern
- **Dashboard Ringkas:** Menampilkan kartu statistik total Genre dan Author secara dinamis beserta ringkasan status CRUD.
- **Desain Responsif:** Sidebar yang dapat dilipat (*drawer mobile*), overlay gelap, dan form adaptif untuk layar smartphone maupun desktop.
- **Aksesibilitas Modal:** Modal dapat ditutup menggunakan tombol X, tombol Batal, klik di luar area backdrop, maupun tombol keyboard `Escape`.
- **Notifikasi Terpadu:** Alert banner dismissible untuk pesan sukses maupun error API.

---

## 🔌 Integrasi Endpoint API

| Entitas | Operasi | HTTP Method | Endpoint | Payload / Params |
|---|---|---|---|---|
| **Genre** | Read | `GET` | `/genres` | — |
| **Genre** | Create | `POST` | `/genres` | `{ "name": "string" }` |
| **Genre** | Update | `PUT` | `/genres/{id}` | `{ "name": "string" }` |
| **Genre** | Delete | `DELETE` | `/genres/{id}` | Param `id` |
| **Author** | Read | `GET` | `/authors` | — |
| **Author** | Create | `POST` | `/authors` | `{ "name": "string", "bio": "string" }` |
| **Author** | Update | `PUT` | `/authors/{id}` | `{ "name": "string", "bio": "string" }` |
| **Author** | Delete | `DELETE` | `/authors/{id}` | Param `id` |

*Base URL dikonfigurasi melalui file `.env` dengan variabel `VITE_API_BASE_URL`.*

---

## 🚀 Cara Menjalankan Proyek

1. **Clone Repository:**
   ```bash
   git clone https://github.com/064102400020-bit/reactJSLanjutan_pertemuan2_MUHAMMAD-RIZKI_-UNIV-TRISAKTI.git
   cd reactJSLanjutan_pertemuan2_MUHAMMAD-RIZKI_-UNIV-TRISAKTI
   ```

2. **Setup File Environment (.env):**
   Salin dari `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Pastikan variabel `VITE_API_BASE_URL` sudah terisi dengan URL API backend.

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Buka peramban pada alamat `http://localhost:5173/`.

5. **Build untuk Production:**
   ```bash
   npm run build
   ```

---

## 📁 Struktur Folder Proyek
```text
├── public/                 # Static assets & icons
├── src/
│   ├── api/
│   │   └── axios.js        # Konfigurasi instance Axios terpusat
│   ├── layouts/
│   │   └── AdminLayout.jsx # Layout Admin (Sidebar, Topbar, Content Outlet)
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx  # Ringkasan statistik & panduan CRUD
│   │   │   ├── GenrePage.jsx  # CRUD Lengkap Genre (Read, Create, Edit modal, Delete dialog)
│   │   │   └── AuthorPage.jsx # CRUD Lengkap Author (Read, Create, Edit modal, Delete dialog)
│   │   └── NotFound.jsx    # Halaman fallback 404
│   ├── services/
│   │   ├── genreService.js # API call: getGenres, createGenre, updateGenre, deleteGenre
│   │   └── authorService.js# API call: getAuthors, createAuthor, updateAuthor, deleteAuthor
│   ├── App.jsx             # Definisi routing utama
│   ├── index.css           # Styling modern, responsif, dan modal animations
│   └── main.jsx            # Entry point React 19
├── .env.example            # Template variabel environment
├── .gitignore              # Mengabaikan file sensitif (.env, node_modules, dist)
├── package.json
└── vite.config.js
```
