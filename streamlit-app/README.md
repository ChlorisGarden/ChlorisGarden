# Streamlit App — ChlorisGarden

Folder ini berisi dashboard Streamlit untuk kebutuhan demo dan side quest Data Science.

## Deskripsi

ChlorisGarden adalah aplikasi web berbasis AI yang membantu pengguna mendeteksi penyakit pada tanaman pangan melalui citra daun. Pada versi pilot Streamlit ini, model yang digunakan masih berfokus pada tanaman tomat dengan 4 label:

- `bacterial_spot`
- `early_blight`
- `healthy`
- `late_blight`

## Struktur Folder

```text
streamlit-app/
├── app.py
├── requirements.txt
├── README.md
└── models/
    ├── plant_disease_v1.keras
    └── class_names.json
```

## Menjalankan Lokal

Dari root repository:

```bash
pip install -r streamlit-app/requirements.txt
streamlit run streamlit-app/app.py
```

## Menjalankan Prediksi Model

Agar fitur prediksi aktif, letakkan file berikut di folder `streamlit-app/models/`:

```text
plant_disease_v1.keras
class_names.json
```

Jika model belum tersedia, dashboard tetap bisa berjalan untuk menampilkan overview, data science dashboard, ensiklopedia, dan informasi tim.

## Deployment ke Streamlit Cloud

1. Pastikan repo GitHub sudah berisi folder `streamlit-app/`.
2. Pastikan `streamlit-app/requirements.txt` sudah ada.
3. Push semua perubahan ke GitHub.
4. Buka Streamlit Community Cloud.
5. Pilih **New app** atau **Deploy an app**.
6. Pilih repository, branch, dan isi main file path:

```text
streamlit-app/app.py
```

7. Klik **Deploy**.
8. Setelah berhasil, salin link publik Streamlit dan masukkan ke laporan/side quest.

## Catatan Deployment

Jika file model terlalu besar untuk GitHub, ada dua pilihan:

1. Deploy dashboard tanpa model.
   - Fitur data science dashboard tetap bisa diakses publik.
   - Fitur prediksi akan menampilkan pesan bahwa model belum tersedia.

2. Simpan model di cloud storage.
   - Contoh: Google Drive, Hugging Face, AWS S3.
   - Tambahkan logic download model di `app.py` jika dibutuhkan.
   - Simpan credential menggunakan Streamlit Secrets, bukan di source code.

Untuk side quest "Melakukan deployment dashboard ke Streamlit Cloud agar dapat diakses secara publik", opsi pertama sudah cukup apabila yang diminta adalah dashboard publik, bukan inference model penuh.
