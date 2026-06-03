# Frontend — Chloris Garden

Aplikasi web untuk klasifikasi kesehatan tanaman pangan. Dibangun dengan **React**, **Vite**, dan **Tailwind**, aplikasi ini memungkinkan pengguna mengunggah foto daun tanaman dan mendapatkan hasil deteksi penyakit secara real-time.

---

## 📁 Struktur Folder

```
frontend/
├── src/                  # Source code utama
├── index.html            # Entry point HTML
├── vite.config.js        # Konfigurasi Vite
├── eslint.config.js      # Konfigurasi ESLint
├── vercel.json           # Konfigurasi deployment Vercel
└── package.json          # Dependensi dan skrip
```

---

## ✨ Fitur

- **Unggah & klasifikasi gambar** — deteksi penyakit tanaman dari foto daun
- **Dashboard** — ringkasan statistik scan dan aktivitas pengguna
- **Riwayat klasifikasi** — daftar hasil scan dengan filter, pencarian, dan paginasi
- **Ensiklopedia penyakit** — informasi lengkap penyakit, gejala, dan penanganan
- **Autentikasi** — register, login, lupa password, dan reset password
- **Manajemen profil** — ubah nama, password, dan foto profil

---

## ⚙️ Instalasi & Menjalankan Lokal

### Prasyarat

- Node.js >= 18
- Backend dan ML Service sudah berjalan (lihat README masing-masing)

### Langkah Setup

1. **Masuk ke folder frontend**
   ```bash
   cd frontend
   ```

2. **Install dependensi**
   ```bash
   npm install
   ```

3. **Buat file environment**
   ```bash
   cp .env.example .env
   ```
   Isi variabel VITE_API_BASE_URL di file `.env`:   # Jika kosong, secara default akan menggunakan `http:localhost:3000`

4. **Jalankan development server**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173`


## 📦 Dependensi Utama

| Package              | Keterangan                                  |
|----------------------|---------------------------------------------|
| react 19             | Library UI utama                            |
| react-router-dom 7   | Routing halaman                             |
| axios                | HTTP client untuk komunikasi dengan API     |
| tailwindcss 4        | Utility-first CSS framework                 |
| chart.js + react-chartjs-2 | Visualisasi data dan grafik          |
| lucide-react         | Library ikon                                |
| driver.js            | Fitur guided tour / onboarding pengguna     |
| vite                 | Build tool dan development server           |

## 🔗 Keterkaitan dengan Layanan Lain

Frontend berkomunikasi **hanya dengan Backend** melalui REST API. Pastikan URL Backend sudah dikonfigurasi dengan benar di variabel environment `VITE_API_BASE_URL`.

Untuk dokumentasi lengkap endpoint API, lihat [`backend/README.md`](../backend/README.md).