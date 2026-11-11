# On-Ground.ai Call Centre App — Real Phone Calling with Exotel

> **On-Ground.ai** is an AI-powered call centre platform for retail store follow-ups, featuring real PSTN telephone calling via Exotel, lead management, call history, calendar scheduling, and the Pulse AI collaboration channel.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (React + Vite)                   │
│  Dashboard │ Plan │ Calendar │ Pulse │ Exotel Call Modal     │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP (fetch)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│          Node.js + Express Backend (port 3001)              │
│  POST /api/calls/initiate                                    │
│  GET  /api/calls/status/:callId                             │
│  GET  /api/calls/history                                     │
│  POST /api/calls/hangup                                      │
│  POST /api/calls/webhook/:callId  ← Exotel StatusCallback   │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS (Basic Auth)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│          Exotel Cloud Telephony (India Cluster)              │
│  api.in.exotel.com/v1/Accounts/{sid}/Calls/connect          │
│                                                              │
│  Flow:                                                       │
│  1. Exotel calls AGENT's mobile phone                        │
│  2. Agent answers their physical phone                       │
│  3. Exotel dials CUSTOMER's mobile phone                     │
│  4. Both are bridged — real call in progress                 │
└─────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**
- Exotel API credentials are **never** in frontend code — all API calls go through the Express backend.
- The backend holds credentials in environment variables only.
- Call status updates arrive via Exotel webhook callbacks (requires public HTTPS URL).
- Frontend also polls for status every 3 seconds as a fallback.

---

## Project Structure

```
call_centre_app/
├── src/                          # React Frontend
│   ├── components/
│   │   ├── calling/
│   │   │   ├── ExotelCallModal.jsx    ★ NEW — Real phone calling UI
│   │   │   ├── CallModal.jsx          Existing demo call UI
│   │   │   ├── DialPadModal.jsx       Updated — Exotel mode added
│   │   │   ├── CallDispositionModal.jsx
│   │   │   └── TwilioConfigModal.jsx
│   │   └── layout/
│   │       ├── Layout.jsx             Updated — ExotelCallModal wired
│   │       └── Sidebar.jsx            Updated — Exotel Real Call button
│   ├── context/
│   │   ├── CallContext.jsx            Updated — Exotel state + handlers
│   │   └── AppDataContext.jsx
│   ├── services/
│   │   └── exotelApi.js              ★ NEW — Backend API client
│   └── pages/
│       ├── Dashboard/DashboardPage.jsx  Updated — Exotel button
│       └── Plan/CallsToMakeTab.jsx      Updated — Real/Demo call buttons
│
├── server/                       # Node.js + Express Backend
│   ├── index.js                  ★ NEW — Full Exotel integration
│   ├── package.json
│   ├── .env                      ★ Fill in your Exotel credentials
│   ├── .env.example              Template (safe to commit)
│   └── .gitignore
│
├── start-backend.bat             ★ NEW — One-click backend start
├── start-all.bat                 ★ NEW — Start both servers
├── vite.config.js                Updated — Proxy to backend
└── README.md                     This file
```

---

## Prerequisites

- **Node.js** 18+ ([nodejs.org](https://nodejs.org))
- **Exotel account** ([my.exotel.com](https://my.exotel.com)) — required for real calls
- **ngrok** (optional, for webhook callbacks in local dev) — [ngrok.com/download](https://ngrok.com/download)

---

## Installation

### 1. Install Frontend Dependencies

```bash
# In the project root
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

## Exotel Account Setup

> **This is required to make actual phone calls.**

1. **Create an Exotel account** at [my.exotel.com](https://my.exotel.com) (India accounts).

2. **Get API credentials:**
   - Go to **Settings → API Settings**
   - Note your: **API Key**, **API Token**, **Account SID**

3. **Buy an ExoPhone (virtual number):**
   - Go to **Manage → Buy Numbers**
   - Purchase an Indian virtual number — this is your **ExoPhone (CallerId)**

4. **Authorise test numbers** (for trial accounts):
   - Exotel trial accounts can only call numbers that are verified/authorised
   - Go to **Settings → Authorised Numbers** and add your mobile numbers

---

## Backend Setup

### Configure Credentials

```bash
# In the server/ directory
cp .env.example .env
```

Edit `server/.env`:

```env
EXOTEL_API_KEY=your_api_key
EXOTEL_API_TOKEN=your_api_token
EXOTEL_ACCOUNT_SID=your_account_sid
EXOTEL_EXOPHONE=+91XXXXXXXXXX   # Your ExoPhone number
PORT=3001
FRONTEND_URL=http://localhost:5173
WEBHOOK_BASE_URL=https://your-ngrok-url.ngrok.io
```

### Start the Backend

```bash
# Option 1: Direct node
cd server
node index.js

# Option 2: With auto-reload (development)
cd server
npx nodemon index.js

# Option 3: Windows batch file (from project root)
start-backend.bat
```

Verify it's running:
```
http://localhost:3001/health
```

---

## Frontend Setup

```bash
# In the project root
npx vite
```

Frontend runs at: **http://localhost:5173**

### Start Everything at Once (Windows)

Double-click **`start-all.bat`** in the project root — this opens two terminal windows (backend + frontend).

---

## Webhook Configuration

Exotel calls your webhook URL to report call status updates (ringing, answered, completed, etc.).

### Local Development (ngrok)

```bash
# Terminal 1 — Start backend
cd server && node index.js

# Terminal 2 — Start ngrok tunnel
ngrok http 3001
```

ngrok gives you a URL like `https://abc123.ngrok.io`.

Update `server/.env`:
```env
WEBHOOK_BASE_URL=https://abc123.ngrok.io
```

Restart the backend.

**How it works:** When a call is made, the backend sends `https://abc123.ngrok.io/api/calls/webhook/{callId}` to Exotel. Exotel POSTs status updates to this URL.

### Production

Deploy the backend to a cloud service (Railway, Render, Fly.io, AWS EC2, etc.) and set:
```env
WEBHOOK_BASE_URL=https://your-production-domain.com
```

---

## How to Make the First Real Phone Call

> Both phone numbers must be Indian mobile numbers (Exotel India cluster).

### Method 1: Dashboard → "Exotel Real Call" Button

1. Open `http://localhost:5173`
2. Click **"Exotel Real Call"** button in the top-right of the Dashboard
3. Enter:
   - **Your mobile number** (agent) — e.g., `9876543210`
   - **Customer name** — e.g., `Test Customer`
   - **Customer mobile** — e.g., `9123456789`
4. Click **"Call [Customer Name]"**
5. **Your phone rings** — answer it
6. Exotel connects you with the customer
7. Talk via actual phone network
8. End the call by hanging up your phone
9. The call record appears in **Plan → Recent Calls**

### Method 2: Sidebar → "Exotel Real Call"

Click the **⚡ Exotel Real Call** button in the left sidebar — same interface.

### Method 3: Plan → Calls to Make → "Real" button

In the **Plan** page, each lead row has a **⚡ Real** button that pre-fills the customer's details.

### Method 4: Outbound Dial Pad → Exotel mode

1. Click **"Open Outbound Dialer"** in the sidebar
2. Switch mode to **"Exotel Real Call"**
3. Enter/select a phone number
4. Click **"Open Exotel Dialer"**

---

## How Call Status Updates Work

```
Agent clicks Call
       │
       ▼
Backend → Exotel API → Call SID returned
       │
       ▼
Frontend polls GET /api/calls/status/:callId every 3 sec
       │
       ▼
Exotel POSTs to /api/calls/webhook/:callId (requires public URL)
  • Status: queued → ringing → in-progress → completed/busy/failed

UI shows:
  Initiating → Agent Ringing → Customer Connecting → Connected → Completed
```

---

## Testing Call History

After every completed call:

1. The disposition modal may auto-trigger (if using demo mode)
2. For Exotel calls, the record is automatically saved when the call completes
3. View in **Plan → Recent Calls** tab
4. The **Dashboard** KPI stats update (calls made today, conversions, revenue)
5. Each call record shows: name, phone, duration, status, outcome, notes

---

## API Reference

### POST /api/calls/initiate

```json
{
  "agentNumber": "9876543210",
  "customerNumber": "9123456789",
  "customerName": "Mukunda Dwarkanath",
  "agentName": "Akshat Rajan",
  "notes": "Walked out of Indiranagar store"
}
```

**Response:**
```json
{
  "success": true,
  "callId": "uuid-...",
  "exotelCallSid": "...",
  "status": "initiating",
  "message": "Call initiated. Your phone will ring shortly."
}
```

### GET /api/calls/status/:callId

Returns current status of a call.

### GET /api/calls/history

Returns all call records (most recent first).

### POST /api/calls/hangup

```json
{ "callId": "uuid-..." }
```

> **Note:** Exotel v1 API does not support programmatic hangup via REST. The agent must hang up their physical phone. This endpoint marks the call as ended locally.

### POST /api/calls/webhook/:callId

Exotel StatusCallback handler (Exotel posts here automatically).

---

## Error Handling

| Error Code | Cause | Resolution |
|---|---|---|
| `MISSING_CREDENTIALS` | .env not filled | Add Exotel credentials to `server/.env` |
| `AUTH_FAILURE` | Wrong API key/token | Check Settings → API in Exotel dashboard |
| `INVALID_AGENT_NUMBER` | Not a valid Indian mobile | Use 10-digit number starting with 6-9 |
| `INVALID_CUSTOMER_NUMBER` | Not a valid Indian mobile | Use 10-digit number starting with 6-9 |
| `INSUFFICIENT_BALANCE` | No credits | Top up your Exotel account |
| `INVALID_REQUEST` | ExoPhone not set up | Verify ExoPhone number in Exotel dashboard |
| Backend unreachable | Server not running | Run `cd server && node index.js` |
| Call shows "No Answer" | Customer didn't pick up | Try again or verify number |
| Call shows "Busy" | Customer busy | Retry later |
| Webhook not updating | ngrok not running | Start ngrok and update WEBHOOK_BASE_URL |

---

## Known Limitations

1. **Exotel v1 no programmatic hangup:** Exotel's v1 REST API doesn't support ending a call programmatically. The agent must hang up their physical phone. The "End Call" button marks the call as ended locally and informs the agent.

2. **In-memory call store:** Call records are stored in server memory and lost on server restart. For production, replace with a database (SQLite, PostgreSQL, MongoDB).

3. **Webhook requires public URL:** Status updates via webhooks require a publicly accessible HTTPS endpoint. For local development, use ngrok. Without a webhook URL, the frontend polls every 3 seconds instead.

4. **Trial account limitations:** Exotel trial accounts can only call pre-verified mobile numbers. Add both agent and customer numbers to "Authorised Numbers" in the Exotel dashboard.

5. **India cluster only:** This integration uses the India-specific endpoint (`api.in.exotel.com`). For other regions, the base URL needs adjustment.

6. **Mute/Hold:** Mute and hold controls in the existing demo UI are not wired to Exotel (not supported by Exotel v1 REST API — these would require DTMF signalling or Exotel's WebRTC SDK).

---

## Development Notes

### Running in Demo Mode

The existing "Demo HD Audio" mode still works without any Exotel credentials — it simulates a call with sound effects and AI transcript for demonstration purposes.

### Switching Between Modes

- **Demo Mode:** Click "Open Outbound Dialer" → select "Demo HD Audio"
- **Exotel Real Call:** Click "⚡ Exotel Real Call" button anywhere in the app
- **tel: Link:** Opens device's native phone dialer

---

## Deployment

For production deployment:

1. Deploy the Express backend to a service (Railway, Render, Fly.io, etc.)
2. Set all environment variables in the cloud service
3. Update `WEBHOOK_BASE_URL` to your production domain
4. Build the frontend: `npx vite build`
5. Deploy the `dist/` folder to a CDN or static hosting (Vercel, Netlify, etc.)
6. Set `VITE_BACKEND_URL` environment variable to your backend URL in the frontend build config
