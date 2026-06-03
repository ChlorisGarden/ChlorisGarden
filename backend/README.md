# API Documentation — Plant Disease Detection App

Dokumentasi ini menjelaskan seluruh endpoint REST API yang tersedia pada aplikasi Plant Disease Detection. API ini dibangun menggunakan Node.js dengan framework Express dan menggunakan JWT untuk autentikasi.

---

## Autentikasi

Sebagian besar endpoint memerlukan token JWT yang dikirimkan melalui header `Authorization`:

```
Authorization: Bearer <token>
```

Token diperoleh setelah berhasil melakukan **registrasi** atau **login**.

---

## Daftar Endpoint

- [Auth](#1-auth)
- [Klasifikasi](#2-klasifikasi)
- [Dashboard](#3-dashboard)
- [Penyakit](#4-penyakit)

---

## 1. Auth

Base path: `/auth`

### POST `/auth/register`

Mendaftarkan pengguna baru ke dalam sistem.

**Request Body** (`application/json`)

| Field      | Tipe   | Wajib | Keterangan                    |
|------------|--------|-------|-------------------------------|
| `name`     | string | Ya    | Nama lengkap pengguna         |
| `email`    | string | Ya    | Alamat email yang valid       |
| `password` | string | Ya    | Minimal 8 karakter            |

**Response Sukses** `201 Created`

```json
{
  "message": "Registrasi berhasil",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "profileImage": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "<jwt_token>"
}
```

**Response Error**

| Kode | Pesan                        | Penyebab                              |
|------|------------------------------|---------------------------------------|
| 400  | Semua field wajib diisi      | Terdapat field yang kosong            |
| 400  | Format email tidak valid     | Format email tidak sesuai             |
| 400  | Password minimal 8 karakter  | Password terlalu pendek               |
| 409  | Email sudah terdaftar        | Email telah digunakan akun lain       |
| 500  | Terjadi kesalahan server     | Kesalahan internal server             |

---

### POST `/auth/login`

Mengautentikasi pengguna dan mengembalikan token JWT.

**Request Body** (`application/json`)

| Field      | Tipe   | Wajib | Keterangan              |
|------------|--------|-------|-------------------------|
| `email`    | string | Ya    | Alamat email pengguna   |
| `password` | string | Ya    | Password pengguna       |

**Response Sukses** `200 OK`

```json
{
  "message": "Login berhasil",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "profileImage": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "<jwt_token>"
}
```

**Response Error**

| Kode | Pesan                        | Penyebab                              |
|------|------------------------------|---------------------------------------|
| 400  | Email dan password wajib diisi | Field kosong                        |
| 401  | Email atau password salah    | Kredensial tidak valid                |
| 500  | Terjadi kesalahan server     | Kesalahan internal server             |

---

### GET `/auth/me`

🔒 *Memerlukan autentikasi*

Mengambil data profil pengguna yang sedang login.

**Response Sukses** `200 OK`

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "profileImage": "https://...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### PUT `/auth/profile/name`

🔒 *Memerlukan autentikasi*

Memperbarui nama pengguna yang sedang login.

**Request Body** (`application/json`)

| Field  | Tipe   | Wajib | Keterangan              |
|--------|--------|-------|-------------------------|
| `name` | string | Ya    | Nama baru, minimal 3 karakter |

**Response Sukses** `200 OK`

```json
{
  "message": "Nama berhasil diperbarui.",
  "user": { ... }
}
```

**Response Error**

| Kode | Pesan                        | Penyebab                    |
|------|------------------------------|-----------------------------|
| 400  | Nama tidak boleh kosong      | Field `name` kosong         |
| 400  | Nama minimal 3 karakter      | Nama terlalu pendek         |
| 500  | Terjadi kesalahan server     | Kesalahan internal server   |

---

### PUT `/auth/change-password`

🔒 *Memerlukan autentikasi*

Mengubah password pengguna yang sedang login.

**Request Body** (`application/json`)

| Field                | Tipe   | Wajib | Keterangan                          |
|----------------------|--------|-------|-------------------------------------|
| `currentPassword`    | string | Ya    | Password saat ini                   |
| `newPassword`        | string | Ya    | Password baru, minimal 8 karakter   |
| `confirmNewPassword` | string | Ya    | Harus sama dengan `newPassword`     |

**Response Sukses** `200 OK`

```json
{
  "message": "Password berhasil diubah."
}
```

**Response Error**

| Kode | Pesan                                            | Penyebab                              |
|------|--------------------------------------------------|---------------------------------------|
| 400  | Semua field wajib diisi                          | Terdapat field yang kosong            |
| 400  | Password baru minimal 8 karakter                 | Password baru terlalu pendek          |
| 400  | Konfirmasi password tidak cocok                  | `newPassword` ≠ `confirmNewPassword`  |
| 400  | Password baru tidak boleh sama dengan lama       | Password tidak berubah                |
| 401  | Password saat ini tidak valid                    | `currentPassword` salah               |
| 404  | User tidak ditemukan                             | Token menunjuk user yang tidak ada    |
| 500  | Terjadi kesalahan server                         | Kesalahan internal server             |

---

### PUT `/auth/profile/image`

🔒 *Memerlukan autentikasi*

Mengunggah atau memperbarui foto profil pengguna. Gambar lama akan otomatis dihapus dari storage.

**Request** `multipart/form-data`

| Field   | Tipe | Wajib | Keterangan          |
|---------|------|-------|---------------------|
| `image` | file | Ya    | File gambar profil  |

**Response Sukses** `200 OK`

```json
{
  "message": "Foto profil berhasil diperbarui.",
  "user": { ... }
}
```

**Response Error**

| Kode | Pesan                        | Penyebab                    |
|------|------------------------------|-----------------------------|
| 400  | Foto profil wajib diunggah   | Tidak ada file yang dikirim |
| 500  | Terjadi kesalahan server     | Kesalahan internal server   |

---

### DELETE `/auth/profile/image`

🔒 *Memerlukan autentikasi*

Menghapus foto profil pengguna yang sedang login.

**Response Sukses** `200 OK`

```json
{
  "message": "Foto profil berhasil dihapus."
}
```

**Response Error**

| Kode | Pesan                                  | Penyebab                       |
|------|----------------------------------------|--------------------------------|
| 404  | Tidak ada foto profil yang tersimpan   | Pengguna belum memiliki foto   |
| 500  | Terjadi kesalahan server               | Kesalahan internal server      |

---

### DELETE `/auth/account`

🔒 *Memerlukan autentikasi*

Menghapus akun pengguna secara permanen beserta seluruh data terkait (termasuk riwayat klasifikasi dan foto profil).

**Request Body** (`application/json`)

| Field      | Tipe   | Wajib | Keterangan                          |
|------------|--------|-------|-------------------------------------|
| `password` | string | Ya    | Password sebagai konfirmasi penghapusan |

**Response Sukses** `200 OK`

```json
{
  "message": "Akun berhasil dihapus."
}
```

**Response Error**

| Kode | Pesan                        | Penyebab                    |
|------|------------------------------|-----------------------------|
| 400  | Password wajib diisi untuk konfirmasi | Field kosong         |
| 401  | Password tidak valid         | Password salah              |
| 404  | User tidak ditemukan         | User tidak ada              |
| 500  | Terjadi kesalahan server     | Kesalahan internal server   |

---

### POST `/auth/forgot-password`

Mengirimkan email berisi tautan reset password kepada pengguna.

> Catatan: Respons selalu `200 OK` meskipun email tidak terdaftar, untuk mencegah enumerasi akun.

**Request Body** (`application/json`)

| Field   | Tipe   | Wajib | Keterangan              |
|---------|--------|-------|-------------------------|
| `email` | string | Ya    | Alamat email pengguna   |

**Response Sukses** `200 OK`

```json
{
  "message": "Jika email terdaftar, link reset akan dikirimkan."
}
```

---

### POST `/auth/reset-password`

Mereset password menggunakan token yang diterima melalui email. Token berlaku selama **1 jam**.

**Request Body** (`application/json`)

| Field                | Tipe   | Wajib | Keterangan                        |
|----------------------|--------|-------|-----------------------------------|
| `token`              | string | Ya    | Token dari tautan email           |
| `newPassword`        | string | Ya    | Password baru, minimal 8 karakter |
| `confirmNewPassword` | string | Ya    | Harus sama dengan `newPassword`   |

**Response Sukses** `200 OK`

```json
{
  "message": "Password berhasil direset. Silakan login kembali."
}
```

**Response Error**

| Kode | Pesan                                | Penyebab                              |
|------|--------------------------------------|---------------------------------------|
| 400  | Semua field wajib diisi              | Terdapat field yang kosong            |
| 400  | Password minimal 8 karakter          | Password terlalu pendek               |
| 400  | Konfirmasi password tidak cocok      | `newPassword` ≠ `confirmNewPassword`  |
| 400  | Token tidak valid atau sudah expired | Token salah atau kadaluarsa           |
| 500  | Terjadi kesalahan server             | Kesalahan internal server             |

---

## 2. Klasifikasi

Base path: `/api/classify`

### POST `/api/classify`

🔒 *Memerlukan autentikasi*

Mengunggah gambar tanaman untuk diklasifikasikan oleh model AI. Hasil klasifikasi akan disimpan ke dalam riwayat pengguna.

**Request** `multipart/form-data`

| Field   | Tipe | Wajib | Keterangan                       |
|---------|------|-------|----------------------------------|
| `image` | file | Ya    | Gambar tanaman yang akan dianalisis |

**Response Sukses** `201 Created`

```json
{
  "message": "Klasifikasi berhasil",
  "result": {
    "classificationId": 42,
    "disease": {
      "name": "Bacterial Spot",
      "slug": "tomato-bacterial-spot",
      "scientificName": "Xanthomonas campestris",
      "severity": "high",
      "description": "...",
      "symptoms": "...",
      "treatment": "...",
      "preventiveMeasures": "...",
      "rootCauses": "..."
    },
    "confidenceScore": 0.97,
    "imageUrl": "https://...",
    "classifiedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Label yang Didukung**

| Label Model          | Slug Penyakit             |
|----------------------|---------------------------|
| `bacterial_spot`     | `tomato-bacterial-spot`   |
| `early_blight`       | `tomato-early-blight`     |
| `healthy`            | `tomato-healthy`          |
| `late_blight`        | `tomato-late-blight`      |

**Response Error**

| Kode | Pesan                                    | Penyebab                          |
|------|------------------------------------------|-----------------------------------|
| 400  | Gambar wajib diunggah                    | Tidak ada file yang dikirim       |
| 500  | Penyakit tidak ditemukan di database     | Label tidak terdapat di database  |
| 500  | Terjadi kesalahan saat memproses gambar  | Kegagalan koneksi ke model AI     |

---

### GET `/api/classify/history`

🔒 *Memerlukan autentikasi*

Mengambil daftar riwayat klasifikasi milik pengguna dengan dukungan filter, pencarian, dan paginasi.

**Query Parameters**

| Parameter   | Tipe    | Default   | Keterangan                                        |
|-------------|---------|-----------|---------------------------------------------------|
| `page`      | integer | `1`       | Nomor halaman                                     |
| `limit`     | integer | `10`      | Jumlah data per halaman                           |
| `keyword`   | string  | —         | Cari berdasarkan nama penyakit atau nama ilmiah   |
| `crop_type` | string  | —         | Filter berdasarkan jenis tanaman                  |
| `sort`      | string  | `newest`  | Urutan data: `newest` atau `oldest`               |

**Response Sukses** `200 OK`

```json
{
  "data": [
    {
      "id": 42,
      "imageUrl": "https://...",
      "confidenceScore": 0.97,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "disease": {
        "name": "Bacterial Spot",
        "slug": "tomato-bacterial-spot",
        "cropType": "tomato",
        "scientificName": "Xanthomonas campestris"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "meta": {
    "keyword": null,
    "crop_type": null,
    "sort": "newest"
  }
}
```

---

### GET `/api/classify/history/:id`

🔒 *Memerlukan autentikasi*

Mengambil detail satu riwayat klasifikasi berdasarkan ID.

**Path Parameter**

| Parameter | Tipe    | Keterangan                   |
|-----------|---------|------------------------------|
| `id`      | integer | ID riwayat klasifikasi       |

**Response Sukses** `200 OK`

```json
{
  "data": {
    "id": 42,
    "imageUrl": "https://...",
    "confidenceScore": 0.97,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "disease": { ... }
  }
}
```

**Response Error**

| Kode | Pesan                               | Penyebab                             |
|------|-------------------------------------|--------------------------------------|
| 404  | Data klasifikasi tidak ditemukan    | ID tidak ada atau bukan milik user   |
| 500  | Terjadi kesalahan server            | Kesalahan internal server            |

---

### DELETE `/api/classify/history/:id`

🔒 *Memerlukan autentikasi*

Menghapus satu riwayat klasifikasi beserta file gambarnya dari storage.

**Path Parameter**

| Parameter | Tipe    | Keterangan                   |
|-----------|---------|------------------------------|
| `id`      | integer | ID riwayat klasifikasi       |

**Response Sukses** `200 OK`

```json
{
  "message": "Riwayat klasifikasi berhasil dihapus."
}
```

**Response Error**

| Kode | Pesan                               | Penyebab                             |
|------|-------------------------------------|--------------------------------------|
| 404  | Data klasifikasi tidak ditemukan    | ID tidak ada atau bukan milik user   |
| 500  | Terjadi kesalahan server            | Kesalahan internal server            |

---

### DELETE `/api/classify/history`

🔒 *Memerlukan autentikasi*

Menghapus seluruh riwayat klasifikasi milik pengguna beserta semua file gambar dari storage.

**Response Sukses** `200 OK`

```json
{
  "message": "25 riwayat klasifikasi berhasil dihapus."
}
```

**Response Error**

| Kode | Pesan                            | Penyebab                         |
|------|----------------------------------|----------------------------------|
| 404  | Tidak ada riwayat klasifikasi    | Pengguna belum memiliki riwayat  |
| 500  | Terjadi kesalahan server         | Kesalahan internal server        |

---

## 3. Dashboard

Base path: `/api/dashboard`

### GET `/api/dashboard`

🔒 *Memerlukan autentikasi*

Mengambil ringkasan statistik aktivitas pengguna untuk ditampilkan pada halaman dashboard.

**Response Sukses** `200 OK`

```json
{
  "data": {
    "totalScans": 50,
    "scansThisMonth": 12,
    "healthyPercentage": 64,
    "lastScan": {
      "id": 42,
      "imageUrl": "https://...",
      "confidenceScore": 0.97,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "disease": {
        "name": "Bacterial Spot",
        "slug": "tomato-bacterial-spot",
        "cropType": "tomato"
      }
    },
    "recentHistory": [
      { ... },
      { ... }
    ]
  }
}
```

**Keterangan Field**

| Field                | Tipe    | Keterangan                                              |
|----------------------|---------|---------------------------------------------------------|
| `totalScans`         | integer | Total seluruh klasifikasi yang pernah dilakukan         |
| `scansThisMonth`     | integer | Jumlah klasifikasi pada bulan berjalan                  |
| `healthyPercentage`  | integer | Persentase tanaman yang terdeteksi sehat (0–100)        |
| `lastScan`           | object  | Data klasifikasi terakhir, atau `null` jika belum ada   |
| `recentHistory`      | array   | Lima klasifikasi terbaru                                |

**Response Error**

| Kode | Pesan                    | Penyebab                  |
|------|--------------------------|---------------------------|
| 500  | Terjadi kesalahan server | Kesalahan internal server |

---

## 4. Penyakit

Base path: `/api/diseases`

### GET `/api/diseases`

Mengambil daftar seluruh penyakit yang tersedia dalam sistem. Endpoint ini bersifat publik dan tidak memerlukan autentikasi.

**Query Parameters**

| Parameter   | Tipe   | Keterangan                                                |
|-------------|--------|-----------------------------------------------------------|
| `keyword`   | string | Cari berdasarkan nama penyakit atau nama ilmiah           |
| `crop_type` | string | Filter berdasarkan jenis tanaman (contoh: `tomato`)       |

**Response Sukses** `200 OK`

```json
{
  "data": [
    {
      "id": 1,
      "name": "Bacterial Spot",
      "slug": "tomato-bacterial-spot",
      "cropType": "tomato",
      "scientificName": "Xanthomonas campestris",
      "description": "..."
    }
  ],
  "meta": {
    "total": 4,
    "keyword": null,
    "crop_type": null
  }
}
```

---

### GET `/api/diseases/:slug`

Mengambil detail lengkap satu penyakit berdasarkan slug. Endpoint ini bersifat publik dan tidak memerlukan autentikasi.

**Path Parameter**

| Parameter | Tipe   | Keterangan                                  |
|-----------|--------|---------------------------------------------|
| `slug`    | string | Identifikasi unik penyakit (contoh: `tomato-bacterial-spot`) |

**Response Sukses** `200 OK`

```json
{
  "data": {
    "id": 1,
    "name": "Bacterial Spot",
    "slug": "tomato-bacterial-spot",
    "scientificName": "Xanthomonas campestris",
    "cropType": "tomato",
    "description": "...",
    "symptoms": "...",
    "treatment": "...",
    "preventiveMeasures": "...",
    "rootCauses": "...",
    "imageUrl": "https://...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "totalDetections": 128
  }
}
```

**Keterangan Field**

| Field                | Tipe    | Keterangan                                        |
|----------------------|---------|---------------------------------------------------|
| `severity`           | string  | Tingkat keparahan penyakit                        |
| `preventiveMeasures` | string  | Langkah-langkah pencegahan penyakit               |
| `rootCauses`         | string  | Penyebab utama penyakit                           |
| `totalDetections`    | integer | Total kasus penyakit ini yang pernah terdeteksi   |

**Response Error**

| Kode | Pesan                    | Penyebab                         |
|------|--------------------------|----------------------------------|
| 404  | Penyakit tidak ditemukan | Slug tidak cocok dengan database |
| 500  | Terjadi kesalahan server | Kesalahan internal server        |

---

## Kode Status HTTP

| Kode | Makna                  | Penggunaan Umum                                  |
|------|------------------------|--------------------------------------------------|
| 200  | OK                     | Request berhasil                                 |
| 201  | Created                | Resource baru berhasil dibuat                    |
| 400  | Bad Request            | Validasi input gagal                             |
| 401  | Unauthorized           | Kredensial tidak valid atau token tidak diberikan|
| 404  | Not Found              | Resource tidak ditemukan                         |
| 409  | Conflict               | Data sudah ada (contoh: email duplikat)          |
| 500  | Internal Server Error  | Kesalahan pada sisi server                       |

---

## Catatan Tambahan

- Seluruh request dan response menggunakan format **JSON**, kecuali endpoint yang menerima file (`multipart/form-data`).
- Token JWT berlaku selama **7 hari** sejak diterbitkan.
- Token reset password berlaku selama **1 jam** sejak dikirimkan melalui email.
- File gambar disimpan di **AWS S3**. Penghapusan data akan selalu disertai penghapusan file terkait dari storage.
- Model AI mendukung klasifikasi penyakit pada tanaman **tomat** dengan empat label: `bacterial_spot`, `early_blight`, `late_blight`, dan `healthy`.