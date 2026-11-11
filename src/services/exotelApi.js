/**
 * Exotel Call API Service
 * 
 * Communicates with the On-Ground.ai backend (Express server) which
 * in turn calls the Exotel API. API keys are NEVER stored in this file.
 *
 * Backend URL can be configured via VITE_BACKEND_URL environment variable.
 * Default: http://localhost:3001
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Initiates a real phone call via Exotel.
 * The agent's phone rings first; after answering, Exotel connects the customer.
 *
 * @param {Object} params
 * @param {string} params.agentNumber    - Agent's mobile number (Indian)
 * @param {string} params.customerNumber - Customer's mobile number (Indian)
 * @param {string} params.customerName   - Customer's display name
 * @param {string} [params.agentName]    - Agent's name
 * @param {string} [params.notes]        - Pre-call notes
 * @returns {Promise<{ success, callId, exotelCallSid, status, message, error? }>}
 */
export async function initiateExotelCall({ agentNumber, customerNumber, customerName, agentName, notes }) {
  const response = await fetch(`${BACKEND_URL}/api/calls/initiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentNumber, customerNumber, customerName, agentName, notes }),
  });

  const data = await response.json();
  return data;
}

/**
 * Polls the current status of an active call.
 *
 * @param {string} callId - Internal call ID returned from initiateExotelCall
 * @returns {Promise<{ success, callId, status, ... }>}
 */
export async function getCallStatus(callId) {
  const response = await fetch(`${BACKEND_URL}/api/calls/status/${callId}`);
  return response.json();
}

/**
 * Fetches the full call history from the backend.
 *
 * @returns {Promise<{ success, total, calls: CallRecord[] }>}
 */
export async function fetchCallHistory() {
  const response = await fetch(`${BACKEND_URL}/api/calls/history`);
  return response.json();
}

/**
 * Signals a hangup request to the backend.
 * Note: Exotel v1 does not support programmatic hangup via REST.
 * The agent must hang up the physical phone.
 *
 * @param {string} callId
 * @returns {Promise<{ success, message, note }>}
 */
export async function requestHangup(callId) {
  const response = await fetch(`${BACKEND_URL}/api/calls/hangup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callId }),
  });
  return response.json();
}

/**
 * Updates call outcome, notes, status, and duration on the backend.
 *
 * @param {string} callId
 * @param {Object} data
 * @param {string} [data.outcome]
 * @param {string} [data.notes]
 * @param {string} [data.status]
 * @param {number} [data.durationSeconds]
 */
export async function updateCallStatus(callId, data = {}) {
  const response = await fetch(`${BACKEND_URL}/api/calls/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callId, ...data }),
  });
  return response.json();
}

/**
 * Checks if the backend server is reachable and Exotel is configured.
 *
 * @returns {Promise<{ ok: boolean, exotelConfigured: boolean, missingConfig?: string[] }>}
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return { ok: false, exotelConfigured: false };
    const data = await response.json();
    return {
      ok: true,
      exotelConfigured: data.exotelConfigured,
      missingConfig: data.missingConfig,
    };
  } catch {
    return { ok: false, exotelConfigured: false };
  }
}

/**
 * Formats a raw phone number for display (adds spaces for readability).
 * @param {string} phone - E.164 or 10-digit number
 * @returns {string}
 */
export function formatPhoneDisplay(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    const n = digits.slice(2);
    return `+91 ${n.slice(0, 5)} ${n.slice(5)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

/**
 * Validates an Indian mobile number.
 * Returns true if valid.
 */
export function isValidIndianMobile(number) {
  const digits = String(number || '').replace(/[\s\-().+]/g, '');
  if (digits.startsWith('91') && digits.length === 12) {
    return /^[6-9]\d{9}$/.test(digits.slice(2));
  }
  if (digits.startsWith('0') && digits.length === 11) {
    return /^[6-9]\d{9}$/.test(digits.slice(1));
  }
  return /^[6-9]\d{9}$/.test(digits);
}
