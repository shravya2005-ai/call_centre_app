/**
 * On-Ground.ai Call Centre Backend
 * Exotel Real Phone Calling Integration
 *
 * Uses Exotel's v1 Calls/connect API (India cluster):
 * POST https://api.in.exotel.com/v1/Accounts/{sid}/Calls/connect
 *
 * Flow:
 *  1. Agent clicks "Call" in the UI.
 *  2. Backend sends request to Exotel API with agent number (From) and customer number (To).
 *  3. Exotel first calls the AGENT's mobile. Agent picks up.
 *  4. Exotel then dials the CUSTOMER and bridges the two legs.
 *  5. Webhook receives status updates (initiated → ringing → answered → completed).
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Validate required environment variables ─────────────────────────────────
const requiredEnvVars = ['EXOTEL_API_KEY', 'EXOTEL_API_TOKEN', 'EXOTEL_ACCOUNT_SID', 'EXOTEL_EXOPHONE'];
const missingEnvVars = requiredEnvVars.filter((v) => !process.env[v] || process.env[v].includes('your_'));
if (missingEnvVars.length > 0) {
  console.warn(`⚠️  WARNING: Missing environment variables: ${missingEnvVars.join(', ')}`);
  console.warn('   Copy server/.env.example to server/.env and fill in your Exotel credentials.');
  console.warn('   The server will start but API calls will fail without valid credentials.\n');
}

// ─── Persistent Call Storage ────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'calls.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadCallStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf8');
      const records = JSON.parse(content);
      if (Array.isArray(records)) {
        console.log(`📂 Loaded ${records.length} persisted call records from disk.`);
        return new Map(records.map((r) => [r.callId, r]));
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not load persisted calls from disk:', err.message);
  }
  return new Map();
}

const callStore = loadCallStore();

function persistCallStore() {
  try {
    const records = Array.from(callStore.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Failed to persist calls to disk:', err.message);
  }
}

function saveCallRecord(callId, record) {
  callStore.set(callId, record);
  persistCallStore();
}

function deleteCallRecord(callId) {
  callStore.delete(callId);
  persistCallStore();
}

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
  ],
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());
// Also parse URL-encoded bodies (Exotel webhooks send x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Rate limiting — 60 requests per minute per IP for call initiation
const callLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests. Please wait before retrying.' },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Validate an Indian mobile number.
 * Accepts: 10-digit, +91XXXXXXXXXX, 0XXXXXXXXXX, 91XXXXXXXXXX
 * Returns: E.164 format (+91XXXXXXXXXX) or null if invalid.
 */
function normalizeIndianNumber(raw) {
  if (!raw) return null;
  // Strip all spaces, dashes, parentheses
  let n = String(raw).replace(/[\s\-().]/g, '');

  // Remove leading +
  if (n.startsWith('+')) n = n.slice(1);

  // Remove country code prefix
  if (n.startsWith('91') && n.length === 12) n = n.slice(2);
  if (n.startsWith('0') && n.length === 11) n = n.slice(1);

  // Now should be 10 digits
  if (!/^[6-9]\d{9}$/.test(n)) return null;

  return '+91' + n;
}

/**
 * Build the Exotel basic auth credentials.
 */
function exotelAuth() {
  return {
    username: (process.env.EXOTEL_API_KEY || '').trim(),
    password: (process.env.EXOTEL_API_TOKEN || '').trim(),
  };
}

/**
 * Exotel v1 API base URL for India cluster.
 */
function exotelBaseUrl() {
  const sid = (process.env.EXOTEL_ACCOUNT_SID || '').trim();
  return `https://api.in.exotel.com/v1/Accounts/${sid}`;
}

/**
 * Map Exotel call status to our internal status labels.
 */
function mapExotelStatus(exotelStatus) {
  const mapping = {
    queued:      'initiating',
    ringing:     'ringing',
    'in-progress': 'connected',
    completed:   'completed',
    busy:        'busy',
    failed:      'failed',
    'no-answer': 'no-answer',
    canceled:    'canceled',
  };
  return mapping[(exotelStatus || '').toLowerCase()] || exotelStatus || 'unknown';
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * GET /health
 * Health check — returns credential configuration status.
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'On-Ground.ai Call Centre Backend',
    timestamp: new Date().toISOString(),
    exotelConfigured: missingEnvVars.length === 0,
    missingConfig: missingEnvVars.length > 0 ? missingEnvVars : undefined,
  });
});

/**
 * POST /api/calls/initiate
 * Initiates a real phone call via Exotel.
 *
 * Request body:
 *   { agentNumber, customerNumber, customerName, agentName?, notes? }
 *
 * Response:
 *   { success, callId, exotelCallSid, status, message }
 */
app.post('/api/calls/initiate', callLimiter, async (req, res) => {
  const { agentNumber, customerNumber, customerName, agentName, notes } = req.body;

  // ── Validate inputs ────────────────────────────────────────────────────────
  if (!agentNumber || !customerNumber) {
    return res.status(400).json({
      success: false,
      error: 'MISSING_NUMBERS',
      message: 'Both agentNumber and customerNumber are required.',
    });
  }

  const agentE164 = normalizeIndianNumber(agentNumber);
  const customerE164 = normalizeIndianNumber(customerNumber);

  if (!agentE164) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_AGENT_NUMBER',
      message: `"${agentNumber}" is not a valid Indian mobile number. Use format: 9876543210 or +919876543210`,
    });
  }

  if (!customerE164) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_CUSTOMER_NUMBER',
      message: `"${customerNumber}" is not a valid Indian mobile number. Use format: 9876543210 or +919876543210`,
    });
  }

  // ── Check credentials ──────────────────────────────────────────────────────
  if (missingEnvVars.length > 0) {
    return res.status(503).json({
      success: false,
      error: 'MISSING_CREDENTIALS',
      message: `Exotel credentials not configured. Missing: ${missingEnvVars.join(', ')}. See server/.env.example`,
    });
  }

  // ── Build internal call record ─────────────────────────────────────────────
  const callId = uuidv4();
  const webhookBase = process.env.WEBHOOK_BASE_URL || `http://localhost:${PORT}`;
  const statusCallbackUrl = `${webhookBase}/api/calls/webhook/${callId}`;

  const callRecord = {
    callId,
    exotelCallSid: null,
    agentNumber: agentE164,
    customerNumber: customerE164,
    customerName: customerName || 'Unknown',
    agentName: agentName || 'Agent',
    notes: notes || '',
    status: 'initiating',
    exotelStatus: null,
    startTime: new Date().toISOString(),
    endTime: null,
    duration: null,
    durationSeconds: 0,
    outcome: null,
    recordingUrl: null,
    webhookEvents: [],
    createdAt: new Date().toISOString(),
  };

  saveCallRecord(callId, callRecord);

  // ── Call Exotel API ────────────────────────────────────────────────────────
  try {
    const exotelPayload = qs.stringify({
      From: agentE164,         // Exotel calls the AGENT first
      To: customerE164,         // Then connects to CUSTOMER
      CallerId: (process.env.EXOTEL_EXOPHONE || '').trim(),  // Your Exotel virtual number
      Record: 'true',           // Record the call
      StatusCallback: statusCallbackUrl,
      StatusCallbackEvents: ['terminal'],
      CustomField: JSON.stringify({ callId, customerName: callRecord.customerName }),
    });

    console.log(`\n📞 Initiating call: Agent ${agentE164} → Customer ${customerE164}`);
    console.log(`   Exotel ExoPhone (CallerId): ${process.env.EXOTEL_EXOPHONE}`);
    console.log(`   Webhook URL: ${statusCallbackUrl}\n`);

    const exotelResponse = await axios.post(
      `${exotelBaseUrl()}/Calls/connect`,
      exotelPayload,
      {
        auth: exotelAuth(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 15000,
      }
    );

    const callData = exotelResponse.data?.Call || exotelResponse.data;
    const exotelSid = callData?.Sid || callData?.call_sid || null;
    const exotelStatus = callData?.Status || 'queued';

    // Update call record
    callRecord.exotelCallSid = exotelSid;
    callRecord.status = mapExotelStatus(exotelStatus);
    callRecord.exotelStatus = exotelStatus;
    saveCallRecord(callId, callRecord);

    console.log(`✅ Exotel call initiated. SID: ${exotelSid}, Status: ${exotelStatus}`);

    return res.status(200).json({
      success: true,
      callId,
      exotelCallSid: exotelSid,
      status: callRecord.status,
      message: `Call initiated. Your phone (${agentE164}) will ring shortly. Answer to connect with ${callRecord.customerName} (${customerE164}).`,
      agentNumber: agentE164,
      customerNumber: customerE164,
      customerName: callRecord.customerName,
    });

  } catch (err) {
    console.error('❌ Exotel API error:', err?.response?.data || err.message);
    deleteCallRecord(callId);

    // ── Map Exotel errors to user-friendly messages ────────────────────────
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
      return res.status(503).json({
        success: false,
        error: 'NETWORK_ERROR',
        message: 'Could not reach Exotel API. Check your internet connection and try again.',
      });
    }

    const exotelErr = err?.response?.data;
    const httpStatus = err?.response?.status;

    if (httpStatus === 401 || httpStatus === 403) {
      return res.status(401).json({
        success: false,
        error: 'AUTH_FAILURE',
        message: 'Exotel authentication failed. Check your API Key and Token in server/.env',
      });
    }

    if (httpStatus === 400) {
      const errMsg = exotelErr?.RestException?.Message || JSON.stringify(exotelErr);
      return res.status(400).json({
        success: false,
        error: 'INVALID_REQUEST',
        message: `Exotel rejected the request: ${errMsg}. Ensure your ExoPhone is configured correctly.`,
      });
    }

    if (httpStatus === 402) {
      return res.status(402).json({
        success: false,
        error: 'INSUFFICIENT_BALANCE',
        message: 'Insufficient Exotel account balance. Please top up your Exotel account.',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'PROVIDER_ERROR',
      message: exotelErr?.RestException?.Message || 'Failed to initiate call via Exotel.',
      detail: exotelErr,
    });
  }
});

/**
 * GET /api/calls/status/:callId
 * Poll current status of a call by our internal callId.
 */
app.get('/api/calls/status/:callId', (req, res) => {
  const { callId } = req.params;
  const record = callStore.get(callId);

  if (!record) {
    return res.status(404).json({
      success: false,
      error: 'NOT_FOUND',
      message: `No call found with ID: ${callId}`,
    });
  }

  res.json({
    success: true,
    callId: record.callId,
    exotelCallSid: record.exotelCallSid,
    status: record.status,
    exotelStatus: record.exotelStatus,
    customerName: record.customerName,
    customerNumber: record.customerNumber,
    agentNumber: record.agentNumber,
    startTime: record.startTime,
    endTime: record.endTime,
    duration: record.duration,
    durationSeconds: record.durationSeconds,
    outcome: record.outcome,
    recordingUrl: record.recordingUrl,
  });
});

/**
 * POST /api/calls/status
 * Update call status manually (used by frontend to sync state).
 */
app.post('/api/calls/status', (req, res) => {
  const { callId, outcome, notes } = req.body;

  if (!callId) {
    return res.status(400).json({ success: false, message: 'callId is required.' });
  }

  const record = callStore.get(callId);
  if (!record) {
    return res.status(404).json({ success: false, message: `Call ${callId} not found.` });
  }

  if (outcome) record.outcome = outcome;
  if (notes) record.notes = notes;
  if (req.body.status) record.status = req.body.status;
  if (req.body.durationSeconds !== undefined) {
    record.durationSeconds = parseInt(req.body.durationSeconds, 10) || 0;
    const mins = Math.floor(record.durationSeconds / 60);
    const secs = record.durationSeconds % 60;
    record.duration = `${mins}m ${secs}s`;
  }
  if (!record.endTime && (record.status === 'completed' || record.status === 'ended')) {
    record.endTime = new Date().toISOString();
  }
  saveCallRecord(callId, record);

  res.json({ success: true, callId, status: record.status, record });
});

/**
 * GET /api/calls/history
 * Returns all call records (most recent first).
 */
app.get('/api/calls/history', (req, res) => {
  const records = Array.from(callStore.values())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    success: true,
    total: records.length,
    calls: records,
  });
});

/**
 * POST /api/calls/hangup
 * Request Exotel to terminate an active call.
 * Note: Exotel v1 does not expose a direct hangup REST endpoint for outbound calls.
 * The call can only be ended by hanging up the physical phone.
 * We mark it locally and document this limitation.
 */
app.post('/api/calls/hangup', async (req, res) => {
  const { callId } = req.body;

  if (!callId) {
    return res.status(400).json({ success: false, message: 'callId is required.' });
  }

  const record = callStore.get(callId);
  if (!record) {
    return res.status(404).json({ success: false, message: `Call ${callId} not found.` });
  }

  // Exotel v1 API does not support programmatic hangup for outbound calls via REST.
  // The agent must hang up the physical phone. We record the intent here.
  record.status = 'ended';
  record.endTime = new Date().toISOString();
  if (!record.outcome) record.outcome = 'Call ended by agent';
  saveCallRecord(callId, record);

  console.log(`📵 Hangup requested for call ${callId}. Agent must hang up physical phone.`);

  res.json({
    success: true,
    callId,
    message: 'Hangup recorded. Please hang up your physical phone to end the call. Exotel v1 does not support remote hangup via REST API.',
    note: 'Call will terminate automatically when either party hangs up the physical phone.',
  });
});

/**
 * POST /api/calls/webhook/:callId
 * Exotel StatusCallback webhook handler.
 * Exotel sends call status updates as x-www-form-urlencoded POST.
 *
 * Fields from Exotel:
 *   CallSid, From, To, Status, Duration, Direction, RecordingUrl, etc.
 */
app.post('/api/calls/webhook/:callId', (req, res) => {
  const { callId } = req.params;
  const webhookData = req.body;

  console.log(`\n📡 Webhook received for callId: ${callId}`);
  console.log('   Payload:', JSON.stringify(webhookData, null, 2));

  const record = callStore.get(callId);
  if (!record) {
    // Could be a duplicate or unknown call; acknowledge gracefully
    console.warn(`   ⚠️ No record found for callId: ${callId}`);
    return res.status(200).send('OK');
  }

  // Extract Exotel webhook fields
  const {
    CallSid,
    Status,
    Duration,
    Direction,
    RecordingUrl,
    DialWhomNumber,
    StartTime,
    EndTime,
  } = webhookData;

  // Idempotency: skip if status hasn't changed
  if (record.exotelCallSid && record.exotelCallSid === CallSid && record.exotelStatus === Status) {
    console.log(`   ℹ️ Duplicate webhook ignored (status already: ${Status})`);
    return res.status(200).send('OK');
  }

  // Update record
  if (CallSid && !record.exotelCallSid) record.exotelCallSid = CallSid;
  record.exotelStatus = Status;
  record.status = mapExotelStatus(Status);

  if (Duration) {
    record.durationSeconds = parseInt(Duration, 10) || 0;
    const mins = Math.floor(record.durationSeconds / 60);
    const secs = record.durationSeconds % 60;
    record.duration = `${mins}m ${secs}s`;
  }

  if (RecordingUrl) record.recordingUrl = RecordingUrl;
  if (EndTime) record.endTime = EndTime;
  if (StartTime && !record.startTime) record.startTime = StartTime;

  // Map terminal statuses to call outcomes
  if (['completed', 'busy', 'failed', 'no-answer', 'canceled'].includes(record.status)) {
    if (!record.outcome) {
      record.outcome = {
        completed: 'Call Completed',
        busy:      'Customer Busy',
        failed:    'Call Failed',
        'no-answer': 'No Answer',
        canceled:  'Call Canceled',
      }[record.status] || record.status;
    }
    record.endTime = record.endTime || new Date().toISOString();
  }

  // Log webhook event (for idempotency checks)
  record.webhookEvents.push({
    receivedAt: new Date().toISOString(),
    status: Status,
    duration: Duration,
  });

  saveCallRecord(callId, record);

  console.log(`   ✅ Call ${callId} updated: status=${record.status}, duration=${record.duration || 'N/A'}`);

  // Exotel expects a 200 OK response
  res.status(200).send('OK');
});

/**
 * POST /api/calls/webhook
 * Generic Exotel webhook (fallback when callId not embedded in URL).
 * Exotel may also POST to a base status callback URL.
 */
app.post('/api/calls/webhook', (req, res) => {
  const webhookData = req.body;
  const customField = webhookData.CustomField;

  console.log('\n📡 Generic webhook received:', JSON.stringify(webhookData, null, 2));

  // Try to extract callId from CustomField
  let callId = null;
  if (customField) {
    try {
      const parsed = JSON.parse(customField);
      callId = parsed.callId;
    } catch {
      callId = customField;
    }
  }

  if (callId) {
    // Forward to per-call handler
    req.params = { callId };
    return app._router.handle(
      { ...req, url: `/api/calls/webhook/${callId}`, params: { callId } },
      res,
      () => res.status(200).send('OK')
    );
  }

  res.status(200).send('OK');
});

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: 'SERVER_ERROR', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'NOT_FOUND', message: `Route ${req.path} not found.` });
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   On-Ground.ai Call Centre Backend            ║');
  console.log('║   Exotel Real Phone Calling Integration       ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`📞 Initiate call: POST http://localhost:${PORT}/api/calls/initiate`);
  console.log(`📜 Call history:  GET  http://localhost:${PORT}/api/calls/history`);
  console.log(`📡 Webhook:       POST http://localhost:${PORT}/api/calls/webhook/:callId\n`);

  if (missingEnvVars.length > 0) {
    console.log(`⚠️  Exotel credentials not configured!`);
    console.log(`   Missing: ${missingEnvVars.join(', ')}`);
    console.log(`   Steps:`);
    console.log(`   1. Copy server/.env.example to server/.env`);
    console.log(`   2. Fill in your Exotel credentials from https://my.exotel.com`);
    console.log(`   3. Restart the server\n`);
  } else {
    console.log(`✅ Exotel credentials configured. Ready to make real calls!\n`);
    console.log(`📞 Exotel Account: ${process.env.EXOTEL_ACCOUNT_SID}`);
    console.log(`📱 ExoPhone (CallerId): ${process.env.EXOTEL_EXOPHONE}\n`);
  }

  const webhookBase = process.env.WEBHOOK_BASE_URL;
  if (!webhookBase || webhookBase.includes('your-webhook-url')) {
    console.log('⚠️  WEBHOOK_BASE_URL not set. Status callbacks will not work for local dev.');
    console.log('   For local testing, install ngrok and run:');
    console.log('   ngrok http 3001');
    console.log('   Then set WEBHOOK_BASE_URL=https://xxxx.ngrok.io in server/.env\n');
  }
});
