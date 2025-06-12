# 🦗 Grass-Way: Smart Grass Growth API

![image](https://github.com/user-attachments/assets/b2815131-003c-48de-874a-845ed311af66)
![image](https://github.com/user-attachments/assets/132e9273-841f-405b-9df4-2b66a058c51d)



[![Lisensi: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node.js-v16.x-green.svg)](https://nodejs.org/en/)


Sebuah proyek dari tim **Grasshopper**, **Grass-Way** adalah REST API berbasis Node.js + Express yang dirancang untuk memonitor dan memprediksi pertumbuhan rumput di berbagai segmen lahan. Sistem ini mengintegrasikan data tanah, cuaca dari BMKG, dan model pertumbuhan untuk memberikan estimasi ketinggian rumput yang akurat.

Selain API, proyek ini juga menyediakan antarmuka web sederhana untuk visualisasi data segmen.

## ✨ Fitur Utama

-   **🌾 Manajemen Segmen**: Kelola informasi detail untuk setiap segmen, termasuk data komposisi tanah dan jenis rumput.
-   **🌦️ Integrasi Cuaca BMKG**: Mengambil prakiraan cuaca secara otomatis dari API publik BMKG dan menyimpannya ke database.
-   **📏 Prediksi Pertumbuhan Rumput**: Menjalankan kalkulasi untuk memperbarui dan memprediksi ketinggian rumput di semua segmen berdasarkan data cuaca dan karakteristik segmen.
-   **☁️ Cloud-Ready**: Didesain untuk berjalan dengan database terkelola seperti Aiven for MySQL, lengkap dengan konfigurasi SSL.
-   **🏗️ Arsitektur Modular**: Struktur kode yang rapi (Controllers, Models, Routes, Services) untuk skalabilitas dan kemudahan pemeliharaan.

## 🛠️ Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: Aiven for MySQL (atau MySQL standar)
-   **Template Engine**: EJS (untuk antarmuka web sederhana)
-   **HTTP Client**: Axios
-   **Manajemen Environment**: dotenv

## 🏛️ Arsitektur Sistem

-   `controllers/`: Berisi logika bisnis yang menangani permintaan dan menghasilkan respons.
-   `models/`: Bertanggung jawab untuk semua interaksi dengan database (CRUD).
-   `routes/`: Mendefinisikan rute API dan antarmuka web, menghubungkannya ke *controller* yang sesuai.
-   `services/`: Fungsi utilitas, seperti koneksi ke API BMKG dan kalkulasi pertumbuhan.
-   `views/`: Berisi file EJS untuk merender halaman web.

## ⚙️ Instalasi & Konfigurasi

1.  **Clone Repositori**
    ```bash
    git clone https://github.com/yourusername/grass-way.git
    cd grass-way
    ```

2.  **Instal Dependensi**
    ```bash
    npm install
    ```

3.  **Konfigurasi Variabel Lingkungan**
    Buat file `.env` di direktori utama dan isi dengan konfigurasi Anda. **JANGAN PERNAH MENGUNGGAH FILE .env KE GITHUB.**

    **Contoh untuk Aiven for MySQL:**
    ```env

    DB_HOST= mysql-f245633-hardikusuma999-bb49.f.aivencloud.com
    DB_USER= yavnadmin
    DB_PASSWORD= <Mohon Email ke hardikusuma999@gmail.com/ whatsApp 082111156935>
    DB_NAME=grassway


    ```

4.  **Jalankan Aplikasi**
    -   **Mode Pengembangan (dengan `nodemon`):**
        ```bash
        npm run dev
        ```
    -   **Mode Produksi:**
        ```bash
        npm start
        ```
    Aplikasi Anda sekarang berjalan di `http://localhost:3000`.

## 📖 Dokumentasi API

Berikut adalah endpoint utama yang tersedia untuk interaksi dengan sistem Grass-Way.

---

#### 1. Dapatkan Semua Segmen
Mengambil daftar semua segmen yang terdaftar di sistem.
-   **Endpoint**: `GET /api/segments`
-   **Contoh Request (cURL):**
    ```bash
    curl http://localhost:3000/api/segments
    ```

---

#### 2. Dapatkan Data Tanah & Rumput Segmen
Mengambil data komposisi tanah dan jenis rumput untuk segmen spesifik.
-   **Endpoint**: `GET /api/segments/:segmentId/soil-grass`
-   **Contoh Request (cURL):**
    ```bash
    curl http://localhost:3000/api/segments/1/soil-grass
    ```

---

#### 3. Dapatkan Data Cuaca Segmen
Mengambil data cuaca terakhir yang tersimpan untuk segmen spesifik.
-   **Endpoint**: `GET /api/segments/:segmentId/weather`
-   **Contoh Request (cURL):**
    ```bash
    curl http://localhost:3000/api/segments/1/weather
    ```

---

#### 4. Perbarui Data Cuaca dari BMKG
Memicu proses untuk mengambil data cuaca terbaru dari BMKG untuk semua segmen dan menyimpannya.
-   **Endpoint**: `POST /api/weather`
-   **Body**: (Tidak ada)
-   **Contoh Request (cURL):**
    ```bash
    curl -X POST http://localhost:3000/api/weather
    ```

---

#### 5. Hitung & Perbarui Ketinggian Rumput
Memicu proses kalkulasi untuk memperbarui estimasi ketinggian rumput di semua segmen.
-   **Endpoint**: `POST /api/segment/height`
-   **Body**: (Tidak ada)
-   **Contoh Request (cURL):**
    ```bash
    curl -X POST http://localhost:3000/api/segment/height
    ```


## 📄 Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](./LICENSE).
