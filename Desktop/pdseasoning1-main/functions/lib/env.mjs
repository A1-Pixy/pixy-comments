/*!
 * functions/lib/env.mjs — Pixy Dust Seasoning
 * Environment variable helpers for Netlify Functions.
 */

/**
 * Reads one or more required environment variables.
 * Returns an object { KEY: value }.
 * Throws an Error listing all missing keys if any are absent.
 */
export function requireEnv(...keys) {
  const missing = keys.filter(k => !process.env[k]);
  if (missing.length) {
    throw new Error("Missing environment variables: " + missing.join(", "));
  }
  return Object.fromEntries(keys.map(k => [k, process.env[k]]));
}

/**
 * Reads an optional environment variable.
 * Returns the value or the provided fallback.
 */
export function optionalEnv(key, fallback = "") {
  return process.env[key] || fallback;
}
