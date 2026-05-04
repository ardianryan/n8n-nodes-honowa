<div align="center">
  <img src="https://static-r2-apac.ppti.me/uploads/logo/logo.png" alt="HonoWA" width="150" />
  <h1>n8n-nodes-honowa</h1>
  <p><strong>WhatsApp API Integration (HonoWA) for n8n</strong></p>
</div>

This package allows you to connect your **n8n** workflows with a **HonoWA** server (Unofficial WhatsApp API). You can manage sessions, send text messages, media, and broadcasts directly from n8n.

---

## 🚀 Key Features

- **Simplified Session Management**: Set your Session ID once in the Credentials and use it across all nodes.
- **Message Operations**: Send Text, Media (via URL), and Media (via Binary/File upload).
- **Group Messaging**: Send messages to WhatsApp Groups using Group IDs.
- **Broadcast Engine**: Send bulk messages to multiple numbers with automatic delay settings.
- **Session Operations**: Check session status or logout/delete sessions directly from your workflow.
- **AI Ready**: Supports `usableAsTool` feature for use with AI Agents in n8n.

---

## 📦 Installation

### Community Nodes (Recommended)
In your n8n instance, go to **Settings > Community Nodes > Install a node** and enter:
`n8n-nodes-honowa`

### Manual Installation (Development)
If you want to build it yourself:
1. Clone this repository.
2. Run `npm install`.
3. Run `npm run build`.
4. Link it to your local n8n instance.

---

## 🔐 Credential Configuration

This node uses an **API Key** for authentication.

1. Open your HonoWA Dashboard.
2. Go to **Settings** and copy your **API Key**.
3. In n8n, create a new credential of type **HonoWA API**:
   - **Base URL**: Your HonoWA server URL (e.g., `https://wa.yourdomain.com`).
   - **API Key**: Enter the copied API Key.
   - **Session ID**: Enter the WhatsApp Session ID you want to use (e.g., `session1`).

---

## 🛠️ How to Use

### Global Session ID
Since version 0.1.13, the **Session ID** is configured in the Credentials. This means you don't have to select or type the Session ID in every node. One credential represents one active WhatsApp session.

### Sending Files (Binary)
If you have a file from a previous node (e.g., *Read Binary File* or *HTTP Request*), choose Operation: **Send Media (Binary)**. Enter the name of the binary property (default: `data`).

### Secure Broadcasting
Use Operation: **Send Bulk**. Enter a comma-separated list of phone numbers. By default, the delay is set to **5000ms** (5 seconds) to minimize the risk of being banned by WhatsApp.

---

## 📜 License
[MIT](LICENSE.md)

---

<div align="center">
  Developed with ❤️ by <a href="https://github.com/ardianryan">Ryan Ardian</a>
</div>
