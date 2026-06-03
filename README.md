# ChlorisGarden

ChlorisGarden adalah aplikasi web berbasis AI yang membantu pengguna mendeteksi penyakit pada tanaman pangan melalui citra daun. Pengguna dapat mengunggah foto atau menggunakan kamera, lalu sistem akan menampilkan hasil diagnosis, tingkat confidence, serta informasi penyakit yang relevan.

Project ini dikembangkan sebagai Capstone Project Coding Camp 2026 by DBS Bank oleh tim CC26-PSU175.

## Tujuan Project

ChlorisGarden dibuat untuk memberikan alat bantu deteksi awal penyakit tanaman yang mudah digunakan, terutama bagi petani, pelajar, dan masyarakat umum yang ingin belajar merawat tanaman pangan. Hasil prediksi dari aplikasi ini bersifat rekomendasi awal dan tidak menggantikan diagnosis dari ahli pertanian.

## Fitur Utama

- Deteksi penyakit tanaman tomat melalui upload gambar atau kamera.
- Hasil diagnosis berbasis model Machine Learning.
- Informasi confidence score dari hasil prediksi.
- Ensiklopedia penyakit tanaman berisi gejala, penyebab, pencegahan, dan penanganan.
- Riwayat hasil scan pengguna.
- Dashboard ringkasan aktivitas scan.
- Autentikasi pengguna: register, login, lupa password, dan reset password.
- Pengaturan profil, bahasa, dan tema tampilan.

## Label Deteksi Model

Pada versi pilot, model ChlorisGarden mendukung 4 label berikut:

| Label Model | Keterangan |
|---|---|
| `bacterial_spot` | Penyakit bercak bakteri pada daun tomat |
| `early_blight` | Penyakit hawar awal pada daun tomat |
| `healthy` | Daun tomat dalam kondisi sehat |
| `late_blight` | Penyakit hawar akhir pada daun tomat |

## Teknologi yang Digunakan

Project ChlorisGarden terdiri dari beberapa bagian utama:

| Bagian | Teknologi |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js, JWT Authentication |
| Machine Learning | TensorFlow/Keras |
| Model Format | `.keras` |
| Storage | AWS S3 |
| Deployment Frontend | Vercel |
| Deployment Backend/ML Service | Cloud Server / AWS EC2 |

## Struktur Repository

```text
ChlorisGarden/
├── backend/              # Source code REST API dan dokumentasi endpoint
├── frontend/             # Source code aplikasi web
├── ml-service/           # Service/API untuk menjalankan model Machine Learning
├── notebooks/            # Notebook training dan eksperimen model
├── docs/                 # Dokumentasi pendukung project
├── README.md             # Dokumentasi utama repository
├── DATA_DICTIONARY.md    # Data dictionary dataset dan output model
├── .env.example          # Template environment variable
└── .gitignore            # Daftar file/folder yang tidak di-push ke GitHub
```

> Catatan: Struktur folder dapat disesuaikan dengan isi repository final. Jika nama folder berbeda, sesuaikan bagian ini sebelum push ke GitHub.

## Dokumentasi Folder

Untuk detail teknis, lihat README pada masing-masing folder:

- [`frontend/README.md`](frontend/README.md) — panduan menjalankan dan memahami aplikasi frontend.
- [`backend/README.md`](backend/README.md) — dokumentasi REST API, autentikasi, klasifikasi, dashboard, dan data penyakit.
- [`ml-service/README.md`](ml-service/README.md) — panduan menjalankan service prediksi model, jika tersedia.
- [`DATA_DICTIONARY.md`](DATA_DICTIONARY.md) — penjelasan dataset, label model, dan format output prediksi.

## Cara Menjalankan Project

Secara umum, project dijalankan melalui beberapa service berikut:

1. Jalankan backend API.
2. Jalankan ML service untuk prediksi gambar.
3. Jalankan frontend web app.
4. Hubungkan frontend ke backend melalui environment variable.
5. Hubungkan backend ke ML service dan storage sesuai konfigurasi `.env`.

Instruksi detail dapat dilihat di README masing-masing folder.

## Environment Variable

Repository ini menyediakan file `.env.example` sebagai template konfigurasi. Untuk menjalankan project secara lokal, salin file tersebut menjadi `.env`, lalu isi nilainya sesuai kebutuhan environment masing-masing.

```bash
cp .env.example .env
```

Jangan mengunggah file `.env` asli ke GitHub karena dapat berisi credential, token, database URL, atau secret key.

## Model Machine Learning

Model Machine Learning yang digunakan pada project ini adalah model klasifikasi gambar daun tomat dengan format `.keras`. Jika ukuran model terlalu besar untuk GitHub, simpan model pada layanan eksternal seperti Google Drive, Hugging Face, AWS S3, atau penyimpanan cloud lain, lalu cantumkan tautannya pada bagian ini.

```text
Model file: plant_disease_v1.keras
Class names: class_names.json
```

## Tim Pengembang

| Nama | Peran | Bidang |
|---|---|---|
| Moch. Zacky Febrio | AI Engineering | Kecerdasan Buatan |
| Mario Cristian Simatupang | AI Engineering | Kecerdasan Buatan |
| Raihan Fathir Muhammad | FullStack Developer | Pengembangan Web |
| Muhammad Rafhli Alfarizi | FullStack Developer | Pengembangan Web |
| Tiara Christiani Sinaga | Data Science | Ilmu Data |
| Katarina Susi Wulandari | Data Science | Ilmu Data |

## Status Project

Project ini masih berada pada tahap pengembangan awal/pilot. Saat ini, ChlorisGarden berfokus pada deteksi penyakit tanaman tomat dengan 4 label utama. Pengembangan berikutnya dapat mencakup penambahan jenis tanaman pangan lain, peningkatan dataset, peningkatan akurasi model, serta penyempurnaan fitur edukasi untuk pengguna.

## License

Project ini menggunakan MIT License.

Dataset, model, library, dan aset pihak ketiga yang digunakan dalam project ini tetap mengikuti lisensi dari sumber masing-masing.
