/**
 * geminiKeyManager.js
 * ────────────────────────────────────────────────────────────────────────────
 * Manages a rotating pool of Gemini API keys.
 * - Reads GEMINI_KEY_1, GEMINI_KEY_2, GEMINI_KEY_3, ... from environment
 * - When a key hits 429 (quota exhausted), marks it as exhausted for the day
 *   and automatically switches to the next healthy key
 * - If ALL Gemini keys are exhausted, returns null so callers can fall back to Groq
 */

const { GoogleGenAI } = require("@google/genai");

/**
 * ── Shared Model Constant ────────────────────────────────────────────────────
 * Change this ONE value to update the Gemini model used across ALL AI features:
 * Resume Validation, AI Feedback & Questions, Cover Letter Generator, Mock Interview.
 */
const GEMINI_MODEL = "gemini-2.5-flash-lite";

// ── Load all Gemini keys from env ────────────────────────────────────────────
const loadKeys = () => {
  const keys = [];
  // Support GEMINI_KEY_1, GEMINI_KEY_2, GEMINI_KEY_3, GEMINI_KEY_4, GEMINI_KEY_5
  for (let i = 1; i <= 5; i++) {
    const key = process.env[`GEMINI_KEY_${i}`];
    if (key && key.trim()) keys.push(key.trim());
  }
  // Also support legacy GEMINI_API_KEY as a fallback entry
  const legacy = process.env.GEMINI_API_KEY;
  if (legacy && legacy.trim() && !keys.includes(legacy.trim())) {
    keys.push(legacy.trim());
  }
  return keys;
};

// In-memory tracking: which keys are exhausted (resets when server restarts)
const exhaustedKeys = new Set();
let currentKeyIndex = 0;

/**
 * Returns a working GoogleGenAI client, cycling through keys as needed.
 * Returns null if all keys are exhausted.
 */
const getGeminiClient = () => {
  const allKeys = loadKeys();
  if (allKeys.length === 0) return null;

  // Find the next non-exhausted key
  const startIndex = currentKeyIndex;
  do {
    const key = allKeys[currentKeyIndex];
    if (!exhaustedKeys.has(key)) {
      return new GoogleGenAI({ apiKey: key });
    }
    currentKeyIndex = (currentKeyIndex + 1) % allKeys.length;
  } while (currentKeyIndex !== startIndex);

  // All keys exhausted
  console.warn("GeminiKeyManager: All Gemini API keys are quota-exhausted. Falling back to Groq.");
  return null;
};

/**
 * Mark the key currently in use as exhausted (called on 429 error).
 */
const markCurrentKeyExhausted = () => {
  const allKeys = loadKeys();
  if (allKeys.length === 0) return;
  const key = allKeys[currentKeyIndex];
  exhaustedKeys.add(key);
  console.warn(`GeminiKeyManager: Key #${currentKeyIndex + 1} quota exhausted. Rotating to next key.`);
  currentKeyIndex = (currentKeyIndex + 1) % allKeys.length;
};

/**
 * Checks if an error is a quota/auth error that should trigger key rotation.
 */
const isQuotaError = (err) => {
  const msg = err.message || "";
  return (
    msg.includes("429") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("quota") ||
    msg.includes("limit: 0")
  );
};

const isAuthError = (err) => {
  const msg = err.message || "";
  return (
    msg.includes("401") ||
    msg.includes("UNAUTHENTICATED") ||
    msg.includes("API_KEY_INVALID")
  );
};

module.exports = { GEMINI_MODEL, getGeminiClient, markCurrentKeyExhausted, isQuotaError, isAuthError };

