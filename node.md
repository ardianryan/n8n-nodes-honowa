# HonoWA API Guide for n8n Custom Nodes

Dokumen ini menjelaskan cara memetakan API HonoWA ke dalam struktur Custom Node n8n.

## 1. Autentikasi (Credentials)
HonoWA menggunakan API Key. Di n8n, gunakan tipe `Header Auth`.
- **Name**: `X-API-Key`
- **Value**: `<API_KEY_DARI_DASHBOARD>`

## 2. Resource & Action Mapping

### Resource: Session
| Action | Method | Endpoint | Note |
| :--- | :--- | :--- | :--- |
| **List** | `GET` | `/sessions` | Mengambil semua sesi milik user. |
| **Get Status** | `GET` | `/session/status/:sessionId` | Cek apakah sesi `ready` atau `disconnected`. |
| **Delete** | `DELETE` | `/session/:sessionId` | Logout dan hapus sesi. |

### Resource: Message
| Action | Method | Endpoint | Payload (JSON) |
| :--- | :--- | :--- | :--- |
| **Send Text** | `POST` | `/send/:sessionId` | `{"phone": "...", "message": "..."}` |
| **Send Media** | `POST` | `/send/:sessionId` | `{"phone": "...", "mediaUrl": "...", "message": "..."}` |
| **Send Group** | `POST` | `/send-group/:sessionId` | `{"groupId": "...", "message": "..."}` |

### Resource: Broadcast
| Action | Method | Endpoint | Payload (JSON) |
| :--- | :--- | :--- | :--- |
| **Send Bulk** | `POST` | `/broadcast/:sessionId` | `{"phones": ["...", "..."], "message": "...", "delayMs": 5000}` |

## 3. Struktur Implementasi n8n

### Base URL
Dapatkan dari environment atau input user di n8n node: `http://<your-ip>:3000`

### Input Fields (Parameters)
Untuk mempermudah pengguna n8n, buat dropdown untuk `sessionId` dengan memanggil endpoint `GET /sessions`.

### Handling Binary (n8n to HonoWA)
Jika ingin mengirim file langsung dari n8n (bukan URL):
1. Gunakan method `POST`.
2. Content-Type: `multipart/form-data`.
3. Field: `phone`, `message`, dan `media` (binary file).

## 4. Contoh Response (Success)
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": "true_628123456789@c.us_3EB0...",
    "timestamp": 1625000000
  }
}
```

## 5. Tips n8n Development
- Gunakan `n8n-node-dev` untuk membangun node.
- Pastikan menyertakan `delayMs` minimal 5000 pada broadcast untuk menghindari rate limit n8n atau ban WhatsApp.
