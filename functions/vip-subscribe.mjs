import { getStore } from "@netlify/blobs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

export default async (request, context) => {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response("", { status: 204, headers: CORS_HEADERS });
  }

  // Only allow POST
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
  }

  // Parse the request body
  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const { email } = payload;

  // Validate email presence and format
  if (!email || typeof email !== "string") {
    return jsonResponse({ ok: false, error: "Missing email" }, 400);
  }

  const trimmedEmail = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return jsonResponse({ ok: false, error: "Invalid email format" }, 400);
  }

  // Store in Netlify Blobs using email as the key
  try {
    const store = getStore("vip_subscribers");
    await store.setJSON(trimmedEmail, {
      email: trimmedEmail,
      subscribed_at: new Date().toISOString(),
    });
  } catch {
    return jsonResponse(
      { ok: false, error: "Storage is unavailable" },
      500,
    );
  }

  return jsonResponse({ ok: true, message: "Subscribed" }, 200);
};
