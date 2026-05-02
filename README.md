<div align="center">
  <img src="https://static-r2-apac.ppti.me/uploads/logo/logo.png" alt="HonoWA" width="150" />
  <h1>n8n-nodes-honowa</h1>
  <p><strong>Integrasi WhatsApp API (HonoWA) untuk n8n</strong></p>
</div>

Package ini memungkinkan Anda untuk menghubungkan workflow **n8n** dengan server **HonoWA** (Unofficial WhatsApp API). Anda dapat mengelola sesi, mengirim pesan teks, media, hingga broadcast langsung dari n8n.

---

## 🚀 Fitur Utama

- **Multi-Session Support**: Pilih session WhatsApp yang aktif langsung dari dropdown.
- **Message Operations**: Kirim Teks, Media (via URL), dan Media (via Binary/Upload file).
- **Group Messaging**: Kirim pesan ke WhatsApp Group.
- **Broadcast Engine**: Kirim pesan massal dengan pengaturan delay otomatis.
- **Session Management**: Cek status session atau hapus session langsung dari workflow.
- **AI Ready**: Mendukung fitur `usableAsTool` untuk digunakan oleh AI Agent di n8n.

---

## 📦 Instalasi

### Community Nodes (Rekomendasi)
Di n8n Anda, buka **Settings > Community Nodes > Install a node** dan masukkan:
`n8n-nodes-honowa`

### Instalasi Manual (Development)
Jika ingin melakukan build sendiri:
1. Clone repository ini.
2. Jalankan `npm install`.
3. Jalankan `npm run build`.
4. Link ke n8n lokal Anda.

---

## 🔐 Konfigurasi Credential

Node ini menggunakan **API Key** untuk autentikasi.

1. Buka Dashboard HonoWA Anda.
2. Masuk ke menu **Settings** dan salin **API Key** Anda.
3. Di n8n, buat credential baru tipe **HonoWA API**:
   - **Base URL**: URL server HonoWA Anda (contoh: `http://localhost:3000`).
   - **API Key**: Masukkan key yang sudah disalin.

---

## 🛠️ Cara Penggunaan

### Memilih Session secara Otomatis
Pada bagian **Session Name or ID**, Anda tidak perlu mengetik ID manual. Klik dropdown untuk melihat daftar session yang sedang aktif di server Anda. n8n akan otomatis menampilkan status session tersebut (misal: `ready` atau `close`).

### Mengirim File (Binary)
Jika Anda memiliki file dari node sebelumnya (misal: node *Read Binary File* atau *HTTP Request*), pilih Operation: **Send Media (Binary)**. Masukkan nama property binary-nya (default: `data`).

### Broadcast dengan Aman
Gunakan Operation: **Send Bulk**. Masukkan daftar nomor HP yang dipisahkan koma. Secara default, delay disetel **5000ms** (5 detik) untuk menghindari risiko banned dari WhatsApp.

---

## 📜 Lisensi
[MIT](LICENSE.md)

---

<div align="center">
  Dikembangkan dengan ❤️ oleh <a href="https://github.com/ardianryan">Ryan Ardian</a>
</div>
