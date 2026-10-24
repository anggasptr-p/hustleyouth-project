# ⚡ HustleYouth — Youth Micro-Gig Marketplace & Collaborative Community Platform

> **HustleYouth** adalah platform digital berbasis *web-based marketplace* dan ruang kolaborasi interaktif yang dirancang khusus untuk memfasilitasi generasi muda, pelajar, serta mahasiswa dalam memamerkan keterampilan, menjual jasa (*micro-gigs*), dan membangun jaringan profesional independen secara mudah, aman, dan efisien.

## 📄 Latar Belakang & Nilai Tambah (Value Proposition)

Potensi ekonomi kreatif di kalangan generasi muda Indonesia berkembang pesat, namun sering kali terkendala oleh aksesibilitas platform tradisional yang rumit, komisi tinggi, dan proses transaksi yang kurang fleksibel bagi pemula.

**HustleYouth hadir sebagai solusi terpadu dengan memberikan:**

1. **Ruang Monetisasi Mandiri:** Platform tanpa hambatan (*low-friction*) bagi pelajar untuk menawarkan jasa seperti desain grafis, pemrograman, penyuntingan video, hingga penulisan kreatif.

2. **Konektivitas Komunitas (HustleStream):** Ruang diskusi *real-time* berbasis papan kebutuhan (*notice board*) untuk mempertemukan pemberi kerja (*Hiring*) dan pencari proyek (*Showcase*).

3. **Ekosistem Transaksi Fleksibel:** Integrasi komunikasi langsung via WhatsApp untuk negosiasi transparan dan fleksibel tanpa perantara yang membebankan pengguna.

## ⭐ Fitur Utama (Core Features)

* **🛒 Dynamic Gig Marketplace**: Katalog jasa interaktif dengan kemampuan filtrasi kategori dinamis, pencarian *real-time*, dan visualisasi portofolio beresolusi tinggi.

* **📡 HustleStream Interactive Room (Killer Feature)**: Forum obrolan publik interaktif berbasis *livefeed* yang dilengkapi sistem klasifikasi entitas (*Hiring* vs *Showcase*), indikator media visual, dan fitur *like engagement*.

* **🔑 Secure JWT Authentication System**: Sistem otentikasi berbasis *JSON Web Token* (JWT) dan enkripsi kata sandi menggunakan `bcryptjs` untuk menjamin keamanan akun pengguna.

* **☁️ Cloudinary Direct Media Upload**: Pengunggahan berkas gambar portofolio langsung dari sisi klien (*client-side direct upload*) tanpa mengurangi performa server utama.

* **💬 Direct WhatsApp Integration**: Fasilitas komunikasi satu klik yang memformat pesan otomatis untuk mempercepat konversi transaksi antara penyedia jasa dan klien.

* **🌓 Adaptive Theme System**: Dukungan tema *Dark/Light Mode* global berbasis *CSS Custom Properties* yang dapat mendeteksi preferensi pengguna dan tersimpan secara permanen pada `localStorage`.

* **🧭 Guided Onboarding Tour**: Panduan interaktif berbasis modul dialog untuk mempermudah pengguna baru dalam memahami seluruh alur dan fungsi platform.

## 🛠️ Arsitektur & Teknologi (Tech Stack)

### **Frontend**

* **Language & Runtime**: Vanilla JavaScript (ES6+), HTML5, CSS3

* **Design System**: Custom *Glassmorphism Engine* dengan responsivitas tinggi (Flexbox & Grid Layout)

* **Iconography & Typography**: FontAwesome 6 Free, Google Fonts (Inter)

### **Backend & API**

* **Environment**: Node.js

* **Framework**: Express.js (RESTful API Architecture)

* **Authentication**: `jsonwebtoken` (JWT), `bcryptjs`

* **CORS & Middleware**: `cors`, `dotenv`

### **Database & Infrastructure**

* **Database**: Neon PostgreSQL (*Serverless Multi-Region Database*)

* **Media Storage**: Cloudinary Storage API

* **Deployment Platform**: Vercel Serverless Functions

## 🗄️ Skema Basis Data (Database Schema)

Aplikasi ini mengelola 3 entitas utama pada basis data PostgreSQL:

1. **`users`**: Menyimpan data identitas pengguna, kredensial terenkripsi, instansi/sekolah, dan nomor kontak.

2. **`gigs`**: Menyimpan informasi jasa/katalog yang ditawarkan (judul, deskripsi, kategori, harga, media, dan relasi pemilik).

3. **`posts`**: Menyimpan riwayat obrolan dan penawaran di fitur HustleStream lengkap dengan penghitung preferensi (*likes count*).

## 🔗 Spesifikasi Endpoint API (API Documentation)

### **Autentikasi (`/api/auth`)**

| 

| **Method** | **Endpoint** | **Deskripsi** | **Status Code** | 
| `POST` | `/api/auth/register` | Pendaftaran akun pengguna baru | `201 Created` | 
| `POST` | `/api/auth/login` | Autentikasi pengguna & penerbitan token JWT | `200 OK` | 

### **Katalog Jasa (`/api/gigs`)**

| **Method** | **Endpoint** | **Deskripsi** | **Status Code** | 
| `GET` | `/api/gigs` | Mengambil seluruh data katalog jasa / filter | `200 OK` | 
| `POST` | `/api/gigs` | Menambahkan jasa baru ke dalam platform | `201 Created` | 

### **HustleStream (`/api/posts`)**

| **Method** | **Endpoint** | **Deskripsi** | **Status Code** | 
| `GET` | `/api/posts` | Mengambil seluruh daftar obrolan publik | `200 OK` | 
| `POST` | `/api/posts` | Mempublikasikan pesan/penawaran baru ke Stream | `201 Created` | 
| `PATCH` | `/api/posts/:id/like` | Memperbarui jumlah apresiasi (*like*) pada pesan | `200 OK` | 

## 💻 Panduan Instalasi Lokal (Local Setup)

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

### **1. Prasyarat System**

* Node.js v18.x atau versi yang lebih baru

* NPM (Node Package Manager)

### **2. Kloning Repositori & Instalasi Dependensi**

```
git clone https://github.com/anggasptr-p/hustleyouth-project.git
cd hustleyouth-project/backend
npm install

```

### **3. Konfigurasi Environment Variables**

Buat file `.env` pada direktori `backend/` dan lengkapi konfigurasi berikut:

```
PORT=5000
DATABASE_URL=postgresql://user:password@ep-sample-region.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=rahasia_super_secure_hustleyouth_2026

```

### **4. Menjalankan Server Backend**

```
npm start
# Atau menggunakan Nodemon untuk mode pengembangan:
npx nodemon server.js

```

*Server REST API akan berjalan di `http://localhost:5000`*

### **5. Menjalankan Client Frontend**

Buka direktori `frontend/` dan jalankan `index.html` menggunakan *Live Server* (VS Code Extension) atau buka secara langsung pada peramban web di alamat `http://localhost:8000`.

## 🚀 Panduan Deploy (Deployment)

Proyek ini dirancang agar dapat di-deploy secara langsung pada platform **Vercel** menggunakan konfigurasi `vercel.json` bawaan:

1. *Push* kode sumber terbaru ke repositori GitHub.

2. Impor repositori ke dalam dashboard **Vercel**.

3. Atur **Environment Variables** pada Vercel (`DATABASE_URL` dan `JWT_SECRET`).

4. Klik tombol **Deploy**. Vercel akan secara otomatis membangun *Static Asset* untuk Frontend dan *Serverless Functions* untuk Backend Express.

## 📈 Rencana Pengembangan Mendatang (Future Roadmap)

* **Rekber & Escrow Payment Gateway**: Integrasi sistem pembayaran bersama untuk perlindungan hak konsumen dan pekerja lepas.

* **Rating & Review Verification**: Sistem verifikasi ulasan berbasis transaksi nyata untuk meningkatkan kredibilitas *freelancer*.

* **Real-time WebSockets Engine**: Transisi dari REST Polling ke Socket.io pada HustleStream untuk komunikasi tanpa batas penundaan.

## 👥 Tim Pengembang

Proyek **HustleYouth** dikembangkan dan dikelola secara penuh oleh tim HustleYouth dalam rangka Kompetisi Teknologi Informasi dan Komunikasi (TIK).

* **Repository**: [GitHub HustleYouth](https://github.com/anggasptr-p/hustleyouth-project)

* **Live Demo**: [hustleyouth-project.vercel.app](https://hustleyouth-project.vercel.app)

*© 2026 HustleYouth. All rights reserved.*