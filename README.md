<div align="center">
  <img src="nodes/HonoWa/honowa.png" alt="HonoWA" width="150" />
  <h1>n8n-nodes-honowa</h1>
  <p><strong>n8n community node for HonoWA — Unofficial WhatsApp API</strong></p>
</div>

This is an [n8n](https://n8n.io/) community node that lets you interact with your [HonoWA](https://github.com/elianhardyy/hono-wa-web-multidevice) server directly from n8n workflows.

HonoWA is a modern WhatsApp multi-session management platform built with Hono.js, offering REST API, AI integration, and admin dashboard.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation) · [Operations](#operations) · [Credentials](#credentials) · [Usage](#usage) · [Resources](#resources)

---

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

**npm package name:** `n8n-nodes-honowa`

---

## Operations

### Session
| Operation | Description |
|:----------|:------------|
| **List** | Get all WhatsApp sessions |
| **Get Status** | Check if a session is `ready` or `disconnected` |
| **Delete** | Logout and remove a session |

### Message
| Operation | Description |
|:----------|:------------|
| **Send Text** | Send a text message to a phone number |
| **Send Media (URL)** | Send media (image/video/audio/doc) from a URL |
| **Send Media (Binary)** | Send a file directly from n8n binary data |
| **Send Group** | Send a message to a WhatsApp group |

### Broadcast
| Operation | Description |
|:----------|:------------|
| **Send Bulk** | Send a message to multiple phone numbers with configurable delay |

---

## Credentials

This node uses **API Key** authentication.

1. Open your HonoWA Dashboard → **Settings** page.
2. Copy your **API Key**.
3. In n8n, create a new **HonoWA API** credential:
   - **Base URL**: Your HonoWA server URL (e.g. `http://localhost:3000`)
   - **API Key**: Paste your API key

The credential is tested by calling `GET /sessions` on your HonoWA server.

---

## Usage

### Send a Text Message

1. Add the **HonoWA** node to your workflow.
2. Select Resource: **Message** → Operation: **Send Text**.
3. Enter the **Session ID**, **Phone Number** (international format, e.g. `628123456789`), and **Message**.

### Send Media from URL

1. Select Resource: **Message** → Operation: **Send Media (URL)**.
2. Provide the **Media URL** (direct link to image/video/audio/document).

### Send File from n8n

1. Connect a node that outputs binary data (e.g. HTTP Request, Read Binary File).
2. Select Resource: **Message** → Operation: **Send Media (Binary)**.
3. Set the **Binary Property** name (default: `data`).

### Broadcast

1. Select Resource: **Broadcast** → Operation: **Send Bulk**.
2. Enter comma-separated **Phone Numbers**.
3. Set **Delay (ms)** — minimum `5000` recommended to avoid WhatsApp rate limiting.

---

## Resources

- [HonoWA Repository](https://github.com/elianhardyy/hono-wa-web-multidevice)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

---

## License

[MIT](LICENSE.md)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/ardianryan">Ryan Ardian</a>
</div>
